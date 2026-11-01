import Link from "next/link";
import { company, nav } from "@/content/site";
import { currentYear } from "@/lib/year";

export async function Footer() {
  const year = await currentYear();
  return (
    <footer data-tone="dark" className="border-t border-rule-dark bg-ink text-paper">
      <div className="wrap grid-12 gap-y-10 py-14 md:py-20">
        <div className="col-span-12 md:col-span-5">
          <p className="text-[1.375rem] font-semibold tracking-[-0.03em]">{company.name}</p>
          <p className="mt-2 max-w-[32ch] text-sm leading-relaxed text-steel-light">
            {company.descriptor} í Skeifunni, Reykjavík. Frá {company.foundedYear}.
          </p>
        </div>
        <nav aria-label="Síðufótur" className="col-span-6 md:col-span-2 md:col-start-7">
          <ul className="space-y-2 text-sm">
            {nav.map((n) => (
              <li key={n.href}>
                <a href={`/${n.href}`} className="text-paper/75 hover:text-paper">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="col-span-6 space-y-2 text-sm md:col-span-3 md:col-start-10">
          <p>
            <a href={company.phone.href} className="text-paper/75 hover:text-paper">
              {company.phone.display}
            </a>
          </p>
          <p>
            <a href={`mailto:${company.email}`} className="break-all text-paper/75 hover:text-paper">
              {company.email}
            </a>
          </p>
          <p className="text-paper/75">
            {company.address.street}, {company.address.postalCode} {company.address.city}
          </p>
          <p>
            <a href={company.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-paper/75 hover:text-paper">
              Facebook
            </a>
          </p>
        </div>
      </div>
      <div className="wrap flex flex-col gap-2 border-t border-rule-dark py-6 text-xs text-steel-light sm:flex-row sm:justify-between">
        <p>
          © {year} {company.legalName} · kt. {company.kennitala}
        </p>
        <Link href="/personuvernd" className="hover:text-paper">
          Persónuvernd
        </Link>
      </div>
    </footer>
  );
}
