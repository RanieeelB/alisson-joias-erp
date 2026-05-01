import { signOut } from "@/app/login/actions";
import {
  automationEvents,
  automationIntegrations,
  automationJobs,
  automationRules,
  summarizeAutomations,
} from "@/features/automations/data";
import type {
  AutomationEvent,
  AutomationIntegration,
  AutomationJob,
  AutomationOwnerArea,
  AutomationRule,
  AutomationStatus,
} from "@/features/automations/types";
import { FinanceShell } from "@/features/finance-shell/components/finance-shell";

const ownerTone: Record<AutomationOwnerArea | "Pedidos" | "Email service" | "Contabilidade" | "QuickBooks" | "Storage export", string> = {
  "Accounts Receivable": "bg-blue-50 text-blue-700 ring-blue-200",
  Contabilidade: "bg-stone-50 text-stone-700 ring-stone-200",
  "Email service": "bg-slate-50 text-slate-700 ring-slate-200",
  Faturas: "bg-purple-50 text-purple-700 ring-purple-200",
  Pedidos: "bg-violet-50 text-violet-700 ring-violet-200",
  QuickBooks: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Reports: "bg-amber-50 text-amber-700 ring-amber-200",
  Statements: "bg-green-50 text-green-700 ring-green-200",
  "Storage export": "bg-sky-50 text-sky-700 ring-sky-200",
};

const statusTone: Record<AutomationStatus, string> = {
  completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  failed: "bg-red-50 text-red-700 ring-red-200",
  mock: "bg-blue-50 text-blue-700 ring-blue-200",
  queued: "bg-amber-50 text-amber-700 ring-amber-200",
  "sync pending": "bg-sky-50 text-sky-700 ring-sky-200",
};

const integrationTone: Record<AutomationIntegration["status"], string> = {
  boundary: "bg-amber-500",
  failed: "bg-red-500",
  mock: "bg-amber-600",
  online: "bg-emerald-500",
};

export function AutomationsPage({ userEmail }: { userEmail?: string }) {
  const summary = summarizeAutomations(
    automationRules,
    automationJobs,
    automationIntegrations,
  );

  return (
    <FinanceShell
      currentPath="/automations"
      eyebrow="Financeiro Alisson Joias"
      title="Automações"
      userEmail={userEmail}
      secondaryAction={
        <button className="hidden min-h-10 rounded-md border border-[var(--color-border)] bg-white px-3 text-sm font-medium text-[var(--color-graphite-800)] shadow-sm transition hover:border-[var(--color-gold-400)] hover:text-[var(--color-graphite-950)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold-500)] sm:inline-flex sm:items-center">
          Revisar fila
        </button>
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
          Ambiente: mock
          <div className="mt-2 font-medium text-[var(--color-gold-200)]">
            Regras e filas sem secrets no client
          </div>
        </div>
      }
    >
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-5 px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
        <section className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 shadow-[var(--shadow-widget)]">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-[var(--color-graphite-900)]">
                Orquestre regras, filas e integrações.
              </p>
              <p className="mt-1 text-sm text-[var(--color-muted)]">
                Ações manuais devem ser feitas nas abas correspondentes: Faturas, Pagamentos, Contas a Receber, Relatórios e Extratos.
              </p>
            </div>
            <span className="w-fit rounded bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-200">
              Supabase Realtime monitorado
            </span>
          </div>
        </section>

        <section aria-label="Resumo das automações" className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Regras ativas" value={String(summary.activeRules)} detail="2 nesta semana" tone="success" />
          <MetricCard label="Jobs na fila" value={String(summary.queuedJobs)} detail="5 aguardando Realtime" tone="warning" />
          <MetricCard label="Falhas de sync" value={String(summary.syncFailures)} detail="Últimas 24h" tone="danger" />
          <MetricCard label="Realtime online" value={summary.isRealtimeOnline ? "Sim" : "Não"} detail="Supabase Realtime" tone="info" />
        </section>

        <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_26rem]">
          <div className="grid min-w-0 gap-5">
            <RulesPanel rules={automationRules} />
            <JobsPanel jobs={automationJobs} />
          </div>
          <aside className="grid content-start gap-5">
            <IntegrationsPanel integrations={automationIntegrations} />
            <EventsPanel events={automationEvents} />
            <SecurityPanel />
          </aside>
        </section>
      </div>
    </FinanceShell>
  );
}

