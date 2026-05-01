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

const paymentRecords = [
  {
    date: "2026-04-29",
    amountCents: 1850000,
    status: "settled",
  },
  {
    date: "2026-04-28",
    amountCents: 980000,
    status: "pending_deposit",
  },
  {
    date: "2026-04-25",
    amountCents: 1250000,
    status: "settled",
  },
  {
    date: "2026-04-23",
    amountCents: 610000,
    status: "credit",
    creditCents: 610000,
  },
  {
    date: "2026-04-20",
    amountCents: 2000000,
    status: "pending_deposit",
  },
  {
    date: "2026-04-18",
    amountCents: 605000,
    status: "settled",
  },
];

const openReceivableInvoices = [
  { dueOn: "2026-05-21", balanceCents: 2185000 },
  { dueOn: "2026-04-27", balanceCents: 1987500 },
  { dueOn: "2026-04-13", balanceCents: 1610000 },
  { dueOn: "2026-03-16", balanceCents: 1580000 },
  { dueOn: "2026-02-10", balanceCents: 905000 },
  { dueOn: "2026-01-15", balanceCents: 430000 },
];

const customerReceivableBalances = [
  {
    customerName: "Aurora & Co. Fine Jewelry",
    currentCents: 3080000,
    overdueCents: 1200000,
  },
  {
    customerName: "Northline Wholesale Jewelers",
    currentCents: 0,
    overdueCents: 1987500,
  },
  {
    customerName: "Carvalho Atelier",
    currentCents: 0,
    overdueCents: 1225000,
  },
  {
    customerName: "Helena Martins Bridal",
    currentCents: 0,
    overdueCents: 905000,
  },
  {
    customerName: "Lu'Mar Joias",
    currentCents: 0,
    overdueCents: 500000,
  },
];

const accountsPayableRecords = [
  { balanceCents: 2210000, paidCents: 0, status: "pending" },
  {
    balanceCents: 820000,
    paidCents: 300000,
    status: "partial",
    paidOn: "2026-04-24",
  },
  { balanceCents: 1285000, paidCents: 0, status: "pending" },
  {
    balanceCents: 0,
    paidCents: 1595000,
    status: "paid",
    paidOn: "2026-04-17",
  },
  { balanceCents: 1145000, paidCents: 0, status: "overdue" },
  { balanceCents: 1263000, paidCents: 0, status: "pending" },
];

test("summarizes payments, pending deposits, and credits", () => {
  const { summarizePayments } = loadTsModule(
    "src/features/payments-accounts/data.ts",
  );

  const summary = summarizePayments(
    paymentRecords,
    new Date("2026-04-30T12:00:00.000Z"),
  );

  assert.equal(summary.collectedThisMonthCents, 7295000);
  assert.equal(summary.pendingDepositsCents, 2980000);
  assert.equal(summary.creditCents, 610000);
});

test("derives accounts receivable aging and customer balances", () => {
  const {
    summarizeReceivableAging,
    getReceivableBalanceScale,
  } = loadTsModule("src/features/payments-accounts/data.ts");

  const aging = summarizeReceivableAging(
    openReceivableInvoices,
    new Date("2026-04-30T12:00:00.000Z"),
  );
  const scale = getReceivableBalanceScale(customerReceivableBalances);

  assert.equal(aging.current, 2185000);
  assert.equal(aging["1-30"], 3597500);
  assert.equal(aging["31-60"], 1580000);
  assert.equal(aging["61-90"], 905000);
  assert.equal(aging["90+"], 430000);
  assert.equal(scale[0].customerName, "Aurora & Co. Fine Jewelry");
  assert.equal(scale[0].progress, 100);
  assert.equal(scale.at(-1).progress, 12);
});

test("summarizes accounts payable obligations", () => {
  const { summarizeAccountsPayable } = loadTsModule(
    "src/features/payments-accounts/data.ts",
  );

  const summary = summarizeAccountsPayable(
    accountsPayableRecords,
    new Date("2026-04-30T12:00:00.000Z"),
  );

  assert.equal(summary.totalPayableCents, 6723000);
  assert.equal(summary.paidThisMonthCents, 1895000);
  assert.equal(summary.overdueCents, 1145000);
});

test("payments and accounts routes use protected finance workspaces", () => {
  const routeFiles = [
    "src/app/payments/page.tsx",
    "src/app/accounts/receivable/page.tsx",
    "src/app/accounts/payable/page.tsx",
  ];

  for (const path of routeFiles) {
    const page = readProjectFile(path);

    assert.match(page, /createClient/);
    assert.match(page, /auth\.getUser/);
    assert.match(page, /isInternalFinanceUser/);
    assert.match(page, /redirect\("\/login/);
  }

  const paymentsView = readProjectFile(
    "src/features/payments-accounts/components/payments-page.tsx",
  );
  const workspaceView = readProjectFile(
    "src/features/payments-accounts/components/payments-accounts-workspace.tsx",
  );
  const receivableView = readProjectFile(
    "src/features/payments-accounts/components/accounts-receivable-page.tsx",
  );
  const payableView = readProjectFile(
    "src/features/payments-accounts/components/accounts-payable-page.tsx",
  );
  const shell = readProjectFile(
    "src/features/finance-shell/components/finance-shell.tsx",
  );

  for (const text of [
    "Payments and Accounts",
    "Coletado no mês",
    "Depósitos pendentes",
    "Créditos",
    "Registrar pagamento",
    "Payment #",
    "Invoice",
    "Customer",
    "Method",
    "Reference",
  ]) {
    assert.match(workspaceView, new RegExp(text), `expected payments workspace to include ${text}`);
  }

  for (const text of [
    "Accounts Receivable",
    "Aging Analysis",
    "Saldos por cliente",
    "Faturas abertas",
    "Enviar reminder",
  ]) {
    assert.match(workspaceView, new RegExp(text), `expected AR tab to include ${text}`);
  }

  for (const text of [
    "Accounts Payable",
    "Total Payable",
    "Paid This Month",
    "Overdue",
    "AP #",
    "Vendor",
    "Category",
    "Raw Materials",
    "Components",
    "Certification",
    "Services",
  ]) {
    assert.match(workspaceView, new RegExp(text), `expected AP tab to include ${text}`);
  }

  assert.match(workspaceView, /"use client"/);
  assert.match(workspaceView, /useState<PaymentsAccountsTab>\(initialTab\)/);
  assert.match(workspaceView, /role="tablist"/);
  assert.match(workspaceView, /role="tab"/);
  assert.match(workspaceView, /aria-selected={isActive}/);
  assert.match(workspaceView, /onClick={\(\) => setActiveTab\(tab\)}/);

  assert.match(paymentsView, /PaymentsAccountsWorkspace/);
  assert.match(receivableView, /PaymentsAccountsWorkspace/);
  assert.match(payableView, /PaymentsAccountsWorkspace/);

  for (const view of [workspaceView, paymentsView, receivableView, payableView]) {
    assert.doesNotMatch(view, /<ActiveTab href=/);
    assert.doesNotMatch(view, /<InactiveTab href=/);
  }

  for (const href of [
    "/payments",
    "/accounts/receivable",
    "/accounts/payable",
  ]) {
    assert.match(shell, new RegExp(href), `expected shell navigation to include ${href}`);
  }
});
