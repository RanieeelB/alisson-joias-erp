# Mapa de Requisitos

## Objetivo da Avaliação

O teste avalia mais do que velocidade de codificação. O projeto precisa mostrar que a IA foi usada de forma estratégica para analisar uma referência real de ERP de joalheria, produzir um módulo financeiro profissional e manter qualidade mesmo com prazo curto.

## Stack Obrigatória

- Next.js 14+ com App Router.
- React com componentes funcionais e hooks.
- Supabase para banco, autenticação e storage.
- Tailwind CSS.
- Git e GitHub com histórico significativo de commits.

## Etapa 1 - Dashboard Financeiro

Objetivo: dar ao gestor financeiro uma visão rápida de receita, saldos em aberto, aging, principais clientes e atividades recentes.

Critérios de aceite:

- Cards de KPI para Receita Total, AR Outstanding, Faturas do mês e Faturas em atraso.
- Gráfico de receita e lucro dos últimos 6 meses.
- Gráfico donut ou pizza de receita por categoria: Custom Orders, Repairs, Wholesale, Retail.
- Tabela AR Aging Summary: Current, 1-30d, 31-60d, 61-90d, 90+.
- Top 5 clientes com maior saldo em aberto.
- Feed de atividade financeira recente.
- Valores com formatação monetária consistente e dados realistas do contexto de joias.

## Etapa 2 - Invoicing Completo

Objetivo: criar a principal experiência de gestão de faturas.

Critérios de aceite:

- Listagem de faturas com filtros de status: All, Pending, Partial, Paid, Overdue.
- Busca por número da fatura ou nome do cliente.
- Cards de resumo: Total faturado, Coletado, Outstanding, Overdue.
- Tabela com colunas: Invoice #, Customer, Type, Date, Due Date, Total, Paid, Balance, Status, Actions.
- Tela de detalhe da fatura com header escuro, dados do cliente, itens de joalheria, subtotal, tax, total, paid e balance.
- Painel lateral de ações: Send, Record Payment, Print, Download PDF, Edit.
- Histórico de pagamentos dentro da fatura.
- Indicador de sincronização com QuickBooks.

## Etapa 3 - Payments and Accounts

Objetivo: cobrir rastreamento de pagamentos, Accounts Receivable e Accounts Payable.

Critérios de aceite para Payments:

- Listagem com Payment #, invoice vinculada, customer, date, amount, method e reference.
- Cards para Collected This Month, Pending Deposits e Overpayments/Credits.
- Botão ou fluxo para registrar novo pagamento.

Critérios de aceite para Accounts Receivable:

- Gráfico de Aging Analysis por faixa de dias.
- Balanços por cliente com barra de progresso proporcional.
- Lista de faturas abertas com ação de reminder.

Critérios de aceite para Accounts Payable:

- Tabela de obrigações com AP #, Vendor, Category, Date, Due, Total, Paid, Balance, Status.
- Cards de resumo: Total Payable, Paid This Month, Overdue.
- Categorias: Raw Materials, Components, Certification, Services.

## Etapa 4 - Statements and Reports

Objetivo: permitir geração de statements e análise financeira.

Critérios de aceite para Statements:

- Seletor de intervalo de datas.
- Cards por cliente com nome, número de faturas, balance e ações View/Print/Email.
- Ação Email All Statements.
- Ação Bulk Download.

Critérios de aceite para Reports:

- Seletor de tipo de relatório: Revenue Analysis, Cash Flow, Profit & Loss, Tax Summary.
- Revenue Analysis com gráfico de revenue, expenses e profit, além de tabela mensal com margin e trend.
- Cash Flow com linha de inflows versus outflows.
- Profit & Loss com revenue, COGS, operating expenses e net profit.
- Tax Summary com cards trimestrais, valores coletados e status.
- Ação Export Report.

## Etapa 5 - Bonus e Automações

Objetivo: demonstrar proatividade em automações, ponto importante para a Alisson Joias.

Possíveis diferenciais:

- geração automática de fatura quando uma ordem for finalizada;
- notificações de faturas vencidas com lógica visual de reminder;
- cálculo automático de juros ou multa;
- atualizações via Supabase Realtime;
- envio programado de statements por e-mail;
- persistência real com CRUD no Supabase;
- formulário funcional de criação de fatura com validação;
- workflow: pedido finalizado -> fatura gerada -> e-mail enviado -> pagamento registrado;
- exportação programada de relatórios em PDF/CSV;
- integração com API externa, por exemplo cotação do ouro.

## Requisitos de Design e UX

- Paleta coerente com joalheria: dourado, preto e creme, com cores de apoio discretas.
- Hierarquia profissional de tipografia.
- Espaçamento consistente, sem interface apertada.
- Estados hover, active e focus visíveis.
- Badges semânticos: verde para paid, amarelo para pending, azul para partial e vermelho para overdue.
- Identidade visual própria, sem aparência de template genérico.