function RulesPanel({ rules }: { rules: AutomationRule[] }) {
  return (
    <section className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-widget)]">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-gold-700)]">
            Regras de automação
          </p>
          <h2 className="mt-1 text-base font-semibold tracking-normal text-[var(--color-graphite-950)]">
            Orquestração por área dona
          </h2>
        </div>
        <button className="hidden min-h-9 rounded-md border border-[var(--color-border)] bg-white px-3 text-xs font-semibold text-[var(--color-graphite-800)] transition hover:border-[var(--color-gold-400)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold-500)] sm:inline-flex sm:items-center">
          Gerenciar regras
        </button>
      </div>
      <div className="divide-y divide-[var(--color-border)]">
        {rules.map((rule) => (
          <RuleRow key={rule.id} rule={rule} />
        ))}
      </div>
    </section>
  );
}

function RuleRow({ rule }: { rule: AutomationRule }) {
  return (
    <article className="grid gap-3 py-3 md:grid-cols-[2.75rem_minmax(0,1fr)_10rem_9rem] md:items-center">
      <div className="flex items-center">
        <span
          aria-label={rule.enabled ? "Regra ativa" : "Regra pausada"}
          className="inline-flex h-5 w-9 items-center rounded-full bg-[var(--color-gold-500)] p-0.5"
        >
          <span className="h-4 w-4 translate-x-4 rounded-full bg-white shadow" />
        </span>
      </div>
      <div className="min-w-0">
        <h3 className="text-sm font-semibold text-[var(--color-graphite-950)]">
          {rule.title}
        </h3>
        <p className="mt-1 text-sm text-[var(--color-muted)]">{rule.description}</p>
      </div>
      <AreaBadge area={rule.ownerArea} />
      <p className="font-mono text-xs text-[var(--color-muted)]">{rule.cadence}</p>
    </article>
  );
}

function JobsPanel({ jobs }: { jobs: AutomationJob[] }) {
  return (
    <section className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-widget)]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-gold-700)]">
            Fila de jobs
          </p>
          <h2 className="mt-1 text-base font-semibold tracking-normal text-[var(--color-graphite-950)]">
            Execuções agendadas e monitoradas
          </h2>
        </div>
        <span className="rounded bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">
          {jobs.length} eventos
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[62rem] table-fixed border-separate border-spacing-0 text-left text-sm">
          <colgroup>
            <col className="w-[32%]" />
            <col className="w-[14%]" />
            <col className="w-[16%]" />
            <col className="w-[18%]" />
            <col className="w-[20%]" />
          </colgroup>
          <thead>
            <tr className="text-xs uppercase tracking-[0.12em] text-[var(--color-muted)]">
              <th className="border-b border-[var(--color-border)] pb-3 pr-4 font-semibold">Job</th>
              <th className="border-b border-[var(--color-border)] pb-3 pr-4 font-semibold">Origem</th>
              <th className="border-b border-[var(--color-border)] pb-3 pr-4 font-semibold">Destino</th>
              <th className="border-b border-[var(--color-border)] pb-3 pr-4 font-semibold">Próxima execução</th>
              <th className="border-b border-[var(--color-border)] pb-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <JobRow key={job.id} job={job} />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function JobRow({ job }: { job: AutomationJob }) {
  return (
    <tr className="transition hover:bg-[var(--color-graphite-50)]">
      <td className="border-b border-[var(--color-border)] py-3 pr-4 align-top font-medium text-[var(--color-graphite-900)]">
        {job.job}
      </td>
      <td className="border-b border-[var(--color-border)] py-3 pr-4 align-top">
        <AreaBadge area={job.origin} />
      </td>
      <td className="border-b border-[var(--color-border)] py-3 pr-4 align-top">
        <AreaBadge area={job.destination} />
      </td>
      <td className="border-b border-[var(--color-border)] py-3 pr-4 align-top font-mono text-xs text-[var(--color-muted)]">
        {formatDateTime(job.nextRun)}
      </td>
      <td className="border-b border-[var(--color-border)] py-3 align-top">
        <StatusBadge status={job.status} />
      </td>
    </tr>
  );
}

