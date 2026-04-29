# Guia de Pré-Desenvolvimento

## Objetivo

Este repositório começa com uma fase de pré-desenvolvimento orientada por documentação. A ideia é transformar o teste técnico e as pesquisas iniciais em um mapa claro antes de escrever código do produto.

Esta fase ajuda a demonstrar três pontos importantes na avaliação:

- compreensão do domínio financeiro de um ERP de joalheria;
- uso estratégico de IA, com revisão e adaptação humana;
- preparação para entregar uma aplicação profissional com Next.js e Supabase em prazo curto.

## Escopo Desta Branch

Incluído nesta branch:

- `AGENTS.md` com regras do projeto e uso de skills;
- `docs/` com requisitos, arquitetura, modelo de dados, roadmap, tarefas, uso de IA, guia de apresentação e direção visual;
- fontes Mermaid dos diagramas;
- imagens simples dos diagramas em português;
- skill local customizada `jewelry-erp-finance-domain`;
- registro das skills públicas pesquisadas e instaladas.

Fora do escopo desta branch:

- criação do app Next.js;
- configuração real do projeto Supabase;
- código de produto;
- deploy;
- cópia dos PDFs originais para o repositório.

## Confidencialidade

O PDF do teste técnico é confidencial. Ele não deve ser copiado para o repositório, publicado ou reproduzido em trechos longos.

Os documentos deste diretório resumem os requisitos de trabalho sem expor o arquivo original.

## Fontes Locais

Os PDFs usados durante o planejamento estavam nos seguintes caminhos locais:

- `C:\Users\ranie\Downloads\teste-tecnico-alisson-joias.pdf`
- `C:\Users\ranie\Downloads\Planejamento Projeto Fullstack.pdf`
- `C:\Users\ranie\Downloads\Planejamento Projeto Fullstack (1).pdf`

Esses arquivos foram mantidos fora do versionamento.

## Referências Públicas

- Next.js App Router: https://nextjs.org/docs/app
- Supabase SSR com Next.js: https://supabase.com/docs/guides/auth/server-side/nextjs
- Supabase AI skills: https://supabase.com/docs/guides/getting-started/ai-skills
- Vercel agent skills: https://vercel.com/docs/agent-resources/skills
- Diretório de skills: https://skills.sh/
- Referência PIRO: https://www.gopiro.com/

## Como Usar Esta Documentação

Antes de iniciar uma branch de feature, leia os requisitos da etapa correspondente, o roadmap e a direção visual. Depois, use `AGENTS.md` para orientar o agente de IA com as skills adequadas.

A documentação deve continuar viva. Quando uma branch futura alterar decisões de arquitetura, dados, escopo ou apresentação, atualize os documentos junto com a implementação.

