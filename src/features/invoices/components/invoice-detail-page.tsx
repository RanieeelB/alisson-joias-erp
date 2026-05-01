import { signOut } from "@/app/login/actions";
import { FinanceShell } from "@/features/finance-shell/components/finance-shell";
import {
  invoiceStatusLabels,
  quickbooksSyncLabels,
  summarizeInvoiceDetail,
} from "@/features/invoices/data";
import type { InvoiceRecord } from "@/features/invoices/types";
import { formatMoney } from "@/lib/finance";
import Link from "next/link";

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

export function InvoiceDetailPage({
  invoice,
  userEmail,
}: {
  invoice: InvoiceRecord;
  userEmail?: string;
}) {
  const summary = summarizeInvoiceDetail(invoice);

  return (
    <FinanceShell
      currentPath="/invoices"
      eyebrow="Financeiro Alisson Joias"
      title="Detalhe da Fatura"
      userEmail={userEmail}
      secondaryAction={
        <Link
          href="/invoices"
          className="hidden min-h-10 items-center rounded-md border border-[var(--color-border)] bg-white px-3 text-sm font-medium text-[var(--color-graphite-800)] shadow-sm transition hover:border-[var(--color-gold-400)] hover:text-[var(--color-graphite-950)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold-500)] sm:inline-flex"
        >
          Voltar para Faturas
        </Link>
      }
      primaryAction={
        <form action={signOut}>
          <button className="min-h-10 rounded-md border border-[var(--color-border)] bg-white px-3 text-sm font-medium text-[var(--color-graphite-800)] shadow-sm transition hover:border-red-300 hover:text-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400">
            Sair
          </button>
        </form>
      }
      footer={
        <div className="rounded-md bg-white/8 p-3 text-xs leading-5 text-white/72">
          Workspace de detalhe em revisão
          <div className="mt-2 font-medium text-[var(--color-gold-200)]">
            Ações e histórico prontos para a equipe financeira
          </div>
        </div>
      }
    >
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-5 px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
        <section className="overflow-hidden rounded-md border border-white/8 bg-[var(--color-graphite-900)] text-white shadow-[var(--shadow-widget)]">
          <div className="grid gap-5 px-5 py-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-gold-300)]">
                {invoice.invoiceNumber}
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-normal">
                {invoice.customerName}
              </h2>
              <p className="mt-2 text-sm text-white/66">
                {invoice.customerSegment}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded bg-white/10 px-2.5 py-1 text-xs font-semibold text-white">
                  {invoice.orderType}
                </span>
                <span
                  className={`rounded px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${badgeTone[invoice.status]}`}
                >
                  {invoiceStatusLabels[invoice.status]}
                </span>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <DetailStat label="Issue date" value={formatLongDate(invoice.issuedOn)} />
              <DetailStat label="Due date" value={formatLongDate(invoice.dueOn)} />
              <DetailStat label="Payment terms" value={invoice.paymentTerms} />
            </div>
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="grid gap-5">
            <section className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-widget)]">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-gold-700)]">
                Dados do cliente
              </p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <DetailBlock label="Contato" value={invoice.contactName} />
                <DetailBlock label="Billing email" value={invoice.billingEmail} />
                <DetailBlock label="Telefone" value={invoice.billingPhone} />
                <DetailBlock label="Endereco" value={invoice.billingAddress} />
              </div>
            </section>

            <section className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-widget)]">
              <div className="mb-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-gold-700)]">
                  Line items
                </p>
                <h3 className="mt-1 text-base font-semibold tracking-normal text-[var(--color-graphite-950)]">
                  Itens de joalheria e cálculo financeiro
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[48rem] border-separate border-spacing-0 text-left text-sm">
                  <thead>
                    <tr className="text-xs uppercase tracking-[0.12em] text-[var(--color-muted)]">
                      <th className="border-b border-[var(--color-border)] pb-3 pr-4 font-semibold">Item</th>
                      <th className="border-b border-[var(--color-border)] pb-3 pr-4 font-semibold">Qty</th>
                      <th className="border-b border-[var(--color-border)] pb-3 pr-4 font-semibold">Unit</th>
                      <th className="border-b border-[var(--color-border)] pb-3 pr-4 font-semibold">Tax</th>
                      <th className="border-b border-[var(--color-border)] pb-3 font-semibold">Line total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.lineItems.map((item) => (
                      <tr key={item.id}>
                        <td className="border-b border-[var(--color-border)] py-3 pr-4 text-[var(--color-graphite-900)]">
                          {item.description}
                        </td>
                        <td className="border-b border-[var(--color-border)] py-3 pr-4 font-mono text-[var(--color-muted)]">
                          {item.quantity}
                        </td>
                        <td className="border-b border-[var(--color-border)] py-3 pr-4 font-mono text-[var(--color-muted)] whitespace-nowrap">
                          {formatMoney(item.unitPriceCents)}
                        </td>
                        <td className="border-b border-[var(--color-border)] py-3 pr-4 font-mono text-[var(--color-muted)] whitespace-nowrap">
                          {formatMoney(item.taxCents)}
                        </td>
                        <td className="border-b border-[var(--color-border)] py-3 font-mono font-medium whitespace-nowrap">
                          {formatMoney(item.lineTotalCents)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-5 grid justify-end">
                <div className="min-w-[18rem] space-y-2 rounded-md border border-[var(--color-border)] bg-[var(--color-graphite-50)] p-4">
                  <TotalRow label="Subtotal" value={formatMoney(summary.subtotalCents)} />
                  <TotalRow label="Tax" value={formatMoney(summary.taxCents)} />
                  <TotalRow label="Total" value={formatMoney(summary.totalCents)} strong />
                  <TotalRow label="Paid" value={formatMoney(summary.paidCents)} />
                  <TotalRow label="Balance" value={formatMoney(summary.balanceCents)} strong />
                </div>
              </div>
            </section>
          </div>

          <aside className="grid content-start gap-5">
            <section className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-widget)]">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-gold-700)]">
                Action panel
              </p>
              <div className="mt-4 grid gap-2">
                <ActionButton href={`mailto:${invoice.billingEmail}`}>Enviar</ActionButton>
                <ActionButton href="/payments" primary>Registrar Pagamento</ActionButton>
                <ActionButton href={`/api/exports/invoices/${invoice.id}`}>Imprimir</ActionButton>
                <ActionButton href={`/api/exports/invoices/${invoice.id}`}>Baixar PDF</ActionButton>
                <ActionButton>Edit</ActionButton>
              </div>
            </section>

            <section className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-widget)]">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-gold-700)]">
                QuickBooks
              </p>
              <h3 className="mt-1 text-base font-semibold tracking-normal text-[var(--color-graphite-950)]">
                Sync status
              </h3>
              <div className="mt-4 rounded-md border border-[var(--color-border)] bg-white px-3 py-3">
                <span
                  className={`inline-flex rounded px-2 py-1 text-xs font-semibold ring-1 ${quickbooksTone[invoice.quickbooksSyncStatus]}`}
                >
                  {quickbooksSyncLabels[invoice.quickbooksSyncStatus]}
                </span>
                <p className="mt-3 text-sm text-[var(--color-muted)]">
                  Ultima revisao financeira preparada para conciliacao interna.
                </p>
              </div>
            </section>

            <section className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-widget)]">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-gold-700)]">
                Payment history
              </p>
              <div className="mt-4 space-y-3">
                {invoice.payments.map((payment) => (
                  <div key={payment.id} className="rounded-md border border-[var(--color-border)] bg-white px-3 py-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-[var(--color-graphite-900)]">
                          {payment.paymentNumber}
                        </p>
                        <p className="text-xs text-[var(--color-muted)]">
                          {payment.method} · {formatLongDate(payment.recordedOn)}
                        </p>
                      </div>
                      <span className="font-mono text-sm font-semibold text-[var(--color-graphite-900)]">
                        {formatMoney(payment.amountCents)}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-[var(--color-muted)]">
                      {payment.reference}
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

function DetailStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-white/10 bg-white/6 px-3 py-3">
      <p className="text-xs uppercase tracking-[0.12em] text-white/52">{label}</p>
      <p className="mt-2 text-sm font-medium text-white">{value}</p>
    </div>
  );
}

function DetailBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-muted)]">
        {label}
      </p>
      <p className="mt-2 text-sm text-[var(--color-graphite-900)]">{value}</p>
    </div>
  );
}

