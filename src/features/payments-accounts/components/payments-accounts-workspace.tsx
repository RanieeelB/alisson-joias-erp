"use client";

import { signOut } from "@/app/login/actions";
import {
  createPayableAction,
  createVendorAction,
  recordPaymentAction,
} from "@/features/finance/actions";
import type { FinanceWorkspaceData } from "@/features/finance/data";
import { FinanceShell } from "@/features/finance-shell/components/finance-shell";
import {
  agingBucketLabels,
  getReceivableBalanceScale,
  payableStatusLabels,
  paymentStatusLabels,
  summarizeAccountsPayable,
  summarizePayments,
  summarizeReceivableAging,
} from "@/features/payments-accounts/data";
import type {
  AccountsPayableRecord,
  CustomerReceivableBalance,
  PaymentRecord,
  ReceivableAgingSummary,
  ReceivableInvoice,
} from "@/features/payments-accounts/types";
import { formatMoney } from "@/lib/finance";
import type { ReactNode } from "react";
import { useActionState, useState } from "react";

export type PaymentsAccountsTab = "payments" | "receivable" | "payable";

const asOf = new Date("2026-04-30T12:00:00.000Z");

const paymentsAccountsTabs: PaymentsAccountsTab[] = [
  "payments",
  "receivable",
  "payable",
];

const tabLabels: Record<PaymentsAccountsTab, string> = {
  payments: "Pagamentos",
  receivable: "Contas a receber",
  payable: "Contas a pagar",
};

const tabPaths: Record<PaymentsAccountsTab, string> = {
  payments: "/payments",
  receivable: "/accounts/receivable",
  payable: "/accounts/payable",
};

const tabCopy: Record<PaymentsAccountsTab, { footer: string; title: string }> = {
  payments: {
    footer: "Pagamentos aguardando conciliação",
    title: "Pagamentos recebidos, depósitos pendentes e créditos ativos",
  },
  receivable: {
    footer: "Vencimentos de contas a receber",
    title: "Análise de vencimentos, saldos por cliente e lembretes para faturas abertas",
  },
  payable: {
    footer: "Obrigações de fornecedores",
    title: "Controle de obrigações para materiais, componentes, certificação e serviços",
  },
};

const paymentStatusTone = {
  settled: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  pending_deposit: "bg-amber-50 text-amber-700 ring-amber-200",
  credit: "bg-teal-50 text-teal-700 ring-teal-200",
};

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

const receivableStatusTone = {
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  partial: "bg-blue-50 text-blue-700 ring-blue-200",
  overdue: "bg-red-50 text-red-700 ring-red-200",
};

const receivableStatusLabels = {
  pending: "Pendente",
  partial: "Parcial",
  overdue: "Em atraso",
};

const payableStatusTone = {
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  partial: "bg-blue-50 text-blue-700 ring-blue-200",
  paid: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  overdue: "bg-red-50 text-red-700 ring-red-200",
};

