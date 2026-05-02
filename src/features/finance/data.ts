import type {
  CategoryRevenue,
  CustomerBalance,
  DashboardInvoiceRecord,
  QuickBooksSyncSummary,
  RevenuePoint,
} from "@/features/dashboard/data";
import { summarizeQuickBooksSync } from "@/features/dashboard/data";
import type { InvoiceRecord } from "@/features/invoices/types";
import type {
  AccountsPayableRecord,
  CustomerReceivableBalance,
  PaymentRecord,
  PayableCategory,
  ReceivableInvoice,
} from "@/features/payments-accounts/types";
import type {
  CashFlowRow,
  CustomerStatement,
  MonthlyReportRow,
  ProfitLossReport,
  TaxQuarterCard,
} from "@/features/statements-reports/types";
import { getAgingBucket } from "@/lib/finance";
import { createAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseServiceEnv } from "@/lib/supabase/env";
import type { createClient } from "@/lib/supabase/server";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

type CustomerRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  segment: string;
  billing_street: string | null;
  billing_city: string | null;
  billing_region: string | null;
  billing_postal_code: string | null;
  billing_country: string | null;
};

type InvoiceRow = {
  id: string;
  invoice_number: string;
  customer_id: string;
  customers: CustomerRow | null;
  order_type: "custom_order" | "repair" | "wholesale" | "retail";
  invoice_date: string;
  due_date: string;
  subtotal_cents: number;
  tax_cents: number;
  total_cents: number;
  paid_cents: number;
  balance_cents: number;
  status: "pending" | "partial" | "paid" | "overdue";
  quickbooks_sync_status: "synced" | "pending" | "failed" | "not_synced";
  notes: string | null;
  invoice_line_items: InvoiceLineItemRow[];
  payments: PaymentRow[];
};

type InvoiceLineItemRow = {
  id: string;
  description: string;
  quantity: number | string;
  unit_price_cents: number;
  tax_cents: number;
  line_total_cents: number;
};

type PaymentRow = {
  id: string;
  payment_number: string;
  invoice_id: string;
  customer_id: string;
  invoices?: { invoice_number: string } | null;
  customers?: { name: string } | null;
  payment_date: string;
  amount_cents: number;
  method: "wire" | "ach" | "credit_card" | "cash" | "check" | "pix";
  status?: "settled" | "pending_deposit" | "credit";
  reference: string | null;
};

type AccountsPayableRow = {
  id: string;
  ap_number: string;
  vendors: { name: string } | null;
  category: "raw_materials" | "components" | "certification" | "services";
  payable_date: string;
  due_date: string;
  total_cents: number;
  paid_cents: number;
  balance_cents: number;
  status: "pending" | "partial" | "paid" | "overdue";
  paid_on: string | null;
};

export type DeclarationRecord = {
  id: string;
  declarationNumber: string;
  title: string;
  customerName: string;
  referencePeriod: string;
  body: string;
  issuedOn: string;
};

export type DeclarationExportRecord = {
  id: string;
  declarationId?: string;
  title: string;
  customerName: string;
  referencePeriod: string;
  issuedOn: string;
  fileName: string;
  storagePath: string;
  downloadUrl: string;
};

export type FinanceSelectOption = {
  id: string;
  label: string;
};

export type FinanceWorkspaceData = {
  accountsPayableRecords: AccountsPayableRecord[];
  cashFlowRows: CashFlowRow[];
  categoryRevenue: CategoryRevenue[];
  customerReceivableBalances: CustomerReceivableBalance[];
  customerStatements: CustomerStatement[];
  customers: FinanceSelectOption[];
  dashboardAsOf: Date;
  declarations: DeclarationRecord[];
  declarationExports: DeclarationExportRecord[];
  invoiceRecords: InvoiceRecord[];
  monthlyReportRows: MonthlyReportRow[];
  openReceivableInvoices: ReceivableInvoice[];
  paymentRecords: PaymentRecord[];
  profitLossReport: ProfitLossReport;
  quickBooksSyncSummary: QuickBooksSyncSummary;
  recentActivity: Array<{
    id: string;
    title: string;
    detail: string;
    amountCents: number;
    tone: "success" | "warning" | "info" | "danger";
    time: string;
  }>;
  revenueSeries: RevenuePoint[];
  taxQuarterCards: TaxQuarterCard[];
  topCustomers: CustomerBalance[];
  vendors: FinanceSelectOption[];
};

