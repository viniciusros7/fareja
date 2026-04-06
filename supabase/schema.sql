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
  role text not null default 'client' check (role in ('client', 'kennel', 'admin')),
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
  plan text not null default 'basic' check (plan in ('basic', 'premium')),
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

-- Criar perfil automaticamente quando usuário se registra
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', null)
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
