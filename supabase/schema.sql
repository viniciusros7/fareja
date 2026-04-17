-- ============================================================
-- Fareja – Schema do banco de dados (Supabase / PostgreSQL)
-- Execute este arquivo no SQL Editor do Supabase
-- ============================================================

-- Extensões
create extension if not exists "uuid-ossp";

-- ============================================================
-- TABELAS
-- ============================================================

-- Perfis de usuário (estende auth.users do Supabase)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  phone text,
  full_name text not null default '',
  avatar_url text,
  role text not null default 'client' check (role in ('client', 'kennel', 'approver', 'super_admin')),
  pet_status text not null default 'not_specified' check (pet_status in ('pet_parent', 'looking_first', 'not_specified')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Canis
create table public.kennels (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  slug text unique not null,
  description text not null default '',
  city text not null,
  state text not null,
  address text,
  phone text not null,
  email text not null,
  instagram text,
  website text,
  logo_url text,
  cover_url text,
  years_active integer not null default 0,
  kc_registry text not null,
  kc_entity text not null default 'CBKC',
  plan text not null default 'basic' check (plan in ('basic', 'premium', 'super_premium')),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'suspended')),
  verified_at timestamptz,
  breeds text[] not null default '{}',
  facilities_approved boolean not null default false,
  microchip boolean not null default true,
  vaccines boolean not null default true,
  dna_tests boolean not null default false,
  birth_control boolean not null default false,
  google_rating numeric(2,1),
  google_reviews_count integer default 0,
  fareja_rating numeric(2,1),
  fareja_reviews_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Reprodutores
create table public.breeders (
  id uuid primary key default uuid_generate_v4(),
  kennel_id uuid references public.kennels(id) on delete cascade not null,
  name text not null,
  breed text not null,
  sex text not null check (sex in ('male', 'female')),
  registry text not null,
  titles text,
  photo_url text,
  health_tests text[] not null default '{}',
  born_at date,
  created_at timestamptz not null default now()
);

