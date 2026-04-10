import sharp from "sharp";

type ImageType = "post" | "thumbnail" | "avatar";

const config: Record<ImageType, { width: number; quality: number }> = {
  post:      { width: 1200, quality: 80 },
  thumbnail: { width: 400,  quality: 80 },
  avatar:    { width: 400,  quality: 80 },
};

const MAX_BYTES = 500 * 1024; // 500KB

export async function compressImage(buffer: Buffer, type: ImageType): Promise<Buffer> {
  const { width, quality } = config[type];

  let result = await sharp(buffer)
    .resize(width, undefined, { withoutEnlargement: true })
    .webp({ quality })
    .toBuffer();

  // Se ainda ultrapassar 500KB, reduz qualidade progressivamente
  let q = quality;
  while (result.length > MAX_BYTES && q > 40) {
    q -= 10;
    result = await sharp(buffer)
      .resize(width, undefined, { withoutEnlargement: true })
      .webp({ quality: q })
      .toBuffer();
  }

  return result;
}
