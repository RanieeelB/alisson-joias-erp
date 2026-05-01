import { StatementsReportsWorkspace } from "@/features/statements-reports/components/statements-reports-workspace";

export function StatementsPage({ userEmail }: { userEmail?: string }) {
  return <StatementsReportsWorkspace initialTab="statements" userEmail={userEmail} />;
}
