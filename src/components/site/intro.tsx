import { company, intro } from "@/content/site";
import { Photo } from "@/components/ui/photo";
import { RevealFrame, RevealText } from "@/components/ui/reveal";
import { Unverified } from "@/components/ui/unverified";
import { YearMark } from "@/components/site/year-mark";
import { currentYear } from "@/lib/year";

export async function Intro() {
  const years = (await currentYear()) - company.foundedYear;
  return (
    <section aria-labelledby="um-okkur" className="relative bg-paper pt-[clamp(5rem,12vw,10rem)]">
      <div className="wrap grid-12 gap-y-12">
        <div className="col-span-12 md:col-span-7 md:col-start-6 md:row-start-1">
          <RevealText id="um-okkur" className="h2 max-w-[18ch] text-ink">
            {intro.heading}
          </RevealText>
          <div className="lede mt-8 max-w-[52ch] space-y-5 text-charcoal/85 md:mt-12">
            <p>{intro.body[0]}</p>
            <p>
              {intro.body[1]}
              <Unverified show={!intro.verified} />
            </p>
          </div>
        </div>
        <div className="col-span-9 col-start-1 sm:col-span-6 md:col-span-4 md:col-start-1 md:row-start-1 md:mt-40">
          <RevealFrame>
            <Photo slot="intro-detail" sizes="(min-width: 768px) 30vw, 75vw" tone="light" />
          </RevealFrame>
        </div>
      </div>

      <div className="wrap mt-[clamp(4rem,8vw,6rem)]">
        <div className="flex items-end justify-between gap-6 border-t border-rule-light pt-4">
          <p className="meta text-steel">Í rekstri frá</p>
          <p className="meta text-right text-steel">{years} ár</p>
        </div>
        <YearMark year={company.foundedYear} />
      </div>
    </section>
  );
}
