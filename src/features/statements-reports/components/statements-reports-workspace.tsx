"use client";

import { signOut } from "@/app/login/actions";
import type { FinanceWorkspaceData } from "@/features/finance/data";
import { FinanceShell } from "@/features/finance-shell/components/finance-shell";
import { logStatementActivityAction } from "@/features/finance/actions";
import {
  buildRevenueChartAxis,
  buildRevenueChartColumns,
  filterStatementsByDateRange,
  getDefaultDateRange,
  reportTypeLabels,
  summarizeCashFlow,
  summarizeProfitLoss,
  summarizeRevenueAnalysis,
  summarizeStatements,
  summarizeTaxSummary,
} from "@/features/statements-reports/data";
import type {
  CashFlowRow,
  CustomerStatement,
  MonthlyReportRow,
  ReportType,
  TaxQuarterCard,
} from "@/features/statements-reports/types";
import { formatMoney } from "@/lib/finance";
import { useMemo, useState, useCallback } from "react";

export type StatementsReportsTab = "statements" | "reports";

const workspaceTabs: StatementsReportsTab[] = ["statements", "reports"];

const workspaceLabels: Record<StatementsReportsTab, string> = {
  statements: "Extratos",
  reports: "Relatórios",
};

const workspacePaths: Record<StatementsReportsTab, string> = {
  statements: "/statements",
  reports: "/reports",
};

const reportTypes: ReportType[] = [
  "revenue_analysis",
  "cash_flow",
  "profit_loss",
  "tax_summary",
];

