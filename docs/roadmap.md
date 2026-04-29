# Roadmap

## Estratégia de Branches

Usar branches semânticas, sem prefixo `codex/`:

| Fase | Branch | Objetivo |
| --- | --- | --- |
| Pré-desenvolvimento | `docs/pre-development` | Documentação, AGENTS.md, skills e diagramas |
| Etapa 1 | `feat/dashboard-financeiro` | Setup e dashboard financeiro |
| Etapa 2 | `feat/invoicing` | Lista de faturas, filtros, detalhe e ações |
| Etapa 3 | `feat/payments-accounts` | Payments, Accounts Receivable e Accounts Payable |
| Etapa 4 | `feat/statements-reports` | Statements e relatórios analíticos |
| Etapa 5 | `feat/automations` | Automações bônus e polimento final |

Múltiplos commits são permitidos por branch. Use Conventional Commits e mantenha cada commit com intenção clara.

## Sequência Sugerida

### Dia 1 - Setup e Dashboard

- Criar o projeto Next.js com TypeScript e Tailwind.
- Definir layout base, tokens de tema e navegação.
- Construir KPIs, gráficos, AR Aging, top clientes e feed de atividades.
- Usar dados mockados realistas se o Supabase ainda não estiver pronto.

### Dia 2 - Invoicing: Lista

- Definir modelo de invoice e line items.
- Criar lista de faturas, busca, filtros, cards de resumo e tabela.
- Criar badges semânticos de status.

### Dia 3 - Invoicing: Detalhe e Payments

- Criar rota de detalhe da fatura.
- Exibir line items, totais, histórico de pagamentos, indicador QuickBooks e painel de ações.
- Criar listagem de pagamentos e fluxo de registro de pagamento.

### Dia 4 - AR e AP

- Criar aging analysis, barras por cliente e reminders para faturas abertas.
- Criar tabela de contas a pagar e cards de resumo.
- Garantir que categorias e exemplos façam sentido para joalheria.

### Dia 5 - Statements, Reports, Automações e Deploy

- Criar geração de statements por período.
- Criar seletor de relatórios e telas analíticas.
- Adicionar automações bônus escolhidas.
- Preparar README, screenshots, deploy e roteiro da apresentação.

## Exemplos de Commits

- `docs: add pre-development structure`
- `docs: map technical test requirements`
- `docs: add architecture and data diagrams`
- `chore: register agent skill workflow`
- `feat: add dashboard financial KPIs`
- `feat: add invoice status filters`
- `test: cover invoice filtering`
- `fix: correct overdue balance calculation`

## Pronto Para Começar

Uma branch de feature está pronta para começar quando:

- seus requisitos estão mapeados em `docs/requirements.md`;
- suas tarefas estão listadas em `docs/tasks.md`;
- as skills necessárias estão identificadas no `AGENTS.md`;
- o nome da branch segue o roadmap.

## Pronto Para Entregar

Uma branch de feature está pronta quando:

- os critérios de aceite foram cumpridos;
- testes e verificações relevantes passaram;
- o uso relevante de IA foi registrado;
- a documentação foi atualizada quando houve mudança de decisão;
- nenhum segredo ou PDF confidencial foi staged.

