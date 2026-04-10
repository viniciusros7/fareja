"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PostCard, { type FeedPost } from "@/components/community/PostCard";
import { useUser } from "@/lib/hooks/useUser";
import { createClient } from "@/lib/supabase/client";
import { useEffect } from "react";

interface Props {
  post: FeedPost;
}

export default function PostPageClient({ post }: Props) {
  const { user } = useUser();
  const [liked, setLiked] = useState(false);
  const [postData, setPostData] = useState(post);

  useEffect(() => {
    if (!user) return;
    createClient()
      .from("post_likes")
      .select("post_id")
      .eq("post_id", post.id)
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => { if (data) setLiked(true); });
  }, [user, post.id]);

  function handleLikeToggle(_id: string, newLiked: boolean, newCount: number) {
    setLiked(newLiked);
    setPostData((p) => ({ ...p, likes_count: newCount }));
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/comunidade/feed"
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-earth-100 text-earth-500 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="font-display text-xl font-semibold text-brand-900">Post</h1>
      </div>

      <PostCard
        post={postData}
        liked={liked}
        onLikeToggle={handleLikeToggle}
      />
    </div>
  );
}
