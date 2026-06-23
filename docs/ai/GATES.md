# GATES.md — Atelier Nox Growth System
> Documentação formal de Gates. Não avançar nenhum Gate sem aprovação explícita de João.
> Actualizar via skill `atelier-nox-handoff` ao encerrar cada missão.

---

## Gate B1.1 — Conversão atómica demande → business

**Objectivo:** Implementar RPC PostgreSQL atómica que converte uma demande em business de forma segura, com protecção contra duplicação concorrente e rollback completo em caso de falha.

**Escopo autorizado:**
- `supabase/migrations/016_create_convert_rpc.sql` — RPC com `SELECT FOR UPDATE`
- `lib/supabase.types.ts` — tipo da RPC
- `lib/onboarding-actions.ts` — Server Action `convertToClient()`
- `app/demandes/[id]/page.tsx` — botão "Converter" + banner already_converted

**Critérios de conclusão:**
- [ ] Migration 016 aplicada localmente com sucesso
- [ ] Migration 016 aplicada em produção com sucesso
- [ ] Teste normal: admin converte demande → redireccionado para `/clients/[id]`
- [ ] Teste duplicado: segunda conversão retorna `already_converted` com link correcto
- [ ] Teste concorrente: `SELECT FOR UPDATE` bloqueia T2 até T1 concluir; 0 duplicados
- [ ] Teste rollback: falha a meio → 0 businesses criados, submission inalterada
- [ ] Lint: exit 0 | TSC: exit 0 | Prettier: sem alterações fora do escopo
- [ ] Commit e push da branch `feature/gate-b1-conversion` aprovados por João

**Estado actual:** ⚠️ Implementação relatada como completa; migration não aplicada; aguarda aprovação de João

**Evidências disponíveis (relatadas, não re-verificadas nesta sessão):**
- Testes P1–P7 concluídos em sessões anteriores
- `b11-concurrent-ps.log`: CONCURRENT TEST PASS (T2 bloqueou 3.085s, 0 duplicados)
- `b11-quality.log`: lint exit 0, TSC exit 0, build 39 páginas OK
- Prettier aplicado apenas nos 4 ficheiros do escopo

**Próximo Gate permitido após conclusão:** Gate B1.2

**Dependências:** Nenhuma (Gate B1.1 é independente de Gates anteriores)

---

## Gate B1.2 — Convite de cliente + email transaccional

**Objectivo:** Após conversão demande→business, enviar convite por email ao cliente com link de activação seguro. Cliente activa conta, define password e acede ao portal.

**Escopo esperado (não finalizado):**
- Edge Function ou Server Action para envio de email de convite
- Rota `/activation` para activação de conta
- Integração com Resend ou Supabase Auth email hooks

**Critérios de conclusão:** A definir com João antes de iniciar.

**Estado actual:** ⏳ Não iniciado

**Dependências:** Gate B1.1 completo e em produção

---

## Gate B2 — Portal, profiles e acessos completos

**Objectivo:** Portal cliente completo com visão de acções, conteúdos, aprovações e relatórios. Isolamento total por business.

**Estado actual:** ⏳ Não iniciado

**Dependências:** Gate B1.2 completo

---

## Gate C1 — Chatbot estruturado no site

**Objectivo:** Chatbot de qualificação no site público com fluxo estruturado (não IA aberta).

**Estado actual:** ⏳ Não iniciado

**Dependências:** Gate B2 completo (ou decisão de João para avançar em paralelo)

---

## Gate C2 — IA para qualificação e handoff humano

**Objectivo:** Respostas abertas por IA, qualificação automática de leads, resumo para João, handoff humano quando necessário.

**Estado actual:** ⏳ Não iniciado

**Dependências:** Gate C1 completo

---

## Gate D — WhatsApp Cloud API

**Objectivo:** Integração WhatsApp para receber e enviar mensagens de/para clientes e leads.

**Estado actual:** ⏳ Não iniciado

**Dependências:** Gate C2 completo

---

## Gate E — Replicação para outros negócios locais

**Objectivo:** Tornar o sistema replicável e configurável para diferentes negócios locais além de salões de coiffure.

**Estado actual:** ⏳ Não iniciado

**Dependências:** Gate D completo (ou decisão estratégica de João)
