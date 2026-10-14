import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DS187 Final Project",
  description: "DS187 final project",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <header className="border-b px-6 py-4">
          <nav>Home</nav>
        </header>
        <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-6">
          {children}
        </main>
        <footer className="border-t px-6 py-4">Footer</footer>
      </body>
    </html>
  );
}
