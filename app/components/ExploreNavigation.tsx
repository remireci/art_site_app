import Image from "next/image";
import Link from "next/link";

interface ExploreNavigationProps {
  locale: string;
  centered?: boolean;
}

export default function ExploreNavigation({
  locale,
  centered = false,
}: ExploreNavigationProps) {
  return (
    <nav
      aria-label="Explore exhibitions"
      className={`text-slate-600 ${centered ? "mx-auto w-fit max-w-full" : ""}`}
    >
      <div className="flex items-center gap-3">
        <Link
          href={`/${locale}/map`}
          className="group shrink-0"
          aria-label="Explore the exhibition map"
        >
          <Image
            src="/images/map-thumbnail.webp"
            alt=""
            width={56}
            height={56}
            className="
                      h-11 w-11 shrink-0 rounded object-cover
                      lg:h-14 lg:w-14
                      saturate-[0.35]
                      transition-all duration-200
                      group-hover:saturate-75
                    "
          />{" "}
        </Link>

        <div className="min-w-0">
          <Link
            href={`/${locale}/map`}
            className="
                      text-sm font-medium text-slate-700
                      underline-offset-4
                      hover:text-slate-900 hover:underline
                      transition-colors
                    "
          >
            Explore the exhibition map
          </Link>

          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs">
            <Link
              href={`/${locale}/exhibitions/cities`}
              className="text-slate-500 underline underline-offset-4 hover:text-slate-900"
            >
              Cities
            </Link>

            <Link
              href={`/${locale}/exhibitions/locations`}
              className="text-slate-500 underline underline-offset-4 hover:text-slate-900"
            >
              Locations
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
