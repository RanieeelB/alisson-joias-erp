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

export const invoiceStatusLabels: Record<InvoiceStatus, string> = {
  pending: "Pendente",
  partial: "Parcial",
  paid: "Pago",
  overdue: "Em atraso",
};
