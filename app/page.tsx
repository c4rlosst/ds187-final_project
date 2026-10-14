import MapLoader from "@/components/MapLoader";

export default function Home() {
  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Hello World</h1>
      <div className="h-[60vh] min-h-80 w-full overflow-hidden rounded border">
        <MapLoader />
      </div>
    </section>
  );
}
