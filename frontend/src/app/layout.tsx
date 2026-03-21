import type { Metadata } from "next";
import { Space_Grotesk, Geist_Mono, Geist } from "next/font/google";
import "../styles/globals.css";
import LenisProvider from "@/providers/LenisProvider";
import "@/lib/gsap"; // register GSAP plugins client-side (tree-shaken safely)
import CustomCursor from "@/components/ui/CustomCursor";
import CursorTrail from "@/components/ui/CursorTrail";
import NoiseOverlay from "@/components/ui/NoiseOverlay";
import ScrollProgress from "@/components/ui/ScrollProgress";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ansh Modi — Full Stack Developer",
  description:
    "Full Stack Developer specializing in MERN stack, TypeScript, and modern web experiences. Building the future, one line at a time.",
  keywords: ["Full Stack Developer", "MERN", "React", "Node.js", "TypeScript", "MongoDB", "Ansh Modi"],
  authors: [{ name: "Ansh Modi", url: "https://github.com/Anshmodi03" }],
  creator: "Ansh Modi",
  openGraph: {
    title: "Ansh Modi — Full Stack Developer",
    description: "Building the future, one line at a time.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ansh Modi — Full Stack Developer",
    description: "Building the future, one line at a time.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(spaceGrotesk.variable, geistMono.variable, "font-sans", geist.variable)}>
      <body suppressHydrationWarning>
        <LenisProvider>
          <NoiseOverlay />
          <ScrollProgress />
          <CustomCursor />
          <CursorTrail />
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
