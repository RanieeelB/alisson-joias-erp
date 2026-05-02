import { signOut } from "@/app/login/actions";
import type { FinanceWorkspaceData } from "@/features/finance/data";
import { FinanceShell } from "@/features/finance-shell/components/finance-shell";

export function DeclarationsPage({
  data,
  userEmail,
}: {
  data: FinanceWorkspaceData;
  userEmail?: string;
}) {
  return (
    <FinanceShell
      currentPath="/declarations"
      eyebrow="Financeiro Alisson Joias"
      title="Declarações"
      userEmail={userEmail}
      primaryAction={
        <form action={signOut}>
          <button className="min-h-10 rounded-md border border-[var(--color-border)] bg-white px-3 text-sm font-medium text-[var(--color-graphite-800)] shadow-sm transition hover:border-red-300 hover:text-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400">
            Sair
          </button>
        </form>
      }
      footer={
        <div className="rounded-md bg-white/8 p-3 text-xs leading-5 text-white/72">
          Declarações persistidas
          <div className="mt-2 font-medium text-[var(--color-gold-200)]">
            {data.declarations.length} documentos disponíveis
          </div>
        </div>
      }
    >
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-5 px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
        <section className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 shadow-[var(--shadow-widget)]">
          <p className="text-sm font-semibold text-[var(--color-graphite-900)]">
            Documentos formais para visualização, impressão e PDF
          </p>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Cada declaração usa cliente, período e texto armazenados no banco de dados.
          </p>
        </section>

        <section className="grid gap-4">
          {data.declarations.length === 0 ? (
            <div className="rounded-md border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-10 text-center shadow-[var(--shadow-widget)]">
              <p className="text-sm font-semibold text-[var(--color-graphite-900)]">
                Nenhuma declaração disponível
              </p>
              <p className="mt-2 text-sm text-[var(--color-muted)]">
                As declarações emitidas para clientes aparecerão aqui quando existirem registros na tabela `declarations`.
              </p>
            </div>
          ) : (
            data.declarations.map((declaration) => (
              <article
                key={declaration.id}
                className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-widget)]"
              >
                <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-center">
                  <div>
                    <p className="font-mono text-xs font-semibold text-[var(--color-gold-700)]">
                      {declaration.declarationNumber}
                    </p>
                    <h2 className="mt-1 text-base font-semibold text-[var(--color-graphite-950)]">
                      {declaration.title}
                    </h2>
                    <p className="mt-2 text-sm text-[var(--color-muted)]">
                      {declaration.customerName} · {declaration.referencePeriod} · emitida em {declaration.issuedOn}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-[var(--color-graphite-800)]">
                      {declaration.body}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 lg:justify-end">
                    <a
                      href={`/api/exports/declarations/${declaration.id}`}
                      target="_blank"
                      className="inline-flex min-h-9 items-center rounded-md border border-[var(--color-border)] bg-white px-3 text-xs font-semibold text-[var(--color-graphite-800)] transition hover:border-[var(--color-gold-400)]"
                    >
                      Visualizar
                    </a>
                    <a
                      href={`/api/exports/declarations/${declaration.id}`}
                      target="_blank"
                      className="inline-flex min-h-9 items-center rounded-md border border-[var(--color-border)] bg-white px-3 text-xs font-semibold text-[var(--color-graphite-800)] transition hover:border-[var(--color-gold-400)]"
                    >
                      Imprimir
                    </a>
                    <a
                      href={`/api/exports/declarations/${declaration.id}`}
                      target="_blank"
                      className="inline-flex min-h-9 items-center rounded-md bg-[var(--color-gold-500)] px-3 text-xs font-semibold text-[var(--color-graphite-950)] transition hover:bg-[var(--color-gold-400)]"
                    >
                      Exportar PDF
                    </a>
                  </div>
                </div>
              </article>
            ))
          )}
        </section>
      </div>
    </FinanceShell>
  );
}
