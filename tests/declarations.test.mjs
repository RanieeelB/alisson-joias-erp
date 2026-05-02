import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("declarations page explains the empty state", () => {
  const source = readFileSync(
    "src/features/declarations/components/declarations-page.tsx",
    "utf8",
  );

  assert.match(source, /Nenhuma declaração disponível/);
  assert.match(source, /As declarações emitidas para clientes aparecerão aqui/);
});

test("declarations feature lists generated PDFs from Supabase storage", () => {
  const pageSource = readFileSync(
    "src/features/declarations/components/declarations-page.tsx",
    "utf8",
  );
  const dataSource = readFileSync(
    "src/features/finance/data.ts",
    "utf8",
  );

  assert.match(pageSource, /PDFs gerados/);
  assert.match(pageSource, /data\.declarationExports/);
  assert.match(dataSource, /storage\.from\("finance-exports"\)/);
  assert.match(dataSource, /collectStorageFiles\(supabase, "declarations"\)/);
  assert.match(dataSource, /createSignedUrl\(storagePath, 60 \* 60\)/);
});
