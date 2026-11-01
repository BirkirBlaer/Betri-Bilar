"use client";

import { useRef, useState, type ReactNode } from "react";
import { gsap, useGSAP, isFinePointer, prefersReducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type Item = { id: string; title: string; summary: string; marker: ReactNode; photo: ReactNode; inlinePhoto: ReactNode };

/**
 * Editorial service rows. Everything is readable without hover; on desktop a photo of the
 * service follows the pointer with a slight tilt. On touch screens the photo sits inline.
 */
export function ServiceList({ items }: { items: Item[] }) {
  const root = useRef<HTMLDivElement>(null);
  const float = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  useGSAP(
    () => {
      const el = float.current;
      if (!el || !isFinePointer() || prefersReducedMotion()) return;
      const xTo = gsap.quickTo(el, "x", { duration: 0.7, ease: "power3.out" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.7, ease: "power3.out" });
      const rTo = gsap.quickTo(el, "rotation", { duration: 0.9, ease: "power3.out" });
      let lastX = 0;
      const move = (e: PointerEvent) => {
        const r = root.current!.getBoundingClientRect();
        xTo(e.clientX - r.left);
        yTo(e.clientY - r.top);
        rTo(gsap.utils.clamp(-6, 6, (e.clientX - lastX) * 0.4));
        lastX = e.clientX;
      };
      root.current!.addEventListener("pointermove", move);
      return () => root.current?.removeEventListener("pointermove", move);
    },
    { scope: root },
  );

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from("[data-row-rule]", {
        scaleX: 0,
        transformOrigin: "left",
        duration: 1.4,
        stagger: 0.1,
        ease: "expo.inOut",
        scrollTrigger: { trigger: root.current, start: "top 80%", once: true },
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="relative mt-[clamp(3rem,7vw,6rem)]" onPointerLeave={() => setHovered(null)}>
      <ul className="wrap">
        {items.map((s, i) => (
          <li
            key={s.id}
            onPointerEnter={() => setHovered(i)}
            className="group relative grid grid-cols-12 gap-x-[clamp(0.75rem,2vw,2rem)] gap-y-4 py-8 md:py-10"
          >
            <span data-row-rule aria-hidden className="absolute inset-x-0 top-0 h-px bg-rule-light" />
            <h3
              className={cn(
                "h3 col-span-12 text-ink transition-transform duration-700 ease-[var(--ease-out-quint)] md:col-span-6",
                hovered === i && "md:translate-x-4",
              )}
            >
              {s.title}
              {s.marker}
            </h3>
            <p className="col-span-12 max-w-[46ch] text-[1rem] leading-relaxed text-charcoal/80 md:col-span-5 md:col-start-8">
              {s.summary}
            </p>
            {/* Inline photo for touch screens */}
            <div className="col-span-12 mt-2 md:hidden">{s.inlinePhoto}</div>
          </li>
        ))}
        <li aria-hidden className="h-px bg-rule-light" data-row-rule />
      </ul>

      {/* Pointer-following photo (desktop only, decorative duplicate) */}
      <div
        ref={float}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-10 hidden w-[min(26vw,24rem)] md:block"
        style={{ translate: "-50% -50%" }}
      >
        {items.map((s, i) => (
          <div
            key={s.id}
            className={cn(
              "transition-[opacity,clip-path] duration-500 ease-[var(--ease-out-quint)]",
              i === 0 ? "relative" : "absolute inset-0",
              hovered === i ? "opacity-100 [clip-path:inset(0%)]" : "opacity-0 [clip-path:inset(12%_8%)]",
            )}
          >
            {s.photo}
          </div>
        ))}
      </div>
    </div>
  );
}
