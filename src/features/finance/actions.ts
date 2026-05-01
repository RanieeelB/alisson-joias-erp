"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

type ActionState = {
  ok: boolean;
  message: string;
};

const financePaths = [
  "/dashboard",
  "/invoices",
  "/payments",
  "/accounts/receivable",
  "/accounts/payable",
  "/statements",
  "/reports",
  "/declarations",
];

export async function createInvoiceAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const customerId = required(formData, "customerId", "Selecione um cliente.");
  const orderType = required(formData, "orderType", "Selecione o tipo da fatura.");
  const description = required(formData, "description", "Informe o item faturado.");
  const invoiceDate = required(formData, "invoiceDate", "Informe a data de emissão.");
  const dueDate = required(formData, "dueDate", "Informe o vencimento.");
  const subtotalCents = moneyToCents(required(formData, "subtotal", "Informe o valor."));

  if (isActionState(customerId)) return customerId;
  if (isActionState(orderType)) return orderType;
  if (isActionState(description)) return description;
  if (isActionState(invoiceDate)) return invoiceDate;
  if (isActionState(dueDate)) return dueDate;
  if (subtotalCents <= 0) return fail("O valor da fatura deve ser maior que zero.");

  const taxCents = Math.round(subtotalCents * 0.05);
  const totalCents = subtotalCents + taxCents;
  const invoiceNumber = nextDocumentNumber("INV");
  const supabase = await createClient();

  const { data: invoice, error: invoiceError } = await supabase
    .from("invoices")
    .insert({
      invoice_number: invoiceNumber,
      customer_id: customerId,
      order_type: orderType,
      invoice_date: invoiceDate,
      due_date: dueDate,
      subtotal_cents: subtotalCents,
      tax_cents: taxCents,
      total_cents: totalCents,
      paid_cents: 0,
      balance_cents: totalCents,
      status: new Date(`${dueDate}T00:00:00.000Z`) < todayUtc() ? "overdue" : "pending",
      quickbooks_sync_status: "pending",
    })
    .select("id")
    .single();

  if (invoiceError || !invoice) {
    return fail(`Não foi possível criar a fatura: ${invoiceError?.message ?? "erro desconhecido"}`);
  }

  const { error: itemError } = await supabase.from("invoice_line_items").insert({
    invoice_id: invoice.id,
    description,
    category: "service",
    quantity: 1,
    unit_price_cents: subtotalCents,
    tax_cents: taxCents,
    line_total_cents: totalCents,
  });

  if (itemError) {
    return fail(`Fatura criada, mas o item não foi salvo: ${itemError.message}`);
  }

  await supabase.from("financial_activities").insert({
    customer_id: customerId,
    invoice_id: invoice.id,
    title: "Fatura criada",
    detail: `${invoiceNumber} criada pela equipe financeira`,
    amount_cents: totalCents,
    tone: "info",
  });

  revalidateFinance();

  return { ok: true, message: `Fatura ${invoiceNumber} criada com sucesso.` };
}

