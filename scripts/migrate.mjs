import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import mysql from "mysql2/promise";
import { mysqlConfig } from "./mysql-config.mjs";

export async function migrate(connection) {
  const [[lock]] = await connection.execute("SELECT GET_LOCK('palleteplate_migrations', 10) AS acquired");
  if (Number(lock.acquired) !== 1) throw new Error("Another migration is running. Try again later.");
  try {
    await connection.execute(`CREATE TABLE IF NOT EXISTS schema_migrations (
      filename VARCHAR(255) PRIMARY KEY,
      checksum CHAR(64) NOT NULL,
      completed BOOLEAN NOT NULL DEFAULT FALSE,
      applied_at DATETIME(3)
    ) ENGINE=InnoDB`);
    const directory = new URL("../database/migrations/", import.meta.url);
    const files = (await readdir(directory)).filter((name) => /^\d{3}_[a-z_]+\.sql$/.test(name)).sort();
    const [history] = await connection.execute("SELECT filename, checksum, completed FROM schema_migrations");
    for (const previous of history) {
      if (!files.includes(previous.filename)) throw new Error(`Missing applied migration: ${previous.filename}`);
    }
    for (const filename of files) {
      const sql = await readFile(new URL(filename, directory), "utf8");
      const checksum = createHash("sha256").update(sql).digest("hex");
      const previous = history.find((row) => row.filename === filename);
      if (previous) {
        if (previous.checksum !== checksum) throw new Error(`Applied migration changed: ${filename}`);
        if (!previous.completed) throw new Error(`Incomplete migration: ${filename}. Inspect the schema before repairing migration history.`);
        continue;
      }
      await connection.execute("INSERT INTO schema_migrations (filename, checksum) VALUES (?, ?)", [filename, checksum]);
      // MySQL DDL commits implicitly. Record an incomplete migration rather than retrying partial DDL.
      for (const statement of sql.split(";").map((part) => part.trim()).filter(Boolean)) {
        await connection.query(statement);
      }
      await connection.execute("UPDATE schema_migrations SET completed = TRUE, applied_at = UTC_TIMESTAMP(3) WHERE filename = ?", [filename]);
    }
  } finally {
    await connection.execute("SELECT RELEASE_LOCK('palleteplate_migrations')");
  }
}

if (process.argv[1] && import.meta.url === (await import("node:url")).pathToFileURL(process.argv[1]).href) {
  const connection = await mysql.createConnection(mysqlConfig());
  try {
    await migrate(connection);
    console.log("Database migrations are up to date.");
  } finally {
    await connection.end();
  }
}
