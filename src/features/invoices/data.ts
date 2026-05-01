import type {
  InvoiceDetailSummary,
  InvoiceRecord,
  InvoiceStatusFilter,
  InvoiceSummary,
} from "@/features/invoices/types";

export const invoiceStatusLabels: Record<InvoiceStatusFilter, string> = {
  all: "Todos",
  pending: "Pendentes",
  partial: "Parciais",
  paid: "Pagas",
  overdue: "Em atraso",
};

export const quickbooksSyncLabels = {
  synced: "QB synced",
  pending: "QB pending",
  failed: "QB failed",
  not_synced: "QB não sincronizado",
} as const;

export function filterInvoices(
  invoices: InvoiceRecord[],
  filters: { status: InvoiceStatusFilter; query: string },
) {
  const query = filters.query.trim().toLocaleLowerCase("pt-BR");

  return invoices.filter((invoice) => {
    const matchesStatus =
      filters.status === "all" || invoice.status === filters.status;
    const matchesQuery =
      query.length === 0 ||
      invoice.invoiceNumber.toLocaleLowerCase("pt-BR").includes(query) ||
      invoice.customerName.toLocaleLowerCase("pt-BR").includes(query);

    return matchesStatus && matchesQuery;
  });
}

export function summarizeInvoices(invoices: InvoiceRecord[]): InvoiceSummary {
  return invoices.reduce(
    (summary, invoice) => {
      summary.totalInvoicedCents += invoice.totalCents;
      summary.collectedCents += invoice.paidCents;
      summary.outstandingCents += invoice.balanceCents;

      if (invoice.status === "overdue") {
        summary.overdueCents += invoice.balanceCents;
      }

      return summary;
    },
    {
      totalInvoicedCents: 0,
      collectedCents: 0,
      outstandingCents: 0,
      overdueCents: 0,
    },
  );
}

export function summarizeInvoiceDetail(
  invoice: InvoiceRecord,
): InvoiceDetailSummary {
  const subtotalCents = invoice.lineItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPriceCents,
    0,
  );
  const taxCents = invoice.lineItems.reduce((sum, item) => sum + item.taxCents, 0);
  const totalCents = invoice.lineItems.reduce(
    (sum, item) => sum + item.lineTotalCents,
    0,
  );
  const paidCents = invoice.payments.reduce(
    (sum, payment) => sum + payment.amountCents,
    0,
  );

  return {
    subtotalCents,
    taxCents,
    totalCents,
    paidCents,
    balanceCents: totalCents - paidCents,
  };
}
