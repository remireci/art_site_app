import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./styles/globals.css";
import Header from "./components/Header.jsx";
// import Footer from "./components/Footer";
// import CookieConsentPopup from './components/CookieConsentPopup';
import GoogleAnalytics from '../GoogleAnalytics';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Art Calendar",
  description: "Find an exhibition nearby, Art In Europe by Art Now Database",
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      {/* <GoogleAnalytics /> */}
      <head>
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
      <body className={inter.className}>
        {/* <div className=""> */}
        <Header />
        {children}
        {/* </div> */}
      </body>
    </html>
  );
}
