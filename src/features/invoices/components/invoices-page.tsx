"use client";

import { signOut } from "@/app/login/actions";
import { createInvoiceAction } from "@/features/finance/actions";
import type { FinanceWorkspaceData } from "@/features/finance/data";
import { FinanceShell } from "@/features/finance-shell/components/finance-shell";
import {
  filterInvoices,
  invoiceStatusLabels,
  quickbooksSyncLabels,
  summarizeInvoices,
} from "@/features/invoices/data";
import type { InvoiceRecord, InvoiceStatusFilter } from "@/features/invoices/types";
import { formatMoney } from "@/lib/finance";
import Link from "next/link";
import type { FormEvent, ReactNode } from "react";
import { useActionState, useState } from "react";

const statusOrder: InvoiceStatusFilter[] = [
  "all",
  "pending",
  "partial",
  "paid",
  "overdue",
];

const badgeTone = {
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  partial: "bg-blue-50 text-blue-700 ring-blue-200",
  paid: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  overdue: "bg-red-50 text-red-700 ring-red-200",
};

const quickbooksTone = {
  synced: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  failed: "bg-red-50 text-red-700 ring-red-200",
  not_synced: "bg-slate-50 text-slate-700 ring-slate-200",
};

type InvoicesPageProps = {
  data: FinanceWorkspaceData;
  userEmail?: string;
};

