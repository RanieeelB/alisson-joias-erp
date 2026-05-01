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

## 2026-04-30 - login interno com Supabase Auth

- Ferramentas/skills usadas: Codex, `imagegen`, `supabase`, `next-best-practices`, `test-driven-development`, `verification-before-completion`.
- Resumo do prompt ou tarefa: criar o primeiro fluxo visual e funcional de autenticação interna antes de iniciar Invoicing.
- Saída aceita: protótipo visual aprovado pelo usuário, tela `/login` em português, fundo de dashboard escuro e desfocado, server actions de entrar/sair e proteção de `/dashboard` para usuários `admin` ou `staff`.
- Revisão/adaptação humana: o usuário aprovou o protótipo e pediu que o fundo atrás do login ficasse mais escuro e desfocado.
- O que mudou após revisão: o fundo da tela usa um preview de dashboard com overlay escuro e blur; o painel de login ficou integrado ao console financeiro, sem aparência de landing page.
- Riscos ou follow-up: validar o fluxo manualmente no navegador com o usuário local; para produção, usar senha forte e aplicar a mesma migration no Supabase remoto.

## 2026-04-30 - revisão visual da tela de login

- Ferramentas/skills usadas: Codex, `brainstorming`, `imagegen`, `next-best-practices`, `test-driven-development`, `verification-before-completion`.
- Resumo do prompt ou tarefa: refazer o login como tela separada, sem aparecer no meio do dashboard, com novo protótipo gerado por imagem antes da implementação.
- Saída aceita: protótipo standalone aprovado pelo usuário e implementação de `/login` com painel de marca escuro, superfície de formulário clara e sinais discretos de acesso financeiro interno.
- Revisão/adaptação humana: o usuário avaliou que a primeira versão parecia sobreposta ao dashboard e pediu uma tela própria.
- O que mudou após revisão: removido o fundo com preview/blur do dashboard; a tela passou a ter composição independente, com identidade Alisson Joias, área informativa de acesso interno e formulário em superfície clara.
- Riscos ou follow-up: validar visualmente no navegador em desktop/mobile e manter a tela sem elementos de dashboard quando a navegação do app crescer.

## 2026-04-30 - fundo hero do login

- Ferramentas/skills usadas: Codex, `imagegen`, `test-driven-development`, `verification-before-completion`.
- Resumo do prompt ou tarefa: remover o texto "Supabase Auth" da tela de login e usar uma imagem gerada como fundo da hero para ficar mais fiel ao protótipo aprovado.
- Saída aceita: asset `public/images/login-hero.png`, uso com `next/image` na hero escura e remoção do texto visível "Supabase Auth".
- Revisão/adaptação humana: o usuário pediu um fundo visual gerado em vez de um painel puramente CSS.
- O que mudou após revisão: o lado esquerdo do login ganhou uma imagem escura com atmosfera de joalheria/financeiro e overlays para manter legibilidade.
- Riscos ou follow-up: validar contraste final no navegador e substituir o asset se o usuário preferir uma versão mais clara ou mais abstrata.

## 2026-04-30 - ajuste visual da hero do login

- Ferramentas/skills usadas: Codex, `systematic-debugging`, `next-best-practices`, `test-driven-development`, `verification-before-completion`.
- Resumo do prompt ou tarefa: corrigir a parte esquerda da tela de login que ficou visualmente desconfigurada com elementos decorativos e cards de status competindo com o fundo.
- Saída aceita: hero simplificada com imagem gerada, overlay escuro, marca, título, texto curto e aviso de ambiente interno em um único bloco visual.
- Revisão/adaptação humana: o usuário apontou a desorganização visual diretamente pelo navegador com screenshot.
- O que mudou após revisão: foram removidos os cards de status e a tabela decorativa do rodapé da hero, reduzindo ruído e mantendo o login como tela separada.
- Riscos ou follow-up: revisar no navegador em larguras diferentes para ajustar posicionamento fino caso a imagem gere áreas muito escuras ou vazias.

## 2026-04-30 - refinamento de marca na tela de login

- Ferramentas/skills usadas: Codex, `brainstorming`, `building-components`, `test-driven-development`, `verification-before-completion`.
- Resumo do prompt ou tarefa: adicionar um ícone de diamante amarelo acima de "Alisson Joias" e usar linhas refinadas para deixar a tela de login mais profissional.
- Saída aceita: selo de diamante dourado aplicado na área de marca e linhas finas decorativas para organizar o cabeçalho da hero e a versão mobile.
- Revisão/adaptação humana: o pedido foi de refinamento visual sem alterar o fluxo de autenticação nem reintroduzir ruído na composição.
- O que mudou após revisão: a marca ganhou um ícone geométrico discreto e um sistema de linhas leves em tons dourado/grafite para reforçar a identidade visual.
- Riscos ou follow-up: validar visualmente no navegador se o ícone precisa crescer um pouco mais no desktop ou reduzir no mobile.

