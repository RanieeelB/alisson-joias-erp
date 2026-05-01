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

test("summarizes customer statements for the selected period", () => {
  const {
    customerStatements,
    summarizeStatements,
  } = loadTsModule("src/features/statements-reports/data.ts");

  const summary = summarizeStatements(customerStatements);

  assert.equal(summary.totalCustomers, 5);
  assert.equal(summary.totalInvoices, 52);
  assert.equal(summary.netBalanceCents, 37905000);
  assert.equal(summary.outstandingCents, 40150000);
  assert.equal(summary.creditCents, 2245000);
});

test("summarizes revenue analysis for the active report period", () => {
  const {
    monthlyReportRows,
    summarizeRevenueAnalysis,
  } = loadTsModule("src/features/statements-reports/data.ts");

  const summary = summarizeRevenueAnalysis(monthlyReportRows);

  assert.equal(summary.revenueCents, 284245000);
  assert.equal(summary.expensesCents, 116523000);
  assert.equal(summary.profitCents, 167722000);
  assert.equal(summary.marginPercent, 59);
  assert.equal(summary.revenueTrendPercent, 18.5);
});

test("summarizes cash flow, profit and loss, and tax reports", () => {
  const {
    cashFlowRows,
    profitLossReport,
    taxQuarterCards,
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
  const reportsRoute = readProjectFile("src/app/reports/page.tsx");
  const shell = readProjectFile(
    "src/features/finance-shell/components/finance-shell.tsx",
  );

  for (const text of [
    "Statements",
    "Período",
    "Email All Statements",
    "Bulk Download",
    "View",
    "Print",
    "Email",
    "Balance",
    "Faturas",
  ]) {
    assert.match(
      statementsView,
      new RegExp(text),
      `expected statements page to include ${text}`,
    );
  }

  for (const text of [
    "Reports",
    "Export Report",
    "Revenue Analysis",
    "Cash Flow",
    "Profit & Loss",
    "Tax Summary",
    "Inflows",
    "Outflows",
    "COGS",
    "Operating Expenses",
    "Receita",
    "Despesas",
    "Lucro",
    "Margem",
  ]) {
    assert.match(
      reportsView,
      new RegExp(text),
      `expected reports page to include ${text}`,
    );
  }

  assert.match(reportsRoute, /searchParams/);
  assert.match(reportsRoute, /getActiveReportType/);
  assert.match(reportsRoute, /activeReportType/);

  for (const href of [
    "/reports?tipo=revenue_analysis",
    "/reports?tipo=cash_flow",
    "/reports?tipo=profit_loss",
    "/reports?tipo=tax_summary",
  ]) {
    assert.match(
      reportsView,
      new RegExp(href.replace("?", "\\?")),
      `expected report selector to include ${href}`,
    );
  }

  assert.match(reportsView, /activeReportType === type/);
  assert.match(reportsView, /renderActiveReport/);

  for (const href of ["/statements", "/reports"]) {
    assert.match(shell, new RegExp(href), `expected shell navigation to include ${href}`);
  }
});
