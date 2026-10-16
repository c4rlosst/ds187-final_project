import { createClient } from "@/utils/supabase/server";
import type { Recipe } from "./types";

type RecipeRow = Omit<Recipe, "ingredients"> & {
  recipe_ingredients: {
    quantity: string | null;
    ingredients: { name: string } | null;
  }[];
};

const COLUMNS =
  "id, title, description, prep_minutes, servings, calories, protein_g, carbs_g, fat_g, fiber_g, steps, recipe_ingredients(quantity, ingredients(name))";

function toRecipe({ recipe_ingredients, ...row }: RecipeRow): Recipe {
  const ingredients = recipe_ingredients
    .filter((ri) => ri.ingredients !== null)
    .map((ri) => ({ name: ri.ingredients!.name, quantity: ri.quantity }))
    .sort((a, b) => a.name.localeCompare(b.name));
  return { ...row, ingredients };
}

export async function getRecipes(): Promise<{
  recipes: Recipe[];
  error: string | null;
}> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("recipes")
    .select(COLUMNS)
    .order("title");
  if (error) return { recipes: [], error: error.message };
  return { recipes: (data as unknown as RecipeRow[]).map(toRecipe), error: null };
}

export async function getRecipe(id: number): Promise<{
  recipe: Recipe | null;
  error: string | null;
}> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("recipes")
    .select(COLUMNS)
    .eq("id", id)
    .limit(1);
  if (error) return { recipe: null, error: error.message };
  const rows = data as unknown as RecipeRow[];
  return { recipe: rows.length > 0 ? toRecipe(rows[0]) : null, error: null };
}
