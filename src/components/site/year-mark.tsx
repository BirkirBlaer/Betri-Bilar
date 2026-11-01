"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

/** Oversized founding year. Each digit rolls up into place as it scrolls into view. */
export function YearMark({ year }: { year: number }) {
  const ref = useRef<HTMLParagraphElement>(null);
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from(ref.current!.querySelectorAll("[data-digit]"), {
        yPercent: 100,
        duration: 1.6,
        stagger: 0.08,
        ease: "expo.out",
        scrollTrigger: { trigger: ref.current, start: "top 90%", once: true },
      });
    },
    { scope: ref },
  );
  return (
    <p
      ref={ref}
      aria-label={`Frá ${year}`}
      className="-mb-[0.14em] -ml-[0.04em] flex font-semibold leading-[0.8] tracking-[-0.07em] text-ink"
      style={{ fontSize: "clamp(6.5rem, 40vw, 40rem)" }}
    >
      {String(year)
        .split("")
        .map((d, i) => (
          <span key={i} aria-hidden className="-mx-[0.04em] inline-block overflow-hidden px-[0.04em] pb-[0.02em]">
            <span data-digit className="inline-block">
              {d}
            </span>
          </span>
        ))}
    </p>
  );
}
