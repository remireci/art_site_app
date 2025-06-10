"use server";

import { getLocationByDomain } from "@/db/mongo";

export async function fetchLocationByDomain(domain: string) {
  try {
    const location = await getLocationByDomain(domain);
    return { success: true, location };
  } catch (error) {
    console.error("Failed to fetch location by domain:", error);
    return { success: false, error: "Failed to fetch location" };
  }
}
