-- Destrava publicação no feed: permite type='photo' e 'video'
-- O constraint anterior só aceitava 'question','experience','article','tip'
-- mas o código do feed insere type='photo', causando violação silenciosa.

ALTER TABLE public.posts DROP CONSTRAINT IF EXISTS posts_type_check;

ALTER TABLE public.posts
  ADD CONSTRAINT posts_type_check
    CHECK (type IN ('photo', 'video'));

ALTER TABLE public.posts
  ALTER COLUMN type SET DEFAULT 'photo';
