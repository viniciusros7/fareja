export type ForumCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  topics_count: number;
  created_at: string;
};

export type ForumAuthor = {
  id: string;
  full_name: string;
  avatar_url: string | null;
  role: string;
};

export type ForumKennel = {
  id: string;
  name: string;
  slug: string;
  plan: string;
};

export type ForumTopic = {
  id: string;
  category_id: string;
  author_id: string;
  title: string;
  content: string;
  images: string[];
  views_count: number;
  replies_count: number;
  likes_count: number;
  is_pinned: boolean;
  is_solved: boolean;
  status: "open" | "closed";
  created_at: string;
  updated_at: string;
  author: ForumAuthor | null;
  kennel: ForumKennel | null;
  category?: Pick<ForumCategory, "id" | "name" | "slug"> | null;
};

export type ForumReply = {
  id: string;
  topic_id: string;
  author_id: string;
  content: string;
  images: string[];
  likes_count: number;
  is_best_answer: boolean;
  created_at: string;
  author: ForumAuthor | null;
  kennel: ForumKennel | null;
};
