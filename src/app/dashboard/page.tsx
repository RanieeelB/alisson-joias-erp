import { FinancialDashboard } from "@/features/dashboard/components/financial-dashboard";
import type { DashboardViewState } from "@/features/dashboard/components/financial-dashboard";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

type DashboardPageProps = {
  searchParams: Promise<{
    estado?: string;
  }>;
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  const role = user?.app_metadata?.role;

  if (error || !user) {
    redirect("/login?erro=acesso");
  }

  if (role !== "admin" && role !== "staff") {
    redirect("/login?erro=acesso");
  }

  return (
    <FinancialDashboard
      userEmail={user.email ?? "usuario interno"}
      viewState={getViewState(params.estado)}
    />
  );
}

function getViewState(value?: string): DashboardViewState {
  if (value === "carregando") return "loading";
  if (value === "erro") return "error";
  if (value === "vazio") return "empty";

  return "ready";
}
