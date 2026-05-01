import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const projectRoot = process.cwd();

function readProjectFile(path) {
  const fullPath = join(projectRoot, path);

  assert.equal(existsSync(fullPath), true, `expected ${path} to exist`);

  return readFileSync(fullPath, "utf8");
}

test("login page presents the approved internal finance auth screen", () => {
  const page = readProjectFile("src/app/login/page.tsx");

  for (const text of [
    "Alisson Joias",
    "Financeiro",
    "Ambiente interno",
    "Entrar",
    "Email",
    "Senha",
    "Digite seu email",
    "Digite sua senha",
    "Acessar dashboard",
  ]) {
    assert.match(page, new RegExp(text), `expected login page to include ${text}`);
  }

  assert.doesNotMatch(page, /raniel@gmail\.com/);
  assert.doesNotMatch(page, /Supabase Auth/);
  assert.doesNotMatch(page, /LoginBackdrop/);
  assert.doesNotMatch(page, /Painel Financeiro/);
  assert.doesNotMatch(page, /AR Outstanding/);
  assert.doesNotMatch(page, /Overdue/);
  assert.doesNotMatch(page, /AccessMetric/);
  assert.doesNotMatch(page, /Autenticação/);
  assert.doesNotMatch(page, /Permissão/);
  assert.doesNotMatch(page, /Sessão/);
  assert.doesNotMatch(page, /backdrop-blur/);
  assert.match(page, /login-hero\.png/);
  assert.match(page, /bg-\[var\(--color-graphite-950\)\]/);
  assert.match(page, /type="password"/);
  assert.match(page, /data-login-brand-mark/);
  assert.match(page, /data-login-refined-lines/);
});

test("login hero background asset is stored in the project", () => {
  assert.equal(
    existsSync(join(projectRoot, "public", "images", "login-hero.png")),
    true,
    "expected generated login hero image to be available from public/images",
  );
});

test("auth server actions sign in and sign out through Supabase", () => {
  const actions = readProjectFile("src/app/login/actions.ts");

  assert.match(actions, /"use server"/);
  assert.match(actions, /signInWithPassword/);
  assert.match(actions, /signOut/);
  assert.match(actions, /redirect\("\/dashboard"\)/);
  assert.match(actions, /redirect\("\/login"/);
});

test("dashboard requires an authenticated internal finance user", () => {
  const dashboardPage = readProjectFile("src/app/dashboard/page.tsx");
  const dashboardComponent = readProjectFile(
    "src/features/dashboard/components/financial-dashboard.tsx",
  );
  const authz = readProjectFile("src/lib/supabase/authz.ts");

  assert.match(authz, /INTERNAL_FINANCE_ALLOWED_EMAILS/);
  assert.match(authz, /app_metadata\?\.role/);
  assert.match(authz, /admin/);
  assert.match(authz, /staff/);
  assert.match(authz, /split\(","\)/);
  assert.match(authz, /toLowerCase\(\)/);
  assert.match(dashboardPage, /isInternalFinanceUser/);
  assert.match(dashboardPage, /redirect\("\/login/);
  assert.match(dashboardComponent, /userEmail/);
  assert.match(dashboardComponent, /Sair/);
});

test("documents internal finance allowlist fallback for development access", () => {
  const envExample = readProjectFile(".env.example");

  assert.match(envExample, /^INTERNAL_FINANCE_ALLOWED_EMAILS=/m);
});
