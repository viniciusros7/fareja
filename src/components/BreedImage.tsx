"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

// Mapeamento name_en → slug Dog CEO API
// Formato: "breed" ou "breed/subbreed"
// null = sem suporte → placedog como fallback
const dogCeoSlugs: Record<string, string | null> = {
  "Golden Retriever": "retriever/golden",
  "Labrador Retriever": "retriever/labrador",
  "Beagle": "beagle",
  "Poodle (Toy)": "poodle",
  "Poodle (Miniature)": "poodle",
  "Poodle (Standard)": "poodle",
  "French Bulldog": "bulldog/french",
  "English Bulldog": "bulldog/english",
  "German Shepherd": "germanshepherd",
  "Border Collie": "collie/border",
  "Rottweiler": "rottweiler",
  "Yorkshire Terrier": "yorkshire",
  "Shih Tzu": "shihtzu",
  "Maltese": "maltese",
  "Lhasa Apso": "lhasa",
  "Pug": "pug",
  "German Spitz (Pomeranian)": "pomeranian",
  "Siberian Husky": "husky",
  "Akita Inu": "akita",
  "Chow Chow": "chow",
  "Dachshund": "dachshund",
  "Miniature Schnauzer": "schnauzer/miniature",
  "Standard Schnauzer": "schnauzer",
  "Giant Schnauzer": "schnauzer/giant",
  "Boxer": "boxer",
  "Doberman Pinscher": "doberman",
  "American Pit Bull Terrier": null,
  "American Bully": null,
  "American Cocker Spaniel": "spaniel/cocker",
  "English Cocker Spaniel": "spaniel/cocker",
  "Cavalier King Charles Spaniel": "spaniel/cavalier",
  "Bernese Mountain Dog": "mountain/bernese",
  "Saint Bernard": "stbernard",
  "Dalmatian": "dalmatian",
  "Weimaraner": "weimaraner",
  "Pointer": "pointer",
  "Irish Setter": "setter/irish",
  "Gordon Setter": "setter/gordon",
  "Flat-Coated Retriever": "retriever/flatcoated",
  "Jack Russell Terrier": "terrier/russell",
  "Wire Fox Terrier": "terrier/fox",
  "West Highland White Terrier": "terrier/westhighland",
  "Scottish Terrier": "terrier/scottish",
  "Brazilian Terrier": null,
  "Rat Terrier": null,
  "Bull Terrier": "terrier/bull",
  "Staffordshire Bull Terrier": "terrier/staffordshire",
  "Bichon Frise": "bichon/frise",
  "Havanese": "havanese",
  "Papillon": "papillon",
  "Coton de Tulear": null,
  "Chihuahua": "chihuahua",
  "Pekingese": "pekinese",
  "Affenpinscher": "affenpinscher",
  "Miniature Pinscher": "pinscher/miniature",
  "Boston Terrier": "terrier/boston",
  "Chinese Shar Pei": "sharpei",
  "Basenji": "basenji",
  "Shiba Inu": "shiba",
  "Japanese Spitz": null,
  "Whippet": "whippet",
  "Greyhound": "greyhound",
  "Spanish Greyhound": null,
  "Fila Brasileiro": null,
  "Cane Corso": null,
  "Dogo Argentino": null,
  "Neapolitan Mastiff": "mastiff/neapolitan",
  "Campeiro Bulldog": null,
  "Belgian Malinois": "malinois",
  "Australian Shepherd": "australian/shepherd",
  "Australian Cattle Dog": "cattledog/australian",
  "Pembroke Welsh Corgi": "corgi",
  "Cardigan Welsh Corgi": "corgi",
  "Shetland Sheepdog": "sheepdog/shetland",
  "Rough Collie": "collie/rough",
  "Komondor": "komondor",
  "Kuvasz": "kuvasz",
  "Samoyed": "samoyed",
  "Alaskan Malamute": "malamute",
  "Newfoundland": "newfoundland",
  "Portuguese Water Dog": "waterdog/portuguese",
  "Great Dane": "dane/great",
  "English Mastiff": "mastiff/english",
  "American Akita": "akita",
  "Bloodhound": "hound/blood",
  "Basset Hound": "hound/basset",
  "Vizsla": "vizsla",
  "German Shorthaired Pointer": "pointer",
  "English Springer Spaniel": "spaniel/springer",
  "Rhodesian Ridgeback": "ridgeback/rhodesian",
};

function fallbackUrl(seed: number) {
  return `https://placedog.net/400/300?id=${(seed % 50) + 50}`;
}

interface BreedImageProps {
  nameEn: string;
  alt: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  fallbackSeed?: number;
}

export default function BreedImage({
  nameEn,
  alt,
  className = "",
  fill,
  width,
  height,
  sizes,
  priority,
  fallbackSeed = 1,
}: BreedImageProps) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    const slug = dogCeoSlugs[nameEn];
    if (slug === undefined || slug === null) {
      setSrc(fallbackUrl(fallbackSeed));
      return;
    }
    fetch(`https://dog.ceo/api/breed/${slug}/images/random`)
      .then((r) => r.json())
      .then((data) => {
        setSrc(data.status === "success" && data.message ? data.message : fallbackUrl(fallbackSeed));
      })
      .catch(() => setSrc(fallbackUrl(fallbackSeed)));
  }, [nameEn, fallbackSeed]);

  if (!src) {
    // skeleton
    return (
      <div
        className={`bg-earth-100 animate-pulse ${className}`}
        style={
          fill
            ? { position: "absolute", inset: 0 }
            : { width: width ?? "100%", height: height ?? 200 }
        }
      />
    );
  }

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={className}
        sizes={sizes}
        priority={priority}
        onError={() => setSrc(fallbackUrl(fallbackSeed))}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width ?? 400}
      height={height ?? 300}
      className={className}
      sizes={sizes}
      priority={priority}
      onError={() => setSrc(fallbackUrl(fallbackSeed))}
    />
  );
}
