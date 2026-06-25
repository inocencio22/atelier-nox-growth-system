# DECISIONS.md — Atelier Nox Growth System
> Registo de decisões aprovadas por João. Separar decisões de recomendações.
> Actualizar via skill `atelier-nox-handoff`.

---

## DECISÕES APROVADAS

### D-001 — Stack principal do projecto
**Data:** anterior a 2026-06-09 (estabelecida no início do projecto)
**Decisão:** Next.js App Router + TypeScript + Supabase + Vercel + GitHub
**Motivo:** Stack moderna, serverless, sem ops overhead, adequada para PME local
**Estado:** ✅ Activa e irreversível na fase actual
**Revisão futura:** Não prevista

### D-002 — Posicionamento como serviço gerido, não SaaS
**Data:** anterior a 2026-06-09
**Decisão:** Atelier Nox vende acompanhamento gerido, não acesso a ferramenta
**Motivo:** Diferenciação no mercado PME suíço; João entrega valor humano, não software
**Alternativas rejeitadas:** SaaS self-service, plataforma white-label
**Estado:** ✅ Activa
**Revisão futura:** Apenas após validação comercial em 3+ clientes

### D-003 — IA como apoio interno, não protagonista público
**Data:** anterior a 2026-06-09
**Decisão:** Não mencionar "IA" como feature principal na comunicação pública
**Motivo:** Público alvo (PME locais) não compra "IA"; compra resultado e clareza
**Alternativas rejeitadas:** "Pilotée par l'IA", "Intelligence artificielle"
**Estado:** ✅ Activa
**Impacto:** Toda copy nova deve seguir este princípio

### D-004 — Primeiro nicho: salões de coiffure em Lausanne
**Data:** anterior a 2026-06-09
**Decisão:** Começar com salões de coiffure antes de expandir a outros nichos
**Motivo:** Nicho conhecido, acesso fácil, validação rápida
**Estado:** ✅ Activa; nichos tatoueurs e restaurants/bars adicionados mas coiffure é primário
**Revisão futura:** Após 2-3 clientes confirmados em coiffure

### D-005 — Princípio de aprovação de João em commits/migrations/deploy
**Data:** estabelecida no início do projecto
**Decisão:** Nenhum commit, push, migration ou deploy sem aprovação explícita de João
**Motivo:** Protecção do projecto em fase de validação; João controla produção
**Estado:** ✅ Activa e permanente
**Impacto:** Claude e outros agentes não executam acções de produção autonomamente

### D-006 — Gate B1.1: RPC atómica com SELECT FOR UPDATE
**Data:** 2026-06-22/23 (sessões de implementação)
**Decisão:** Usar PostgreSQL `SELECT FOR UPDATE` dentro de RPC `SECURITY DEFINER` para garantir atomicidade na conversão demande→business
**Motivo:** Evitar race condition que criaria businesses duplicados em cliques simultâneos
**Alternativas rejeitadas:** Check simples no application layer, upsert sem lock
**Estado:** ⚠️ Implementada, aguarda aplicação da migration 016 e aprovação de João
**Evidência:** `supabase/migrations/016_create_convert_rpc.sql`

### D-007 — Prettier scope limitado por gate
**Data:** 2026-06-23
**Decisão:** `npm run format:write` e formatação de Prettier aplicados somente nos ficheiros do escopo do Gate, nunca globalmente
**Motivo:** Evitar alterações de formatação em 25+ ficheiros pré-existentes não relacionados com o Gate
**Estado:** ✅ Activa para todos os Gates futuros
**Impacto:** Scripts de Prettier devem especificar ficheiros explicitamente

---

## HIPÓTESES (não confirmadas por João)

### H-001 — Remover ignoreBuildErrors após corrigir tipos TS
**Recomendação:** Remover `ignoreBuildErrors: true` de `next.config.ts` após regenerar `supabase.types.ts`
**Estado:** Recomendação pendente; não aprovada por João
**Origem:** Diagnóstico 2026-06-23

### H-002 — Criar middleware.ts centralizado para protecção de rotas
**Recomendação:** Substituir protecção por-página por middleware centralizado
**Estado:** Recomendação pendente; não aprovada por João
**Origem:** Diagnóstico 2026-06-23

### H-003 — Adicionar CI workflow (.github/workflows/ci.yml)
**Recomendação:** lint + tsc + build automáticos em cada PR
**Estado:** Recomendação pendente; não aprovada por João
**Origem:** Diagnóstico 2026-06-23

---

## DECISÕES SUBSTITUÍDAS

### DS-001 — Estado Git documentado directamente no CLAUDE.md
**Data substituição:** 2026-06-23
**Razão:** CLAUDE.md ficava stale após cada commit; estado movido para `docs/ai/CURRENT_STATE.md`
**Substituído por:** D-008 (implícita — arquitectura de contexto desta missão)

---

## RECOMENDAÇÕES AINDA NÃO APROVADAS

Ver secção Hipóteses acima. Não tratar como decisões de João.
