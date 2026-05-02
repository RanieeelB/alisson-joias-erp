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

export async function createCustomerAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const name = required(formData, "customerName", "Informe o nome do cliente.");
  const email = required(formData, "customerEmail", "Informe o email do cliente.");
  const segment = required(formData, "customerSegment", "Selecione o segmento.");

  if (isActionState(name)) return name;
  if (isActionState(email)) return email;
  if (isActionState(segment)) return segment;

  const phone = optional(formData, "customerPhone");
  const billingCity = optional(formData, "billingCity");
  const billingRegion = optional(formData, "billingRegion");
  const supabase = await createClient();
  const { error } = await supabase.from("customers").insert({
    name,
    email,
    phone,
    segment,
    billing_city: billingCity,
    billing_region: billingRegion,
    billing_country: "BR",
  });

  if (error) {
    return fail(`Não foi possível cadastrar o cliente: ${error.message}`);
  }

  await supabase.from("financial_activities").insert({
    title: "Cliente cadastrado",
    detail: `${name} foi adicionado à carteira financeira`,
    amount_cents: 0,
    tone: "info",
  });

  revalidateFinance();

  return { ok: true, message: `Cliente ${name} cadastrado com sucesso.` };
}

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
    .select("id,customer_id,total_cents,paid_cents")
    .eq("id", invoiceId)
    .single();

  if (invoiceError || !invoice) {
    return fail("Fatura vinculada não encontrada.");
  }

  if (invoice.customer_id !== customerId) {
    return fail("O cliente informado não corresponde à fatura selecionada.");
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

export async function createVendorAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const name = required(formData, "vendorName", "Informe o nome do fornecedor.");
  const category = required(formData, "vendorCategory", "Selecione a categoria.");

  if (isActionState(name)) return name;
  if (isActionState(category)) return category;

  const email = optional(formData, "vendorEmail");
  const phone = optional(formData, "vendorPhone");
  const supabase = await createClient();
  const { error } = await supabase.from("vendors").insert({
    name,
    category,
    email,
    phone,
  });

  if (error) {
    return fail(`Não foi possível cadastrar o fornecedor: ${error.message}`);
  }

  await supabase.from("financial_activities").insert({
    title: "Fornecedor cadastrado",
    detail: `${name} foi adicionado ao Accounts Payable`,
    amount_cents: 0,
    tone: "info",
  });

  revalidateFinance();

  return { ok: true, message: `Fornecedor ${name} cadastrado com sucesso.` };
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

  const paidAmountRaw = optional(formData, "paidAmount");
  const paidCents =
    status === "paid"
      ? totalCents
      : status === "partial" && paidAmountRaw
        ? moneyToCents(paidAmountRaw)
        : 0;
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

export async function editInvoiceAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const invoiceId = required(formData, "invoiceId", "ID da fatura é obrigatório.");
  const dueDate = required(formData, "dueDate", "Informe o vencimento.");
  const status = required(formData, "status", "Selecione o status.");

  if (isActionState(invoiceId)) return invoiceId;
  if (isActionState(dueDate)) return dueDate;
  if (isActionState(status)) return status;

  const notes = optional(formData, "notes");
  const supabase = await createClient();

  const { data: invoice, error: fetchError } = await supabase
    .from("invoices")
    .select("id,invoice_number")
    .eq("id", invoiceId)
    .single();

  if (fetchError || !invoice) {
    return fail("Fatura não encontrada.");
  }

  const { error: updateError } = await supabase
    .from("invoices")
    .update({
      due_date: dueDate,
      status,
      notes: notes ?? null,
    })
    .eq("id", invoiceId);

  if (updateError) {
    return fail(`Não foi possível atualizar a fatura: ${updateError.message}`);
  }

  await supabase.from("financial_activities").insert({
    invoice_id: invoiceId,
    title: "Fatura editada",
    detail: `${invoice.invoice_number} atualizada pela equipe financeira`,
    amount_cents: 0,
    tone: "info",
  });

  revalidateFinance();

  return { ok: true, message: `Fatura ${invoice.invoice_number} atualizada com sucesso.` };
}

/**
 * Logs a statement-related action (view, print, email) to financial_activities.
 * Called from client components when users interact with statement cards.
 */
export async function logStatementActivityAction(
  statementNumber: string,
  action: "view" | "print" | "email",
): Promise<void> {
  const labels: Record<string, string> = {
    view: "Extrato visualizado",
    print: "Extrato impresso",
    email: "Extrato enviado por e-mail",
  };

  const supabase = await createClient();
  await supabase.from("financial_activities").insert({
    title: labels[action] ?? "Ação de extrato",
    detail: `${statementNumber} — ${labels[action]?.toLowerCase() ?? action}`,
    amount_cents: 0,
    tone: "info",
  });
}

function required(formData: FormData, key: string, message: string) {
  const value = String(formData.get(key) ?? "").trim();

  if (!value) return fail(message);

  return value;
}

function optional(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? "").trim();

  return value || null;
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
