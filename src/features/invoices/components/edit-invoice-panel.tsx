"use client";

import { editInvoiceAction } from "@/features/finance/actions";
import type { InvoiceRecord } from "@/features/invoices/types";
import { useActionState, useState, useCallback } from "react";

export function EditInvoicePanel({ invoice }: { invoice: InvoiceRecord }) {
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen((v) => !v), []);

  const [state, formAction, isPending] = useActionState(editInvoiceAction, {
    ok: false,
    message: "",
  });

  return (
    <>
      <button
        type="button"
        onClick={toggle}
        className="inline-flex min-h-10 items-center justify-center rounded-md border border-[var(--color-border)] bg-white px-3 text-sm font-medium text-[var(--color-graphite-800)] shadow-sm transition hover:border-[var(--color-gold-400)] hover:text-[var(--color-graphite-950)]"
      >
        Editar
      </button>

      {open && (
        <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-graphite-50)] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-gold-700)]">
            Editar fatura
          </p>
          <form action={formAction} className="mt-3 grid gap-3">
            <input type="hidden" name="invoiceId" value={invoice.id} />

            <label className="grid gap-1">
              <span className="text-xs font-medium text-[var(--color-muted)]">Vencimento</span>
              <input
                type="date"
                name="dueDate"
                defaultValue={invoice.dueOn}
                required
                className="min-h-10 rounded-md border border-[var(--color-border)] bg-white px-3 font-mono text-sm text-[var(--color-graphite-900)] focus:border-[var(--color-gold-400)] focus:outline-none focus:ring-1 focus:ring-[var(--color-gold-400)]"
              />
            </label>

            <label className="grid gap-1">
              <span className="text-xs font-medium text-[var(--color-muted)]">Status</span>
              <select
                name="status"
                defaultValue={invoice.status}
                required
                className="min-h-10 rounded-md border border-[var(--color-border)] bg-white px-3 text-sm text-[var(--color-graphite-900)] focus:border-[var(--color-gold-400)] focus:outline-none focus:ring-1 focus:ring-[var(--color-gold-400)]"
              >
                <option value="pending">Pendente</option>
                <option value="partial">Parcial</option>
                <option value="paid">Pago</option>
                <option value="overdue">Vencido</option>
              </select>
            </label>

            <label className="grid gap-1">
              <span className="text-xs font-medium text-[var(--color-muted)]">Observações</span>
              <textarea
                name="notes"
                rows={2}
                defaultValue={invoice.notes ?? ""}
                className="rounded-md border border-[var(--color-border)] bg-white px-3 py-2 text-sm text-[var(--color-graphite-900)] focus:border-[var(--color-gold-400)] focus:outline-none focus:ring-1 focus:ring-[var(--color-gold-400)]"
              />
            </label>

            {state.message && (
              <p
                className={`text-sm font-medium ${state.ok ? "text-emerald-700" : "text-red-700"}`}
              >
                {state.message}
              </p>
            )}

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isPending}
                className="min-h-10 rounded-md bg-[var(--color-gold-500)] px-4 text-sm font-semibold text-[var(--color-graphite-950)] shadow-sm transition hover:bg-[var(--color-gold-400)] disabled:opacity-50"
              >
                {isPending ? "Salvando…" : "Salvar"}
              </button>
              <button
                type="button"
                onClick={toggle}
                className="min-h-10 rounded-md border border-[var(--color-border)] bg-white px-4 text-sm font-medium text-[var(--color-graphite-800)] transition hover:border-[var(--color-gold-400)]"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
