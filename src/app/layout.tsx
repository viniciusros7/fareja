import type { Metadata } from "next";
import { Fraunces, Instrument_Sans, Instrument_Serif } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";
import PrivacyModal from "@/components/PrivacyModal";

const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  axes: ["SOFT", "opsz"],
  variable: "--font-fraunces",
  display: "swap",
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-instrument-sans",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin", "latin-ext"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://fareja.app.br"),
  title: "Fareja – Canis Verificados do Brasil",
  description:
    "Encontre canis verificados com procedência comprovada. Filhotes saudáveis, microchipados e com origem rastreável.",
  keywords: ["canil", "cachorro", "filhote", "raça", "verificado", "Brasil", "CBKC"],
  openGraph: {
    title: "Fareja – Canis Verificados do Brasil",
    description: "A primeira plataforma brasileira de canis verificados.",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://fareja.app.br",
    type: "website",
    locale: "pt_BR",
    siteName: "Fareja",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${fraunces.variable} ${instrumentSans.variable} ${instrumentSerif.variable}`}
    >
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pb-20 md:pb-0 page-enter">{children}</main>
        <Footer />
        <BottomNav />
        <PrivacyModal />
      </body>
    </html>
  );
}
