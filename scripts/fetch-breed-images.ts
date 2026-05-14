// @ts-nocheck
// ============================================================
// Script: fetch-breed-images.ts
//
// Busca fotos na The Dog API, baixa e sobe pro R2, salvando a
// URL pública do R2 em breeds.image_url (sem hotlink externo).
//
// Pré-requisitos (.env.local):
//   NEXT_PUBLIC_SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY
//   R2_ACCOUNT_ID
//   R2_ACCESS_KEY_ID
//   R2_SECRET_ACCESS_KEY
//   R2_BUCKET_NAME
//   R2_PUBLIC_URL
//   DOG_API_KEY  (opcional — sem chave o rate limit é menor)
//
// Uso:
//   npx tsx scripts/fetch-breed-images.ts
// ============================================================

import { readFileSync } from "node:fs";
try {
  const raw = readFileSync(".env.local", "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^([^#=\s][^=]*)=(.*)$/);
    if (m) process.env[m[1].trim()] ??= m[2].trim();
  }
} catch { /* .env.local não encontrado */ }

import { createClient } from "@supabase/supabase-js";
import { S3Client, PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";

const SUPABASE_URL   = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY    = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const DOG_API_KEY    = process.env.DOG_API_KEY ?? "";
const R2_ACCOUNT_ID  = process.env.R2_ACCOUNT_ID!;
const R2_ACCESS_KEY  = process.env.R2_ACCESS_KEY_ID!;
const R2_SECRET      = process.env.R2_SECRET_ACCESS_KEY!;
const R2_BUCKET      = process.env.R2_BUCKET_NAME!;
const R2_PUBLIC_URL  = (process.env.R2_PUBLIC_URL ?? "").replace(/\/$/, "");
const DOG_API_BASE   = "https://api.thedogapi.com/v1";

// Raças reservadas para fornecimento manual pelo Canil Good Leisure
const KENNEL_PROVIDED = new Set(["Golden Retriever", "Beagle"]);

// Mapa de tradução pt→Dog API consultado ANTES do fuzzy match
const BREED_NAME_MAP: Record<string, string> = {
  "Chihuahua":               "Chihuahueño",
  "Dachshund (Teckel)":      "Dachshund",
  "Shar Pei":                "Chinese Shar-Pei",
  "Jack Russell Terrier":    "Parson Russell Terrier",
  "Poodle Standard":         "Standard Poodle",
  "Collie (Rough)":          "Collie",
  "Flat-Coated Retriever":   "Flat-Coated Retriever",
  "Mastiff Inglês":          "Mastiff",
  "Mastim Napolitano":       "Neapolitan Mastiff",
  "Cão de Água Português":   "Portuguese Water Dog",
};

const missing = [
  ["NEXT_PUBLIC_SUPABASE_URL", SUPABASE_URL],
  ["SUPABASE_SERVICE_ROLE_KEY", SERVICE_KEY],
  ["R2_ACCOUNT_ID", R2_ACCOUNT_ID],
  ["R2_ACCESS_KEY_ID", R2_ACCESS_KEY],
  ["R2_SECRET_ACCESS_KEY", R2_SECRET],
  ["R2_BUCKET_NAME", R2_BUCKET],
  ["R2_PUBLIC_URL", R2_PUBLIC_URL],
].filter(([, v]) => !v).map(([k]) => k);

if (missing.length) {
  console.error("❌  Variáveis ausentes:", missing.join(", "));
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
});

function getR2Client(): S3Client {
  return new S3Client({
    region: "auto",
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId: R2_ACCESS_KEY, secretAccessKey: R2_SECRET },
  });
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// ----------------------------------------------------------
// Busca lista completa de raças na The Dog API (com paginação)
// ----------------------------------------------------------
async function fetchDogApiBreeds(): Promise<{ id: number; name: string }[]> {
  const headers: Record<string, string> = DOG_API_KEY ? { "x-api-key": DOG_API_KEY } : {};
  let page = 0;
  const all: { id: number; name: string }[] = [];

  while (true) {
    const res = await fetch(`${DOG_API_BASE}/breeds?limit=100&page=${page}`, { headers });
    if (!res.ok) throw new Error(`Dog API breeds erro ${res.status}: ${await res.text()}`);
    const data = await res.json();
    if (!data.length) break;
    all.push(...data.map((b: any) => ({ id: b.id, name: b.name })));
    if (data.length < 100) break;
    page++;
  }

  return all;
}

// ----------------------------------------------------------
// Busca URL de imagem para um breed_id da Dog API
// ----------------------------------------------------------
async function fetchImageUrlForBreed(breedId: number): Promise<string | null> {
  const headers: Record<string, string> = DOG_API_KEY ? { "x-api-key": DOG_API_KEY } : {};
  const res = await fetch(`${DOG_API_BASE}/images/search?breed_ids=${breedId}&limit=1`, { headers });
  if (!res.ok) return null;
  const data = await res.json();
  return data?.[0]?.url ?? null;
}

// ----------------------------------------------------------
// Normaliza nome para comparação fuzzy
// ----------------------------------------------------------
function normalize(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").trim();
}

