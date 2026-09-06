import { Bricolage_Grotesque, Figtree } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import RevealObserver from "@/components/RevealObserver";
import ButtonMotion from "@/components/ButtonMotion";
import CursorDot from "@/components/CursorDot";
import CookieBar from "@/components/CookieBar";
import GlobalOrganism from "@/components/GlobalOrganism";
import MotionDirector from "@/components/MotionDirector";

const displayFont = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const bodyFont = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata = {
  title: "Karllos Design",
  description:
    "Karllos Design — edição de vídeo, design gráfico e identidade visual. Consultoria criativa autoral, do briefing à entrega.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body>
        <a className="skip-link" href="#hero-section">
          Pular para o conteúdo
        </a>
        <SmoothScrollProvider />
        <MotionDirector />
        <RevealObserver />
        <ButtonMotion />
        <CursorDot />
        <GlobalOrganism />
        {children}
        <CookieBar />
      </body>
    </html>
  );
}
