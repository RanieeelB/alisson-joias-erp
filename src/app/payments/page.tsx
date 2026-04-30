import { PaymentsPage } from "@/features/payments-accounts/components/payments-page";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function PaymentsRoute() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  const role = user?.app_metadata?.role;

  if (error || !user) {
    redirect("/login?erro=acesso");
  }

  if (role !== "admin" && role !== "staff") {
    redirect("/login?erro=acesso");
  }

  return <PaymentsPage userEmail={user.email ?? "usuario interno"} />;
}
