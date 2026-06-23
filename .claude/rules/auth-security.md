---
description: Regras de segurança para rotas de auth, middleware, perfis, portal e admin
globs:
  - "app/auth/**"
  - "app/login/**"
  - "app/activation/**"
  - "app/portal/**"
  - "middleware.ts"
  - "lib/auth-model.ts"
  - "lib/client-invite-actions.ts"
  - "lib/activation-actions.ts"
  - "lib/clients.ts"
  - "lib/portal-actions.ts"
  - "lib/profiles*.ts"
alwaysApply: false
---

# Regras Auth & Segurança — Atelier Nox

## Autenticação ≠ Autorização
- Sessão válida não implica acesso admin — verificar `profiles.role` sempre.
- Negar por padrão: se role não for confirmado, redirecionar ou retornar 403.
- Admin: requer `role = 'admin'` verificado server-side em cada rota.
- Cliente: requer sessão válida + acesso apenas ao próprio `businesses.owner_id`.
- Visitante anónimo: redirect `/login?next=<rota>` em qualquer rota protegida.

## Regras de isolamento
- Nunca usar fallback demo em fluxos reais de cliente (apenas em mock data local).
- Cliente não pode aceder rotas `/clients`, `/demandes`, `/actions`, `/contenus`, `/infra`.
- Admin acede `/portal` apenas para suporte; cliente não acede rotas admin.
- Após alteração de protecção: testar admin, cliente e visitante sem sessão.

## Convites e activação
- Token de convite é de uso único — invalidar após consumo.
- Nunca expor token em URL visível ao utilizador além do fluxo de activação.
- Activação deve criar perfil com role correcto e business associado.

## Ficheiros locais sensíveis — nunca ler ou revelar
`.env.local` | `.env.e2e.local` | `.supabase-admin.local` | `.supabase-client-test.local` | `.supabase-db-password.local`