export function PaymentsAccountsWorkspace({
  data,
  initialTab,
  userEmail,
}: {
  data: FinanceWorkspaceData;
  initialTab: PaymentsAccountsTab;
  userEmail?: string;
}) {
  const [activeTab, setActiveTab] = useState<PaymentsAccountsTab>(initialTab);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isPayableOpen, setIsPayableOpen] = useState(false);
  const [isVendorOpen, setIsVendorOpen] = useState(false);
  const [paymentState, paymentAction, isPaymentPending] = useActionState(
    recordPaymentAction,
    { ok: false, message: "" },
  );
  const [payableState, payableAction, isPayablePending] = useActionState(
    createPayableAction,
    { ok: false, message: "" },
  );
  const [vendorState, vendorAction, isVendorPending] = useActionState(
    createVendorAction,
    { ok: false, message: "" },
  );
  const paymentSummary = summarizePayments(data.paymentRecords, asOf);
  const payableSummary = summarizeAccountsPayable(data.accountsPayableRecords, asOf);
  const aging = summarizeReceivableAging(data.openReceivableInvoices, asOf);
  const totalAgingCents = agingOrder.reduce((sum, bucket) => sum + aging[bucket], 0);

  return (
    <FinanceShell
      currentPath={tabPaths[activeTab]}
      eyebrow="Financeiro Alisson Joias"
      title="Pagamentos e Contas"
      userEmail={userEmail}
      secondaryAction={
        <HeaderButton onClick={() => setActiveTab(nextTab(activeTab))}>
          {tabLabels[nextTab(activeTab)]}
        </HeaderButton>
      }
      primaryAction={
        <>
          <PrimaryAction
            activeTab={activeTab}
            onNewPayable={() => setIsPayableOpen(true)}
            onNewPayment={() => setIsPaymentOpen(true)}
            onNewVendor={() => setIsVendorOpen(true)}
            setActiveTab={setActiveTab}
          />
          <form action={signOut}>
            <button className="min-h-10 rounded-md border border-[var(--color-border)] bg-white px-3 text-sm font-medium text-[var(--color-graphite-800)] shadow-sm transition hover:border-red-300 hover:text-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400">
              Sair
            </button>
          </form>
        </>
      }
      footer={
        <div className="rounded-md bg-white/8 p-3 text-xs leading-5 text-white/72">
          {tabCopy[activeTab].footer}
          <div className="mt-2 font-medium text-[var(--color-gold-200)]">
            {getFooterValue(activeTab, paymentSummary, payableSummary, totalAgingCents)}
          </div>
        </div>
      }
    >
      {isPaymentOpen ? (
        <PaymentDialog
          action={paymentAction}
          customers={data.customers}
          invoices={data.invoiceRecords}
          isPending={isPaymentPending}
          message={paymentState.message}
          ok={paymentState.ok}
          onClose={() => setIsPaymentOpen(false)}
        />
      ) : null}
      {isPayableOpen ? (
        <PayableDialog
          action={payableAction}
          isPending={isPayablePending}
          message={payableState.message}
          ok={payableState.ok}
          onClose={() => setIsPayableOpen(false)}
          vendors={data.vendors}
        />
      ) : null}
      {isVendorOpen ? (
        <VendorDialog
          action={vendorAction}
          isPending={isVendorPending}
          message={vendorState.message}
          ok={vendorState.ok}
          onClose={() => setIsVendorOpen(false)}
        />
      ) : null}
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-5 px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
        <section className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 shadow-[var(--shadow-widget)]">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-sm font-semibold text-[var(--color-graphite-900)]">
                {tabCopy[activeTab].title}
              </p>
              <p className="mt-1 text-sm text-[var(--color-muted)]">
                Priorização financeira para cobrança, conciliação e fornecedores críticos de joalheria.
              </p>
            </div>
            <div role="tablist" aria-label="Pagamentos e contas" className="flex flex-wrap gap-2">
              {paymentsAccountsTabs.map((tab) => (
                <WorkspaceTab
                  key={tab}
                  isActive={activeTab === tab}
                  onClick={() => setActiveTab(tab)}
                >
                  {tabLabels[tab]}
                </WorkspaceTab>
              ))}
            </div>
          </div>
        </section>

        {activeTab === "payments" ? (
          <PaymentsTab payments={data.paymentRecords} summary={paymentSummary} />
        ) : activeTab === "receivable" ? (
          <ReceivableTab
            aging={aging}
            balances={data.customerReceivableBalances}
            invoices={data.openReceivableInvoices}
            totalAgingCents={totalAgingCents}
          />
        ) : (
          <PayableTab records={data.accountsPayableRecords} summary={payableSummary} />
        )}
      </div>
    </FinanceShell>
  );
}

