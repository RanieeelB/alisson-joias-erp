# Diagramas

Os arquivos `.mmd` são a fonte técnica editável dos diagramas. Os PNGs em `docs/assets/diagrams/` são renderizações simples em português para revisão técnica. As versões em `docs/assets/diagrams/gpt-image/` são imagens geradas com GPT image para apresentação visual.

## Fontes

- `architecture.mmd`: arquitetura geral do módulo financeiro.
- `erd.mmd`: mapa simplificado das entidades financeiras.
- `invoice-flow.mmd`: fluxo de fatura, pagamento, aging e relatórios.
- `roadmap.mmd`: sequência de branches e entregáveis.

## Imagens

- `../assets/diagrams/architecture.png`
- `../assets/diagrams/erd.png`
- `../assets/diagrams/invoice-flow.png`
- `../assets/diagrams/roadmap.png`

## Versões GPT Image

- `../assets/diagrams/gpt-image/architecture-gpt.png`
- `../assets/diagrams/gpt-image/database-schema-gpt.png`
- `../assets/diagrams/gpt-image/erd-gpt.png`
- `../assets/diagrams/gpt-image/invoice-flow-gpt.png`
- `../assets/diagrams/gpt-image/roadmap-gpt.png`
- `../assets/diagrams/gpt-image/supabase-features-gpt.png`

Use as imagens GPT para slides e materiais visuais. Use as imagens Mermaid quando a precisão textual dos labels for mais importante.

Renderize novamente com Mermaid CLI sempre que alterar uma fonte `.mmd`.
