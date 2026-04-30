import imageCompression from "browser-image-compression";

export async function compressImageForFeed(file: File): Promise<File> {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1600,
    useWebWorker: true,
    fileType: "image/webp" as const,
    initialQuality: 0.82,
  };

  try {
    const compressed = await imageCompression(file, options);
    const baseName = file.name.replace(/\.[^.]+$/, "");
    return new File([compressed], `${baseName}.webp`, { type: "image/webp" });
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("Compress failed, using original:", err);
    }
    return file;
  }
}
