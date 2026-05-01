import { signOut } from "@/app/login/actions";
import { FinanceShell } from "@/features/finance-shell/components/finance-shell";
import {
  paymentRecords,
  paymentStatusLabels,
  summarizePayments,
} from "@/features/payments-accounts/data";
import type { PaymentRecord } from "@/features/payments-accounts/types";
import { formatMoney } from "@/lib/finance";
import Link from "next/link";

const asOf = new Date("2026-04-30T12:00:00.000Z");

const paymentStatusTone = {
  settled: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  pending_deposit: "bg-amber-50 text-amber-700 ring-amber-200",
  credit: "bg-teal-50 text-teal-700 ring-teal-200",
};

export function PaymentsPage({ userEmail }: { userEmail?: string }) {
  const summary = summarizePayments(paymentRecords, asOf);

  return (
    <FinanceShell
      currentPath="/payments"
      eyebrow="Financeiro Alisson Joias"
      title="Payments and Accounts"
      userEmail={userEmail}
      secondaryAction={<HeaderLink href="/accounts/receivable">Accounts Receivable</HeaderLink>}
      primaryAction={
        <>
          <button className="min-h-10 rounded-md bg-[var(--color-gold-500)] px-3 text-sm font-semibold text-[var(--color-graphite-950)] shadow-sm transition hover:bg-[var(--color-gold-400)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold-500)]">
            Registrar pagamento
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
          Pagamentos aguardando conciliação
          <div className="mt-2 font-medium text-[var(--color-gold-200)]">
            {formatMoney(summary.pendingDepositsCents)} em depósitos pendentes
          </div>
        </div>
      }
    >
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-5 px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
        <section className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 shadow-[var(--shadow-widget)]">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-sm font-semibold text-[var(--color-graphite-900)]">
                Pagamentos recebidos, depósitos pendentes e créditos por overpayment
              </p>
              <p className="mt-1 text-sm text-[var(--color-muted)]">
                Acompanhe cada Payment # vinculado a Invoice e customer antes da conciliação.
              </p>
            </div>
            <nav aria-label="Payments and accounts" className="flex flex-wrap gap-2">
              <ActiveTab href="/payments">Pagamentos</ActiveTab>
              <InactiveTab href="/accounts/receivable">Accounts Receivable</InactiveTab>
              <InactiveTab href="/accounts/payable">Accounts Payable</InactiveTab>
            </nav>
          </div>
        </section>

        <section className="grid gap-3 md:grid-cols-3">
          <MetricCard
            label="Coletado no mês"
            value={formatMoney(summary.collectedThisMonthCents)}
            detail="Recebimentos de abril"
            tone="success"
          />
          <MetricCard
            label="Depósitos pendentes"
            value={formatMoney(summary.pendingDepositsCents)}
            detail="Aguardando conciliação"
            tone="warning"
          />
          <MetricCard
            label="Créditos"
            value={formatMoney(summary.creditCents)}
            detail="Overpayments/Credits ativos"
            tone="credit"
          />
        </section>

        <section className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-widget)]">
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-gold-700)]">
                Pagamentos
              </p>
              <h2 className="mt-1 text-base font-semibold tracking-normal text-[var(--color-graphite-950)]">
                Lista de pagamentos
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {["Todos métodos", "Pix", "ACH", "Wire", "Credit Card"].map((label) => (
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
            <table className="w-full min-w-[72rem] table-fixed border-separate border-spacing-0 text-left text-sm">
              <colgroup>
                <col className="w-[10%]" />
                <col className="w-[10%]" />
                <col className="w-[20%]" />
                <col className="w-[10%]" />
                <col className="w-[12%]" />
                <col className="w-[10%]" />
                <col className="w-[16%]" />
                <col className="w-[12%]" />
              </colgroup>
              <thead>
                <tr className="text-xs uppercase tracking-[0.12em] text-[var(--color-muted)]">
                  <th className="border-b border-[var(--color-border)] pb-3 pr-4 font-semibold">Payment #</th>
                  <th className="border-b border-[var(--color-border)] pb-3 pr-4 font-semibold">Invoice</th>
                  <th className="border-b border-[var(--color-border)] pb-3 pr-4 font-semibold">Customer</th>
                  <th className="border-b border-[var(--color-border)] pb-3 pr-4 font-semibold">Date</th>
                  <th className="border-b border-[var(--color-border)] pb-3 pr-4 font-semibold">Amount</th>
                  <th className="border-b border-[var(--color-border)] pb-3 pr-4 font-semibold">Method</th>
                  <th className="border-b border-[var(--color-border)] pb-3 pr-4 font-semibold">Reference</th>
                  <th className="border-b border-[var(--color-border)] pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {paymentRecords.map((payment) => (
                  <PaymentRow key={payment.id} payment={payment} />
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </FinanceShell>
  );
}

function PaymentRow({ payment }: { payment: PaymentRecord }) {
  return (
    <tr className="transition hover:bg-[var(--color-graphite-50)]">
      <td className="border-b border-[var(--color-border)] py-4 pr-4 align-top font-semibold text-[var(--color-graphite-900)]">
        {payment.paymentNumber}
      </td>
      <td className="border-b border-[var(--color-border)] py-4 pr-4 align-top font-mono text-[var(--color-muted)]">
        {payment.invoiceNumber}
      </td>
      <td className="border-b border-[var(--color-border)] py-4 pr-4 align-top font-medium text-[var(--color-graphite-900)]">
        {payment.customerName}
      </td>
      <td className="border-b border-[var(--color-border)] py-4 pr-4 align-top font-mono text-[var(--color-muted)] whitespace-nowrap">
        {formatShortDate(payment.date)}
      </td>
      <td className="border-b border-[var(--color-border)] py-4 pr-4 align-top font-mono font-medium whitespace-nowrap">
        {formatMoney(payment.amountCents)}
      </td>
      <td className="border-b border-[var(--color-border)] py-4 pr-4 align-top">
        <span className="rounded bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-200">
          {payment.method}
        </span>
      </td>
      <td className="border-b border-[var(--color-border)] py-4 pr-4 align-top text-[var(--color-muted)]">
        {payment.reference}
      </td>
      <td className="border-b border-[var(--color-border)] py-4 align-top">
        <span className={`inline-flex rounded px-2 py-1 text-xs font-semibold ring-1 ${paymentStatusTone[payment.status]}`}>
          {paymentStatusLabels[payment.status]}
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
  tone: "success" | "warning" | "credit";
}) {
  const toneClasses = {
    success: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    warning: "bg-amber-50 text-amber-700 ring-amber-200",
    credit: "bg-teal-50 text-teal-700 ring-teal-200",
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
