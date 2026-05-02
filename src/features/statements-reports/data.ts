import type {
  CashFlowRow,
  CustomerStatement,
  MonthlyReportRow,
  ProfitLossReport,
  ReportType,
  TaxQuarterCard,
} from "./types";

/**
 * Returns the default date range for statements: first day of current month
 * through today (or end of month if we can't determine).
 */
export function getDefaultDateRange(): { startDate: string; endDate: string } {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return { startDate: `${y}-${m}-01`, endDate: `${y}-${m}-${d}` };
}

/**
 * Filters statements whose `lastInvoiceDate` falls within the given
 * [startDate, endDate] range (inclusive, ISO date strings).
 */
export function filterStatementsByDateRange(
  statements: CustomerStatement[],
  startDate: string,
  endDate: string,
): CustomerStatement[] {
  return statements.filter((s) => s.lastInvoiceDate >= startDate && s.lastInvoiceDate <= endDate);
}

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
    marginPercent:
      latest.revenueCents > 0
        ? roundOne((latest.profitCents / latest.revenueCents) * 100)
        : 0,
    revenueTrendPercent: previous
      ? previous.revenueCents > 0
        ? roundOne(
          ((latest.revenueCents - previous.revenueCents) /
            previous.revenueCents) *
            100,
          )
        : latest.revenueCents > 0
          ? 100
          : 0
      : 0,
  };
}

export function buildRevenueChartColumns(rows: MonthlyReportRow[]) {
  const maxValue = getMaxChartValue(rows);

  return rows.map((row) => ({
    month: row.month,
    revenueHeightPercent: scalePercent(row.revenueCents, maxValue),
    expensesHeightPercent: scalePercent(row.expensesCents, maxValue),
    profitHeightPercent: scalePercent(row.profitCents, maxValue),
  }));
}

export function buildRevenueChartAxis(rows: MonthlyReportRow[], steps = 4) {
  const maxValue = getMaxChartValue(rows);

  return Array.from({ length: steps + 1 }, (_, index) => {
    const value = Math.round((maxValue * (steps - index)) / steps);

    return {
      value,
      ratio: steps === 0 ? 0 : index / steps,
    };
  });
}

function getMaxChartValue(rows: MonthlyReportRow[]) {
  return rows.reduce((currentMax, row) => {
    return Math.max(
      currentMax,
      row.revenueCents,
      row.expensesCents,
      row.profitCents,
    );
  }, 0);
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

function scalePercent(value: number, maxValue: number) {
  if (maxValue <= 0 || value <= 0) return 0;

  return Math.round((value / maxValue) * 100);
}