const segmentTone = {
  "Custom Orders": "bg-amber-50 text-amber-700 ring-amber-200",
  Repairs: "bg-blue-50 text-blue-700 ring-blue-200",
  Wholesale: "bg-purple-50 text-purple-700 ring-purple-200",
  Retail: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

const taxStatusTone = {
  filed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  due: "bg-red-50 text-red-700 ring-red-200",
  projected: "bg-blue-50 text-blue-700 ring-blue-200",
};

export function StatementsReportsWorkspace({
  data,
  initialTab,
  userEmail,
}: {
  data: FinanceWorkspaceData;
  initialTab: StatementsReportsTab;
  userEmail?: string;
}) {
  const [activeTab, setActiveTab] = useState<StatementsReportsTab>(initialTab);
  const [activeReportType, setActiveReportType] = useState<ReportType>("revenue_analysis");

  const defaultRange = useMemo(() => getDefaultDateRange(), []);
  const [startDate, setStartDate] = useState(defaultRange.startDate);
  const [endDate, setEndDate] = useState(defaultRange.endDate);

  const filteredStatements = useMemo(
    () => filterStatementsByDateRange(data.customerStatements, startDate, endDate),
    [data.customerStatements, startDate, endDate],
  );
  const statementsSummary = useMemo(
    () => summarizeStatements(filteredStatements),
    [filteredStatements],
  );

  const handleStartDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value);
  }, []);
  const handleEndDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
  }, []);

  const revenue = summarizeRevenueAnalysis(data.monthlyReportRows);
  const revenueColumns = buildRevenueChartColumns(data.monthlyReportRows);
  const revenueAxis = buildRevenueChartAxis(data.monthlyReportRows);
  const cashFlow = summarizeCashFlow(data.cashFlowRows);
  const profitLoss = summarizeProfitLoss(data.profitLossReport);
  const taxSummary = summarizeTaxSummary(data.taxQuarterCards);

  return (
    <FinanceShell
      currentPath={workspacePaths[activeTab]}
      eyebrow="Financeiro Alisson Joias"
      title={workspaceLabels[activeTab]}
      userEmail={userEmail}
      secondaryAction={
        <HeaderButton onClick={() => setActiveTab(activeTab === "statements" ? "reports" : "statements")}>
          {activeTab === "statements" ? "Relatórios" : "Extratos"}
        </HeaderButton>
      }
      primaryAction={
        <>
          {activeTab === "statements" ? (
            <>
              <a href="mailto:?subject=Extratos Alisson Joias" className="min-h-10 rounded-md border border-[var(--color-gold-400)] bg-white px-3 py-2 text-sm font-semibold text-[var(--color-gold-800)] shadow-sm transition hover:bg-[var(--color-gold-50)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold-500)]">
                Enviar extratos
              </a>
              <a href="/api/exports/statements/bulk" target="_blank" className="min-h-10 rounded-md bg-[var(--color-gold-500)] px-3 py-2 text-sm font-semibold text-[var(--color-graphite-950)] shadow-sm transition hover:bg-[var(--color-gold-400)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold-500)]">
                Baixar em lote
              </a>
            </>
          ) : (
            <a href="/api/exports/reports" target="_blank" className="min-h-10 rounded-md bg-[var(--color-gold-500)] px-3 py-2 text-sm font-semibold text-[var(--color-graphite-950)] shadow-sm transition hover:bg-[var(--color-gold-400)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold-500)]">
              Exportar relatório
            </a>
          )}
          <form action={signOut}>
            <button className="min-h-10 rounded-md border border-[var(--color-border)] bg-white px-3 text-sm font-medium text-[var(--color-graphite-800)] shadow-sm transition hover:border-red-300 hover:text-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400">
              Sair
            </button>
          </form>
        </>
      }
      footer={
        activeTab === "statements" ? (
          <div className="rounded-md bg-white/8 p-3 text-xs leading-5 text-white/72">
            Extratos prontos para envio
            <div className="mt-2 font-medium text-[var(--color-gold-200)]">
              {statementsSummary.totalCustomers} clientes no período
            </div>
          </div>
        ) : (
          <div className="rounded-md bg-white/8 p-3 text-xs leading-5 text-white/72">
            {reportTypeLabels[activeReportType]} ativo
            <div className="mt-2 font-medium text-[var(--color-gold-200)]">
              {revenue.revenueTrendPercent}% vs mês anterior
            </div>
          </div>
        )
      }
    >
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-5 px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
        <section className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 shadow-[var(--shadow-widget)]">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-gold-700)]">
                {activeTab === "statements" ? "Período" : "Tipo de relatório"}
              </p>
              {activeTab === "statements" ? (
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <input
                    type="date"
                    aria-label="Data inicial"
                    value={startDate}
                    onChange={handleStartDateChange}
                    className="min-h-10 rounded-md border border-[var(--color-border)] bg-white px-3 font-mono text-sm text-[var(--color-graphite-900)] focus:border-[var(--color-gold-400)] focus:outline-none focus:ring-1 focus:ring-[var(--color-gold-400)]"
                  />
                  <span className="text-sm text-[var(--color-muted)]">até</span>
                  <input
                    type="date"
                    aria-label="Data final"
                    value={endDate}
                    onChange={handleEndDateChange}
                    className="min-h-10 rounded-md border border-[var(--color-border)] bg-white px-3 font-mono text-sm text-[var(--color-graphite-900)] focus:border-[var(--color-gold-400)] focus:outline-none focus:ring-1 focus:ring-[var(--color-gold-400)]"
                  />
                </div>
              ) : (
                <div role="tablist" aria-label="Report type selector" className="mt-2 flex flex-wrap gap-2">
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
              )}
            </div>
            <div role="tablist" aria-label="Extratos e relatórios" className="flex flex-wrap gap-2">
              {workspaceTabs.map((tab) => (
                <WorkspaceTab
                  key={tab}
                  isActive={activeTab === tab}
                  onClick={() => setActiveTab(tab)}
                >
                  {workspaceLabels[tab]}
                </WorkspaceTab>
              ))}
            </div>
          </div>
        </section>

        {activeTab === "statements" ? (
          <StatementsTab statements={filteredStatements} summary={statementsSummary} />
        ) : (
          <ReportsTab
            activeReportType={activeReportType}
            cashFlow={cashFlow}
            cashFlowRows={data.cashFlowRows}
            monthlyRows={data.monthlyReportRows}
            profitLoss={profitLoss}
            revenue={revenue}
            revenueAxis={revenueAxis}
            revenueColumns={revenueColumns}
            taxCards={data.taxQuarterCards}
            taxSummary={taxSummary}
          />
        )}
      </div>
    </FinanceShell>
  );
}

