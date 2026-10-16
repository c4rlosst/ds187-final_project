import RecipeBrowser from "@/components/RecipeBrowser";
import { getRecipes } from "@/lib/recipes";
import { explainSupabaseError } from "@/lib/supabaseErrors";

export default async function RecipesPage() {
  const { recipes, error } = await getRecipes();

  return (
    <section className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Recipes</h1>
        <p className="mt-1 text-stone-600">
          Pick the ingredients you want to cook with and see what matches.
        </p>
      </div>
      {error ? (
        <p role="alert" className="alert">
          Could not load recipes. {explainSupabaseError(error)}
        </p>
      ) : (
        <RecipeBrowser recipes={recipes} />
      )}
    </section>
  );
}