const orderTypeLabels = {
  custom_order: "Pedido Personalizado",
  repair: "Reparo",
  wholesale: "Atacado",
  retail: "Varejo",
} as const;

const orderTypeCategoryLabels = {
  custom_order: "Pedidos Personalizados",
  repair: "Reparos",
  wholesale: "Atacado",
  retail: "Varejo",
} as const;

const categoryColors = {
  "Pedidos Personalizados": "#d2a84f",
  Reparos: "#3b82f6",
  Atacado: "#10b981",
  Varejo: "#ef4444",
} as const;

const paymentMethodLabels = {
  ach: "ACH",
  wire: "Transferência",
  credit_card: "Cartão de crédito",
  cash: "Dinheiro",
  check: "Check",
  pix: "Pix",
} as const;

const payableCategoryLabels: Record<AccountsPayableRow["category"], PayableCategory> = {
  certification: "Certificação",
  components: "Componentes",
  raw_materials: "Matéria-prima",
  services: "Serviços",
};

export async function loadFinanceWorkspace(
  supabase: SupabaseClient,
): Promise<FinanceWorkspaceData> {
  const [
    invoiceResult,
    paymentResult,
    payableResult,
    customerResult,
    vendorResult,
    activityResult,
    declarationResult,
  ] = await Promise.all([
    supabase
      .from("invoices")
      .select("*, customers(*), invoice_line_items(*), payments(*)")
      .order("invoice_date", { ascending: false }),
    supabase
      .from("payments")
      .select("*, invoices(invoice_number), customers(name)")
      .order("payment_date", { ascending: false }),
    supabase
      .from("accounts_payable")
      .select("*, vendors(name)")
      .order("due_date", { ascending: true }),
    supabase.from("customers").select("*").order("name", { ascending: true }),
    supabase.from("vendors").select("*").order("name", { ascending: true }),
    supabase
      .from("financial_activities")
      .select("*")
      .order("occurred_at", { ascending: false })
      .limit(8),
    supabase.from("declarations").select("*, customers(name)").order("issued_on", {
      ascending: false,
    }),
  ]);

  assertSupabase(invoiceResult.error, "faturas");
  assertSupabase(paymentResult.error, "pagamentos");
  assertSupabase(payableResult.error, "obrigações");
  assertSupabase(customerResult.error, "clientes");
  assertSupabase(vendorResult.error, "fornecedores");
  assertSupabase(activityResult.error, "atividades");
  assertSupabase(declarationResult.error, "declarações");

  const invoiceRows = (invoiceResult.data ?? []) as InvoiceRow[];
  const paymentRows = (paymentResult.data ?? []) as PaymentRow[];
  const payableRows = (payableResult.data ?? []) as AccountsPayableRow[];
  const customerRows = (customerResult.data ?? []) as CustomerRow[];
  const vendorRows = (vendorResult.data ?? []) as Array<{ id: string; name: string }>;
  const declarations = ((declarationResult.data ?? []) as Array<{
    id: string;
    declaration_number: string;
    title: string;
    reference_period: string;
    body: string;
    issued_on: string;
    customers: { name: string } | null;
  }>).map((declaration) => ({
    id: declaration.id,
    declarationNumber: declaration.declaration_number,
    title: declaration.title,
    customerName: declaration.customers?.name ?? "Cliente não informado",
    referencePeriod: declaration.reference_period,
    body: declaration.body,
    issuedOn: declaration.issued_on,
  }));

  const invoiceRecords = invoiceRows.map(mapInvoice);
  const paymentRecords = paymentRows.map(mapPayment);
  const accountsPayableRecords = payableRows.map(mapPayable);
  const dashboardAsOf = new Date();
  const declarationExports = await loadDeclarationExports(supabase, declarations);
  const openReceivableInvoices = invoiceRecords
    .filter((invoice) => invoice.balanceCents > 0)
    .map<ReceivableInvoice>((invoice) => ({
      id: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      customerName: invoice.customerName,
      dueOn: invoice.dueOn,
      balanceCents: invoice.balanceCents,
      status: invoice.status === "paid" ? "pending" : invoice.status,
    }));

  return {
    accountsPayableRecords,
    cashFlowRows: buildCashFlowRows(paymentRecords, accountsPayableRecords),
    categoryRevenue: buildCategoryRevenue(invoiceRows),
    customerReceivableBalances: buildCustomerBalances(invoiceRecords, paymentRecords),
    customerStatements: buildStatements(invoiceRecords),
    customers: customerRows.map((customer) => ({
      id: customer.id,
      label: customer.name,
    })),
    dashboardAsOf,
    declarations,
    declarationExports,
    invoiceRecords,
    monthlyReportRows: buildMonthlyReportRows(invoiceRecords, accountsPayableRecords),
    openReceivableInvoices,
    paymentRecords,
    profitLossReport: buildProfitLoss(invoiceRecords, accountsPayableRecords),
    quickBooksSyncSummary: summarizeQuickBooksSync(invoiceRecords),
    recentActivity: ((activityResult.data ?? []) as Array<{
      id: string;
      title: string;
      detail: string;
      amount_cents: number;
      tone: "success" | "warning" | "info" | "danger";
      occurred_at: string;
    }>).map((activity) => ({
      id: activity.id,
      title: activity.title,
      detail: activity.detail,
      amountCents: activity.amount_cents,
      tone: activity.tone,
      time: formatRelativeTime(activity.occurred_at),
    })),
    revenueSeries: buildRevenueSeries(invoiceRecords),
    taxQuarterCards: buildTaxCards(invoiceRecords),
    topCustomers: buildTopCustomers(invoiceRecords),
    vendors: vendorRows.map((vendor) => ({ id: vendor.id, label: vendor.name })),
  };
}

