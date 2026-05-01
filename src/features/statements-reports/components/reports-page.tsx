"use client";

import { signOut } from "@/app/login/actions";
import { FinanceShell } from "@/features/finance-shell/components/finance-shell";
import {
  cashFlowRows,
  monthlyReportRows,
  profitLossReport,
  reportTypeLabels,
  summarizeCashFlow,
  summarizeProfitLoss,
  summarizeRevenueAnalysis,
  summarizeTaxSummary,
  taxQuarterCards,
} from "@/features/statements-reports/data";
import type { MonthlyReportRow, ReportType, TaxQuarterCard } from "@/features/statements-reports/types";
import { formatMoney } from "@/lib/finance";
import Link from "next/link";
import { useState } from "react";

const reportTypes: ReportType[] = [
  "revenue_analysis",
  "cash_flow",
  "profit_loss",
  "tax_summary",
];

const taxStatusTone = {
  filed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  due: "bg-red-50 text-red-700 ring-red-200",
  projected: "bg-blue-50 text-blue-700 ring-blue-200",
};

export function ReportsPage({
  userEmail,
}: {
  userEmail?: string;
}) {
  const [activeReportType, setActiveReportType] = useState<ReportType>("revenue_analysis");
  const revenue = summarizeRevenueAnalysis(monthlyReportRows);
  const cashFlow = summarizeCashFlow(cashFlowRows);
  const profitLoss = summarizeProfitLoss(profitLossReport);
  const taxSummary = summarizeTaxSummary(taxQuarterCards);

  return (
    <FinanceShell
      currentPath="/reports"
      eyebrow="Financeiro Alisson Joias"
      title="Reports"
      userEmail={userEmail}
      secondaryAction={<HeaderLink href="/statements">Statements</HeaderLink>}
      primaryAction={
        <>
          <button className="min-h-10 rounded-md bg-[var(--color-gold-500)] px-3 text-sm font-semibold text-[var(--color-graphite-950)] shadow-sm transition hover:bg-[var(--color-gold-400)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold-500)]">
            Export Report
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
          {reportTypeLabels[activeReportType]} ativo
          <div className="mt-2 font-medium text-[var(--color-gold-200)]">
            {revenue.revenueTrendPercent}% vs mês anterior
          </div>
        </div>
      }
    >
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-5 px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
        <section className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 shadow-[var(--shadow-widget)]">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div role="tablist" aria-label="Report type selector" className="flex flex-wrap gap-2">
              {reportTypes.map((type) => (
                <ReportTypeTab
                  key={type}
                  isActive={activeReportType === type}
                  onClick={() => setActiveReportType(type)}
                >
                  {reportTypeLabels[type]}
                </ReportTypeTab>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <InactiveRouteTab href="/statements">Statements</InactiveRouteTab>
              <ActiveRouteTab href="/reports">Reports</ActiveRouteTab>
            </div>
          </div>
        </section>

        <section className="grid gap-3 md:grid-cols-4">
          <MetricCard label="Receita" value={formatMoney(revenue.revenueCents)} detail={`+${revenue.revenueTrendPercent}% vs Abr/2026`} />
          <MetricCard label="Despesas" value={formatMoney(revenue.expensesCents)} detail="COGS + operating expenses" />
          <MetricCard label="Lucro" value={formatMoney(revenue.profitCents)} detail="Profit líquido do mês" />
          <MetricCard label="Margem" value={`${revenue.marginPercent}%`} detail="Margem líquida" />
        </section>

        <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]">
          {renderActiveReport({
            activeReportType,
            cashFlow,
            profitLoss,
            taxSummary,
          })}

          <aside className="grid gap-3">
            <SideReportCard title="Cash Flow" value={formatMoney(cashFlow.netCashFlowCents)} detail="Inflows versus outflows" tone="blue" />
            <SideReportCard title="Profit & Loss" value={formatMoney(profitLoss.netProfitCents)} detail="Revenue, COGS e expenses" tone="emerald" />
            <SideReportCard title="Tax Summary" value={formatMoney(taxSummary.payableCents)} detail="Impostos a pagar" tone="red" />
            <article className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-widget)]">
              <h2 className="text-base font-semibold tracking-normal text-[var(--color-graphite-950)]">
                Cash Flow
              </h2>
              <div className="mt-4 space-y-3">
                <FlowMetric label="Inflows" value={formatMoney(cashFlow.inflowsCents)} tone="positive" />
                <FlowMetric label="Outflows" value={formatMoney(cashFlow.outflowsCents)} tone="negative" />
                <FlowMetric label="Net Cash Flow" value={formatMoney(cashFlow.netCashFlowCents)} tone="positive" />
              </div>
            </article>
            <article className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-widget)]">
              <h2 className="text-base font-semibold tracking-normal text-[var(--color-graphite-950)]">
                Profit & Loss
              </h2>
              <div className="mt-4 space-y-3">
                <FlowMetric label="Revenue" value={formatMoney(profitLoss.revenueCents)} tone="positive" />
                <FlowMetric label="COGS" value={formatMoney(profitLoss.cogsCents)} tone="neutral" />
                <FlowMetric label="Operating Expenses" value={formatMoney(profitLoss.operatingExpensesCents)} tone="neutral" />
                <FlowMetric label="Net Profit" value={formatMoney(profitLoss.netProfitCents)} tone="positive" />
              </div>
            </article>
            <article className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-widget)]">
              <h2 className="text-base font-semibold tracking-normal text-[var(--color-graphite-950)]">
                Tax Summary
              </h2>
              <div className="mt-3 space-y-3">
                {taxQuarterCards.map((card) => (
                  <TaxQuarter key={card.quarter} card={card} />
                ))}
              </div>
            </article>
          </aside>
        </section>
      </div>
    </FinanceShell>
  );
}

