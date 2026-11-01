"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { company, hero, openingHours } from "@/content/site";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion, isFinePointer } from "@/lib/gsap";
import { ActionLink } from "@/components/ui/action-link";
import { DiscDrawing } from "@/components/three/disc-drawing";
import type { SceneState } from "@/components/three/brake-scene";

const BrakeScene = dynamic(() => import("@/components/three/brake-scene"), { ssr: false });

function webglAvailable() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Hero + signature scroll sequence.
 * A sticky stage (one extra screen of scroll, no scroll-jacking): the brake assembly turns
 * and the caliper slides off, then a frame opens onto the real workshop photograph.
 */
export function Hero({ photo }: { photo: ReactNode }) {
  const wrap = useRef<HTMLElement>(null);
  const state = useRef<SceneState>({ progress: 0, pointerX: 0, pointerY: 0 });
  const [use3d, setUse3d] = useState(false);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(true);
  const [compact, setCompact] = useState(false);
  const [labels, setLabels] = useState(false);

  // Load the 3D scene after first paint, only where it can run well.
  useEffect(() => {
    if (prefersReducedMotion() || !webglAvailable()) return;
    const go = () => {
      setCompact(window.matchMedia("(max-width: 767px)").matches);
      setLabels(window.matchMedia("(min-width: 1100px)").matches);
      setUse3d(true);
    };
    const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
    const id = ric(go);
    return () => (window.cancelIdleCallback ?? window.clearTimeout)(id as number);
  }, []);

  useEffect(() => {
    if (!isFinePointer()) return;
    const move = (e: PointerEvent) => {
      state.current.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      state.current.pointerY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);

  useGSAP(
    () => {
      const reduced = prefersReducedMotion();
      const q = gsap.utils.selector(wrap);

      // Page-load entrance — the one orchestrated moment on load
      if (!reduced) {
        const intro = gsap.timeline({ defaults: { ease: "expo.out" } });
        intro
          .from(q("[data-hero-line]"), { yPercent: 110, duration: 1.6, stagger: 0.1 }, 0.15)
          .from(q("[data-hero-fade]"), { autoAlpha: 0, y: 16, duration: 1.2, stagger: 0.08 }, 0.6)
          .from(q("[data-hero-visual]"), { autoAlpha: 0, scale: 0.92, duration: 2.2 }, 0.1);
      }

      ScrollTrigger.create({
        trigger: wrap.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => (state.current.progress = self.progress),
        onToggle: (self) => setActive(self.isActive || self.progress < 1),
      });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: wrap.current, start: "top top", end: "bottom bottom", scrub: reduced ? true : 0.6 },
      });

      if (reduced) {
        // No movement — a plain cross-fade to the photograph
        tl.to(q("[data-hero-content]"), { autoAlpha: 0, duration: 0.3 }, 0.2)
          .fromTo(q("[data-hero-frame]"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 0.45)
          .fromTo(q("[data-hero-caption]"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, 0.7);
        return;
      }

      tl.to(q("[data-hero-content]"), { yPercent: -18, autoAlpha: 0, duration: 0.42 }, 0.04)
        .to(q("[data-hero-visual]"), { xPercent: -14, scale: 1.08, duration: 0.6 }, 0)
        .fromTo(
          q("[data-hero-frame]"),
          { clipPath: "inset(38% 30% 38% 30% round 2px)", autoAlpha: 0 },
          { clipPath: "inset(0% 0% 0% 0% round 0px)", autoAlpha: 1, duration: 0.42, ease: "power2.inOut" },
          0.48,
        )
        .fromTo(q("[data-hero-frame-img]"), { scale: 1.35 }, { scale: 1.02, duration: 0.52, ease: "power2.out" }, 0.48)
        .to(q("[data-hero-visual]"), { autoAlpha: 0, duration: 0.2 }, 0.78)
        .fromTo(
          q("[data-hero-caption-line]"),
          { yPercent: 110 },
          { yPercent: 0, duration: 0.18, stagger: 0.04, ease: "power3.out" },
          0.76,
        );
    },
    { scope: wrap },
  );

  const weekday = openingHours.rows[0];

  return (
    <section ref={wrap} aria-label="Forsíða" className="relative h-[200svh] bg-ink text-paper md:h-[220svh]">
      <div className="sticky top-0 h-svh min-h-[34rem] overflow-hidden">
        {/* Brake assembly — drawing first, 3D on top once ready */}
        <div
          data-hero-visual
          className="absolute right-[-30vw] top-[7svh] aspect-square w-[100vw] md:right-[1vw] md:top-[46%] md:w-[min(54vw,52rem)] md:-translate-y-1/2"
        >
          <DiscDrawing
            className={`absolute inset-[11%] text-steel/60 transition-opacity duration-1000 ${ready ? "opacity-0" : "opacity-100"}`}
          />
          {use3d && (
            <div className={`absolute inset-0 transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`}>
              <BrakeScene state={state} compact={compact} labels={labels} onReady={() => setReady(true)} active={active} />
            </div>
          )}
        </div>

        {/* Soft vignette so the type always reads over the metal */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_0%_100%,rgb(21_22_18/0.92)_30%,transparent_70%)] md:bg-[radial-gradient(80%_90%_at_0%_70%,rgb(21_22_18/0.85)_25%,transparent_65%)]"
        />

        <div data-hero-content className="wrap relative flex h-full flex-col justify-end pb-6 pt-24 md:pb-14">
          <p data-hero-fade className="meta mb-4 text-steel-light md:mb-6">
            {hero.descriptor}
          </p>
          <h1 className="display -ml-[0.06em] text-paper">
            <span className="block overflow-hidden pb-[0.06em]">
              <span data-hero-line className="block">
                Betri
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.06em]">
              <span data-hero-line className="block">
                Bílar
              </span>
            </span>
          </h1>
          <div className="mt-6 flex flex-col gap-7 md:mt-10">
            <p data-hero-fade className="lede max-w-[34ch] text-paper/80">
              {hero.lede}
            </p>
            <div data-hero-fade className="flex flex-wrap gap-3">
              <ActionLink href="#hafa-samband">Biðja um tíma</ActionLink>
              <ActionLink href="#thjonusta" variant="line" icon="down">
                Skoða þjónustu
              </ActionLink>
            </div>
          </div>
          <dl
            data-hero-fade
            className="meta mt-10 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-rule-dark pt-4 text-steel-light md:mt-14 md:grid-cols-4"
          >
            <div>
              <dt className="sr-only">Heimilisfang</dt>
              <dd>
                {company.address.street}, {company.address.postalCode} {company.address.city}
              </dd>
            </div>
            <div>
              <dt className="sr-only">Sími</dt>
              <dd>
                <a href={company.phone.href} className="text-paper underline-offset-4 hover:underline">
                  {company.phone.display}
                </a>
              </dd>
            </div>
            <div className="hidden md:block">
              <dt className="sr-only">Opnunartími</dt>
              <dd>
                {weekday.days}, {weekday.hours.replace(/ /g, "")}
              </dd>
            </div>
            <div className="hidden text-right md:block">
              <dt className="sr-only">Starfandi frá</dt>
              <dd>Frá {company.foundedYear}</dd>
            </div>
          </dl>
        </div>

        {/* The frame that opens onto the workshop */}
        <div data-hero-frame className="invisible absolute inset-0">
          <div data-hero-frame-img className="absolute inset-0">
            {photo}
          </div>
          <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_top,rgb(21_22_18/0.85),transparent_55%)]" />
          <div data-hero-caption className="wrap absolute inset-x-0 bottom-0 pb-10 md:pb-14">
            <p className="h1 text-paper">
              <span className="block overflow-hidden pb-[0.08em]">
                <span data-hero-caption-line className="block">
                  Skeifan 5c.
                </span>
              </span>
              <span className="block overflow-hidden pb-[0.08em]">
                <span data-hero-caption-line className="block text-paper/60">
                  Síðan {company.foundedYear}.
                </span>
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
