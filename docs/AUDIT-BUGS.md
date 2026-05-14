# Auditoria de Bugs — Fareja
**Data:** 2026-04-15  
**Build:** ✅ Passa (exit 0, zero erros de TS)  
**Arquivos auditados:** 61 (src/app, src/components, src/lib, middleware.ts)

---

## Resumo executivo

| Severidade | Qtd |
|---|---|
| CRÍTICO | 5 |
| ALTO | 7 |
| MÉDIO | 7 |
| BAIXO | 8 |
| **Total** | **27** |

---

## 🔴 CRÍTICO

### BUG-01 — Admin panel inteiramente mockado (não persiste nada)
- **Arquivo:** `src/app/admin/aprovar/page.tsx` (linhas 16–60)
- **Problema:** `pendingKennels` e `approvedKennels` são arrays hardcoded no código. As ações "Aprovar" e "Rejeitar" só atualizam `actionLog` em memória local — nenhuma escrita no Supabase. Fechar a aba apaga tudo. Qualquer aprovação feita aqui não tem efeito real no banco.
- **Correção:** Buscar `kennels` com `status = 'pending'` e `status = 'approved'` do Supabase. Ações devem chamar `supabase.from("kennels").update({ status: "approved" | "rejected" })`.

---

### BUG-02 — Painel de Filhotes não persiste dados
- **Arquivo:** `src/app/painel/filhotes/page.tsx` (linhas 6–11, 47–56)
- **Problema:** `initialPuppies` são dados hardcoded. O CRUD (adicionar, editar, deletar filhotes) opera apenas no estado React local. Nenhuma leitura ou escrita no Supabase. Um refresh da página descarta todas as alterações.
- **Correção:** Buscar filhotes da tabela `puppies` via Supabase filtrando pelo canil do usuário logado. Ações de CRUD devem fazer `insert/update/delete` na tabela.

---

### BUG-03 — Dashboard do Criador exibe dados falsos
- **Arquivo:** `src/app/painel/page.tsx` (linhas 13–25)
- **Problema:** `kennelStats` (filhotes disponíveis, avaliação, visitas, mensagens) e `recentActivity` são constantes hardcoded. O criador sempre vê "★ 5.0", "1.284 visitas", etc., independente da realidade.
- **Correção:** Buscar stats reais do Supabase: contagem de filhotes `available`, `fareja_rating` do canil, notificações reais.

---

### BUG-04 — SQL injection em `admin-setup.ts`
- **Arquivo:** `src/lib/admin-setup.ts` (linha 35)
- **Problema:** `getRoleUpdateSQL(email, role)` constrói SQL por interpolação de string: `WHERE email = '${email}'`. Se chamado com email malicioso (ex: `' OR '1'='1`), gera SQL inválido ou perigoso.
- **Agravante:** A função retorna a string e a documentação sugere "cole no SQL Editor", mas nada impede que seja chamada programaticamente.
- **Correção:** Usar parâmetros posicionais (`$1`, `$2`) ou remover a função — toda mudança de role deve ir pelo `supabase.rpc()` com parâmetros, nunca por interpolação.

---

### BUG-05 — Upload falha silenciosamente se compressão lança exceção
- **Arquivo:** `src/app/api/upload/route.ts` (linhas 68–76)
- **Problema:** `compressImage()` é chamado duas vezes sem try-catch. Se a biblioteca Sharp encontrar um arquivo corrompido ou formato inesperado, a exceção vai subir não tratada, causando um Internal Server Error 500 sem mensagem útil para o client.
- **Correção:** Envolver o bloco `isImage` em try-catch e retornar `{ error: "Falha ao processar imagem" }` com status 422.

---

## 🟠 ALTO

### BUG-06 — Links mortos no nav do Admin (páginas inexistentes)
- **Arquivo:** `src/app/admin/aprovar/page.tsx` (linhas 72–76)
- **Problema:** O `AdminNav` exibe links para `/admin/usuarios`, `/admin/configuracoes` (super_admin) e `/admin/mensagens` (approver). Nenhuma dessas rotas existe no `src/app/`. Clicar em qualquer um deles resulta em 404.
- **Correção:** Criar as páginas ou, temporariamente, desabilitar os links com `cursor-not-allowed` e tooltip "Em breve".

---