## 2026-04-30 - etapa 2 lista de faturas

- Ferramentas/skills usadas: Codex, `brainstorming`, `imagegen`, `jewelry-erp-finance-domain`, `next-best-practices`, `test-driven-development`, `verification-before-completion`.
- Resumo do prompt ou tarefa: avançar na Etapa 2 após o setup do Supabase com a primeira entrega de Invoicing: tipos, dados mockados realistas, rota protegida `/invoices`, filtros, busca, cards, tabela e indicador QuickBooks.
- Saída aceita: branch `feat/invoicing`, protótipo visual aprovado e implementação inicial da listagem de faturas alinhada ao dashboard financeiro existente.
- Revisão/adaptação humana: o usuário aprovou seguir com os próximos passos da Step 2 após confirmar que o protótipo correspondia à etapa de Invoicing.
- O que mudou após revisão: foi criado um shell financeiro compartilhado para sidebar/topbar, a navegação passou a incluir `/invoices`, e a listagem usa busca por invoice/customer e filtros por status via query string.
- Riscos ou follow-up: concluir a segunda metade da Etapa 2 com rota de detalhe, line items detalhados, painel lateral de ações e histórico de pagamentos.

## 2026-04-30 - refinamento da tabela de faturas

- Ferramentas/skills usadas: Codex, `test-driven-development`, `verification-before-completion`.
- Resumo do prompt ou tarefa: corrigir a sobreposição visual entre colunas da tabela de invoices, especialmente entre datas, totais, status e ações.
- Saída aceita: tabela com colunas mais estáveis, largura mínima maior, espaçamento horizontal melhor e badges sem colisão entre si.
- Revisão/adaptação humana: o usuário apontou a sobreposição diretamente por screenshot da tela de `/invoices`.
- O que mudou após revisão: a tabela passou a usar `table-fixed`, `colgroup` com proporções explícitas, `whitespace-nowrap` para datas e valores, além de larguras mínimas para status e actions.
- Riscos ou follow-up: validar no navegador em breakpoints menores se vale reduzir texto de colunas ou trocar algumas ações por ícones no futuro.

## 2026-04-30 - detalhe da fatura e painel lateral

- Ferramentas/skills usadas: Codex, `imagegen`, `jewelry-erp-finance-domain`, `next-best-practices`, `test-driven-development`, `verification-before-completion`.
- Resumo do prompt ou tarefa: concluir os passos restantes da Etapa 2 com a tela de detalhe da fatura, cálculos dos line items, painel lateral de ações e histórico de pagamentos.
- Saída aceita: rota protegida `/invoices/[id]`, navegação a partir da lista, header escuro, dados do cliente, tabela de joias faturadas, subtotal/tax/total/paid/balance, cards de QuickBooks e payment history.
- Revisão/adaptação humana: o usuário aprovou o protótipo visual do detalhe antes da implementação.
- O que mudou após revisão: os mocks de invoices passaram a incluir contato, billing, payments e line items consistentes com os totais; o detalhe usa esses dados para exibir o workspace completo da fatura.
- Riscos ou follow-up: o próximo avanço natural é tornar as ações funcionais com side panel interativo e persistência real no Supabase.

## 2026-04-30 - início da Etapa 3 Payments and Accounts

- Ferramentas/skills usadas: Codex, `brainstorming`, `imagegen`, `jewelry-erp-finance-domain`.
- Resumo do prompt ou tarefa: iniciar a branch `feat/payments-accounts` sem prefixo `codex/` e prototipar visualmente as novas telas de Payments, Accounts Receivable e Accounts Payable antes de implementar código de produto.
- Saída aceita: protótipo visual inicial salvo em `docs/assets/prototypes/payments-accounts-prototype.png`, com cards de pagamentos, listagem de pagamentos, Aging Analysis, saldos por cliente, reminders e tabela de Accounts Payable.
- Revisão/adaptação humana: pendente de aprovação do usuário antes de codificar as rotas e componentes da Etapa 3.
- O que mudou após revisão: ainda não houve implementação; o protótipo segue a direção visual existente do console financeiro com sidebar escura, superfícies claras, acento dourado contido e dados de joalheria.
- Riscos ou follow-up: ajustar datas, rótulos ou densidade do protótipo conforme feedback antes de criar `/payments`, `/accounts/receivable` e `/accounts/payable`.

## 2026-04-30 - implementação da Etapa 3 Payments and Accounts

