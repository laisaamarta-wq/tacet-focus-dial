import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { Reveal } from "@/components/sections/Reveal";
import { Twist } from "@/components/sections/Twist";
import { Does } from "@/components/sections/Does";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Light } from "@/components/sections/Light";
import { Value } from "@/components/sections/Value";
import { Showcase } from "@/components/sections/Showcase";
import { Specs } from "@/components/sections/Specs";
import { Testimonials } from "@/components/sections/Testimonials";
import { Pricing } from "@/components/sections/Pricing";
import { Faq } from "@/components/sections/Faq";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { SceneLoader } from "@/components/three/SceneLoader";
import { ScrollDirector } from "@/components/providers/ScrollDirector";
import { brand, faq, pricing } from "@/content/site";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", name: brand.name, url: brand.url, description: brand.disclaimer },
      {
        "@type": "Product",
        name: brand.product,
        description: brand.description,
        brand: { "@type": "Brand", name: brand.name },
        offers: pricing.tiers.map((t) => ({ "@type": "Offer", name: `${brand.name} ${t.name}`, price: t.price, priceCurrency: "EUR", availability: "https://schema.org/PreOrder" })),
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
    ],
  };

  return (
    <>
      <ScrollDirector />
      <SceneLoader />
      <Nav />
      <main id="main">
        <Hero />
        <Reveal />
        <Twist />
        <Does />
        <HowItWorks />
        <Light />
        <Showcase />
        <Value />
        <Specs />
        <Testimonials />
        <Pricing />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <div aria-hidden className="edge-glow" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
