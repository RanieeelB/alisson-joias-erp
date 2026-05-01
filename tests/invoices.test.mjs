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

test("filters invoices by status and customer or invoice number search", () => {
  const { invoiceRecords, filterInvoices } = loadTsModule(
    "src/features/invoices/data.ts",
  );

  const overdueInvoices = filterInvoices(invoiceRecords, {
    status: "overdue",
    query: "",
  });
  const auroraInvoices = filterInvoices(invoiceRecords, {
    status: "all",
    query: "aurora",
  });
  const specificInvoice = filterInvoices(invoiceRecords, {
    status: "all",
    query: "inv-2049",
  });

  assert.equal(overdueInvoices.length, 2);
  assert.equal(auroraInvoices.length, 2);
  assert.equal(specificInvoice.length, 1);
  assert.equal(specificInvoice[0].invoiceNumber, "INV-2049");
});

test("summarizes invoice list metrics for the visible set", () => {
  const { invoiceRecords, summarizeInvoices } = loadTsModule(
    "src/features/invoices/data.ts",
  );

  const summary = summarizeInvoices(invoiceRecords);

  assert.equal(summary.totalInvoicedCents, 14529000);
  assert.equal(summary.collectedCents, 6806000);
  assert.equal(summary.outstandingCents, 7723000);
  assert.equal(summary.overdueCents, 3597500);
});

test("invoice route wires the protected finance list experience", () => {
  const page = readProjectFile("src/app/invoices/page.tsx");
  const view = readProjectFile("src/features/invoices/components/invoices-page.tsx");
  const data = readProjectFile("src/features/invoices/data.ts");

  for (const text of [
    "Faturas",
    "Total faturado",
    "Coletado",
    "Outstanding",
    "Overdue",
    "Invoice #",
    "Customer",
    "QuickBooks",
    "Nova Fatura",
  ]) {
    assert.match(view, new RegExp(text), `expected invoices page to include ${text}`);
  }

  assert.match(page, /createClient/);
  assert.match(page, /auth\.getUser/);
  assert.match(page, /redirect\("\/login/);
  assert.match(page, /InvoicesPage/);
  assert.doesNotMatch(page, /searchParams/);
  assert.match(view, /invoiceRecords/);
  assert.match(view, /"use client"/);
  assert.match(view, /useState<InvoiceStatusFilter>\("all"\)/);
  assert.match(view, /role="tablist"/);
  assert.match(view, /role="tab"/);
  assert.match(view, /aria-selected={isActive}/);
  assert.match(view, /onClick={\(\) => setActiveStatus\(status\)}/);
  assert.doesNotMatch(view, /buildInvoicesHref/);
  assert.doesNotMatch(view, /href={buildInvoicesHref/);
  assert.match(view, /invoiceStatusLabels/);
  assert.match(view, /table-fixed/);
  assert.match(view, /min-w-\[86rem\]/);
  assert.match(view, /<colgroup>/);

  for (const text of ["Todos", "Pendentes", "Parciais", "Pagas", "Em atraso"]) {
    assert.match(data, new RegExp(text), `expected invoice labels to include ${text}`);
  }
});

test("retrieves invoice detail data and calculates jewelry totals", () => {
  const {
    getInvoiceById,
    summarizeInvoiceDetail,
  } = loadTsModule("src/features/invoices/data.ts");

  const invoice = getInvoiceById("inv-2049");

  assert.ok(invoice, "expected invoice detail record to exist");
  assert.equal(invoice.invoiceNumber, "INV-2049");
  assert.equal(invoice.payments.length, 2);

  const summary = summarizeInvoiceDetail(invoice);

  assert.equal(summary.subtotalCents, 4080000);
  assert.equal(summary.taxCents, 205000);
  assert.equal(summary.totalCents, 4285000);
  assert.equal(summary.paidCents, 2100000);
  assert.equal(summary.balanceCents, 2185000);
});

test("invoice detail route wires the protected finance detail workspace", () => {
  const page = readProjectFile("src/app/invoices/[id]/page.tsx");
  const view = readProjectFile(
    "src/features/invoices/components/invoice-detail-page.tsx",
  );

  for (const text of [
    "Detalhe da Fatura",
    "Dados do cliente",
    "Line items",
    "Subtotal",
    "Tax",
    "Total",
    "Paid",
    "Balance",
    "Send",
    "Record Payment",
    "Print",
    "Download PDF",
    "Edit",
    "Payment history",
    "QuickBooks",
  ]) {
    assert.match(view, new RegExp(text), `expected invoice detail page to include ${text}`);
  }

  assert.match(page, /createClient/);
  assert.match(page, /auth\.getUser/);
  assert.match(page, /redirect\("\/login/);
  assert.match(page, /notFound/);
  assert.match(page, /InvoiceDetailPage/);
  assert.match(view, /getInvoiceById/);
  assert.match(view, /summarizeInvoiceDetail/);
});
