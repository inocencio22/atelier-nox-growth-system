# SECURITY_CHECKLIST.md - Atelier Nox Growth System

Checklist permanente para antes de publicar, vender ou alterar areas sensiveis.

## 1. Segredos e arquivos locais

- [ ] Nenhum token, senha, service role key ou access token foi commitado.
- [ ] `.env*` continua ignorado no Git.
- [ ] Arquivos locais sensiveis continuam ignorados:
  - `.supabase-admin.local`
  - `.supabase-client-test.local`
  - `.supabase-db-password.local`
  - `supabase/.temp/`
- [ ] Nenhum valor sensivel aparece em logs, screenshots, docs ou relatorio final.
- [ ] Se um token aparecer em imagem/conversa, revogar no painel correspondente.

## 2. Supabase Auth

- [ ] Admin entra com conta Supabase real.
- [ ] Cliente entra com conta Supabase real.
- [ ] Email confirmation esta configurado conforme a fase atual.
- [ ] Redirect URLs incluem producao e localhost.
- [ ] Service role key nunca e usada no frontend.

## 3. Roles

- [ ] `profiles.role` permite apenas `admin` ou `client`.
- [ ] Novo usuario cria profile via trigger.
- [ ] Admin tem `role = admin`.
- [ ] Cliente teste tem `role = client`.
- [ ] Fallback por access gate nao substitui Auth real em producao.

## 4. RLS

- [ ] RLS esta ativo em tabelas com dados de cliente.
- [ ] Cliente so le registros ligados ao proprio `businesses.owner_id`.
- [ ] Admin pode operar todos os registros necessarios.
- [ ] Onboarding publico permite insert, mas leitura/gestao e admin.
- [ ] Nenhuma policy foi relaxada para `using (true)` em tabela sensivel apos a fase demo.

## 5. Rotas protegidas

- [ ] Visitante anonimo em rota protegida redireciona para `/login`.
- [ ] Cliente tentando abrir rota admin redireciona para `/portal`.
- [ ] Admin acessa `/clients`, `/demandes`, `/actions`, `/contenus`, `/contacts`, `/infra`.
- [ ] Portal cliente mostra apenas dados do proprio business.

## 6. Formularios

- [ ] Entradas publicas usam validacao no servidor.
- [ ] `diagnostic-gratuit` valida email, business name e limites de texto.
- [ ] Import CSV valida formato antes de inserir.
- [ ] Acoes e conteudos validam status, tipo e business id.
- [ ] Nenhum formulario envia email real automaticamente sem aprovacao humana.

## 7. Vercel/GitHub

- [ ] Variaveis Supabase estao configuradas em Production.
- [ ] Preview `develop` tem variaveis essenciais.
- [ ] Dependabot esta ativo para npm.
- [ ] Branch `main` esta limpo e builda.
- [ ] Deploy automatico da Vercel termina como Ready.

## 8. Testes antes de finalizar

Rodar:

```bash
npm run lint
npm run build
npm run format:check
npm run test:e2e
```

Quando Supabase muda:

```bash
npm run supabase:bundle
npm run supabase:types
```

## 9. Prioridade de revisao humana

- [ ] Alteracoes de RLS foram explicadas antes de aplicar.
- [ ] Alteracoes comerciais grandes foram explicadas antes de implementar.
- [ ] Integracoes externas com envio de mensagens/email/pagamento foram aprovadas explicitamente.

## 10. Fase atual

Permitido agora:

- Segurança.
- Supabase types.
- Zod.
- Prettier check.
- Playwright basico.
- SEO nativo.

Nao permitido agora:

- Sentry.
- Plausible.
- Resend.
- Stripe.
- PostHog.
- APIs Meta/Instagram/Google/WhatsApp.
- OpenAI API.
- LangChain.
- n8n/Make.
- Supabase Edge Functions.
