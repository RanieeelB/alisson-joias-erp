"use client";

import { useCallback, useState } from "react";

type NavItem = { label: string; href: string };

export function MobileNav({
  items,
  currentPath,
}: {
  items: NavItem[];
  currentPath: string;
}) {
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen((v) => !v), []);
  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <button
        type="button"
        aria-label="Menu de navegação"
        onClick={toggle}
        className="inline-flex min-h-10 items-center justify-center rounded-md border border-[var(--color-border)] bg-white px-2.5 text-[var(--color-graphite-800)] shadow-sm transition hover:border-[var(--color-gold-400)] lg:hidden"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-5 w-5"
        >
          {open ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          )}
        </svg>
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            onClick={close}
            aria-hidden="true"
          />
          <nav
            aria-label="Navegação mobile"
            className="fixed inset-y-0 left-0 z-50 w-72 overflow-y-auto border-r border-white/10 bg-[var(--color-graphite-900)] text-white lg:hidden"
          >
            <div className="border-b border-white/10 px-5 py-5">
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-gold-300)]">
                Alisson Joias
              </div>
              <div className="mt-1 text-lg font-semibold">Financeiro</div>
            </div>
            <div className="space-y-1 px-3 py-4">
              {items.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  aria-current={item.href === currentPath ? "page" : undefined}
                  onClick={close}
                  className="flex min-h-10 items-center rounded-md px-3 text-sm font-medium text-white/70 transition hover:bg-white/8 hover:text-white aria-[current=page]:bg-white/10 aria-[current=page]:text-white"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </nav>
        </>
      )}
    </>
  );
}
