import AuthForm from "@/components/AuthForm";

/** Only allow redirects to paths on this site, never to another host. */
function safeNext(value: string | string[] | undefined): string {
  if (typeof value !== "string") return "/";
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return "/";
  }
  return value;
}

export default async function LoginPage(props: PageProps<"/login">) {
  const { next } = await props.searchParams;

  return (
    <section className="mx-auto w-full max-w-sm">
      <AuthForm next={safeNext(next)} />
    </section>
  );
}
