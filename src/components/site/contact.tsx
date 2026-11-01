import { ArrowUpRight } from "lucide-react";
import { company, contact, openingHours } from "@/content/site";
import { RevealText } from "@/components/ui/reveal";
import { Unverified } from "@/components/ui/unverified";
import { RequestForm } from "@/components/site/request-form";

const linkClass =
  "group inline-flex items-center gap-1.5 text-paper underline decoration-rule-dark underline-offset-[6px] transition-colors hover:decoration-signal";

export function Contact() {
  const configured = !!process.env.RESEND_API_KEY;
  return (
    <section id="hafa-samband" data-tone="dark" aria-labelledby="hafa-samband-h" className="bg-ink py-[clamp(5rem,12vw,10rem)] text-paper">
      <div className="wrap grid-12 gap-y-16">
        <div className="col-span-12 md:col-span-6">
          <RevealText id="hafa-samband-h" className="h1">
            {contact.heading}
          </RevealText>
          <p className="lede mt-6 max-w-[38ch] text-paper/70">{contact.lede}</p>

          <a
            href={company.phone.href}
            className="group mt-10 inline-flex items-baseline gap-4 font-semibold leading-none tracking-[-0.05em] transition-colors hover:text-signal md:mt-14"
            style={{ fontSize: "clamp(3.25rem, 8vw, 7rem)" }}
          >
            <span className="sr-only">Hringja í síma </span>
            {company.phone.display}
            <ArrowUpRight
              aria-hidden
              className="size-[0.4em] translate-y-[-0.1em] transition-transform duration-500 ease-[var(--ease-out-quint)] group-hover:-translate-y-[0.25em] group-hover:translate-x-[0.1em]"
              strokeWidth={1.5}
            />
          </a>

          <dl className="mt-12 grid gap-x-8 gap-y-8 border-t border-rule-dark pt-8 sm:grid-cols-2">
            <div>
              <dt className="meta text-steel-light">Netfang</dt>
              <dd className="mt-2">
                <a href={`mailto:${company.email}`} className={linkClass}>
                  {company.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="meta text-steel-light">Heimilisfang</dt>
              <dd className="mt-2">
                <address className="not-italic">
                  {company.address.street}
                  <br />
                  {company.address.postalCode} {company.address.city}
                </address>
                <a href={company.mapsUrl} target="_blank" rel="noopener noreferrer" className={`${linkClass} mt-2 text-sm`}>
                  Leiðarlýsing á Google Maps
                  <ArrowUpRight aria-hidden className="size-3.5" />
                  <span className="sr-only">(opnast í nýjum flipa)</span>
                </a>
              </dd>
            </div>
            <div>
              <dt className="meta text-steel-light">
                Opnunartími
                <Unverified show={!openingHours.verified} />
              </dt>
              <dd className="mt-2">
                <table className="w-full text-left">
                  <caption className="sr-only">Opnunartími verkstæðisins</caption>
                  <tbody>
                    {openingHours.rows.map((r) => (
                      <tr key={r.days}>
                        <th scope="row" className="py-0.5 pr-4 font-normal text-paper/70">
                          {r.days}
                        </th>
                        <td className="py-0.5 tabular-nums">{r.hours}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </dd>
            </div>
            <div>
              <dt className="meta text-steel-light">Facebook</dt>
              <dd className="mt-2">
                <a href={company.facebookUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  facebook.com/Betribilar
                  <ArrowUpRight aria-hidden className="size-3.5" />
                  <span className="sr-only">(opnast í nýjum flipa)</span>
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <div className="col-span-12 md:col-span-5 md:col-start-8 md:pt-4">
          <h3 className="h3 mb-8">Beiðni um tíma</h3>
          <RequestForm configured={configured} />
        </div>
      </div>
    </section>
  );
}
