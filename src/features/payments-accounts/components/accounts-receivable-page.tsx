import { PaymentsAccountsWorkspace } from "@/features/payments-accounts/components/payments-accounts-workspace";

export function AccountsReceivablePage({ userEmail }: { userEmail?: string }) {
  return <PaymentsAccountsWorkspace initialTab="receivable" userEmail={userEmail} />;
}
