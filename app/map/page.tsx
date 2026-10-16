import PlacesExplorer from "@/components/PlacesExplorer";
import { getPlaces } from "@/lib/places";
import { explainSupabaseError } from "@/lib/supabaseErrors";

export default async function MapPage() {
  const { places, error } = await getPlaces();

  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Food places map</h1>
      <p>
        Find healthy food places near you, or log one for everyone else to see.
      </p>
      {error && (
        <p role="alert">Could not load places. {explainSupabaseError(error)}</p>
      )}
      <PlacesExplorer initialPlaces={places} />
    </section>
  );
}
