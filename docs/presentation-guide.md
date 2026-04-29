# Guia de Apresentação

## Objetivo

A apresentação final deve mostrar o módulo financeiro funcionando e explicar como a IA foi usada como acelerador de engenharia, sem substituir a compreensão do código e das decisões.

## Fluxo Sugerido de Demo

1. Comece pelo dashboard e explique os KPIs financeiros.
2. Abra a listagem de faturas e mostre filtros/busca.
3. Abra o detalhe de uma fatura e explique line items, subtotal, tax, total, paid, balance e indicador QuickBooks.
4. Mostre payments e explique pagamentos parciais/overpayments.
5. Mostre Accounts Receivable aging e Accounts Payable.
6. Mostre statements e reports.
7. Termine com automações bônus, link de deploy e tradeoffs.

## Perguntas Técnicas Prováveis

- Por que usar App Router?
- Quais componentes são Server Components e quais são Client Components?
- Como o Supabase entra em auth, banco, storage e realtime?
- Como RLS protegeria dados do portal do cliente?
- Como os saldos de invoice e aging buckets são calculados?
- Como overpayments são representados?
- O que uma integração real com QuickBooks exigiria?
- Onde a IA ajudou e o que foi alterado após revisão humana?
- O que seria melhorado com mais tempo?

## Evidências Para Ter à Mão

- Histórico Git com commits semânticos.
- README com setup e uso de IA.
- Screenshots ou imagens dos diagramas.
- Explicação curta da arquitetura.
- Explicação do modelo de dados.
- Limitações conhecidas e próximos passos.

