// @ts-nocheck
// ============================================================
// Script: fetch-breed-images.ts
//
// Busca fotos na The Dog API para cada raça no Supabase e
// atualiza image_url + image_source='dog_api'.
//
// Pré-requisitos:
//   NEXT_PUBLIC_SUPABASE_URL=...
//   SUPABASE_SERVICE_ROLE_KEY=...
//   DOG_API_KEY=...   (opcional — sem chave o rate limit é menor)
//
// Uso:
//   npx tsx scripts/fetch-breed-images.ts
// ============================================================

try { require("dotenv").config({ path: ".env.local" }); } catch {}

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const DOG_API_KEY  = process.env.DOG_API_KEY ?? "";
const DOG_API_BASE = "https://api.thedogapi.com/v1";

// Raças reservadas para fornecimento manual pelo Canil Good Leisure
const KENNEL_PROVIDED = new Set(["Golden Retriever", "Beagle"]);

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("❌  NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórias.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
});

// ----------------------------------------------------------
// Busca lista completa de raças na The Dog API (com paginação)
// ----------------------------------------------------------
async function fetchDogApiBreeds(): Promise<{ id: number; name: string }[]> {
  const headers: Record<string, string> = DOG_API_KEY
    ? { "x-api-key": DOG_API_KEY }
    : {};

  let page = 0;
  const limit = 100;
  const all: { id: number; name: string }[] = [];

  while (true) {
    const url = `${DOG_API_BASE}/breeds?limit=${limit}&page=${page}`;
    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error(`Dog API breeds erro ${res.status}: ${await res.text()}`);
    const data = await res.json();
    if (!data.length) break;
    all.push(...data.map((b: any) => ({ id: b.id, name: b.name })));
    if (data.length < limit) break;
    page++;
  }

  return all;
}

// ----------------------------------------------------------
// Busca URL de imagem para um breed_id da Dog API
// ----------------------------------------------------------
async function fetchImageForBreed(breedId: number): Promise<string | null> {
  const headers: Record<string, string> = DOG_API_KEY
    ? { "x-api-key": DOG_API_KEY }
    : {};

  const url = `${DOG_API_BASE}/images/search?breed_ids=${breedId}&limit=1`;
  const res = await fetch(url, { headers });
  if (!res.ok) return null;
  const data = await res.json();
  return data?.[0]?.url ?? null;
}

// ----------------------------------------------------------
// Normaliza nome para comparação fuzzy
// ----------------------------------------------------------
function normalize(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// ----------------------------------------------------------
// Tenta encontrar a raça do Supabase na lista da Dog API
// ----------------------------------------------------------
function matchBreed(
  nameEn: string,
  dogApiBreeds: { id: number; name: string }[]
): { id: number; name: string } | null {
  const target = normalize(nameEn);

  // Exact match
  let match = dogApiBreeds.find((b) => normalize(b.name) === target);
  if (match) return match;

  // Partial: Dog API name contains our name or vice-versa
  match = dogApiBreeds.find(
    (b) =>
      normalize(b.name).includes(target) ||
      target.includes(normalize(b.name))
  );
  return match ?? null;
}

// ----------------------------------------------------------
// Main
// ----------------------------------------------------------
async function main() {
  console.log("🐶  Carregando raças do Supabase...");

  const { data: breeds, error: dbErr } = await supabase
    .from("breeds")
    .select("id, name_en, name_pt, image_source")
    .order("name_en");

  if (dbErr) {
    console.error("❌  Supabase error:", dbErr.message);
    process.exit(1);
  }

  console.log(`   ${breeds!.length} raças encontradas.`);
  console.log("\n🔍  Carregando raças da The Dog API...");

  const dogApiBreeds = await fetchDogApiBreeds();
  console.log(`   ${dogApiBreeds.length} raças disponíveis na Dog API.\n`);

  const noMatch: string[] = [];
  let updated = 0;
  let skipped = 0;

  for (const breed of breeds!) {
    // Não sobrescreve curated nem kennel_provided
    if (breed.image_source === "curated" || breed.image_source === "kennel_provided") {
      console.log(`⏭️   ${breed.name_pt} [${breed.image_source}] — ignorado`);
      skipped++;
      continue;
    }

    // Reservados para canil parceiro
    if (KENNEL_PROVIDED.has(breed.name_en)) {
      console.log(`🏷️   ${breed.name_pt} — reservado para kennel_provided, pulando`);
      skipped++;
      continue;
    }

    const apiBreed = matchBreed(breed.name_en, dogApiBreeds);

    if (!apiBreed) {
      noMatch.push(`${breed.name_pt} (${breed.name_en})`);
      continue;
    }

    const imageUrl = await fetchImageForBreed(apiBreed.id);

    if (!imageUrl) {
      noMatch.push(`${breed.name_pt} (${breed.name_en}) — match encontrado mas sem imagem`);
      continue;
    }

    const { error: updateErr } = await supabase
      .from("breeds")
      .update({ image_url: imageUrl, image_source: "dog_api" })
      .eq("id", breed.id);

    if (updateErr) {
      console.error(`❌  Erro ao atualizar ${breed.name_pt}:`, updateErr.message);
    } else {
      console.log(`✅  ${breed.name_pt} → ${imageUrl.slice(0, 60)}...`);
      updated++;
    }

    // Respeita rate limit da Dog API (sem chave: ~10 req/min)
    await new Promise((r) => setTimeout(r, DOG_API_KEY ? 120 : 700));
  }

  console.log("\n" + "─".repeat(60));
  console.log(`✅  Atualizadas : ${updated}`);
  console.log(`⏭️   Ignoradas   : ${skipped}`);
  console.log(`❌  Sem match   : ${noMatch.length}`);

  if (noMatch.length > 0) {
    console.log("\n📋  Raças sem imagem — preencher manualmente:");
    noMatch.forEach((n) => console.log(`   • ${n}`));
  }
}

main().catch((err) => {
  console.error("❌  Erro inesperado:", err);
  process.exit(1);
});
