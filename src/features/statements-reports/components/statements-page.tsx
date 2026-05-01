import type { FinanceWorkspaceData } from "@/features/finance/data";
import { StatementsReportsWorkspace } from "@/features/statements-reports/components/statements-reports-workspace";

export function StatementsPage({
  data,
  userEmail,
}: {
  data: FinanceWorkspaceData;
  userEmail?: string;
}) {
  return <StatementsReportsWorkspace data={data} initialTab="statements" userEmail={userEmail} />;
}
