# 🐾 Fareja – Canis Verificados do Brasil

A primeira plataforma brasileira de canis verificados com procedência comprovada.

## Stack

- **Frontend:** Next.js 15 (App Router) + TypeScript + Tailwind CSS
- **Backend/DB:** Supabase (PostgreSQL + Auth + Storage)
- **Icons:** Lucide React
- **Deploy:** Vercel

## Começando

```bash
npm install
cp .env.local.example .env.local
# Preencha com credenciais do Supabase
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Estrutura

```
src/
  app/           # Páginas (landing, buscar, canil, comunidade, login, para-criadores)
  components/    # Componentes reutilizáveis
  lib/           # Supabase clients + mock data
  types/         # Tipos TypeScript
supabase/
  schema.sql     # Schema completo do banco
```

## Licença

Proprietário – Fareja © 2026
