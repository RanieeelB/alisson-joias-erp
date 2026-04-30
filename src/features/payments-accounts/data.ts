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
  settled: "Concluido",
  pending_deposit: "Pendente",
  credit: "Credito",
};

export const payableStatusLabels: Record<PayableStatus, string> = {
  pending: "Pendente",
  partial: "Parcial",
  paid: "Pago",
  overdue: "Atrasado",
};

export const agingBucketLabels: Record<AgingBucket, string> = {
  current: "A vencer",
  "1-30": "1 - 30 dias",
  "31-60": "31 - 60 dias",
  "61-90": "61 - 90 dias",
  "90+": "+ 90 dias",
};

export const paymentRecords: PaymentRecord[] = [
  {
    id: "pay-7806",
    paymentNumber: "PAY-7806",
    invoiceNumber: "INV-2049",
    customerName: "Aurora & Co. Fine Jewelry",
    date: "2026-04-29",
    amountCents: 1850000,
    method: "Pix",
    reference: "PIX 284710",
    status: "settled",
  },
  {
    id: "pay-7805",
    paymentNumber: "PAY-7805",
    invoiceNumber: "INV-2047",
    customerName: "Northline Wholesale Jewelers",
    date: "2026-04-28",
    amountCents: 980000,
    method: "Wire",
    reference: "WIRE 55211-3",
    status: "pending_deposit",
  },
  {
    id: "pay-7804",
    paymentNumber: "PAY-7804",
    invoiceNumber: "INV-2044",
    customerName: "Aurora & Co. Fine Jewelry",
    date: "2026-04-25",
    amountCents: 1250000,
    method: "ACH",
    reference: "ACH 60000.001",
    status: "settled",
  },
  {
    id: "pay-7803",
    paymentNumber: "PAY-7803",
    invoiceNumber: "INV-2046",
    customerName: "Diamond Crest Retail",
    date: "2026-04-23",
    amountCents: 610000,
    method: "Credit Card",
    reference: "Visa **** 2589",
    status: "credit",
    creditCents: 610000,
  },
  {
    id: "pay-7802",
    paymentNumber: "PAY-7802",
    invoiceNumber: "INV-2045",
    customerName: "Helena Martins Bridal",
    date: "2026-04-20",
    amountCents: 2000000,
    method: "Check",
    reference: "CHK 000782",
    status: "pending_deposit",
  },
  {
    id: "pay-7801",
    paymentNumber: "PAY-7801",
    invoiceNumber: "INV-2048",
    customerName: "Carvalho Atelier",
    date: "2026-04-18",
    amountCents: 605000,
    method: "Pix",
    reference: "PIX 193872",
    status: "settled",
  },
];

export const openReceivableInvoices: ReceivableInvoice[] = [
  {
    id: "ar-2049",
    invoiceNumber: "INV-2049",
    customerName: "Aurora & Co. Fine Jewelry",
    dueOn: "2026-05-21",
    balanceCents: 2185000,
    status: "partial",
  },
  {
    id: "ar-2047",
    invoiceNumber: "INV-2047",
    customerName: "Northline Wholesale Jewelers",
    dueOn: "2026-04-27",
    balanceCents: 1987500,
    status: "overdue",
  },
  {
    id: "ar-2045",
    invoiceNumber: "INV-2045",
    customerName: "Helena Martins Bridal",
    dueOn: "2026-04-13",
    balanceCents: 1610000,
    status: "overdue",
  },
  {
    id: "ar-2039",
    invoiceNumber: "INV-2039",
    customerName: "Carvalho Atelier",
    dueOn: "2026-03-16",
    balanceCents: 1580000,
    status: "overdue",
  },
  {
    id: "ar-2034",
    invoiceNumber: "INV-2034",
    customerName: "Brilliance Boutiques",
    dueOn: "2026-02-10",
    balanceCents: 905000,
    status: "overdue",
  },
  {
    id: "ar-2028",
    invoiceNumber: "INV-2028",
    customerName: "Lu'Mar Joias",
    dueOn: "2026-01-15",
    balanceCents: 430000,
    status: "overdue",
  },
];

export const customerReceivableBalances: CustomerReceivableBalance[] = [
  {
    customerName: "Aurora & Co. Fine Jewelry",
    currentCents: 3080000,
    overdueCents: 1200000,
    creditAvailableCents: 610000,
  },
  {
    customerName: "Northline Wholesale Jewelers",
    currentCents: 0,
    overdueCents: 1987500,
    creditAvailableCents: 0,
  },
  {
    customerName: "Carvalho Atelier",
    currentCents: 0,
    overdueCents: 1225000,
    creditAvailableCents: 0,
  },
  {
    customerName: "Helena Martins Bridal",
    currentCents: 0,
    overdueCents: 905000,
    creditAvailableCents: 0,
  },
  {
    customerName: "Lu'Mar Joias",
    currentCents: 0,
    overdueCents: 500000,
    creditAvailableCents: 0,
  },
];

export const accountsPayableRecords: AccountsPayableRecord[] = [
  {
    id: "ap-1258",
    apNumber: "AP-001258",
    vendorName: "GoldSource Refinery",
    category: "Raw Materials",
    date: "2026-04-19",
    dueOn: "2026-05-03",
    totalCents: 2210000,
    paidCents: 0,
    balanceCents: 2210000,
    status: "pending",
  },
  {
    id: "ap-1257",
    apNumber: "AP-001257",
    vendorName: "GemCert Labs",
    category: "Certification",
    date: "2026-04-18",
    dueOn: "2026-05-05",
    totalCents: 1120000,
    paidCents: 300000,
    balanceCents: 820000,
    status: "partial",
    paidOn: "2026-04-24",
  },
  {
    id: "ap-1256",
    apNumber: "AP-001256",
    vendorName: "NovaStone Components",
    category: "Components",
    date: "2026-04-16",
    dueOn: "2026-05-07",
    totalCents: 1285000,
    paidCents: 0,
    balanceCents: 1285000,
    status: "pending",
  },
  {
    id: "ap-1255",
    apNumber: "AP-001255",
    vendorName: "BrightBench Services",
    category: "Services",
    date: "2026-04-10",
    dueOn: "2026-04-22",
    totalCents: 1595000,
    paidCents: 1595000,
    balanceCents: 0,
    status: "paid",
    paidOn: "2026-04-17",
  },
  {
    id: "ap-1254",
    apNumber: "AP-001254",
    vendorName: "GoldSource Refinery",
    category: "Raw Materials",
    date: "2026-03-28",
    dueOn: "2026-04-20",
    totalCents: 1145000,
    paidCents: 0,
    balanceCents: 1145000,
    status: "overdue",
  },
  {
    id: "ap-1253",
    apNumber: "AP-001253",
    vendorName: "GemCert Labs",
    category: "Certification",
    date: "2026-03-21",
    dueOn: "2026-05-01",
    totalCents: 1263000,
    paidCents: 0,
    balanceCents: 1263000,
    status: "pending",
  },
];

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
