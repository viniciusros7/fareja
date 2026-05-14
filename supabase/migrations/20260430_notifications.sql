-- F15e — Sistema de Notificações
-- Tabela notifications já existe com: id, user_id, type, content, link, read, created_at
-- Esta migration adiciona colunas estruturadas mantendo retrocompatibilidade

-- ===================================================
-- 1. Adiciona colunas ao schema existente
-- ===================================================

ALTER TABLE notifications
  ADD COLUMN IF NOT EXISTS recipient_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS actor_id     uuid REFERENCES profiles(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS target_type  text CHECK (target_type IN ('post', 'forum_topic', 'forum_reply')),
  ADD COLUMN IF NOT EXISTS target_id    uuid,
  ADD COLUMN IF NOT EXISTS preview      text,
  ADD COLUMN IF NOT EXISTS read_at      timestamptz;

-- Backfill: alinhar recipient_id com user_id existente
UPDATE notifications SET recipient_id = user_id WHERE recipient_id IS NULL;

-- ===================================================
-- 2. Índices
-- ===================================================

CREATE INDEX IF NOT EXISTS idx_notifications_recipient_unread
  ON notifications(recipient_id, created_at DESC)
  WHERE read_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_notifications_recipient
  ON notifications(recipient_id, created_at DESC);

-- ===================================================
-- 3. RLS (recria policies para cobrir recipient_id)
-- ===================================================

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users see own notifications" ON notifications;
CREATE POLICY "Users see own notifications"
  ON notifications FOR SELECT
  USING (user_id = auth.uid() OR recipient_id = auth.uid());

DROP POLICY IF EXISTS "Users update own notifications" ON notifications;
CREATE POLICY "Users update own notifications"
  ON notifications FOR UPDATE
  USING (user_id = auth.uid() OR recipient_id = auth.uid())
  WITH CHECK (user_id = auth.uid() OR recipient_id = auth.uid());

-- ===================================================
-- 4. Realtime
-- ===================================================

ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- ===================================================
-- 5. Helper: cria notificação (SECURITY DEFINER)
-- ===================================================

CREATE OR REPLACE FUNCTION create_notification(
  p_recipient  uuid,
  p_actor      uuid,
  p_type       text,
  p_target_type text,
  p_target_id  uuid,
  p_preview    text DEFAULT NULL
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  actor_name    text;
  notif_content text;
  notif_link    text;
BEGIN
  IF p_recipient = p_actor THEN RETURN; END IF;

  SELECT COALESCE(full_name, 'Alguém') INTO actor_name
    FROM profiles WHERE id = p_actor;

  notif_content := CASE p_type
    WHEN 'post_like'        THEN actor_name || ' curtiu seu post'
    WHEN 'post_comment'     THEN actor_name || ' comentou no seu post'
    WHEN 'forum_reply'      THEN actor_name || ' respondeu seu tópico'
    WHEN 'forum_topic_like' THEN actor_name || ' curtiu seu tópico'
    WHEN 'forum_reply_like' THEN actor_name || ' curtiu sua resposta'
    ELSE                         actor_name || ' interagiu com você'
  END;

  notif_link := CASE p_target_type
    WHEN 'post'        THEN '/comunidade/feed'
    WHEN 'forum_topic' THEN '/comunidade/forum/topico/' || p_target_id
    WHEN 'forum_reply' THEN '/comunidade/forum'
    ELSE                    '/'
  END;

  INSERT INTO notifications (
    user_id, recipient_id, actor_id,
    type, target_type, target_id,
    content, link, preview,
    read, read_at
  ) VALUES (
    p_recipient, p_recipient, p_actor,
    p_type, p_target_type, p_target_id,
    notif_content, notif_link, p_preview,
    false, NULL
  );
END;
$$;

-- ===================================================
-- 6. Trigger: like em post
-- ===================================================

CREATE OR REPLACE FUNCTION notify_post_like() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  post_owner   uuid;
  post_caption text;
BEGIN
  SELECT author_id, content INTO post_owner, post_caption
    FROM posts WHERE id = NEW.post_id;
  PERFORM create_notification(
    post_owner, NEW.user_id, 'post_like', 'post', NEW.post_id,
    LEFT(post_caption, 80)
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_post_like ON post_likes;
CREATE TRIGGER trg_notify_post_like
  AFTER INSERT ON post_likes
  FOR EACH ROW EXECUTE FUNCTION notify_post_like();

-- ===================================================
-- 7. Trigger: comentário em post
-- ===================================================

CREATE OR REPLACE FUNCTION notify_post_comment() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  post_owner uuid;
BEGIN
  SELECT author_id INTO post_owner FROM posts WHERE id = NEW.post_id;
  PERFORM create_notification(
    post_owner, NEW.author_id, 'post_comment', 'post', NEW.post_id,
    LEFT(NEW.content, 80)
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_post_comment ON post_comments;
CREATE TRIGGER trg_notify_post_comment
  AFTER INSERT ON post_comments
  FOR EACH ROW EXECUTE FUNCTION notify_post_comment();

-- ===================================================
-- 8. Trigger: reply no fórum
-- ===================================================

CREATE OR REPLACE FUNCTION notify_forum_reply() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  topic_owner uuid;
  topic_title text;
BEGIN
  SELECT author_id, title INTO topic_owner, topic_title
    FROM forum_topics WHERE id = NEW.topic_id;
  PERFORM create_notification(
    topic_owner, NEW.author_id, 'forum_reply', 'forum_topic', NEW.topic_id,
    LEFT(topic_title, 80)
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_forum_reply ON forum_replies;
CREATE TRIGGER trg_notify_forum_reply
  AFTER INSERT ON forum_replies
  FOR EACH ROW EXECUTE FUNCTION notify_forum_reply();

-- ===================================================
-- 9. Trigger: like em tópico do fórum
-- ===================================================

CREATE OR REPLACE FUNCTION notify_forum_topic_like() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  topic_owner uuid;
  topic_title text;
BEGIN
  SELECT author_id, title INTO topic_owner, topic_title
    FROM forum_topics WHERE id = NEW.topic_id;
  PERFORM create_notification(
    topic_owner, NEW.user_id, 'forum_topic_like', 'forum_topic', NEW.topic_id,
    LEFT(topic_title, 80)
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_forum_topic_like ON forum_topic_likes;
CREATE TRIGGER trg_notify_forum_topic_like
  AFTER INSERT ON forum_topic_likes
  FOR EACH ROW EXECUTE FUNCTION notify_forum_topic_like();

-- ===================================================
-- 10. Trigger: like em reply do fórum
-- ===================================================

CREATE OR REPLACE FUNCTION notify_forum_reply_like() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  reply_owner   uuid;
  reply_content text;
BEGIN
  SELECT author_id, content INTO reply_owner, reply_content
    FROM forum_replies WHERE id = NEW.reply_id;
  PERFORM create_notification(
    reply_owner, NEW.user_id, 'forum_reply_like', 'forum_reply', NEW.reply_id,
    LEFT(reply_content, 80)
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_forum_reply_like ON forum_reply_likes;
CREATE TRIGGER trg_notify_forum_reply_like
  AFTER INSERT ON forum_reply_likes
  FOR EACH ROW EXECUTE FUNCTION notify_forum_reply_like();

-- ===================================================
-- 11. Função de agrupamento
-- ===================================================

CREATE OR REPLACE FUNCTION get_grouped_notifications(
  p_user_id uuid,
  p_limit   int DEFAULT 30
)
RETURNS TABLE (
  group_key    text,
  type         text,
  target_type  text,
  target_id    uuid,
  preview      text,
  total_count  bigint,
  unread_count bigint,
  latest_at    timestamptz,
  recent_actors jsonb
)
LANGUAGE sql STABLE AS $$
  SELECT
    n.type || ':' || n.target_type || ':' || n.target_id::text  AS group_key,
    n.type,
    n.target_type,
    n.target_id,
    MAX(n.preview)    AS preview,
    COUNT(*)          AS total_count,
    COUNT(*) FILTER (WHERE n.read_at IS NULL AND n.read = false) AS unread_count,
    MAX(n.created_at) AS latest_at,
    (
      SELECT jsonb_agg(actor_data ORDER BY sub_ts DESC)
      FROM (
        SELECT
          jsonb_build_object(
            'id',         n2.actor_id,
            'name',       p.full_name,
            'avatar',     p.avatar_url,
            'created_at', n2.created_at
          ) AS actor_data,
          n2.created_at AS sub_ts
        FROM notifications n2
        JOIN profiles p ON p.id = n2.actor_id
        WHERE n2.recipient_id = p_user_id
          AND n2.type        = n.type
          AND n2.target_type = n.target_type
          AND n2.target_id   = n.target_id
          AND n2.actor_id IS NOT NULL
        ORDER BY n2.created_at DESC
        LIMIT 3
      ) sub
    ) AS recent_actors
  FROM notifications n
  WHERE n.recipient_id = p_user_id
    AND n.actor_id IS NOT NULL
  GROUP BY n.type, n.target_type, n.target_id
  ORDER BY MAX(n.created_at) DESC
  LIMIT p_limit;
$$;
