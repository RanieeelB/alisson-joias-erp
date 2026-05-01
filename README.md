# Alisson Joias ERP

Projeto do teste tecnico full stack para um modulo financeiro de ERP de joalheria, inspirado no contexto PIRO Fusion.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- ESLint
- Supabase (`@supabase/supabase-js` e `@supabase/ssr`)
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

### 3. Rodar a aplicacao

```bash
npm run dev
```

A aplicacao fica disponivel em `http://localhost:3000`.

## Supabase

- O schema de referencia continua em `supabase/migrations/20260430120000_init_finance_schema.sql`.
- O app usa Auth SSR com `@supabase/ssr`.
- Para acessar as rotas protegidas, o usuario precisa existir no projeto Supabase hospedado com `app_metadata.role` igual a `admin` ou `staff`.
- O fluxo atual prioriza banco/auth hospedados em vez de Supabase local via Docker.

## Verificacao

```bash
npm test
npm run lint
npm run build
```

## Documentacao

Antes de desenvolver qualquer feature, leia `AGENTS.md` e a documentacao em `docs/`.

Os PDFs originais do teste e das pesquisas nao devem ser versionados neste repositorio.
