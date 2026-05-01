import { PaymentsAccountsWorkspace } from "@/features/payments-accounts/components/payments-accounts-workspace";

export function AccountsPayablePage({ userEmail }: { userEmail?: string }) {
  return <PaymentsAccountsWorkspace initialTab="payable" userEmail={userEmail} />;
}
