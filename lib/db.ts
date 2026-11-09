import "server-only";
import mysql, { type Pool } from "mysql2/promise";
import { mysqlConfig } from "@/scripts/mysql-config.mjs";

const globalDatabase = globalThis as typeof globalThis & { mysqlPool?: Pool };

export function database(): Pool {
  globalDatabase.mysqlPool ??= mysql.createPool({
    ...mysqlConfig(),
    connectionLimit: 5,
    maxIdle: 5,
    idleTimeout: 60_000,
    waitForConnections: true,
    queueLimit: 20,
  });
  return globalDatabase.mysqlPool;
}
