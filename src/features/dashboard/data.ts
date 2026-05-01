import type { DashboardInvoice, InvoiceStatus } from "@/lib/finance";

export type RevenuePoint = {
  month: string;
  revenueCents: number;
  profitCents: number;
};

export type CategoryRevenue = {
  label: "Pedidos Personalizados" | "Reparos" | "Atacado" | "Varejo";
  valueCents: number;
  color: string;
};

export type CustomerBalance = {
  name: string;
  segment: string;
  balanceCents: number;
  overdueCents: number;
};

export type Activity = {
  id: string;
  title: string;
  detail: string;
  amountCents: number;
  tone: "success" | "warning" | "info" | "danger";
  time: string;
};

export type AgingSummary = {
  bucket: string;
  label: string;
  balanceCents: number;
  invoiceCount: number;
};

export type QuickBooksSyncSummary = {
  syncedCount: number;
  pendingCount: number;
  failedCount: number;
  requiresAttentionCount: number;
};

export type DashboardInvoiceRecord = DashboardInvoice & {
  invoiceNumber: string;
  customerName: string;
  orderType: "Pedido Personalizado" | "Reparo" | "Atacado" | "Varejo";
};

export type DashboardKpiDetails = {
  revenueDetail: string;
  openInvoicesDetail: string;
  invoicesThisMonthDetail: string;
  overdueBalanceCents: number;
};

export const invoiceStatusLabels: Record<InvoiceStatus, string> = {
  pending: "Pendente",
  partial: "Parcial",
  paid: "Pago",
  overdue: "Em atraso",
};

export function summarizeQuickBooksSync(
  invoices: Array<{
    quickbooksSyncStatus: "synced" | "pending" | "failed" | "not_synced";
  }>,
): QuickBooksSyncSummary {
  return invoices.reduce<QuickBooksSyncSummary>(
    (summary, invoice) => {
      if (invoice.quickbooksSyncStatus === "synced") {
        summary.syncedCount += 1;
        return summary;
      }

      if (invoice.quickbooksSyncStatus === "failed") {
        summary.failedCount += 1;
        summary.requiresAttentionCount += 1;
        return summary;
      }

      summary.pendingCount += 1;
      summary.requiresAttentionCount += 1;
      return summary;
    },
    {
      syncedCount: 0,
      pendingCount: 0,
      failedCount: 0,
      requiresAttentionCount: 0,
    },
  );
}

export function buildDashboardKpiDetails(
  invoices: Array<
    DashboardInvoice & {
      orderType: DashboardInvoiceRecord["orderType"];
    }
  >,
  asOf: Date = new Date(),
): DashboardKpiDetails {
  const currentYear = asOf.getUTCFullYear();
  const currentMonth = asOf.getUTCMonth();
  const previousMonthDate = new Date(Date.UTC(currentYear, currentMonth - 1, 1));
  const previousMonth = previousMonthDate.getUTCMonth();
  const previousMonthYear = previousMonthDate.getUTCFullYear();

  let currentMonthRevenueCents = 0;
  let previousMonthRevenueCents = 0;
  let previousMonthInvoiceCount = 0;
  let openInvoiceCount = 0;
  let overdueBalanceCents = 0;

  for (const invoice of invoices) {
    const invoiceDate = new Date(`${invoice.date}T00:00:00.000Z`);
    const invoiceYear = invoiceDate.getUTCFullYear();
    const invoiceMonth = invoiceDate.getUTCMonth();

    if (invoice.balanceCents > 0) {
      openInvoiceCount += 1;
    }

    if (invoice.status === "overdue") {
      overdueBalanceCents += Math.max(invoice.balanceCents, 0);
    }

    if (invoiceYear === currentYear && invoiceMonth === currentMonth) {
      currentMonthRevenueCents += invoice.totalCents;
    }

    if (invoiceYear === previousMonthYear && invoiceMonth === previousMonth) {
      previousMonthRevenueCents += invoice.totalCents;
      previousMonthInvoiceCount += 1;
    }
  }

  return {
    revenueDetail: formatRevenueComparison(
      currentMonthRevenueCents,
      previousMonthRevenueCents,
    ),
    openInvoicesDetail: `${openInvoiceCount} faturas em aberto`,
    invoicesThisMonthDetail: `${previousMonthInvoiceCount} no mês anterior`,
    overdueBalanceCents,
  };
}

function formatRevenueComparison(currentMonthRevenueCents: number, previousMonthRevenueCents: number) {
  if (previousMonthRevenueCents === 0 && currentMonthRevenueCents === 0) {
    return "Sem receita nos 2 últimos meses";
  }

  if (previousMonthRevenueCents === 0) {
    return "Sem base no mês anterior";
  }

  const changePercent =
    ((currentMonthRevenueCents - previousMonthRevenueCents) / previousMonthRevenueCents) * 100;
  const sign = changePercent >= 0 ? "+" : "";

  return `${sign}${changePercent.toFixed(1).replace(".", ",")}% vs mês anterior`;
}
