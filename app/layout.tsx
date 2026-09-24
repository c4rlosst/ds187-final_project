import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DS187 Final Project",
  description: "DS187 final project",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        <header>
          <nav>Home</nav>
        </header>
        <main>{children}</main>
        <footer>Footer</footer>
      </body>
    </html>
  );
}
