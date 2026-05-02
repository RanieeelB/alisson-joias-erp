import {
  loadDeclarationById,
  loadFinanceWorkspace,
  loadInvoiceById,
  type DeclarationRecord,
} from "@/features/finance/data";
import type { InvoiceRecord } from "@/features/invoices/types";
import { formatMoney } from "@/lib/finance";
import { createFinancePdf, pdfResponse, type PdfSection } from "@/lib/pdf";
import { createAdminClient } from "@/lib/supabase/admin";
import { isInternalFinanceUser } from "@/lib/supabase/authz";
import { hasSupabaseServiceEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

const STORAGE_BUCKET = "finance-exports";

export async function requireFinanceWorkspace() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user || !isInternalFinanceUser(user)) {
    return { error: new Response("Acesso não autorizado.", { status: 401 }) };
  }

  return { supabase, workspace: await loadFinanceWorkspace(supabase) };
}

async function uploadToStorage(
  supabase: SupabaseClient,
  folder: string,
  filename: string,
  bytes: Uint8Array,
): Promise<string> {
  const date = new Date().toISOString().slice(0, 10);
  const storagePath = `${folder}/${date}/${filename}`;
  const storageClient = hasSupabaseServiceEnv() ? createAdminClient() : supabase;

  if (hasSupabaseServiceEnv()) {
    await ensureStorageBucket(storageClient);
  }

  const { error } = await storageClient.storage
    .from(STORAGE_BUCKET)
    .upload(storagePath, bytes, {
      contentType: "application/pdf",
      upsert: true,
    });

  if (error) {
    throw new Error(
      `Falha ao salvar PDF no Supabase Storage (${storagePath}): ${error.message}`,
    );
  }

  return storagePath;
}

async function ensureStorageBucket(storageClient: ReturnType<typeof createAdminClient>) {
  const { error } = await storageClient.storage.getBucket(STORAGE_BUCKET);

  if (!error) {
    return;
  }

  const message = error.message.toLowerCase();
  const bucketMissing =
    message.includes("not found") || message.includes("does not exist");

  if (!bucketMissing) {
    throw new Error(`Falha ao consultar bucket ${STORAGE_BUCKET}: ${error.message}`);
  }

  const { error: createError } = await storageClient.storage.createBucket(STORAGE_BUCKET, {
    public: false,
    allowedMimeTypes: ["application/pdf"],
    fileSizeLimit: "20MB",
  });

  if (createError) {
    throw new Error(`Falha ao criar bucket ${STORAGE_BUCKET}: ${createError.message}`);
  }
}

export async function dashboardPdfResponse() {
  const result = await requireFinanceWorkspace();
  if ("error" in result) return result.error;

  const { workspace } = result;
  const invoiceRows = workspace.invoiceRecords.map((invoice) => [
    invoice.invoiceNumber,
    invoice.customerName,
    invoice.orderType,
    formatMoney(invoice.totalCents),
    formatMoney(invoice.balanceCents),
    invoice.status,
  ]);
  const totalRevenue = workspace.invoiceRecords.reduce(
    (sum, invoice) => sum + invoice.totalCents,
    0,
  );
  const totalBalance = workspace.invoiceRecords.reduce(
    (sum, invoice) => sum + invoice.balanceCents,
    0,
  );

  const bytes = await createFinancePdf({
    fileTitle: "Painel Financeiro",
    subtitle: "Resumo financeiro, indicadores e dados dos gráficos",
    sections: [
      {
        heading: "Resumo financeiro",
        lines: [
          `Receita total: ${formatMoney(totalRevenue)}`,
          `Saldo pendente: ${formatMoney(totalBalance)}`,
          `Faturas abertas: ${workspace.invoiceRecords.filter((invoice) => invoice.balanceCents > 0).length}`,
        ],
      },
      {
        heading: "Receita por período",
        rows: workspace.revenueSeries.map((point) => [
          point.month,
          formatMoney(point.revenueCents),
          formatMoney(point.profitCents),
        ]),
      },
      {
        heading: "Faturas usadas no painel",
        rows: invoiceRows,
      },
    ],
  });

  await uploadToStorage(result.supabase, "reports", "painel-financeiro.pdf", bytes);

  return pdfResponse(bytes, "painel-financeiro.pdf");
}

export async function paymentsPdfResponse() {
  const result = await requireFinanceWorkspace();
  if ("error" in result) return result.error;

  const bytes = await createFinancePdf({
    fileTitle: "Pagamentos",
    subtitle: "Pagamentos recebidos e obrigações financeiras",
    sections: [
      {
        heading: "Pagamentos registrados",
        rows: result.workspace.paymentRecords.map((payment) => [
          payment.paymentNumber,
          payment.invoiceNumber,
          payment.customerName,
          payment.method,
          formatMoney(payment.amountCents),
          payment.status,
        ]),
      },
      {
        heading: "Obrigações",
        rows: result.workspace.accountsPayableRecords.map((payable) => [
          payable.apNumber,
          payable.vendorName,
          payable.category,
          formatMoney(payable.balanceCents),
          payable.status,
        ]),
      },
    ],
  });

  await uploadToStorage(result.supabase, "reports", "pagamentos-e-obrigacoes.pdf", bytes);

  return pdfResponse(bytes, "pagamentos-e-obrigacoes.pdf");
}