export async function loadInvoiceById(supabase: SupabaseClient, id: string) {
  const result = await supabase
    .from("invoices")
    .select("*, customers(*), invoice_line_items(*), payments(*)")
    .eq("id", id)
    .single();

  if (result.error || !result.data) {
    return null;
  }

  return mapInvoice(result.data as InvoiceRow);
}

export async function loadDeclarationById(supabase: SupabaseClient, id: string) {
  const result = await supabase
    .from("declarations")
    .select("*, customers(name)")
    .eq("id", id)
    .single();

  if (result.error || !result.data) {
    return null;
  }

  const declaration = result.data as {
    id: string;
    declaration_number: string;
    title: string;
    reference_period: string;
    body: string;
    issued_on: string;
    customers: { name: string } | null;
  };

  return {
    id: declaration.id,
    declarationNumber: declaration.declaration_number,
    title: declaration.title,
    customerName: declaration.customers?.name ?? "Cliente não informado",
    referencePeriod: declaration.reference_period,
    body: declaration.body,
    issuedOn: declaration.issued_on,
  } satisfies DeclarationRecord;
}

async function loadDeclarationExports(
  supabase: SupabaseClient,
  declarations: DeclarationRecord[],
) {
  const storageClient = hasSupabaseServiceEnv() ? createAdminClient() : supabase;
  const storagePaths = await collectStorageFiles(storageClient, "declarations");
  if (storagePaths.length === 0) {
    return [] satisfies DeclarationExportRecord[];
  }

  const declarationById = new Map(declarations.map((declaration) => [declaration.id, declaration]));
  const signedUrlResults = await Promise.all(
    storagePaths.map(async (storagePath) => ({
      storagePath,
      result: await storageClient.storage
        .from("finance-exports")
        .createSignedUrl(storagePath, 60 * 60),
    })),
  );

  return signedUrlResults
    .flatMap(({ storagePath, result }) => {
      if (result.error || !result.data?.signedUrl) {
        return [];
      }

      const segments = storagePath.split("/");
      const declarationId = segments[1];
      const issuedOn = segments[2] ?? "";
      const fileName = segments.at(-1) ?? "declaracao.pdf";
      const declaration = declarationId ? declarationById.get(declarationId) : undefined;

      return [
        {
          id: storagePath,
          declarationId,
          title: declaration?.title ?? formatExportTitle(fileName),
          customerName: declaration?.customerName ?? "Cliente não informado",
          referencePeriod: declaration?.referencePeriod ?? "PDF gerado",
          issuedOn,
          fileName,
          storagePath,
          downloadUrl: result.data.signedUrl,
        } satisfies DeclarationExportRecord,
      ];
    })
    .sort((a, b) => b.issuedOn.localeCompare(a.issuedOn));
}

async function collectStorageFiles(
  supabase: Pick<SupabaseClient, "storage">,
  path: string,
): Promise<string[]> {
  const { data, error } = await supabase.storage.from("finance-exports").list(path, {
    limit: 100,
    sortBy: { column: "name", order: "desc" },
  });

  if (error || !data) {
    return [];
  }

  const nested = await Promise.all(
    data.map(async (entry) => {
      const nextPath = `${path}/${entry.name}`;

      if (entry.name.toLowerCase().endsWith(".pdf")) {
        return [nextPath];
      }

      return collectStorageFiles(supabase, nextPath);
    }),
  );

  return nested.flat();
}

