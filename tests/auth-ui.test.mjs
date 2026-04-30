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
    "Financeiro Alisson Joias",
    "Ambiente interno",
    "Supabase Auth",
    "Email",
    "Senha",
    "Digite seu email",
    "Acessar dashboard",
  ]) {
    assert.match(page, new RegExp(text), `expected login page to include ${text}`);
  }

  assert.doesNotMatch(page, /raniel@gmail\.com/);
  assert.match(page, /backdrop-blur/);
  assert.match(page, /bg-\[var\(--color-graphite-950\)\]/);
  assert.match(page, /type="password"/);
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

  assert.match(dashboardPage, /createClient/);
  assert.match(dashboardPage, /auth\.getUser/);
  assert.match(dashboardPage, /app_metadata\?\.role/);
  assert.match(dashboardPage, /redirect\("\/login/);
  assert.match(dashboardComponent, /userEmail/);
  assert.match(dashboardComponent, /Sair/);
});
