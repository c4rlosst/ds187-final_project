"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { filterRecipes, type MatchMode } from "@/lib/filterRecipes";
import type { Recipe } from "@/lib/types";

export default function RecipeBrowser({ recipes }: { recipes: Recipe[] }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [mode, setMode] = useState<MatchMode>("all");
  const [search, setSearch] = useState("");

  const allIngredients = useMemo(
    () =>
      [...new Set(recipes.flatMap((r) => r.ingredients.map((i) => i.name)))].sort(),
    [recipes],
  );

  const term = search.trim().toLowerCase();
  // Selected ingredients stay visible so they can always be unchecked.
  const visibleIngredients = allIngredients.filter(
    (name) => selected.includes(name) || name.includes(term),
  );

  const results = useMemo(
    () => filterRecipes(recipes, selected, mode),
    [recipes, selected, mode],
  );

  function toggle(name: string) {
    setSelected((current) =>
      current.includes(name)
        ? current.filter((n) => n !== name)
        : [...current, name],
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-[16rem_1fr]">
      <aside className="flex flex-col gap-3">
        <h2 className="font-semibold">Ingredients</h2>

        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search ingredients"
          aria-label="Search ingredients"
          className="rounded border px-2 py-1"
        />

        <fieldset className="flex flex-col gap-1">
          <legend className="mb-1 text-sm">Show recipes that contain</legend>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="mode"
              checked={mode === "all"}
              onChange={() => setMode("all")}
            />
            all selected
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="mode"
              checked={mode === "any"}
              onChange={() => setMode("any")}
            />
            any selected
          </label>
        </fieldset>

        <div className="flex items-center justify-between text-sm">
          <span>{selected.length} selected</span>
          <button
            type="button"
            onClick={() => setSelected([])}
            disabled={selected.length === 0}
            className="underline disabled:no-underline disabled:opacity-40"
          >
            Clear
          </button>
        </div>

        <ul className="flex max-h-96 flex-col gap-1 overflow-y-auto">
          {visibleIngredients.map((name) => (
            <li key={name}>
              <label className="flex items-center gap-2 capitalize">
                <input
                  type="checkbox"
                  checked={selected.includes(name)}
                  onChange={() => toggle(name)}
                />
                {name}
              </label>
            </li>
          ))}
          {visibleIngredients.length === 0 && (
            <li className="text-sm">No ingredients match.</li>
          )}
        </ul>
      </aside>

      <section className="flex flex-col gap-4">
        <h2 className="font-semibold">
          {results.length} {results.length === 1 ? "recipe" : "recipes"}
        </h2>

        {results.length === 0 && (
          <p>
            {recipes.length === 0
              ? "No recipes yet."
              : "No recipes match those ingredients. Try \"any selected\" or remove an ingredient."}
          </p>
        )}

        <ul className="flex flex-col gap-4">
          {results.map(({ recipe, matched }) => (
            <li key={recipe.id} className="rounded border p-4">
              <h3 className="text-lg font-semibold">
                <Link href={`/recipes/${recipe.id}`} className="underline">
                  {recipe.title}
                </Link>
              </h3>
              {recipe.description && <p>{recipe.description}</p>}

              <p className="mt-2 text-sm">
                {recipe.calories ?? "?"} kcal · protein {recipe.protein_g ?? "?"} g ·
                carbs {recipe.carbs_g ?? "?"} g · fat {recipe.fat_g ?? "?"} g ·
                fiber {recipe.fiber_g ?? "?"} g
                {recipe.servings && recipe.servings > 1
                  ? ` per serving (makes ${recipe.servings})`
                  : " per serving"}
              </p>

              <p className="mt-2 text-sm capitalize">
                {recipe.ingredients.map((ingredient, index) => (
                  <span
                    key={ingredient.name}
                    className={
                      selected.includes(ingredient.name) ? "font-bold" : undefined
                    }
                  >
                    {index > 0 && ", "}
                    {ingredient.name}
                  </span>
                ))}
              </p>

              {selected.length > 0 && (
                <p className="mt-1 text-sm">
                  Matches {matched} of {selected.length} selected
                </p>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
