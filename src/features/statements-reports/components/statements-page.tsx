import { signOut } from "@/app/login/actions";
import { FinanceShell } from "@/features/finance-shell/components/finance-shell";
import {
  customerStatements,
  statementPeriod,
  summarizeStatements,
} from "@/features/statements-reports/data";
import type { CustomerStatement } from "@/features/statements-reports/types";
import { formatMoney } from "@/lib/finance";
import Link from "next/link";

const segmentTone = {
  "Custom Orders": "bg-amber-50 text-amber-700 ring-amber-200",
  Repairs: "bg-blue-50 text-blue-700 ring-blue-200",
  Wholesale: "bg-purple-50 text-purple-700 ring-purple-200",
  Retail: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

export function StatementsPage({ userEmail }: { userEmail?: string }) {
  const summary = summarizeStatements(customerStatements);

  return (
    <FinanceShell
      currentPath="/statements"
      eyebrow="Financeiro Alisson Joias"
      title="Statements"
      userEmail={userEmail}
      secondaryAction={<HeaderLink href="/reports">Reports</HeaderLink>}
      primaryAction={
        <>
          <button className="min-h-10 rounded-md border border-[var(--color-gold-400)] bg-white px-3 text-sm font-semibold text-[var(--color-gold-800)] shadow-sm transition hover:bg-[var(--color-gold-50)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold-500)]">
            Email All Statements
          </button>
          <button className="min-h-10 rounded-md bg-[var(--color-gold-500)] px-3 text-sm font-semibold text-[var(--color-graphite-950)] shadow-sm transition hover:bg-[var(--color-gold-400)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold-500)]">
            Bulk Download
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
          Statements prontos para envio
          <div className="mt-2 font-medium text-[var(--color-gold-200)]">
            {summary.totalCustomers} clientes no período
          </div>
        </div>
      }
    >
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-5 px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
        <section className="grid gap-3 md:grid-cols-4">
          <MetricCard label="Clientes" value={String(summary.totalCustomers)} detail="Statements gerados" />
          <MetricCard label="Faturas" value={String(summary.totalInvoices)} detail="No período selecionado" />
          <MetricCard label="Balance" value={formatMoney(summary.netBalanceCents)} detail="Saldo líquido" />
          <MetricCard label="Créditos" value={formatMoney(summary.creditCents)} detail="Overpayments ativos" />
        </section>

        <section className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 shadow-[var(--shadow-widget)]">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-gold-700)]">
                Período
              </p>
              <div className="mt-2 inline-flex min-h-10 items-center rounded-md border border-[var(--color-border)] bg-white px-3 font-mono text-sm text-[var(--color-graphite-900)]">
                {statementPeriod.label}
              </div>
            </div>
            <nav aria-label="Statements and reports" className="flex flex-wrap gap-2">
              <ActiveTab href="/statements">Statements</ActiveTab>
              <InactiveTab href="/reports">Reports</InactiveTab>
            </nav>
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="grid gap-3">
            {customerStatements.map((statement) => (
              <StatementCard key={statement.id} statement={statement} />
            ))}
          </div>

          <aside className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-widget)]">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-gold-700)]">
              Reports preview
            </p>
            <h2 className="mt-1 text-base font-semibold tracking-normal text-[var(--color-graphite-950)]">
              Revenue Analysis
            </h2>
            <div className="mt-4 space-y-3">
              <PreviewMetric label="Outstanding" value={formatMoney(summary.outstandingCents)} />
              <PreviewMetric label="Credits" value={formatMoney(summary.creditCents)} />
              <PreviewMetric label="Net Balance" value={formatMoney(summary.netBalanceCents)} />
            </div>
            <Link
              href="/reports"
              className="mt-5 inline-flex min-h-10 w-full items-center justify-center rounded-md border border-[var(--color-border)] bg-white px-3 text-sm font-semibold text-[var(--color-graphite-900)] transition hover:border-[var(--color-gold-400)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold-500)]"
            >
              Abrir Reports
            </Link>
          </aside>
        </section>
      </div>
    </FinanceShell>
  );
}

function StatementCard({ statement }: { statement: CustomerStatement }) {
  const isCredit = statement.balanceCents < 0;

  return (
    <article className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-widget)] transition hover:-translate-y-0.5 hover:border-[var(--color-gold-300)] hover:shadow-[var(--shadow-widget-hover)]">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_12rem_15rem] lg:items-center">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="truncate text-base font-semibold tracking-normal text-[var(--color-graphite-950)]">
              {statement.customerName}
            </h2>
            <span className={`rounded px-2 py-1 text-xs font-semibold ring-1 ${segmentTone[statement.segment]}`}>
              {statement.segment}
            </span>
          </div>
          <p className="mt-2 font-mono text-xs text-[var(--color-muted)]">
            {statement.statementNumber} · última fatura {formatShortDate(statement.lastInvoiceDate)}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium text-[var(--color-muted)]">Faturas</p>
          <p className="mt-1 font-mono text-xl font-semibold text-[var(--color-graphite-950)]">
            {statement.invoiceCount}
          </p>
          <p className="mt-2 text-xs font-medium text-[var(--color-muted)]">Balance</p>
          <p className={`mt-1 font-mono text-sm font-semibold ${isCredit ? "text-red-700" : "text-emerald-700"}`}>
            {formatMoney(statement.balanceCents)}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 lg:justify-end">
          {statement.actions.map((action) => (
            <button
              key={action}
              className="min-h-9 rounded-md border border-[var(--color-border)] bg-white px-3 text-xs font-semibold text-[var(--color-graphite-800)] transition hover:border-[var(--color-gold-400)] hover:text-[var(--color-graphite-950)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold-500)]"
            >
              {getActionLabel(action)}
            </button>
          ))}
        </div>
      </div>
    </article>
  );
}

function MetricCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <article className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-widget)]">
      <p className="text-sm font-medium text-[var(--color-muted)]">{label}</p>
      <p className="mt-3 font-mono text-2xl font-semibold tracking-normal text-[var(--color-graphite-950)]">
        {value}
      </p>
      <p className="mt-2 text-sm text-[var(--color-muted)]">{detail}</p>
    </article>
  );
}

function PreviewMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-graphite-50)] p-3">
      <p className="text-xs font-medium text-[var(--color-muted)]">{label}</p>
      <p className="mt-1 font-mono text-sm font-semibold text-[var(--color-graphite-950)]">{value}</p>
    </div>
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

function getActionLabel(action: CustomerStatement["actions"][number]) {
  if (action === "view") return "View";
  if (action === "print") return "Print";

  return "Email";
}

function formatShortDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  }).format(new Date(`${value}T00:00:00.000Z`));
}
