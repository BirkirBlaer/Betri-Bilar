import { brands, specialization } from "@/content/site";
import { RevealText } from "@/components/ui/reveal";
import { BrandRows } from "@/components/site/brand-rows";

export function Specialization() {
  return (
    <section id="serhaefing" data-tone="dark" aria-labelledby="serhaefing-h" className="overflow-hidden bg-ink py-[clamp(5rem,12vw,10rem)] text-paper">
      <div className="wrap grid-12 gap-y-6">
        <RevealText id="serhaefing-h" className="h2 col-span-12 max-w-[16ch] md:col-span-7">
          {specialization.heading}
        </RevealText>
        <p className="lede col-span-12 max-w-[42ch] self-end text-paper/70 md:col-span-4 md:col-start-9">
          {specialization.body}
        </p>
      </div>
      <BrandRows names={brands.map((b) => b.name)} />
    </section>
  );
}