- Ferramentas/skills usadas: Codex, `writing-plans`, `test-driven-development`, `jewelry-erp-finance-domain`, `next-best-practices`, `vercel-react-best-practices`, `building-components`, `verification-before-completion`.
- Resumo do prompt ou tarefa: após aprovação do protótipo visual, implementar Payments, Accounts Receivable e Accounts Payable como workspaces protegidos do módulo financeiro.
- Saída aceita: rotas `/payments`, `/accounts/receivable` e `/accounts/payable`, modelos mockados de pagamentos/AR/AP, helpers testáveis de resumo financeiro, navegação lateral atualizada e UI alinhada ao protótipo aprovado.
- Revisão/adaptação humana: o usuário aprovou o protótipo com “ok” antes da implementação.
- O que mudou após revisão: a implementação separou as telas por rota, manteve a linguagem operacional em português, preservou os labels financeiros em inglês quando são conceitos do teste e adicionou testes automatizados para os cálculos e estrutura das páginas.
- Riscos ou follow-up: os fluxos de registrar pagamento e enviar reminder ainda são simulados por botões; persistência real no Supabase e ações funcionais podem entrar em uma etapa bônus ou refinamento posterior.

## 2026-04-30 - migração para Supabase hospedado

- Ferramentas/skills usadas: Codex, `supabase`, `verification-before-completion`.
- Resumo do prompt ou tarefa: remover a dependência de Supabase local via Docker e configurar o projeto para usar um projeto Supabase hospedado com URL pública e publishable key.
- Saída aceita: `.env` local atualizado com as variáveis públicas fornecidas pelo usuário, `.env.example` com placeholders de projeto hospedado e README revisado para um fluxo de setup sem Docker.
- Revisão/adaptação humana: o usuário decidiu abandonar o fluxo local do Docker e seguir com Supabase hospedado.
- O que mudou após revisão: a documentação agora orienta setup por `.env`, explica o papel de `admin`/`staff` no Auth SSR e reforça que service role keys não entram no frontend.
- Riscos ou follow-up: aplicar a migration de referência no projeto remoto, criar os usuários internos corretos no painel do Supabase e revisar depois como demonstrar Storage real na entrega final.

## 2026-05-01 - início da Etapa 4 Statements and Reports

- Ferramentas/skills usadas: Codex, `brainstorming`, `imagegen`, `jewelry-erp-finance-domain`, `next-best-practices`, `vercel-react-best-practices`, `building-components`.
- Resumo do prompt ou tarefa: iniciar a branch `feat/statements-reports` sem prefixo `codex/` e prototipar visualmente as novas telas de Statements e Reports antes de escrever código de produto.
- Saída aceita: protótipo visual inicial salvo em `docs/assets/prototypes/statements-reports-prototype.png`, com seletor de período, cards de statements por cliente, ações View/Print/Email, Email All Statements, Bulk Download, seletor de relatórios e visão Revenue Analysis.
- Revisão/adaptação humana: pendente de aprovação do usuário antes de codificar as rotas e componentes da Etapa 4.
- O que mudou após revisão: ainda não houve implementação; o protótipo segue a direção visual existente do console financeiro com sidebar escura, superfícies claras, acento dourado contido e dados de joalheria.
- Riscos ou follow-up: ajustar rótulos, densidade, composição ou prioridades dos relatórios conforme feedback antes de criar `/statements` e `/reports`.

## 2026-05-01 - fallback de acesso interno

- Ferramentas/skills usadas: Codex, `supabase`, `test-driven-development`, `verification-before-completion`.
- Resumo do prompt ou tarefa: destravar o login interno enquanto o `app_metadata.role` do Supabase não estava fácil de configurar pelo Dashboard.
- Saída aceita: helper central `isInternalFinanceUser` que mantém `app_metadata.role` como regra principal e permite fallback server-side por `INTERNAL_FINANCE_ALLOWED_EMAILS`.
- Revisão/adaptação humana: o usuário tentou configurar `app_metadata` manualmente e depois pediu ajuda para resolver de forma prática.
- O que mudou após revisão: as rotas protegidas passaram a chamar o helper central em vez de repetir a lógica de role em cada arquivo.
- Riscos ou follow-up: manter o fallback apenas para ambiente controlado; para produção, preferir `app_metadata.role` preenchido por Admin API ou SQL seguro.

## 2026-05-01 - implementação da Etapa 4 Statements and Reports

