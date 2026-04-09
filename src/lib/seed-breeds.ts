// @ts-nocheck
// ============================================================
// Script de seed — insere raças na tabela breeds do Supabase.
// NÃO faz parte do bundle do Next.js.
//
// Como executar:
//   npx tsx src/lib/seed-breeds.ts
//
// Requer as variáveis de ambiente:
//   NEXT_PUBLIC_SUPABASE_URL   — URL do projeto Supabase
//   SUPABASE_SERVICE_ROLE_KEY  — chave service_role (não a anon key)
//
// Carrega automaticamente de .env.local se existir.
// Alternativamente: SUPABASE_SERVICE_ROLE_KEY=xxx npx tsx src/lib/seed-breeds.ts
// ============================================================

// Carrega .env.local se disponível
try {
  require("dotenv").config({ path: ".env.local" });
} catch {
  // dotenv não disponível — use variáveis de ambiente do sistema
}

import { createClient } from "@supabase/supabase-js";
import { breedsData } from "./breeds-seed";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error(
    "❌ Variáveis ausentes: NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórias."
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false },
});

async function main() {
  console.log(`🐾 Inserindo ${breedsData.length} raças no Supabase...`);

  const { data, error } = await supabase
    .from("breeds")
    .upsert(breedsData, { onConflict: "name_en" })
    .select("name_pt");

  if (error) {
    console.error("❌ Erro ao inserir raças:", error.message);
    process.exit(1);
  }

  console.log(`✅ ${data?.length ?? 0} raças inseridas/atualizadas com sucesso!`);
  console.log(data?.map((b) => b.name_pt).join(", "));
}

main().catch((err) => {
  console.error("❌ Erro inesperado:", err);
  process.exit(1);
});
