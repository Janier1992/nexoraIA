import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nexora AI | Soluciones de Inteligencia Artificial y Automatizaciones",
  description: "Impulsa tu negocio con Nexora AI. Desarrollamos soluciones tecnológicas a medida, aplicaciones web y móviles, consultoría en Business Intelligence y automatizaciones complejas.",
  openGraph: {
    title: "Nexora AI | Soluciones de Inteligencia Artificial y Automatizaciones",
    description: "Desarrollo de software de vanguardia, aplicaciones móviles, dashboards de BI e integración de agentes de IA.",
    url: "https://nexora.ai",
    siteName: "Nexora AI",
    locale: "es_ES",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        {children}
      </body>
    </html>
  );
}
