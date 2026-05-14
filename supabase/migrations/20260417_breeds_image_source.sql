-- Adiciona coluna image_source à tabela breeds
-- Prioridade de renderização: curated > kennel_provided > dog_api

alter table public.breeds
  add column if not exists image_source text
    check (image_source in ('curated', 'kennel_provided', 'dog_api'));

-- Raças reservadas para o Canil Good Leisure
-- (Golden Retriever e Beagle ficam sem image_url até o canil fornecer)
update public.breeds
  set image_source = 'kennel_provided'
  where name_en in ('Golden Retriever', 'Beagle');
