import type { Metadata } from "next";
import { Roboto } from 'next/font/google';
import { Inter } from "next/font/google";
import "../styles/globals.css";
import Header from "../components/Header.jsx";
import { LocationProvider } from "../context/LocationContext";
import CookieBanner from "../components/CookieBanner";
import Footer from "../components/Footer";
import GoogleAnalytics from '../components/GoogleAnalytics';
// import CookieConsentPopup from './components/CookieConsentPopup';
import { GoogleTagManager } from '@next/third-parties/google';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';

// const inter = Inter({ subsets: ["latin"] });

import enCommon from "../../locales/en/common.json";
import frCommon from "../../locales/fr/common.json";
import nlCommon from "../../locales/nl/common.json";

const roboto = Roboto({
  weight: ['100', '300', '400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
})

// export const metadata: Metadata = {
//   alternates: {
//     canonical: 'https://www.artnowdatabase.eu',
//   },
//   title: "Art Exhibitions Calendar | Discover Contemporary Art in Europe",
//   description: "Discover upcoming art exhibitions in Western Europe. Explore museums, galleries, and cultural spaces showcasing modern and contemporary art. Search by country, city, venue, or artist!",
//   keywords: "art exhibitions, contemporary art, modern art, European art events, art museums, art galleries, art calendar, art openings, art fairs, art shows, artist exhibitions, art spaces in Europe",
//   icons: {
//     icon: '/favicon.ico',
//   },
// };

const translations: Record<"en" | "fr" | "nl", { home: { "meta-title": string; "meta-description": string; "meta-keywords": string } }> = {
  en: enCommon,
  fr: frCommon,
  nl: nlCommon,
};


export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = (params.locale as "en" | "fr" | "nl") || "en"; // Default to English if missing
  const t = translations[locale]?.home || translations.en.home; // Fallback to English

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
    messages = { ...commonMessages, ...homepageMessages };
    // console.log('Loaded messages:', messages);
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
      {/* <GoogleAnalytics /> */}
      <head>
        <GoogleTagManager gtmId={process.env.GOOGLE_TAG_MANAGER || 'default-gtm-id'} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={addJsonLd()}
          key="product-jsonld"
        />
      </head>
      {measurementId && <GoogleAnalytics GA_MEASUREMENT_ID={measurementId} />}
      <body className={roboto.className}>
        <div className="main-container min-h-screen">
          <NextIntlClientProvider
            locale={locale}
            messages={messages}
            timeZone="Europe/Brussels"
          >
            <Header />
            <LocationProvider>
              {children}
            </LocationProvider>
            <CookieBanner />
            <Footer />
          </NextIntlClientProvider>
        </div>
        <GoogleTagManager gtmId={process.env.GOOGLE_TAG_MANAGER || 'default-gtm-id'} />
      </body>
    </html>
  );
}
