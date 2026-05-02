# Alisson Joias ERP

Projeto do teste tecnico full stack para um modulo financeiro de ERP de joalheria, inspirado no contexto PIRO Fusion.

## Stack

- Next.js 16 App Router (Server Components + Server Actions)
- React 19 com `useActionState`
- TypeScript strict
- Tailwind CSS 4 com CSS variables (tema Graphite Ledger)
- ESLint 9
- Supabase (Auth SSR, Storage, RLS, Realtime broadcast)
- pdf-lib para geração de PDFs server-side
- npm

## Rodando localmente

Este projeto usa um Supabase hospedado. Nao e necessario subir Supabase local com Docker para desenvolver a interface.

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar ambiente

Crie um `.env` local a partir de `.env.example` com:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_publishable_key
```

Use apenas a publishable key no frontend. Service role keys nao devem entrar neste projeto.

### 3. Aplicar seed data (opcional)

Para popular o banco com dados de demonstracao:

```bash
psql "$DATABASE_URL" -f supabase/seed.sql
```

O seed usa `ON CONFLICT DO UPDATE` e pode ser reaplicado sem duplicar registros.

### 4. Rodar a aplicacao

```bash
npm run dev
```

A aplicacao fica disponivel em `http://localhost:3000`.

## Supabase

- Schema base: `supabase/migrations/20260430120000_init_finance_schema.sql`
- Estrutura adicional (declarations, constraints): `supabase/migrations/20260501120000_persist_finance_seed_and_documents.sql`
- Storage (bucket `finance-exports`): `supabase/migrations/20260501130000_create_finance_exports_storage.sql`
- Seed data separado: `supabase/seed.sql`
- Auth SSR com `@supabase/ssr` e helper central `isInternalFinanceUser`
- Para acessar as rotas protegidas, o usuario precisa existir no projeto Supabase com `app_metadata.role` igual a `admin` ou `staff`, ou estar na lista `INTERNAL_FINANCE_ALLOWED_EMAILS`
- PDFs exportados sao salvos no bucket privado `finance-exports` com politicas RLS

## Variaveis de ambiente

| Variavel | Descricao |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL publica do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable key do Supabase |
| `INTERNAL_FINANCE_ALLOWED_EMAILS` | (opcional) Emails separados por virgula para fallback de acesso interno |

## Deploy

O projeto e compativel com Vercel. Basta configurar as variaveis de ambiente acima e fazer deploy a partir do repositorio. As migrations devem ser aplicadas no Supabase hospedado antes do primeiro acesso.

## Uso de IA

O registro detalhado de uso de IA esta em `docs/ai-usage-log.md`. Cada sessao de desenvolvimento assistida por IA foi documentada com ferramentas usadas, prompts, saida aceita, revisao humana e riscos identificados.

## Verificacao

```bash
npm test
npm run lint
npm run build
```

## Documentacao

Antes de desenvolver qualquer feature, leia `AGENTS.md` e a documentacao em `docs/`.

Os PDFs originais do teste e das pesquisas nao devem ser versionados neste repositorio.
