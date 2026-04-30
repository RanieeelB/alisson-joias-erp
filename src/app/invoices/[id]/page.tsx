import { InvoiceDetailPage } from "@/features/invoices/components/invoice-detail-page";
import { getInvoiceById } from "@/features/invoices/data";
import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic";

type InvoiceDetailRouteProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function InvoiceDetailRoute({
  params,
}: InvoiceDetailRouteProps) {
  const { id } = await params;
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

  const invoice = getInvoiceById(id);

  if (!invoice) {
    notFound();
  }

  return (
    <InvoiceDetailPage
      invoice={invoice}
      userEmail={user.email ?? "usuario interno"}
    />
  );
}
