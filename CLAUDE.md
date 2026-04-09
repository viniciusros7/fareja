@AGENTS.md

# Regras do Projeto

## Git
- Nunca trabalhe diretamente na branch `main`. Crie sempre uma branch para cada tarefa.
- Mensagens de commit em português, no imperativo (ex: "adiciona busca por raça", "corrige layout do perfil").
- Commits atômicos e descritivos.

## Código
- Leia o arquivo completo antes de modificar qualquer coisa.
- Sem TODOs, placeholders ou código comentado. Se não está pronto, não entra no commit.
- Não adicione comentários óbvios, docstrings ou anotações de tipo em código que você não alterou.
- Não crie helpers ou abstrações para uso único — simplicidade primeiro.

## Stack
- **Framework:** Next.js 16 + TypeScript
- **Estilos:** Tailwind CSS
- **Ícones:** Lucide React

## Paleta de Cores
| Token | Hex | Uso |
|-------|-----|-----|
| Primária (terracota) | `#C2703E` | CTAs, destaques, links |
| Background (creme) | `#FDF6EE` | Fundo geral das páginas |
| Texto (marrom escuro) | `#2C1810` | Texto principal |

Use essas cores via classes Tailwind customizadas (configuradas em `tailwind.config`) ou diretamente como valores arbitrários (`bg-[#C2703E]`, etc.) enquanto o config não estiver atualizado.

## Roles de usuário

A tabela `profiles` tem 4 roles: `client`, `kennel`, `approver`, `super_admin`.

Para setar roles manualmente no **Supabase SQL Editor** (Dashboard → SQL Editor):

```sql
-- Promover a super_admin:
UPDATE public.profiles SET role = 'super_admin' WHERE email = 'seu@email.com';

-- Promover a approver:
UPDATE public.profiles SET role = 'approver' WHERE email = 'aprovador@email.com';

-- Promover a kennel (dono de canil):
UPDATE public.profiles SET role = 'kennel' WHERE email = 'criador@email.com';

-- Listar todos os usuários e roles:
SELECT id, email, full_name, role, created_at FROM public.profiles ORDER BY created_at DESC;
```

Rotas protegidas:
- `/admin/aprovar` → `approver` ou `super_admin`
- `/admin/financeiro` → `super_admin` apenas
- `/painel/*` → `kennel` apenas
