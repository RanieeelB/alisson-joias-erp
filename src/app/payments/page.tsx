import { PaymentsPage } from "@/features/payments-accounts/components/payments-page";
import { loadFinanceWorkspace } from "@/features/finance/data";
import { isInternalFinanceUser } from "@/lib/supabase/authz";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function PaymentsRoute() {
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

  return <PaymentsPage data={data} userEmail={user.email ?? "usuario interno"} />;
}
