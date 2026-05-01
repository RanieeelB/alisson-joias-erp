import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

const testRequire = createRequire(import.meta.url);
const projectRoot = process.cwd();

function loadTsModule(sourcePath) {
  assert.equal(existsSync(sourcePath), true, `expected ${sourcePath} to exist`);

  const source = readFileSync(sourcePath, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      esModuleInterop: true,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;

  const sandbox = {
    module: { exports: {} },
    require: testRequire,
  };
  sandbox.exports = sandbox.module.exports;

  vm.runInNewContext(output, sandbox, { filename: sourcePath });

  return sandbox.module.exports;
}

function readProjectFile(path) {
  const fullPath = join(projectRoot, path);

  assert.equal(existsSync(fullPath), true, `expected ${path} to exist`);

  return readFileSync(fullPath, "utf8");
}

test("summarizes automation rules, queued jobs, sync failures, and realtime status", () => {
  const {
    automationIntegrations,
    automationJobs,
    automationRules,
    summarizeAutomations,
  } = loadTsModule("src/features/automations/data.ts");

  const summary = summarizeAutomations(
    automationRules,
    automationJobs,
    automationIntegrations,
  );

  assert.equal(summary.activeRules, 5);
  assert.equal(summary.queuedJobs, 3);
  assert.equal(summary.syncFailures, 1);
  assert.equal(summary.isRealtimeOnline, true);
});

test("automation rules keep manual work owned by the source finance areas", () => {
  const { automationRules } = loadTsModule("src/features/automations/data.ts");

  assert.equal(
    JSON.stringify(automationRules.map((rule) => rule.ownerArea)),
    JSON.stringify(["Faturas", "Accounts Receivable", "Accounts Receivable", "Statements", "Reports"]),
  );
  assert.equal(
    automationRules.some((rule) => rule.title.includes("criar draft de Invoice")),
    true,
  );
  assert.equal(
    automationRules.some((rule) => rule.title.includes("agendar reminder")),
    true,
  );
  assert.equal(
    automationRules.some((rule) => rule.title.includes("enfileirar PDF/CSV")),
    true,
  );
});

test("automations route wires a protected orchestration cockpit", () => {
  const page = readProjectFile("src/app/automations/page.tsx");
  const view = readProjectFile(
    "src/features/automations/components/automations-page.tsx",
  );
  const shell = readProjectFile(
    "src/features/finance-shell/components/finance-shell.tsx",
  );

  for (const text of [
    "Automações",
    "Regras ativas",
    "Jobs na fila",
    "Falhas de sync",
    "Realtime online",
    "Regras de automação",
    "Fila de jobs",
    "Monitor de integrações",
    "Últimos eventos",
    "Política de segurança",
    "Ações manuais devem ser feitas nas abas correspondentes",
  ]) {
    assert.match(view, new RegExp(text), `expected automations page to include ${text}`);
  }

  for (const manualAction of [
    "Nova Fatura",
    "Registrar pagamento",
    "Email All Statements",
    "Bulk Download",
    "Export Report",
    "Enviar reminder",
  ]) {
    assert.doesNotMatch(
      view,
      new RegExp(manualAction),
      `expected automations page to avoid manual action ${manualAction}`,
    );
  }

  assert.match(page, /createClient/);
  assert.match(page, /auth\.getUser/);
  assert.match(page, /isInternalFinanceUser/);
  assert.match(page, /redirect\("\/login/);
  assert.match(page, /AutomationsPage/);
  assert.match(shell, /\/automations/);
  assert.match(shell, /Automações/);
});

test("automations cockpit subscribes to Supabase Realtime broadcast updates", () => {
  const realtimeStatus = readProjectFile(
    "src/features/automations/components/realtime-status.tsx",
  );

  assert.match(realtimeStatus, /"use client"/);
  assert.match(realtimeStatus, /createClient/);
  assert.match(realtimeStatus, /channel\("finance-automations"\)/);
  assert.match(realtimeStatus, /on\("broadcast", \{ event: "automation_event" \}/);
  assert.match(realtimeStatus, /subscribe/);
  assert.match(realtimeStatus, /removeChannel/);
});
