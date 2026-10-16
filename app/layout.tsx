import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nutrition Cookbook",
  description:
    "Nutritious recipes you can filter by ingredient, plus a map of food places.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <header className="border-b px-6 py-4">
          <nav className="flex gap-4">
            <Link href="/" className="underline">
              Home
            </Link>
            <Link href="/recipes" className="underline">
              Recipes
            </Link>
            <Link href="/map" className="underline">
              Map
            </Link>
          </nav>
        </header>
        <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-6">
          {children}
        </main>
        <footer className="border-t px-6 py-4">Nutrition Cookbook</footer>
      </body>
    </html>
  );
}