-- Filhotes
create table public.puppies (
  id uuid primary key default uuid_generate_v4(),
  kennel_id uuid references public.kennels(id) on delete cascade not null,
  name text not null,
  breed text not null,
  sex text not null check (sex in ('male', 'female')),
  born_at date,
  expected_at date,
  price numeric(10,2) not null,
  status text not null default 'available' check (status in ('available', 'reserved', 'sold', 'upcoming')),
  father_id uuid references public.breeders(id) on delete set null,
  mother_id uuid references public.breeders(id) on delete set null,
  photo_url text,
  microchipped boolean not null default false,
  vaccinated boolean not null default false,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Avaliações
create table public.reviews (
  id uuid primary key default uuid_generate_v4(),
  kennel_id uuid references public.kennels(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text not null default '',
  source text not null default 'fareja' check (source in ('fareja', 'google')),
  created_at timestamptz not null default now()
);

-- Posts da comunidade
create table public.posts (
  id uuid primary key default uuid_generate_v4(),
  author_id uuid references public.profiles(id) on delete cascade not null,
  kennel_id uuid references public.kennels(id) on delete set null,
  type text not null default 'experience' check (type in ('question', 'experience', 'article', 'tip')),
  title text not null,
  content text not null,
  image_url text,
  likes_count integer not null default 0,
  comments_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Comentários nos posts
create table public.comments (
  id uuid primary key default uuid_generate_v4(),
  post_id uuid references public.posts(id) on delete cascade not null,
  author_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  created_at timestamptz not null default now()
);

-- Likes nos posts
create table public.post_likes (
  post_id uuid references public.posts(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

-- Favoritos (clientes salvam canis)
create table public.favorites (
  user_id uuid references public.profiles(id) on delete cascade not null,
  kennel_id uuid references public.kennels(id) on delete cascade not null,
  created_at timestamptz not null default now(),
  primary key (user_id, kennel_id)
);

-- Recomendações de veterinários (Super Premium)
create table public.vet_recommendations (
  id uuid primary key default uuid_generate_v4(),
  kennel_id uuid references public.kennels(id) on delete cascade not null,
  name text not null,
  specialty text not null default '',
  city text not null,
  state text not null,
  phone text not null,
  note text not null default '',
  created_at timestamptz not null default now()
);

-- Recomendações de casas de ração (Super Premium)
create table public.food_recommendations (
  id uuid primary key default uuid_generate_v4(),
  kennel_id uuid references public.kennels(id) on delete cascade not null,
  name text not null,
  city text not null,
  state text not null,
  phone text not null,
  discount_info text,
  note text not null default '',
  created_at timestamptz not null default now()
);

-- Feed posts (fotos e vídeos estilo Instagram)
create table public.feed_posts (
  id uuid primary key default uuid_generate_v4(),
  author_id uuid references public.profiles(id) on delete cascade not null,
  kennel_id uuid references public.kennels(id) on delete set null,
  breed_tag text not null,
  media_url text,
  media_type text check (media_type in ('photo', 'video')),
  caption text not null default '',
  likes_count integer not null default 0,
  comments_count integer not null default 0,
  is_sponsored boolean not null default false,
  created_at timestamptz not null default now()
);

-- ============================================================
-- ÍNDICES
-- ============================================================
create index idx_kennels_status on public.kennels(status);
create index idx_kennels_state on public.kennels(state);
create index idx_kennels_breeds on public.kennels using gin(breeds);
create index idx_kennels_slug on public.kennels(slug);
create index idx_puppies_kennel on public.puppies(kennel_id);
create index idx_puppies_status on public.puppies(status);
create index idx_reviews_kennel on public.reviews(kennel_id);
create index idx_posts_type on public.posts(type);
create index idx_posts_author on public.posts(author_id);
create index idx_comments_post on public.comments(post_id);

-- ============================================================
-- RLS (Row Level Security)
-- ============================================================
alter table public.profiles enable row level security;
alter table public.kennels enable row level security;
alter table public.breeders enable row level security;
alter table public.puppies enable row level security;
alter table public.reviews enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;
alter table public.post_likes enable row level security;
alter table public.favorites enable row level security;

-- Profiles: leitura pública, edição própria
create policy "Profiles visíveis para todos" on public.profiles for select using (true);
create policy "Usuário edita próprio perfil" on public.profiles for update using (auth.uid() = id);

-- Kennels: aprovados visíveis, dono edita
create policy "Canis aprovados visíveis" on public.kennels for select using (status = 'approved' or owner_id = auth.uid());
create policy "Dono edita canil" on public.kennels for update using (owner_id = auth.uid());
create policy "Usuário cria canil" on public.kennels for insert with check (owner_id = auth.uid());

-- Breeders: visíveis se canil aprovado
create policy "Reprodutores visíveis" on public.breeders for select using (
  exists (select 1 from public.kennels where id = kennel_id and (status = 'approved' or owner_id = auth.uid()))
);
create policy "Dono gerencia reprodutores" on public.breeders for all using (
  exists (select 1 from public.kennels where id = kennel_id and owner_id = auth.uid())
);

-- Puppies: visíveis se canil aprovado
create policy "Filhotes visíveis" on public.puppies for select using (
  exists (select 1 from public.kennels where id = kennel_id and (status = 'approved' or owner_id = auth.uid()))
);
create policy "Dono gerencia filhotes" on public.puppies for all using (
  exists (select 1 from public.kennels where id = kennel_id and owner_id = auth.uid())
);

-- Reviews: leitura pública, autenticados escrevem
create policy "Reviews visíveis" on public.reviews for select using (true);
create policy "Autenticados avaliam" on public.reviews for insert with check (auth.uid() = user_id);

-- Posts: leitura pública, autenticados postam
create policy "Posts visíveis" on public.posts for select using (true);
create policy "Autenticados postam" on public.posts for insert with check (auth.uid() = author_id);
create policy "Autor edita post" on public.posts for update using (auth.uid() = author_id);

-- Comments: leitura pública, autenticados comentam
create policy "Comentários visíveis" on public.comments for select using (true);
create policy "Autenticados comentam" on public.comments for insert with check (auth.uid() = author_id);

-- Likes
create policy "Likes visíveis" on public.post_likes for select using (true);
create policy "Autenticados curtem" on public.post_likes for insert with check (auth.uid() = user_id);
create policy "Próprio like removível" on public.post_likes for delete using (auth.uid() = user_id);

-- Favorites
create policy "Próprios favoritos" on public.favorites for select using (auth.uid() = user_id);
create policy "Autenticados favoritam" on public.favorites for insert with check (auth.uid() = user_id);
create policy "Remove favorito" on public.favorites for delete using (auth.uid() = user_id);

-- ============================================================
-- FUNÇÕES
-- ============================================================

-- Criar perfil automaticamente quando usuário se registra,
-- marcar pioneiro (primeiros 100 clientes) e inserir notificação de boas-vindas
create or replace function public.handle_new_user()
returns trigger as $$
declare
  client_count integer;
begin
  -- Conta clientes existentes (antes deste novo usuário)
  select count(*) into client_count
  from public.profiles
  where role = 'client';

  insert into public.profiles (id, email, full_name, avatar_url, is_pioneer)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', null),
    client_count < 100  -- primeiros 100 são pioneiros
  );

  insert into public.notifications (user_id, type, content, link)
  values (
    new.id,
    'welcome',
    'Bem-vindo ao Fareja! 🐾 Explore os canis verificados e participe da comunidade.',
    '/buscar'
  );

  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Atualizar rating do canil quando review é inserida
create or replace function public.update_kennel_rating()
returns trigger as $$
begin
  update public.kennels
  set
    fareja_rating = (select round(avg(rating)::numeric, 1) from public.reviews where kennel_id = new.kennel_id and source = 'fareja'),
    fareja_reviews_count = (select count(*) from public.reviews where kennel_id = new.kennel_id and source = 'fareja'),
    updated_at = now()
  where id = new.kennel_id;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_review_created
  after insert on public.reviews
  for each row execute function public.update_kennel_rating();

-- Atualizar contadores de post
create or replace function public.update_post_counts()
returns trigger as $$
begin
  if tg_table_name = 'comments' then
    update public.posts set comments_count = (select count(*) from public.comments where post_id = new.post_id) where id = new.post_id;
  elsif tg_table_name = 'post_likes' then
    update public.posts set likes_count = (select count(*) from public.post_likes where post_id = new.post_id) where id = new.post_id;
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_comment_created
  after insert or delete on public.comments
  for each row execute function public.update_post_counts();

create trigger on_like_changed
  after insert or delete on public.post_likes
  for each row execute function public.update_post_counts();

-- ============================================================
-- TABELA DE RAÇAS
-- ============================================================

create table public.breeds (
  id uuid default gen_random_uuid() primary key,
  name_pt text not null,
  name_en text not null unique,
  breed_group text,
  size text check (size in ('small', 'medium', 'large', 'giant')),
  coat text check (coat in ('short', 'medium', 'long', 'hairless')),
  energy_level int check (energy_level between 1 and 5),
  grooming_needs int check (grooming_needs between 1 and 5),
  trainability int check (trainability between 1 and 5),
  friendliness int check (friendliness between 1 and 5),
  good_with_kids boolean default true,
  good_for_apartments boolean default false,
  exercise_needs int check (exercise_needs between 1 and 5),
  shedding_level int check (shedding_level between 1 and 5),
  weight_min_kg numeric,
  weight_max_kg numeric,
  height_min_cm numeric,
  height_max_cm numeric,
  life_span_min int,
  life_span_max int,
  temperament_pt text,
  description_pt text,
  image_url text,
  image_source text check (image_source in ('curated', 'kennel_provided', 'dog_api')),
  created_at timestamptz default now()
);

alter table public.breeds enable row level security;
create policy "Raças visíveis para todos" on public.breeds for select using (true);

create index idx_breeds_size on public.breeds(size);
create index idx_breeds_coat on public.breeds(coat);
create index idx_breeds_group on public.breeds(breed_group);

-- Para executar o seed após criar a tabela, adicione a chave service_role ao .env.local:
-- SUPABASE_SERVICE_ROLE_KEY=sua_chave_aqui
-- Depois rode: npx tsx src/lib/seed-breeds.ts

-- ============================================================
-- FASE 7 — Colunas adicionais na tabela kennels
-- ============================================================
-- Execute no SQL Editor do Supabase (Dashboard → SQL Editor)
-- Seguro de rodar mais de uma vez (ADD COLUMN IF NOT EXISTS)

alter table public.kennels
  add column if not exists latitude numeric,
  add column if not exists longitude numeric,
  add column if not exists offers_hotel boolean not null default false,
  add column if not exists offers_transport boolean not null default false,
  add column if not exists breeds_offered uuid[] default '{}',
  add column if not exists whatsapp text;

-- Índices adicionais
create index if not exists idx_kennels_offers_hotel on public.kennels(offers_hotel);
create index if not exists idx_kennels_offers_transport on public.kennels(offers_transport);

-- ============================================================
-- FASE 8 — Favoritos estendidos + tabela de doações
-- ============================================================
-- Execute no SQL Editor do Supabase (Dashboard → SQL Editor)

-- Atualiza tabela favorites para suportar raças e canis
alter table public.favorites drop constraint if exists favorites_pkey;
alter table public.favorites add column if not exists id uuid default gen_random_uuid();
alter table public.favorites add column if not exists breed_id uuid references public.breeds(id) on delete cascade;
alter table public.favorites alter column kennel_id drop not null;

-- Nova PK em id (executar apenas se a coluna id foi adicionada acima)
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'favorites_pkey' and conrelid = 'public.favorites'::regclass
  ) then
    alter table public.favorites add primary key (id);
  end if;
end $$;

create unique index if not exists idx_favorites_user_kennel
  on public.favorites(user_id, kennel_id) where kennel_id is not null;
create unique index if not exists idx_favorites_user_breed
  on public.favorites(user_id, breed_id) where breed_id is not null;

-- Tabela de doações
create table if not exists public.donations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  kennel_id uuid references public.kennels(id) on delete set null,
  dog_name text not null,
  breed text not null default '',
  age text not null default '',
  sex text not null check (sex in ('male', 'female')),
  city text not null,
  state text not null,
  reason text not null default '',
  description text not null default '',
  contact text not null,
  contact_method text not null default 'whatsapp' check (contact_method in ('whatsapp', 'email', 'phone')),
  donor_type text not null check (donor_type in ('kennel', 'individual')),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  image_url text,
  created_at timestamptz not null default now()
);

alter table public.donations enable row level security;

create policy "Doações aprovadas visíveis" on public.donations
  for select using (status = 'approved' or user_id = auth.uid());
create policy "Autenticados cadastram doações" on public.donations
  for insert with check (auth.uid() = user_id);
create policy "Autor edita doação" on public.donations
  for update using (auth.uid() = user_id);

create index if not exists idx_donations_status on public.donations(status);
create index if not exists idx_donations_state on public.donations(state);

-- ============================================================
-- FASE 9B — Feed de posts com imagens, curtidas e comentários
-- ============================================================
-- Execute no SQL Editor do Supabase

-- Colunas adicionais na tabela posts existente
alter table public.posts
  add column if not exists images text[] default '{}',
  add column if not exists thumbnails text[] default '{}',
  add column if not exists status text default 'published';

do $$ begin
  alter table public.posts add constraint posts_status_check
    check (status in ('published', 'pending', 'removed'));
exception when duplicate_object then null;
end $$;

-- Atualiza RLS: posts visíveis se publicados OU próprios
drop policy if exists "Posts visíveis" on public.posts;
create policy "Posts publicados visíveis" on public.posts
  for select using (status = 'published' or author_id = auth.uid());

-- Garantir que autenticados podem inserir
drop policy if exists "Autenticados postam" on public.posts;
create policy "Autenticados postam" on public.posts
  for insert with check (auth.uid() = author_id);

-- Garantir id em post_likes
alter table public.post_likes add column if not exists id uuid default gen_random_uuid();
create unique index if not exists idx_post_likes_unique on public.post_likes(post_id, user_id);

-- Tabela de comentários do feed (separada da 'comments' de posts de fórum)
create table if not exists public.post_comments (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references public.posts(id) on delete cascade not null,
  author_id uuid references public.profiles(id) not null,
  content text not null,
  created_at timestamptz default now()
);

alter table public.post_comments enable row level security;

create policy "Comentários do feed visíveis" on public.post_comments
  for select using (true);
create policy "Autor gerencia comentário do feed" on public.post_comments
  for all using (author_id = auth.uid());

create index if not exists idx_post_comments_post    on public.post_comments(post_id);
create index if not exists idx_post_comments_created on public.post_comments(created_at desc);
create index if not exists idx_posts_created_desc    on public.posts(created_at desc);
create index if not exists idx_posts_status          on public.posts(status);

-- Trigger: mantém comments_count sincronizado com post_comments
create or replace function public.sync_post_comment_count()
returns trigger as $$
begin
  if tg_op = 'INSERT' then
    update public.posts set comments_count = comments_count + 1 where id = new.post_id;
  elsif tg_op = 'DELETE' then
    update public.posts set comments_count = greatest(0, comments_count - 1) where id = old.post_id;
  end if;
  return coalesce(new, old);
end;
$$ language plpgsql security definer;

drop trigger if exists on_post_comment_feed_changed on public.post_comments;
create trigger on_post_comment_feed_changed
  after insert or delete on public.post_comments
  for each row execute function public.sync_post_comment_count();

-- ============================================================
-- FASE 9C — FÓRUM
-- ============================================================

-- Categorias do fórum
create table public.forum_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  icon text,
  topics_count int not null default 0,
  created_at timestamptz not null default now()
);
alter table public.forum_categories enable row level security;
create policy "forum_categories_select" on public.forum_categories for select using (true);
create policy "forum_categories_insert" on public.forum_categories for insert with check (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('approver','super_admin'))
);