function StatementsTab({
  statements,
  summary,
}: {
  statements: CustomerStatement[];
  summary: ReturnType<typeof summarizeStatements>;
}) {
  return (
    <>
      <section className="grid gap-3 md:grid-cols-4">
        <MetricCard label="Clientes" value={String(summary.totalCustomers)} detail="Extratos gerados" />
        <MetricCard label="Faturas" value={String(summary.totalInvoices)} detail="No período selecionado" />
        <MetricCard label="Saldo" value={formatMoney(summary.netBalanceCents)} detail="Saldo líquido" />
        <MetricCard label="Créditos" value={formatMoney(summary.creditCents)} detail="Overpayments ativos" />
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="grid gap-3">
          {statements.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-[var(--color-border)] bg-[var(--color-graphite-50)] px-6 py-12 text-center">
              <p className="text-sm font-semibold text-[var(--color-graphite-800)]">
                Nenhum extrato encontrado
              </p>
              <p className="mt-2 text-sm text-[var(--color-muted)]">
                Ajuste o período para visualizar extratos de clientes.
              </p>
            </div>
          ) : (
            statements.map((statement) => (
              <StatementCard key={statement.id} statement={statement} />
            ))
          )}
        </div>

        <aside className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-widget)]">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-gold-700)]">
            Prévia de relatórios
          </p>
          <h2 className="mt-1 text-base font-semibold tracking-normal text-[var(--color-graphite-950)]">
            Análise de Receita
          </h2>
          <div className="mt-4 space-y-3">
            <PreviewMetric label="Outstanding" value={formatMoney(summary.outstandingCents)} />
            <PreviewMetric label="Credits" value={formatMoney(summary.creditCents)} />
            <PreviewMetric label="Saldo líquido" value={formatMoney(summary.netBalanceCents)} />
          </div>
        </aside>
      </section>
    </>
  );
}

function ReportsTab({
  activeReportType,
  cashFlow,
  cashFlowRows,
  monthlyRows,
  profitLoss,
  revenue,
  revenueAxis,
  revenueColumns,
  taxCards,
  taxSummary,
}: {
  activeReportType: ReportType;
  cashFlow: ReturnType<typeof summarizeCashFlow>;
  cashFlowRows: CashFlowRow[];
  monthlyRows: MonthlyReportRow[];
  profitLoss: ReturnType<typeof summarizeProfitLoss>;
  revenue: ReturnType<typeof summarizeRevenueAnalysis>;
  revenueAxis: ReturnType<typeof buildRevenueChartAxis>;
  revenueColumns: ReturnType<typeof buildRevenueChartColumns>;
  taxCards: TaxQuarterCard[];
  taxSummary: ReturnType<typeof summarizeTaxSummary>;
}) {
  const [hoveredRevenueRow, setHoveredRevenueRow] = useState<MonthlyReportRow | null>(null);
  const [hoveredCashFlowLabel, setHoveredCashFlowLabel] = useState<{
    label: string;
    value: number;
  } | null>(null);
  const activeRevenueRow = hoveredRevenueRow ?? monthlyRows.at(-1) ?? null;

  return (
    <>
      <section className="grid gap-3 md:grid-cols-4">
        <MetricCard label="Receita" value={formatMoney(revenue.revenueCents)} detail={`+${revenue.revenueTrendPercent}% vs Abr/2026`} />
        <MetricCard label="Despesas" value={formatMoney(revenue.expensesCents)} detail="Custos + despesas operacionais" />
        <MetricCard label="Lucro" value={formatMoney(revenue.profitCents)} detail="Profit líquido do mês" />
        <MetricCard label="Margem" value={`${revenue.marginPercent}%`} detail="Margem líquida" />
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]">
        {renderActiveReport({
          activeReportType,
          cashFlow,
          cashFlowRows,
          hoveredCashFlowLabel,
          hoveredRevenueRow: activeRevenueRow,
          monthlyRows,
          profitLoss,
          revenueAxis,
          revenueColumns,
          setHoveredCashFlowLabel,
          setHoveredRevenueRow,
          taxCards,
          taxSummary,
        })}

        <aside className="grid gap-3">
          <SideReportCard title="Fluxo de Caixa" value={formatMoney(cashFlow.netCashFlowCents)} detail="Entradas versus saídas" tone="blue" />
          <SideReportCard title="Lucros e Perdas" value={formatMoney(profitLoss.netProfitCents)} detail="Receita, custos e despesas" tone="emerald" />
          <SideReportCard title="Resumo de Impostos" value={formatMoney(taxSummary.payableCents)} detail="Impostos a pagar" tone="red" />
          <article className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-widget)]">
            <h2 className="text-base font-semibold tracking-normal text-[var(--color-graphite-950)]">
              Fluxo de Caixa
            </h2>
            <div className="mt-4 space-y-3">
              <FlowMetric label="Entradas" value={formatMoney(cashFlow.inflowsCents)} tone="positive" />
              <FlowMetric label="Saídas" value={formatMoney(cashFlow.outflowsCents)} tone="negative" />
              <FlowMetric label="Fluxo líquido" value={formatMoney(cashFlow.netCashFlowCents)} tone="positive" />
            </div>
          </article>
          <article className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-widget)]">
            <h2 className="text-base font-semibold tracking-normal text-[var(--color-graphite-950)]">
              Lucros e Perdas
            </h2>
            <div className="mt-4 space-y-3">
              <FlowMetric label="Revenue" value={formatMoney(profitLoss.revenueCents)} tone="positive" />
              <FlowMetric label="Custos" value={formatMoney(profitLoss.cogsCents)} tone="neutral" />
              <FlowMetric label="Despesas operacionais" value={formatMoney(profitLoss.operatingExpensesCents)} tone="neutral" />
              <FlowMetric label="Net Profit" value={formatMoney(profitLoss.netProfitCents)} tone="positive" />
            </div>
          </article>
          <article className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-widget)]">
            <h2 className="text-base font-semibold tracking-normal text-[var(--color-graphite-950)]">
              Resumo de Impostos
            </h2>
            <div className="mt-3 space-y-3">
              {taxCards.map((card) => (
                <TaxQuarter key={card.quarter} card={card} />
              ))}
            </div>
          </article>
        </aside>
      </section>
    </>
  );
}

