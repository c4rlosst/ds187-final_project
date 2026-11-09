import assert from "node:assert/strict";
import { createHash, randomBytes, randomUUID } from "node:crypto";
import test from "node:test";
import mysql from "mysql2/promise";
import { migrate } from "../scripts/migrate.mjs";
import { mysqlConfig } from "../scripts/mysql-config.mjs";
import { createEntry, moderatePost, readEntry, readPost, readProfile } from "../lib/access.mjs";

test("MySQL migrations and access boundaries", async (t) => {
  assert.ok(process.env.MYSQL_TEST_DATABASE, "Set MYSQL_TEST_DATABASE to an empty palleteplate_test_* database before running integration tests.");
  const database = process.env.MYSQL_TEST_DATABASE;
  assert.match(database, /^palleteplate_test_[a-z0-9_]+$/);
  const connection = await mysql.createConnection(mysqlConfig({ ...process.env, MYSQL_DATABASE: database }));
  try {
    const [tables] = await connection.execute("SHOW TABLES");
    assert.equal(tables.length, 0, "Use an empty, dedicated test database.");
    await migrate(connection);
    await migrate(connection);
    const [[migrations]] = await connection.execute("SELECT COUNT(*) AS count FROM schema_migrations WHERE completed = TRUE");
    assert.equal(Number(migrations.count), 3);

    async function account({ role = null, verified = true, disabled = false, expired = false } = {}) {
      const user = randomUUID(), token = randomBytes(32).toString("hex");
      await connection.execute(`INSERT INTO accounts (id, email, password_hash, email_verified_at, disabled_at)
        VALUES (?, ?, 'test-only-hash', ?, ?)`, [user, `${user}@example.test`, verified ? new Date() : null, disabled ? new Date() : null]);
      await connection.execute("INSERT INTO profiles (user_id, display_name) VALUES (?, ?)", [user, user]);
      await connection.execute("INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)", [
        createHash("sha256").update(token).digest(), user, new Date(Date.now() + (expired ? -60_000 : 600_000)),
      ]);
      if (role) await connection.execute("INSERT INTO user_roles (user_id, role) VALUES (?, ?)", [user, role]);
      return { user, token };
    }
    const alice = await account(), bob = await account(), admin = await account({ role: "admin" });
    const moderator = await account({ role: "moderator" });
    const revoked = [await account({ verified: false }), await account({ disabled: true }), await account({ expired: true })];
    await connection.execute(`INSERT INTO food_sources (title, url, citation, licence, retrieved_on)
      VALUES ('Test fixture', 'https://example.test', 'Test fixture only', 'Not food data', '2026-01-01')`);
    await connection.execute(`INSERT INTO foods (filipino_name, english_name, colour_group, category, source_id, source_record)
      VALUES ('Fixture', 'Fixture', 'green', 'vegetable', 1, 'fixture')`);
    const meal = { eatenAt: "2026-11-09T12:00:00+08:00", mealType: "lunch", foodIds: ["1"] };

    await t.test("private entries derive ownership from the session", async () => {
      const entry = await createEntry(connection, alice.token, meal);
      assert.equal(String((await readEntry(connection, alice.token, entry)).id), entry);
      await assert.rejects(readEntry(connection, bob.token, entry), { status: 404 });
      await assert.rejects(readEntry(connection, admin.token, entry), { status: 404 });
      await assert.rejects(readEntry(connection, null, entry), { status: 401 });
      await assert.rejects(readEntry(connection, alice.token, "1 OR 1=1"));
      await assert.rejects(createEntry(connection, alice.token, { ...meal, user_id: bob.user }));
    });
    await t.test("invalid, expired, unverified and disabled sessions cannot read profiles", async () => {
      assert.equal((await readProfile(connection, alice.token)).display_name, alice.user);
      for (const token of [null, "not-a-token", ...revoked.map((value) => value.token)]) {
        await assert.rejects(readProfile(connection, token), { status: 401 });
      }
    });
    await t.test("only approved public posts are readable anonymously", async () => {
      for (const [visibility, status] of [["public", "approved"], ["public", "pending"], ["private", "approved"]]) {
        const [post] = await connection.execute("INSERT INTO posts (user_id, body, visibility, status) VALUES (?, 'Fixture', ?, ?)", [alice.user, visibility, status]);
        const postId = String(post.insertId);
        if (visibility === "public" && status === "approved") await readPost(connection, null, postId);
        else {
          await assert.rejects(readPost(connection, null, postId), { status: 404 });
          await assert.rejects(readPost(connection, bob.token, postId), { status: 404 });
        }
        await readPost(connection, alice.token, postId);
        await readPost(connection, moderator.token, postId);
        await assert.rejects(moderatePost(connection, bob.token, postId, "approved"), { status: 403 });
        await moderatePost(connection, moderator.token, postId, "rejected");
      }
    });
    await t.test("invalid meals leave no partial entry behind", async () => {
      const [[before]] = await connection.execute("SELECT COUNT(*) AS count FROM entries");
      await assert.rejects(createEntry(connection, alice.token, { ...meal, foodIds: ["999999"] }));
      await assert.rejects(createEntry(connection, alice.token, { ...meal, foodIds: [] }));
      const [[after]] = await connection.execute("SELECT COUNT(*) AS count FROM entries");
      assert.equal(after.count, before.count);
    });
    await t.test("another user's unpublished recipe cannot be logged", async () => {
      const [recipe] = await connection.execute("INSERT INTO recipes (user_id, title) VALUES (?, 'Fixture')", [bob.user]);
      await assert.rejects(createEntry(connection, alice.token, { ...meal, recipeIds: [String(recipe.insertId)] }), { status: 404 });
    });
    await t.test("migration history rejects changed and incomplete migrations", async () => {
      const [[original]] = await connection.execute("SELECT filename, checksum FROM schema_migrations ORDER BY filename LIMIT 1");
      await connection.execute("UPDATE schema_migrations SET checksum = ? WHERE filename = ?", ["0".repeat(64), original.filename]);
      await assert.rejects(migrate(connection), /Applied migration changed/);
      await connection.execute("UPDATE schema_migrations SET checksum = ?, completed = FALSE WHERE filename = ?", [original.checksum, original.filename]);
      await assert.rejects(migrate(connection), /Incomplete migration/);
      await connection.execute("UPDATE schema_migrations SET completed = TRUE WHERE filename = ?", [original.filename]);
      await migrate(connection);
    });
  } finally {
    await connection.end();
  }
});
