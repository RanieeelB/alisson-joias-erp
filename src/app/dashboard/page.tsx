import { FinancialDashboard } from "@/features/dashboard/components/financial-dashboard";
import type { DashboardViewState } from "@/features/dashboard/components/financial-dashboard";

type DashboardPageProps = {
  searchParams: Promise<{
    estado?: string;
  }>;
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = await searchParams;

  return <FinancialDashboard viewState={getViewState(params.estado)} />;
}

function getViewState(value?: string): DashboardViewState {
  if (value === "carregando") return "loading";
  if (value === "erro") return "error";
  if (value === "vazio") return "empty";

  return "ready";
}
