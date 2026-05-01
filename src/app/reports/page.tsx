import { ReportsPage } from "@/features/statements-reports/components/reports-page";
import type { ReportType } from "@/features/statements-reports/types";
import { isInternalFinanceUser } from "@/lib/supabase/authz";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

type ReportsRouteProps = {
  searchParams: Promise<{
    tipo?: string;
  }>;
};

const reportTypes: ReportType[] = [
  "revenue_analysis",
  "cash_flow",
  "profit_loss",
  "tax_summary",
];

export default async function ReportsRoute({ searchParams }: ReportsRouteProps) {
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

  return (
    <ReportsPage
      activeReportType={getActiveReportType(params.tipo)}
      userEmail={user.email ?? "usuario interno"}
    />
  );
}

function getActiveReportType(value?: string): ReportType {
  if (reportTypes.includes(value as ReportType)) {
    return value as ReportType;
  }

  return "revenue_analysis";
}
