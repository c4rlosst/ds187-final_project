import { createHash } from "node:crypto";
import { z } from "zod";

const id = z.string().regex(/^[1-9][0-9]{0,19}$/).refine((value) => BigInt(value) <= 18446744073709551615n);
const meal = z.object({
  eatenAt: z.iso.datetime({ offset: true }),
  mealType: z.enum(["breakfast", "lunch", "dinner", "snack"]),
  foodIds: z.array(id).max(100).default([]),
  recipeIds: z.array(id).max(30).default([]),
}).strict().refine((value) => value.foodIds.length + value.recipeIds.length > 0, "Choose at least one food or recipe.");

export class AccessError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

async function actor(connection, token) {
  if (typeof token !== "string" || !/^[a-f0-9]{64}$/.test(token)) return null;
  const hash = createHash("sha256").update(token).digest();
  const [rows] = await connection.execute(`
    SELECT a.id, r.role FROM sessions s
    JOIN accounts a ON a.id = s.user_id
    LEFT JOIN user_roles r ON r.user_id = a.id
    WHERE s.token_hash = ? AND s.expires_at > UTC_TIMESTAMP(3)
      AND a.disabled_at IS NULL AND a.email_verified_at IS NOT NULL`, [hash]);
  return rows[0] ?? null;
}

async function member(connection, token) {
  const user = await actor(connection, token);
  if (!user) throw new AccessError(401, "Sign in with a verified account to continue.");
  return user;
}

export async function readProfile(connection, token) {
  const user = await member(connection, token);
  const [rows] = await connection.execute(
    "SELECT display_name, region, gender, contact_number FROM profiles WHERE user_id = ?", [user.id],
  );
  return rows[0] ?? null;
}

export async function readEntry(connection, token, entryId) {
  const user = await member(connection, token);
  const [rows] = await connection.execute(
    "SELECT id, eaten_at, meal_type FROM entries WHERE id = ? AND user_id = ?", [id.parse(entryId), user.id],
  );
  if (!rows.length) throw new AccessError(404, "Meal entry not found.");
  return rows[0];
}

export async function createEntry(connection, token, input) {
  const value = meal.parse(input);
  await connection.beginTransaction();
  try {
    const user = await member(connection, token);
    for (const recipeId of new Set(value.recipeIds)) {
      const [rows] = await connection.execute(`
        SELECT r.id FROM recipes r WHERE r.id = ? AND (r.user_id = ? OR EXISTS (
          SELECT 1 FROM posts p WHERE p.recipe_id = r.id AND p.visibility = 'public' AND p.status = 'approved'
        ))`, [recipeId, user.id]);
      if (!rows.length) throw new AccessError(404, "Recipe not found.");
    }
    const [result] = await connection.execute(
      "INSERT INTO entries (user_id, eaten_at, meal_type) VALUES (?, ?, ?)",
      [user.id, new Date(value.eatenAt).toISOString().slice(0, 23).replace("T", " "), value.mealType],
    );
    for (const foodId of new Set(value.foodIds)) {
      await connection.execute("INSERT INTO entry_foods (entry_id, food_id) VALUES (?, ?)", [result.insertId, foodId]);
    }
    for (const recipeId of new Set(value.recipeIds)) {
      await connection.execute("INSERT INTO entry_recipes (entry_id, recipe_id) VALUES (?, ?)", [result.insertId, recipeId]);
    }
    await connection.commit();
    return String(result.insertId);
  } catch (error) {
    await connection.rollback();
    throw error;
  }
}

export async function readPost(connection, token, postId) {
  const user = await actor(connection, token);
  const [rows] = await connection.execute(`
    SELECT id, user_id, recipe_id, body, visibility, status FROM posts
    WHERE id = ? AND ((visibility = 'public' AND status = 'approved') OR user_id = ? OR ? IN ('admin', 'moderator'))`,
  [id.parse(postId), user?.id ?? null, user?.role ?? null]);
  if (!rows.length) throw new AccessError(404, "Post not found.");
  return rows[0];
}

export async function moderatePost(connection, token, postId, status) {
  const user = await member(connection, token);
  if (!["admin", "moderator"].includes(user.role)) throw new AccessError(403, "Moderator access is required.");
  const [result] = await connection.execute("UPDATE posts SET status = ? WHERE id = ?", [
    z.enum(["approved", "rejected"]).parse(status), id.parse(postId),
  ]);
  if (!result.affectedRows) throw new AccessError(404, "Post not found.");
}
