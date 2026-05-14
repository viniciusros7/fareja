-- Adiciona coluna de mensagem de aprovação
ALTER TABLE kennel_applications
ADD COLUMN IF NOT EXISTS approval_message text;

-- RPC: aprovação atômica — atualiza candidatura + cria canil
CREATE OR REPLACE FUNCTION approve_kennel_application(
  application_id uuid,
  reviewer_id uuid,
  approval_message text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  app_record kennel_applications%ROWTYPE;
  new_kennel_id uuid;
  new_slug text;
  base_slug text;
  suffix int := 0;
  founder_count int;
  is_new_founder boolean;
BEGIN
  SELECT * INTO app_record FROM kennel_applications WHERE id = application_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Candidatura não encontrada';
  END IF;
  IF app_record.status != 'pending' THEN
    RAISE EXCEPTION 'Candidatura já foi processada';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM profiles WHERE id = reviewer_id AND role IN ('super_admin', 'approver')
  ) THEN
    RAISE EXCEPTION 'Sem permissão para aprovar';
  END IF;

  -- Gera slug único baseado no nome do canil
  base_slug := lower(regexp_replace(
    unaccent(app_record.kennel_name),
    '[^a-z0-9]+', '-', 'g'
  ));
  base_slug := trim(both '-' from base_slug);
  new_slug := base_slug;
  WHILE EXISTS (SELECT 1 FROM kennels WHERE slug = new_slug) LOOP
    suffix := suffix + 1;
    new_slug := base_slug || '-' || suffix;
  END LOOP;

  -- Cria o canil
  INSERT INTO kennels (
    owner_id, name, slug, description, city, state,
    phone, email, kc_registry, kc_entity, plan, status,
    breeds, years_active
  ) VALUES (
    app_record.user_id,
    app_record.kennel_name,
    new_slug,
    '',
    app_record.city,
    app_record.state,
    COALESCE(app_record.phone, ''),
    app_record.email,
    'A preencher',
    CASE WHEN app_record.has_cbkc THEN 'CBKC' ELSE 'Outro' END,
    app_record.suggested_plan,
    'approved',
    ARRAY[app_record.breed],
    app_record.experience_years
  ) RETURNING id INTO new_kennel_id;

  -- Atualiza candidatura
  UPDATE kennel_applications
  SET
    status = 'approved',
    reviewed_by = reviewer_id,
    reviewed_at = now(),
    updated_at = now(),
    approval_message = approve_kennel_application.approval_message
  WHERE id = application_id;

  -- Promove role do dono para kennel + verifica founder
  SELECT COUNT(*) INTO founder_count FROM profiles WHERE is_founder = true;
  is_new_founder := founder_count < 10;

  UPDATE profiles
  SET
    role = 'kennel',
    is_founder = CASE WHEN is_new_founder THEN true ELSE is_founder END,
    founder_number = CASE WHEN is_new_founder THEN founder_count + 1 ELSE founder_number END,
    founder_free_until = CASE WHEN is_new_founder THEN now() + interval '1 year' ELSE founder_free_until END
  WHERE id = app_record.user_id;

  RETURN new_kennel_id;
END;
$$;

-- RPC: rejeição
CREATE OR REPLACE FUNCTION reject_kennel_application(
  application_id uuid,
  reviewer_id uuid,
  reason text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF reason IS NULL OR length(trim(reason)) = 0 THEN
    RAISE EXCEPTION 'Motivo de rejeição é obrigatório';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM profiles WHERE id = reviewer_id AND role IN ('super_admin', 'approver')
  ) THEN
    RAISE EXCEPTION 'Sem permissão para rejeitar';
  END IF;

  UPDATE kennel_applications
  SET
    status = 'rejected',
    reject_reason = reason,
    reviewed_by = reviewer_id,
    reviewed_at = now(),
    updated_at = now()
  WHERE id = application_id AND status = 'pending';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Candidatura não encontrada ou já processada';
  END IF;
END;
$$;
