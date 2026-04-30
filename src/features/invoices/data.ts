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
} as const;

export const invoiceRecords: InvoiceRecord[] = [
  {
    id: "inv-2049",
    invoiceNumber: "INV-2049",
    customerName: "Aurora & Co. Fine Jewelry",
    customerSegment: "Personalizados de alto ticket",
    contactName: "Marina Duarte",
    billingEmail: "financeiro@aurorafinejewelry.com",
    billingPhone: "+55 11 98888-2049",
    billingAddress: "Rua Haddock Lobo, 1310, Sao Paulo - SP",
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
        taxCents: 42500,
        lineTotalCents: 872500,
      },
    ],
    payments: [
      {
        id: "payment-2049-1",
        paymentNumber: "PAY-7781",
        recordedOn: "2026-04-22",
        amountCents: 850000,
        method: "Wire",
        reference: "Entrada de producao",
      },
      {
        id: "payment-2049-2",
        paymentNumber: "PAY-7798",
        recordedOn: "2026-04-29",
        amountCents: 1250000,
        method: "ACH",
        reference: "Complemento parcial",
      },
    ],
  },
  {
    id: "inv-2048",
    invoiceNumber: "INV-2048",
    customerName: "Carvalho Atelier",
    customerSegment: "Reparos e manutenção",
    contactName: "Carla Carvalho",
    billingEmail: "carla@carvalhoatelier.com",
    billingPhone: "+55 21 97777-2048",
    billingAddress: "Av. Ataulfo de Paiva, 520, Rio de Janeiro - RJ",
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
        unitPriceCents: 600000,
        taxCents: 45000,
        lineTotalCents: 645000,
      },
    ],
    payments: [],
  },
  {
    id: "inv-2047",
    invoiceNumber: "INV-2047",
    customerName: "Northline Wholesale Jewelers",
    customerSegment: "Atacado recorrente",
    contactName: "James Whitmore",
    billingEmail: "ap@northlinewholesale.com",
    billingPhone: "+1 212 555 2047",
    billingAddress: "516 Madison Ave, New York - NY",
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
        unitPriceCents: 245000,
        taxCents: 247500,
        lineTotalCents: 3187500,
      },
    ],
    payments: [
      {
        id: "payment-2047-1",
        paymentNumber: "PAY-7760",
        recordedOn: "2026-04-19",
        amountCents: 1200000,
        method: "Wire",
        reference: "Deposito parcial lote abril",
      },
    ],
  },
  {
    id: "inv-2046",
    invoiceNumber: "INV-2046",
    customerName: "Diamond Crest Retail",
    customerSegment: "Varejo multiloja",
    contactName: "Elisa Prado",
    billingEmail: "compras@diamondcrestretail.com",
    billingPhone: "+55 31 96666-2046",
    billingAddress: "Av. do Contorno, 8100, Belo Horizonte - MG",
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
        taxCents: 132000,
        lineTotalCents: 1452000,
      },
    ],
    payments: [
      {
        id: "payment-2046-1",
        paymentNumber: "PAY-7745",
        recordedOn: "2026-04-15",
        amountCents: 1452000,
        method: "Credit Card",
        reference: "Portal corporate",
      },
    ],
  },
  {
    id: "inv-2045",
    invoiceNumber: "INV-2045",
    customerName: "Helena Martins Bridal",
    customerSegment: "Noivas e joias autorais",
    contactName: "Helena Martins",
    billingEmail: "helena@martinsbridal.com",
    billingPhone: "+55 51 95555-2045",
    billingAddress: "Rua Padre Chagas, 178, Porto Alegre - RS",
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
        unitPriceCents: 2000000,
        taxCents: 210000,
        lineTotalCents: 2210000,
      },
    ],
    payments: [
      {
        id: "payment-2045-1",
        paymentNumber: "PAY-7708",
        recordedOn: "2026-04-02",
        amountCents: 350000,
        method: "Pix",
        reference: "Sinal inicial",
      },
      {
        id: "payment-2045-2",
        paymentNumber: "PAY-7731",
        recordedOn: "2026-04-09",
        amountCents: 250000,
        method: "Pix",
        reference: "Complemento atelier",
      },
    ],
  },
  {
    id: "inv-2044",
    invoiceNumber: "INV-2044",
    customerName: "Aurora & Co. Fine Jewelry",
    customerSegment: "Atacado premium",
    contactName: "Marina Duarte",
    billingEmail: "financeiro@aurorafinejewelry.com",
    billingPhone: "+55 11 98888-2044",
    billingAddress: "Rua Haddock Lobo, 1310, Sao Paulo - SP",
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
        unitPriceCents: 167000,
        taxCents: 244500,
        lineTotalCents: 2749500,
      },
    ],
    payments: [
      {
        id: "payment-2044-1",
        paymentNumber: "PAY-7688",
        recordedOn: "2026-03-24",
        amountCents: 954000,
        method: "Wire",
        reference: "Primeira remessa",
      },
      {
        id: "payment-2044-2",
        paymentNumber: "PAY-7724",
        recordedOn: "2026-04-11",
        amountCents: 500000,
        method: "ACH",
        reference: "Complemento parcial",
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

export function getInvoiceById(id: string) {
  return invoiceRecords.find((invoice) => invoice.id === id);
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
