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
      <p role="alert">
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
        <Link href="/recipes" className="underline">
          Back to recipes
        </Link>
      </p>

      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">{recipe.title}</h1>
        {recipe.description && <p>{recipe.description}</p>}
        <p className="text-sm">
          {recipe.prep_minutes ? `${recipe.prep_minutes} min` : null}
          {recipe.prep_minutes && recipe.servings ? " · " : null}
          {recipe.servings
            ? `makes ${recipe.servings} ${recipe.servings === 1 ? "serving" : "servings"}`
            : null}
        </p>
      </header>

      <section>
        <h2 className="mb-2 font-semibold">Nutrition per serving (approximate)</h2>
        <table className="border-collapse">
          <tbody>
            {nutrition.map(([label, value, unit]) => (
              <tr key={label}>
                <th className="border px-3 py-1 text-left font-normal">{label}</th>
                <td className="border px-3 py-1">
                  {value ?? "?"} {unit}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2 className="mb-2 font-semibold">Ingredients</h2>
        <ul className="list-disc pl-5">
          {recipe.ingredients.map((ingredient) => (
            <li key={ingredient.name}>
              {ingredient.quantity ? `${ingredient.quantity} ` : null}
              <span className="capitalize">{ingredient.name}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-2 font-semibold">Steps</h2>
        <ol className="list-decimal pl-5">
          {recipe.steps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      </section>
    </article>
  );
}
