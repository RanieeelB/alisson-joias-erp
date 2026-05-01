import {
  loadDeclarationById,
  loadFinanceWorkspace,
  loadInvoiceById,
  type DeclarationRecord,
} from "@/features/finance/data";
import type { InvoiceRecord } from "@/features/invoices/types";
import { formatMoney } from "@/lib/finance";
import { createFinancePdf, pdfResponse, type PdfSection } from "@/lib/pdf";
import { isInternalFinanceUser } from "@/lib/supabase/authz";
import { createClient } from "@/lib/supabase/server";

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

  return pdfResponse(bytes, id ? "extrato-cliente.pdf" : "extratos-em-lote.pdf");
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

  return pdfResponse(bytes, `${invoice.invoiceNumber.toLowerCase()}.pdf`);
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

  return pdfResponse(bytes, `${declaration.declarationNumber.toLowerCase()}.pdf`);
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
