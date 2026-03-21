"use client";

import { useState } from "react";
import { Toaster } from "sonner";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import Preloader from "@/components/sections/00-Preloader";
import Hero from "@/components/sections/01-Hero";
import Marquee from "@/components/sections/02-Marquee";
import About from "@/components/sections/03-About";
import Skills from "@/components/sections/04-Skills";
import Projects from "@/components/sections/05-Projects";
import Experience from "@/components/sections/06-Experience";
import Exploring from "@/components/sections/07-Exploring";
import Process from "@/components/sections/08-Process";
import Contact from "@/components/sections/09-Contact";

export default function Home() {
  const [ready, setReady] = useState(false);

  return (
    <>
      <Preloader onComplete={() => setReady(true)} />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#111",
            border: "1px solid #222",
            color: "#F5F5F5",
            fontFamily: "var(--font-mono)",
            fontSize: "12px",
            letterSpacing: "0.06em",
          },
        }}
      />

      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero ready={ready} />
          <Marquee />
          <About />
          <Skills />
          <Projects />
          <Experience />
          <Exploring />
          <Process />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
}
