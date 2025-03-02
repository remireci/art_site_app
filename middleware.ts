import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import i18nConfig from "./i18nConfig";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path starts with a valid locale (like /en, /fr, /nl)
  const hasLocalePrefix = i18nConfig.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // If the path already has a locale prefix, continue to the requested path
  if (hasLocalePrefix) {
    return NextResponse.next();
  }

  // If no locale prefix is found, prepend the default locale /en
  const defaultLocale = i18nConfig.defaultLocale || "en"; // Use the default locale from config
  const newUrl = new URL(`/${defaultLocale}${pathname}`, request.url); // Prepend the default locale
  return NextResponse.redirect(newUrl);
}

export const config = {
  matcher: [
    "/((?!api|static|.*\\..*|_next).*)", // Match all pages except API/static files
    "/locations/:path*", // Ensure middleware runs on dynamic routes
  ],
};
