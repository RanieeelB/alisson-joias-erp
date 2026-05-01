import { StatementsPage } from "@/features/statements-reports/components/statements-page";
import { isInternalFinanceUser } from "@/lib/supabase/authz";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function StatementsRoute() {
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

  return <StatementsPage userEmail={user.email ?? "usuario interno"} />;
}
