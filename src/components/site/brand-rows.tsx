"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

/**
 * The four makes, set as large type. Rows drift sideways in alternating directions as the
 * section scrolls — the type itself is the visual. Names only; no manufacturer logos.
 */
export function BrandRows({ names }: { names: string[] }) {
  const ref = useRef<HTMLUListElement>(null);
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.utils.toArray<HTMLElement>("[data-brand]").forEach((el, i) => {
        gsap.fromTo(
          el,
          { xPercent: i % 2 ? 4 : 0 },
          {
            xPercent: i % 2 ? 0 : 4,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.8 },
          },
        );
      });
    },
    { scope: ref },
  );
  return (
    <ul ref={ref} className="mt-[clamp(3rem,8vw,7rem)]" aria-label="Bílamerki sem við sérhæfum okkur í">
      {names.map((name) => (
        <li key={name} className="border-t border-rule-dark last:border-b">
          <div className="wrap py-2 md:py-3">
            <span
              data-brand
              className="block whitespace-nowrap font-semibold leading-[0.95] tracking-[-0.055em]"
              style={{ fontSize: "clamp(3.25rem, 11.5vw, 11rem)" }}
            >
              {name}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
