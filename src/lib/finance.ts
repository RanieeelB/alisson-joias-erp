export type InvoiceStatus = "pending" | "partial" | "paid" | "overdue";

export type AgingBucket = "current" | "1-30" | "31-60" | "61-90" | "90+";

export type DashboardInvoice = {
  totalCents: number;
  paidCents: number;
  balanceCents: number;
  dueDate: string;
  date: string;
  status: InvoiceStatus;
};

const brlFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const compactNumberFormatter = new Intl.NumberFormat("pt-BR", {
  maximumFractionDigits: 1,
  minimumFractionDigits: 0,
});

export function formatMoney(cents: number) {
  return brlFormatter.format(cents / 100).replace(/\u00A0/g, " ");
}

export function formatCompactMoney(cents: number) {
  const amount = cents / 100;

  if (Math.abs(amount) < 1000) {
    return formatMoney(cents);
  }

  return `R$ ${compactNumberFormatter.format(amount / 1000)} mil`;
}

export function getAgingBucket(
  dueDate: string,
  asOf: Date = new Date(),
): AgingBucket {
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

export function summarizeDashboard(
  invoices: DashboardInvoice[],
  asOf: Date = new Date(),
) {
  const currentMonth = asOf.getUTCMonth();
  const currentYear = asOf.getUTCFullYear();

  return invoices.reduce(
    (summary, invoice) => {
      const invoiceDate = new Date(`${invoice.date}T00:00:00.000Z`);

      summary.totalRevenueCents += invoice.totalCents;
      summary.arOutstandingCents += Math.max(invoice.balanceCents, 0);

      if (
        invoiceDate.getUTCFullYear() === currentYear &&
        invoiceDate.getUTCMonth() === currentMonth
      ) {
        summary.invoicesThisMonth += 1;
      }

      if (invoice.status === "overdue") {
        summary.overdueInvoices += 1;
      }

      return summary;
    },
    {
      totalRevenueCents: 0,
      arOutstandingCents: 0,
      invoicesThisMonth: 0,
      overdueInvoices: 0,
    },
  );
}
