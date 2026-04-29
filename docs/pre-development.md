# Pre-Development Guide

## Purpose

This repository starts with a documentation-first pre-development phase. The goal is to turn the technical test and research notes into an executable engineering map before writing product code.

This phase prepares the project to answer three evaluation points:

- Can the developer understand the ERP finance domain?
- Can the developer use AI strategically instead of blindly copying output?
- Can the developer deliver a professional Next.js and Supabase application in a short timeline?

## Scope

In scope for this branch:

- `AGENTS.md` with project rules and skill usage.
- `docs/` with requirements, architecture, data model, roadmap, tasks, AI usage, presentation notes, and visual direction.
- Mermaid diagram sources.
- Generated presentation-style diagram images under `docs/assets/diagrams/`.
- Local custom skill `jewelry-erp-finance-domain`.
- Installation/research notes for external skills.

Out of scope for this branch:

- Next.js scaffold.
- Supabase project setup.
- Product code.
- Deployment.
- Copying original PDFs into the repository.

## Confidentiality

The technical test PDF is marked confidential. Do not copy it into the repo, do not paste long verbatim excerpts, and do not publish the raw file.

The working docs summarize the requirements so the repo remains useful without exposing the original PDFs.

## Local Source Files

The source PDFs used during planning were local files:

- `C:\Users\ranie\Downloads\teste-tecnico-alisson-joias.pdf`
- `C:\Users\ranie\Downloads\Planejamento Projeto Fullstack.pdf`
- `C:\Users\ranie\Downloads\Planejamento Projeto Fullstack (1).pdf`

These files are intentionally not versioned.

## Public References

- Next.js App Router: https://nextjs.org/docs/app
- Supabase SSR with Next.js: https://supabase.com/docs/guides/auth/server-side/nextjs
- Supabase AI skills: https://supabase.com/docs/guides/getting-started/ai-skills
- Vercel agent skills: https://vercel.com/docs/agent-resources/skills
- Skills directory: https://skills.sh/
- PIRO reference: https://www.gopiro.com/

## How to Use This Documentation

Start every implementation branch by reading the relevant requirement section, the data model, and the task list. Then use the required skills from `AGENTS.md` before generating code or schemas.

Keep this documentation alive. When a future branch makes a decision that changes architecture, data shape, or scope, update the docs in the same branch.

