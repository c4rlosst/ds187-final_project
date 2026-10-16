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
    <div className="grid items-start gap-6 md:grid-cols-[16rem_1fr]">
      <aside className="card flex flex-col gap-3 md:sticky md:top-4">
        <h2 className="font-semibold">Ingredients</h2>

        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search ingredients"
          aria-label="Search ingredients"
          className="input"
        />

        <fieldset className="flex flex-col gap-1 text-sm">
          <legend className="mb-1 text-stone-600">Show recipes that contain</legend>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="mode"
              className="accent-emerald-700"
              checked={mode === "all"}
              onChange={() => setMode("all")}
            />
            all selected
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="mode"
              className="accent-emerald-700"
              checked={mode === "any"}
              onChange={() => setMode("any")}
            />
            any selected
          </label>
        </fieldset>

        <div className="flex items-center justify-between text-sm text-stone-600">
          <span>{selected.length} selected</span>
          <button
            type="button"
            onClick={() => setSelected([])}
            disabled={selected.length === 0}
            className="link disabled:cursor-not-allowed disabled:no-underline disabled:opacity-40"
          >
            Clear
          </button>
        </div>

        <ul className="flex max-h-80 flex-col gap-1 overflow-y-auto border-t border-stone-200 pt-3 text-sm">
          {visibleIngredients.map((name) => (
            <li key={name}>
              <label className="flex items-center gap-2 capitalize">
                <input
                  type="checkbox"
                  className="accent-emerald-700"
                  checked={selected.includes(name)}
                  onChange={() => toggle(name)}
                />
                {name}
              </label>
            </li>
          ))}
          {visibleIngredients.length === 0 && (
            <li className="text-stone-500">No ingredients match.</li>
          )}
        </ul>
      </aside>

      <section className="flex flex-col gap-4">
        <h2 className="font-semibold text-stone-700">
          {results.length} {results.length === 1 ? "recipe" : "recipes"}
        </h2>

        {results.length === 0 && (
          <p className="card text-stone-600">
            {recipes.length === 0
              ? "No recipes yet."
              : "No recipes match those ingredients. Try \"any selected\" or remove an ingredient."}
          </p>
        )}

        <ul className="flex flex-col gap-4">
          {results.map(({ recipe, matched }) => (
            <li key={recipe.id} className="card transition-shadow hover:shadow-md">
              <h3 className="text-lg font-semibold">
                <Link
                  href={`/recipes/${recipe.id}`}
                  className="hover:text-emerald-800 hover:underline"
                >
                  {recipe.title}
                </Link>
              </h3>
              {recipe.description && (
                <p className="mt-1 text-stone-600">{recipe.description}</p>
              )}

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="badge badge-accent">
                  {recipe.calories ?? "?"} kcal
                </span>
                <span className="badge">protein {recipe.protein_g ?? "?"} g</span>
                <span className="badge">carbs {recipe.carbs_g ?? "?"} g</span>
                <span className="badge">fat {recipe.fat_g ?? "?"} g</span>
                <span className="badge">fiber {recipe.fiber_g ?? "?"} g</span>
                <span className="text-xs text-stone-500">
                  per serving
                  {recipe.servings && recipe.servings > 1
                    ? ` (makes ${recipe.servings})`
                    : ""}
                </span>
              </div>

              <p className="mt-3 text-sm capitalize text-stone-600">
                {recipe.ingredients.map((ingredient, index) => (
                  <span
                    key={ingredient.name}
                    className={
                      selected.includes(ingredient.name)
                        ? "font-semibold text-emerald-800"
                        : undefined
                    }
                  >
                    {index > 0 && ", "}
                    {ingredient.name}
                  </span>
                ))}
              </p>

              {selected.length > 0 && (
                <p className="mt-2 text-sm font-medium text-emerald-800">
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
