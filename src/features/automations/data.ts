import type {
  AutomationEvent,
  AutomationIntegration,
  AutomationJob,
  AutomationRule,
} from "./types";

export const automationRules: AutomationRule[] = [
  {
    id: "rule-finalized-order-invoice",
    title: "Pedido finalizado -> criar draft de Invoice",
    description: "Cria um rascunho de Invoice a partir do pedido finalizado.",
    ownerArea: "Faturas",
    cadence: "Imediato",
    enabled: true,
  },
  {
    id: "rule-overdue-reminder",
    title: "Invoice overdue -> agendar reminder",
    description: "Agenda lembretes de cobrança para Invoice vencida.",
    ownerArea: "Accounts Receivable",
    cadence: "Diário às 08:00",
    enabled: true,
  },
  {
    id: "rule-late-fee",
    title: "Balance vencido -> calcular late fee",
    description: "Simula e registra late fee conforme política de cobrança.",
    ownerArea: "Accounts Receivable",
    cadence: "Diário às 09:00",
    enabled: true,
  },
  {
    id: "rule-monthly-statement",
    title: "Statement mensal -> preparar email em lote",
    description: "Prepara statements mensais para envio em lote.",
    ownerArea: "Statements",
    cadence: "Dia 1 às 07:00",
    enabled: true,
  },
  {
    id: "rule-report-export",
    title: "Report export -> enfileirar PDF/CSV",
    description: "Enfileira arquivos PDF/CSV para Storage export boundary.",
    ownerArea: "Reports",
    cadence: "Sob demanda",
    enabled: true,
  },
];

export const automationJobs: AutomationJob[] = [
  {
    id: "job-draft-emerald-ring",
    job: "Criar draft de Invoice - Custom emerald ring order",
    origin: "Pedidos",
    destination: "Faturas",
    nextRun: "2026-05-01T14:30:00.000Z",
    status: "queued",
  },
  {
    id: "job-reminder-inv-10087",
    job: "Reminder - Invoice #INV-10087",
    origin: "Faturas",
    destination: "Email service",
    nextRun: "2026-05-02T08:00:00.000Z",
    status: "mock",
  },
  {
    id: "job-late-fee-boutique",
    job: "Late fee - Customer Jewelry Boutique",
    origin: "Accounts Receivable",
    destination: "Contabilidade",
    nextRun: "2026-05-02T09:00:00.000Z",
    status: "sync pending",
  },
  {
    id: "job-quickbooks-inv-10075",
    job: "Sync Invoice #INV-10075 - QuickBooks",
    origin: "Faturas",
    destination: "QuickBooks",
    nextRun: "2026-05-01T10:15:00.000Z",
    status: "failed",
  },
  {
    id: "job-aging-wholesale",
    job: "Export Aging - Wholesale diamond batch",
    origin: "Reports",
    destination: "Storage export",
    nextRun: "2026-05-01T11:00:00.000Z",
    status: "completed",
  },
  {
    id: "job-statement-repair",
    job: "Preparar Statement - Repair certification",
    origin: "Statements",
    destination: "Email service",
    nextRun: "2026-05-02T07:00:00.000Z",
    status: "completed",
  },
];

export const automationIntegrations: AutomationIntegration[] = [
  {
    id: "integration-realtime",
    name: "Supabase Realtime",
    detail: "Eventos em tempo real conectados.",
    status: "online",
  },
  {
    id: "integration-quickbooks",
    name: "QuickBooks sync boundary",
    detail: "Sincronização via API externa planejada.",
    status: "boundary",
  },
  {
    id: "integration-email",
    name: "Email service boundary",
    detail: "Envio de e-mails em lote configurado como limite.",
    status: "online",
  },
  {
    id: "integration-storage",
    name: "Storage export boundary",
    detail: "Exportação de arquivos PDF/CSV.",
    status: "online",
  },
  {
    id: "integration-gold",
    name: "Gold price API boundary",
    detail: "Cotações simuladas de ouro 18k para contexto.",
    status: "mock",
  },
];

export const automationEvents: AutomationEvent[] = [
  {
    id: "event-draft-invoice",
    time: "01/05/2026 10:12",
    description: "Draft de Invoice criado automaticamente - #INV-10102",
    ownerArea: "Faturas",
    status: "completed",
  },
  {
    id: "event-reminder",
    time: "01/05/2026 09:58",
    description: "Reminder agendado para Invoice #INV-10087",
    ownerArea: "Accounts Receivable",
    status: "queued",
  },
  {
    id: "event-late-fee",
    time: "01/05/2026 09:45",
    description: "Late fee simulada para Customer Jewelry Boutique",
    ownerArea: "Accounts Receivable",
    status: "mock",
  },
  {
    id: "event-statement",
    time: "01/05/2026 09:30",
    description: "Statement preparado para envio em lote - Maio/2026",
    ownerArea: "Statements",
    status: "completed",
  },
  {
    id: "event-export",
    time: "01/05/2026 09:15",
    description: "Export de relatório enfileirado - Aging Receivables",
    ownerArea: "Reports",
    status: "sync pending",
  },
];

export function summarizeAutomations(
  rules: AutomationRule[],
  jobs: AutomationJob[],
  integrations: AutomationIntegration[],
) {
  const queuedJobStatuses = new Set<AutomationJob["status"]>([
    "queued",
    "mock",
    "sync pending",
  ]);

  return {
    activeRules: rules.filter((rule) => rule.enabled).length,
    queuedJobs: jobs.filter((job) => queuedJobStatuses.has(job.status)).length,
    syncFailures: jobs.filter((job) => job.status === "failed").length,
    isRealtimeOnline: integrations.some(
      (integration) =>
        integration.name === "Supabase Realtime" &&
        integration.status === "online",
    ),
  };
}

export function calculateLateFeeCents(
  balanceCents: number,
  overdueDays: number,
  graceDays: number,
  feeRateBasisPoints: number,
) {
  if (overdueDays <= graceDays) {
    return 0;
  }

  return Math.round((balanceCents * feeRateBasisPoints) / 10_000);
}