function IntegrationsPanel({
  integrations,
}: {
  integrations: AutomationIntegration[];
}) {
  return (
    <section className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-widget)]">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-gold-700)]">
        Monitor de integrações
      </p>
      <h2 className="mt-1 text-base font-semibold tracking-normal text-[var(--color-graphite-950)]">
        Boundaries e serviços externos
      </h2>
      <div className="mt-4 divide-y divide-[var(--color-border)]">
        {integrations.map((integration) => (
          <div key={integration.id} className="grid grid-cols-[minmax(0,1fr)_6rem] gap-3 py-3">
            <div>
              <p className="text-sm font-semibold text-[var(--color-graphite-900)]">
                {integration.name}
              </p>
              <p className="mt-1 text-xs text-[var(--color-muted)]">{integration.detail}</p>
            </div>
            <div className="flex items-start justify-end gap-2">
              <span className={`mt-1.5 h-2 w-2 rounded-full ${integrationTone[integration.status]}`} />
              <span className="text-xs font-semibold capitalize text-[var(--color-graphite-800)]">
                {integration.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function EventsPanel({ events }: { events: AutomationEvent[] }) {
  return (
    <section className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-widget)]">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-gold-700)]">
        Últimos eventos
      </p>
      <h2 className="mt-1 text-base font-semibold tracking-normal text-[var(--color-graphite-950)]">
        Timeline de automações
      </h2>
      <ol className="mt-4 space-y-3">
        {events.map((event) => (
          <li key={event.id} className="grid grid-cols-[0.625rem_1fr] gap-3">
            <span className="mt-2 h-2.5 w-2.5 rounded-full bg-[var(--color-gold-500)] ring-4 ring-amber-100" />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-mono text-xs text-[var(--color-muted)]">{event.time}</p>
                <AreaBadge area={event.ownerArea} />
              </div>
              <p className="mt-1 text-sm text-[var(--color-graphite-900)]">{event.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function SecurityPanel() {
  return (
    <section className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-widget)]">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-gold-700)]">
        Política de segurança
      </p>
      <h2 className="mt-1 text-base font-semibold tracking-normal text-[var(--color-graphite-950)]">
        Limites do modo mock
      </h2>
      <ul className="mt-4 space-y-2 text-sm leading-5 text-[var(--color-muted)]">
        <li>Ações em modo mock não geram documentos reais nem cobranças.</li>
        <li>Nenhum segredo ou chave sensível é exposto no client.</li>
        <li>Integrações externas tratadas como limites de arquitetura.</li>
      </ul>
    </section>
  );
}

function MetricCard({
  detail,
  label,
  tone,
  value,
}: {
  detail: string;
  label: string;
  tone: "success" | "warning" | "danger" | "info";
  value: string;
}) {
  const classes = {
    danger: "bg-red-50 text-red-700 ring-red-200",
    info: "bg-blue-50 text-blue-700 ring-blue-200",
    success: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    warning: "bg-amber-50 text-amber-700 ring-amber-200",
  };

  return (
    <article className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-widget)] transition hover:-translate-y-0.5 hover:border-[var(--color-gold-300)] hover:shadow-[var(--shadow-widget-hover)]">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-[var(--color-muted)]">{label}</p>
        <span className={`rounded px-2 py-1 text-xs font-semibold ring-1 ${classes[tone]}`}>
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

function AreaBadge({ area }: { area: string }) {
  const className = ownerTone[area as keyof typeof ownerTone] ?? "bg-stone-50 text-stone-700 ring-stone-200";

  return (
    <span className={`inline-flex w-fit rounded px-2 py-1 text-xs font-semibold ring-1 ${className}`}>
      {area}
    </span>
  );
}

function StatusBadge({ status }: { status: AutomationStatus }) {
  return (
    <span className={`inline-flex rounded px-2 py-1 text-xs font-semibold ring-1 ${statusTone[status]}`}>
      {status}
    </span>
  );
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "2-digit",
    year: "2-digit",
  }).format(new Date(value));
}
