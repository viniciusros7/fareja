import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";
import PrivacyModal from "@/components/PrivacyModal";

export const metadata: Metadata = {
  title: "Fareja – Canis Verificados do Brasil",
  description:
    "Encontre canis verificados com procedência comprovada. Filhotes saudáveis, microchipados e com origem rastreável.",
  keywords: ["canil", "cachorro", "filhote", "raça", "verificado", "Brasil", "CBKC"],
  openGraph: {
    title: "Fareja – Canis Verificados do Brasil",
    description: "A primeira plataforma brasileira de canis verificados.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pb-16 md:pb-0">{children}</main>
        <Footer />
        <BottomNav />
        <PrivacyModal />
      </body>
    </html>
  );
}
