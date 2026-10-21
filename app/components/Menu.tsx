"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Map } from "lucide-react";

import LocaleSwitcher from "./LocaleSwitcher";
import UserMenuButtonWrapper from "./UserMenuButtonWrapper";

interface MenuProps {
  onNavigate?: () => void;
}

export default function Menu({ onNavigate }: MenuProps) {
  const locale = useLocale();
  const t = useTranslations();

  const discoverLinks = [
    { label: "Exhibition map", href: `/${locale}/map` },
    { label: "Cities", href: `/${locale}/exhibitions/cities` },
    { label: "Locations", href: `/${locale}/exhibitions/locations` },
  ];

  const aboutLinks = [
    {
      label: t("homepage.on-the-map"),
      href: `/${locale}/on-the-map`,
    },
    {
      label: t("homepage.advertising"),
      href: `/${locale}/advertising`,
    },
  ];

  const linkStyle =
    "text-sm font-light text-slate-600 underline-offset-4 hover:underline hover:text-slate-900 transition-colors";

  return (
    <nav aria-label="Main navigation" className="text-slate-600">
      {/* Mobile navigation */}
      <div className="flex flex-col gap-5 px-5 py-5 lg:hidden">
        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-400">
            Discover art
          </p>

          <div className="flex flex-col items-start gap-3">
            {discoverLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={onNavigate}
                className={linkStyle}
              >
                {index === 0 ? (
                  <span className="flex items-center gap-2 font-medium">
                    <Map size={16} strokeWidth={1.5} />
                    {link.label}
                  </span>
                ) : (
                  link.label
                )}
              </Link>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-200 pt-4">
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-400">
            About ArtNowDatabase
          </p>

          <div className="flex flex-col items-start gap-3">
            {aboutLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={onNavigate}
                className={linkStyle}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-5 border-t border-slate-200 pt-3">
          <UserMenuButtonWrapper />
          <LocaleSwitcher />
        </div>
      </div>

      {/* Desktop navigation */}
      <div className="hidden lg:flex flex-wrap items-center gap-x-5 gap-y-2">
        <Link
          href={`/${locale}/map`}
          className={`${linkStyle} flex items-center gap-1 font-medium`}
        >
          <Map size={16} strokeWidth={1.5} />
          Exhibition map
        </Link>

        <Link href={`/${locale}/exhibitions/cities`} className={linkStyle}>
          Cities
        </Link>

        <Link href={`/${locale}/exhibitions/locations`} className={linkStyle}>
          Locations
        </Link>

        <span className="mx-1 h-5 border-l border-slate-300" />

        {aboutLinks.map((link) => (
          <Link key={link.href} href={link.href} className={linkStyle}>
            {link.label}
          </Link>
        ))}

        <UserMenuButtonWrapper />
        <LocaleSwitcher />
      </div>
    </nav>
  );
}