### BUG-07 — Link "Postar no feed" no painel aponta para rota inexistente
- **Arquivo:** `src/app/painel/page.tsx` (linha 67)
- **Problema:** O botão de ação rápida "Postar no feed" linka para `/painel/comunidade`, rota que não existe no App Router. Resulta em 404.
- **Correção:** Corrigir para `/comunidade/feed/novo`.

---

### BUG-08 — URL errada para perfil público do canil
- **Arquivo:** `src/app/painel/perfil/page.tsx` (linha 453)
- **Problema:** O link "Ver página pública" aponta para `/canils/${kennel.slug}`. A rota correta é `/canis/${kennel.id}` (sem "l" no final, e usando `id` não `slug`). O link está quebrado para todos os kennels.
- **Correção:** Mudar para `href={\`/canis/${kennel.id}\`}`.

---

### BUG-09 — Limite diário de posts pode ser bypassado silenciosamente
- **Arquivo:** `src/app/api/posts/route.ts` (linhas 86–92)
- **Problema:** A query de contagem de posts diários não verifica se retornou erro. Se a query falhar, `count` é `undefined`, `(count ?? 0) >= limit` avalia como `false`, e o post é criado mesmo que o limite já tenha sido atingido.
- **Correção:** Verificar `if (countError) return NextResponse.json({ error: "Erro ao verificar limite" }, { status: 500 })`.

---

### BUG-10 — Modo "pet_status" na tela de login é código morto (nunca ativado)
- **Arquivo:** `src/app/(auth)/login/page.tsx` (linhas 114–179)
- **Problema:** Existe toda uma UI para o usuário selecionar `pet_status` após o login, mas `setMode("pet_status")` nunca é chamado em nenhum lugar do código. O fluxo de auth callback apenas redireciona para `/` ou `next`. O usuário nunca vê essa tela — a feature está implementada mas desconectada.
- **Correção:** No auth callback (ou via `onAuthStateChange`), detectar se é o primeiro login e redirecionar para `/login?onboarding=1`, e na página de login, verificar esse parâmetro para setar o modo.

---

### BUG-11 — Páginas /termos e /privacidade linkadas mas não existem
- **Arquivo:** `src/app/(auth)/login/page.tsx` (linhas 282–284)
- **Problema:** O rodapé da tela de login linka para `/termos` (Termos de Uso) e `/privacidade` (Política de Privacidade). O build não inclui essas rotas — clicar resulta em 404. Isso pode ser problemático do ponto de vista legal (LGPD).
- **Correção:** Criar as páginas com o conteúdo adequado antes do lançamento.

---

### BUG-12 — `handlePetStatus` ignora erro ao salvar `pet_status`
- **Arquivo:** `src/app/(auth)/login/page.tsx` (linhas 54–64)
- **Problema:** `await supabase.from("profiles").update(...)` é chamado mas o resultado `{ error }` é descartado. Se a escrita falhar (permissão RLS, rede, etc.), o usuário é redirecionado para `/` mas o campo `pet_status` nunca é salvo no banco.
- **Correção:** Desestruturar `{ error }` e tratar: `if (error) { setError("Erro ao salvar preferência."); return; }`.

---

## 🟡 MÉDIO

### BUG-13 — Middleware usando convenção depreciada (`middleware` → `proxy`)
- **Arquivo:** `src/middleware.ts` (linha 1)
- **Build warning:** `⚠ The "middleware" file convention is deprecated. Please use "proxy" instead.`
- **Problema:** O arquivo `src/middleware.ts` usa a convenção antiga do Next.js 16. Funcionará por enquanto, mas quebrará em versão futura.
- **Correção:** Renomear para `src/proxy.ts` e verificar se a API de `createServerClient` ainda funciona da mesma forma.

---

### BUG-14 — R2 client inicializado no nível de módulo sem verificação de env vars
- **Arquivo:** `src/lib/r2.ts` (linhas 3–10)
- **Problema:** `new S3Client(...)` é instanciado na importação do módulo com `process.env.R2_ACCOUNT_ID!` etc. Se qualquer env var estiver ausente em produção, a importação falha em runtime e todas as rotas que importam `r2.ts` retornam 500.
- **Correção:** Inicializar o cliente dentro das funções `uploadFile`/`deleteFile` ou verificar as env vars na inicialização com mensagem de erro clara.

---