export async function reportPdfResponse() {
  const result = await requireFinanceWorkspace();
  if ("error" in result) return result.error;

  const bytes = await createFinancePdf({
    fileTitle: "Relatório Financeiro",
    subtitle: "Revenue Analysis, Cash Flow, Profit & Loss e Tax Summary",
    sections: [
      {
        heading: "Revenue Analysis",
        rows: result.workspace.monthlyReportRows.map((row) => [
          row.month,
          formatMoney(row.revenueCents),
          formatMoney(row.expensesCents),
          formatMoney(row.profitCents),
        ]),
      },
      {
        heading: "Cash Flow",
        rows: result.workspace.cashFlowRows.map((row) => [
          row.month,
          formatMoney(row.inflowsCents),
          formatMoney(row.outflowsCents),
        ]),
      },
      {
        heading: "Tax Summary",
        rows: result.workspace.taxQuarterCards.map((card) => [
          card.quarter,
          formatMoney(card.collectedCents),
          formatMoney(card.payableCents),
          card.status,
        ]),
      },
    ],
  });

  await uploadToStorage(result.supabase, "reports", "relatorio-financeiro.pdf", bytes);

  return pdfResponse(bytes, "relatorio-financeiro.pdf");
}

export async function statementPdfResponse(id?: string) {
  const result = await requireFinanceWorkspace();
  if ("error" in result) return result.error;

  const statements = id
    ? result.workspace.customerStatements.filter((statement) => statement.id === id)
    : result.workspace.customerStatements;

  if (statements.length === 0) {
    return new Response("Nenhum extrato encontrado.", { status: 404 });
  }

  const bytes = await createFinancePdf({
    fileTitle: id ? "Extrato de Cliente" : "Extratos em Lote",
    subtitle: "Extratos consolidados com dados reais do banco",
    sections: statements.map((statement) => ({
      heading: `${statement.statementNumber} - ${statement.customerName}`,
      lines: [
        `Faturas: ${statement.invoiceCount}`,
        `Saldo: ${formatMoney(statement.balanceCents)}`,
        `Última fatura: ${statement.lastInvoiceDate}`,
      ],
    })),
  });

  const filename = id ? "extrato-cliente.pdf" : "extratos-em-lote.pdf";
  await uploadToStorage(
    result.supabase,
    id ? `statements/${id}` : "statements/bulk",
    filename,
    bytes,
  );

  return pdfResponse(bytes, filename);
}

export async function invoicePdfResponse(id: string) {
  const result = await requireFinanceWorkspace();
  if ("error" in result) return result.error;

  const invoice = await loadInvoiceById(result.supabase, id);
  if (!invoice) return new Response("Fatura não encontrada.", { status: 404 });

  const bytes = await createFinancePdf({
    fileTitle: `Fatura ${invoice.invoiceNumber}`,
    subtitle: invoice.customerName,
    sections: invoiceSections(invoice),
  });

  const filename = `${invoice.invoiceNumber.toLowerCase()}.pdf`;
  await uploadToStorage(result.supabase, `invoices/${id}`, filename, bytes);

  return pdfResponse(bytes, filename);
}

export async function declarationPdfResponse(id: string) {
  const result = await requireFinanceWorkspace();
  if ("error" in result) return result.error;

  const declaration = await loadDeclarationById(result.supabase, id);
  if (!declaration) return new Response("Declaração não encontrada.", { status: 404 });

  const bytes = await createFinancePdf({
    fileTitle: declaration.title,
    subtitle: `${declaration.declarationNumber} - ${declaration.customerName}`,
    sections: declarationSections(declaration),
  });

  const filename = `${declaration.declarationNumber.toLowerCase()}.pdf`;
  await uploadToStorage(result.supabase, `declarations/${id}`, filename, bytes);

  return pdfResponse(bytes, filename);
}

function invoiceSections(invoice: InvoiceRecord): PdfSection[] {
  return [
    {
      heading: "Dados da fatura",
      lines: [
        `Cliente: ${invoice.customerName}`,
        `Emissão: ${invoice.issuedOn}`,
        `Vencimento: ${invoice.dueOn}`,
        `Status: ${invoice.status}`,
        `Total: ${formatMoney(invoice.totalCents)}`,
        `Pago: ${formatMoney(invoice.paidCents)}`,
        `Saldo: ${formatMoney(invoice.balanceCents)}`,
      ],
    },
    {
      heading: "Itens",
      rows: invoice.lineItems.map((item) => [
        item.description,
        String(item.quantity),
        formatMoney(item.unitPriceCents),
        formatMoney(item.taxCents),
        formatMoney(item.lineTotalCents),
      ]),
    },
    {
      heading: "Pagamentos",
      rows: invoice.payments.map((payment) => [
        payment.paymentNumber,
        payment.recordedOn,
        payment.method,
        formatMoney(payment.amountCents),
        payment.reference,
      ]),
    },
  ];
}

function declarationSections(declaration: DeclarationRecord): PdfSection[] {
  return [
    {
      heading: "Identificação",
      lines: [
        `Cliente: ${declaration.customerName}`,
        `Referência: ${declaration.referencePeriod}`,
        `Emitida em: ${declaration.issuedOn}`,
      ],
    },
    {
      heading: "Declaração",
      lines: [declaration.body],
    },
  ];
}
