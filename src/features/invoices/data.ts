import type {
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

export const invoiceRecords: InvoiceRecord[] = [
  {
    id: "inv-2049",
    invoiceNumber: "INV-2049",
    customerName: "Aurora & Co. Fine Jewelry",
    customerSegment: "Personalizados de alto ticket",
    orderType: "Pedido Personalizado",
    issuedOn: "2026-04-21",
    dueOn: "2026-05-21",
    totalCents: 4285000,
    paidCents: 2100000,
    balanceCents: 2185000,
    status: "partial",
    quickbooksSyncStatus: "pending",
    paymentTerms: "30 dias",
    lineItems: [
      {
        id: "line-2049-1",
        description: "Anel solitário 18k com montagem sob medida",
        quantity: 1,
        unitPriceCents: 3250000,
        taxCents: 162500,
        lineTotalCents: 3412500,
      },
      {
        id: "line-2049-2",
        description: "Certificação e acabamento premium",
        quantity: 1,
        unitPriceCents: 830000,
        taxCents: 41500,
        lineTotalCents: 871500,
      },
    ],
  },
  {
    id: "inv-2048",
    invoiceNumber: "INV-2048",
    customerName: "Carvalho Atelier",
    customerSegment: "Reparos e manutenção",
    orderType: "Reparo",
    issuedOn: "2026-04-18",
    dueOn: "2026-05-03",
    totalCents: 645000,
    paidCents: 0,
    balanceCents: 645000,
    status: "pending",
    quickbooksSyncStatus: "synced",
    paymentTerms: "15 dias",
    lineItems: [
      {
        id: "line-2048-1",
        description: "Reposição de garra e polimento de aliança",
        quantity: 1,
        unitPriceCents: 540000,
        taxCents: 27000,
        lineTotalCents: 567000,
      },
    ],
  },
  {
    id: "inv-2047",
    invoiceNumber: "INV-2047",
    customerName: "Northline Wholesale Jewelers",
    customerSegment: "Atacado recorrente",
    orderType: "Atacado",
    issuedOn: "2026-04-12",
    dueOn: "2026-04-27",
    totalCents: 3187500,
    paidCents: 1200000,
    balanceCents: 1987500,
    status: "overdue",
    quickbooksSyncStatus: "pending",
    paymentTerms: "15 dias",
    lineItems: [
      {
        id: "line-2047-1",
        description: "Lote com 12 pares de brincos em ouro amarelo",
        quantity: 12,
        unitPriceCents: 215000,
        taxCents: 10750,
        lineTotalCents: 2709000,
      },
    ],
  },
  {
    id: "inv-2046",
    invoiceNumber: "INV-2046",
    customerName: "Diamond Crest Retail",
    customerSegment: "Varejo multiloja",
    orderType: "Varejo",
    issuedOn: "2026-04-08",
    dueOn: "2026-04-23",
    totalCents: 1452000,
    paidCents: 1452000,
    balanceCents: 0,
    status: "paid",
    quickbooksSyncStatus: "synced",
    paymentTerms: "15 dias",
    lineItems: [
      {
        id: "line-2046-1",
        description: "Reposição de mostruário com pulseiras finas",
        quantity: 8,
        unitPriceCents: 165000,
        taxCents: 8250,
        lineTotalCents: 1386000,
      },
    ],
  },
  {
    id: "inv-2045",
    invoiceNumber: "INV-2045",
    customerName: "Helena Martins Bridal",
    customerSegment: "Noivas e joias autorais",
    orderType: "Pedido Personalizado",
    issuedOn: "2026-03-29",
    dueOn: "2026-04-13",
    totalCents: 2210000,
    paidCents: 600000,
    balanceCents: 1610000,
    status: "overdue",
    quickbooksSyncStatus: "failed",
    paymentTerms: "15 dias",
    lineItems: [
      {
        id: "line-2045-1",
        description: "Meia aliança com diamantes e gravação interna",
        quantity: 1,
        unitPriceCents: 1840000,
        taxCents: 92000,
        lineTotalCents: 1932000,
      },
    ],
  },
  {
    id: "inv-2044",
    invoiceNumber: "INV-2044",
    customerName: "Aurora & Co. Fine Jewelry",
    customerSegment: "Atacado premium",
    orderType: "Atacado",
    issuedOn: "2026-03-18",
    dueOn: "2026-04-17",
    totalCents: 2749500,
    paidCents: 1454000,
    balanceCents: 1295500,
    status: "partial",
    quickbooksSyncStatus: "synced",
    paymentTerms: "30 dias",
    lineItems: [
      {
        id: "line-2044-1",
        description: "Lote de correntes italianas com fechos reforçados",
        quantity: 15,
        unitPriceCents: 158000,
        taxCents: 7900,
        lineTotalCents: 2488500,
      },
    ],
  },
];

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
