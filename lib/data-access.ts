import "server-only";
import { cookies } from "next/headers";
import { database } from "./db";
import * as access from "./access.mjs";

export const SESSION_COOKIE = "palleteplate_session";

async function sessionToken() {
  return (await cookies()).get(SESSION_COOKIE)?.value ?? null;
}

export async function getOwnProfile() {
  return access.readProfile(database(), await sessionToken());
}

export async function getOwnEntry(id: string) {
  return access.readEntry(database(), await sessionToken(), id);
}

export async function logMeal(input: unknown) {
  const token = await sessionToken();
  const connection = await database().getConnection();
  try {
    return await access.createEntry(connection, token, input);
  } finally {
    connection.release();
  }
}

export async function getVisiblePost(id: string) {
  return access.readPost(database(), await sessionToken(), id);
}

export async function reviewPost(id: string, status: unknown) {
  return access.moderatePost(database(), await sessionToken(), id, status);
}
