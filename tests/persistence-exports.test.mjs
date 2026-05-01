import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const projectRoot = process.cwd();

function readProjectFile(path) {
  const fullPath = join(projectRoot, path);

  assert.equal(existsSync(fullPath), true, `expected ${path} to exist`);

  return readFileSync(fullPath, "utf8");
}

test("finance pages receive persisted Supabase data instead of importing mock arrays", () => {
  for (const path of [
    "src/app/dashboard/page.tsx",
    "src/app/invoices/page.tsx",
    "src/app/payments/page.tsx",
    "src/app/accounts/payable/page.tsx",
    "src/app/statements/page.tsx",
    "src/app/reports/page.tsx",
    "src/app/declarations/page.tsx",
  ]) {
    const page = readProjectFile(path);

    assert.match(page, /createClient/);
    assert.match(page, /loadFinanceWorkspace/);
  }

  assert.doesNotMatch(
    readProjectFile("src/features/dashboard/components/financial-dashboard.tsx"),
    /import\s+\{[^}]*\b(invoices|revenueSeries|recentActivity)\b[^}]*\}\s+from "@\/features\/dashboard\/data"/,
  );
  assert.doesNotMatch(
    readProjectFile("src/features/invoices/components/invoices-page.tsx"),
    /import[\s\S]*invoiceRecords[\s\S]*from "@\/features\/invoices\/data"/,
  );
  assert.doesNotMatch(
    readProjectFile("src/features/payments-accounts/components/payments-accounts-workspace.tsx"),
    /import[\s\S]*(paymentRecords|accountsPayableRecords)[\s\S]*from "@\/features\/payments-accounts\/data"/,
  );
  assert.doesNotMatch(
    readProjectFile("src/features/statements-reports/components/statements-reports-workspace.tsx"),
    /import[\s\S]*(customerStatements|monthlyReportRows)[\s\S]*from "@\/features\/statements-reports\/data"/,
  );
});

test("main finance actions and PDF export routes are wired", () => {
  for (const path of [
    "src/app/api/exports/dashboard/route.ts",
    "src/app/api/exports/payments/route.ts",
    "src/app/api/exports/reports/route.ts",
    "src/app/api/exports/statements/bulk/route.ts",
    "src/app/api/exports/statements/[id]/route.ts",
    "src/app/api/exports/invoices/[id]/route.ts",
    "src/app/api/exports/declarations/[id]/route.ts",
  ]) {
    const route = readProjectFile(path);

    assert.match(route, /application\/pdf/);
    assert.match(route, /createFinancePdf/);
  }

  const actions = readProjectFile("src/features/finance/actions.ts");

  for (const actionName of [
    "createInvoiceAction",
    "recordPaymentAction",
    "createPayableAction",
  ]) {
    assert.match(actions, new RegExp(`export async function ${actionName}`));
  }
});
