import Link from "next/link";

export default function Home() {
  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Nutrition Cookbook</h1>
      <p>
        Browse nutritious recipes with their nutrition facts, filter them by the
        ingredients you want to use, and find or log healthy food places on the
        map.
      </p>
      <ul className="list-disc pl-5">
        <li>
          <Link href="/recipes" className="underline">
            Recipes
          </Link>{" "}
          - filter by ingredient and see nutrition per serving
        </li>
        <li>
          <Link href="/map" className="underline">
            Map
          </Link>{" "}
          - find food places and log new ones
        </li>
      </ul>
    </section>
  );
}