function matchBreed(
  nameEn: string,
  dogApiBreeds: { id: number; name: string }[]
): { id: number; name: string } | null {
  const target = normalize(nameEn);
  return (
    dogApiBreeds.find((b) => normalize(b.name) === target) ??
    dogApiBreeds.find(
      (b) => normalize(b.name).includes(target) || target.includes(normalize(b.name))
    ) ??
    null
  );
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

  if (dbErr) { console.error("❌  Supabase error:", dbErr.message); process.exit(1); }
  console.log(`   ${breeds!.length} raças encontradas.`);

  console.log("\n🔍  Carregando raças da The Dog API...");
  const dogApiBreeds = await fetchDogApiBreeds();
  console.log(`   ${dogApiBreeds.length} raças disponíveis na Dog API.\n`);

  const r2 = getR2Client();
  const noMatch: string[] = [];
  let matched = 0;
  let uploaded = 0;
  let skipped = 0;

  for (const breed of breeds!) {
    // Não sobrescreve curated nem kennel_provided
    if (breed.image_source === "curated" || breed.image_source === "kennel_provided") {
      console.log(`⏭️   ${breed.name_pt} [${breed.image_source}] — ignorado`);
      skipped++;
      continue;
    }

    // Já processado em run anterior
    if (breed.image_source === "dog_api") {
      console.log(`⏭️   ${breed.name_pt} [dog_api] — já tem imagem`);
      skipped++;
      continue;
    }

    // Reservados para canil parceiro
    if (KENNEL_PROVIDED.has(breed.name_en)) {
      console.log(`🏷️   ${breed.name_pt} — reservado para kennel_provided, pulando`);
      skipped++;
      continue;
    }

    // Consulta mapa pt→en antes do fuzzy (tenta name_pt e name_en como chave)
    const mappedName = BREED_NAME_MAP[breed.name_pt] ?? BREED_NAME_MAP[breed.name_en];
    let apiBreed: { id: number; name: string } | null = null;

    if (mappedName) {
      const targetNorm = normalize(mappedName);
      apiBreed = dogApiBreeds.find((b) => normalize(b.name) === targetNorm) ?? null;
      if (apiBreed) {
        console.log(`   ✓ ${breed.name_pt} → matched via pt_en_map (${mappedName})`);
      } else {
        console.warn(`   ⚠️  pt_en_map hit (${mappedName}) mas sem match exato — tentando fuzzy`);
        apiBreed = matchBreed(breed.name_en, dogApiBreeds);
      }
    } else {
      apiBreed = matchBreed(breed.name_en, dogApiBreeds);
    }

    if (!apiBreed) {
      noMatch.push(`${breed.name_pt} (${breed.name_en})`);
      continue;
    }

    const dogApiUrl = await fetchImageUrlForBreed(apiBreed.id);
    if (!dogApiUrl) {
      noMatch.push(`${breed.name_pt} (${breed.name_en}) — match encontrado mas sem imagem`);
      continue;
    }

    matched++;

    // Download — Content-Type do header é a fonte de verdade
    let imgBuffer: Buffer;
    let ext: string;
    let normalizedContentType: string;

    try {
      const imgRes = await fetch(dogApiUrl);
      if (!imgRes.ok) throw new Error(`HTTP ${imgRes.status}`);
      const rawContentType = imgRes.headers.get("content-type") ?? "";
      ext = rawContentType.includes("png") ? "png"
          : rawContentType.includes("webp") ? "webp"
          : rawContentType.includes("jpeg") || rawContentType.includes("jpg") ? "jpg"
          : "jpg"; // fallback para CDN mal configurado (octet-stream, gif, etc.)
      // Garante que extensão e Content-Type do R2 sempre batem
      normalizedContentType = ext === "png" ? "image/png"
                            : ext === "webp" ? "image/webp"
                            : "image/jpeg";
      imgBuffer = Buffer.from(await imgRes.arrayBuffer());
    } catch (e) {
      console.error(`❌  Download falhou para ${breed.name_pt}:`, e);
      noMatch.push(`${breed.name_pt} — download failed`);
      continue;
    }

    const key = `breeds/${slugify(breed.name_en)}.${ext}`;

    // Verifica se já existe no R2 (idempotência para re-runs)
    try {
      await r2.send(new HeadObjectCommand({ Bucket: R2_BUCKET, Key: key }));
      console.log(`⚠️   overwriting ${key}`);
    } catch { /* não existe — primeira vez */ }

    // Upload para R2
    try {
      await r2.send(new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: key,
        Body: imgBuffer,
        ContentType: normalizedContentType,
      }));
    } catch (e) {
      console.error(`❌  R2 upload falhou para ${breed.name_pt}:`, e);
      noMatch.push(`${breed.name_pt} — r2 upload failed`);
      continue;
    }

    const r2Url = `${R2_PUBLIC_URL}/${key}`;

    // Atualiza Supabase
    const { error: updateErr } = await supabase
      .from("breeds")
      .update({ image_url: r2Url, image_source: "dog_api" })
      .eq("id", breed.id);

    if (updateErr) {
      console.error(`❌  Supabase update falhou para ${breed.name_pt}:`, updateErr.message);
      noMatch.push(`${breed.name_pt} — supabase update failed`);
      continue;
    }

    console.log(`✅  ${breed.name_pt} → ${key}`);
    uploaded++;

    // Rate limit: 120ms com API key, 700ms sem
    await new Promise((r) => setTimeout(r, DOG_API_KEY ? 120 : 700));
  }

  console.log("\n" + "─".repeat(60));
  console.log(`🔍  Matched Dog API : ${matched}`);
  console.log(`☁️   Uploaded R2     : ${uploaded}`);
  console.log(`⏭️   Ignoradas       : ${skipped}`);
  console.log(`❌  Sem match/erro  : ${noMatch.length}`);

  if (noMatch.length > 0) {
    console.log("\n📋  Raças sem imagem — preencher manualmente:");
    noMatch.forEach((n) => console.log(`   • ${n}`));
  }
}

main().catch((err) => {
  console.error("❌  Erro inesperado:", err);
  process.exit(1);
});