function formatExportTitle(fileName: string) {
  const baseName = fileName.replace(/\.pdf$/i, "");
  const humanized = baseName.replace(/[-_]+/g, " ").trim();

  if (humanized.length === 0) {
    return "PDF gerado";
  }

  return humanized.charAt(0).toUpperCase() + humanized.slice(1);
}

function mapInvoice(row: InvoiceRow): InvoiceRecord {
  const customer = row.customers;
  const address = [
    customer?.billing_street,
    customer?.billing_city,
    customer?.billing_region,
    customer?.billing_postal_code,
    customer?.billing_country,
  ]
    .filter(Boolean)
    .join(", ");

  return {
    id: row.id,
    invoiceNumber: row.invoice_number,
    customerName: customer?.name ?? "Cliente não informado",
    customerSegment: customer?.segment ?? "retail",
    contactName: customer?.name ?? "Cliente não informado",
    billingEmail: customer?.email ?? "",
    billingPhone: customer?.phone ?? "",
    billingAddress: address,
    orderType: orderTypeLabels[row.order_type],
    issuedOn: row.invoice_date,
    dueOn: row.due_date,
    totalCents: row.total_cents,
    paidCents: row.paid_cents,
    balanceCents: row.balance_cents,
    status: row.status,
    quickbooksSyncStatus: row.quickbooks_sync_status,
    paymentTerms: getPaymentTerms(row.invoice_date, row.due_date),
    lineItems: [...(row.invoice_line_items ?? [])]
      .sort((a, b) => a.description.localeCompare(b.description, "pt-BR"))
      .map((item) => ({
        id: item.id,
        description: item.description,
        quantity: Number(item.quantity),
        unitPriceCents: item.unit_price_cents,
        taxCents: item.tax_cents,
        lineTotalCents: item.line_total_cents,
      })),
    payments: [...(row.payments ?? [])]
      .sort((a, b) => b.payment_date.localeCompare(a.payment_date))
      .map((payment) => ({
        id: payment.id,
        paymentNumber: payment.payment_number,
        recordedOn: payment.payment_date,
        amountCents: payment.amount_cents,
        method: paymentMethodLabels[payment.method],
        reference: payment.reference ?? "Sem referência",
      })),
  };
}

function mapPayment(row: PaymentRow): PaymentRecord {
  return {
    id: row.id,
    paymentNumber: row.payment_number,
    invoiceNumber: row.invoices?.invoice_number ?? "Sem fatura",
    customerName: row.customers?.name ?? "Cliente não informado",
    date: row.payment_date,
    amountCents: row.amount_cents,
    method: paymentMethodLabels[row.method],
    reference: row.reference ?? "Sem referência",
    status: row.status ?? "settled",
    creditCents: row.status === "credit" ? row.amount_cents : undefined,
  };
}

function mapPayable(row: AccountsPayableRow): AccountsPayableRecord {
  return {
    id: row.id,
    apNumber: row.ap_number,
    vendorName: row.vendors?.name ?? "Fornecedor não informado",
    category: payableCategoryLabels[row.category],
    date: row.payable_date,
    dueOn: row.due_date,
    totalCents: row.total_cents,
    paidCents: row.paid_cents,
    balanceCents: row.balance_cents,
    status: row.status,
    paidOn: row.paid_on ?? undefined,
  };
}

function buildRevenueSeries(invoices: InvoiceRecord[]): RevenuePoint[] {
  return monthKeys(6).map(({ key, label }) => {
    const monthInvoices = invoices.filter((invoice) => invoice.issuedOn.startsWith(key));
    const revenueCents = sum(monthInvoices, "totalCents");

    return {
      month: label,
      revenueCents,
      profitCents: Math.round(revenueCents * 0.42),
    };
  });
}

function buildCategoryRevenue(rows: InvoiceRow[]): CategoryRevenue[] {
  const totals = new Map<CategoryRevenue["label"], number>();

  for (const row of rows) {
    const label = orderTypeCategoryLabels[row.order_type];
    totals.set(label, (totals.get(label) ?? 0) + row.total_cents);
  }

  return Object.entries(categoryColors).map(([label, color]) => ({
    label: label as CategoryRevenue["label"],
    valueCents: totals.get(label as CategoryRevenue["label"]) ?? 0,
    color,
  }));
}

