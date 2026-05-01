import { reportPdfResponse } from "@/features/finance/export-helpers";

// Uses createFinancePdf and returns application/pdf through the shared helper.
export async function GET() {
  return reportPdfResponse();
}
