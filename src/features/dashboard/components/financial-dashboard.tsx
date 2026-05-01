"use client";

import type { CSSProperties, ReactNode } from "react";
import { useActionState, useState } from "react";
import {
  buildCategoryDonutSegments,
  buildRevenueChartScale,
} from "@/features/dashboard/chart-math";
import {
  type Activity,
  type AgingSummary,
  type CategoryRevenue,
  type CustomerBalance,
  type RevenuePoint,
} from "@/features/dashboard/data";
import {
  createCustomerAction,
  createInvoiceAction,
} from "@/features/finance/actions";
import {
  buildAgingSummary,
  buildDashboardInvoices,
  type FinanceWorkspaceData,
} from "@/features/finance/data";
import { FinanceShell } from "@/features/finance-shell/components/finance-shell";
import {
  formatCompactMoney,
  formatMoney,
  summarizeDashboard,
} from "@/lib/finance";
import { signOut } from "@/app/login/actions";

export type DashboardViewState = "ready" | "loading" | "error" | "empty";

type WidgetState = Exclude<DashboardViewState, "empty">;

const toneClass = {
  success: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  warning: "bg-amber-50 text-amber-700 ring-amber-200",
  info: "bg-blue-50 text-blue-700 ring-blue-200",
  danger: "bg-red-50 text-red-700 ring-red-200",
};