function buildTopCustomers(invoices: InvoiceRecord[]): CustomerBalance[] {
  const balances = new Map<string, CustomerBalance>();

  for (const invoice of invoices) {
    const current = balances.get(invoice.customerName) ?? {
      name: invoice.customerName,
      segment: invoice.customerSegment,
      balanceCents: 0,
      overdueCents: 0,
    };
    current.balanceCents += invoice.balanceCents;
    current.overdueCents += invoice.status === "overdue" ? invoice.balanceCents : 0;
    balances.set(invoice.customerName, current);
  }

  return [...balances.values()]
    .sort((a, b) => b.balanceCents - a.balanceCents)
    .slice(0, 5);
}

function buildCustomerBalances(
  invoices: InvoiceRecord[],
  payments: PaymentRecord[],
): CustomerReceivableBalance[] {
  const balances = new Map<string, CustomerReceivableBalance>();

  for (const invoice of invoices) {
    const current = balances.get(invoice.customerName) ?? {
      customerName: invoice.customerName,
      currentCents: 0,
      overdueCents: 0,
      creditAvailableCents: 0,
    };

    if (invoice.status === "overdue") {
      current.overdueCents += invoice.balanceCents;
    } else {
      current.currentCents += invoice.balanceCents;
    }

    balances.set(invoice.customerName, current);
  }

  for (const payment of payments) {
    if (payment.status === "credit") {
      const current = balances.get(payment.customerName) ?? {
        customerName: payment.customerName,
        currentCents: 0,
        overdueCents: 0,
        creditAvailableCents: 0,
      };
      current.creditAvailableCents += payment.creditCents ?? payment.amountCents;
      balances.set(payment.customerName, current);
    }
  }

  return [...balances.values()];
}

function buildStatements(invoices: InvoiceRecord[]): CustomerStatement[] {
  const grouped = new Map<string, InvoiceRecord[]>();

  for (const invoice of invoices) {
    grouped.set(invoice.customerName, [...(grouped.get(invoice.customerName) ?? []), invoice]);
  }

  return [...grouped.entries()].map(([customerName, customerInvoices], index) => {
    const sorted = [...customerInvoices].sort((a, b) => b.issuedOn.localeCompare(a.issuedOn));

    return {
      id: sorted[0]?.id ?? customerName,
      customerName,
      invoiceCount: customerInvoices.length,
      balanceCents: sum(customerInvoices, "balanceCents"),
      lastInvoiceDate: sorted[0]?.issuedOn ?? new Date().toISOString().slice(0, 10),
      statementNumber: `STM-2026-${String(index + 51).padStart(3, "0")}`,
      segment: getStatementSegment(sorted[0]?.orderType),
      actions: ["view", "print", "email"],
    };
  });
}

function buildMonthlyReportRows(
  invoices: InvoiceRecord[],
  payables: AccountsPayableRecord[],
): MonthlyReportRow[] {
  return monthKeys(6).map(({ key, label }) => {
    const revenueCents = sum(
      invoices.filter((invoice) => invoice.issuedOn.startsWith(key)),
      "totalCents",
    );
    const expensesCents = sum(
      payables.filter((payable) => payable.date.startsWith(key)),
      "totalCents",
    );

    return {
      month: label,
      revenueCents,
      expensesCents,
      profitCents: revenueCents - expensesCents,
    };
  });
}

function buildCashFlowRows(
  payments: PaymentRecord[],
  payables: AccountsPayableRecord[],
): CashFlowRow[] {
  return monthKeys(1).map(({ key, label }) => ({
    month: label,
    inflowsCents: sum(
      payments.filter((payment) => payment.date.startsWith(key)),
      "amountCents",
    ),
    outflowsCents: sum(
      payables.filter((payable) => payable.paidOn?.startsWith(key)),
      "paidCents",
    ),
  }));
}

function buildProfitLoss(
  invoices: InvoiceRecord[],
  payables: AccountsPayableRecord[],
): ProfitLossReport {
  const currentMonth = new Date().toISOString().slice(0, 7);
  const revenueCents = sum(
    invoices.filter((invoice) => invoice.issuedOn.startsWith(currentMonth)),
    "totalCents",
  );
  const cogsCents = sum(
    payables.filter(
      (payable) =>
        payable.date.startsWith(currentMonth) &&
        (payable.category === "Matéria-prima" || payable.category === "Componentes"),
    ),
    "totalCents",
  );
  const operatingExpensesCents = sum(
    payables.filter(
      (payable) =>
        payable.date.startsWith(currentMonth) &&
        (payable.category === "Certificação" || payable.category === "Serviços"),
    ),
    "totalCents",
  );

  return { revenueCents, cogsCents, operatingExpensesCents };
}

