import type { ReactNode } from "react";

type FinanceNavItem = {
  label: string;
  href: string;
};

const navItems: FinanceNavItem[] = [
  { label: "Painel Financeiro", href: "/dashboard" },
  { label: "Faturas", href: "/invoices" },
  { label: "Pagamentos", href: "/payments" },
  { label: "Contas a Receber", href: "/accounts/receivable" },
  { label: "Contas a Pagar", href: "/accounts/payable" },
  { label: "Extratos", href: "/statements" },
  { label: "Relatórios", href: "/reports" },
  { label: "Automações", href: "/automations" },
];

export function FinanceShell({
  currentPath,
  eyebrow,
  title,
  userEmail,
  primaryAction,
  secondaryAction,
  footer,
  children,
}: {
  currentPath: string;
  eyebrow: string;
  title: string;
  userEmail?: string;
  primaryAction?: ReactNode;
  secondaryAction?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--color-app-canvas)] text-[var(--color-graphite-950)]">
      <aside className="hidden border-r border-white/10 bg-[var(--color-graphite-900)] text-white lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex lg:w-[var(--sidebar-width)] lg:flex-col">
        <div className="border-b border-white/10 px-5 py-5">
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-gold-300)]">
            Alisson Joias
          </div>
          <div className="mt-1 text-lg font-semibold">Financeiro</div>
        </div>
        <nav aria-label="Navegação financeira" className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              aria-current={item.href === currentPath ? "page" : undefined}
              className="flex min-h-10 items-center rounded-md px-3 text-sm font-medium text-white/70 transition hover:bg-white/8 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold-300)] aria-[current=page]:bg-white/10 aria-[current=page]:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>
        {footer ? <div className="border-t border-white/10 p-4">{footer}</div> : null}
      </aside>

      <main className="min-w-0 lg:pl-[var(--sidebar-width)]">
        <div className="sticky top-0 z-20 border-b border-[var(--color-border)] bg-[var(--color-surface)]/92 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-gold-700)]">
                {eyebrow}
              </p>
              <h1 className="truncate text-xl font-semibold tracking-normal text-[var(--color-graphite-950)] sm:text-2xl">
                {title}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              {userEmail ? (
                <span className="hidden max-w-48 truncate text-sm text-[var(--color-muted)] md:inline">
                  {userEmail}
                </span>
              ) : null}
              {secondaryAction}
              {primaryAction}
            </div>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}
