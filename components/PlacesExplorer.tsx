"use client";

import { type FormEvent, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { explainSupabaseError } from "@/lib/supabaseErrors";
import {
  PLACE_CATEGORIES,
  type Place,
  type PlaceCategory,
} from "@/lib/types";
import type { FlyTarget } from "./PlacesMap";
import PlacesMapLoader from "./PlacesMapLoader";

// Placeholder center, used until there are places to center on.
const DEFAULT_CENTER: [number, number] = [14.5995, 120.9842];

type FormState = {
  name: string;
  category: PlaceCategory;
  description: string;
  address: string;
};

const EMPTY_FORM: FormState = {
  name: "",
  category: "restaurant",
  description: "",
  address: "",
};

function centerOf(places: Place[]): [number, number] {
  if (places.length === 0) return DEFAULT_CENTER;
  const lat = places.reduce((sum, p) => sum + p.lat, 0) / places.length;
  const lng = places.reduce((sum, p) => sum + p.lng, 0) / places.length;
  return [lat, lng];
}

export default function PlacesExplorer({
  initialPlaces,
}: {
  initialPlaces: Place[];
}) {
  const [places, setPlaces] = useState(initialPlaces);
  const [center] = useState(() => centerOf(initialPlaces));
  const [flyTo, setFlyTo] = useState<FlyTarget | null>(null);

  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState<[number, number] | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchMessage, setSearchMessage] = useState<string | null>(null);

  function startAdding() {
    setAdding(true);
    setFormError(null);
  }

  function cancelAdding() {
    setAdding(false);
    setDraft(null);
    setForm(EMPTY_FORM);
    setFormError(null);
  }

  async function search(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;

    setSearching(true);
    setSearchMessage(null);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(q)}`,
      );
      if (!res.ok) throw new Error(`Search failed (${res.status}).`);
      const results = (await res.json()) as {
        lat: string;
        lon: string;
        display_name: string;
      }[];
      if (results.length === 0) {
        setSearchMessage("No results found.");
        return;
      }
      const lat = Number(results[0].lat);
      const lng = Number(results[0].lon);
      setFlyTo({ lat, lng });
      if (adding) {
        setDraft([lat, lng]);
        setForm((f) => ({ ...f, address: f.address || results[0].display_name }));
      }
    } catch (err) {
      setSearchMessage(err instanceof Error ? err.message : "Search failed.");
    } finally {
      setSearching(false);
    }
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    const name = form.name.trim();
    if (!draft) {
      setFormError("Click the map or search an address to set the location.");
      return;
    }
    if (!name) {
      setFormError("Name is required.");
      return;
    }

    setSaving(true);
    setFormError(null);
    const { data, error } = await createClient()
      .from("places")
      .insert({
        name,
        category: form.category,
        description: form.description.trim() || null,
        address: form.address.trim() || null,
        lat: draft[0],
        lng: draft[1],
      })
      .select();
    setSaving(false);

    if (error || !data || data.length === 0) {
      setFormError(
        error ? explainSupabaseError(error.message) : "Could not save the place.",
      );
      return;
    }

    const place = data[0] as Place;
    setPlaces((current) => [place, ...current]);
    setFlyTo({ lat: place.lat, lng: place.lng });
    cancelAdding();
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_20rem]">
      <div className="h-[60vh] min-h-80 w-full overflow-hidden rounded border">
        <PlacesMapLoader
          places={places}
          center={center}
          picking={adding}
          draft={draft}
          onPick={(lat, lng) => setDraft([lat, lng])}
          flyTo={flyTo}
        />
      </div>

      <div className="flex flex-col gap-4">
        <form onSubmit={search} className="flex gap-2">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search an address or place"
            aria-label="Search an address or place"
            className="min-w-0 flex-1 rounded border px-2 py-1"
          />
          <button
            type="submit"
            disabled={searching}
            className="rounded border px-3 py-1 disabled:opacity-50"
          >
            {searching ? "Searching..." : "Search"}
          </button>
        </form>
        {searchMessage && <p role="status">{searchMessage}</p>}

        {!adding ? (
          <button
            type="button"
            onClick={startAdding}
            className="rounded border px-3 py-1"
          >
            Log a food place
          </button>
        ) : (
          <form onSubmit={save} className="flex flex-col gap-3 rounded border p-3">
            <h2 className="font-semibold">Log a food place</h2>
            <p className="text-sm">
              {draft
                ? `Location set (${draft[0].toFixed(5)}, ${draft[1].toFixed(5)}). Drag the pin to adjust.`
                : "Click the map or search an address to set the location."}
            </p>

            <label className="flex flex-col gap-1 text-sm">
              Name
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                maxLength={100}
                required
                className="rounded border px-2 py-1"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm">
              Category
              <select
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value as PlaceCategory })
                }
                className="rounded border px-2 py-1 capitalize"
              >
                {PLACE_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1 text-sm">
              Description (optional)
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                maxLength={500}
                rows={3}
                className="rounded border px-2 py-1"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm">
              Address (optional)
              <input
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                maxLength={300}
                className="rounded border px-2 py-1"
              />
            </label>

            {formError && <p role="alert">{formError}</p>}

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded border px-3 py-1 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save place"}
              </button>
              <button
                type="button"
                onClick={cancelAdding}
                disabled={saving}
                className="rounded border px-3 py-1"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <section>
          <h2 className="mb-2 font-semibold">
            {places.length} {places.length === 1 ? "place" : "places"}
          </h2>
          {places.length === 0 ? (
            <p className="text-sm">No places logged yet. Be the first.</p>
          ) : (
            <ul className="flex max-h-72 flex-col gap-1 overflow-y-auto">
              {places.map((place) => (
                <li key={place.id}>
                  <button
                    type="button"
                    onClick={() => setFlyTo({ lat: place.lat, lng: place.lng })}
                    className="w-full text-left underline"
                  >
                    {place.name}
                  </button>{" "}
                  <span className="text-sm capitalize">({place.category})</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