export function InvoicesPage({ data, userEmail }: InvoicesPageProps) {
  const [activeStatus, setActiveStatus] = useState<InvoiceStatusFilter>("all");
  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);
  const [query, setQuery] = useState("");
  const [invoiceState, invoiceAction, isInvoicePending] = useActionState(
    createInvoiceAction,
    { ok: false, message: "" },
  );
  const visibleInvoices = filterInvoices(data.invoiceRecords, {
    status: activeStatus,
    query,
  });
  const summary = summarizeInvoices(visibleInvoices);

  return (
    <FinanceShell
      currentPath="/invoices"
      eyebrow="Financeiro Alisson Joias"
      title="Faturas"
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
          Fila do QuickBooks monitorada
          <div className="mt-2 font-medium text-[var(--color-gold-200)]">
            2 syncs pendentes e 1 falha para revisar
          </div>
        </div>
      }
    >
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
        <section className="flex flex-col gap-3 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 shadow-[var(--shadow-widget)]">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-sm font-semibold text-[var(--color-graphite-900)]">
                Fila de faturamento com foco em cobrança e sincronização
              </p>
              <p className="mt-1 text-sm text-[var(--color-muted)]">
                Busca por cliente ou invoice, filtros por status e leitura rápida do saldo em aberto.
              </p>
            </div>
            <div role="tablist" aria-label="Filtros de status de faturas" className="flex flex-wrap gap-2">
              {statusOrder.map((status) => (
                <StatusTab
                  key={status}
                  isActive={activeStatus === status}
                  onClick={() => setActiveStatus(status)}
                >
                  {invoiceStatusLabels[status]}
                </StatusTab>
              ))}
            </div>
          </div>

          <form
            className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_11rem_9rem]"
            onSubmit={(event: FormEvent<HTMLFormElement>) => event.preventDefault()}
          >
            <label className="grid gap-2 text-sm font-medium text-[var(--color-graphite-900)]">
              Buscar
              <input
                className="min-h-11 rounded-md border border-[var(--color-border)] bg-white px-3 text-sm text-[var(--color-graphite-950)] shadow-inner outline-none transition placeholder:text-[var(--color-muted)] hover:border-[var(--color-gold-400)] focus:border-[var(--color-gold-500)] focus:ring-2 focus:ring-[var(--color-gold-500)]/22"
                value={query}
                name="busca"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Invoice # ou customer"
                type="search"
              />
            </label>
            <div className="grid gap-2 text-sm font-medium text-[var(--color-graphite-900)]">
              <span>Período</span>
              <div className="inline-flex min-h-11 items-center rounded-md border border-[var(--color-border)] bg-[var(--color-graphite-50)] px-3 text-sm text-[var(--color-graphite-800)]">
                Abril 2026
              </div>
            </div>
            <button
              type="submit"
              className="mt-auto min-h-11 rounded-md bg-[var(--color-gold-500)] px-4 text-sm font-semibold text-[var(--color-graphite-950)] shadow-sm transition hover:bg-[var(--color-gold-400)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold-500)]"
            >
              Aplicar busca
            </button>
          </form>
        </section>

        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            label="Total faturado"
            value={formatMoney(summary.totalInvoicedCents)}
            detail={`${visibleInvoices.length} invoices visíveis`}
          />
          <SummaryCard
            label="Coletado"
            value={formatMoney(summary.collectedCents)}
            detail="Pagamentos já conciliados"
          />
          <SummaryCard
            label="Outstanding"
            value={formatMoney(summary.outstandingCents)}
            detail="Saldo ainda em aberto"
          />
          <SummaryCard
            label="Overdue"
            value={formatMoney(summary.overdueCents)}
            detail="Cobranças que exigem follow-up"
            tone="danger"
          />
        </section>

        <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_20rem]">
          <section className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-widget)]">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-gold-700)]">
                  Operação de cobrança
                </p>
                <h2 className="mt-1 text-base font-semibold tracking-normal text-[var(--color-graphite-950)]">
                  Lista de faturas
                </h2>
              </div>
              <span className="rounded px-2.5 py-1 text-xs font-semibold ring-1 ring-blue-200 bg-blue-50 text-blue-700">
                {visibleInvoices.length} resultados
              </span>
            </div>

            {visibleInvoices.length === 0 ? (
              <div className="rounded-md border border-dashed border-[var(--color-border)] px-4 py-10 text-center">
                <p className="text-sm font-semibold text-[var(--color-graphite-900)]">
                  Nenhuma fatura encontrada
                </p>
                <p className="mt-1 text-sm text-[var(--color-muted)]">
                  Ajuste os filtros ou a busca para revisar outro conjunto de invoices.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[86rem] table-fixed border-separate border-spacing-0 text-left text-sm">
                  <colgroup>
                    <col className="w-[7%]" />
                    <col className="w-[18%]" />
                    <col className="w-[12%]" />
                    <col className="w-[8%]" />
                    <col className="w-[8%]" />
                    <col className="w-[9%]" />
                    <col className="w-[9%]" />
                    <col className="w-[9%]" />
                    <col className="w-[8%]" />
                    <col className="w-[12%]" />
                  </colgroup>
                  <thead>
                    <tr className="text-xs uppercase tracking-[0.12em] text-[var(--color-muted)]">
                      <th className="border-b border-[var(--color-border)] pb-3 pr-4 font-semibold">Invoice #</th>
                      <th className="border-b border-[var(--color-border)] pb-3 pr-4 font-semibold">Customer</th>
                      <th className="border-b border-[var(--color-border)] pb-3 pr-4 font-semibold">Type</th>
                      <th className="border-b border-[var(--color-border)] pb-3 pr-4 font-semibold">Date</th>
                      <th className="border-b border-[var(--color-border)] pb-3 pr-4 font-semibold">Due Date</th>
                      <th className="border-b border-[var(--color-border)] pb-3 pr-4 font-semibold">Total</th>
                      <th className="border-b border-[var(--color-border)] pb-3 pr-4 font-semibold">Paid</th>
                      <th className="border-b border-[var(--color-border)] pb-3 pr-4 font-semibold">Balance</th>
                      <th className="border-b border-[var(--color-border)] pb-3 pr-4 font-semibold">Status</th>
                      <th className="border-b border-[var(--color-border)] pb-3 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleInvoices.map((invoice) => (
                      <InvoiceRow key={invoice.id} invoice={invoice} />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <aside className="grid content-start gap-5">
            <section className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-widget)]">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-gold-700)]">
                QuickBooks
              </p>
              <h2 className="mt-1 text-base font-semibold tracking-normal text-[var(--color-graphite-950)]">
                Sync indicator
              </h2>
              <div className="mt-4 grid gap-3">
                <MiniMetric label="Synced" value={countQuickbooks("synced", visibleInvoices)} tone="success" />
                <MiniMetric label="Pending" value={countQuickbooks("pending", visibleInvoices)} tone="warning" />
                <MiniMetric label="Failed" value={countQuickbooks("failed", visibleInvoices)} tone="danger" />
              </div>
            </section>

            <section className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-widget)]">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-gold-700)]">
                Cobrança
              </p>
              <h2 className="mt-1 text-base font-semibold tracking-normal text-[var(--color-graphite-950)]">
                Payment reminders
              </h2>
              <div className="mt-4 space-y-3">
                {visibleInvoices
                  .filter((invoice) => invoice.balanceCents > 0)
                  .slice(0, 3)
                  .map((invoice) => (
                    <div key={invoice.id} className="rounded-md border border-[var(--color-border)] bg-white px-3 py-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-[var(--color-graphite-900)]">
                            {invoice.invoiceNumber}
                          </p>
                          <p className="text-xs text-[var(--color-muted)]">{invoice.customerName}</p>
                        </div>
                        <span className={`rounded px-2 py-1 text-xs font-semibold ring-1 ${badgeTone[invoice.status]}`}>
                          {invoiceStatusLabels[invoice.status]}
                        </span>
                      </div>
                      <p className="mt-2 font-mono text-sm font-medium text-[var(--color-graphite-900)]">
                        {formatMoney(invoice.balanceCents)}
                      </p>
                    </div>
                  ))}
              </div>
            </section>
          </aside>
        </section>
      </div>
    </FinanceShell>
  );
}

