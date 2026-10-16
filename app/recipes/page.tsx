import RecipeBrowser from "@/components/RecipeBrowser";
import { getRecipes } from "@/lib/recipes";
import { explainSupabaseError } from "@/lib/supabaseErrors";

export default async function RecipesPage() {
  const { recipes, error } = await getRecipes();

  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Recipes</h1>
      {error ? (
        <p role="alert">Could not load recipes. {explainSupabaseError(error)}</p>
      ) : (
        <RecipeBrowser recipes={recipes} />
      )}
    </section>
  );
}
