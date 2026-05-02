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
