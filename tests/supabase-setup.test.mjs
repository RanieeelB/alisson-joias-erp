import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const projectRoot = process.cwd();

function readProjectFile(path) {
  return readFileSync(join(projectRoot, path), "utf8");
}

function getInitialMigration() {
  const migrationsDir = join(projectRoot, "supabase", "migrations");

  assert.equal(
    existsSync(migrationsDir),
    true,
    "expected supabase/migrations to exist",
  );

  const migrationFile = readdirSync(migrationsDir).find((file) =>
    file.endsWith("_init_finance_schema.sql"),
  );

  assert.ok(migrationFile, "expected an initial finance schema migration");

  return readFileSync(join(migrationsDir, migrationFile), "utf8");
}

test("configures local Supabase auth without email confirmation", () => {
  const config = readProjectFile("supabase/config.toml");

  assert.match(config, /\[auth\.email\][\s\S]*enable_signup = true/);
  assert.match(config, /\[auth\.email\][\s\S]*enable_confirmations = false/);
});

test("documents the public Supabase environment variables", () => {
  const envExample = readProjectFile(".env.example");

  assert.match(envExample, /^NEXT_PUBLIC_SUPABASE_URL=/m);
  assert.match(envExample, /^NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=/m);
});

test("creates the initial finance schema with constraints and indexes", () => {
  const migration = getInitialMigration();

  for (const tableName of [
    "profiles",
    "customers",
    "vendors",
    "invoices",
    "invoice_line_items",
    "payments",
    "accounts_payable",
    "financial_activities",
  ]) {
    assert.match(
      migration,
      new RegExp(`create table public\\.${tableName}`),
      `expected ${tableName} table`,
    );
  }

  for (const checkName of [
    "profiles_role_check",
    "invoices_status_check",
    "invoices_quickbooks_sync_status_check",
    "payments_method_check",
    "accounts_payable_category_check",
  ]) {
    assert.match(migration, new RegExp(`constraint ${checkName}`));
  }

  for (const indexName of [
    "customers_auth_user_id_idx",
    "invoices_customer_id_idx",
    "invoices_status_idx",
    "invoices_due_date_idx",
    "payments_customer_date_idx",
    "accounts_payable_vendor_status_due_date_idx",
  ]) {
    assert.match(migration, new RegExp(`create index ${indexName}`));
  }
});

test("enables RLS with internal and customer ownership policies", () => {
  const migration = getInitialMigration();

  for (const tableName of [
    "profiles",
    "customers",
    "vendors",
    "invoices",
    "invoice_line_items",
    "payments",
    "accounts_payable",
    "financial_activities",
  ]) {
    assert.match(
      migration,
      new RegExp(`alter table public\\.${tableName} enable row level security`),
      `expected RLS enabled for ${tableName}`,
    );
  }

  assert.match(migration, /create function public\.current_app_role/);
  assert.match(migration, /auth\.jwt\(\) -> 'app_metadata' ->> 'role'/);
  assert.match(migration, /public\.is_internal_finance_user\(\)/);
  assert.match(
    migration,
    /for select\s+to authenticated\s+using \(\s+\(select public\.is_internal_finance_user\(\)\)/,
  );
  assert.match(migration, /customers_select_own_record/);
  assert.match(migration, /invoices_select_own_customer/);
  assert.match(migration, /payments_select_own_customer/);
});

test("adds Supabase SSR clients and request proxy", () => {
  for (const path of [
    "src/lib/supabase/client.ts",
    "src/lib/supabase/server.ts",
    "src/lib/supabase/proxy.ts",
    "src/proxy.ts",
  ]) {
    assert.equal(existsSync(join(projectRoot, path)), true, `expected ${path}`);
  }

  assert.match(
    readProjectFile("src/lib/supabase/client.ts"),
    /createBrowserClient/,
  );
  assert.match(
    readProjectFile("src/lib/supabase/server.ts"),
    /createServerClient/,
  );
  assert.match(readProjectFile("src/lib/supabase/proxy.ts"), /getClaims/);
  assert.match(readProjectFile("src/proxy.ts"), /export async function proxy/);
});
