---
description: Regras para trabalho com Supabase, migrations, RLS e tipos
globs:
  - "supabase/**"
  - "lib/supabase*.ts"
  - "lib/admin-client.ts"
  - "lib/supabase-server.ts"
  - "lib/clients.ts"
  - "lib/business.ts"
  - "lib/business-actions.ts"
alwaysApply: false
---

# Regras Supabase — Atelier Nox

## Ordem obrigatória: local antes de remoto
1. Testar sempre localmente (Docker + Supabase local) antes de qualquer operação em cloud.
2. Nunca aplicar migration remota sem autorização explícita de João.
3. Supabase local corre em Docker no Windows — não está disponível no sandbox Linux do Claude.

## Migrations
- Ficheiros vivem em `supabase/migrations/` com numeração sequencial (`NNN_nome.sql`).
- **Migration criada ≠ migration aplicada.** Distinguir sempre nas comunicações com João.
- Após criar migration: executar `npm run supabase:bundle` e `npm run supabase:types`.
- Nunca modificar migrations já aplicadas — criar nova migration correctiva.

## RLS — regras de ouro
- RLS deve estar activo em todas as tabelas com dados de cliente.
- Cliente vê apenas dados ligados ao seu `businesses.owner_id`.
- Admin pode operar todos os registos.
- Nunca usar `USING (true)` em tabela sensível após fase demo.
- Nunca enfraquecer policy para "resolver rápido".
- Ao alterar RLS: documentar impacto antes de qualquer mudança.

## Service role
- Service role key nunca vai ao frontend nem a componentes client-side.
- Usar apenas em Server Actions ou API Routes, via `createAdminClient()`.
- Nunca expor em logs, prints ou relatórios.

## Multi-tenant
- Verificar isolamento admin / cliente / visitante em cada alteração de schema ou policy.
- Onboarding público pode INSERT em `onboarding_submissions`; nunca SELECT sem auth.
