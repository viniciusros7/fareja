# F13b — Passos Manuais para Produção

## 1. Google Cloud Console

**URL:** https://console.cloud.google.com → APIs & Services → Credentials → seu OAuth 2.0 Client ID

### Authorized JavaScript origins
Adicionar:
```
https://fareja.app.br
https://www.fareja.app.br
```

### Authorized redirect URIs
Adicionar (se ainda não estiver):
```
https://foeggiigkqvxmqnibkst.supabase.co/auth/v1/callback
```

### OAuth consent screen
- **Home page URL:** `https://fareja.app.br`
- **Privacy policy URL:** `https://fareja.app.br/privacidade`
- **Terms of service URL:** `https://fareja.app.br/termos`
- **Authorized domains:** adicionar `fareja.app.br`

---

## 2. Microsoft Azure (portal.azure.com)

### Criar App Registration

1. Azure Active Directory → App registrations → New registration
2. **Name:** Fareja
3. **Supported account types:** Accounts in any organizational directory and personal Microsoft accounts
4. **Redirect URI:** Web → `https://foeggiigkqvxmqnibkst.supabase.co/auth/v1/callback`
5. Clique em **Register**

### Gerar Client Secret

1. Certificates & secrets → New client secret
2. Description: `Fareja Production`
3. Expires: 24 months (ou o prazo desejado)
4. Copiar o **Value** (só aparece uma vez)

### Configurar no Supabase

1. Dashboard Supabase → Authentication → Providers → Azure
2. **Client ID:** (Application ID da Azure)
3. **Client Secret:** (Value gerado acima)
4. **Tenant:** `common`
5. Salvar

---

## 3. Apple Sign In

1. https://developer.apple.com → Certificates, IDs & Profiles → Keys
2. Criar uma Service ID com `Sign In with Apple` ativado
3. **Return URLs:** `https://foeggiigkqvxmqnibkst.supabase.co/auth/v1/callback`
4. Dashboard Supabase → Authentication → Providers → Apple
5. Colar **Service ID**, **Team ID**, **Key ID**, e o conteúdo do `.p8`

---

## 4. Vercel — Environment Variables

URL: https://vercel.com → projeto fareja → Settings → Environment Variables

Adicionar/confirmar (em **Production + Preview + Development**):

| Variável | Valor |
|----------|-------|
| `NEXT_PUBLIC_SITE_URL` | `https://fareja.app.br` |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://foeggiigkqvxmqnibkst.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (chave anon do Supabase) |
| `NEXT_PUBLIC_INSTAGRAM_URL` | `https://instagram.com/fareja` |
| `SUPABASE_SERVICE_ROLE_KEY` | (chave service role — só Production) |
| `R2_ACCOUNT_ID` | (Cloudflare account ID) |
| `R2_ACCESS_KEY_ID` | (chave R2) |
| `R2_SECRET_ACCESS_KEY` | (secret R2) |
| `R2_BUCKET_NAME` | (nome do bucket) |
| `R2_PUBLIC_URL` | (URL pública do bucket R2) |

> ⚠️ `SUPABASE_SERVICE_ROLE_KEY` e as variáveis `R2_*` sem `NEXT_PUBLIC_` são server-only — configure apenas em **Production** (não expor em Preview/Development se não necessário).

---

## 5. Supabase — Allowed Redirect URLs

1. Dashboard Supabase → Authentication → URL Configuration
2. **Site URL:** `https://fareja.app.br`
3. **Redirect URLs:** adicionar:
   ```
   https://fareja.app.br/auth/callback
   https://www.fareja.app.br/auth/callback
   http://localhost:3000/auth/callback
   ```

---

## 6. Supabase — DDL Pendente (F13.7)

Executar no SQL Editor (Dashboard → SQL Editor):

```sql
-- BUG-15: Incremento atômico de views
CREATE OR REPLACE FUNCTION increment_topic_views(topic_id uuid)
RETURNS void AS $$
  UPDATE forum_topics SET views_count = views_count + 1 WHERE id = topic_id;
$$ LANGUAGE sql;

-- BUG-19: Toggle likes atômicos
CREATE OR REPLACE FUNCTION toggle_post_like(p_post_id uuid, p_user_id uuid)
RETURNS TABLE(liked boolean, likes_count bigint) AS $$
DECLARE v_liked boolean; v_count bigint;
BEGIN
  IF EXISTS (SELECT 1 FROM post_likes WHERE post_id = p_post_id AND user_id = p_user_id) THEN
    DELETE FROM post_likes WHERE post_id = p_post_id AND user_id = p_user_id;
    v_liked := false;
  ELSE
    INSERT INTO post_likes (post_id, user_id) VALUES (p_post_id, p_user_id);
    v_liked := true;
  END IF;
  SELECT COUNT(*) INTO v_count FROM post_likes WHERE post_id = p_post_id;
  UPDATE posts SET likes_count = v_count WHERE id = p_post_id;
  RETURN QUERY SELECT v_liked, v_count;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION toggle_topic_like(p_topic_id uuid, p_user_id uuid)
RETURNS TABLE(liked boolean, likes_count bigint) AS $$
DECLARE v_liked boolean; v_count bigint;
BEGIN
  IF EXISTS (SELECT 1 FROM forum_topic_likes WHERE topic_id = p_topic_id AND user_id = p_user_id) THEN
    DELETE FROM forum_topic_likes WHERE topic_id = p_topic_id AND user_id = p_user_id;
    v_liked := false;
  ELSE
    INSERT INTO forum_topic_likes (topic_id, user_id) VALUES (p_topic_id, p_user_id);
    v_liked := true;
  END IF;
  SELECT COUNT(*) INTO v_count FROM forum_topic_likes WHERE topic_id = p_topic_id;
  UPDATE forum_topics SET likes_count = v_count WHERE id = p_topic_id;
  RETURN QUERY SELECT v_liked, v_count;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION toggle_reply_like(p_reply_id uuid, p_user_id uuid)
RETURNS TABLE(liked boolean, likes_count bigint) AS $$
DECLARE v_liked boolean; v_count bigint;
BEGIN
  IF EXISTS (SELECT 1 FROM forum_reply_likes WHERE reply_id = p_reply_id AND user_id = p_user_id) THEN
    DELETE FROM forum_reply_likes WHERE reply_id = p_reply_id AND user_id = p_user_id;
    v_liked := false;
  ELSE
    INSERT INTO forum_reply_likes (reply_id, user_id) VALUES (p_reply_id, p_user_id);
    v_liked := true;
  END IF;
  SELECT COUNT(*) INTO v_count FROM forum_reply_likes WHERE reply_id = p_reply_id;
  UPDATE forum_replies SET likes_count = v_count WHERE id = p_reply_id;
  RETURN QUERY SELECT v_liked, v_count;
END;
$$ LANGUAGE plpgsql;
```