function TotalRow({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span
        className={
          strong
            ? "text-sm font-semibold text-[var(--color-graphite-900)]"
            : "text-sm text-[var(--color-muted)]"
        }
      >
        {label}
      </span>
      <span
        className={
          strong
            ? "font-mono text-sm font-semibold text-[var(--color-graphite-900)]"
            : "font-mono text-sm text-[var(--color-graphite-800)]"
        }
      >
        {value}
      </span>
    </div>
  );
}

function ActionButton({
  children,
  href,
  primary = false,
}: {
  children: string;
  href?: string;
  primary?: boolean;
}) {
  const className = primary
    ? "min-h-10 rounded-md bg-[var(--color-gold-500)] px-3 text-sm font-semibold text-[var(--color-graphite-950)] shadow-sm transition hover:bg-[var(--color-gold-400)]"
    : "min-h-10 rounded-md border border-[var(--color-border)] bg-white px-3 text-sm font-medium text-[var(--color-graphite-800)] shadow-sm transition hover:border-[var(--color-gold-400)] hover:text-[var(--color-graphite-950)]";

  if (href) {
    return (
      <a href={href} target={href.startsWith("/api") ? "_blank" : undefined} className={`inline-flex items-center justify-center ${className}`}>
        {children}
      </a>
    );
  }

  return (
    <button
      className={className}
    >
      {children}
    </button>
  );
}

function formatLongDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00.000Z`));
}
