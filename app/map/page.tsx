import PlacesExplorer from "@/components/PlacesExplorer";
import { getPlaces } from "@/lib/places";
import { explainSupabaseError } from "@/lib/supabaseErrors";

export default async function MapPage() {
  const { places, error } = await getPlaces();

  return (
    <section className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Food places map</h1>
        <p className="mt-1 text-stone-600">
          Find healthy food places near you, or log one for everyone else to see.
        </p>
      </div>
      {error && (
        <p role="alert" className="alert">
          Could not load places. {explainSupabaseError(error)}
        </p>
      )}
      <PlacesExplorer initialPlaces={places} />
    </section>
  );
}
