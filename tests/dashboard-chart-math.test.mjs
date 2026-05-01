import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

const testRequire = createRequire(import.meta.url);

function loadDashboardChartMathModule() {
  const sourcePath = "src/features/dashboard/chart-math.ts";

  assert.equal(
    existsSync(sourcePath),
    true,
    "expected dashboard chart math helpers to exist",
  );

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

test("builds finite revenue chart coordinates when all monthly values are zero", () => {
  const { buildRevenueChartScale } = loadDashboardChartMathModule();
  const scale = buildRevenueChartScale([
    { month: "Nov", revenueCents: 0, profitCents: 0 },
    { month: "Dez", revenueCents: 0, profitCents: 0 },
    { month: "Jan", revenueCents: 0, profitCents: 0 },
    { month: "Fev", revenueCents: 0, profitCents: 0 },
    { month: "Mar", revenueCents: 0, profitCents: 0 },
    { month: "Abr", revenueCents: 0, profitCents: 0 },
  ]);

  assert.equal(scale.chartMaxValue, 5_000_000);
  assert.deepEqual([...scale.valueTicks], [
    5_000_000,
    3_750_000,
    2_500_000,
    1_250_000,
    0,
  ]);
  assert.equal(new Set(scale.valueTicks).size, scale.valueTicks.length);
  assert.equal(Number.isFinite(scale.yFor(0)), true);
});

test("does not build donut segments when category revenue total is zero", () => {
  const { buildCategoryDonutSegments } = loadDashboardChartMathModule();
  const segments = buildCategoryDonutSegments([
    { label: "Custom Orders", valueCents: 0, color: "#d2a84f" },
    { label: "Repairs", valueCents: 0, color: "#3b82f6" },
    { label: "Wholesale", valueCents: 0, color: "#16a34a" },
    { label: "Retail", valueCents: 0, color: "#dc2626" },
  ]);

  assert.deepEqual([...segments], []);
});
