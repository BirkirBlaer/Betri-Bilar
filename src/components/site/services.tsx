import { services } from "@/content/site";
import { Photo } from "@/components/ui/photo";
import { RevealText } from "@/components/ui/reveal";
import { Unverified } from "@/components/ui/unverified";
import { ServiceList } from "@/components/site/service-list";

export function Services() {
  return (
    <section id="thjonusta" aria-labelledby="thjonusta-h" className="bg-paper py-[clamp(5rem,12vw,10rem)]">
      <div className="wrap grid-12 gap-y-6">
        <RevealText id="thjonusta-h" className="h1 col-span-12 text-ink md:col-span-6">
          Þjónusta
        </RevealText>
        <p className="lede col-span-12 max-w-[40ch] self-end text-charcoal/80 md:col-span-5 md:col-start-8">
          Ef eitthvað er að bílnum, eða kominn tími á viðhald, er best að hringja eða senda okkur beiðni.
        </p>
      </div>

      <ServiceList
        items={services.map((s) => ({
          id: s.id,
          title: s.title,
          summary: s.summary,
          marker: <Unverified show={!s.verified} />,
          photo: <Photo slot={s.photoSlot} sizes="(min-width: 768px) 28vw, 1px" tone="dark" />,
          inlinePhoto: <Photo slot={s.photoSlot} sizes="(max-width: 767px) 92vw, 1px" tone="light" />,
        }))}
      />
    </section>
  );
}