function renderActiveReport({
  activeReportType,
  cashFlow,
  cashFlowRows,
  hoveredCashFlowLabel,
  hoveredRevenueRow,
  monthlyRows,
  profitLoss,
  revenueAxis,
  revenueColumns,
  setHoveredCashFlowLabel,
  setHoveredRevenueRow,
  taxCards,
  taxSummary,
}: {
  activeReportType: ReportType;
  cashFlow: ReturnType<typeof summarizeCashFlow>;
  cashFlowRows: CashFlowRow[];
  hoveredCashFlowLabel: { label: string; value: number } | null;
  hoveredRevenueRow: MonthlyReportRow | null;
  monthlyRows: MonthlyReportRow[];
  profitLoss: ReturnType<typeof summarizeProfitLoss>;
  revenueAxis: ReturnType<typeof buildRevenueChartAxis>;
  revenueColumns: ReturnType<typeof buildRevenueChartColumns>;
  setHoveredCashFlowLabel: (value: { label: string; value: number } | null) => void;
  setHoveredRevenueRow: (value: MonthlyReportRow | null) => void;
  taxCards: TaxQuarterCard[];
  taxSummary: ReturnType<typeof summarizeTaxSummary>;
}) {
  if (activeReportType === "cash_flow") {
    return (
      <CashFlowLineChart
        cashFlow={cashFlow}
        rows={cashFlowRows}
        hoveredCashFlowLabel={hoveredCashFlowLabel}
        setHoveredCashFlowLabel={setHoveredCashFlowLabel}
      />
    );
  }

  if (activeReportType === "profit_loss") {
    return (
      <div className="grid gap-4">
        <article className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-widget)]">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-gold-700)]">
            Lucros e Perdas
          </p>
          <h2 className="mt-1 text-base font-semibold tracking-normal text-[var(--color-graphite-950)]">
            Receita, custos, despesas operacionais e lucro líquido
          </h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <FlowMetric label="Revenue" value={formatMoney(profitLoss.revenueCents)} tone="positive" />
            <FlowMetric label="Custos" value={formatMoney(profitLoss.cogsCents)} tone="neutral" />
            <FlowMetric label="Despesas operacionais" value={formatMoney(profitLoss.operatingExpensesCents)} tone="neutral" />
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
            Resumo de Impostos
          </p>
          <h2 className="mt-1 text-base font-semibold tracking-normal text-[var(--color-graphite-950)]">
            Trimestres, valores coletados e status
          </h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <MetricCard label="Collected" value={formatMoney(taxSummary.collectedCents)} detail="Impostos coletados" />
            <MetricCard label="Payable" value={formatMoney(taxSummary.payableCents)} detail="Impostos a pagar" />
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {taxCards.map((card) => (
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
              Análise de Receita
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
        <div className="grid min-h-64 grid-cols-[4rem_minmax(0,1fr)] gap-3">
          <div className="relative min-h-64">
            {revenueAxis.map(({ ratio, value }) => (
              <div
                key={`${value}-${ratio}`}
                className="absolute left-0 right-0 flex -translate-y-1/2 items-center justify-end pr-2 text-right"
                style={{ top: `${ratio * 100}%` }}
              >
                <span className="text-[11px] font-mono text-[var(--color-muted)]">
                  {formatMoney(value)}
                </span>
              </div>
            ))}
          </div>
          <div className="grid min-h-64 grid-cols-6 items-end gap-3 border-l border-b border-[var(--color-border)] px-3 pt-4">
            {monthlyRows.map((row, index) => (
              <ChartColumn
                key={row.month}
                row={row}
                scale={revenueColumns[index]}
                onHover={setHoveredRevenueRow}
              />
            ))}
          </div>
        </div>
        <div className="mt-4 rounded-md border border-[var(--color-border)] bg-[var(--color-graphite-50)] px-3 py-2 font-mono text-xs text-[var(--color-graphite-800)]">
          {hoveredRevenueRow
            ? `${hoveredRevenueRow.month} · Receita ${formatMoney(hoveredRevenueRow.revenueCents)} · Despesas ${formatMoney(hoveredRevenueRow.expensesCents)} · Lucro ${formatMoney(hoveredRevenueRow.profitCents)}`
            : "Passe o mouse sobre as colunas"}
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
                <th className="border-b border-[var(--color-border)] pb-3 pr-4 font-semibold">Margem</th>
                <th className="border-b border-[var(--color-border)] pb-3 font-semibold">Trend</th>
              </tr>
            </thead>
            <tbody>
              {monthlyRows.map((row, index) => (
                <ReportRow key={row.month} row={row} previousRow={monthlyRows[index - 1]} />
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </div>
  );
}

function CashFlowLineChart({
  cashFlow,
  rows,
  hoveredCashFlowLabel,
  setHoveredCashFlowLabel,
}: {
  cashFlow: ReturnType<typeof summarizeCashFlow>;
  rows: CashFlowRow[];
  hoveredCashFlowLabel: { label: string; value: number } | null;
  setHoveredCashFlowLabel: (value: { label: string; value: number } | null) => void;
}) {
  const maxValue = Math.max(
    ...rows.map((r) => Math.max(r.inflowsCents, r.outflowsCents)),
    1,
  );
  const plotWidth = 500;
  const plotHeight = 180;
  const padLeft = 10;
  const padRight = 10;
  const padTop = 10;
  const padBottom = 30;
  const chartW = plotWidth - padLeft - padRight;
  const chartH = plotHeight - padTop - padBottom;

  const xFor = (i: number) =>
    padLeft + (rows.length > 1 ? (i / (rows.length - 1)) * chartW : chartW / 2);
  const yFor = (v: number) =>
    padTop + chartH - (maxValue > 0 ? (v / maxValue) * chartH : 0);

  const buildPath = (key: "inflowsCents" | "outflowsCents") =>
    rows
      .map((r, i) => `${i === 0 ? "M" : "L"} ${xFor(i)} ${yFor(r[key])}`)
      .join(" ");

  return (
    <div className="grid gap-4">
      <article className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-widget)]">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-gold-700)]">
          Fluxo de Caixa
        </p>
        <h2 className="mt-1 text-base font-semibold tracking-normal text-[var(--color-graphite-950)]">
          Entradas versus saídas — últimos 6 meses
        </h2>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <MetricCard label="Entradas" value={formatMoney(cashFlow.inflowsCents)} detail="Recebimentos e entradas" />
          <MetricCard label="Saídas" value={formatMoney(cashFlow.outflowsCents)} detail="Pagamentos e saídas" />
          <MetricCard label="Fluxo líquido" value={formatMoney(cashFlow.netCashFlowCents)} detail="Fluxo líquido" />
        </div>
        {rows.length > 0 ? (
          <div className="mt-6 min-h-52">
            <svg
              aria-label="Gráfico de linhas: Fluxo de Caixa mensal"
              className="h-full w-full overflow-visible"
              viewBox={`0 0 ${plotWidth} ${plotHeight}`}
              role="img"
            >
              <path d={buildPath("inflowsCents")} fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <path d={buildPath("outflowsCents")} fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              {rows.map((r, i) => (
                <g
                  key={r.month}
                  onMouseEnter={() => setHoveredCashFlowLabel({ label: `${r.month} Entradas`, value: r.inflowsCents })}
                  onMouseLeave={() => setHoveredCashFlowLabel(null)}
                >
                  <circle cx={xFor(i)} cy={yFor(r.inflowsCents)} r="5" fill="#10b981" />
                  <circle cx={xFor(i)} cy={yFor(r.outflowsCents)} r="4" fill="#ef4444" />
                  <text x={xFor(i)} y={plotHeight - 5} fill="#6f6a60" fontSize="11" textAnchor="middle">
                    {r.month}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        ) : null}
        <div className="mt-3 flex flex-wrap gap-3 text-sm text-[var(--color-muted)]">
          <Legend color="bg-emerald-500" label="Entradas" />
          <Legend color="bg-red-500" label="Saídas" />
        </div>
        <div className="mt-2 rounded-md border border-[var(--color-border)] bg-[var(--color-graphite-50)] px-3 py-2 font-mono text-xs text-[var(--color-graphite-800)]">
          {hoveredCashFlowLabel
            ? `${hoveredCashFlowLabel.label}: ${formatMoney(hoveredCashFlowLabel.value)}`
            : "Passe o mouse sobre os pontos"}
        </div>
      </article>
    </div>
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
          <p className="mt-2 text-xs font-medium text-[var(--color-muted)]">Saldo</p>
          <p className={`mt-1 font-mono text-sm font-semibold ${isCredit ? "text-red-700" : "text-emerald-700"}`}>
            {formatMoney(statement.balanceCents)}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 lg:justify-end">
          {statement.actions.map((action) => (
            <a
              key={action}
              href={action === "email" ? `mailto:?subject=${statement.statementNumber}` : `/api/exports/statements/${statement.id}`}
              target={action === "email" ? undefined : "_blank"}
              onClick={() => logStatementActivityAction(statement.statementNumber, action)}
              className="min-h-9 rounded-md border border-[var(--color-border)] bg-white px-3 text-xs font-semibold text-[var(--color-graphite-800)] transition hover:border-[var(--color-gold-400)] hover:text-[var(--color-graphite-950)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold-500)]"
            >
              {getActionLabel(action)}
            </a>
          ))}
        </div>
      </div>
    </article>
  );
}

function MetricCard({ label, value, detail }: { label: string; value: string; detail: string }) {
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

function CashFlowBar({
  label,
  max,
  onHover,
  tone,
  value,
}: {
  label: string;
  max: number;
  onHover: (value: { label: string; value: number } | null) => void;
  tone: string;
  value: number;
}) {
  const height = Math.max(14, Math.round((value / max) * 100));

  return (
    <div
      className="flex h-full min-h-56 flex-col justify-end gap-2"
      onMouseEnter={() => onHover({ label, value })}
      onMouseLeave={() => onHover(null)}
    >
      <div className="flex h-44 items-end justify-center">
        <span
          className={`w-16 rounded-t ${tone}`}
          style={{ height: `${height}%` }}
        />
      </div>
      <p className="text-center text-xs font-semibold text-[var(--color-muted)]">{label}</p>
      <p className="text-center font-mono text-sm font-semibold text-[var(--color-graphite-950)]">
        {formatMoney(value)}
      </p>
    </div>
  );
}

function ChartColumn({
  onHover,
  row,
  scale,
}: {
  onHover: (value: MonthlyReportRow | null) => void;
  row: MonthlyReportRow;
  scale?: ReturnType<typeof buildRevenueChartColumns>[number];
}) {
  const revenueHeight = scale?.revenueHeightPercent ?? 0;
  const expensesHeight = scale?.expensesHeightPercent ?? 0;
  const profitHeight = scale?.profitHeightPercent ?? 0;

  return (
    <div
      className="flex h-full min-h-56 flex-col justify-end gap-2"
      onMouseEnter={() => onHover(row)}
      onMouseLeave={() => onHover(null)}
    >
      <div className="flex h-44 items-end justify-center gap-1">
        <span
          className="w-3 rounded-t bg-blue-500"
          style={{ height: revenueHeight > 0 ? `${revenueHeight}%` : "0%" }}
        />
        <span
          className="w-3 rounded-t bg-red-500"
          style={{ height: expensesHeight > 0 ? `${expensesHeight}%` : "0%" }}
        />
        <span
          className="w-3 rounded-t bg-emerald-600"
          style={{ height: profitHeight > 0 ? `${profitHeight}%` : "0%" }}
        />
      </div>
      <p className="truncate text-center font-mono text-xs text-[var(--color-muted)]">{row.month}</p>
    </div>
  );
}

function ReportRow({ row, previousRow }: { row: MonthlyReportRow; previousRow?: MonthlyReportRow }) {
  const margin =
    row.revenueCents > 0
      ? Math.round((row.profitCents / row.revenueCents) * 1000) / 10
      : 0;

  let trendLabel = "—";
  let trendClass = "text-[var(--color-muted)]";
  if (previousRow && previousRow.revenueCents > 0) {
    const change = Math.round(((row.revenueCents - previousRow.revenueCents) / previousRow.revenueCents) * 1000) / 10;
    if (change > 0) {
      trendLabel = `+${change}%`;
      trendClass = "text-emerald-700";
    } else if (change < 0) {
      trendLabel = `${change}%`;
      trendClass = "text-red-700";
    } else {
      trendLabel = "Flat";
    }
  }

  return (
    <tr className="transition hover:bg-[var(--color-graphite-50)]">
      <td className="border-b border-[var(--color-border)] py-3 pr-4 font-mono text-[var(--color-muted)]">{row.month}</td>
      <td className="border-b border-[var(--color-border)] py-3 pr-4 font-mono">{formatMoney(row.revenueCents)}</td>
      <td className="border-b border-[var(--color-border)] py-3 pr-4 font-mono">{formatMoney(row.expensesCents)}</td>
      <td className="border-b border-[var(--color-border)] py-3 pr-4 font-mono font-semibold text-emerald-700">{formatMoney(row.profitCents)}</td>
      <td className="border-b border-[var(--color-border)] py-3 pr-4 font-mono text-[var(--color-graphite-900)]">{margin}%</td>
      <td className={`border-b border-[var(--color-border)] py-3 font-mono ${trendClass}`}>{trendLabel}</td>
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

function HeaderButton({ children, onClick }: { children: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="hidden min-h-10 items-center rounded-md border border-[var(--color-border)] bg-white px-3 text-sm font-medium text-[var(--color-graphite-800)] shadow-sm transition hover:border-[var(--color-gold-400)] hover:text-[var(--color-graphite-950)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold-500)] sm:inline-flex"
    >
      {children}
    </button>
  );
}

function getActionLabel(action: CustomerStatement["actions"][number]) {
  if (action === "view") return "Visualizar";
  if (action === "print") return "Imprimir";

  return "E-mail";
}

function formatShortDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  }).format(new Date(`${value}T00:00:00.000Z`));
}