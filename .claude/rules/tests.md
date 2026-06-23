---
description: Regras para testes E2E, Playwright e scripts de teste
globs:
  - "tests/**"
  - "playwright.config.ts"
  - "scripts/ensure-local-test-users.mjs"
  - "scripts/local-orchestrator.mjs"
  - "scripts/verify-local-app.mjs"
  - "scripts/verify-local-target.mjs"
  - "scripts/b11-*.sql"
alwaysApply: false
---

# Regras de Testes — Atelier Nox

## Regra fundamental: nunca testar contra produção
- Playwright usa `.env.e2e.local` — nunca `.env.local` (que aponta para Supabase cloud).
- `playwright.config.ts` tem guards que abortam se URL contiver `supabase.co`.
- Sempre verificar que `E2E_APP_URL` é `localhost` ou `127.0.0.1`.
- Se URL de produção aparecer em configuração de teste → abortar e alertar João.

## Ambiente de testes
- Supabase local requer Docker activo no Windows (não disponível no sandbox Linux do Claude).
- Next.js local deve estar activo em `http://127.0.0.1:3000` antes dos testes.
- Usar `npm run local:doctor` para verificar ambiente antes de `npm run test:e2e`.

## Integridade dos dados
- Testes não devem alterar dados de produção.
- Dados de teste devem ser limpos após cada execução.
- UUIDs de teste usam prefixo identificável (ex: `b11aaaaa-`, `b11cccc0-`).

## Honestidade nos resultados
- Nunca afirmar que um teste passou sem o ter executado.
- Distinguir: teste executado com resultado real vs. teste apenas recomendado.
- Resultado de teste deve incluir: comando exacto, saída real, exit code.
- Se o ambiente local não estiver disponível → documentar como bloqueio, não inventar resultado.
