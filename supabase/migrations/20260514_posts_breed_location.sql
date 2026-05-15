ALTER TABLE posts
  ADD COLUMN IF NOT EXISTS breed_id uuid REFERENCES breeds(id),
  ADD COLUMN IF NOT EXISTS location text;
