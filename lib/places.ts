import { createPublicClient } from "@/utils/supabase/public";
import type { Place } from "./types";

export async function getPlaces(): Promise<{
  places: Place[];
  error: string | null;
}> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("places")
    .select("id, name, category, description, address, lat, lng, created_at")
    .order("created_at", { ascending: false })
    .limit(500);
  if (error) return { places: [], error: error.message };
  return { places: data as unknown as Place[], error: null };
}
