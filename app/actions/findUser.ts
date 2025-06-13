"use server";

import { findUser } from "@/db/mongo";

export async function fetchUserByEmail(email: string) {
  try {
    const user = await findUser(email);
    return { success: true, user };
  } catch (error) {
    console.error("Failed to fetch user by email:", error);
    return { success: false, error: "Failed to fetch location" };
  }
}
