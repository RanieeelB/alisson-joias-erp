import { signOut } from "@/app/login/actions";
import { FinanceShell } from "@/features/finance-shell/components/finance-shell";
import {
  accountsPayableRecords,
  payableStatusLabels,
  summarizeAccountsPayable,
} from "@/features/payments-accounts/data";
import type { AccountsPayableRecord } from "@/features/payments-accounts/types";
import { formatMoney } from "@/lib/finance";
import Link from "next/link";

const asOf = new Date("2026-04-30T12:00:00.000Z");

const statusTone = {
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  partial: "bg-blue-50 text-blue-700 ring-blue-200",
  paid: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  overdue: "bg-red-50 text-red-700 ring-red-200",
};

export function AccountsPayablePage({ userEmail }: { userEmail?: string }) {
  const summary = summarizeAccountsPayable(accountsPayableRecords, asOf);

  return (
    <FinanceShell
      currentPath="/accounts/payable"
      eyebrow="Financeiro Alisson Joias"
      title="Accounts Payable"
      userEmail={userEmail}
      secondaryAction={<HeaderLink href="/accounts/receivable">Accounts Receivable</HeaderLink>}
      primaryAction={
        <>
          <button className="hidden min-h-10 rounded-md bg-[var(--color-graphite-900)] px-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--color-graphite-800)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold-500)] sm:inline-flex sm:items-center">
            Nova obrigação
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
          Obrigações de fornecedores
          <div className="mt-2 font-medium text-[var(--color-gold-200)]">
            {formatMoney(summary.totalPayableCents)} em Accounts Payable
          </div>
        </div>
      }
    >
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-5 px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
        <section className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 shadow-[var(--shadow-widget)]">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-sm font-semibold text-[var(--color-graphite-900)]">
                Controle de obrigações para materiais, componentes, certificação e serviços
              </p>
              <p className="mt-1 text-sm text-[var(--color-muted)]">
                Priorize fornecedores críticos de joalheria sem perder o status financeiro.
              </p>
            </div>
            <nav aria-label="Payments and accounts" className="flex flex-wrap gap-2">
              <InactiveTab href="/payments">Pagamentos</InactiveTab>
              <InactiveTab href="/accounts/receivable">Accounts Receivable</InactiveTab>
              <ActiveTab href="/accounts/payable">Accounts Payable</ActiveTab>
            </nav>
          </div>
        </section>

        <section className="grid gap-3 md:grid-cols-3">
          <MetricCard
            label="Total Payable"
            value={formatMoney(summary.totalPayableCents)}
            detail="Saldo de obrigações abertas"
            tone="neutral"
          />
          <MetricCard
            label="Paid This Month"
            value={formatMoney(summary.paidThisMonthCents)}
            detail="Pagamentos para fornecedores"
            tone="success"
          />
          <MetricCard
            label="Overdue"
            value={formatMoney(summary.overdueCents)}
            detail="Requer follow-up financeiro"
            tone="danger"
          />
        </section>

        <section className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-widget)]">
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-gold-700)]">
                Accounts Payable
              </p>
              <h2 className="mt-1 text-base font-semibold tracking-normal text-[var(--color-graphite-950)]">
                Obrigações por fornecedor
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {["Raw Materials", "Components", "Certification", "Services"].map((label) => (
                <button
                  key={label}
                  className="min-h-9 rounded-md border border-[var(--color-border)] bg-white px-3 text-xs font-medium text-[var(--color-graphite-800)] transition hover:border-[var(--color-gold-400)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold-500)]"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[78rem] table-fixed border-separate border-spacing-0 text-left text-sm">
              <colgroup>
                <col className="w-[10%]" />
                <col className="w-[18%]" />
                <col className="w-[12%]" />
                <col className="w-[9%]" />
                <col className="w-[9%]" />
                <col className="w-[10%]" />
                <col className="w-[10%]" />
                <col className="w-[10%]" />
                <col className="w-[12%]" />
              </colgroup>
              <thead>
                <tr className="text-xs uppercase tracking-[0.12em] text-[var(--color-muted)]">
                  <th className="border-b border-[var(--color-border)] pb-3 pr-4 font-semibold">AP #</th>
                  <th className="border-b border-[var(--color-border)] pb-3 pr-4 font-semibold">Vendor</th>
                  <th className="border-b border-[var(--color-border)] pb-3 pr-4 font-semibold">Category</th>
                  <th className="border-b border-[var(--color-border)] pb-3 pr-4 font-semibold">Date</th>
                  <th className="border-b border-[var(--color-border)] pb-3 pr-4 font-semibold">Due</th>
                  <th className="border-b border-[var(--color-border)] pb-3 pr-4 font-semibold">Total</th>
                  <th className="border-b border-[var(--color-border)] pb-3 pr-4 font-semibold">Paid</th>
                  <th className="border-b border-[var(--color-border)] pb-3 pr-4 font-semibold">Balance</th>
                  <th className="border-b border-[var(--color-border)] pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {accountsPayableRecords.map((record) => (
                  <PayableRow key={record.id} record={record} />
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </FinanceShell>
  );
}

function PayableRow({ record }: { record: AccountsPayableRecord }) {
  return (
    <tr className="transition hover:bg-[var(--color-graphite-50)]">
      <td className="border-b border-[var(--color-border)] py-4 pr-4 align-top font-semibold text-[var(--color-graphite-900)]">
        {record.apNumber}
      </td>
      <td className="border-b border-[var(--color-border)] py-4 pr-4 align-top font-medium text-[var(--color-graphite-900)]">
        {record.vendorName}
      </td>
      <td className="border-b border-[var(--color-border)] py-4 pr-4 align-top text-[var(--color-muted)]">
        {record.category}
      </td>
      <td className="border-b border-[var(--color-border)] py-4 pr-4 align-top font-mono text-[var(--color-muted)] whitespace-nowrap">
        {formatShortDate(record.date)}
      </td>
      <td className="border-b border-[var(--color-border)] py-4 pr-4 align-top font-mono text-[var(--color-muted)] whitespace-nowrap">
        {formatShortDate(record.dueOn)}
      </td>
      <td className="border-b border-[var(--color-border)] py-4 pr-4 align-top font-mono font-medium whitespace-nowrap">
        {formatMoney(record.totalCents)}
      </td>
      <td className="border-b border-[var(--color-border)] py-4 pr-4 align-top font-mono text-[var(--color-muted)] whitespace-nowrap">
        {formatMoney(record.paidCents)}
      </td>
      <td className="border-b border-[var(--color-border)] py-4 pr-4 align-top font-mono font-medium whitespace-nowrap">
        {formatMoney(record.balanceCents)}
      </td>
      <td className="border-b border-[var(--color-border)] py-4 align-top">
        <span className={`inline-flex rounded px-2 py-1 text-xs font-semibold ring-1 ${statusTone[record.status]}`}>
          {payableStatusLabels[record.status]}
        </span>
      </td>
    </tr>
  );
}

function MetricCard({
  label,
  value,
  detail,
  tone,
}: {
  label: string;
  value: string;
  detail: string;
  tone: "neutral" | "success" | "danger";
}) {
  const toneClasses = {
    neutral: "bg-blue-50 text-blue-700 ring-blue-200",
    success: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    danger: "bg-red-50 text-red-700 ring-red-200",
  };

  return (
    <article className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-widget)] transition hover:-translate-y-0.5 hover:border-[var(--color-gold-300)] hover:shadow-[var(--shadow-widget-hover)]">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-[var(--color-muted)]">{label}</p>
        <span className={`rounded px-2 py-1 text-xs font-semibold ring-1 ${toneClasses[tone]}`}>
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
