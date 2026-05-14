import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { createClient } from "@/lib/supabase/server";
import { uploadFile } from "@/lib/r2";
import { compressImage } from "@/lib/image-utils";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  if (
    !process.env.R2_ACCOUNT_ID ||
    !process.env.R2_ACCESS_KEY_ID ||
    !process.env.R2_SECRET_ACCESS_KEY ||
    !process.env.R2_BUCKET_NAME ||
    !process.env.R2_PUBLIC_URL
  ) {
    return NextResponse.json({ error: "Upload não configurado" }, { status: 503 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Requisição inválida" }, { status: 400 });
  }

  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: "Tipo não permitido. Use JPEG, PNG ou WebP." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const rand = randomBytes(6).toString("hex");
  const ts = Date.now();

  try {
    const compressed = await compressImage(buffer, "post").catch(() => buffer);
    const key = `posts/preview/${user.id}/${ts}-${rand}.webp`;
    const url = await uploadFile(compressed, key, "image/webp");

    const thumb = await compressImage(buffer, "thumbnail").catch(() => buffer);
    const thumbKey = `posts/preview/${user.id}/${ts}-${rand}-thumb.webp`;
    const thumbnailUrl = await uploadFile(thumb, thumbKey, "image/webp");

    return NextResponse.json({ url, thumbnailUrl, key, thumbKey });
  } catch {
    return NextResponse.json({ error: "Falha ao enviar foto. Tente novamente." }, { status: 502 });
  }
}