export function FinancialDashboard({
  data,
  userEmail,
  viewState = "ready",
}: {
  data: FinanceWorkspaceData;
  userEmail?: string;
  viewState?: DashboardViewState;
}) {
  const [isCreatingCustomer, setIsCreatingCustomer] = useState(false);
  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);
  const [customerState, customerAction, isCustomerPending] = useActionState(
    createCustomerAction,
    { ok: false, message: "" },
  );
  const [invoiceState, invoiceAction, isInvoicePending] = useActionState(
    createInvoiceAction,
    { ok: false, message: "" },
  );
  const isLoading = viewState === "loading";
  const hasError = viewState === "error";
  const isEmpty = viewState === "empty";
  const widgetState: WidgetState = isLoading
    ? "loading"
    : hasError
      ? "error"
      : "ready";
  const dashboardInvoices = buildDashboardInvoices(data.invoiceRecords);
  const visibleInvoices = isEmpty ? [] : dashboardInvoices;
  const visibleAgingSummary = isEmpty
    ? []
    : buildAgingSummary(data.invoiceRecords, data.dashboardAsOf);
  const visibleRevenueSeries = isEmpty ? [] : data.revenueSeries;
  const visibleCategoryRevenue = isEmpty ? [] : data.categoryRevenue;
  const visibleTopCustomers = isEmpty ? [] : data.topCustomers;
  const visibleActivity = isEmpty ? [] : data.recentActivity;
  const summary = summarizeDashboard(visibleInvoices, data.dashboardAsOf);

  return (
    <FinanceShell
      currentPath="/dashboard"
      eyebrow="Financeiro Alisson Joias"
      title="Painel Financeiro"
      userEmail={userEmail}
      secondaryAction={
        <a
          href="/api/exports/dashboard"
          target="_blank"
          className="hidden min-h-10 rounded-md border border-[var(--color-border)] bg-white px-3 text-sm font-medium text-[var(--color-graphite-800)] shadow-sm transition hover:border-[var(--color-gold-400)] hover:text-[var(--color-graphite-950)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold-500)] sm:inline-flex sm:items-center"
        >
          Exportar
        </a>
      }
      primaryAction={
        <>
          <button
            type="button"
            onClick={() => setIsCreatingCustomer(true)}
            className="min-h-10 rounded-md border border-[var(--color-border)] bg-white px-3 text-sm font-medium text-[var(--color-graphite-800)] shadow-sm transition hover:border-[var(--color-gold-400)] hover:text-[var(--color-graphite-950)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold-500)]"
          >
            Novo Cliente
          </button>
          <button
            type="button"
            onClick={() => setIsCreatingInvoice(true)}
            className="min-h-10 rounded-md bg-[var(--color-graphite-900)] px-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--color-graphite-800)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold-500)]"
          >
            Nova Fatura
          </button>
          <form action={signOut}>
            <button className="min-h-10 rounded-md border border-[var(--color-border)] bg-white px-3 text-sm font-medium text-[var(--color-graphite-800)] shadow-sm transition hover:border-red-300 hover:text-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400">
              Sair
            </button>
          </form>
        </>
      }
      footer={
        <div className="rounded-md bg-white/8 p-3 text-xs leading-5 text-white/72">
          Dados persistidos no Supabase
          <div className="mt-2 font-medium text-[var(--color-gold-200)]">
            Limite da integração QuickBooks visível
          </div>
        </div>
      }
    >
      {isCreatingCustomer ? (
        <CustomerDialog
          action={customerAction}
          isPending={isCustomerPending}
          message={customerState.message}
          ok={customerState.ok}
          onClose={() => setIsCreatingCustomer(false)}
        />
      ) : null}
      {isCreatingInvoice ? (
        <InvoiceDialog
          action={invoiceAction}
          customers={data.customers}
          isPending={isInvoicePending}
          message={invoiceState.message}
          ok={invoiceState.ok}
          onClose={() => setIsCreatingInvoice(false)}
        />
      ) : null}
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-5 px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
        <HeaderActions viewState={viewState} />
        <section
          aria-label="Resumo de KPIs financeiros"
          className="grid gap-3 md:grid-cols-2 xl:grid-cols-4"
        >
          {isLoading ? (
            <>
              <KpiSkeleton />
              <KpiSkeleton />
              <KpiSkeleton />
              <KpiSkeleton />
            </>
          ) : hasError ? (
            <>
              <KpiErrorCard label="Receita Total" />
              <KpiErrorCard label="Contas a Receber" />
              <KpiErrorCard label="Faturas do Mês" />
              <KpiErrorCard label="Faturas em Atraso" />
            </>
          ) : (
            <>
              <KpiCard
                label="Receita Total"
                value={formatMoney(summary.totalRevenueCents)}
                detail={isEmpty ? "Sem faturamento no período" : "+14,8% vs mês anterior"}
                tone="positive"
              />
              <KpiCard
                label="Contas a Receber"
                value={formatMoney(summary.arOutstandingCents)}
                detail={isEmpty ? "Nenhuma fatura em aberto" : "5 faturas em aberto"}
                tone="warning"
              />
              <KpiCard
                label="Faturas do Mês"
                value={summary.invoicesThisMonth.toString()}
                detail={isEmpty ? "Nenhuma fatura emitida" : "Pedidos personalizados lideram o volume"}
                tone="neutral"
              />
              <KpiCard
                label="Faturas em Atraso"
                value={summary.overdueInvoices.toString()}
                detail={formatMoney(
                  (visibleAgingSummary[1]?.balanceCents ?? 0) +
                    (visibleAgingSummary[2]?.balanceCents ?? 0) +
                    (visibleAgingSummary[3]?.balanceCents ?? 0),
                )}
                tone="danger"
              />
            </>
          )}
        </section>

        <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="grid min-w-0 gap-5">
            <div className="grid gap-5 2xl:grid-cols-[minmax(0,1.45fr)_minmax(20rem,0.75fr)]">
              <RevenueProfitChart data={visibleRevenueSeries} state={widgetState} />
              <CategoryDonut data={visibleCategoryRevenue} state={widgetState} />
            </div>
            <AgingTable data={visibleAgingSummary} state={widgetState} />
          </div>
          <aside className="grid content-start gap-5">
            <TopCustomers data={visibleTopCustomers} state={widgetState} />
            <QuickBooksPanel state={widgetState} />
            <ActivityFeed items={visibleActivity} state={widgetState} />
          </aside>
        </section>
      </div>
    </FinanceShell>
  );
}

