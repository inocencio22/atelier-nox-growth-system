---
name: atelier-nox-handoff
description: Encerra uma missão do Atelier Nox verificando o estado real, atualizando a documentação de contexto e produzindo um handoff seguro para João, ChatGPT ou Codex. Use quando uma missão terminar ou antes de mudar de Gate.
---

# Skill: atelier-nox-handoff
**Tipo:** Execução manual
**Activar com:** `/atelier-nox-handoff` ou "encerrar missão"
**Propósito:** Encerrar uma missão de forma segura, registar o estado real e preparar o próximo passo.

---

## O que esta skill faz

1. Verifica o estado Git actual (branch, HEAD, diff, worktrees)
2. Lista os ficheiros realmente alterados nesta sessão
3. Regista comandos executados e seus resultados reais
4. Distingue testes executados de testes apenas recomendados
5. Actualiza `docs/ai/CURRENT_STATE.md` com o estado verificado
6. Regista decisões aprovadas nesta sessão em `docs/ai/DECISIONS.md`
7. Marca incertezas como ⚠️ em vez de afirmações
8. Produz um resumo curto para João em português
9. Produz um bloco reutilizável para ChatGPT ou Codex
10. Aguarda aprovação de João antes de qualquer acção externa

---

## Proibições permanentes desta skill

- Não fazer commit, push, merge ou deploy
- Não aplicar migrations (locais ou remotas)
- Não instalar dependências
- Não modificar ficheiros funcionais da aplicação
- Não revelar secrets ou conteúdo de `.env`
- Não afirmar que algo está pronto sem evidência verificada agora (não do histórico)

---

## Protocolo de execução

### PASSO 1 — Verificar Git
```bash
git branch -vv
git log --oneline -5
git status --short | head -30
git diff --stat HEAD
git worktree list
```

### PASSO 2 — Listar ficheiros alterados nesta sessão
Comparar com o estado inicial documentado. Classificar cada ficheiro:
- `CRIADO` — novo ficheiro
- `MODIFICADO` — ficheiro existente alterado
- `NÃO ALTERADO` — apenas lido

### PASSO 3 — Registar comandos executados
Para cada comando, registar:
- Comando exacto
- Exit code real
- Saída relevante (truncada se longa)
- Se passou ou falhou

### PASSO 4 — Estado dos testes
Para cada teste relevante ao Gate:
- ✅ EXECUTADO: [comando] → [resultado] → exit [N]
- ⚠️ RECOMENDADO MAS NÃO EXECUTADO: [motivo]

### PASSO 5 — Actualizar docs/ai/CURRENT_STATE.md
Preencher com valores verificados agora:
- Branch e HEAD actuais
- Estado dos worktrees
- Gate actual e próximo passo
- Migrations: quais existem vs. quais aplicadas
- Bloqueios actuais
- Decisões pendentes de João

**Regra de classificação obrigatória:** Toda informação deve ser marcada com:
- ✅ confirmado — verificado agora com comando ou leitura directa
- ⚠️ relatado — dito em sessão anterior mas não re-verificado agora
- ⏳ pendente — aguarda acção
- ❓ desconhecido — não foi possível verificar

Nunca converter uma afirmação ⚠️ relatada em ✅ confirmada sem re-verificar.

### PASSO 6 — Registar decisões (se houver)
Se João aprovou alguma decisão nesta sessão → adicionar em `docs/ai/DECISIONS.md` na secção DECISÕES APROVADAS.
Se foi apenas recomendação → adicionar em HIPÓTESES, nunca em DECISÕES.

### PASSO 7 — Resumo para João

```
=== RESUMO DA MISSÃO ===
Missão: [nome]
Gate: [gate]
Data: [data]

O QUE FOI FEITO:
[lista de 3-5 itens concretos]

O QUE ESTÁ PENDENTE:
[lista com responsável: João ou Claude]

PRÓXIMO PASSO:
[uma acção clara e quem faz]

ACÇÕES QUE PRECISAM DE JOÃO:
[ ] [acção 1]
[ ] [acção 2]
```

### PASSO 8 — Bloco para ChatGPT / Codex

```
PROJECTO: Atelier Nox Growth System
DATA: [data]
STACK: Next.js App Router + TypeScript + Supabase + Vercel
GATE ACTUAL: [gate] — [estado em 1 frase]
BRANCH: [branch] em [HEAD]
ÚLTIMA MISSÃO: [nome e resultado]
FICHEIROS RELEVANTES: [lista]
PRÓXIMA ACÇÃO: [acção]
RESTRIÇÕES OBRIGATÓRIAS:
- Não commitar, não fazer push, não deploy sem aprovação de João
- Não aplicar migrations sem aprovação explícita de João
- Migration criada ≠ migration aplicada — distinguir sempre
- Verificar estado actual em docs/ai/CURRENT_STATE.md antes de agir
- Toda informação não re-verificada nesta sessão deve ser marcada como ⚠️ relatada,
  ⏳ pendente ou ❓ desconhecida. Nunca converter relatado em confirmado sem evidência.
```

---

## Critérios para considerar a skill concluída

- [ ] `docs/ai/CURRENT_STATE.md` actualizado com valores verificados agora
- [ ] Lista de ficheiros alterados apresentada a João
- [ ] Testes executados vs. recomendados claramente separados
- [ ] Resumo entregue a João
- [ ] Nenhuma acção de produção realizada
- [ ] João tem a informação necessária para decidir o próximo passo
