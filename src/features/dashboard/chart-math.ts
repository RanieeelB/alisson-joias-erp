import type { CategoryRevenue, RevenuePoint } from "@/features/dashboard/data";

export type CategoryDonutSegment = CategoryRevenue & {
  segment: number;
  offset: number;
};

const revenueTickStep = 5_000_000;

export function buildRevenueChartScale(data: RevenuePoint[]) {
  const maxValue = Math.max(
    0,
    ...data.flatMap((point) => [point.revenueCents, point.profitCents]),
  );
  const chartMaxValue = Math.max(
    revenueTickStep,
    Math.ceil(maxValue / revenueTickStep) * revenueTickStep,
  );
  const valueTicks = [
    chartMaxValue,
    chartMaxValue * 0.75,
    chartMaxValue * 0.5,
    chartMaxValue * 0.25,
    0,
  ];
  const plotWidth = 520;
  const plotLeft = 78;
  const plotRight = plotWidth;
  const plotTop = 18;
  const plotBottom = 178;
  const xStep = (plotRight - plotLeft) / Math.max(data.length - 1, 1);
  const yFor = (value: number) =>
    plotBottom - (value / chartMaxValue) * (plotBottom - plotTop);
  const xFor = (index: number) => plotLeft + index * xStep;

  return {
    chartMaxValue,
    plotWidth,
    plotLeft,
    plotRight,
    valueTicks,
    xFor,
    yFor,
  };
}

export function buildCategoryDonutSegments(
  data: CategoryRevenue[],
): CategoryDonutSegment[] {
  const total = data.reduce((sum, item) => sum + item.valueCents, 0);

  if (total <= 0) {
    return [];
  }

  return data.reduce<CategoryDonutSegment[]>((items, item) => {
    const previousOffset = items.at(-1)?.offset ?? 25;
    const previousSegment = items.at(-1)?.segment ?? 0;
    const offset = previousOffset - previousSegment;
    const segment = (item.valueCents / total) * 100;

    return [...items, { ...item, segment, offset }];
  }, []);
}