function PaymentsTab({
  payments,
  summary,
}: {
  payments: PaymentRecord[];
  summary: ReturnType<typeof summarizePayments>;
}) {
  return (
    <>
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
          detail="Créditos ativos de clientes"
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
          <FilterChips labels={["Todos os métodos", "Pix", "ACH", "Transferência", "Cartão de crédito"]} />
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
                <th className="border-b border-[var(--color-border)] pb-3 pr-4 font-semibold">Pagamento #</th>
                <th className="border-b border-[var(--color-border)] pb-3 pr-4 font-semibold">Fatura</th>
                <th className="border-b border-[var(--color-border)] pb-3 pr-4 font-semibold">Cliente</th>
                <th className="border-b border-[var(--color-border)] pb-3 pr-4 font-semibold">Date</th>
                <th className="border-b border-[var(--color-border)] pb-3 pr-4 font-semibold">Amount</th>
                <th className="border-b border-[var(--color-border)] pb-3 pr-4 font-semibold">Forma</th>
                <th className="border-b border-[var(--color-border)] pb-3 pr-4 font-semibold">Referência</th>
                <th className="border-b border-[var(--color-border)] pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <PaymentRow key={payment.id} payment={payment} />
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function ReceivableTab({
  aging,
  balances: receivableBalances,
  invoices,
  totalAgingCents,
}: {
  aging: ReceivableAgingSummary;
  balances: CustomerReceivableBalance[];
  invoices: ReceivableInvoice[];
  totalAgingCents: number;
}) {
  const balances = getReceivableBalanceScale(receivableBalances);
  const [hoveredAgingBucket, setHoveredAgingBucket] = useState<{
    label: string;
    value: number;
    percent: number;
  } | null>(null);
  const [hoveredBalance, setHoveredBalance] = useState<(typeof balances)[number] | null>(
    null,
  );
  const activeBalance = hoveredBalance ?? balances[0] ?? null;

  return (
    <>
      <section className="grid gap-5 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <section className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-widget)]">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-gold-700)]">
              Contas a receber
          </p>
          <h2 className="mt-1 text-base font-semibold tracking-normal text-[var(--color-graphite-950)]">
              Análise de vencimentos
          </h2>
          <div className="mt-5 grid gap-4">
            {agingOrder.map((bucket) => {
              const value = aging[bucket];
              const percent = totalAgingCents > 0 ? Math.round((value / totalAgingCents) * 100) : 0;

              return (
                <div
                  key={bucket}
                  className="grid gap-2"
                  onMouseEnter={() =>
                    setHoveredAgingBucket({
                      label: agingBucketLabels[bucket],
                      value,
                      percent,
                    })
                  }
                  onMouseLeave={() => setHoveredAgingBucket(null)}
                >
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
                      title={formatMoney(value)}
                    />
                  </div>
                </div>
              );
            })}
            <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-graphite-50)] px-3 py-2 font-mono text-xs text-[var(--color-graphite-800)]">
              {hoveredAgingBucket
                ? `${hoveredAgingBucket.label}: ${formatMoney(hoveredAgingBucket.value)} (${hoveredAgingBucket.percent}%)`
                : "Passe o mouse sobre as barras"}
            </div>
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
              <div
                key={balance.customerName}
                className="grid gap-2"
                onMouseEnter={() => setHoveredBalance(balance)}
                onMouseLeave={() => setHoveredBalance(null)}
              >
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
                    title={formatMoney(balance.currentCents + balance.overdueCents)}
                  />
                </div>
              </div>
            ))}
            <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-graphite-50)] px-3 py-2 font-mono text-xs text-[var(--color-graphite-800)]">
              {activeBalance
                ? `${activeBalance.customerName}: ${formatMoney(activeBalance.currentCents + activeBalance.overdueCents)}`
                : "Passe o mouse sobre os clientes"}
            </div>
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
              Lembretes de cobrança
            </h2>
          </div>
          <a href="mailto:?subject=Lembretes de faturas em aberto" className="min-h-10 rounded-md bg-[var(--color-gold-500)] px-3 py-2 text-sm font-semibold text-[var(--color-graphite-950)] shadow-sm transition hover:bg-[var(--color-gold-400)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold-500)]">
            Enviar lembretes
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[56rem] table-fixed border-separate border-spacing-0 text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-[0.12em] text-[var(--color-muted)]">
                <th className="border-b border-[var(--color-border)] pb-3 pr-4 font-semibold">Fatura</th>
                <th className="border-b border-[var(--color-border)] pb-3 pr-4 font-semibold">Cliente</th>
                <th className="border-b border-[var(--color-border)] pb-3 pr-4 font-semibold">Vencimento</th>
                <th className="border-b border-[var(--color-border)] pb-3 pr-4 font-semibold">Saldo</th>
                <th className="border-b border-[var(--color-border)] pb-3 pr-4 font-semibold">Status</th>
                <th className="border-b border-[var(--color-border)] pb-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <ReceivableRow key={invoice.id} invoice={invoice} />
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function PayableTab({
  records,
  summary,
}: {
  records: AccountsPayableRecord[];
  summary: ReturnType<typeof summarizeAccountsPayable>;
}) {
  return (
    <>
      <section className="grid gap-3 md:grid-cols-3">
        <PayableMetricCard
          label="Total a pagar"
          value={formatMoney(summary.totalPayableCents)}
          detail="Saldo de obrigações abertas"
          tone="neutral"
        />
        <PayableMetricCard
          label="Pago no mês"
          value={formatMoney(summary.paidThisMonthCents)}
          detail="Pagamentos para fornecedores"
          tone="success"
        />
        <PayableMetricCard
          label="Em atraso"
          value={formatMoney(summary.overdueCents)}
          detail="Requer follow-up financeiro"
          tone="danger"
        />
      </section>

      <section className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-widget)]">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-gold-700)]">
              Contas a pagar
            </p>
            <h2 className="mt-1 text-base font-semibold tracking-normal text-[var(--color-graphite-950)]">
              Obrigações por fornecedor
            </h2>
          </div>
          <FilterChips labels={["Matéria-prima", "Componentes", "Certificação", "Serviços"]} />
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
                <th className="border-b border-[var(--color-border)] pb-3 pr-4 font-semibold">Fornecedor</th>
                <th className="border-b border-[var(--color-border)] pb-3 pr-4 font-semibold">Categoria</th>
                <th className="border-b border-[var(--color-border)] pb-3 pr-4 font-semibold">Date</th>
                <th className="border-b border-[var(--color-border)] pb-3 pr-4 font-semibold">Vencimento</th>
                <th className="border-b border-[var(--color-border)] pb-3 pr-4 font-semibold">Total</th>
                <th className="border-b border-[var(--color-border)] pb-3 pr-4 font-semibold">Pago</th>
                <th className="border-b border-[var(--color-border)] pb-3 pr-4 font-semibold">Saldo</th>
                <th className="border-b border-[var(--color-border)] pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <PayableRow key={record.id} record={record} />
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
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
        <span className={`inline-flex rounded px-2 py-1 text-xs font-semibold ring-1 ${receivableStatusTone[invoice.status]}`}>
          {receivableStatusLabels[invoice.status]}
        </span>
      </td>
      <td className="border-b border-[var(--color-border)] py-4 align-top">
        <a href={`mailto:?subject=Lembrete ${invoice.invoiceNumber}`} className="inline-flex min-h-9 items-center rounded-md border border-[var(--color-border)] bg-white px-2.5 text-xs font-medium text-[var(--color-graphite-800)] transition hover:border-[var(--color-gold-400)] hover:text-[var(--color-graphite-950)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold-500)]">
          Enviar lembrete
        </a>
      </td>
    </tr>
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
        <span className={`inline-flex rounded px-2 py-1 text-xs font-semibold ring-1 ${payableStatusTone[record.status]}`}>
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

