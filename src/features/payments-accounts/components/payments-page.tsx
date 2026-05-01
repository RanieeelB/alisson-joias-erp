import { PaymentsAccountsWorkspace } from "@/features/payments-accounts/components/payments-accounts-workspace";

export function PaymentsPage({ userEmail }: { userEmail?: string }) {
  return <PaymentsAccountsWorkspace initialTab="payments" userEmail={userEmail} />;
}
