import { company, openingHours, services, brands } from "@/content/site";

/** AutoRepair structured data — verified facts only, no ratings or reviews. */
export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    name: company.name,
    legalName: company.legalName,
    url: company.siteUrl,
    telephone: company.phone.e164,
    email: company.email,
    foundingDate: String(company.foundedYear),
    address: {
      "@type": "PostalAddress",
      streetAddress: company.address.street,
      postalCode: company.address.postalCode,
      addressLocality: company.address.city,
      addressCountry: company.address.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: company.address.geo.lat, longitude: company.address.geo.lng },
    areaServed: { "@type": "City", name: "Reykjavík" },
    brand: brands.map((b) => ({ "@type": "Brand", name: b.name })),
    sameAs: [company.facebookUrl],
    openingHoursSpecification: openingHours.rows
      .filter((r) => r.schema.length)
      .map((r) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: r.schema.map((d) => `https://schema.org/${{ Mo: "Monday", Tu: "Tuesday", We: "Wednesday", Th: "Thursday", Fr: "Friday", Sa: "Saturday", Su: "Sunday" }[d]}`),
        opens: r.opens,
        closes: r.closes,
      })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Þjónusta",
      itemListElement: services
        .filter((s) => s.verified)
        .map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s.title } })),
    },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
