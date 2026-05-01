import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export type PdfRow = string[];

export type PdfSection = {
  heading: string;
  lines?: string[];
  rows?: PdfRow[];
};

export async function createFinancePdf({
  fileTitle,
  generatedAt = new Date(),
  sections,
  subtitle,
}: {
  fileTitle: string;
  subtitle?: string;
  generatedAt?: Date;
  sections: PdfSection[];
}) {
  const pdf = await PDFDocument.create();
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  let page = pdf.addPage([595.28, 841.89]);
  let y = 790;

  const drawText = (
    text: string,
    options: { size?: number; x?: number; font?: typeof regular; color?: ReturnType<typeof rgb> } = {},
  ) => {
    if (y < 72) {
      page = pdf.addPage([595.28, 841.89]);
      y = 790;
    }

    page.drawText(sanitize(text), {
      x: options.x ?? 48,
      y,
      size: options.size ?? 10,
      font: options.font ?? regular,
      color: options.color ?? rgb(0.13, 0.14, 0.16),
      maxWidth: 500,
    });
    y -= (options.size ?? 10) + 8;
  };

  page.drawRectangle({
    x: 0,
    y: 810,
    width: 595.28,
    height: 31.89,
    color: rgb(0.13, 0.14, 0.16),
  });
  page.drawText("Alisson Joias ERP Financeiro", {
    x: 48,
    y: 821,
    size: 10,
    font: bold,
    color: rgb(0.88, 0.7, 0.32),
  });

  drawText(fileTitle, { size: 18, font: bold });
  if (subtitle) drawText(subtitle, { size: 11, color: rgb(0.38, 0.36, 0.32) });
  drawText(`Gerado em ${formatDateTime(generatedAt)}`, {
    size: 9,
    color: rgb(0.38, 0.36, 0.32),
  });
  y -= 8;

  for (const section of sections) {
    drawText(section.heading, { size: 13, font: bold });

    for (const line of section.lines ?? []) {
      drawText(line, { size: 10 });
    }

    if (section.rows?.length) {
      for (const row of section.rows) {
        drawText(row.join("   |   "), { size: 8.5 });
      }
    }

    y -= 8;
  }

  return pdf.save();
}

export function pdfResponse(bytes: Uint8Array, filename: string) {
  const body = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(body).set(bytes);

  return new Response(body, {
    headers: {
      "Content-Disposition": `inline; filename="${filename}"`,
      "Content-Type": "application/pdf",
    },
  });
}

function sanitize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x20-\x7E]/g, " ");
}

function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(value);
}
