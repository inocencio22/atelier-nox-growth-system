# Atelier Nox Growth System

Webapp MVP para transformar visibilidade local, Instagram e contatos em ações comerciais semanais para pequenos negócios da Suisse romande.

## Objetivo

Criar uma plataforma séria para empreendedores que precisam de clientes, mas não querem um CRM complexo nem uma agência genérica. O produto começa com diagnóstico gratuito e evolui para assinatura mensal a partir de CHF 190.

## Stack

- Next.js com App Router
- TypeScript
- Tailwind CSS
- Supabase Auth e RLS preparado para clientes separados
- Dados mockados em `lib/data.ts` quando Supabase não está configurado

## Execução

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

## Verificação

```bash
npm run lint
npm run build
```

## Supabase

O CRM de contatos já está preparado para Supabase, mas continua funcionando em modo demo quando as variáveis não existem.

1. Crie um projeto no Supabase.
2. Copie `.env.example` para `.env.local`.
3. Preencha:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
ACCESS_GATE_PASSWORD=troque-este-codigo
```

4. No SQL Editor do Supabase, rode:

```text
supabase/migrations/001_create_contacts.sql
supabase/migrations/002_create_businesses.sql
supabase/migrations/003_create_onboarding_submissions.sql
supabase/migrations/004_create_diagnostics_and_proposals.sql
supabase/migrations/005_create_commercial_actions.sql
supabase/migrations/006_create_content_items.sql
supabase/migrations/007_prepare_auth_profiles_roles.sql
```

5. Reinicie o servidor:

```bash
npm run dev
```

Depois disso, a página `/contacts` passa a ler e criar contatos reais na tabela `contacts`, e a página `/onboarding` passa a salvar pedidos de amostra gratuita na tabela `onboarding_submissions`.

## Acesso privado temporário

O MVP separa a vitrine pública da operação privada com um access gate simples.

Rotas públicas:

- `/`
- `/abonnement`
- `/diagnostic-gratuit`
- `/onboarding`
- `/diagnostic`
- `/login`

Rotas protegidas:

- `/actions`
- `/business`
- `/campagnes`
- `/contacts`
- `/contenus`
- `/dashboard`
- `/demandes`
- `/instagram`
- `/messages`
- `/portal`
- `/propositions`
- `/rapports`

Defina `ACCESS_GATE_PASSWORD` no `.env.local`. Se não houver variável, o código local temporário é `atelier-nox`.

Esse acesso é apenas uma proteção inicial de MVP. Para produção, substituir por Supabase Auth com papéis de admin e cliente.

## Modelo de contas preparado

A migration `007_prepare_auth_profiles_roles.sql` prepara a base para cada cliente ter o seu próprio espaço:

- `profiles`: perfil ligado a `auth.users`, com `role` `admin` ou `client`.
- `businesses.owner_id`: liga um negócio a um usuário cliente.
- RLS: clientes leem somente o business deles; admin lê e opera tudo.
- O onboarding público continua aceitando novos pedidos pelo formulário.

Fluxo operacional previsto:

1. João cria ou convida o usuário do cliente no Supabase Auth.
2. O perfil recebe `role = client`.
3. O business do cliente recebe `owner_id = id do profile`.
4. O cliente entra no portal e vê apenas conteúdos, ações, contatos e resultados do próprio negócio.
5. João entra como `admin` e gerencia todos os clientes.

Estado atual: o banco e o modelo de dados estão preparados, mas a tela de login ainda usa o access gate temporário. O próximo passo técnico é instalar/configurar `@supabase/ssr`, trocar o cookie temporário por sessão Supabase e aplicar redirecionamento por role.

### Login real com Supabase Auth

O app já tem a camada técnica para sessão Supabase:

- `lib/supabase-server.ts`: cliente Supabase para Server Actions e Server Components.
- `lib/supabase-proxy.ts`: cliente Supabase para proteger rotas no `proxy.ts`.
- `/login`: formulário de email/senha para contas reais e fallback por código temporário.

Como criar o primeiro acesso:

1. No Supabase, abra Authentication > Users.
2. Crie o usuário admin de João.
3. Em SQL Editor, ajuste o papel:

```sql
update public.profiles
set role = 'admin'
where email = 'seu-email@exemplo.ch';
```

4. Para um cliente, crie o usuário no Supabase Auth.
5. Crie ou atualize o business dele:

```sql
update public.businesses
set owner_id = (
  select id from public.profiles where email = 'cliente@empresa.ch'
)
where id = 'ID_DO_BUSINESS_DO_CLIENTE';
```

Resultado esperado:

- Admin entra e acessa áreas internas como `/demandes`, `/actions`, `/contacts`, `/contenus` e `/business`.
- Cliente entra e, se tentar abrir área interna, é enviado para `/portal`.
- O access gate por código continua apenas para desenvolvimento local e testes rápidos.

### Fluxo de onboarding

A rota `/onboarding` é a entrada comercial do produto:

1. O cliente preenche os dados do negócio.
2. Atelier Nox prepara uma amostra/diagnóstico gratuito em francês.
3. João usa esse diagnóstico para propor o plano adequado.
4. Depois da validação, o cliente pode evoluir para assinatura mensal a partir de CHF 190.

Campos capturados:

- nome do business
- email do proprietário
- cidade/bairro
- nicho
- site
- Instagram
- objetivo principal
- plano desejado
- notas livres

### Importação CSV

A página `/contacts` aceita importação CSV com preview. Cabeçalhos aceitos:

```csv
name,channel,lastInteraction,nextAction,value,status,consent
Sophie Martin,Instagram,Il y a 54 jours,Proposer deux créneaux couleur,CHF 145,a_relancer,true
Claire Dubois,WhatsApp,Il y a 12 jours,Demander un avis Google,CHF 95,avis_demande,true
```

Também são aceitos alguns cabeçalhos em português/francês simplificado, como `nom`, `dernierContact`, `prochaineAction` e `valeur`.

Status disponíveis:

- `a_relancer`
- `client_fidele`
- `nouveau`
- `demande_prix`
- `avis_demande`

## Telas principais

- Accueil: landing pública Atelier Nox.
- Diagnostic gratuit: landing pública para campanhas Instagram/Google e captação de leads.
- Dashboard: ações semanais, contatos quentes e métricas.
- Portail: visão simples para o cliente acompanhar trabalho feito, aprovações e próximos passos.
- Diagnostic: amostra gratuita para conversão.
- Contacts: CRM simples de clientes.
- Actions: fila operacional do serviço, com status, prazo, canal, valor potencial e resultado.
- Contenus: posts, reels, stories, photos, vidéos e Google Business com aprovação e objetivo comercial.
- Campagnes: segmentos e campanhas manuais de relance.
- Instagram: preview de integração e sinais comerciais.
- Messages: biblioteca de scripts e relances.
- Rapports: ROI simples.
- Abonnement: planos CHF 190, CHF 390 e CHF 690.
- Démarrer: pedido de amostra gratuita e início do funil comercial.
- Demandes: mesa interna para acompanhar pedidos de amostra, status e próxima ação comercial.
- Demandes detalhadas: `/demandes/[id]` transforma uma inscrição em diagnóstico, proposta sugerida e script manual de contato.
- Propositions salvas: diagnósticos salvos em `/demandes/[id]` criam propostas reais quando Supabase está ativo.
- Business: base do espaço cliente e preparação para multiempresa.

## Limites intencionais desta fase

- Sem login real ainda.
- Banco preparado com Supabase, mas o app continua funcionando em modo demo sem variáveis de ambiente.
- Sem Stripe ainda.
- Sem integração real com Instagram/Meta ainda.
- Sem envio automático de mensagens.

## Próximas implementações

1. Criar fluxo de convite/reset de senha para clientes.
2. Edição real do business logado.
3. Campanhas salvas por negócio.
4. Diagnóstico gratuito salvando leads.
5. Stripe Checkout e portal de assinatura.
6. Integração Instagram Business/Creator após preparação de app Meta.
7. Consentimento, opt-out e conformidade nLPD/FADP.
