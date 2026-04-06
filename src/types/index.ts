// ============================================================
// Fareja – Tipos centrais da plataforma
// ============================================================

// ---- Enums ----
export type UserRole = "client" | "kennel" | "admin";
export type KennelPlan = "basic" | "premium";
export type KennelStatus = "pending" | "approved" | "rejected" | "suspended";
export type PuppyStatus = "available" | "reserved" | "sold" | "upcoming";
export type PostType = "question" | "experience" | "article" | "tip";

// ---- Usuários ----
export interface User {
  id: string;
  email: string;
  phone: string | null;
  full_name: string;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
}

// ---- Canis ----
export interface Kennel {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  description: string;
  city: string;
  state: string;
  address: string | null;
  phone: string;
  email: string;
  instagram: string | null;
  website: string | null;
  logo_url: string | null;
  cover_url: string | null;
  years_active: number;
  kc_registry: string; // Registro CBKC ou similar
  kc_entity: string; // CBKC, SOBRACI, etc.
  plan: KennelPlan;
  status: KennelStatus;
  verified_at: string | null;
  breeds: string[];
  facilities_approved: boolean;
  microchip: boolean;
  vaccines: boolean;
  dna_tests: boolean;
  birth_control: boolean;
  google_rating: number | null;
  google_reviews_count: number | null;
  fareja_rating: number | null;
  fareja_reviews_count: number;
  created_at: string;
  updated_at: string;
}

// ---- Reprodutores ----
export interface Breeder {
  id: string;
  kennel_id: string;
  name: string;
  breed: string;
  sex: "male" | "female";
  registry: string;
  titles: string | null;
  photo_url: string | null;
  health_tests: string[];
  born_at: string | null;
}

// ---- Filhotes ----
export interface Puppy {
  id: string;
  kennel_id: string;
  name: string;
  breed: string;
  sex: "male" | "female";
  born_at: string | null;
  expected_at: string | null;
  price: number;
  status: PuppyStatus;
  father_id: string | null;
  mother_id: string | null;
  photo_url: string | null;
  microchipped: boolean;
  vaccinated: boolean;
  description: string | null;
}

// ---- Avaliações ----
export interface Review {
  id: string;
  kennel_id: string;
  user_id: string;
  user_name: string;
  user_avatar: string | null;
  rating: number; // 1-5
  comment: string;
  source: "fareja" | "google";
  created_at: string;
}

// ---- Comunidade ----
export interface Post {
  id: string;
  author_id: string;
  author_name: string;
  author_avatar: string | null;
  author_role: UserRole;
  kennel_id: string | null; // se postado por um canil
  kennel_name: string | null;
  type: PostType;
  title: string;
  content: string;
  image_url: string | null;
  likes_count: number;
  comments_count: number;
  created_at: string;
}

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  author_name: string;
  author_avatar: string | null;
  author_role: UserRole;
  kennel_name: string | null;
  content: string;
  created_at: string;
}

// ---- Filtros de busca ----
export interface SearchFilters {
  query: string;
  breed: string;
  state: string;
  city: string;
  availability: "all" | "now" | "soon";
  minRating: number;
  maxPrice: number | null;
  sortBy: "rating" | "years" | "price" | "reviews";
}
