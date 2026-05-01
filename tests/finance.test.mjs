import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

const testRequire = createRequire(import.meta.url);

function loadFinanceModule() {
  const sourcePath = "src/lib/finance.ts";

  assert.equal(
    existsSync(sourcePath),
    true,
    "expected src/lib/finance.ts to exist",
  );

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

function loadDashboardDataModule() {
  const sourcePath = "src/features/dashboard/data.ts";

  assert.equal(
    existsSync(sourcePath),
    true,
    "expected src/features/dashboard/data.ts to exist",
  );

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

test("formats integer cents as Brazilian real values", () => {
  const { formatMoney } = loadFinanceModule();

  assert.equal(formatMoney(12894567), "R$ 128.945,67");
  assert.equal(formatMoney(0), "R$ 0,00");
});

test("formats large cents as compact Brazilian real values", () => {
  const { formatCompactMoney } = loadFinanceModule();

  assert.equal(formatCompactMoney(16430000), "R$ 164,3 mil");
  assert.equal(formatCompactMoney(5000000), "R$ 50 mil");
  assert.equal(formatCompactMoney(99500), "R$ 995,00");
});

test("derives invoice aging buckets from due dates", () => {
  const { getAgingBucket } = loadFinanceModule();
  const asOf = new Date("2026-04-30T12:00:00.000Z");

  assert.equal(getAgingBucket("2026-05-01", asOf), "current");
  assert.equal(getAgingBucket("2026-04-10", asOf), "1-30");
  assert.equal(getAgingBucket("2026-03-16", asOf), "31-60");
  assert.equal(getAgingBucket("2026-02-10", asOf), "61-90");
  assert.equal(getAgingBucket("2026-01-15", asOf), "90+");
});

test("summarizes dashboard metrics from jewelry invoices", () => {
  const { summarizeDashboard } = loadFinanceModule();
  const invoices = [
    {
      totalCents: 800000,
      paidCents: 800000,
      balanceCents: 0,
      dueDate: "2026-04-02",
      date: "2026-04-01",
      status: "paid",
    },
    {
      totalCents: 1250000,
      paidCents: 500000,
      balanceCents: 750000,
      dueDate: "2026-04-12",
      date: "2026-04-05",
      status: "partial",
    },
    {
      totalCents: 420000,
      paidCents: 0,
      balanceCents: 420000,
      dueDate: "2026-03-18",
      date: "2026-03-01",
      status: "overdue",
    },
  ];

  const summary = summarizeDashboard(invoices, new Date("2026-04-30"));

  assert.equal(summary.totalRevenueCents, 2470000);
  assert.equal(summary.arOutstandingCents, 1170000);
  assert.equal(summary.invoicesThisMonth, 2);
  assert.equal(summary.overdueInvoices, 1);
});

test("summarizes QuickBooks sync status from Supabase invoice records", () => {
  const { summarizeQuickBooksSync } = loadDashboardDataModule();

  const summary = summarizeQuickBooksSync([
    { quickbooksSyncStatus: "synced" },
    { quickbooksSyncStatus: "pending" },
    { quickbooksSyncStatus: "failed" },
    { quickbooksSyncStatus: "not_synced" },
    { quickbooksSyncStatus: "synced" },
  ]);

  assert.equal(
    JSON.stringify(summary),
    JSON.stringify({
      syncedCount: 2,
      pendingCount: 2,
      failedCount: 1,
      requiresAttentionCount: 3,
    }),
  );
});

test("dashboard labels accumulated profit as an estimate", () => {
  const source = readFileSync(
    "src/features/dashboard/components/financial-dashboard.tsx",
    "utf8",
  );

  assert.match(source, /Lucro acumulado estimado/);
});

test("builds dashboard KPI details from real invoice data", () => {
  const { buildDashboardKpiDetails } = loadDashboardDataModule();

  const details = buildDashboardKpiDetails(
    [
      {
        totalCents: 150000,
        balanceCents: 0,
        date: "2026-04-01",
        dueDate: "2026-04-10",
        status: "paid",
        orderType: "Pedido Personalizado",
      },
      {
        totalCents: 50000,
        balanceCents: 15000,
        date: "2026-04-10",
        dueDate: "2026-04-20",
        status: "partial",
        orderType: "Atacado",
      },
      {
        totalCents: 100000,
        balanceCents: 100000,
        date: "2026-03-08",
        dueDate: "2026-03-20",
        status: "overdue",
        orderType: "Atacado",
      },
      {
        totalCents: 60000,
        balanceCents: 60000,
        date: "2026-03-15",
        dueDate: "2026-03-25",
        status: "overdue",
        orderType: "Atacado",
      },
    ],
    new Date("2026-04-30T12:00:00.000Z"),
  );

  assert.equal(details.revenueDetail, "+25,0% vs mês anterior");
  assert.equal(details.openInvoicesDetail, "3 faturas em aberto");
  assert.equal(details.invoicesThisMonthDetail, "2 no mês anterior");
  assert.equal(details.overdueBalanceCents, 160000);
});
