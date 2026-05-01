import { InvoicesPage } from "@/features/invoices/components/invoices-page";
import { isInternalFinanceUser } from "@/lib/supabase/authz";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

type InvoicesRouteProps = {
  searchParams: Promise<{
    status?: string;
    busca?: string;
  }>;
};

export default async function InvoicesRoute({ searchParams }: InvoicesRouteProps) {
  const params = await searchParams;
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

  return (
    <InvoicesPage
      searchParams={params}
      userEmail={user.email ?? "usuario interno"}
    />
  );
}
