import type { Metadata } from "next";
import { Roboto } from 'next/font/google';
import "../styles/globals.css";
import Header from "../components/Header";
import { LocationProvider } from "../context/LocationContext";
import CookieBanner from "../components/CookieBanner";
import Footer from "../components/Footer";
// import CookieConsentPopup from './components/CookieConsentPopup';
import { NextIntlClientProvider } from 'next-intl';
import { unstable_setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import enCommon from "../../locales/en/common.json";
import frCommon from "../../locales/fr/common.json";
import nlCommon from "../../locales/nl/common.json";

const roboto = Roboto({
  weight: ['100', '300', '400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
})


const translations: Record<"en" | "fr" | "nl", { home: { "meta-title": string; "meta-description": string; "meta-keywords": string } }> = {
  en: enCommon,
  fr: frCommon,
  nl: nlCommon,
};


export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = (params.locale as "en" | "fr" | "nl") || "en";
  const t = translations[locale]?.home || translations.en.home;

  return {
    title: t["meta-title"],
    description: t["meta-description"],
    keywords: t["meta-keywords"],
    alternates: {
      canonical: `https://www.artnowdatabase.eu/${locale}`,
      languages: {
        en: "https://www.artnowdatabase.eu/en",
        fr: "https://www.artnowdatabase.eu/fr",
        nl: "https://www.artnowdatabase.eu/nl",
        'x-default': "https://www.artnowdatabase.eu/en",
      },
    },
    icons: {
      icon: "/favicon.ico",
    },
  };
}

const addJsonLd = () => {
  const jsonld = `{
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Art Now Database",
    "alternateName": "Art Calendar",
    "url": "https://www.artnowdatabase.eu",
    "logo": "",
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "info@artnowdatabase.eu",
      "contactType": "customer support",
      "areaServed": ["BE", "NL", "FR", "UK", "DE", "CH"],
      "availableLanguage": ["Dutch", "English", "French"]
    }
  }`;
  return { __html: jsonld };
};

export default async function LocaleLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  let messages;
  try {
    const commonMessages = (await import(`../../locales/${locale}/common.json`)).default;
    const homepageMessages = (await import(`../../locales/${locale}/homepage.json`)).default;
    const exhibitionsMessages = (await import(`../../locales/${locale}/exhibitions.json`)).default;

    messages = { ...exhibitionsMessages, ...commonMessages, ...homepageMessages };

  } catch (error) {
    notFound();
  }

  const measurementId = process.env.GOOGLE_ANALYTICS;
  // const locale = params.locale || "en";

  // const { locale } = params;
  const metadata = await generateMetadata({ params: { locale } });
  const { alternates } = metadata;

  return (
    <html lang={locale}>
      <head>
        <script defer src="https://umami-loopbaantest-bitter-flower-1931.fly.dev/script.js" data-website-id="3619ca21-8cc6-4766-97a3-0266e8e0d441"></script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={addJsonLd()}
          key="product-jsonld"
        />
      </head>
      <body className={roboto.className}>
        <NextIntlClientProvider
          locale={locale}
          messages={messages}
          timeZone="Europe/Brussels"
        >
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
              <LocationProvider >
                {children}
              </LocationProvider>
              {/* <CookieBanner /> */}
            </main>
            <Footer />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
