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
  const forwarded =
    request.headers.get("x-forwarded-for") ??
    request.headers.get("x-vercel-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
  const region =
    request.geo?.region ||
    request.headers.get("x-vercel-ip-country-region") ||
    "unknown-region";
  const url = request.nextUrl.pathname;

  console.log(`Request from IP ${ip}, region ${region}, path ${url}`);
  console.log(
    "Request from region:",
    request.geo?.region,
    "path:",
    request.nextUrl.pathname
  );

  if (
    region === "Île-de-France" ||
    region === "cdg1" ||
    region === "VA" ||
    region === "WA" ||
    region === "BRU" ||
    region === "unknown-region" ||
    region === "CA" ||
    region === "14" ||
    ip === "104.23.241.31" ||
    ip === "162.158.233.65" ||
    ip === "162.158.42.179" ||
    ip === "162.158.233.8" ||
    ip === "172.68.23.78" ||
    ip === "172.71.124.157" ||
    ip === "108.162.227.86" ||
    ip === "146.190.121.254" ||
    ip === "162.158.103.219"
  ) {
    return new NextResponse("Region blocked", { status: 403 });
  }

  const PUBLIC_FILE =
    /\.(js|css|png|jpg|jpeg|gif|svg|webp|ico|eot|otf|ttf|woff|woff2|json)$/;

  // Bypass static files and internal routes
  if (
    pathname.startsWith("/pages") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/robots") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  if (pathname === "/sitemap-index.xml" || pathname.startsWith("/sitemap")) {
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

  const localeMatch = pathname.match(
    /^\/(en|fr|nl)\/exhibitions\/cities\/([^/]+)/
  );
  if (localeMatch) {
    const locale = localeMatch[1];
    const city = localeMatch[2];

    if (city !== city.toLowerCase()) {
      const newUrl = new URL(
        `/${locale}/exhibitions/cities/${city.toLowerCase()}`,
        request.url
      );
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
