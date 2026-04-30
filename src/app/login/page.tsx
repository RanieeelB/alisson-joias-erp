import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { signIn } from "@/app/login/actions";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Entrar | Financeiro Alisson Joias",
  description: "Acesso interno ao módulo financeiro da Alisson Joias.",
};

type LoginPageProps = {
  searchParams: Promise<{
    erro?: string;
  }>;
};

const errorMessages: Record<string, string> = {
  acesso: "Entre com uma conta interna para acessar o painel financeiro.",
  campos: "Informe email e senha para continuar.",
  credenciais: "Email ou senha inválidos.",
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const role = user?.app_metadata?.role;

  if (user && (role === "admin" || role === "staff")) {
    redirect("/dashboard");
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--color-graphite-950)] text-white">
      <LoginBackdrop />
      <div className="relative z-10 grid min-h-screen lg:grid-cols-[17rem_1fr]">
        <aside className="hidden border-r border-white/10 bg-[var(--color-graphite-900)]/96 px-5 py-5 lg:block">
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-gold-300)]">
            Alisson Joias
          </div>
          <div className="mt-1 text-lg font-semibold">Financeiro</div>
          <nav className="mt-8 space-y-1 text-sm text-white/68" aria-label="Navegação bloqueada">
            {[
              "Painel Financeiro",
              "Faturas",
              "Pagamentos",
              "Contas a Receber",
              "Relatórios",
            ].map((item) => (
              <div key={item} className="rounded-md px-3 py-2">
                {item}
              </div>
            ))}
          </nav>
          <div className="mt-8 rounded-md border border-white/10 bg-white/8 p-3 text-xs leading-5 text-white/72">
            Ambiente interno
            <div className="mt-2 font-medium text-[var(--color-gold-200)]">
              Supabase Auth
            </div>
          </div>
        </aside>

        <section className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:px-10">
          <div className="w-full max-w-md rounded-md border border-white/12 bg-[var(--color-graphite-900)]/88 p-6 shadow-[0_24px_80px_rgb(0_0_0_/_0.36)] backdrop-blur-xl sm:p-7">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-gold-300)]">
                Ambiente interno
              </p>
              <h1 className="mt-2 text-2xl font-semibold tracking-normal text-white">
                Financeiro Alisson Joias
              </h1>
              <p className="mt-2 text-sm leading-6 text-white/68">
                Entrar no console financeiro conectado ao Supabase Auth.
              </p>
            </div>

            {params.erro ? (
              <div className="mt-5 rounded-md border border-red-300/30 bg-red-950/36 px-3 py-2 text-sm text-red-100">
                {errorMessages[params.erro] ?? errorMessages.credenciais}
              </div>
            ) : null}

            <form action={signIn} className="mt-6 grid gap-4">
              <label className="grid gap-2 text-sm font-medium text-white/84">
                Email
                <input
                  className="min-h-11 rounded-md border border-white/12 bg-black/28 px-3 text-sm text-white shadow-inner outline-none transition placeholder:text-white/36 hover:border-white/24 focus:border-[var(--color-gold-300)] focus:ring-2 focus:ring-[var(--color-gold-300)]/28"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Digite seu email"
                  required
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-white/84">
                Senha
                <input
                  className="min-h-11 rounded-md border border-white/12 bg-black/28 px-3 text-sm text-white shadow-inner outline-none transition placeholder:text-white/36 hover:border-white/24 focus:border-[var(--color-gold-300)] focus:ring-2 focus:ring-[var(--color-gold-300)]/28"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Digite sua senha"
                  required
                />
              </label>
              <button
                className="mt-2 min-h-11 rounded-md bg-[var(--color-gold-500)] px-4 text-sm font-semibold text-[var(--color-graphite-950)] shadow-sm transition hover:bg-[var(--color-gold-400)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold-300)]"
                type="submit"
              >
                Acessar dashboard
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}

function LoginBackdrop() {
  return (
    <div className="absolute inset-0 opacity-74 blur-[2px]" aria-hidden="true">
      <div className="absolute inset-0 bg-[var(--color-graphite-950)]" />
      <div className="absolute inset-y-0 left-0 hidden w-[17rem] border-r border-white/8 bg-black/45 lg:block" />
      <div className="absolute inset-0 lg:left-[17rem]">
        <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-4 px-6 py-8 lg:px-10">
          <div className="h-16 rounded-md border border-white/8 bg-white/8" />
          <div className="grid gap-3 md:grid-cols-4">
            {["Receita", "AR Outstanding", "Faturas", "Overdue"].map((item) => (
              <div key={item} className="rounded-md border border-white/8 bg-white/7 p-4">
                <div className="h-3 w-24 rounded bg-white/16" />
                <div className="mt-4 h-7 w-32 rounded bg-white/12" />
                <div className="mt-3 h-3 w-40 rounded bg-white/10" />
              </div>
            ))}
          </div>
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]">
            <div className="rounded-md border border-white/8 bg-white/7 p-4">
              <div className="mb-5 h-4 w-44 rounded bg-[var(--color-gold-500)]/40" />
              <div className="grid h-64 grid-cols-6 items-end gap-3">
                {[58, 72, 64, 80, 88, 96].map((height, index) => (
                  <div
                    key={index}
                    className="rounded-t bg-[var(--color-gold-500)]/32"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            </div>
            <div className="grid gap-4">
              <div className="rounded-md border border-white/8 bg-white/7 p-4">
                <div className="h-4 w-36 rounded bg-white/16" />
                <div className="mt-5 space-y-3">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="flex items-center justify-between gap-3">
                      <div className="h-3 w-36 rounded bg-white/14" />
                      <div className="h-5 w-16 rounded bg-emerald-400/26" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-md border border-amber-300/12 bg-amber-300/10 p-4">
                <div className="h-4 w-44 rounded bg-amber-200/24" />
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="h-16 rounded border border-white/8 bg-black/16" />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="overflow-hidden rounded-md border border-white/8 bg-white/7">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="grid grid-cols-5 gap-4 border-b border-white/8 px-4 py-3 last:border-b-0">
                <div className="h-3 rounded bg-white/14" />
                <div className="h-3 rounded bg-white/10" />
                <div className="h-3 rounded bg-white/10" />
                <div className="h-3 rounded bg-white/10" />
                <div className="h-5 rounded bg-red-400/18" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="absolute inset-0 bg-black/46" />
    </div>
  );
}
