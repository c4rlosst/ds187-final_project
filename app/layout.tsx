import type { Metadata } from "next";
import Link from "next/link";
import { AuthProvider } from "@/components/AuthProvider";
import AuthStatus from "@/components/AuthStatus";
import NavLinks from "@/components/NavLinks";
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
        <AuthProvider>
          <header className="border-b border-stone-200 bg-white">
            <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-6 py-3">
              <Link href="/" className="text-lg font-semibold text-emerald-800">
                Nutrition Cookbook
              </Link>
              <div className="flex items-center gap-3">
                <NavLinks />
                <AuthStatus />
              </div>
            </div>
          </header>
          <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-8">
            {children}
          </main>
          <footer className="border-t border-stone-200 bg-white">
            <div className="mx-auto max-w-5xl px-6 py-4 text-sm text-stone-500">
              Nutrition Cookbook
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
