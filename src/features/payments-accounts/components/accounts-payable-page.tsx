import type { FinanceWorkspaceData } from "@/features/finance/data";
import { PaymentsAccountsWorkspace } from "@/features/payments-accounts/components/payments-accounts-workspace";

export function AccountsPayablePage({
  data,
  userEmail,
}: {
  data: FinanceWorkspaceData;
  userEmail?: string;
}) {
  return <PaymentsAccountsWorkspace data={data} initialTab="payable" userEmail={userEmail} />;
}
