import { InvoicesPage } from "@/features/invoices/components/invoices-page";
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
  const role = user?.app_metadata?.role;

  if (error || !user) {
    redirect("/login?erro=acesso");
  }

  if (role !== "admin" && role !== "staff") {
    redirect("/login?erro=acesso");
  }

  return (
    <InvoicesPage
      searchParams={params}
      userEmail={user.email ?? "usuario interno"}
    />
  );
}
