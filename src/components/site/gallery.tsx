import { getPhoto } from "@/content/photos";
import { Photo } from "@/components/ui/photo";
import { RevealText } from "@/components/ui/reveal";
import { GalleryGrid } from "@/components/site/gallery-grid";

const layout: { slot: string; className: string }[] = [
  { slot: "gallery-1", className: "col-span-12 md:col-span-7" },
  { slot: "gallery-2", className: "col-span-8 col-start-5 md:col-span-4 md:col-start-9 md:mt-32" },
  { slot: "gallery-3", className: "col-span-7 col-start-1 md:col-span-4 md:col-start-2 md:-mt-10" },
  { slot: "gallery-4", className: "col-span-9 col-start-4 md:col-span-3 md:col-start-7 md:mt-24" },
  { slot: "gallery-5", className: "col-span-12 md:col-span-7 md:col-start-6 md:-mt-6" },
  { slot: "gallery-6", className: "col-span-6 col-start-7 md:col-span-3 md:col-start-2 md:row-start-3 md:self-end" },
];

export function Gallery() {
  const items = layout.map(({ slot, className }) => {
    const { slot: s } = getPhoto(slot);
    return {
      id: slot,
      alt: s.alt,
      aspect: s.aspect[0] / s.aspect[1],
      className,
      thumb: <Photo slot={slot} sizes="(min-width: 768px) 50vw, 100vw" tone="light" />,
      large: <Photo slot={slot} sizes="100vw" tone="dark" className="w-full" />,
    };
  });

  return (
    <section id="verkstaedid" aria-labelledby="verkstaedid-h" className="bg-paper pb-[clamp(5rem,12vw,10rem)] pt-[clamp(5rem,12vw,10rem)]">
      <div className="wrap grid-12 gap-y-6">
        <RevealText id="verkstaedid-h" className="h1 col-span-12 text-ink md:col-span-7">
          Verkstæðið
        </RevealText>
        <p className="lede col-span-12 max-w-[38ch] self-end text-charcoal/80 md:col-span-4 md:col-start-9">
          Myndir af verkstæðinu í Skeifunni, bílunum og fólkinu sem vinnur við þá.
        </p>
      </div>
      <GalleryGrid items={items} />
    </section>
  );
}