-- Seed das 7 categorias
insert into public.forum_categories (name, slug, description, icon) values
  ('Saúde e Nutrição',            'saude-e-nutricao',            'Dúvidas sobre alimentação, vacinas e saúde geral', 'Heart'),
  ('Comportamento e Adestramento','comportamento-e-adestramento','Dicas de treino, socialização e comportamento',    'Brain'),
  ('Raças e Escolha do Filhote',  'racas-e-escolha-do-filhote',  'Compare raças e tire dúvidas sobre adoção',        'Search'),
  ('Cuidados e Higiene',          'cuidados-e-higiene',          'Banho, tosa, unhas e cuidados do dia a dia',       'Scissors'),
  ('Reprodução e Criação',        'reproducao-e-criacao',        'Para criadores — cobrição, ninhadas e pedigree',   'Star'),
  ('Espaço do Criador',           'espaco-do-criador',           'Vitrine e novidades dos canis verificados',        'Home'),
  ('Off-topic e Apresentações',   'off-topic-e-apresentacoes',   'Apresente seu pet e papo livre',                   'MessageCircle');

-- Tópicos do fórum
create table public.forum_topics (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.forum_categories(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  content text not null,
  images text[] not null default '{}',
  views_count int not null default 0,
  replies_count int not null default 0,
  likes_count int not null default 0,
  is_pinned boolean not null default false,
  is_solved boolean not null default false,
  status text not null default 'open' check (status in ('open','closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.forum_topics enable row level security;
create policy "forum_topics_select" on public.forum_topics for select using (true);
create policy "forum_topics_insert" on public.forum_topics for insert with check (auth.uid() = author_id);
create policy "forum_topics_update" on public.forum_topics for update using (
  auth.uid() = author_id or
  exists (select 1 from public.profiles where id = auth.uid() and role in ('approver','super_admin'))
);
create policy "forum_topics_delete" on public.forum_topics for delete using (
  auth.uid() = author_id or
  exists (select 1 from public.profiles where id = auth.uid() and role in ('approver','super_admin'))
);
create index forum_topics_category_created on public.forum_topics(category_id, created_at desc);
create index forum_topics_pinned on public.forum_topics(category_id, is_pinned desc, created_at desc);

-- Respostas do fórum
create table public.forum_replies (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references public.forum_topics(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  images text[] not null default '{}',
  likes_count int not null default 0,
  is_best_answer boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.forum_replies enable row level security;
create policy "forum_replies_select" on public.forum_replies for select using (true);
create policy "forum_replies_insert" on public.forum_replies for insert with check (auth.uid() = author_id);
create policy "forum_replies_update" on public.forum_replies for update using (
  auth.uid() = author_id or
  exists (select 1 from public.forum_topics where id = topic_id and author_id = auth.uid()) or
  exists (select 1 from public.profiles where id = auth.uid() and role in ('approver','super_admin'))
);
create policy "forum_replies_delete" on public.forum_replies for delete using (
  auth.uid() = author_id or
  exists (select 1 from public.profiles where id = auth.uid() and role in ('approver','super_admin'))
);
create index forum_replies_topic_created on public.forum_replies(topic_id, created_at asc);

-- Curtidas de tópicos
create table public.forum_topic_likes (
  user_id uuid not null references public.profiles(id) on delete cascade,
  topic_id uuid not null references public.forum_topics(id) on delete cascade,
  primary key (user_id, topic_id)
);
alter table public.forum_topic_likes enable row level security;
create policy "forum_topic_likes_all" on public.forum_topic_likes using (auth.uid() = user_id);

-- Curtidas de respostas
create table public.forum_reply_likes (
  user_id uuid not null references public.profiles(id) on delete cascade,
  reply_id uuid not null references public.forum_replies(id) on delete cascade,
  primary key (user_id, reply_id)
);
alter table public.forum_reply_likes enable row level security;
create policy "forum_reply_likes_all" on public.forum_reply_likes using (auth.uid() = user_id);

-- Trigger: mantém topics_count sincronizado em forum_categories
create or replace function public.sync_category_topics_count()
returns trigger language plpgsql security definer as $$
begin
  if TG_OP = 'INSERT' then
    update public.forum_categories set topics_count = topics_count + 1 where id = NEW.category_id;
  elsif TG_OP = 'DELETE' then
    update public.forum_categories set topics_count = greatest(topics_count - 1, 0) where id = OLD.category_id;
  end if;
  return null;
end;
$$;
create trigger trg_forum_topics_count
  after insert or delete on public.forum_topics
  for each row execute function public.sync_category_topics_count();

-- Trigger: mantém replies_count sincronizado em forum_topics
create or replace function public.sync_topic_replies_count()
returns trigger language plpgsql security definer as $$
begin
  if TG_OP = 'INSERT' then
    update public.forum_topics set replies_count = replies_count + 1, updated_at = now() where id = NEW.topic_id;
  elsif TG_OP = 'DELETE' then
    update public.forum_topics set replies_count = greatest(replies_count - 1, 0) where id = OLD.topic_id;
  end if;
  return null;
end;
$$;
create trigger trg_forum_replies_count
  after insert or delete on public.forum_replies
  for each row execute function public.sync_topic_replies_count();

-- ============================================================
-- FASE 12 — PERFIL, NOTIFICAÇÕES, PRIVACIDADE
-- ============================================================

alter table public.profiles
  add column if not exists bio text,
  add column if not exists privacy_accepted boolean not null default false,
  add column if not exists privacy_accepted_at timestamptz,
  add column if not exists is_pioneer boolean not null default false,
  add column if not exists is_founder boolean not null default false,
  add column if not exists founder_number integer,
  add column if not exists founder_free_until timestamptz;

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null check (type in ('comment_reply', 'new_post', 'kennel_update', 'admin_alert')),
  content text not null,
  link text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.notifications enable row level security;
create policy "notifications_select" on public.notifications for select using (auth.uid() = user_id);
create policy "notifications_update" on public.notifications for update using (auth.uid() = user_id);
create index notifications_user_created on public.notifications(user_id, created_at desc);
create index notifications_user_unread on public.notifications(user_id, read) where read = false;

-- ============================================================
-- FASE 13C — CANDIDATURAS DE CANIL
-- ============================================================

create table public.kennel_applications (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,

  -- Dados pessoais
  full_name   text not null,
  email       text not null,
  phone       text not null,
  city        text not null,
  state       text not null,

  -- Dados do canil
  kennel_name   text not null,
  breeds        text[] not null default '{}',
  years_active  int not null default 0,
  website       text,
  instagram     text,

  -- Qualificações (checkboxes)
  cbkc_registered  boolean not null default false,
  health_tests     boolean not null default false,
  written_contract boolean not null default false,
  litters_per_year int not null default 0,

  -- Score calculado no servidor
  score           int not null default 0,
  suggested_plan  text not null default 'verificado' check (suggested_plan in ('verificado','premium','elite')),

  -- Fluxo de aprovação
  status        text not null default 'pending' check (status in ('pending','approved','rejected')),
  reject_reason text,
  reviewed_by   uuid references public.profiles(id),
  reviewed_at   timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.kennel_applications enable row level security;

-- Candidato: vê e cria apenas suas próprias
create policy "applications_select_own" on public.kennel_applications
  for select using (auth.uid() = user_id);

create policy "applications_insert_own" on public.kennel_applications
  for insert with check (auth.uid() = user_id);

-- Admin: acesso total
create policy "admin_all" on public.kennel_applications
  for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
        and role in ('approver','super_admin')
    )
  );

create index kennel_applications_status on public.kennel_applications(status, created_at desc);
create index kennel_applications_user   on public.kennel_applications(user_id);

-- ============================================================
-- FASE 14B + F15 — MIGRAÇÃO
-- Execute este bloco no SQL Editor se o banco já existe
-- ============================================================

-- 1. Novas colunas em profiles (is_pioneer, is_founder, founder_number, founder_free_until)
alter table public.profiles
  add column if not exists is_pioneer boolean not null default false,
  add column if not exists is_founder boolean not null default false,
  add column if not exists founder_number integer,
  add column if not exists founder_free_until timestamptz;

-- 2. Atualiza o CHECK constraint para incluir 'welcome'
alter table public.notifications
  drop constraint if exists notifications_type_check;

alter table public.notifications
  add constraint notifications_type_check
    check (type in ('comment_reply', 'new_post', 'kennel_update', 'admin_alert', 'welcome'));

-- 3. Atualiza handle_new_user: pioneiro + notificação de boas-vindas
create or replace function public.handle_new_user()
returns trigger as $$
declare
  client_count integer;
begin
  select count(*) into client_count
  from public.profiles
  where role = 'client';

  insert into public.profiles (id, email, full_name, avatar_url, is_pioneer)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', null),
    client_count < 100
  );

  insert into public.notifications (user_id, type, content, link)
  values (
    new.id,
    'welcome',
    'Bem-vindo ao Fareja! 🐾 Explore os canis verificados e participe da comunidade.',
    '/buscar'
  );

  return new;
end;
$$ language plpgsql security definer;
