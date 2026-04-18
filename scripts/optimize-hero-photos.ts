// @ts-nocheck
import { readFileSync } from "node:fs";
try {
  const raw = readFileSync(".env.local", "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^([^#=\s][^=]*)=(.*)$/);
    if (m) process.env[m[1].trim()] ??= m[2].trim();
  }
} catch { /* .env.local não encontrado */ }

import { readdirSync, statSync, writeFileSync } from "node:fs";
import { join, basename, extname } from "node:path";
import sharp from "sharp";

const INPUT_DIR = "public/canil-good-leisure";
const MAX_WIDTH = 1600;
const QUALITY = 82;

function formatBytes(bytes: number): string {
  return (bytes / 1024).toFixed(1) + " KB";
}

async function main() {
  const files = readdirSync(INPUT_DIR).filter((f) =>
    [".jpeg", ".jpg"].includes(extname(f).toLowerCase())
  );

  if (files.length === 0) {
    console.log("❌  Nenhum .jpeg encontrado em", INPUT_DIR);
    process.exit(1);
  }

  console.log(`🖼️   Otimizando ${files.length} foto(s)...\n`);

  for (const file of files) {
    const inputPath = join(INPUT_DIR, file);
    const outputName = basename(file, extname(file)) + ".webp";
    const outputPath = join(INPUT_DIR, outputName);

    const beforeBytes = statSync(inputPath).size;

    await sharp(inputPath)
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(outputPath);

    const afterBytes = statSync(outputPath).size;
    const ratio = ((1 - afterBytes / beforeBytes) * 100).toFixed(1);

    console.log(`✅  ${file}`);
    console.log(`    .jpeg → ${formatBytes(beforeBytes)}`);
    console.log(`    .webp → ${formatBytes(afterBytes)}  (−${ratio}%)\n`);
  }

  console.log("✨  Concluído. Os .jpeg originais foram mantidos como fallback.");
}

main().catch((err) => {
  console.error("❌  Erro:", err);
  process.exit(1);
});
