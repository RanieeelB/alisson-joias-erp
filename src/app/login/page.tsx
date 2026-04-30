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
    <main className="min-h-screen overflow-hidden bg-[var(--color-graphite-950)] text-white">
      <div className="grid min-h-screen lg:grid-cols-[minmax(0,0.92fr)_minmax(28rem,0.68fr)]">
        <section className="relative hidden overflow-hidden border-r border-white/10 bg-[var(--color-graphite-900)] px-8 py-8 lg:flex lg:flex-col lg:justify-between xl:px-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-55"
          >
            <div className="absolute inset-x-12 top-24 h-px bg-[var(--color-gold-300)]/28" />
            <div className="absolute inset-y-20 left-20 w-px bg-white/8" />
            <div className="absolute inset-y-28 right-24 w-px bg-white/8" />
            <div className="absolute bottom-24 left-12 right-12 grid gap-2">
              {[1, 2, 3, 4, 5].map((item) => (
                <div
                  key={item}
                  className="grid grid-cols-[1fr_5rem_4rem] gap-3 border-b border-white/8 py-3"
                >
                  <div className="h-2 rounded bg-white/12" />
                  <div className="h-2 rounded bg-[var(--color-gold-300)]/22" />
                  <div className="h-2 rounded bg-white/10" />
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-gold-300)]">
              Alisson Joias
            </p>
            <h1 className="mt-3 max-w-xl text-4xl font-semibold tracking-normal text-white">
              Financeiro
            </h1>
            <p className="mt-5 max-w-md text-sm leading-6 text-white/66">
              Acesso reservado para acompanhamento de faturas, pagamentos,
              Statements e rotinas financeiras da operação.
            </p>
          </div>

          <div className="relative grid max-w-xl gap-3">
            <div className="grid grid-cols-3 gap-3">
              <AccessMetric label="Autenticação" value="Supabase Auth" />
              <AccessMetric label="Permissão" value="Admin" />
              <AccessMetric label="Sessão" value="Segura" />
            </div>
            <div className="rounded-md border border-white/10 bg-white/7 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-gold-300)]">
                Ambiente interno
              </p>
              <p className="mt-2 text-sm leading-6 text-white/70">
                O acesso ao módulo é validado por usuário autenticado e papel
                interno antes de liberar o dashboard.
              </p>
            </div>
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center bg-[var(--color-app-canvas)] px-4 py-8 text-[var(--color-graphite-950)] sm:px-6 lg:px-10">
          <div className="w-full max-w-[28rem]">
            <div className="mb-6 lg:hidden">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-gold-700)]">
                Alisson Joias
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-normal">
                Financeiro
              </h1>
            </div>

            <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-widget-hover)] sm:p-7">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-gold-700)]">
                  Entrar
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-normal text-[var(--color-graphite-950)]">
                  Ambiente interno
                </h2>
                <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                  Use seu acesso interno para continuar no Financeiro Alisson
                  Joias.
                </p>
              </div>

              <div className="mt-5 rounded-md border border-[var(--color-border)] bg-[var(--color-graphite-50)] px-3 py-2 text-xs font-medium text-[var(--color-graphite-800)]">
                Supabase Auth
              </div>

              {params.erro ? (
                <div className="mt-5 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {errorMessages[params.erro] ?? errorMessages.credenciais}
                </div>
              ) : null}

              <form action={signIn} className="mt-6 grid gap-4">
                <label className="grid gap-2 text-sm font-medium text-[var(--color-graphite-900)]">
                  Email
                  <input
                    autoComplete="email"
                    className="min-h-11 rounded-md border border-[var(--color-border)] bg-white px-3 text-sm text-[var(--color-graphite-950)] shadow-inner outline-none transition placeholder:text-[var(--color-muted)] hover:border-[var(--color-gold-400)] focus:border-[var(--color-gold-500)] focus:ring-2 focus:ring-[var(--color-gold-500)]/22"
                    name="email"
                    placeholder="Digite seu email"
                    required
                    type="email"
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium text-[var(--color-graphite-900)]">
                  Senha
                  <input
                    autoComplete="current-password"
                    className="min-h-11 rounded-md border border-[var(--color-border)] bg-white px-3 text-sm text-[var(--color-graphite-950)] shadow-inner outline-none transition placeholder:text-[var(--color-muted)] hover:border-[var(--color-gold-400)] focus:border-[var(--color-gold-500)] focus:ring-2 focus:ring-[var(--color-gold-500)]/22"
                    name="password"
                    placeholder="Digite sua senha"
                    required
                    type="password"
                  />
                </label>
                <button
                  className="mt-2 min-h-11 rounded-md bg-[var(--color-gold-500)] px-4 text-sm font-semibold text-[var(--color-graphite-950)] shadow-sm transition hover:bg-[var(--color-gold-400)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold-500)]"
                  type="submit"
                >
                  Acessar dashboard
                </button>
              </form>
            </div>

            <p className="mt-4 text-center text-xs text-[var(--color-muted)]">
              Acesso protegido por perfil interno do Supabase.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

function AccessMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-white/10 bg-white/7 p-3">
      <p className="text-xs text-white/52">{label}</p>
      <p className="mt-2 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}