function StatusTab({
  children,
  isActive,
  onClick,
}: {
  children: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={onClick}
      className={
        isActive
          ? "inline-flex min-h-10 items-center rounded-md border border-[var(--color-gold-400)] bg-[var(--color-gold-500)] px-3 text-sm font-semibold text-[var(--color-graphite-950)]"
          : "inline-flex min-h-10 items-center rounded-md border border-[var(--color-border)] bg-white px-3 text-sm font-medium text-[var(--color-graphite-800)] transition hover:border-[var(--color-gold-400)] hover:text-[var(--color-graphite-950)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold-500)]"
      }
    >
      {children}
    </button>
  );
}

function SummaryCard({
  label,
  value,
  detail,
  tone = "neutral",
}: {
  label: string;
  value: string;
  detail: string;
  tone?: "neutral" | "danger";
}) {
  const pillTone =
    tone === "danger"
      ? "bg-red-50 text-red-700 ring-red-200"
      : "bg-blue-50 text-blue-700 ring-blue-200";

  return (
    <article className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-widget)] transition hover:-translate-y-0.5 hover:border-[var(--color-gold-300)] hover:shadow-[var(--shadow-widget-hover)]">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-[var(--color-muted)]">{label}</p>
        <span className={`rounded px-2 py-1 text-xs font-semibold ring-1 ${pillTone}`}>
          Atual
        </span>
      </div>
      <p className="mt-4 font-mono text-2xl font-semibold tracking-normal text-[var(--color-graphite-950)]">
        {value}
      </p>
      <p className="mt-2 text-sm text-[var(--color-muted)]">{detail}</p>
    </article>
  );
}

