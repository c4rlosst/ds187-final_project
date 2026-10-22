import Link from "next/link";

export default function Home() {
  return (
    <section className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <p className="text-lg font-medium text-emerald-800">Hello World</p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Nourio
        </h1>
        <p className="max-w-2xl text-lg text-stone-600">
          Browse nutritious recipes with their nutrition facts, filter them by
          the ingredients you want to use, and find or log healthy food places
          on the map.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/recipes"
          className="card block transition-shadow hover:shadow-md"
        >
          <h2 className="text-lg font-semibold text-emerald-900">Recipes</h2>
          <p className="mt-1 text-stone-600">
            Filter by the ingredients you have and see nutrition per serving.
          </p>
        </Link>
        <Link
          href="/map"
          className="card block transition-shadow hover:shadow-md"
        >
          <h2 className="text-lg font-semibold text-emerald-900">Map</h2>
          <p className="mt-1 text-stone-600">
            Find food places near you and log new ones for everyone to see.
          </p>
        </Link>
      </div>
    </section>
  );
}
