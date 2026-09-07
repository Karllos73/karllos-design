"use client";

import { useRef } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Intro from "@/components/Intro";
import Stats from "@/components/Stats";
import About from "@/components/About";
import Services from "@/components/Services";
import Process from "@/components/Process";
import Work from "@/components/Work";
import Faq from "@/components/Faq";
import ContactCta from "@/components/ContactCta";
import Footer from "@/components/Footer";

export default function Home() {
  const workRef = useRef(null);

  return (
    <>
      <Header />
      <main id="top">
        <Hero />
        <Intro />
        <Stats />
        <Services onFilterTo={(f) => workRef.current?.setFilter(f)} />
        <Process />
        <Work ref={workRef} />
        <About />
        <Faq />
        <ContactCta />
      </main>
      <Footer />
    </>
  );
}