### BUG-15 — Incremento de views do tópico não verifica erro
- **Arquivo:** `src/app/api/forum/topics/[id]/route.ts` (ver linhas de incremento de views)
- **Problema:** A operação de incremento de `views_count` é fire-and-forget (`.then(() => {})`). Erros são silenciados. Em sistemas de alta escala, o contador de views fica corrompido sem alertas.
- **Correção:** Ao menos logar o erro: `.then(({ error }) => { if (error) console.error("views increment failed:", error); })`.

---

### BUG-16 — Componente `BreedImage` consulta API externa sem timeout
- **Arquivo:** `src/components/BreedImage.tsx` (fetch para dog.ceo API)
- **Problema:** O fetch para a API `dog.ceo` não tem timeout. Se a API externa estiver lenta, o componente fica em estado de loading indefinidamente, travando a interface para o usuário.
- **Correção:** Usar `AbortController` com timeout de 5s: `const controller = new AbortController(); setTimeout(() => controller.abort(), 5000);`.

---

### BUG-17 — Segurança de roles depende exclusivamente de verificação client-side nas páginas admin
- **Arquivo:** `src/app/admin/aprovar/page.tsx` (linha 121), `src/app/admin/financeiro/page.tsx` (linha 82)
- **Problema:** A proteção das páginas admin é feita pelo hook `useRole()` no client. Como as páginas são marcadas como `○ (Static)` no build (SSG), elas são pré-renderizadas e entregues a qualquer um. A proteção só é aplicada após a hidratação do React. Um usuário malicioso pode ver o HTML da página por um breve momento ou desabilitar JS.
- **Agravante:** As ações admin (aprovar/rejeitar) são também apenas client-side (BUG-01), então não há API protegida a atacar — mas quando forem migradas para real, precisarão de proteção server-side também.
- **Correção:** Converter para Server Components e verificar o role via `supabase.auth.getUser()` no servidor antes de renderizar.

---

### BUG-18 — Painel do cliente acessível para usuário kennel sem redirecionamento
- **Arquivo:** `src/app/painel/layout.tsx` (linha 71)
- **Problema:** Quando `isKennel = true`, o painel mostra o nav de kennel (`kennelNavItems`). Mas quando `isKennel = false` (i.e., o usuário é client), o layout mostra `clientNavItems`. Não há verificação de outros roles (`approver`, `super_admin`) — eles verão o dashboard de client (não o de kennel), o que pode ser confuso.
- **Correção:** Adicionar verificação para `isApprover` e `isAdmin`, direcionando-os para o painel apropriado.

---

## 🔵 BAIXO

### BUG-19 — Race condition nos contadores de likes
- **Arquivos:** `src/app/api/posts/[id]/like/route.ts`, `src/app/api/forum/topics/[id]/like/route.ts`, `src/app/api/forum/replies/[id]/like/route.ts`
- **Problema:** O padrão é: (1) buscar `likes_count` atual, (2) incrementar/decrementar, (3) escrever de volta. Duas requisições simultâneas podem ler o mesmo valor e resultar em undercount ou overcount.
- **Correção:** Usar incremento atômico com RPC Supabase ou `UPDATE ... SET likes_count = likes_count + 1`.

---

### BUG-20 — PostCard não trata erros de like/delete
- **Arquivo:** `src/components/community/PostCard.tsx` (fetches de like e delete)
- **Problema:** As chamadas `fetch` para curtir ou deletar posts não verificam `res.ok`. Se a API retornar erro 401/500, a UI atualiza o estado visual como se a ação tivesse funcionado (like ativado, post removido), mas o banco não reflete isso.
- **Correção:** Checar `if (!res.ok)` e reverter o estado otimista se falhar.

---

### BUG-21 — Formato de resposta de erro inconsistente nas APIs
- **Arquivos:** Múltiplos em `src/app/api/`
- **Problema:** Alguns endpoints retornam `{ error: string }`, outros `{ message: string }`. Sem contrato consistente, o client precisa verificar os dois campos em cada chamada.
- **Correção:** Padronizar para `{ error: string }` em todas as respostas de erro.

---

### BUG-22 — URL do Instagram hardcoded
- **Arquivos:** `src/app/page.tsx`, `src/app/comunidade/page.tsx`
- **Problema:** `https://instagram.com/fareja` está escrito diretamente no código. Se o handle mudar, requer deploy.
- **Correção:** Mover para `NEXT_PUBLIC_INSTAGRAM_URL` no `.env`.

