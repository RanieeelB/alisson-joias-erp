import { FinancialDashboard } from "@/features/dashboard/components/financial-dashboard";
import { loadFinanceWorkspace } from "@/features/finance/data";
import { isInternalFinanceUser } from "@/lib/supabase/authz";
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

  if (error || !user) {
    redirect("/login?erro=acesso");
  }

  if (!isInternalFinanceUser(user)) {
    redirect("/login?erro=acesso");
  }

  const data = await loadFinanceWorkspace(supabase);

  return (
    <FinancialDashboard
      data={data}
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