function HeaderActions({ viewState }: { viewState: DashboardViewState }) {
  const statePill =
    viewState === "loading"
      ? { tone: "warning" as const, label: "Carregando dados" }
      : viewState === "error"
        ? { tone: "danger" as const, label: "Erro de consulta" }
        : viewState === "empty"
          ? { tone: "info" as const, label: "Sem dados no período" }
          : { tone: "success" as const, label: "Dados disponíveis" };

  return (
    <div className="flex flex-col gap-3 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 shadow-[var(--shadow-widget)] sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-semibold text-[var(--color-graphite-900)]">
          Fechamento de abril em acompanhamento
        </p>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          Receita, aging de contas a receber e fila de sincronização QuickBooks em 30 de abril de 2026.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <StatusPill tone={statePill.tone}>{statePill.label}</StatusPill>
        <StatusPill tone="warning">3 sincronizações pendentes</StatusPill>
        <StatusPill tone="info">Dados reais</StatusPill>
      </div>
    </div>
  );
}

function CustomerDialog({
  action,
  isPending,
  message,
  ok,
  onClose,
}: {
  action: (payload: FormData) => void;
  isPending: boolean;
  message: string;
  ok: boolean;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4">
      <form
        action={action}
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-md border border-[var(--color-border)] bg-white p-5 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-gold-700)]">
              Cadastro financeiro
            </p>
            <h2 className="mt-1 text-lg font-semibold text-[var(--color-graphite-950)]">
              Novo Cliente
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-[var(--color-border)] px-3 py-2 text-sm"
          >
            Fechar
          </button>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <FormField label="Nome do cliente">
            <input
              name="customerName"
              required
              placeholder="Aurora & Co. Fine Jewelry"
              className={fieldClassName}
            />
          </FormField>
          <FormField label="Email financeiro">
            <input
              name="customerEmail"
              type="email"
              required
              placeholder="financeiro@cliente.com"
              className={fieldClassName}
            />
          </FormField>
          <FormField label="Telefone">
            <input
              name="customerPhone"
              placeholder="+55 11 98888-2049"
              className={fieldClassName}
            />
          </FormField>
          <FormField label="Segmento">
            <select name="customerSegment" required className={fieldClassName}>
              <option value="Personalizados de alto ticket">Personalizados de alto ticket</option>
              <option value="Varejo">Varejo</option>
              <option value="Atacado">Atacado</option>
              <option value="Reparos recorrentes">Reparos recorrentes</option>
            </select>
          </FormField>
          <FormField label="Cidade">
            <input name="billingCity" placeholder="São Paulo" className={fieldClassName} />
          </FormField>
          <FormField label="UF">
            <input name="billingRegion" placeholder="SP" className={fieldClassName} />
          </FormField>
        </div>
        <DialogFooter
          isPending={isPending}
          message={message}
          ok={ok}
          submitLabel="Salvar cliente"
        />
      </form>
    </div>
  );
}

function InvoiceDialog({
  action,
  customers,
  isPending,
  message,
  ok,
  onClose,
}: {
  action: (payload: FormData) => void;
  customers: FinanceWorkspaceData["customers"];
  isPending: boolean;
  message: string;
  ok: boolean;
  onClose: () => void;
}) {
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4">
      <form
        action={action}
        className="w-full max-w-2xl rounded-md border border-[var(--color-border)] bg-white p-5 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-gold-700)]">
              Nova Fatura
            </p>
            <h2 className="mt-1 text-lg font-semibold text-[var(--color-graphite-950)]">
              Criar fatura no banco
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-[var(--color-border)] px-3 py-2 text-sm"
          >
            Fechar
          </button>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <FormField label="Cliente">
            <select name="customerId" required className={fieldClassName}>
              <option value="">Selecione</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.label}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Tipo">
            <select name="orderType" required className={fieldClassName}>
              <option value="custom_order">Pedido Personalizado</option>
              <option value="repair">Reparo</option>
              <option value="wholesale">Atacado</option>
              <option value="retail">Varejo</option>
            </select>
          </FormField>
          <FormField label="Emissão">
            <input name="invoiceDate" type="date" required defaultValue={today} className={fieldClassName} />
          </FormField>
          <FormField label="Vencimento">
            <input name="dueDate" type="date" required className={fieldClassName} />
          </FormField>
          <FormField label="Valor sem imposto">
            <input name="subtotal" inputMode="decimal" required placeholder="42850,00" className={fieldClassName} />
          </FormField>
          <FormField label="Descrição">
            <input name="description" required placeholder="Anel 18k com diamante certificado" className={fieldClassName} />
          </FormField>
          </div>
          {message ? (
            <p className={`mt-4 text-sm font-medium ${ok ? "text-emerald-700" : "text-red-700"}`}>
              {message}
            </p>
        ) : null}
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="submit"
            disabled={isPending}
            className="min-h-10 rounded-md bg-[var(--color-graphite-900)] px-4 text-sm font-semibold text-white disabled:opacity-60"
          >
            {isPending ? "Salvando..." : "Salvar fatura"}
          </button>
        </div>
      </form>
    </div>
  );
}

