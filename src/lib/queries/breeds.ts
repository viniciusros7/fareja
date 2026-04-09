import { createClient } from "@/lib/supabase/server";

export type BreedRow = {
  id: string;
  name_pt: string;
  name_en: string;
  breed_group: string | null;
  size: "small" | "medium" | "large" | "giant" | null;
  coat: "short" | "medium" | "long" | "hairless" | null;
  energy_level: number | null;
  grooming_needs: number | null;
  trainability: number | null;
  friendliness: number | null;
  good_with_kids: boolean | null;
  good_for_apartments: boolean | null;
  exercise_needs: number | null;
  shedding_level: number | null;
  weight_min_kg: number | null;
  weight_max_kg: number | null;
  height_min_cm: number | null;
  height_max_cm: number | null;
  life_span_min: number | null;
  life_span_max: number | null;
  temperament_pt: string | null;
  description_pt: string | null;
  image_url: string | null;
  created_at: string;
};

export type BreedFilters = {
  size?: "small" | "medium" | "large" | "giant";
  coat?: "short" | "medium" | "long" | "hairless";
  energy_level?: number;
  good_with_kids?: boolean;
  good_for_apartments?: boolean;
  breed_group?: string;
};

export async function getBreeds(): Promise<BreedRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("breeds")
    .select("*")
    .order("name_pt");
  if (error) throw error;
  return data as BreedRow[];
}

export async function getBreedById(id: string): Promise<BreedRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("breeds")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return data as BreedRow;
}

export async function getBreedByName(name: string): Promise<BreedRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("breeds")
    .select("*")
    .ilike("name_pt", name)
    .single();
  if (error) return null;
  return data as BreedRow;
}

export async function getBreedsByFilter(filters: BreedFilters): Promise<BreedRow[]> {
  const supabase = await createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query: any = supabase.from("breeds").select("*").order("name_pt");

  if (filters.size) query = query.eq("size", filters.size);
  if (filters.coat) query = query.eq("coat", filters.coat);
  if (filters.energy_level !== undefined) query = query.eq("energy_level", filters.energy_level);
  if (filters.good_with_kids !== undefined) query = query.eq("good_with_kids", filters.good_with_kids);
  if (filters.good_for_apartments !== undefined) query = query.eq("good_for_apartments", filters.good_for_apartments);
  if (filters.breed_group) query = query.eq("breed_group", filters.breed_group);

  const { data, error } = await query;
  if (error) throw error;
  return data as BreedRow[];
}
