import Link from "next/link";
import { notFound } from "next/navigation";
import { getRecipe } from "@/lib/recipes";
import { explainSupabaseError } from "@/lib/supabaseErrors";

export default async function RecipePage(props: PageProps<"/recipes/[id]">) {
  const { id } = await props.params;
  const recipeId = Number(id);
  if (!Number.isInteger(recipeId)) notFound();

  const { recipe, error } = await getRecipe(recipeId);
  if (error) {
    return (
      <p role="alert" className="alert">
        Could not load this recipe. {explainSupabaseError(error)}
      </p>
    );
  }
  if (!recipe) notFound();

  const nutrition: [string, number | null, string][] = [
    ["Calories", recipe.calories, "kcal"],
    ["Protein", recipe.protein_g, "g"],
    ["Carbs", recipe.carbs_g, "g"],
    ["Fat", recipe.fat_g, "g"],
    ["Fiber", recipe.fiber_g, "g"],
  ];

  return (
    <article className="flex flex-col gap-6">
      <p>
        <Link href="/recipes" className="link text-sm">
          &larr; Back to recipes
        </Link>
      </p>

      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">{recipe.title}</h1>
        {recipe.description && (
          <p className="text-lg text-stone-600">{recipe.description}</p>
        )}
        <div className="flex flex-wrap gap-2">
          {recipe.prep_minutes && (
            <span className="badge">{recipe.prep_minutes} min</span>
          )}
          {recipe.servings && (
            <span className="badge">
              makes {recipe.servings}{" "}
              {recipe.servings === 1 ? "serving" : "servings"}
            </span>
          )}
        </div>
      </header>

      <section>
        <h2 className="mb-2 font-semibold">
          Nutrition per serving{" "}
          <span className="text-sm font-normal text-stone-500">(approximate)</span>
        </h2>
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {nutrition.map(([label, value, unit]) => (
            <div key={label} className="card p-3 text-center">
              <dd className="text-xl font-semibold text-emerald-900">
                {value ?? "?"}
                <span className="ml-1 text-sm font-normal text-stone-500">
                  {unit}
                </span>
              </dd>
              <dt className="text-sm text-stone-600">{label}</dt>
            </div>
          ))}
        </dl>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="card">
          <h2 className="mb-2 font-semibold">Ingredients</h2>
          <ul className="flex flex-col gap-1 text-stone-700">
            {recipe.ingredients.map((ingredient) => (
              <li key={ingredient.name}>
                <span className="capitalize">{ingredient.name}</span>
                {ingredient.quantity && (
                  <span className="text-stone-500"> &mdash; {ingredient.quantity}</span>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section className="card">
          <h2 className="mb-2 font-semibold">Steps</h2>
          <ol className="flex list-decimal flex-col gap-2 pl-5 text-stone-700 marker:font-semibold marker:text-emerald-700">
            {recipe.steps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </section>
      </div>
    </article>
  );
}