function DialogFooter({
  isPending,
  message,
  ok,
  submitLabel,
}: {
  isPending: boolean;
  message: string;
  ok: boolean;
  submitLabel: string;
}) {
  return (
    <>
      {message ? (
        <p className={`mt-4 text-sm font-medium ${ok ? "text-emerald-700" : "text-red-700"}`}>
          {message}
        </p>
      ) : null}
      <div className="mt-5 flex justify-end gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="min-h-10 rounded-md bg-[var(--color-graphite-900)] px-4 text-sm font-semibold text-white disabled:opacity-60"
        >
          {isPending ? "Salvando..." : submitLabel}
        </button>
      </div>
    </>
  );
}

function KpiCard({
  label,
  value,
  detail,
  tone,
}: {
  label: string;
  value: string;
  detail: string;
  tone: "positive" | "warning" | "neutral" | "danger";
}) {
  const toneStyles = {
    positive: "text-emerald-700 bg-emerald-50 ring-emerald-200",
    warning: "text-amber-700 bg-amber-50 ring-amber-200",
    neutral: "text-blue-700 bg-blue-50 ring-blue-200",
    danger: "text-red-700 bg-red-50 ring-red-200",
  };

  return (
    <article className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-widget)] transition hover:-translate-y-0.5 hover:border-[var(--color-gold-300)] hover:shadow-[var(--shadow-widget-hover)]">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-[var(--color-muted)]">{label}</p>
        <span className={`rounded px-2 py-1 text-xs font-semibold ring-1 ${toneStyles[tone]}`}>
          Ao vivo
        </span>
      </div>
      <p className="mt-4 font-mono text-2xl font-semibold tracking-normal text-[var(--color-graphite-950)]">
        {value}
      </p>
      <p className="mt-2 text-sm text-[var(--color-muted)]">{detail}</p>
    </article>
  );
}

function KpiSkeleton() {
  return (
    <article className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-widget)]">
      <div className="flex items-start justify-between gap-3">
        <SkeletonLine className="h-4 w-28" />
        <SkeletonLine className="h-6 w-14 rounded" />
      </div>
      <SkeletonLine className="mt-4 h-8 w-36" />
      <SkeletonLine className="mt-3 h-4 w-44" />
    </article>
  );
}

function KpiErrorCard({ label }: { label: string }) {
  return (
    <article className="rounded-md border border-red-200 bg-red-50 p-4 shadow-[var(--shadow-widget)]">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-red-800">{label}</p>
        <span className="rounded bg-white px-2 py-1 text-xs font-semibold text-red-700 ring-1 ring-red-200">
          Erro
        </span>
      </div>
      <p className="mt-4 font-mono text-2xl font-semibold text-red-900">--</p>
      <p className="mt-2 text-sm text-red-700">Falha ao carregar este indicador.</p>
    </article>
  );
}

