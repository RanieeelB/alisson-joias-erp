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

export type DashboardInvoiceRecord = DashboardInvoice & {
  invoiceNumber: string;
  customerName: string;
  orderType: "Pedido Personalizado" | "Reparo" | "Atacado" | "Varejo";
};

export const dashboardAsOf = new Date("2026-04-30T12:00:00.000Z");

export const invoices: DashboardInvoiceRecord[] = [
  {
    invoiceNumber: "INV-1048",
    customerName: "Aurora & Co. Fine Jewelry",
    orderType: "Pedido Personalizado",
    totalCents: 4285000,
    paidCents: 2100000,
    balanceCents: 2185000,
    date: "2026-04-04",
    dueDate: "2026-05-04",
    status: "partial",
  },
  {
    invoiceNumber: "INV-1047",
    customerName: "Carvalho Atelier",
    orderType: "Reparo",
    totalCents: 865000,
    paidCents: 0,
    balanceCents: 865000,
    date: "2026-04-02",
    dueDate: "2026-04-17",
    status: "overdue",
  },
  {
    invoiceNumber: "INV-1044",
    customerName: "Northline Wholesale Jewelers",
    orderType: "Atacado",
    totalCents: 3187500,
    paidCents: 1200000,
    balanceCents: 1987500,
    date: "2026-03-24",
    dueDate: "2026-04-08",
    status: "partial",
  },
  {
    invoiceNumber: "INV-1041",
    customerName: "Diamond Crest Retail",
    orderType: "Varejo",
    totalCents: 1452000,
    paidCents: 1452000,
    balanceCents: 0,
    date: "2026-03-15",
    dueDate: "2026-04-14",
    status: "paid",
  },
  {
    invoiceNumber: "INV-1038",
    customerName: "Helena Martins Bridal",
    orderType: "Pedido Personalizado",
    totalCents: 2210000,
    paidCents: 600000,
    balanceCents: 1610000,
    date: "2026-02-28",
    dueDate: "2026-03-20",
    status: "overdue",
  },
  {
    invoiceNumber: "INV-1032",
    customerName: "Aurora & Co. Fine Jewelry",
    orderType: "Atacado",
    totalCents: 5820000,
    paidCents: 3200000,
    balanceCents: 2620000,
    date: "2026-01-18",
    dueDate: "2026-02-17",
    status: "overdue",
  },
];

export const revenueSeries: RevenuePoint[] = [
  { month: "Nov", revenueCents: 8240000, profitCents: 2960000 },
  { month: "Dez", revenueCents: 11260000, profitCents: 4210000 },
  { month: "Jan", revenueCents: 9650000, profitCents: 3380000 },
  { month: "Fev", revenueCents: 12890000, profitCents: 5120000 },
  { month: "Mar", revenueCents: 14740000, profitCents: 5910000 },
  { month: "Abr", revenueCents: 16430000, profitCents: 6820000 },
];

export const categoryRevenue: CategoryRevenue[] = [
  { label: "Pedidos Personalizados", valueCents: 7420000, color: "#d2a84f" },
  { label: "Reparos", valueCents: 2860000, color: "#3b82f6" },
  { label: "Atacado", valueCents: 5140000, color: "#10b981" },
  { label: "Varejo", valueCents: 1010000, color: "#ef4444" },
];

export const topCustomers: CustomerBalance[] = [
  {
    name: "Aurora & Co. Fine Jewelry",
    segment: "Personalizados + atacado",
    balanceCents: 4805000,
    overdueCents: 2620000,
  },
  {
    name: "Northline Wholesale Jewelers",
    segment: "Lote de atacado",
    balanceCents: 1987500,
    overdueCents: 1987500,
  },
  {
    name: "Helena Martins Bridal",
    segment: "Personalizados para noivas",
    balanceCents: 1610000,
    overdueCents: 1610000,
  },
  {
    name: "Carvalho Atelier",
    segment: "Serviços de reparo",
    balanceCents: 865000,
    overdueCents: 865000,
  },
  {
    name: "Diamond Crest Retail",
    segment: "Conta de varejo",
    balanceCents: 420000,
    overdueCents: 0,
  },
];

export const recentActivity: Activity[] = [
  {
    id: "act-1",
    title: "Pagamento registrado",
    detail: "Pagamento parcial via ACH para INV-1048",
    amountCents: 1250000,
    tone: "success",
    time: "há 18 min",
  },
  {
    id: "act-2",
    title: "Fatura em atraso",
    detail: "Saldo de reparo da Carvalho Atelier movido para 1-30d",
    amountCents: 865000,
    tone: "danger",
    time: "há 1h",
  },
  {
    id: "act-3",
    title: "Sincronização QuickBooks",
    detail: "3 faturas na fila para revisão de sincronização",
    amountCents: 0,
    tone: "warning",
    time: "há 2h",
  },
  {
    id: "act-4",
    title: "Pedido personalizado faturado",
    detail: "Fatura de anel de noivado em ouro amarelo 18k enviada",
    amountCents: 4285000,
    tone: "info",
    time: "Hoje",
  },
];

export const agingSummary: AgingSummary[] = [
  { bucket: "current", label: "Atual", balanceCents: 2185000, invoiceCount: 1 },
  { bucket: "1-30", label: "1-30d", balanceCents: 2852500, invoiceCount: 2 },
  { bucket: "31-60", label: "31-60d", balanceCents: 1610000, invoiceCount: 1 },
  { bucket: "61-90", label: "61-90d", balanceCents: 2620000, invoiceCount: 1 },
  { bucket: "90+", label: "90+", balanceCents: 0, invoiceCount: 0 },
];

export const invoiceStatusLabels: Record<InvoiceStatus, string> = {
  pending: "Pendente",
  partial: "Parcial",
  paid: "Pago",
  overdue: "Em atraso",
};
