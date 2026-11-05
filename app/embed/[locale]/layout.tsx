import { Roboto } from "next/font/google";
import "@/styles/globals.css";
import { LocationProvider } from "@/context/LocationContext";

const roboto = Roboto({
  weight: ["100", "300", "400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

export default function EmbedLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  return (
    <html lang={locale}>
      <body className={`${roboto.className} m-0 overflow-hidden`}>
        <script
          defer
          src="https://umami-loopbaantest-bitter-flower-1931.fly.dev/script.js"
          data-website-id="3619ca21-8cc6-4766-97a3-0266e8e0d441"
        ></script>
        <LocationProvider>{children}</LocationProvider>
      </body>
    </html>
  );
}
