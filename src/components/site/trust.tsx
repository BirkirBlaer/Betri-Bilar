import { company, trust } from "@/content/site";
import { RevealText } from "@/components/ui/reveal";
import { Unverified } from "@/components/ui/unverified";

export function Trust() {
  return (
    <section aria-labelledby="traust-h" className="border-t border-rule-light bg-paper py-[clamp(5rem,12vw,10rem)]">
      <div className="wrap grid-12 gap-y-12">
        <div className="col-span-12 md:col-span-4">
          <RevealText id="traust-h" className="h2 text-ink md:sticky md:top-28">
            {trust.heading}
          </RevealText>
        </div>
        <dl className="col-span-12 md:col-span-7 md:col-start-6">
          {trust.points.map((p) => (
            <div key={p.body} className="grid gap-3 border-t border-rule-light py-8 first:border-t-0 first:pt-0 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] md:gap-10 md:py-10">
              <dt className="h3 text-ink">
                {p.title(company.foundedYear)}
                <Unverified show={!p.verified} />
              </dt>
              <dd className="text-[1.0625rem] leading-relaxed text-charcoal/80">{p.body}</dd>
            </div>
          ))}
        </dl>

        {trust.reviews.length > 0 && (
          <ul className="col-span-12 grid gap-10 border-t border-rule-light pt-12 md:grid-cols-2">
            {trust.reviews.map((r) => (
              <li key={r.quote}>
                <figure>
                  <blockquote className="h3 text-ink">„{r.quote}“</blockquote>
                  <figcaption className="meta mt-4 text-steel">
                    {r.author},{" "}
                    <a href={r.url} className="underline underline-offset-4" rel="noopener noreferrer" target="_blank">
                      {r.source}
                    </a>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