export async function recordPaymentAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const invoiceId = required(formData, "invoiceId", "Selecione a fatura.");
  const customerId = required(formData, "customerId", "Selecione o cliente.");
  const paymentDate = required(formData, "paymentDate", "Informe a data do pagamento.");
  const method = required(formData, "method", "Selecione a forma de pagamento.");
  const status = required(formData, "status", "Selecione o status.");
  const amountCents = moneyToCents(required(formData, "amount", "Informe o valor."));
  const reference = String(formData.get("reference") ?? "").trim();

  if (isActionState(invoiceId)) return invoiceId;
  if (isActionState(customerId)) return customerId;
  if (isActionState(paymentDate)) return paymentDate;
  if (isActionState(method)) return method;
  if (isActionState(status)) return status;
  if (amountCents <= 0) return fail("O valor do pagamento deve ser maior que zero.");

  const supabase = await createClient();
  const { data: invoice, error: invoiceError } = await supabase
    .from("invoices")
    .select("id,total_cents,paid_cents")
    .eq("id", invoiceId)
    .single();

  if (invoiceError || !invoice) {
    return fail("Fatura vinculada não encontrada.");
  }

  const paymentNumber = nextDocumentNumber("PAY");
  const { data: payment, error: paymentError } = await supabase
    .from("payments")
    .insert({
      payment_number: paymentNumber,
      invoice_id: invoiceId,
      customer_id: customerId,
      payment_date: paymentDate,
      amount_cents: amountCents,
      method,
      status,
      reference,
    })
    .select("id")
    .single();

  if (paymentError || !payment) {
    return fail(`Não foi possível registrar o pagamento: ${paymentError?.message ?? "erro desconhecido"}`);
  }

  const paidCents = Number(invoice.paid_cents) + amountCents;
  const balanceCents = Math.max(Number(invoice.total_cents) - paidCents, 0);
  const invoiceStatus = balanceCents === 0 ? "paid" : paidCents > 0 ? "partial" : "pending";

  const { error: updateError } = await supabase
    .from("invoices")
    .update({
      paid_cents: paidCents,
      balance_cents: balanceCents,
      status: invoiceStatus,
    })
    .eq("id", invoiceId);

  if (updateError) {
    return fail(`Pagamento salvo, mas a fatura não foi atualizada: ${updateError.message}`);
  }

  await supabase.from("financial_activities").insert({
    customer_id: customerId,
    invoice_id: invoiceId,
    payment_id: payment.id,
    title: "Pagamento registrado",
    detail: `${paymentNumber} registrado para fatura vinculada`,
    amount_cents: amountCents,
    tone: status === "pending_deposit" ? "warning" : "success",
  });

  revalidateFinance();

  return { ok: true, message: `Pagamento ${paymentNumber} registrado com sucesso.` };
}

export async function createPayableAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const vendorId = required(formData, "vendorId", "Selecione o fornecedor.");
  const category = required(formData, "category", "Selecione a categoria.");
  const payableDate = required(formData, "payableDate", "Informe a data.");
  const dueDate = required(formData, "dueDate", "Informe o vencimento.");
  const status = required(formData, "status", "Selecione o status.");
  const totalCents = moneyToCents(required(formData, "total", "Informe o valor."));

  if (isActionState(vendorId)) return vendorId;
  if (isActionState(category)) return category;
  if (isActionState(payableDate)) return payableDate;
  if (isActionState(dueDate)) return dueDate;
  if (isActionState(status)) return status;
  if (totalCents <= 0) return fail("O valor da obrigação deve ser maior que zero.");

  const paidCents = status === "paid" ? totalCents : 0;
  const balanceCents = totalCents - paidCents;
  const supabase = await createClient();
  const apNumber = nextDocumentNumber("AP");
  const { error } = await supabase.from("accounts_payable").insert({
    ap_number: apNumber,
    vendor_id: vendorId,
    category,
    payable_date: payableDate,
    due_date: dueDate,
    total_cents: totalCents,
    paid_cents: paidCents,
    balance_cents: balanceCents,
    status,
    paid_on: status === "paid" ? payableDate : null,
  });

  if (error) {
    return fail(`Não foi possível criar a obrigação: ${error.message}`);
  }

  await supabase.from("financial_activities").insert({
    title: "Obrigação criada",
    detail: `${apNumber} criada para fornecedor`,
    amount_cents: totalCents,
    tone: status === "overdue" ? "danger" : "warning",
  });

  revalidateFinance();

  return { ok: true, message: `Obrigação ${apNumber} criada com sucesso.` };
}

function required(formData: FormData, key: string, message: string) {
  const value = String(formData.get(key) ?? "").trim();

  if (!value) return fail(message);

  return value;
}

function moneyToCents(value: string | ActionState) {
  if (typeof value !== "string") return 0;

  const normalized = value.replace(/\./g, "").replace(",", ".");
  const amount = Number(normalized);

  if (!Number.isFinite(amount)) return 0;

  return Math.round(amount * 100);
}

function fail(message: string): ActionState {
  return { ok: false, message };
}

function isActionState(value: string | ActionState): value is ActionState {
  return typeof value === "object";
}

function nextDocumentNumber(prefix: string) {
  return `${prefix}-${Date.now().toString().slice(-8)}`;
}

function todayUtc() {
  const now = new Date();

  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

function revalidateFinance() {
  for (const path of financePaths) {
    revalidatePath(path);
  }
}
