import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { i18nRouter } from "next-i18n-router";
import i18nConfig from "./i18nConfig";

export function middleware(request: NextRequest) {
  // Add a new header x-current-path which passes the path to downstream components
  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(
      new URL(`/${i18nConfig.defaultLocale}/`, request.url)
    );
  }

  const response = i18nRouter(request, i18nConfig);
  const headers = new Headers(response.headers);
  headers.set("x-current-path", request.nextUrl.pathname);

  return NextResponse.next({ headers });
}

export const config = {
  matcher: "/((?!api|static|.*\\..*|_next).*)",
};

// export const config = {
//   matcher: [
//     // match all routes except static files and APIs
//     "/((?!api|_next/static|_next/image|favicon.ico).*)",
//   ],
// };
