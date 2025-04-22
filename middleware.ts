import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { locales } from "./i18n.config";

const intlMiddleware = createMiddleware({
  defaultLocale: "en",
  locales,
  localeDetection: false,
});

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const PUBLIC_FILE =
    /\.(js|css|png|jpg|jpeg|gif|svg|webp|ico|eot|otf|ttf|woff|woff2|json)$/;

  // Bypass static files and internal routes
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  // 🧼 Dot-slug redirect ONLY if not yet localized
  if (pathname.startsWith("/exhibitions/locations/")) {
    const slug = pathname.split("/exhibitions/locations/")[1];
    const decodedSlug = decodeURIComponent(slug ?? "");

    console.log("pathname:", pathname);
    console.log("decoded slug:", decodeURIComponent(slug ?? ""));

    if (decodedSlug.includes(".")) {
      const sanitizedSlug = decodedSlug.replace(/\./g, "-");
      console.log("Sanitized slug:", sanitizedSlug);
      const newUrl = new URL(
        `/en/exhibitions/locations/${sanitizedSlug}`,
        request.url
      );
      console.log(`Redirecting to: ${newUrl.toString()}`);
      return NextResponse.redirect(newUrl);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!_next|api|favicon.ico).*)",
    "/exhibitions/locations/:slug*", // helps target this route
    "/exhibitions/locations/(.*)", // <-- explicitly match everything here
  ],
};
