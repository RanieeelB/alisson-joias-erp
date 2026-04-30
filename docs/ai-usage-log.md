# Registro de Uso de IA

Use este arquivo para registrar ajuda relevante de IA durante o projeto. Isso será útil para a apresentação final e mostra maturidade no processo.

## Modelo de Entrada

```md
## AAAA-MM-DD - <branch ou feature>

- Ferramentas/skills usadas:
- Resumo do prompt ou tarefa:
- Saída aceita:
- Revisão/adaptação humana:
- O que mudou após revisão:
- Riscos ou follow-up:
```

## 2026-04-29 - docs/pre-development

- Ferramentas/skills usadas: Codex, `find-skills`, `skill-installer`, `skill-creator`, `imagegen`.
- Resumo do prompt ou tarefa: transformar o teste técnico e os PDFs de pesquisa em uma estrutura de pré-desenvolvimento para o repositório.
- Saída aceita: `AGENTS.md`, documentação, fontes Mermaid, imagens simples dos diagramas, recomendações de skills e skill local de domínio.
- Revisão/adaptação humana: o usuário pediu branches sem prefixo `codex/`, múltiplos commits por branch, pesquisa de skills existentes, diagramas em português e visual mais simples.
- O que mudou após revisão: o plano passou a instalar skills públicas, criar apenas uma skill local customizada e renderizar diagramas simples em português a partir de Mermaid.
- Riscos ou follow-up: reiniciar o Codex para carregar as skills recém-instaladas em sessões futuras.

## 2026-04-29 - ajuste de skills e diagramas

- Ferramentas/skills usadas: Codex, `skill-installer`, `imagegen`.
- Resumo do prompt ou tarefa: mover as skills para o escopo do projeto e melhorar os diagramas usando GPT image.
- Saída aceita: skills project-local em `.agents/skills`, `skills-lock.json`, imagens GPT em `docs/assets/diagrams/gpt-image/`.
- Revisão/adaptação humana: o usuário pediu que as skills não ficassem globais e que os diagramas tivessem aparência mais polida.
- O que mudou após revisão: as skills globais instaladas anteriormente foram removidas, a skill customizada foi copiada para o projeto e os diagramas ganharam versões visuais geradas por GPT image.
- Riscos ou follow-up: para precisão técnica e labels com acentos, manter os Mermaid como fonte de verdade.

## 2026-04-29 - banco e supabase extras

- Ferramentas/skills usadas: Codex, `image_gen`.
- Resumo do prompt ou tarefa: gerar imagens extras para o banco de dados com tabelas/colunas/relações e para as features do Supabase.
- Saída aceita: `docs/assets/diagrams/gpt-image/database-schema-gpt.png` e `docs/assets/diagrams/gpt-image/supabase-features-gpt.png`.
- Revisão/adaptação humana: os visuais foram mantidos simples, em português, e com foco em apresentação.
- O que mudou após revisão: os assets foram adicionados ao repositório e referenciados na documentação de diagramas.
- Riscos ou follow-up: manter Mermaid como referência exata de estrutura, já que os visuais GPT priorizam apresentação.

## 2026-04-29 - chore/initial-next-supabase-setup

- Ferramentas/skills usadas: Codex, `next-best-practices`, `supabase`, `verification-before-completion`, `create-next-app`, Supabase CLI e npm.
- Resumo do prompt ou tarefa: iniciar a configuração técnica do projeto com Next.js, Tailwind, TypeScript, ESLint, Supabase local e pacotes oficiais de Supabase para Next.js.
- Saída aceita: scaffold inicial gerado por CLI, `supabase/config.toml`, dependências `@supabase/supabase-js` e `@supabase/ssr`, `.env.example` sem secrets, e ajustes de ignore para artefatos locais.
- Revisão/adaptação humana: a IA assistiu na escolha dos comandos, verificou flags atuais dos CLIs e preservou o `AGENTS.md` e a documentação existentes.
- O que mudou após revisão: o pacote foi nomeado como `alisson-joias-erp`, o setup foi feito em branch dedicada e os arquivos gerados foram revisados antes do commit.
- Riscos ou follow-up: conectar a um projeto Supabase real somente quando houver credenciais seguras; não versionar `.env`, secrets ou PDFs.
