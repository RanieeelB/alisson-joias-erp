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

const invoiceRecords = [
  {
    id: "inv-2049",
    invoiceNumber: "INV-2049",
    customerName: "Aurora & Co. Fine Jewelry",
    totalCents: 4285000,
    paidCents: 2100000,
    balanceCents: 2185000,
    status: "partial",
    lineItems: [
      {
        quantity: 1,
        unitPriceCents: 3250000,
        taxCents: 162500,
        lineTotalCents: 3412500,
      },
      {
        quantity: 1,
        unitPriceCents: 830000,
        taxCents: 42500,
        lineTotalCents: 872500,
      },
    ],
    payments: [
      { amountCents: 850000 },
      { amountCents: 1250000 },
    ],
  },
  {
    id: "inv-2048",
    invoiceNumber: "INV-2048",
    customerName: "Carvalho Atelier",
    totalCents: 645000,
    paidCents: 0,
    balanceCents: 645000,
    status: "pending",
    lineItems: [],
    payments: [],
  },
  {
    id: "inv-2047",
    invoiceNumber: "INV-2047",
    customerName: "Northline Wholesale Jewelers",
    totalCents: 3187500,
    paidCents: 1200000,
    balanceCents: 1987500,
    status: "overdue",
    lineItems: [],
    payments: [],
  },
  {
    id: "inv-2046",
    invoiceNumber: "INV-2046",
    customerName: "Diamond Crest Retail",
    totalCents: 1452000,
    paidCents: 1452000,
    balanceCents: 0,
    status: "paid",
    lineItems: [],
    payments: [],
  },
  {
    id: "inv-2045",
    invoiceNumber: "INV-2045",
    customerName: "Helena Martins Bridal",
    totalCents: 2210000,
    paidCents: 600000,
    balanceCents: 1610000,
    status: "overdue",
    lineItems: [],
    payments: [],
  },
  {
    id: "inv-2044",
    invoiceNumber: "INV-2044",
    customerName: "Aurora & Co. Fine Jewelry",
    totalCents: 2749500,
    paidCents: 1454000,
    balanceCents: 1295500,
    status: "partial",
    lineItems: [],
    payments: [],
  },
];

test("filters invoices by status and customer or invoice number search", () => {
  const { filterInvoices } = loadTsModule("src/features/invoices/data.ts");

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
  const { summarizeInvoices } = loadTsModule("src/features/invoices/data.ts");

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
    "Em aberto",
    "Em atraso",
    "Fatura #",
    "Cliente",
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
  const { summarizeInvoiceDetail } = loadTsModule("src/features/invoices/data.ts");

  const invoice = invoiceRecords.find((record) => record.id === "inv-2049");

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
    "Itens da fatura",
    "Subtotal",
    "Imposto",
    "Total",
    "Pago",
    "Saldo",
    "Enviar",
    "Registrar Pagamento",
    "Imprimir",
    "Baixar PDF",
    "Histórico de pagamentos",
    "QuickBooks",
  ]) {
    assert.match(view, new RegExp(text), `expected invoice detail page to include ${text}`);
  }

  assert.match(page, /createClient/);
  assert.match(page, /auth\.getUser/);
  assert.match(page, /redirect\("\/login/);
  assert.match(page, /notFound/);
  assert.match(page, /InvoiceDetailPage/);
  assert.match(page, /loadInvoiceById/);
  assert.match(view, /summarizeInvoiceDetail/);
});