function buildTaxCards(invoices: InvoiceRecord[]): TaxQuarterCard[] {
  const currentYear = new Date().getUTCFullYear();

  return [1, 2, 3].map((quarter) => {
    const startMonth = (quarter - 1) * 3;
    const collectedCents = invoices
      .filter((invoice) => {
        const issued = new Date(`${invoice.issuedOn}T00:00:00.000Z`);
        return (
          issued.getUTCFullYear() === currentYear &&
          issued.getUTCMonth() >= startMonth &&
          issued.getUTCMonth() < startMonth + 3
        );
      })
      .reduce((total, invoice) => total + Math.round(invoice.totalCents * 0.05), 0);

    return {
      quarter: `Q${quarter} ${currentYear}`,
      collectedCents,
      payableCents: quarter === 2 ? Math.round(collectedCents * 0.35) : 0,
      status: quarter === 1 ? "filed" : quarter === 2 ? "due" : "projected",
    };
  });
}

function monthKeys(count: number) {
  const now = new Date();

  return Array.from({ length: count }, (_, index) => {
    const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (count - 1 - index), 1));
    const key = date.toISOString().slice(0, 7);
    const label = new Intl.DateTimeFormat("pt-BR", {
      month: "short",
      timeZone: "UTC",
    })
      .format(date)
      .replace(".", "");

    return {
      key,
      label: label.charAt(0).toUpperCase() + label.slice(1),
    };
  });
}

function sum<T>(items: T[], key: keyof T) {
  return items.reduce((total, item) => total + Number(item[key] ?? 0), 0);
}

function getPaymentTerms(invoiceDate: string, dueDate: string) {
  const issued = new Date(`${invoiceDate}T00:00:00.000Z`);
  const due = new Date(`${dueDate}T00:00:00.000Z`);
  const days = Math.max(0, Math.round((due.getTime() - issued.getTime()) / 86_400_000));

  return `${days} dias`;
}

function getStatementSegment(orderType?: InvoiceRecord["orderType"]) {
  if (orderType === "Pedido Personalizado") return "Custom Orders";
  if (orderType === "Reparo") return "Repairs";
  if (orderType === "Atacado") return "Wholesale";

  return "Retail";
}

function formatRelativeTime(value: string) {
  const occurred = new Date(value);
  const diffMinutes = Math.max(1, Math.round((Date.now() - occurred.getTime()) / 60_000));

  if (diffMinutes < 60) return `há ${diffMinutes} min`;

  const diffHours = Math.round(diffMinutes / 60);

  if (diffHours < 24) return `há ${diffHours}h`;

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  }).format(occurred);
}

function assertSupabase(error: { message: string } | null, label: string) {
  if (error) {
    throw new Error(`Não foi possível carregar ${label}: ${error.message}`);
  }
}

export function buildDashboardInvoices(invoices: InvoiceRecord[]): DashboardInvoiceRecord[] {
  return invoices.map((invoice) => ({
    invoiceNumber: invoice.invoiceNumber,
    customerName: invoice.customerName,
    orderType: invoice.orderType,
    totalCents: invoice.totalCents,
    paidCents: invoice.paidCents,
    balanceCents: invoice.balanceCents,
    date: invoice.issuedOn,
    dueDate: invoice.dueOn,
    status: invoice.status,
  }));
}

export function buildAgingSummary(invoices: InvoiceRecord[], asOf: Date) {
  const buckets = {
    current: { bucket: "current", label: "Atual", balanceCents: 0, invoiceCount: 0 },
    "1-30": { bucket: "1-30", label: "1-30d", balanceCents: 0, invoiceCount: 0 },
    "31-60": { bucket: "31-60", label: "31-60d", balanceCents: 0, invoiceCount: 0 },
    "61-90": { bucket: "61-90", label: "61-90d", balanceCents: 0, invoiceCount: 0 },
    "90+": { bucket: "90+", label: "90+", balanceCents: 0, invoiceCount: 0 },
  };

  for (const invoice of invoices.filter((item) => item.balanceCents > 0)) {
    const bucket = getAgingBucket(invoice.dueOn, asOf);
    buckets[bucket].balanceCents += invoice.balanceCents;
    buckets[bucket].invoiceCount += 1;
  }

  return Object.values(buckets);
}
