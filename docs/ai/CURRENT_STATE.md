# CURRENT_STATE.md — Atelier Nox Growth System
> Fonte de verdade do estado actual. Actualizar a cada sessão com `/atelier-nox-handoff`.
> **Toda afirmação deve ser classificada:** ✅ confirmado | ⚠️ relatado não verificado | ⏳ pendente | ❓ desconhecido

**Última actualização:** 2026-06-23
**Quem actualizou:** Claude (Cowork session, sandbox Linux)

---

## 1. Estado Git

| Item | Estado | Valor |
|---|---|---|
| Branch activo | ✅ confirmado | `main` |
| HEAD local | ✅ confirmado | `de2b78c0` — feat: reposition public site around free diagnostic |
| origin/main | ✅ confirmado | `52082b90` — Merge pull request #8 from inocencio22/release/phase-b |
| Relação com origin | ✅ confirmado | local main: **ahead 3, behind 2** de origin/main |
| Commits não publicados | ✅ confirmado | `de2b78c0`, `132d1fb2`, `98117485` (3 commits à frente) |
| Commits não puxados | ✅ confirmado | 2 commits em origin/main não presentes em local |

## 2. Worktrees

| Worktree | Branch | Commit | Estado |
|---|---|---|---|
| MARKETING/ (principal) | main | de2b78c0 | activo |
| worktrees/gate-b1 | feature/gate-b1-conversion | 52082b90 | prunable |
| /tmp/phase-b-clean | (detached HEAD) | 57114642 | prunable |

## 3. Gate actual e próximo passo

| Gate | Objectivo | Estado |
|---|---|---|
| Gate B1.1 | RPC atómica de conversão demande→business | ⚠️ Implementação relatada como completa; aguarda aprovação João |
| Gate B1.2 | Convite de cliente + email transaccional | ⏳ Não iniciado |
| Gate B2 | Portal, profiles, acessos | ⏳ Não iniciado |

**Próxima acção autorizada:** aguardar decisão de João sobre Gate B1.1.

**Bloqueios actuais:**
- Migration 016 criada em ficheiro mas **não aplicada** localmente nem em produção ⚠️ relatado
- `.env.local` ausente em `worktrees/gate-b1/` (bloqueou teste UI em sessão anterior) ⚠️ relatado
- Branch `feature/gate-b1-conversion` não mergeada em main ✅ confirmado

## 4. Migrations

| Migration | Ficheiro existe | Aplicada local | Aplicada produção |
|---|---|---|---|
| 001–015 | ✅ confirmado | ⚠️ relatado (sessões anteriores) | ⚠️ relatado |
| 016_create_convert_rpc.sql | ✅ confirmado | ❌ confirmado não aplicada | ❌ confirmado não aplicada |

## 5. Alterações não publicadas (tracked + modified)

O working tree possui alterações pré-existentes. Consultar `git status --short` para o número e a lista actuais.
Inclui: páginas app/, componentes, lib/, package.json, .gitignore, CLAUDE.md, scripts .bat.
**Não fazer commit sem auditoria prévia e aprovação de João.**

## 6. Ambiente local

| Ferramenta | Disponível | Onde |
|---|---|---|
| Docker | ❓ desconhecido (não verificado nesta sessão) | Windows |
| Supabase local | ❓ desconhecido | Windows (Docker) |
| Next.js dev | ❓ desconhecido (não activo nesta sessão) | Windows |
| Claude sandbox | ✅ confirmado | Linux Ubuntu 22, sem Docker/Supabase |
| Claude Code | ✅ confirmado | versão 2.1.181 |

## 7. Decisões pendentes de João

Ver `docs/ai/DECISIONS.md` para lista completa.
Pendentes críticas:
- Aplicar migration 016 localmente
- Autorizar commit + push da branch `feature/gate-b1-conversion`
- Aplicar migration 016 em produção