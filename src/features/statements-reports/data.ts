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
  revenue_analysis: "Análise de Receita",
  cash_flow: "Fluxo de Caixa",
  profit_loss: "Lucros e Perdas",
  tax_summary: "Resumo de Impostos",
};

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
