import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { createClient } from "@/lib/supabase/server";
import { uploadFile } from "@/lib/r2";
import { compressImage } from "@/lib/image-utils";

const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const ALLOWED_VIDEO_TYPES = new Set(["video/mp4"]);
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;   // 5MB
const MAX_VIDEO_BYTES = 30 * 1024 * 1024;  // 30MB
const MAX_FILES = 5;

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Requisição inválida" }, { status: 400 });
  }

  const files = formData.getAll("files") as File[];

  if (files.length === 0) {
    return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
  }

  if (files.length > MAX_FILES) {
    return NextResponse.json(
      { error: `Máximo ${MAX_FILES} arquivos por envio` },
      { status: 400 }
    );
  }

  type UploadResult = { url: string; thumbnailUrl?: string; key: string };
  const results: UploadResult[] = [];

  for (const file of files) {
    const isImage = ALLOWED_IMAGE_TYPES.has(file.type);
    const isVideo = ALLOWED_VIDEO_TYPES.has(file.type);

    if (!isImage && !isVideo) {
      return NextResponse.json(
        { error: `Tipo não permitido: ${file.type}. Use JPEG, PNG, WebP ou MP4.` },
        { status: 400 }
      );
    }

    const maxBytes = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
    if (file.size > maxBytes) {
      return NextResponse.json(
        { error: `"${file.name}" excede o limite de ${isVideo ? "30MB" : "5MB"}` },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const rand = randomBytes(6).toString("hex");
    const ts = Date.now();

    if (isImage) {
      const compressed = await compressImage(buffer, "post");
      const key = `posts/${user.id}/${ts}-${rand}.webp`;
      const url = await uploadFile(compressed, key, "image/webp");

      const thumb = await compressImage(buffer, "thumbnail");
      const thumbKey = `posts/${user.id}/${ts}-${rand}-thumb.webp`;
      const thumbnailUrl = await uploadFile(thumb, thumbKey, "image/webp");

      results.push({ url, thumbnailUrl, key });
    } else {
      const key = `posts/${user.id}/${ts}-${rand}.mp4`;
      const url = await uploadFile(buffer, key, "video/mp4");
      results.push({ url, key });
    }
  }

  return NextResponse.json({ files: results });
}
