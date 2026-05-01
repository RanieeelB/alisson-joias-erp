import { declarationPdfResponse } from "@/features/finance/export-helpers";

// Uses createFinancePdf and returns application/pdf through the shared helper.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  return declarationPdfResponse(id);
}
