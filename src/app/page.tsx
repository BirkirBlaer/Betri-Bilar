import { SiteNav } from "@/components/site/site-nav";
import { Hero } from "@/components/site/hero";
import { Intro } from "@/components/site/intro";
import { Services } from "@/components/site/services";
import { Specialization } from "@/components/site/specialization";
import { Gallery } from "@/components/site/gallery";
import { Trust } from "@/components/site/trust";
import { Contact } from "@/components/site/contact";
import { Footer } from "@/components/site/footer";
import { DemoNotice } from "@/components/site/demo-notice";
import { Photo } from "@/components/ui/photo";
import { JsonLd } from "@/components/site/json-ld";

export default function Home() {
  return (
    <>
      <SiteNav />
      <main id="efni" tabIndex={-1} className="outline-none">
        <div data-tone="dark">
          <Hero photo={<Photo slot="hero-workshop" fill priority sizes="100vw" className="size-full" tone="dark" />} />
        </div>
        <Intro />
        <Services />
        <Specialization />
        <Gallery />
        <Trust />
        <Contact />
      </main>
      <Footer />
      <DemoNotice />
      <JsonLd />
    </>
  );
}
