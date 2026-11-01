"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, SplitText, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/** Heading whose lines rise out of a mask as it scrolls into view. */
export function RevealText({
  as: Tag = "h2",
  className,
  children,
  delay = 0,
  id,
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  delay?: number;
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (!ref.current || prefersReducedMotion()) return;
      SplitText.create(ref.current, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        linesClass: "reveal-line",
        onSplit(self) {
          return gsap.from(self.lines, {
            yPercent: 105,
            duration: 1.25,
            stagger: 0.09,
            delay,
            scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
          });
        },
      });
    },
    { scope: ref },
  );
  return (
    <Tag ref={ref} id={id} className={cn(className)}>
      {children}
    </Tag>
  );
}

/** Image frame that opens from a narrow band (clip-path) while its photo settles in scale. */
export function RevealFrame({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      const inner = el.firstElementChild;
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 88%", once: true } });
      tl.fromTo(el, { clipPath: "inset(18% 12% 18% 12%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "expo.inOut" });
      if (inner) tl.fromTo(inner, { scale: 1.18 }, { scale: 1, duration: 1.8, ease: "expo.out" }, 0.1);
      // Gentle parallax once revealed
      if (inner)
        gsap.fromTo(
          inner,
          { yPercent: -4 },
          { yPercent: 4, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } },
        );
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      {children}
    </div>
  );
}
