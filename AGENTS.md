# AGENTS.md - Atelier Nox Growth System

## Objetivo comercial

Atelier Nox Growth System e um webapp + portal para vender e entregar um servico mensal gerido de IA + marketing local para PME da Suisse romande.

O primeiro nicho e saloes de coiffure em Lausanne. O objetivo nao e criar um SaaS generico. O objetivo e ajudar Joao Pedro a vender, operar e provar valor com diagnosticos, acoes comerciais, conteudos, relances, Google Business, aprovacoes e relatorios.

## Stack tecnica

- Next.js App Router com TypeScript.
- React 19.
- Tailwind CSS.
- Supabase Auth, Postgres, RLS e migrations.
- Vercel para producao e previews.
- GitHub como origem do codigo.
- Interface em frances.
- Documentacao interna em portugues.

## Prioridades do projeto

1. Seguranca.
2. Supabase/RLS.
3. Portal cliente.
4. Admin operacional.
5. Diagnostic gratuit.
6. Relatorio mensal.
7. Emails/convites.
8. Testes.
9. Analytics simples.
10. Pagamentos apenas depois da validacao comercial.

## Regras de produto

- O cliente paga pelo servico gerido, nao para trabalhar dentro de uma ferramenta.
- O portal cliente deve mostrar resultado, clareza, aprovacoes e proximas acoes.
- O admin deve permitir operar clientes com rapidez e qualidade.
- Nao adicionar dashboards com graficos sem decisao operacional clara.
- Nao priorizar integracoes complexas antes de validar vendas.
- Toda funcionalidade deve responder: isso ajuda Joao a vender, entregar ou provar valor?

## Regras de seguranca

- Ler `SECURITY_CHECKLIST.md` antes de tocar em Auth, RLS, Vercel, Supabase, formularios ou integracoes externas.
- Nunca commitar senhas, tokens, service keys, access tokens ou arquivos `.local`.
- Arquivos locais sensiveis devem ficar ignorados no Git.
- `NEXT_PUBLIC_*` pode ser publico; service role key nunca deve ir para o frontend.
- Rotas admin devem exigir usuario autenticado com role `admin`.
- Rotas cliente devem mostrar apenas dados do business do usuario.
- Ao tocar em Auth/RLS, testar admin e cliente separadamente.
- Se um token aparecer em print ou conversa, recomendar revogacao imediata.

## Regras Supabase/RLS

- Migrations vivem em `supabase/migrations`.
- Gerar bundle com `npm run supabase:bundle` quando migrations mudarem.
- Atualizar `lib/supabase.types.ts` depois de mudar schema.
- Nao enfraquecer policies RLS para "resolver rapido".
- Clientes devem ler apenas dados ligados ao seu `businesses.owner_id`.
- Admin pode operar todos os registros.
- Onboarding publico pode inserir demandes, mas leitura/gestao deve ser admin.

## Rotas e separacao de acesso

- Publico: `/`, `/services`, `/diagnostic-gratuit`, `/abonnement`, `/onboarding`, `/diagnostic`, `/login`.
- Admin: `/dashboard`, `/clients`, `/demandes`, `/actions`, `/contenus`, `/contacts`, `/campagnes`, `/messages`, `/rapports`, `/infra`, `/business`, `/instagram`, `/propositions`.
- Cliente: `/portal`, `/portal/abonnement`, e visoes cliente de acoes/conteudos/relatorios.

## Estilo visual

- Design suico contemporaneo.
- Fundo branco/off-white.
- Tipografia preta forte.
- Grid rigoroso.
- Blocos graficos coloridos.
- Visual editorial, cultural, moderno e profissional.
- Evitar estetica preta/gotica dominante, luxo sombrio, startup generica e excesso de gradiente artificial.
- Usar linguagem de confianca: qualite, clarte, suivi, precision, fiable, local, sans bruit, mesurable.

## Idioma

- Interface visivel em frances.
- Documentacao interna e comentarios estrategicos em portugues.
- Copy publica deve soar local, clara, confiavel e premium para Suisse romande.

## O que nao fazer agora

- Nao instalar ferramentas aleatorias.
- Nao integrar Meta/Instagram/Google Ads de forma complexa agora.
- Nao instalar LangChain ou frameworks pesados de IA sem necessidade provada.
- Nao adicionar CRM pesado ou BI complexo.
- Nao adicionar Stripe antes de validar oferta e fluxo comercial.
- Nao automatizar envio de mensagens antes de regras de consentimento e revisao humana.

## Como testar antes de finalizar alteracoes

Rodar, no minimo:

```bash
npm run lint
npm run build
```

Quando tocar em Supabase:

```bash
npm run supabase:bundle
npx supabase db push --include-all
```

Tambem validar manualmente:

- Login admin.
- Login cliente.
- Cliente nao acessa area admin.
- Admin acessa `/clients`, `/demandes`, `/actions`, `/contenus`, `/infra`.
- `diagnostic-gratuit` cria demande.
- Portal cliente mostra somente dados do business correto.

## Regras para novas dependencias

Antes de instalar qualquer dependencia, apresentar:

- Ferramenta.
- Categoria.
- Instalar agora, preparar depois ou nao instalar.
- Problema que resolve.
- Risco/custo.
- Comando de instalacao.
- Arquivos alterados.
- Justificativa final.

Instalar apenas apos aprovacao explicita de Joao.
