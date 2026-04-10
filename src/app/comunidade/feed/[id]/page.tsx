import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PostPageClient from "./PostPageClient";

type Props = { params: Promise<{ id: string }> };

async function fetchPost(id: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select(`
      id, author_id, content, images, thumbnails,
      likes_count, comments_count, status, created_at,
      author:profiles!author_id(id, full_name, avatar_url, role),
      kennel:kennels(id, name, plan, slug)
    `)
    .eq("id", id)
    .eq("status", "published")
    .single();
  return data;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const post = await fetchPost(id);

  if (!post) {
    return { title: "Post não encontrado — Fareja" };
  }

  const author = Array.isArray(post.author) ? post.author[0] : post.author;
  const kennel = Array.isArray(post.kennel) ? post.kennel[0] : post.kennel;
  const displayName = kennel?.name ?? author?.full_name ?? "Usuário";
  const description = post.content.slice(0, 150);
  const image = post.images?.[0] ?? null;
  const url = `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/comunidade/feed/${id}`;

  return {
    title: `${displayName} — Fareja`,
    description,
    openGraph: {
      title: `${displayName} na Fareja`,
      description,
      url,
      ...(image ? { images: [{ url: image, width: 1200, height: 1200 }] } : {}),
      type: "article",
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: `${displayName} na Fareja`,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { id } = await params;
  const post = await fetchPost(id);

  if (!post) notFound();

  // Supabase returns joined arrays; normalize to single object
  const normalized = {
    ...post,
    author: Array.isArray(post.author) ? post.author[0] ?? null : post.author,
    kennel: Array.isArray(post.kennel) ? post.kennel[0] ?? null : post.kennel,
  } as import("@/components/community/PostCard").FeedPost;

  return <PostPageClient post={normalized} />;
}