---

### BUG-23 — `useFavorites` falha silenciosamente
- **Arquivo:** `src/lib/hooks/useFavorites.ts`
- **Problema:** Se a query de favoritos falhar, o hook simplesmente não preenche o array de favoritos — o usuário vê seus favoritos como vazios sem qualquer mensagem de erro ou retry.
- **Correção:** Adicionar estado de erro e exibir mensagem contextual.

---

### BUG-24 — `window.location.origin` pode ser undefined durante SSR
- **Arquivo:** `src/app/(auth)/login/page.tsx` (linha 21)
- **Problema:** `typeof window !== "undefined" ? window.location.origin : ""` — o fallback para string vazia significa que em SSR (ou se window ainda não existir), o `callbackUrl` seria `"/auth/callback"` (relativo), o que pode causar problemas dependendo do provider OAuth.
- **Correção:** Usar `process.env.NEXT_PUBLIC_SITE_URL` como fallback confiável: `const callbackUrl = \`${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/auth/callback\``.

---

### BUG-25 — Raças no select de Filhotes são hardcoded
- **Arquivo:** `src/app/painel/filhotes/page.tsx` (linhas 105–109)
- **Problema:** O select de raça tem apenas "Golden Retriever" e "Beagle". Um criador de Rottweiler não consegue nem digitar a raça correta.
- **Correção:** Buscar raças da tabela `breeds` do Supabase (como outras páginas fazem via `src/lib/queries/breeds.ts`).

---

### BUG-26 — Financeiro exibe dados hardcoded também
- **Arquivo:** `src/app/admin/financeiro/page.tsx` (linhas 12–28)
- **Problema:** `monthlyRevenue` e `payments` são arrays hardcoded. A página de financeiro não reflete dados reais de assinaturas.
- **Correção:** Integrar com tabela de pagamentos/assinaturas do Supabase (ou provedor de pagamentos como Stripe).

---

### BUG-27 — `admin-setup.ts` importado mas sem uso real na aplicação
- **Arquivo:** `src/lib/admin-setup.ts`
- **Problema:** O arquivo exporta `getRoleUpdateSQL` e `getListUsersSQL`, mas nenhum componente ou página importa essas funções. É dead code — existe apenas como documentação de SQL.
- **Correção:** Se for apenas documentação, mover o conteúdo para um `.md` e remover o `.ts`. Isso elimina também o risco de BUG-04.

---

## Build output

```
▲ Next.js 16.2.2 (Turbopack)

⚠ The "middleware" file convention is deprecated. Please use "proxy" instead.
  → https://nextjs.org/docs/messages/middleware-to-proxy

✓ Compiled successfully in 4.7s
✓ TypeScript: sem erros nos arquivos de src/
✓ 30 páginas geradas com sucesso
```

**TypeScript:** 3 erros em `.next/types/validator.ts` para páginas `/privacidade`, `/suporte` e `/termos` — que são referenciadas pelo Next.js type system mas não existem como arquivos (confirma BUG-11).

---

## Análise de segurança de roles

| Pergunta | Resposta |
|---|---|
| O role vem de onde? | Tabela `profiles` no Supabase, lida via `useRole()` client-side |
| APIs verificam role server-side? | Parcialmente — `api/posts`, `api/upload` verificam autenticação; mas não verificam role além de "logado" |
| É possível manipular o role client-side? | Não diretamente — o role é lido do banco, não armazenado em cookie manipulável. Mas RLS do Supabase precisa estar configurado para impedir que o usuário atualize seu próprio `role` |
| Rotas admin têm proteção server-side? | Não — apenas client-side via `useRole()` (ver BUG-17) |

---

## Prioridade de correção sugerida

1. **BUG-01** → Admin panel mockado (bloqueia operação real)
2. **BUG-02** → Filhotes não persistem (bloqueia uso real)
3. **BUG-08** → URL errada no perfil (link quebrado para todos os kennels)
4. **BUG-07** → Link morto "Postar no feed"
5. **BUG-06** → Links mortos no nav admin
6. **BUG-11** → Páginas /termos e /privacidade (risco legal LGPD)
7. **BUG-09** → Bypass de limite de posts
8. **BUG-05** → Upload pode crashar
9. **BUG-13** → Middleware depreciado
10. **BUG-04** → SQL injection em admin-setup.ts
