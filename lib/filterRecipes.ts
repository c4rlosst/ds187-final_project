import type { Recipe } from "./types";

export type MatchMode = "all" | "any";

export type RecipeMatch = {
  recipe: Recipe;
  /** How many of the selected ingredients this recipe contains. */
  matched: number;
};

/**
 * Filters recipes by the ingredients the user wants.
 * - "all": the recipe must contain every selected ingredient.
 * - "any": the recipe must contain at least one selected ingredient.
 * With nothing selected, every recipe is returned. Results are ordered by the
 * number of matching ingredients (most first), then by title.
 */
export function filterRecipes(
  recipes: Recipe[],
  selected: string[],
  mode: MatchMode,
): RecipeMatch[] {
  const wanted = new Set(selected.map((name) => name.toLowerCase()));

  const matches = recipes.map((recipe) => {
    const names = new Set(recipe.ingredients.map((i) => i.name.toLowerCase()));
    let matched = 0;
    for (const name of wanted) {
      if (names.has(name)) matched += 1;
    }
    return { recipe, matched };
  });

  const kept =
    wanted.size === 0
      ? matches
      : matches.filter(({ matched }) =>
          mode === "all" ? matched === wanted.size : matched > 0,
        );

  return kept.sort(
    (a, b) =>
      b.matched - a.matched || a.recipe.title.localeCompare(b.recipe.title),
  );
}
