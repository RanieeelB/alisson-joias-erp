import { AccountsReceivablePage } from "@/features/payments-accounts/components/accounts-receivable-page";
import { isInternalFinanceUser } from "@/lib/supabase/authz";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AccountsReceivableRoute() {
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

  return <AccountsReceivablePage userEmail={user.email ?? "usuario interno"} />;
}
