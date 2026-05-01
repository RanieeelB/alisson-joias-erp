import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

const testRequire = createRequire(import.meta.url);
const projectRoot = process.cwd();

function loadTsModule(sourcePath) {
  assert.equal(existsSync(sourcePath), true, `expected ${sourcePath} to exist`);

  const source = readFileSync(sourcePath, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      esModuleInterop: true,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;

  const sandbox = {
    module: { exports: {} },
    require: testRequire,
  };
  sandbox.exports = sandbox.module.exports;

  vm.runInNewContext(output, sandbox, { filename: sourcePath });

  return sandbox.module.exports;
}

function readProjectFile(path) {
  const fullPath = join(projectRoot, path);

  assert.equal(existsSync(fullPath), true, `expected ${path} to exist`);

  return readFileSync(fullPath, "utf8");
}

const customerStatements = [
  { invoiceCount: 12, balanceCents: 12584000 },
  { invoiceCount: 8, balanceCents: 4832000 },
  { invoiceCount: 15, balanceCents: 21056000 },
  { invoiceCount: 10, balanceCents: -2245000 },
  { invoiceCount: 7, balanceCents: 1678000 },
];

const monthlyReportRows = [
  { revenueCents: 198245000, expensesCents: 82340000, profitCents: 115905000 },
  { revenueCents: 213430000, expensesCents: 87612000, profitCents: 125818000 },
  { revenueCents: 232180000, expensesCents: 101245000, profitCents: 130935000 },
  { revenueCents: 245890000, expensesCents: 107723000, profitCents: 138167000 },
  { revenueCents: 239875000, expensesCents: 106490000, profitCents: 133385000 },
  { revenueCents: 284245000, expensesCents: 116523000, profitCents: 167722000 },
];

const cashFlowRows = [
  {
    inflowsCents: 128540000,
    outflowsCents: 29978000,
  },
];

const profitLossReport = {
  revenueCents: 284245000,
  cogsCents: 72430000,
  operatingExpensesCents: 44093000,
};

const taxQuarterCards = [
  { collectedCents: 7184500, payableCents: 0 },
  { collectedCents: 9356000, payableCents: 3124500 },
  { collectedCents: 0, payableCents: 0 },
];

test("summarizes customer statements for the selected period", () => {
  const { summarizeStatements } = loadTsModule(
    "src/features/statements-reports/data.ts",
  );

  const summary = summarizeStatements(customerStatements);

  assert.equal(summary.totalCustomers, 5);
  assert.equal(summary.totalInvoices, 52);
  assert.equal(summary.netBalanceCents, 37905000);
  assert.equal(summary.outstandingCents, 40150000);
  assert.equal(summary.creditCents, 2245000);
});

test("summarizes revenue analysis for the active report period", () => {
  const { summarizeRevenueAnalysis } = loadTsModule(
    "src/features/statements-reports/data.ts",
  );

  const summary = summarizeRevenueAnalysis(monthlyReportRows);

  assert.equal(summary.revenueCents, 284245000);
  assert.equal(summary.expensesCents, 116523000);
  assert.equal(summary.profitCents, 167722000);
  assert.equal(summary.marginPercent, 59);
  assert.equal(summary.revenueTrendPercent, 18.5);
});

test("keeps revenue analysis finite when the latest month has zero revenue", () => {
  const { summarizeRevenueAnalysis, buildRevenueChartColumns } = loadTsModule(
    "src/features/statements-reports/data.ts",
  );

  const rows = [
    { month: "Abr", revenueCents: 200000, expensesCents: 80000, profitCents: 120000 },
    { month: "Mai", revenueCents: 0, expensesCents: 0, profitCents: 0 },
  ];

  const summary = summarizeRevenueAnalysis(rows);
  const columns = buildRevenueChartColumns(rows);

  assert.equal(summary.marginPercent, 0);
  assert.equal(summary.revenueTrendPercent, -100);
  assert.equal(columns.length, 2);
  assert.equal(columns[0].revenueHeightPercent, 100);
  assert.equal(columns[0].expensesHeightPercent, 40);
  assert.equal(columns[0].profitHeightPercent, 60);
  assert.equal(columns[1].revenueHeightPercent, 0);
  assert.equal(columns[1].expensesHeightPercent, 0);
  assert.equal(columns[1].profitHeightPercent, 0);
});

test("summarizes cash flow, profit and loss, and tax reports", () => {
  const {
    summarizeCashFlow,
    summarizeProfitLoss,
    summarizeTaxSummary,
  } = loadTsModule("src/features/statements-reports/data.ts");

  const cashFlow = summarizeCashFlow(cashFlowRows);
  const profitLoss = summarizeProfitLoss(profitLossReport);
  const taxSummary = summarizeTaxSummary(taxQuarterCards);

  assert.equal(cashFlow.netCashFlowCents, 98562000);
  assert.equal(cashFlow.inflowsCents, 128540000);
  assert.equal(cashFlow.outflowsCents, 29978000);
  assert.equal(profitLoss.netProfitCents, 167722000);
  assert.equal(profitLoss.expensesCents, 116523000);
  assert.equal(taxSummary.collectedCents, 16540500);
  assert.equal(taxSummary.payableCents, 3124500);
});

test("statements and reports routes use protected finance workspaces", () => {
  const routeFiles = [
    "src/app/statements/page.tsx",
    "src/app/reports/page.tsx",
  ];

  for (const path of routeFiles) {
    const page = readProjectFile(path);

    assert.match(page, /createClient/);
    assert.match(page, /auth\.getUser/);
    assert.match(page, /isInternalFinanceUser/);
    assert.match(page, /redirect\("\/login/);
  }

  const statementsView = readProjectFile(
    "src/features/statements-reports/components/statements-page.tsx",
  );
  const reportsView = readProjectFile(
    "src/features/statements-reports/components/reports-page.tsx",
  );
  const workspaceView = readProjectFile(
    "src/features/statements-reports/components/statements-reports-workspace.tsx",
  );
  const reportsRoute = readProjectFile("src/app/reports/page.tsx");
  const shell = readProjectFile(
    "src/features/finance-shell/components/finance-shell.tsx",
  );

  for (const text of [
    "Extratos",
    "Período",
    "Enviar extratos",
    "Baixar em lote",
    "Visualizar",
    "Imprimir",
    "E-mail",
    "Saldo",
    "Faturas",
  ]) {
    assert.match(
      workspaceView,
      new RegExp(text),
      `expected statements tab to include ${text}`,
    );
  }

  for (const text of [
    "Relatórios",
    "Exportar relatório",
    "Análise de Receita",
    "Fluxo de Caixa",
    "Lucros e Perdas",
    "Resumo de Impostos",
    "Entradas",
    "Saídas",
    "Custos",
    "Despesas operacionais",
    "Receita",
    "Despesas",
    "Lucro",
    "Margem",
  ]) {
    assert.match(
      workspaceView,
      new RegExp(text),
      `expected reports tab to include ${text}`,
    );
  }

  assert.match(statementsView, /StatementsReportsWorkspace/);
  assert.match(reportsView, /StatementsReportsWorkspace/);
  assert.match(workspaceView, /"use client"/);
  assert.match(workspaceView, /useState<StatementsReportsTab>\(initialTab\)/);
  assert.match(workspaceView, /role="tablist"/);
  assert.match(workspaceView, /role="tab"/);
  assert.match(workspaceView, /aria-selected={isActive}/);
  assert.match(workspaceView, /onClick={\(\) => setActiveTab\(tab\)}/);

  assert.doesNotMatch(reportsRoute, /searchParams/);
  assert.doesNotMatch(reportsRoute, /getActiveReportType/);
  assert.doesNotMatch(reportsRoute, /activeReportType/);

  for (const href of [
    "/reports?tipo=revenue_analysis",
    "/reports?tipo=cash_flow",
    "/reports?tipo=profit_loss",
    "/reports?tipo=tax_summary",
  ]) {
    assert.doesNotMatch(
      workspaceView,
      new RegExp(href.replace("?", "\\?")),
      `expected report selector to avoid route-changing href ${href}`,
    );
  }

  assert.match(workspaceView, /useState<ReportType>\("revenue_analysis"\)/);
  assert.match(workspaceView, /isActive={activeReportType === type}/);
  assert.match(workspaceView, /aria-selected={isActive}/);
  assert.match(workspaceView, /onClick={\(\) => setActiveReportType\(type\)}/);
  assert.match(workspaceView, /renderActiveReport/);
  assert.match(workspaceView, /buildRevenueChartAxis/);
  assert.match(workspaceView, /Passe o mouse sobre as colunas/);
  assert.match(workspaceView, /Passe o mouse sobre as barras/);
  assert.match(workspaceView, /onMouseEnter=\{\(\) => onHover\(row\)\}/);

  for (const view of [workspaceView, statementsView, reportsView]) {
    assert.doesNotMatch(view, /<ActiveTab href=/);
    assert.doesNotMatch(view, /<InactiveTab href=/);
  }

  for (const href of ["/statements", "/reports"]) {
    assert.match(shell, new RegExp(href), `expected shell navigation to include ${href}`);
  }
});
