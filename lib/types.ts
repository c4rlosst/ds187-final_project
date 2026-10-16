export type RecipeIngredient = {
  name: string;
  quantity: string | null;
};

export type Recipe = {
  id: number;
  title: string;
  description: string | null;
  prep_minutes: number | null;
  servings: number | null;
  calories: number | null;
  protein_g: number | null;
  carbs_g: number | null;
  fat_g: number | null;
  fiber_g: number | null;
  steps: string[];
  ingredients: RecipeIngredient[];
};

export const PLACE_CATEGORIES = [
  "restaurant",
  "cafe",
  "grocery",
  "market",
  "other",
] as const;

export type PlaceCategory = (typeof PLACE_CATEGORIES)[number];

export type Place = {
  id: number;
  name: string;
  category: PlaceCategory;
  description: string | null;
  address: string | null;
  lat: number;
  lng: number;
  created_at: string;
};
