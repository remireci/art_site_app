import { generateSitemap } from "../../../scripts/sitemap";

export async function GET() {
  const sitemapXml = await generateSitemap();

  return new Response(sitemapXml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=86400",
    },
  });
}

// // app/api/sitemap/route.js or route.ts
// import { NextResponse } from "next/server";
// import { sitemap } from "../../../scripts/sitemap";

// export async function GET() {
//   try {
//     await sitemap();
//     return NextResponse.json({ success: true });
//   } catch (err: any) {
//     return NextResponse.json({ success: false, error: err.message });
//   }
// }
