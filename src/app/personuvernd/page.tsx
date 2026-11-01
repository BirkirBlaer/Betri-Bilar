import type { Metadata } from "next";
import Link from "next/link";
import { company } from "@/content/site";

export const metadata: Metadata = {
  title: "Persónuvernd",
  description: `Hvernig ${company.name} fer með upplýsingar sem sendar eru í gegnum vefsíðuna.`,
  alternates: { canonical: "/personuvernd" },
};

// NOTE FOR OWNER: review this text (or have it reviewed) before publishing.
export default function Privacy() {
  return (
    <main id="efni" className="wrap max-w-3xl py-24 md:py-32">
      <Link href="/" className="meta text-steel hover:text-charcoal">
        ← {company.name}
      </Link>
      <h1 className="h1 mt-8 text-ink">Persónuvernd</h1>
      <div className="mt-10 space-y-6 text-[1.0625rem] leading-relaxed text-charcoal/85 [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-ink">
        <p>
          {company.legalName} (kt. {company.kennitala}), {company.address.street}, {company.address.postalCode}{" "}
          {company.address.city}, ber ábyrgð á þeim upplýsingum sem sendar eru í gegnum þessa vefsíðu.
        </p>
        <h2>Hvaða upplýsingum er safnað</h2>
        <p>
          Þegar þú sendir beiðni um tíma fáum við nafn, símanúmer eða netfang, upplýsingar um bílinn og lýsingu á því sem er að.
          Við biðjum ekki um aðrar upplýsingar.
        </p>
        <h2>Til hvers</h2>
        <p>Eingöngu til að svara beiðninni og hafa samband við þig um viðgerðina. Upplýsingarnar eru ekki notaðar í markaðsskyni og ekki afhentar öðrum.</p>
        <h2>Hvernig</h2>
        <p>
          Beiðnin er send sem tölvupóstur til verkstæðisins í gegnum póstþjónustuna Resend. Vefsíðan sjálf geymir ekki beiðnir.
          Tölvupóstum er eytt þegar þeirra er ekki lengur þörf.
        </p>
        <h2>Vafrakökur</h2>
        <p>Vefsíðan notar engar vafrakökur til greiningar eða auglýsinga.</p>
        <h2>Réttindi þín</h2>
        <p>
          Þú getur beðið um að sjá eða láta eyða upplýsingum um þig með því að senda póst á{" "}
          <a href={`mailto:${company.email}`} className="underline underline-offset-4">
            {company.email}
          </a>{" "}
          eða hringja í {company.phone.display}. Þú getur einnig leitað til Persónuverndar (personuvernd.is).
        </p>
      </div>
    </main>
  );
}
