# Deployment — Atelier Nox Growth System

> Este documento substitui o script `DEPLOY.bat`, que foi removido por conter
> comandos perigosos (apagar locks Git, lista hardcoded de ficheiros, push directo
> para `main` sem revisão).

## Como o deploy de produção funciona

O deploy é **automático via Vercel**: quando um commit chega ao branch `main` no
GitHub, a Vercel constrói e publica em poucos minutos.

Não é necessário nenhum script local para fazer deploy.

## Fluxo correcto de trabalho

```
branch de feature
  → testes locais (npm run dev, npm run test:e2e)
  → revisão de código
  → aprovação de João
  → merge/push para main (pelo terminal ou interface GitHub)
  → Vercel deploy automático
```

## Regras permanentes

- **Nunca usar scripts que apaguem locks Git** (`HEAD.lock`, `index.lock`, etc.).
  Se um lock existir, diagnosticar a causa antes de actuar.
- **Nunca fazer push directo para `main`** sem aprovação explícita de João.
- **Migrations são uma etapa separada** do deploy de código e exigem:
  1. Criação e revisão local
  2. Autorização de João
  3. Aplicação manual via Supabase Dashboard ou CLI local
- **Nenhum script local deve executar `git commit` ou `git push` automaticamente.**

## Branches e worktrees

Para alterações de segurança ou infraestrutura, sempre criar uma branch isolada
e um worktree separado. Nunca alterar directamente o working tree principal.

## URL de produção

<https://atelier-nox-growth-system.vercel.app/>
