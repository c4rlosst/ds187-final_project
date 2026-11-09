import { z } from "zod";

const environment = z.object({
  MYSQL_HOST: z.string().min(1),
  MYSQL_PORT: z.coerce.number().int().min(1).max(65535).default(3306),
  MYSQL_DATABASE: z.string().regex(/^[a-zA-Z0-9_]+$/),
  MYSQL_USER: z.string().min(1),
  MYSQL_PASSWORD: z.string().min(1),
  MYSQL_TLS: z.enum(["true", "false"]).default("true"),
});

export function mysqlConfig(env = process.env) {
  const result = environment.safeParse(env);
  if (!result.success) {
    const keys = [...new Set(result.error.issues.map((issue) => issue.path[0]))];
    throw new Error(`Check MySQL configuration: ${keys.join(", ")}.`);
  }
  const values = result.data;
  if (env.NODE_ENV === "production" && values.MYSQL_TLS !== "true") {
    throw new Error("MySQL TLS is required in production.");
  }
  return {
    host: values.MYSQL_HOST,
    port: values.MYSQL_PORT,
    database: values.MYSQL_DATABASE,
    user: values.MYSQL_USER,
    password: values.MYSQL_PASSWORD,
    ssl: values.MYSQL_TLS === "true" ? { rejectUnauthorized: true } : undefined,
    charset: "utf8mb4",
    timezone: "Z",
    dateStrings: true,
    supportBigNumbers: true,
    bigNumberStrings: true,
    multipleStatements: false,
  };
}
