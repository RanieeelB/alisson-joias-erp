import type { InvoiceStatus } from "@/lib/finance";

export type InvoiceStatusFilter = InvoiceStatus | "all";

export type InvoiceOrderType =
  | "Pedido Personalizado"
  | "Reparo"
  | "Atacado"
  | "Varejo";

export type QuickbooksSyncStatus = "synced" | "pending" | "failed";

export type InvoiceLineItem = {
  id: string;
  description: string;
  quantity: number;
  unitPriceCents: number;
  taxCents: number;
  lineTotalCents: number;
};

export type InvoiceRecord = {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerSegment: string;
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
};

export type InvoiceSummary = {
  totalInvoicedCents: number;
  collectedCents: number;
  outstandingCents: number;
  overdueCents: number;
};
