// import { searchExhibitionsNearLocation } from "@/app/db/mongo"; // Your DB function
import { headers } from "next/headers";

export async function getExhibitionsByIP() {
  const ip = headers().get("x-forwarded-for") || "auto"; // Get IP from headers

  try {
    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    const data = await response.json();

    if (!data || !data.latitude || !data.longitude) {
      throw new Error("Could not determine location from IP");
    }

    console.log(
      "User's Approximate Location:",
      data.city,
      data.latitude,
      data.longitude
    );

    // Fetch exhibitions near this location
    // const exhibitions = await searchExhibitionsNearLocation(data.latitude, data.longitude);
    // return { exhibitions, location: data.city };
    return;
  } catch (error) {
    console.error("Error fetching IP location:", error);
    return { exhibitions: [], location: null };
  }
}
