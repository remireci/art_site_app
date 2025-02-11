import type { Metadata } from "next";
import { Roboto } from 'next/font/google';
import { Inter } from "next/font/google";
import "./styles/globals.css";
import Header from "./components/Header.jsx";
import CookieBanner from "./components/CookieBanner";
import Footer from "./components/Footer";
import GoogleAnalytics from './components/GoogleAnalytics';
// import CookieConsentPopup from './components/CookieConsentPopup';
import { GoogleTagManager } from '@next/third-parties/google';

// const inter = Inter({ subsets: ["latin"] });

const roboto = Roboto({
  weight: ['100', '300', '400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://www.artnowdatabase.eu',
  },
  title: "Art Exhibitions Calendar | Discover Contemporary Art in Europe",
  description: "Discover upcoming art exhibitions in Western Europe. Explore museums, galleries, and cultural spaces showcasing modern and contemporary art. Search by country, city, venue, or artist!",
  keywords: "art exhibitions, contemporary art, modern art, European art events, art museums, art galleries, art calendar, art openings, art fairs, art shows, artist exhibitions, art spaces in Europe"
};

const addJsonLd = () => {
  return {
    __html: `{
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
    }`
  };
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  const measurementId = process.env.GOOGLE_ANALYTICS;

  return (
    <html lang="en">
      {/* <GoogleAnalytics /> */}
      <head>

        <GoogleTagManager gtmId={process.env.GOOGLE_TAG_MANAGER || 'default-gtm-id'} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={addJsonLd()}
          key="product-jsonld"
        />
        {/* <link rel="apple-touch-icon" sizes="180x180" href="/images/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16x16.png" /> */}
        {/* <link rel="manifest" href="/images/site.webmanifest" /> */}
        {/* <link rel="mask-icon" href="/images/safari-pinned-tab.svg" color="#5bbad5" />
        <link rel="shortcut icon" href="/images/favicon.ico" />
        <meta name="msapplication-TileColor" content="#ffc40d" />
        <meta name="msapplication-config" content="/images/browserconfig.xml" />
        <meta name="theme-color" content="#f4f3e6" /> */}

        {/* <link rel="manifest" href="/manifest.json" /> */}

        {/* <meta name="google-site-verification" content="UNtcJZ8yHZDo0WEb9SE5VrtDIBoBX_5zuo0ZNtokwtQ" />
        <meta name="google-site-verification" content="sqDRvFAe2TaopdkctiZlPCROfVd1C3w3HROJFc32K0w" /> */}
      </head>
      {measurementId && <GoogleAnalytics GA_MEASUREMENT_ID={measurementId} />}
      <body className={roboto.className}>
        <div className="main-container min-h-screen">
          <Header />
          {children}
          <CookieBanner />
          <Footer />
        </div>
        <GoogleTagManager gtmId={process.env.GOOGLE_TAG_MANAGER || 'default-gtm-id'} />
      </body>
    </html>
  );
}