function RevenueProfitChart({
  data,
  state,
}: {
  data: RevenuePoint[];
  state: WidgetState;
}) {
  if (state !== "ready") {
    return (
      <Widget
        title="Receita e Lucro"
        eyebrow="Últimos 6 meses"
        state={state}
        loadingHeightClass="h-[17rem]"
      />
    );
  }

  if (data.length === 0) {
    return (
      <Widget title="Receita e Lucro" eyebrow="Últimos 6 meses">
        <EmptyState
          title="Sem dados de receita"
          detail="Os gráficos serão exibidos quando houver faturas no período."
        />
      </Widget>
    );
  }

  const { plotLeft, plotRight, plotWidth, valueTicks, xFor, yFor } =
    buildRevenueChartScale(data);
  const pathFor = (key: "revenueCents" | "profitCents") =>
    data
      .map(
        (point, index) =>
          `${index === 0 ? "M" : "L"} ${xFor(index)} ${yFor(point[key])}`,
      )
      .join(" ");

  return (
    <Widget
      title="Receita e Lucro"
      eyebrow="Últimos 6 meses"
      action={<span className="font-mono text-sm text-[var(--color-gold-700)]">{formatMoney(data.at(-1)?.revenueCents ?? 0)}</span>}
    >
      <div className="h-[17rem] min-w-0">
        <svg
          aria-label="Tendência de receita e lucro"
          className="h-full w-full overflow-visible"
          viewBox={`0 0 ${plotWidth} 230`}
          role="img"
        >
          {valueTicks.map((value) => {
            const y = yFor(value);

            return (
              <g key={value}>
                <text
                  x="0"
                  y={y + 4}
                  fill="#6f6a60"
                  fontSize="11"
                  textAnchor="start"
                >
                  {formatCompactMoney(value)}
                </text>
                <line
                  x1={plotLeft}
                  x2={plotRight}
                  y1={y}
                  y2={y}
                  stroke="#e7e1d7"
                  strokeWidth="1"
                />
              </g>
            );
          })}
          <path d={pathFor("revenueCents")} fill="none" stroke="#d2a84f" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
          <path d={pathFor("profitCents")} fill="none" stroke="#3b82f6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
          {data.map((point, index) => (
            <g key={point.month}>
              <circle cx={xFor(index)} cy={yFor(point.revenueCents)} fill="#d2a84f" r="5" />
              <circle cx={xFor(index)} cy={yFor(point.profitCents)} fill="#3b82f6" r="4" />
              <text x={xFor(index)} y="218" fill="#6f6a60" fontSize="13" textAnchor="middle">
                {point.month}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <div className="mt-3 flex flex-wrap gap-3 text-sm text-[var(--color-muted)]">
        <LegendSwatch color="#d2a84f">Receita</LegendSwatch>
        <LegendSwatch color="#3b82f6">Lucro</LegendSwatch>
        <span className="font-mono text-[var(--color-graphite-800)]">
          Lucro acumulado {formatMoney(totalFrom(data, "profitCents"))}
        </span>
      </div>
    </Widget>
  );
}

function CategoryDonut({
  data,
  state,
}: {
  data: CategoryRevenue[];
  state: WidgetState;
}) {
  if (state !== "ready") {
    return (
      <Widget
        title="Receita por Categoria"
        eyebrow="Composição de abril"
        state={state}
        loadingHeightClass="h-72"
      />
    );
  }

  if (data.length === 0) {
    return (
      <Widget title="Receita por Categoria" eyebrow="Composição de abril">
        <EmptyState
          title="Sem categorias faturadas"
          detail="A composição de receita aparecerá após a emissão de faturas."
        />
      </Widget>
    );
  }

  const total = data.reduce((sum, item) => sum + item.valueCents, 0);
  const segments = buildCategoryDonutSegments(data);

  if (segments.length === 0) {
    return (
      <Widget title="Receita por Categoria" eyebrow="Composição de abril">
        <EmptyState
          title="Sem categorias faturadas"
          detail="A composição de receita aparecerá após a emissão de faturas."
        />
      </Widget>
    );
  }

  return (
    <Widget title="Receita por Categoria" eyebrow="Composição de abril">
      <div className="grid gap-5 sm:grid-cols-[13rem_1fr] 2xl:grid-cols-1">
        <svg aria-label="Gráfico donut de receita por categoria" className="mx-auto h-52 w-52" viewBox="0 0 120 120" role="img">
          <circle cx="60" cy="60" fill="none" r="42" stroke="#ece7dd" strokeWidth="18" />
          {segments.map((item) => {
            const strokeDasharray = `${item.segment} ${100 - item.segment}`;

            return (
              <circle
                key={item.label}
                cx="60"
                cy="60"
                fill="none"
                r="42"
                stroke={item.color}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={item.offset}
                strokeLinecap="butt"
                strokeWidth="18"
                pathLength="100"
                transform="rotate(-90 60 60)"
              />
            );
          })}
          <text x="60" y="57" fill="#202428" fontSize="9.5" fontWeight="700" textAnchor="middle">
            {formatCompactMoney(total)}
          </text>
          <text x="60" y="74" fill="#6f6a60" fontSize="9" textAnchor="middle">
            faturado
          </text>
        </svg>
        <div className="space-y-3">
          {data.map((item) => (
            <div key={item.label} className="flex items-center justify-between gap-3 text-sm">
              <LegendSwatch color={item.color}>{item.label}</LegendSwatch>
              <span className="font-mono font-medium text-[var(--color-graphite-900)]">
                {formatMoney(item.valueCents)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Widget>
  );
}

function AgingTable({
  data,
  state,
}: {
  data: AgingSummary[];
  state: WidgetState;
}) {
  if (state !== "ready") {
    return (
      <Widget
        title="Resumo por Vencimento"
        eyebrow="Exposição de faturas abertas"
        state={state}
        loadingHeightClass="h-64"
      />
    );
  }

  const total = data.reduce((sum, row) => sum + row.balanceCents, 0);

  return (
    <Widget
      title="Resumo por Vencimento"
      eyebrow="Exposição de faturas abertas"
      action={<span className="font-mono text-sm text-[var(--color-graphite-800)]">{formatMoney(total)}</span>}
    >
      {data.length === 0 ? (
        <EmptyState title="Sem contas a receber abertas" detail="Todos os saldos de clientes estão quitados." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[40rem] border-separate border-spacing-0 text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-[0.12em] text-[var(--color-muted)]">
                <th className="border-b border-[var(--color-border)] pb-3 font-semibold">Faixa</th>
                <th className="border-b border-[var(--color-border)] pb-3 font-semibold">Faturas</th>
                <th className="border-b border-[var(--color-border)] pb-3 font-semibold">Saldo</th>
                <th className="border-b border-[var(--color-border)] pb-3 font-semibold">Exposição</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => {
                const percent = total > 0 ? Math.round((row.balanceCents / total) * 100) : 0;

                return (
                  <tr key={row.bucket} className="group">
                    <td className="border-b border-[var(--color-border)] py-3 font-medium text-[var(--color-graphite-900)]">
                      {row.label}
                    </td>
                    <td className="border-b border-[var(--color-border)] py-3 font-mono text-[var(--color-muted)]">
                      {row.invoiceCount}
                    </td>
                    <td className="border-b border-[var(--color-border)] py-3 font-mono font-medium">
                      {formatMoney(row.balanceCents)}
                    </td>
                    <td className="border-b border-[var(--color-border)] py-3">
                      <Progress value={percent} tone={row.bucket === "current" ? "success" : row.bucket === "90+" ? "danger" : "warning"} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Widget>
  );
}

function TopCustomers({
  data,
  state,
}: {
  data: CustomerBalance[];
  state: WidgetState;
}) {
  if (state !== "ready") {
    return (
      <Widget
        title="Principais Clientes"
        eyebrow="Saldo em aberto"
        state={state}
        loadingHeightClass="h-64"
      />
    );
  }

  const maxBalance = Math.max(...data.map((customer) => customer.balanceCents), 1);

  return (
    <Widget title="Principais Clientes" eyebrow="Saldo em aberto">
      {data.length === 0 ? (
        <EmptyState title="Sem saldos" detail="A exposição por cliente aparecerá aqui." />
      ) : (
        <div className="space-y-4">
          {data.map((customer) => (
            <div key={customer.name} className="space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[var(--color-graphite-900)]">
                    {customer.name}
                  </p>
                  <p className="text-xs text-[var(--color-muted)]">{customer.segment}</p>
                </div>
                <span className="font-mono text-sm font-medium text-[var(--color-graphite-900)]">
                  {formatMoney(customer.balanceCents)}
                </span>
              </div>
              <Progress
                value={Math.round((customer.balanceCents / maxBalance) * 100)}
                tone={customer.overdueCents > 0 ? "warning" : "success"}
              />
            </div>
          ))}
        </div>
      )}
    </Widget>
  );
}

function QuickBooksPanel({ state }: { state: WidgetState }) {
  return (
    <Widget
      title="Sincronização QuickBooks"
      eyebrow="Limite de integração"
      state={state}
      loadingHeightClass="h-36"
    >
      <div className="grid gap-3">
        <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          3 faturas na fila para revisão de sincronização
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <MetricMini label="Sincronizadas" value="18" tone="success" />
          <MetricMini label="Pendentes" value="3" tone="warning" />
          <MetricMini label="Falhas" value="0" tone="danger" />
        </div>
      </div>
    </Widget>
  );
}

function ActivityFeed({
  items,
  state,
}: {
  items: Activity[];
  state: WidgetState;
}) {
  if (state !== "ready") {
    return (
      <Widget
        title="Atividade Recente"
        eyebrow="Eventos financeiros"
        state={state}
        loadingHeightClass="h-72"
      />
    );
  }

  return (
    <Widget title="Atividade Recente" eyebrow="Eventos financeiros">
      {items.length === 0 ? (
        <EmptyState title="Sem atividade ainda" detail="Eventos de faturas e pagamentos aparecerão aqui." />
      ) : (
        <ol className="space-y-4">
          {items.map((item) => (
            <li key={item.id} className="grid grid-cols-[0.625rem_1fr] gap-3">
              <span className={`mt-1.5 h-2.5 w-2.5 rounded-full ring-4 ${toneClass[item.tone]}`} />
              <div className="min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-[var(--color-graphite-900)]">
                    {item.title}
                  </p>
                  <span className="shrink-0 text-xs text-[var(--color-muted)]">{item.time}</span>
                </div>
                <p className="mt-1 text-sm leading-5 text-[var(--color-muted)]">{item.detail}</p>
                {item.amountCents > 0 ? (
                  <p className="mt-1 font-mono text-sm font-medium text-[var(--color-graphite-900)]">
                    {formatMoney(item.amountCents)}
                  </p>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      )}
    </Widget>
  );
}

function Widget({
  title,
  eyebrow,
  action,
  children,
  state = "ready",
  loadingHeightClass = "h-48",
  errorTitle = "Não foi possível carregar",
  errorDetail = "A consulta falhou. Tente novamente ou revise a integração.",
}: {
  title: string;
  eyebrow: string;
  action?: ReactNode;
  children?: ReactNode;
  state?: WidgetState;
  loadingHeightClass?: string;
  errorTitle?: string;
  errorDetail?: string;
}) {
  return (
    <section className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-widget)]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-gold-700)]">
            {eyebrow}
          </p>
          <h2 className="mt-1 text-base font-semibold tracking-normal text-[var(--color-graphite-950)]">
            {title}
          </h2>
        </div>
        {action}
      </div>
      {state === "loading" ? (
        <LoadingBlock className={loadingHeightClass} />
      ) : state === "error" ? (
        <ErrorState title={errorTitle} detail={errorDetail} />
      ) : (
        children
      )}
    </section>
  );
}

function StatusPill({
  children,
  tone,
}: {
  children: ReactNode;
  tone: "success" | "warning" | "info" | "danger";
}) {
  const classes = {
    success: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    warning: "bg-amber-50 text-amber-700 ring-amber-200",
    info: "bg-blue-50 text-blue-700 ring-blue-200",
    danger: "bg-red-50 text-red-700 ring-red-200",
  };

  return (
    <span className={`rounded px-2.5 py-1 text-xs font-semibold ring-1 ${classes[tone]}`}>
      {children}
    </span>
  );
}

function MetricMini({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "success" | "warning" | "danger";
}) {
  const classes = {
    success: "text-emerald-700",
    warning: "text-amber-700",
    danger: "text-red-700",
  };

  return (
    <div className="rounded-md border border-[var(--color-border)] bg-white px-2 py-3">
      <div className={`font-mono text-lg font-semibold ${classes[tone]}`}>{value}</div>
      <div className="mt-1 text-xs text-[var(--color-muted)]">{label}</div>
    </div>
  );
}

function Progress({
  value,
  tone,
}: {
  value: number;
  tone: "success" | "warning" | "danger";
}) {
  const colors = {
    success: "bg-emerald-500",
    warning: "bg-[var(--color-gold-500)]",
    danger: "bg-red-500",
  };
  const style: CSSProperties = { width: `${Math.min(Math.max(value, 0), 100)}%` };

  return (
    <div className="h-2.5 overflow-hidden rounded-full bg-[var(--color-graphite-100)]">
      <div className={`h-full rounded-full ${colors[tone]}`} style={style} />
    </div>
  );
}

function LegendSwatch({ color, children }: { color: string; children: ReactNode }) {
  const style: CSSProperties = { backgroundColor: color };

  return (
    <span className="inline-flex items-center gap-2">
      <span className="h-2.5 w-2.5 rounded-sm" style={style} />
      <span>{children}</span>
    </span>
  );
}

function LoadingBlock({ className }: { className: string }) {
  return (
    <div className={`grid content-start gap-3 ${className}`} aria-busy="true">
      <SkeletonLine className="h-5 w-2/3" />
      <SkeletonLine className="h-5 w-1/2" />
      <SkeletonLine className="h-20 w-full" />
      <SkeletonLine className="h-5 w-3/4" />
    </div>
  );
}

function SkeletonLine({ className }: { className: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-[var(--color-graphite-100)] ${className}`}
    />
  );
}

function ErrorState({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-md border border-red-200 bg-red-50 px-4 py-8 text-center">
      <p className="text-sm font-semibold text-red-800">{title}</p>
      <p className="mx-auto mt-1 max-w-sm text-sm text-red-700">{detail}</p>
      <a
        href="/dashboard"
        className="mt-4 inline-flex min-h-9 items-center rounded-md bg-red-700 px-3 text-sm font-semibold text-white transition hover:bg-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
      >
        Tentar novamente
      </a>
    </div>
  );
}

function EmptyState({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-md border border-dashed border-[var(--color-border)] px-4 py-8 text-center">
      <p className="text-sm font-semibold text-[var(--color-graphite-900)]">{title}</p>
      <p className="mt-1 text-sm text-[var(--color-muted)]">{detail}</p>
    </div>
  );
}

const fieldClassName =
  "min-h-11 rounded-md border border-[var(--color-border)] bg-white px-3 text-sm text-[var(--color-graphite-950)] outline-none transition focus:border-[var(--color-gold-500)] focus:ring-2 focus:ring-[var(--color-gold-500)]/20";

function FormField({ children, label }: { children: ReactNode; label: string }) {
  return (
    <label className="grid gap-2 text-sm font-medium text-[var(--color-graphite-900)]">
      {label}
      {children}
    </label>
  );
}

function totalFrom(data: RevenuePoint[], key: "revenueCents" | "profitCents") {
  return data.reduce((total, point) => total + point[key], 0);
}
