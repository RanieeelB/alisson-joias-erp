import { StatementsReportsWorkspace } from "@/features/statements-reports/components/statements-reports-workspace";

export function ReportsPage({ userEmail }: { userEmail?: string }) {
  return <StatementsReportsWorkspace initialTab="reports" userEmail={userEmail} />;
}
