import type {
  CashFlowRow,
  CustomerStatement,
  MonthlyReportRow,
  ProfitLossReport,
  ReportType,
  TaxQuarterCard,
} from "./types";

export const statementPeriod = {
  label: "01/05/2026 - 31/05/2026",
  startDate: "2026-05-01",
  endDate: "2026-05-31",
};

export const reportTypeLabels: Record<ReportType, string> = {
  revenue_analysis: "Revenue Analysis",
  cash_flow: "Cash Flow",
  profit_loss: "Profit & Loss",
  tax_summary: "Tax Summary",
};

export const customerStatements: CustomerStatement[] = [
  {
    id: "statement-aurora",
    customerName: "Aurora & Co. Fine Jewelry",
    invoiceCount: 12,
    balanceCents: 12584000,
    lastInvoiceDate: "2026-05-28",
    statementNumber: "STM-2026-051",
    segment: "Custom Orders",
    actions: ["view", "print", "email"],
  },
  {
    id: "statement-carvalho",
    customerName: "Carvalho Atelier",
    invoiceCount: 8,
    balanceCents: 4832000,
    lastInvoiceDate: "2026-05-24",
    statementNumber: "STM-2026-052",
    segment: "Repairs",
    actions: ["view", "print", "email"],
  },
  {
    id: "statement-northline",
    customerName: "Northline Wholesale Jewelers",
    invoiceCount: 15,
    balanceCents: 21056000,
    lastInvoiceDate: "2026-05-29",
    statementNumber: "STM-2026-053",
    segment: "Wholesale",
    actions: ["view", "print", "email"],
  },
  {
    id: "statement-diamond-crest",
    customerName: "Diamond Crest Retail",
    invoiceCount: 10,
    balanceCents: -2245000,
    lastInvoiceDate: "2026-05-19",
    statementNumber: "STM-2026-054",
    segment: "Retail",
    actions: ["view", "print", "email"],
  },
  {
    id: "statement-helena",
    customerName: "Helena Martins Bridal",
    invoiceCount: 7,
    balanceCents: 1678000,
    lastInvoiceDate: "2026-05-16",
    statementNumber: "STM-2026-055",
    segment: "Custom Orders",
    actions: ["view", "print", "email"],
  },
];

export const monthlyReportRows: MonthlyReportRow[] = [
  {
    month: "Dez/2025",
    revenueCents: 198245000,
    expensesCents: 82340000,
    profitCents: 115905000,
  },
  {
    month: "Jan/2026",
    revenueCents: 213430000,
    expensesCents: 87612000,
    profitCents: 125818000,
  },
  {
    month: "Fev/2026",
    revenueCents: 232180000,
    expensesCents: 101245000,
    profitCents: 130935000,
  },
  {
    month: "Mar/2026",
    revenueCents: 245890000,
    expensesCents: 107723000,
    profitCents: 138167000,
  },
  {
    month: "Abr/2026",
    revenueCents: 239875000,
    expensesCents: 106490000,
    profitCents: 133385000,
  },
  {
    month: "Mai/2026",
    revenueCents: 284245000,
    expensesCents: 116523000,
    profitCents: 167722000,
  },
];

export const cashFlowRows: CashFlowRow[] = [
  {
    month: "Mai/2026",
    inflowsCents: 128540000,
    outflowsCents: 29978000,
  },
];

export const profitLossReport: ProfitLossReport = {
  revenueCents: 284245000,
  cogsCents: 72430000,
  operatingExpensesCents: 44093000,
};

export const taxQuarterCards: TaxQuarterCard[] = [
  {
    quarter: "Q1 2026",
    collectedCents: 7184500,
    payableCents: 0,
    status: "filed",
  },
  {
    quarter: "Q2 2026",
    collectedCents: 9356000,
    payableCents: 3124500,
    status: "due",
  },
  {
    quarter: "Q3 2026",
    collectedCents: 0,
    payableCents: 0,
    status: "projected",
  },
];

export function summarizeStatements(statements: CustomerStatement[]) {
  return statements.reduce(
    (summary, statement) => {
      summary.totalCustomers += 1;
      summary.totalInvoices += statement.invoiceCount;
      summary.netBalanceCents += statement.balanceCents;
      summary.outstandingCents += Math.max(statement.balanceCents, 0);
      summary.creditCents += Math.max(statement.balanceCents * -1, 0);

      return summary;
    },
    {
      totalCustomers: 0,
      totalInvoices: 0,
      netBalanceCents: 0,
      outstandingCents: 0,
      creditCents: 0,
    },
  );
}

export function summarizeRevenueAnalysis(rows: MonthlyReportRow[]) {
  const latest = rows.at(-1);
  const previous = rows.at(-2);

  if (!latest) {
    return {
      revenueCents: 0,
      expensesCents: 0,
      profitCents: 0,
      marginPercent: 0,
      revenueTrendPercent: 0,
    };
  }

  return {
    revenueCents: latest.revenueCents,
    expensesCents: latest.expensesCents,
    profitCents: latest.profitCents,
    marginPercent: roundOne((latest.profitCents / latest.revenueCents) * 100),
    revenueTrendPercent: previous
      ? roundOne(
          ((latest.revenueCents - previous.revenueCents) /
            previous.revenueCents) *
            100,
        )
      : 0,
  };
}

export function summarizeCashFlow(rows: CashFlowRow[]) {
  return rows.reduce(
    (summary, row) => {
      summary.inflowsCents += row.inflowsCents;
      summary.outflowsCents += row.outflowsCents;
      summary.netCashFlowCents += row.inflowsCents - row.outflowsCents;

      return summary;
    },
    {
      inflowsCents: 0,
      outflowsCents: 0,
      netCashFlowCents: 0,
    },
  );
}

export function summarizeProfitLoss(report: ProfitLossReport) {
  const expensesCents = report.cogsCents + report.operatingExpensesCents;

  return {
    revenueCents: report.revenueCents,
    cogsCents: report.cogsCents,
    operatingExpensesCents: report.operatingExpensesCents,
    expensesCents,
    netProfitCents: report.revenueCents - expensesCents,
  };
}

export function summarizeTaxSummary(cards: TaxQuarterCard[]) {
  return cards.reduce(
    (summary, card) => {
      summary.collectedCents += card.collectedCents;
      summary.payableCents += card.payableCents;

      return summary;
    },
    {
      collectedCents: 0,
      payableCents: 0,
    },
  );
}

function roundOne(value: number) {
  return Math.round(value * 10) / 10;
}
