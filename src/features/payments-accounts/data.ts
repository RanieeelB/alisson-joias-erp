import type {
  AccountsPayableRecord,
  AccountsPayableSummary,
  CustomerReceivableBalance,
  CustomerReceivableBalanceScale,
  PaymentRecord,
  PaymentStatus,
  PaymentSummary,
  PayableStatus,
  ReceivableAgingSummary,
  ReceivableInvoice,
} from "@/features/payments-accounts/types";
import type { AgingBucket } from "@/lib/finance";

export const paymentStatusLabels: Record<PaymentStatus, string> = {
  settled: "Concluído",
  pending_deposit: "Pendente",
  credit: "Crédito",
};

export const payableStatusLabels: Record<PayableStatus, string> = {
  pending: "Pendente",
  partial: "Parcial",
  paid: "Pago",
  overdue: "Em atraso",
};

export const agingBucketLabels: Record<AgingBucket, string> = {
  current: "A vencer",
  "1-30": "1 - 30 dias",
  "31-60": "31 - 60 dias",
  "61-90": "61 - 90 dias",
  "90+": "+ 90 dias",
};

export function summarizePayments(
  payments: PaymentRecord[],
  asOf: Date = new Date(),
): PaymentSummary {
  const month = asOf.getUTCMonth();
  const year = asOf.getUTCFullYear();

  return payments.reduce(
    (summary, payment) => {
      const paymentDate = new Date(`${payment.date}T00:00:00.000Z`);
      const isCurrentMonth =
        paymentDate.getUTCMonth() === month &&
        paymentDate.getUTCFullYear() === year;

      if (isCurrentMonth) {
        summary.collectedThisMonthCents += payment.amountCents;
      }

      if (payment.status === "pending_deposit") {
        summary.pendingDepositsCents += payment.amountCents;
      }

      summary.creditCents += payment.creditCents ?? 0;

      return summary;
    },
    {
      collectedThisMonthCents: 0,
      pendingDepositsCents: 0,
      creditCents: 0,
    },
  );
}

export function summarizeReceivableAging(
  invoices: ReceivableInvoice[],
  asOf: Date = new Date(),
): ReceivableAgingSummary {
  return invoices.reduce(
    (summary, invoice) => {
      summary[getAgingBucket(invoice.dueOn, asOf)] += invoice.balanceCents;
      return summary;
    },
    {
      current: 0,
      "1-30": 0,
      "31-60": 0,
      "61-90": 0,
      "90+": 0,
    },
  );
}

export function getReceivableBalanceScale(
  balances: CustomerReceivableBalance[],
): CustomerReceivableBalanceScale[] {
  const sortedBalances = [...balances].sort(
    (a, b) => getCustomerBalance(b) - getCustomerBalance(a),
  );
  const maxBalance = Math.max(...sortedBalances.map(getCustomerBalance), 1);

  return sortedBalances.map((balance) => ({
    ...balance,
    progress: Math.round((getCustomerBalance(balance) / maxBalance) * 100),
  }));
}

export function summarizeAccountsPayable(
  records: AccountsPayableRecord[],
  asOf: Date = new Date(),
): AccountsPayableSummary {
  const month = asOf.getUTCMonth();
  const year = asOf.getUTCFullYear();

  return records.reduce(
    (summary, record) => {
      summary.totalPayableCents += record.balanceCents;

      if (record.status === "overdue") {
        summary.overdueCents += record.balanceCents;
      }

      if (record.paidOn) {
        const paidDate = new Date(`${record.paidOn}T00:00:00.000Z`);

        if (
          paidDate.getUTCMonth() === month &&
          paidDate.getUTCFullYear() === year
        ) {
          summary.paidThisMonthCents += record.paidCents;
        }
      }

      return summary;
    },
    {
      totalPayableCents: 0,
      paidThisMonthCents: 0,
      overdueCents: 0,
    },
  );
}

function getCustomerBalance(balance: CustomerReceivableBalance) {
  return balance.currentCents + balance.overdueCents;
}

function getAgingBucket(dueDate: string, asOf: Date): AgingBucket {
  const due = new Date(`${dueDate}T00:00:00.000Z`);
  const current = new Date(
    Date.UTC(asOf.getUTCFullYear(), asOf.getUTCMonth(), asOf.getUTCDate()),
  );
  const daysPastDue = Math.floor(
    (current.getTime() - due.getTime()) / 86_400_000,
  );

  if (daysPastDue <= 0) return "current";
  if (daysPastDue <= 30) return "1-30";
  if (daysPastDue <= 60) return "31-60";
  if (daysPastDue <= 90) return "61-90";

  return "90+";
}
