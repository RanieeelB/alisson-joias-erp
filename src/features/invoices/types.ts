import type { InvoiceStatus } from "@/lib/finance";

export type InvoiceStatusFilter = InvoiceStatus | "all";

export type InvoiceOrderType =
  | "Pedido Personalizado"
  | "Reparo"
  | "Atacado"
  | "Varejo";

export type QuickbooksSyncStatus = "synced" | "pending" | "failed" | "not_synced";

export type InvoiceLineItem = {
  id: string;
  description: string;
  quantity: number;
  unitPriceCents: number;
  taxCents: number;
  lineTotalCents: number;
};

export type InvoicePaymentMethod =
  | "ACH"
  | "Transferência"
  | "Cartão de crédito"
  | "Pix"
  | "Dinheiro"
  | "Check";

export type InvoicePayment = {
  id: string;
  paymentNumber: string;
  recordedOn: string;
  amountCents: number;
  method: InvoicePaymentMethod;
  reference: string;
};

export type InvoiceRecord = {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerSegment: string;
  contactName: string;
  billingEmail: string;
  billingPhone: string;
  billingAddress: string;
  orderType: InvoiceOrderType;
  issuedOn: string;
  dueOn: string;
  totalCents: number;
  paidCents: number;
  balanceCents: number;
  status: InvoiceStatus;
  quickbooksSyncStatus: QuickbooksSyncStatus;
  paymentTerms: string;
  lineItems: InvoiceLineItem[];
  payments: InvoicePayment[];
};

export type InvoiceSummary = {
  totalInvoicedCents: number;
  collectedCents: number;
  outstandingCents: number;
  overdueCents: number;
};

export type InvoiceDetailSummary = {
  subtotalCents: number;
  taxCents: number;
  totalCents: number;
  paidCents: number;
  balanceCents: number;
};