function PayableMetricCard({
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

function WorkspaceTab({
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

function HeaderButton({ children, onClick }: { children: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="hidden min-h-10 rounded-md border border-[var(--color-border)] bg-white px-3 text-sm font-medium text-[var(--color-graphite-800)] shadow-sm transition hover:border-[var(--color-gold-400)] hover:text-[var(--color-graphite-950)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold-500)] sm:inline-flex sm:items-center"
    >
      {children}
    </button>
  );
}

function PrimaryAction({
  activeTab,
  onNewPayable,
  onNewPayment,
  onNewVendor,
  setActiveTab,
}: {
  activeTab: PaymentsAccountsTab;
  onNewPayable: () => void;
  onNewPayment: () => void;
  onNewVendor: () => void;
  setActiveTab: (tab: PaymentsAccountsTab) => void;
}) {
  if (activeTab === "receivable") {
    return (
      <button
        type="button"
        onClick={() => setActiveTab("payable")}
        className="hidden min-h-10 items-center rounded-md bg-[var(--color-graphite-900)] px-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--color-graphite-800)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold-500)] sm:inline-flex"
      >
        Contas a pagar
      </button>
    );
  }

  if (activeTab === "payable") {
    return (
      <>
        <button
          type="button"
          onClick={onNewVendor}
          className="inline-flex min-h-10 items-center rounded-md border border-[var(--color-border)] bg-white px-3 text-sm font-medium text-[var(--color-graphite-800)] shadow-sm transition hover:border-[var(--color-gold-400)] hover:text-[var(--color-graphite-950)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold-500)]"
        >
          Novo fornecedor
        </button>
        <button
          type="button"
          onClick={onNewPayable}
          className="inline-flex min-h-10 items-center rounded-md bg-[var(--color-graphite-900)] px-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--color-graphite-800)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold-500)]"
        >
          Nova obrigação
        </button>
      </>
    );
  }

  return (
    <button
      type="button"
      onClick={onNewPayment}
      className="min-h-10 rounded-md bg-[var(--color-gold-500)] px-3 text-sm font-semibold text-[var(--color-graphite-950)] shadow-sm transition hover:bg-[var(--color-gold-400)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold-500)]"
    >
      Registrar pagamento
    </button>
  );
}

function VendorDialog({
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
    <ModalForm action={action} title="Novo fornecedor" onClose={onClose}>
      <FormField label="Nome do fornecedor">
        <input
          name="vendorName"
          required
          placeholder="GoldSource Refinery"
          className={fieldClassName}
        />
      </FormField>
      <FormField label="Categoria">
        <select name="vendorCategory" required className={fieldClassName}>
          <option value="raw_materials">Matéria-prima</option>
          <option value="components">Componentes</option>
          <option value="certification">Certificação</option>
          <option value="services">Serviços</option>
        </select>
      </FormField>
      <FormField label="Email financeiro">
        <input
          name="vendorEmail"
          type="email"
          placeholder="billing@fornecedor.com"
          className={fieldClassName}
        />
      </FormField>
      <FormField label="Telefone">
        <input
          name="vendorPhone"
          placeholder="+55 11 4002-1100"
          className={fieldClassName}
        />
      </FormField>
      <DialogStatus
        isPending={isPending}
        message={message}
        ok={ok}
        submitLabel="Salvar fornecedor"
      />
    </ModalForm>
  );
}

function PaymentDialog({
  action,
  customers,
  invoices,
  isPending,
  message,
  ok,
  onClose,
}: {
  action: (payload: FormData) => void;
  customers: FinanceWorkspaceData["customers"];
  invoices: FinanceWorkspaceData["invoiceRecords"];
  isPending: boolean;
  message: string;
  ok: boolean;
  onClose: () => void;
}) {
  const today = new Date().toISOString().slice(0, 10);

  return (
    <ModalForm action={action} title="Registrar pagamento" onClose={onClose}>
      <FormField label="Fatura">
        <select name="invoiceId" required className={fieldClassName}>
          <option value="">Selecione</option>
          {invoices.map((invoice) => (
            <option key={invoice.id} value={invoice.id}>
              {invoice.invoiceNumber} - {invoice.customerName}
            </option>
          ))}
        </select>
      </FormField>
      <FormField label="Cliente">
        <select name="customerId" required className={fieldClassName}>
          <option value="">Selecione</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>{customer.label}</option>
          ))}
        </select>
      </FormField>
      <FormField label="Data">
        <input name="paymentDate" type="date" required defaultValue={today} className={fieldClassName} />
      </FormField>
      <FormField label="Valor">
        <input name="amount" inputMode="decimal" required placeholder="12500,00" className={fieldClassName} />
      </FormField>
      <FormField label="Forma de pagamento">
        <select name="method" required className={fieldClassName}>
          <option value="pix">Pix</option>
          <option value="ach">ACH</option>
          <option value="wire">Wire</option>
          <option value="credit_card">Cartão de crédito</option>
          <option value="cash">Dinheiro</option>
          <option value="check">Cheque</option>
        </select>
      </FormField>
      <FormField label="Status">
        <select name="status" required className={fieldClassName}>
          <option value="settled">Concluído</option>
          <option value="pending_deposit">Depósito pendente</option>
          <option value="credit">Crédito</option>
        </select>
      </FormField>
      <FormField label="Referência">
        <input name="reference" placeholder="PIX, ACH ou comprovante" className={fieldClassName} />
      </FormField>
      <DialogStatus isPending={isPending} message={message} ok={ok} submitLabel="Salvar pagamento" />
    </ModalForm>
  );
}

function PayableDialog({
  action,
  isPending,
  message,
  ok,
  onClose,
  vendors,
}: {
  action: (payload: FormData) => void;
  isPending: boolean;
  message: string;
  ok: boolean;
  onClose: () => void;
  vendors: FinanceWorkspaceData["vendors"];
}) {
  const today = new Date().toISOString().slice(0, 10);

  return (
    <ModalForm action={action} title="Nova obrigação" onClose={onClose}>
      <FormField label="Fornecedor">
        <select name="vendorId" required className={fieldClassName}>
          <option value="">Selecione</option>
          {vendors.map((vendor) => (
            <option key={vendor.id} value={vendor.id}>{vendor.label}</option>
          ))}
        </select>
      </FormField>
      <FormField label="Categoria">
        <select name="category" required className={fieldClassName}>
          <option value="raw_materials">Matéria-prima</option>
          <option value="components">Componentes</option>
          <option value="certification">Certificação</option>
          <option value="services">Serviços</option>
        </select>
      </FormField>
      <FormField label="Data">
        <input name="payableDate" type="date" required defaultValue={today} className={fieldClassName} />
      </FormField>
      <FormField label="Vencimento">
        <input name="dueDate" type="date" required className={fieldClassName} />
      </FormField>
      <FormField label="Valor">
        <input name="total" inputMode="decimal" required placeholder="22100,00" className={fieldClassName} />
      </FormField>
      <FormField label="Status">
        <select name="status" required className={fieldClassName}>
          <option value="pending">Pendente</option>
          <option value="partial">Parcial</option>
          <option value="paid">Pago</option>
          <option value="overdue">Em atraso</option>
        </select>
      </FormField>
      <DialogStatus isPending={isPending} message={message} ok={ok} submitLabel="Salvar obrigação" />
    </ModalForm>
  );
}

function FilterChips({ labels }: { labels: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {labels.map((label) => (
        <span
          key={label}
          className="inline-flex min-h-9 items-center rounded-md border border-[var(--color-border)] bg-white px-3 text-xs font-medium text-[var(--color-graphite-800)]"
        >
          {label}
        </span>
      ))}
    </div>
  );
}

const fieldClassName =
  "min-h-11 rounded-md border border-[var(--color-border)] bg-white px-3 text-sm text-[var(--color-graphite-950)] outline-none transition focus:border-[var(--color-gold-500)] focus:ring-2 focus:ring-[var(--color-gold-500)]/20";

function ModalForm({
  action,
  children,
  onClose,
  title,
}: {
  action: (payload: FormData) => void;
  children: ReactNode;
  onClose: () => void;
  title: string;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4">
      <form action={action} className="w-full max-w-2xl rounded-md border border-[var(--color-border)] bg-white p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-gold-700)]">
              Fluxo financeiro
            </p>
            <h2 className="mt-1 text-lg font-semibold text-[var(--color-graphite-950)]">{title}</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-md border border-[var(--color-border)] px-3 py-2 text-sm">
            Fechar
          </button>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">{children}</div>
      </form>
    </div>
  );
}

function DialogStatus({
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
    <div className="md:col-span-2">
      {message ? (
        <p className={`mb-4 text-sm font-medium ${ok ? "text-emerald-700" : "text-red-700"}`}>
          {message}
        </p>
      ) : null}
      <div className="flex justify-end">
        <button type="submit" disabled={isPending} className="min-h-10 rounded-md bg-[var(--color-graphite-900)] px-4 text-sm font-semibold text-white disabled:opacity-60">
          {isPending ? "Salvando..." : submitLabel}
        </button>
      </div>
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

function nextTab(tab: PaymentsAccountsTab): PaymentsAccountsTab {
  if (tab === "payments") return "receivable";
  if (tab === "receivable") return "payable";

  return "payments";
}

function getFooterValue(
  activeTab: PaymentsAccountsTab,
  paymentSummary: ReturnType<typeof summarizePayments>,
  payableSummary: ReturnType<typeof summarizeAccountsPayable>,
  totalAgingCents: number,
) {
  if (activeTab === "payments") {
    return `${formatMoney(paymentSummary.pendingDepositsCents)} em depósitos pendentes`;
  }

  if (activeTab === "receivable") {
    return `${formatMoney(totalAgingCents)} em faturas abertas`;
  }

  return `${formatMoney(payableSummary.totalPayableCents)} em contas a pagar`;
}

function formatShortDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  }).format(new Date(`${value}T00:00:00.000Z`));
}