function renderActiveReport({
  activeReportType,
  cashFlow,
  profitLoss,
  taxSummary,
}: {
  activeReportType: ReportType;
  cashFlow: ReturnType<typeof summarizeCashFlow>;
  profitLoss: ReturnType<typeof summarizeProfitLoss>;
  taxSummary: ReturnType<typeof summarizeTaxSummary>;
}) {
  if (activeReportType === "cash_flow") {
    return (
      <div className="grid gap-4">
        <article className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-widget)]">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-gold-700)]">
            Cash Flow
          </p>
          <h2 className="mt-1 text-base font-semibold tracking-normal text-[var(--color-graphite-950)]">
            Inflows versus Outflows
          </h2>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <MetricCard label="Inflows" value={formatMoney(cashFlow.inflowsCents)} detail="Recebimentos e entradas" />
            <MetricCard label="Outflows" value={formatMoney(cashFlow.outflowsCents)} detail="Pagamentos e saídas" />
            <MetricCard label="Net Cash Flow" value={formatMoney(cashFlow.netCashFlowCents)} detail="Fluxo líquido" />
          </div>
          <div className="mt-6 grid min-h-64 grid-cols-2 items-end gap-8 border-l border-b border-[var(--color-border)] px-8 pt-4">
            <CashFlowBar label="Inflows" value={cashFlow.inflowsCents} max={cashFlow.inflowsCents} tone="bg-emerald-600" />
            <CashFlowBar label="Outflows" value={cashFlow.outflowsCents} max={cashFlow.inflowsCents} tone="bg-red-500" />
          </div>
        </article>
      </div>
    );
  }

  if (activeReportType === "profit_loss") {
    return (
      <div className="grid gap-4">
        <article className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-widget)]">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-gold-700)]">
            Profit & Loss
          </p>
          <h2 className="mt-1 text-base font-semibold tracking-normal text-[var(--color-graphite-950)]">
            Revenue, COGS, Operating Expenses e Net Profit
          </h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <FlowMetric label="Revenue" value={formatMoney(profitLoss.revenueCents)} tone="positive" />
            <FlowMetric label="COGS" value={formatMoney(profitLoss.cogsCents)} tone="neutral" />
            <FlowMetric label="Operating Expenses" value={formatMoney(profitLoss.operatingExpensesCents)} tone="neutral" />
            <FlowMetric label="Net Profit" value={formatMoney(profitLoss.netProfitCents)} tone="positive" />
          </div>
        </article>
      </div>
    );
  }

  if (activeReportType === "tax_summary") {
    return (
      <div className="grid gap-4">
        <article className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-widget)]">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-gold-700)]">
            Tax Summary
          </p>
          <h2 className="mt-1 text-base font-semibold tracking-normal text-[var(--color-graphite-950)]">
            Trimestres, valores coletados e status
          </h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <MetricCard label="Collected" value={formatMoney(taxSummary.collectedCents)} detail="Impostos coletados" />
            <MetricCard label="Payable" value={formatMoney(taxSummary.payableCents)} detail="Impostos a pagar" />
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {taxQuarterCards.map((card) => (
              <TaxQuarter key={card.quarter} card={card} />
            ))}
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <article className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-widget)]">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-gold-700)]">
              Revenue Analysis
            </p>
            <h2 className="mt-1 text-base font-semibold tracking-normal text-[var(--color-graphite-950)]">
              Receita, despesas e lucro
            </h2>
          </div>
          <div className="hidden gap-3 text-xs text-[var(--color-muted)] sm:flex">
            <Legend color="bg-blue-500" label="Receita" />
            <Legend color="bg-red-500" label="Despesas" />
            <Legend color="bg-emerald-600" label="Lucro" />
          </div>
        </div>
        <div className="grid min-h-64 grid-cols-6 items-end gap-3 border-l border-b border-[var(--color-border)] px-3 pt-4">
          {monthlyReportRows.map((row) => (
            <ChartColumn key={row.month} row={row} />
          ))}
        </div>
      </article>

      <article className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-widget)]">
        <h2 className="text-base font-semibold tracking-normal text-[var(--color-graphite-950)]">
          Tabela mensal
        </h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[48rem] table-fixed border-separate border-spacing-0 text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-[0.12em] text-[var(--color-muted)]">
                <th className="border-b border-[var(--color-border)] pb-3 pr-4 font-semibold">Mês</th>
                <th className="border-b border-[var(--color-border)] pb-3 pr-4 font-semibold">Receita</th>
                <th className="border-b border-[var(--color-border)] pb-3 pr-4 font-semibold">Despesas</th>
                <th className="border-b border-[var(--color-border)] pb-3 pr-4 font-semibold">Lucro</th>
                <th className="border-b border-[var(--color-border)] pb-3 font-semibold">Trend</th>
              </tr>
            </thead>
            <tbody>
              {monthlyReportRows.map((row) => (
                <ReportRow key={row.month} row={row} />
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </div>
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

function CashFlowBar({
  label,
  max,
  tone,
  value,
}: {
  label: string;
  max: number;
  tone: string;
  value: number;
}) {
  const height = Math.max(14, Math.round((value / max) * 100));

  return (
    <div className="flex h-full min-h-56 flex-col justify-end gap-2">
      <div className="flex h-44 items-end justify-center">
        <span className={`w-16 rounded-t ${tone}`} style={{ height: `${height}%` }} />
      </div>
      <p className="text-center text-xs font-semibold text-[var(--color-muted)]">{label}</p>
      <p className="text-center font-mono text-sm font-semibold text-[var(--color-graphite-950)]">
        {formatMoney(value)}
      </p>
    </div>
  );
}

function ChartColumn({ row }: { row: MonthlyReportRow }) {
  const revenueHeight = Math.max(18, Math.round((row.revenueCents / 284245000) * 100));
  const expensesHeight = Math.max(18, Math.round((row.expensesCents / 116523000) * 100));
  const profitHeight = Math.max(18, Math.round((row.profitCents / 167722000) * 100));

  return (
    <div className="flex h-full min-h-56 flex-col justify-end gap-2">
      <div className="flex h-44 items-end justify-center gap-1">
        <span className="w-3 rounded-t bg-blue-500" style={{ height: `${revenueHeight}%` }} />
        <span className="w-3 rounded-t bg-red-500" style={{ height: `${expensesHeight}%` }} />
        <span className="w-3 rounded-t bg-emerald-600" style={{ height: `${profitHeight}%` }} />
      </div>
      <p className="truncate text-center font-mono text-xs text-[var(--color-muted)]">{row.month}</p>
    </div>
  );
}

function ReportRow({ row }: { row: MonthlyReportRow }) {
  const margin = Math.round((row.profitCents / row.revenueCents) * 1000) / 10;

  return (
    <tr className="transition hover:bg-[var(--color-graphite-50)]">
      <td className="border-b border-[var(--color-border)] py-3 pr-4 font-mono text-[var(--color-muted)]">{row.month}</td>
      <td className="border-b border-[var(--color-border)] py-3 pr-4 font-mono">{formatMoney(row.revenueCents)}</td>
      <td className="border-b border-[var(--color-border)] py-3 pr-4 font-mono">{formatMoney(row.expensesCents)}</td>
      <td className="border-b border-[var(--color-border)] py-3 pr-4 font-mono font-semibold text-emerald-700">{formatMoney(row.profitCents)}</td>
      <td className="border-b border-[var(--color-border)] py-3 font-mono text-[var(--color-graphite-900)]">{margin}%</td>
    </tr>
  );
}

function SideReportCard({
  title,
  value,
  detail,
  tone,
}: {
  title: string;
  value: string;
  detail: string;
  tone: "blue" | "emerald" | "red";
}) {
  const toneClass = {
    blue: "text-blue-700 bg-blue-50 ring-blue-200",
    emerald: "text-emerald-700 bg-emerald-50 ring-emerald-200",
    red: "text-red-700 bg-red-50 ring-red-200",
  }[tone];

  return (
    <article className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-widget)]">
      <span className={`rounded px-2 py-1 text-xs font-semibold ring-1 ${toneClass}`}>{title}</span>
      <p className="mt-4 font-mono text-xl font-semibold tracking-normal text-[var(--color-graphite-950)]">
        {value}
      </p>
      <p className="mt-2 text-sm text-[var(--color-muted)]">{detail}</p>
    </article>
  );
}

function TaxQuarter({ card }: { card: TaxQuarterCard }) {
  return (
    <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-graphite-50)] p-3">
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-sm font-semibold text-[var(--color-graphite-950)]">{card.quarter}</p>
        <span className={`rounded px-2 py-1 text-xs font-semibold ring-1 ${taxStatusTone[card.status]}`}>
          {card.status}
        </span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div>
          <p className="text-[var(--color-muted)]">Coletado</p>
          <p className="mt-1 font-mono font-semibold">{formatMoney(card.collectedCents)}</p>
        </div>
        <div>
          <p className="text-[var(--color-muted)]">A pagar</p>
          <p className="mt-1 font-mono font-semibold text-red-700">{formatMoney(card.payableCents)}</p>
        </div>
      </div>
    </div>
  );
}

function FlowMetric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "positive" | "negative" | "neutral";
}) {
  const toneClass = {
    positive: "text-emerald-700",
    negative: "text-red-700",
    neutral: "text-[var(--color-graphite-900)]",
  }[tone];

  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-[var(--color-border)] bg-[var(--color-graphite-50)] px-3 py-2">
      <p className="text-xs font-medium text-[var(--color-muted)]">{label}</p>
      <p className={`font-mono text-sm font-semibold ${toneClass}`}>{value}</p>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`h-2 w-2 rounded-full ${color}`} />
      {label}
    </span>
  );
}

function ReportTypeTab({
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

function ActiveRouteTab({ href, children }: { href: string; children: string }) {
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

function InactiveRouteTab({ href, children }: { href: string; children: string }) {
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