function InvoiceRow({ invoice }: { invoice: InvoiceRecord }) {
  return (
    <tr>
      <td className="border-b border-[var(--color-border)] py-4 pr-4 align-top font-semibold text-[var(--color-graphite-900)]">
        {invoice.invoiceNumber}
      </td>
      <td className="border-b border-[var(--color-border)] py-4 pr-4 align-top">
        <div className="min-w-0">
          <p className="truncate font-medium text-[var(--color-graphite-900)]">{invoice.customerName}</p>
          <p className="text-xs text-[var(--color-muted)]">{invoice.customerSegment}</p>
        </div>
      </td>
      <td className="border-b border-[var(--color-border)] py-4 pr-4 align-top text-[var(--color-muted)]">
        {invoice.orderType}
      </td>
      <td className="border-b border-[var(--color-border)] py-4 pr-4 align-top font-mono text-[var(--color-muted)] whitespace-nowrap">
        {formatShortDate(invoice.issuedOn)}
      </td>
      <td className="border-b border-[var(--color-border)] py-4 pr-4 align-top font-mono text-[var(--color-muted)] whitespace-nowrap">
        {formatShortDate(invoice.dueOn)}
      </td>
      <td className="border-b border-[var(--color-border)] py-4 pr-4 align-top font-mono font-medium whitespace-nowrap">
        {formatMoney(invoice.totalCents)}
      </td>
      <td className="border-b border-[var(--color-border)] py-4 pr-4 align-top font-mono text-[var(--color-muted)] whitespace-nowrap">
        {formatMoney(invoice.paidCents)}
      </td>
      <td className="border-b border-[var(--color-border)] py-4 pr-4 align-top font-mono font-medium text-[var(--color-graphite-900)] whitespace-nowrap">
        {formatMoney(invoice.balanceCents)}
      </td>
      <td className="border-b border-[var(--color-border)] py-4 pr-4 align-top">
        <div className="flex min-w-[7rem] flex-col gap-2">
          <span className={`inline-flex w-fit rounded px-2 py-1 text-xs font-semibold ring-1 ${badgeTone[invoice.status]}`}>
            {invoiceStatusLabels[invoice.status]}
          </span>
          <span className={`inline-flex w-fit rounded px-2 py-1 text-xs font-semibold ring-1 ${quickbooksTone[invoice.quickbooksSyncStatus]}`}>
            {quickbooksSyncLabels[invoice.quickbooksSyncStatus]}
          </span>
        </div>
      </td>
      <td className="border-b border-[var(--color-border)] py-4 align-top">
        <div className="flex min-w-[11.5rem] flex-wrap gap-2">
          <Link
            href={`/invoices/${invoice.id}`}
            className="inline-flex min-h-9 items-center rounded-md border border-[var(--color-border)] bg-white px-2.5 text-xs font-medium text-[var(--color-graphite-800)] transition hover:border-[var(--color-gold-400)] hover:text-[var(--color-graphite-950)]"
          >
            Ver
          </Link>
          <button className="min-h-9 rounded-md border border-[var(--color-border)] bg-white px-2.5 text-xs font-medium text-[var(--color-graphite-800)] transition hover:border-[var(--color-gold-400)] hover:text-[var(--color-graphite-950)]">
            Enviar
          </button>
          <button className="min-h-9 rounded-md border border-[var(--color-border)] bg-white px-2.5 text-xs font-medium text-[var(--color-graphite-800)] transition hover:border-[var(--color-gold-400)] hover:text-[var(--color-graphite-950)]">
            Registrar
          </button>
        </div>
      </td>
    </tr>
  );
}

function MiniMetric({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "success" | "warning" | "danger";
}) {
  const classes = {
    success: "text-emerald-700",
    warning: "text-amber-700",
    danger: "text-red-700",
  };

  return (
    <div className="rounded-md border border-[var(--color-border)] bg-white px-3 py-3">
      <p className={`font-mono text-lg font-semibold ${classes[tone]}`}>{value}</p>
      <p className="mt-1 text-xs text-[var(--color-muted)]">{label}</p>
    </div>
  );
}

const fieldClassName =
  "min-h-11 rounded-md border border-[var(--color-border)] bg-white px-3 text-sm text-[var(--color-graphite-950)] outline-none transition focus:border-[var(--color-gold-500)] focus:ring-2 focus:ring-[var(--color-gold-500)]/20";

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
              Criar fatura persistida
            </h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-md border border-[var(--color-border)] px-3 py-2 text-sm">
            Fechar
          </button>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <FormField label="Cliente">
            <select name="customerId" required className={fieldClassName}>
              <option value="">Selecione</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>{customer.label}</option>
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
        <div className="mt-5 flex justify-end">
          <button type="submit" disabled={isPending} className="min-h-10 rounded-md bg-[var(--color-graphite-900)] px-4 text-sm font-semibold text-white disabled:opacity-60">
            {isPending ? "Salvando..." : "Salvar fatura"}
          </button>
        </div>
      </form>
    </div>
  );
}

function FormField({ children, label }: { children: ReactNode; label: string }) {
  return (
    <label className="grid gap-2 text-sm font-medium text-[var(--color-graphite-900)]">
      {label}
      {children}
    </label>
  );
}

function countQuickbooks(
  status: InvoiceRecord["quickbooksSyncStatus"],
  invoices: InvoiceRecord[],
) {
  return invoices.filter((invoice) => invoice.quickbooksSyncStatus === status).length;
}

function formatShortDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  }).format(new Date(`${value}T00:00:00.000Z`));
}