- Ferramentas/skills usadas: Codex, `writing-plans`, `executing-plans`, `test-driven-development`, `jewelry-erp-finance-domain`, `next-best-practices`, `vercel-react-best-practices`, `building-components`, `verification-before-completion`.
- Resumo do prompt ou tarefa: implementar `/statements` e `/reports` após aprovação do protótipo visual.
- Saída aceita: rotas protegidas `/statements` e `/reports`, dados mockados realistas, helpers testáveis de statements e reports, cards de cliente, ações View/Print/Email, Email All Statements, Bulk Download, seletor de reports, Revenue Analysis, Cash Flow, Profit & Loss e Tax Summary.
- Revisão/adaptação humana: o usuário aprovou o protótipo visual antes da implementação e pediu continuidade com commits curtos e semânticos.
- O que mudou após revisão: a navegação lateral passou a apontar para Statements e Reports, e a implementação manteve labels financeiros do teste em English com texto operacional em português.
- Riscos ou follow-up: ações de envio, impressão, download e export ainda são simulações visuais; persistência Supabase, PDF/CSV real e e-mail real podem entrar em bônus ou refinamento.

## 2026-05-01 - ajuste do seletor de Reports

- Ferramentas/skills usadas: Codex, `systematic-debugging`, `test-driven-development`, `verification-before-completion`.
- Resumo do prompt ou tarefa: corrigir o seletor Revenue Analysis, Cash Flow, Profit & Loss e Tax Summary, que existia visualmente mas não trocava a visão ativa.
- Saída aceita: `/reports` passou a ler `?tipo=...`, renderizar a visão ativa no servidor e usar links específicos para cada report type.
- Revisão/adaptação humana: o usuário apontou que os quatro tipos ainda não funcionavam.
- O que mudou após revisão: foram adicionados testes para os links por tipo e a renderização ativa de reports; cada opção agora troca o painel principal.
- Riscos ou follow-up: os reports continuam baseados em dados mockados; export real ainda é boundary visual.

## 2026-05-01 - feat/internal-tabs

- Ferramentas/skills usadas: Codex, `next-best-practices`, `vercel-react-best-practices`, `building-components`, `test-driven-development`, `verification-before-completion`.
- Resumo do prompt ou tarefa: analisar a navegação existente e substituir a troca de tipo em Reports por tabs internas sem mudança de rota.
- Saída aceita: seletor Revenue Analysis, Cash Flow, Profit & Loss e Tax Summary passou de links com query string para tabs controladas por estado local.
- Revisão/adaptação humana: o usuário pediu branch sem prefixo `codex/`, commits curtos e semânticos, e reforçou que queria a implementação completa após a branch inicial.
- O que mudou após revisão: a rota `/reports` deixou de ler `searchParams`; `ReportsPage` virou componente client apenas para manter a aba ativa com `useState`, preservando o layout e a responsividade existentes.
- Riscos ou follow-up: como a troca agora é local, o tipo de relatório ativo não fica mais compartilhável por URL; se deep link virar requisito, será necessário reintroduzir sincronização com URL de forma controlada.

## 2026-05-01 - tabs internas em todas as seções

- Ferramentas/skills usadas: Codex, `next-best-practices`, `vercel-react-best-practices`, `building-components`, `test-driven-development`, `verification-before-completion`.
- Resumo do prompt ou tarefa: estender o padrão de tabs locais para todas as áreas que ainda usavam links ou query string como navegação interna.
- Saída aceita: filtros de status em Invoices, tabs de Payments/Accounts e tabs de Statements/Reports agora usam estado local sem mudar rota.
- Revisão/adaptação humana: o usuário pediu explicitamente que a substituição fosse feita em todas as seções após a primeira implementação em Reports.
- O que mudou após revisão: Invoices deixou de ler `searchParams`; Payments/Accounts e Statements/Reports ganharam workspaces compartilhados com wrappers por rota para manter entrada direta e alternância local.
- Riscos ou follow-up: as tabs locais não preservam seleção na URL; caso a apresentação precise de links diretos para uma aba específica, sincronizar estado e URL de forma intencional.

## 2026-05-01 - início da Etapa 5 Bonus e Automações

- Ferramentas/skills usadas: Codex, `brainstorming`, `imagegen`, `jewelry-erp-finance-domain`, `next-best-practices`.
- Resumo do prompt ou tarefa: iniciar a branch `feat/automations` sem prefixo `codex/`, escolher os bônus viáveis da Etapa 5 e prototipar a nova tela de automações antes de escrever código de produto.
- Saída aceita: protótipo visual inicial salvo em `docs/assets/prototypes/automations-prototype.png`, cobrindo workflow de pedido finalizado para Invoice, fila de automações, overdue reminders, late fees, Supabase Realtime, scheduled statements, export queue e Gold price API como integração conceitual.
- Revisão/adaptação humana: pendente de aprovação do usuário antes de implementar a rota e os componentes da Etapa 5.
- O que mudou após revisão: ainda não houve implementação; a escolha inicial prioriza uma tela operacional única de automações para demonstrar proatividade sem abrir integrações reais demais para o prazo.
- Riscos ou follow-up: ajustar o escopo caso o usuário prefira persistência real no Supabase ou uma automação específica acima dos conceitos visuais de e-mail, PDF/CSV e API de ouro.
