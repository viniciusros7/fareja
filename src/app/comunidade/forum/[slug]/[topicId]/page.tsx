import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import TopicDetailClient from "@/components/forum/TopicDetailClient";
import type { ForumTopic, ForumReply } from "@/lib/types/forum";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string; topicId: string }>;
}

function normalizeJoins(topic: ForumTopic): ForumTopic {
  return {
    ...topic,
    author: Array.isArray(topic.author) ? (topic.author[0] ?? null) : topic.author,
    kennel: Array.isArray(topic.kennel) ? (topic.kennel[0] ?? null) : topic.kennel,
    category: Array.isArray(topic.category) ? (topic.category[0] ?? null) : topic.category,
  };
}

function normalizeReplyJoins(reply: ForumReply): ForumReply {
  return {
    ...reply,
    author: Array.isArray(reply.author) ? (reply.author[0] ?? null) : reply.author,
    kennel: Array.isArray(reply.kennel) ? (reply.kennel[0] ?? null) : reply.kennel,
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topicId } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("forum_topics")
    .select("title, content")
    .eq("id", topicId)
    .single();

  if (!data) return { title: "Fórum | Fareja" };

  return {
    title: `${data.title} | Fórum Fareja`,
    description: data.content.slice(0, 160),
    openGraph: {
      title: data.title,
      description: data.content.slice(0, 160),
      type: "article",
    },
  };
}

export default async function TopicPage({ params }: Props) {
  const { slug, topicId } = await params;
  const supabase = await createClient();

  const { data: rawTopic } = await supabase
    .from("forum_topics")
    .select(`
      id, category_id, author_id, title, content, images,
      views_count, replies_count, likes_count,
      is_pinned, is_solved, status, created_at, updated_at,
      author:profiles!author_id(id, full_name, avatar_url, role),
      kennel:kennels(id, name, slug, plan),
      category:forum_categories(id, name, slug)
    `)
    .eq("id", topicId)
    .single();

  if (!rawTopic) notFound();

  const topic = normalizeJoins(rawTopic as unknown as ForumTopic);

  const { data: rawReplies } = await supabase
    .from("forum_replies")
    .select(`
      id, topic_id, author_id, content, images,
      likes_count, is_best_answer, created_at,
      author:profiles!author_id(id, full_name, avatar_url, role),
      kennel:kennels(id, name, slug, plan)
    `)
    .eq("topic_id", topicId)
    .order("is_best_answer", { ascending: false })
    .order("created_at", { ascending: true });

  const replies = (rawReplies ?? []).map((r) => normalizeReplyJoins(r as unknown as ForumReply));

  // Check current user likes
  const { data: { user } } = await supabase.auth.getUser();
  let initialLiked = false;
  let initialReplyLikes: Record<string, boolean> = {};

  if (user) {
    const { data: topicLike } = await supabase
      .from("forum_topic_likes")
      .select("topic_id")
      .eq("topic_id", topicId)
      .eq("user_id", user.id)
      .maybeSingle();
    initialLiked = !!topicLike;

    if (replies.length > 0) {
      const replyIds = replies.map((r) => r.id);
      const { data: rlikes } = await supabase
        .from("forum_reply_likes")
        .select("reply_id")
        .in("reply_id", replyIds)
        .eq("user_id", user.id);
      if (rlikes) {
        for (const l of rlikes) {
          initialReplyLikes[l.reply_id] = true;
        }
      }
    }
  }

  // Increment views
  supabase
    .from("forum_topics")
    .update({ views_count: topic.views_count + 1 })
    .eq("id", topicId)
    .then(() => {});

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-5">
        <Link
          href={`/comunidade/forum/${slug}`}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-earth-100 text-earth-400 transition-colors shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex-1 min-w-0">
          <Link
            href={`/comunidade/forum/${slug}`}
            className="text-xs text-earth-400 hover:text-brand-600 transition-colors truncate block"
          >
            {topic.category?.name ?? "Fórum"}
          </Link>
          <h1 className="font-display text-lg font-semibold text-earth-900 leading-snug line-clamp-2">
            {topic.title}
          </h1>
        </div>
      </div>

      <TopicDetailClient
        initialTopic={topic}
        initialReplies={replies}
        initialLiked={initialLiked}
        initialReplyLikes={initialReplyLikes}
      />
    </div>
  );
}
