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

test("summarizes payments, pending deposits, and credits", () => {
  const {
    paymentRecords,
    summarizePayments,
  } = loadTsModule("src/features/payments-accounts/data.ts");

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
    openReceivableInvoices,
    customerReceivableBalances,
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
  const {
    accountsPayableRecords,
    summarizeAccountsPayable,
  } = loadTsModule("src/features/payments-accounts/data.ts");

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
    assert.match(page, /app_metadata\?\.role/);
    assert.match(page, /redirect\("\/login/);
  }

  const paymentsView = readProjectFile(
    "src/features/payments-accounts/components/payments-page.tsx",
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
    assert.match(paymentsView, new RegExp(text), `expected payments page to include ${text}`);
  }

  for (const text of [
    "Accounts Receivable",
    "Aging Analysis",
    "Saldos por cliente",
    "Faturas abertas",
    "Enviar reminder",
  ]) {
    assert.match(receivableView, new RegExp(text), `expected AR page to include ${text}`);
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
    assert.match(payableView, new RegExp(text), `expected AP page to include ${text}`);
  }

  for (const href of [
    "/payments",
    "/accounts/receivable",
    "/accounts/payable",
  ]) {
    assert.match(shell, new RegExp(href), `expected shell navigation to include ${href}`);
  }
});
