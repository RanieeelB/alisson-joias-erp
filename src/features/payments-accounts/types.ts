import type { AgingBucket, InvoiceStatus } from "@/lib/finance";

export type PaymentMethod =
  | "ACH"
  | "Transferência"
  | "Cartão de crédito"
  | "Pix"
  | "Check"
  | "Dinheiro";

export type PaymentStatus = "settled" | "pending_deposit" | "credit";

export type PaymentRecord = {
  id: string;
  paymentNumber: string;
  invoiceNumber: string;
  customerName: string;
  date: string;
  amountCents: number;
  method: PaymentMethod;
  reference: string;
  status: PaymentStatus;
  creditCents?: number;
};

export type PaymentSummary = {
  collectedThisMonthCents: number;
  pendingDepositsCents: number;
  creditCents: number;
};

export type ReceivableInvoice = {
  id: string;
  invoiceNumber: string;
  customerName: string;
  dueOn: string;
  balanceCents: number;
  status: Exclude<InvoiceStatus, "paid">;
};

export type ReceivableAgingSummary = Record<AgingBucket, number>;

export type CustomerReceivableBalance = {
  customerName: string;
  currentCents: number;
  overdueCents: number;
  creditAvailableCents: number;
};

export type CustomerReceivableBalanceScale = CustomerReceivableBalance & {
  progress: number;
};

export type PayableCategory =
  | "Matéria-prima"
  | "Componentes"
  | "Certificação"
  | "Serviços";

export type PayableStatus = "pending" | "partial" | "paid" | "overdue";

export type AccountsPayableRecord = {
  id: string;
  apNumber: string;
  vendorName: string;
  category: PayableCategory;
  date: string;
  dueOn: string;
  totalCents: number;
  paidCents: number;
  balanceCents: number;
  status: PayableStatus;
  paidOn?: string;
};

export type AccountsPayableSummary = {
  totalPayableCents: number;
  paidThisMonthCents: number;
  overdueCents: number;
};
