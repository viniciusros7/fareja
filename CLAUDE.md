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
