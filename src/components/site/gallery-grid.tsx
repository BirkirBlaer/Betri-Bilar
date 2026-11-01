"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { RevealFrame } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

type Item = { id: string; alt: string; aspect: number; className: string; thumb: ReactNode; large: ReactNode };

/** Asymmetric editorial grid + accessible lightbox (native <dialog>, keyboard and swipe). */
export function GalleryGrid({ items }: { items: Item[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState<number | null>(null);
  const touchX = useRef<number | null>(null);

  const open = (i: number) => {
    setIndex(i);
    dialog.current?.showModal();
    window.__lenis?.stop();
    if (!prefersReducedMotion()) gsap.fromTo(dialog.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, ease: "power2.out" });
  };
  const close = () => dialog.current?.close();
  const step = useCallback(
    (d: number) => setIndex((i) => (i === null ? i : (i + d + items.length) % items.length)),
    [items.length],
  );

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    const onClose = () => {
      window.__lenis?.start();
      setIndex(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    el.addEventListener("close", onClose);
    el.addEventListener("keydown", onKey);
    return () => {
      el.removeEventListener("close", onClose);
      el.removeEventListener("keydown", onKey);
    };
  }, [step]);

  useEffect(() => {
    if (index === null || !stage.current || prefersReducedMotion()) return;
    gsap.fromTo(stage.current, { autoAlpha: 0, scale: 0.97 }, { autoAlpha: 1, scale: 1, duration: 0.6, ease: "expo.out" });
  }, [index]);

  const current = index !== null ? items[index] : null;

  return (
    <>
      <ul className="wrap grid-12 mt-[clamp(3rem,7vw,6rem)] gap-y-[clamp(1.5rem,4vw,3rem)]">
        {items.map((item, i) => (
          <li key={item.id} className={item.className}>
            <button
              type="button"
              onClick={() => open(i)}
              className="group block w-full text-left"
              aria-label={`Stækka mynd: ${item.alt}`}
            >
              <RevealFrame>
                <div className="transition-transform duration-[1.2s] ease-[var(--ease-out-quint)] group-hover:scale-[1.035]">
                  {item.thumb}
                </div>
              </RevealFrame>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        aria-label="Myndasafn"
        onClick={(e) => e.target === dialog.current && close()}
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-ink/95 p-0 text-paper backdrop:bg-transparent"
        data-lenis-prevent
      >
        {current && (
          <div
            className="flex h-full flex-col"
            onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
            onTouchEnd={(e) => {
              if (touchX.current === null) return;
              const dx = e.changedTouches[0].clientX - touchX.current;
              if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
              touchX.current = null;
            }}
          >
            <div className="wrap flex h-16 items-center justify-between">
              <p className="meta text-steel-light" aria-live="polite">
                {index! + 1} / {items.length}
              </p>
              <button type="button" onClick={close} className="grid size-11 place-items-center rounded-full hover:bg-paper/10">
                <X className="size-5" strokeWidth={1.5} />
                <span className="sr-only">Loka myndasafni</span>
              </button>
            </div>
            <div className="relative flex flex-1 items-center justify-center px-4 md:px-20" onClick={(e) => e.target === e.currentTarget && close()}>
              <figure ref={stage} className="flex w-full max-h-full flex-col items-center">
                <div className="w-full" style={{ width: `min(100%, calc(74svh * ${current.aspect}))` }}>
                  {current.large}
                </div>
                <figcaption className="meta mt-4 text-steel-light">{current.alt}</figcaption>
              </figure>
              {(["prev", "next"] as const).map((dir) => (
                <button
                  key={dir}
                  type="button"
                  onClick={() => step(dir === "next" ? 1 : -1)}
                  className={cn(
                    "absolute top-1/2 hidden size-12 -translate-y-1/2 place-items-center rounded-full ring-1 ring-rule-dark transition-colors hover:bg-paper hover:text-ink md:grid",
                    dir === "prev" ? "left-4" : "right-4",
                  )}
                >
                  {dir === "prev" ? <ChevronLeft className="size-5" strokeWidth={1.5} /> : <ChevronRight className="size-5" strokeWidth={1.5} />}
                  <span className="sr-only">{dir === "prev" ? "Fyrri mynd" : "Næsta mynd"}</span>
                </button>
              ))}
            </div>
            <div className="flex justify-center gap-3 pb-6 md:hidden">
              <button type="button" onClick={() => step(-1)} className="grid size-12 place-items-center rounded-full ring-1 ring-rule-dark">
                <ChevronLeft className="size-5" strokeWidth={1.5} />
                <span className="sr-only">Fyrri mynd</span>
              </button>
              <button type="button" onClick={() => step(1)} className="grid size-12 place-items-center rounded-full ring-1 ring-rule-dark">
                <ChevronRight className="size-5" strokeWidth={1.5} />
                <span className="sr-only">Næsta mynd</span>
              </button>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
