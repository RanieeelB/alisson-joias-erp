import { signOut } from "@/app/login/actions";
import { FinanceShell } from "@/features/finance-shell/components/finance-shell";
import {
  agingBucketLabels,
  customerReceivableBalances,
  getReceivableBalanceScale,
  openReceivableInvoices,
  summarizeReceivableAging,
} from "@/features/payments-accounts/data";
import type { ReceivableAgingSummary, ReceivableInvoice } from "@/features/payments-accounts/types";
import { formatMoney } from "@/lib/finance";
import Link from "next/link";

const asOf = new Date("2026-04-30T12:00:00.000Z");
const agingOrder: (keyof ReceivableAgingSummary)[] = [
  "current",
  "1-30",
  "31-60",
  "61-90",
  "90+",
];

const bucketTone = {
  current: "bg-emerald-600",
  "1-30": "bg-amber-500",
  "31-60": "bg-orange-500",
  "61-90": "bg-red-500",
  "90+": "bg-red-800",
};

const statusTone = {
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  partial: "bg-blue-50 text-blue-700 ring-blue-200",
  overdue: "bg-red-50 text-red-700 ring-red-200",
};

export function AccountsReceivablePage({ userEmail }: { userEmail?: string }) {
  const aging = summarizeReceivableAging(openReceivableInvoices, asOf);
  const balances = getReceivableBalanceScale(customerReceivableBalances);
  const totalAgingCents = agingOrder.reduce((sum, bucket) => sum + aging[bucket], 0);

  return (
    <FinanceShell
      currentPath="/accounts/receivable"
      eyebrow="Financeiro Alisson Joias"
      title="Accounts Receivable"
      userEmail={userEmail}
      secondaryAction={<HeaderLink href="/payments">Pagamentos</HeaderLink>}
      primaryAction={
        <>
          <Link
            href="/accounts/payable"
            className="hidden min-h-10 items-center rounded-md bg-[var(--color-graphite-900)] px-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--color-graphite-800)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold-500)] sm:inline-flex"
          >
            Accounts Payable
          </Link>
          <form action={signOut}>
            <button className="min-h-10 rounded-md border border-[var(--color-border)] bg-white px-3 text-sm font-medium text-[var(--color-graphite-800)] shadow-sm transition hover:border-red-300 hover:text-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400">
              Sair
            </button>
          </form>
        </>
      }
      footer={
        <div className="rounded-md bg-white/8 p-3 text-xs leading-5 text-white/72">
          Aging de Accounts Receivable
          <div className="mt-2 font-medium text-[var(--color-gold-200)]">
            {formatMoney(totalAgingCents)} em invoices abertas
          </div>
        </div>
      }
    >
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-5 px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
        <section className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 shadow-[var(--shadow-widget)]">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-sm font-semibold text-[var(--color-graphite-900)]">
                Aging Analysis, saldos por cliente e reminders para faturas abertas
              </p>
              <p className="mt-1 text-sm text-[var(--color-muted)]">
                Priorização de cobrança para clientes de atacado, reparos e pedidos personalizados.
              </p>
            </div>
            <nav aria-label="Payments and accounts" className="flex flex-wrap gap-2">
              <InactiveTab href="/payments">Pagamentos</InactiveTab>
              <ActiveTab href="/accounts/receivable">Accounts Receivable</ActiveTab>
              <InactiveTab href="/accounts/payable">Accounts Payable</InactiveTab>
            </nav>
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <section className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-widget)]">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-gold-700)]">
              Accounts Receivable
            </p>
            <h2 className="mt-1 text-base font-semibold tracking-normal text-[var(--color-graphite-950)]">
              Aging Analysis
            </h2>
            <div className="mt-5 grid gap-4">
              {agingOrder.map((bucket) => {
                const value = aging[bucket];
                const percent = totalAgingCents > 0 ? Math.round((value / totalAgingCents) * 100) : 0;

                return (
                  <div key={bucket} className="grid gap-2">
                    <div className="flex items-center justify-between gap-4 text-sm">
                      <span className="font-medium text-[var(--color-graphite-900)]">
                        {agingBucketLabels[bucket]}
                      </span>
                      <span className="font-mono text-[var(--color-graphite-900)]">
                        {formatMoney(value)} · {percent}%
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-[var(--color-graphite-100)]">
                      <div
                        className={`h-full rounded-full ${bucketTone[bucket]}`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-widget)]">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-gold-700)]">
              Saldos por cliente
            </p>
            <h2 className="mt-1 text-base font-semibold tracking-normal text-[var(--color-graphite-950)]">
              Balanços proporcionais
            </h2>
            <div className="mt-5 grid gap-4">
              {balances.map((balance) => (
                <div key={balance.customerName} className="grid gap-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-[var(--color-graphite-900)]">
                        {balance.customerName}
                      </p>
                      <p className="text-xs text-[var(--color-muted)]">
                        Vencido {formatMoney(balance.overdueCents)} · Crédito {formatMoney(balance.creditAvailableCents)}
                      </p>
                    </div>
                    <span className="font-mono text-sm font-semibold text-[var(--color-graphite-900)]">
                      {formatMoney(balance.currentCents + balance.overdueCents)}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[var(--color-graphite-100)]">
                    <div
                      className="h-full rounded-full bg-blue-600"
                      style={{ width: `${balance.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </section>

        <section className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-widget)]">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-gold-700)]">
                Faturas abertas
              </p>
              <h2 className="mt-1 text-base font-semibold tracking-normal text-[var(--color-graphite-950)]">
                Lista de reminder
              </h2>
            </div>
            <button className="min-h-10 rounded-md bg-[var(--color-gold-500)] px-3 text-sm font-semibold text-[var(--color-graphite-950)] shadow-sm transition hover:bg-[var(--color-gold-400)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold-500)]">
              Enviar reminder
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[56rem] table-fixed border-separate border-spacing-0 text-left text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-[0.12em] text-[var(--color-muted)]">
                  <th className="border-b border-[var(--color-border)] pb-3 pr-4 font-semibold">Invoice</th>
                  <th className="border-b border-[var(--color-border)] pb-3 pr-4 font-semibold">Customer</th>
                  <th className="border-b border-[var(--color-border)] pb-3 pr-4 font-semibold">Due</th>
                  <th className="border-b border-[var(--color-border)] pb-3 pr-4 font-semibold">Balance</th>
                  <th className="border-b border-[var(--color-border)] pb-3 pr-4 font-semibold">Status</th>
                  <th className="border-b border-[var(--color-border)] pb-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {openReceivableInvoices.map((invoice) => (
                  <ReceivableRow key={invoice.id} invoice={invoice} />
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </FinanceShell>
  );
}

function ReceivableRow({ invoice }: { invoice: ReceivableInvoice }) {
  return (
    <tr className="transition hover:bg-[var(--color-graphite-50)]">
      <td className="border-b border-[var(--color-border)] py-4 pr-4 align-top font-semibold text-[var(--color-graphite-900)]">
        {invoice.invoiceNumber}
      </td>
      <td className="border-b border-[var(--color-border)] py-4 pr-4 align-top font-medium text-[var(--color-graphite-900)]">
        {invoice.customerName}
      </td>
      <td className="border-b border-[var(--color-border)] py-4 pr-4 align-top font-mono text-[var(--color-muted)] whitespace-nowrap">
        {formatShortDate(invoice.dueOn)}
      </td>
      <td className="border-b border-[var(--color-border)] py-4 pr-4 align-top font-mono font-medium whitespace-nowrap">
        {formatMoney(invoice.balanceCents)}
      </td>
      <td className="border-b border-[var(--color-border)] py-4 pr-4 align-top">
        <span className={`inline-flex rounded px-2 py-1 text-xs font-semibold ring-1 ${statusTone[invoice.status]}`}>
          {invoice.status}
        </span>
      </td>
      <td className="border-b border-[var(--color-border)] py-4 align-top">
        <button className="min-h-9 rounded-md border border-[var(--color-border)] bg-white px-2.5 text-xs font-medium text-[var(--color-graphite-800)] transition hover:border-[var(--color-gold-400)] hover:text-[var(--color-graphite-950)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold-500)]">
          Enviar reminder
        </button>
      </td>
    </tr>
  );
}

function ActiveTab({ href, children }: { href: string; children: string }) {
  return (
    <Link
      href={href}
      aria-current="page"
      className="inline-flex min-h-10 items-center rounded-md border border-[var(--color-gold-400)] bg-[var(--color-gold-500)] px-3 text-sm font-semibold text-[var(--color-graphite-950)]"
    >
      {children}
    </Link>
  );
}

function InactiveTab({ href, children }: { href: string; children: string }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-10 items-center rounded-md border border-[var(--color-border)] bg-white px-3 text-sm font-medium text-[var(--color-graphite-800)] transition hover:border-[var(--color-gold-400)] hover:text-[var(--color-graphite-950)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold-500)]"
    >
      {children}
    </Link>
  );
}

function HeaderLink({ href, children }: { href: string; children: string }) {
  return (
    <Link
      href={href}
      className="hidden min-h-10 items-center rounded-md border border-[var(--color-border)] bg-white px-3 text-sm font-medium text-[var(--color-graphite-800)] shadow-sm transition hover:border-[var(--color-gold-400)] hover:text-[var(--color-graphite-950)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold-500)] sm:inline-flex"
    >
      {children}
    </Link>
  );
}

function formatShortDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  }).format(new Date(`${value}T00:00:00.000Z`));
}
