export type StatementAction = "view" | "print" | "email";

export type CustomerStatement = {
  id: string;
  customerName: string;
  invoiceCount: number;
  balanceCents: number;
  lastInvoiceDate: string;
  statementNumber: string;
  segment: "Custom Orders" | "Repairs" | "Wholesale" | "Retail";
  actions: StatementAction[];
};

export type MonthlyReportRow = {
  month: string;
  revenueCents: number;
  expensesCents: number;
  profitCents: number;
};

export type CashFlowRow = {
  month: string;
  inflowsCents: number;
  outflowsCents: number;
};

export type ProfitLossReport = {
  revenueCents: number;
  cogsCents: number;
  operatingExpensesCents: number;
};

export type TaxQuarterCard = {
  quarter: string;
  collectedCents: number;
  payableCents: number;
  status: "filed" | "due" | "projected";
};

export type ReportType =
  | "revenue_analysis"
  | "cash_flow"
  | "profit_loss"
  | "tax_summary";
