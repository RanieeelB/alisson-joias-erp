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

## 2026-04-30 - feat/dashboard-financeiro

- Ferramentas/skills usadas: Codex, `brainstorming`, `imagegen`, `jewelry-erp-finance-domain`, `next-best-practices`, `vercel-react-best-practices`, `building-components`, `test-driven-development`.
- Resumo do prompt ou tarefa: iniciar o Dia 1 como um esboço/protótipo inicial do painel financeiro. Antes de escrever a tela final, foram definidos os tokens visuais, a estrutura da tela e um protótipo de referência para aprovar a direção visual.
- Saída aceita: branch `feat/dashboard-financeiro`, fluxo de ideação registrado em `AGENTS.md`, tokens aprovados como `Graphite Ledger`, layout aprovado como `Finance Command Center` e protótipo visual gerado com IA para orientar a implementação.
- Revisão/adaptação humana: o usuário escolheu a direção híbrida executiva, aprovou a variação `Graphite Ledger`, selecionou o layout `Finance Command Center`, pediu a interface em português, solicitou moeda em reais, estados reais de carregamento/erro/vazio e ajustes nos gráficos após revisar no navegador.
- O que mudou após revisão: a implementação passou a usar uma barra lateral escura fixa, área de trabalho clara, acento dourado contido, cartões de indicadores financeiros, gráficos de receita e lucro, gráfico de receita por categoria, tabela de vencimentos, principais clientes e atividades recentes. Os valores passaram de dólar para real brasileiro, o texto central do gráfico circular foi compactado e o gráfico de receita/lucro ganhou escala de valores.
- Riscos ou follow-up: revisar a legibilidade final no navegador antes de considerar a branch aprovada; manter o dourado apenas como destaque para evitar uma interface bege ou marrom; não implementar integrações reais de QuickBooks, envio de e-mail ou pagamentos nesta etapa.

## 2026-04-30 - chore/supabase-setup

- Ferramentas/skills usadas: Codex, `supabase`, `supabase-postgres-best-practices`, `next-best-practices`, `jewelry-erp-finance-domain`, `test-driven-development`, `verification-before-completion`.
- Resumo do prompt ou tarefa: preparar o projeto antes do Dia 2 com migração inicial do Supabase, autenticação sem confirmação de e-mail, RLS e conexão SSR com a aplicação.
- Saída aceita: migração inicial para tabelas financeiras, políticas RLS, config local de Auth, helpers `@supabase/ssr`, proxy do Next.js 16 e testes de contrato para o setup.
- Revisão/adaptação humana: o usuário pediu branch sem prefixo `codex/`, commits curtos e semânticos, uso das regras de agente e atualização contínua deste registro.
- O que mudou após revisão: a branch foi criada como `chore/supabase-setup`; a CLI `supabase` não estava disponível no PATH, então foi usado `npx supabase@2.97.0` com cache local isolado para consultar a CLI. A migração foi criada manualmente com timestamp e validada por testes automatizados.
- Riscos ou follow-up: o `supabase db reset --no-seed` não pôde aplicar a migração porque o Docker Desktop não estava ativo no Windows; aplicar a migração quando o Docker estiver rodando, definir usuários reais com `app_metadata.role` em um projeto Supabase seguro e manter secrets fora do repositório.
