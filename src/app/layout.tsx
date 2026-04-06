import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

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
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
