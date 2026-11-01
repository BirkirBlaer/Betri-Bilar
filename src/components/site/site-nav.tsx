"use client";

import { useEffect, useRef, useState } from "react";
import { Phone } from "lucide-react";
import { company, nav } from "@/content/site";
import { cn } from "@/lib/utils";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { scrollToHash } from "@/components/site/smooth-scroll";

/**
 * Minimal sticky navigation. Transparent over the dark hero, then a paper bar once the
 * hero has passed. Active section is tracked with IntersectionObserver.
 */
export function SiteNav() {
  const [solid, setSolid] = useState(false);
  const [onDark, setOnDark] = useState(true);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setSolid(y > 24);
      // Is the bar currently over a dark section?
      const probe = document.elementsFromPoint(window.innerWidth / 2, 36);
      const dark = probe.some((el) => (el as HTMLElement).closest?.("[data-tone='dark']"));
      setOnDark(dark);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = nav.map((n) => n.href.slice(1));
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`));
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    const top = new IntersectionObserver(([e]) => e.isIntersecting && setActive(null), { rootMargin: "0px 0px -60% 0px" });
    const heroEl = document.querySelector("[aria-label='Forsíða']");
    if (heroEl) top.observe(heroEl);
    return () => {
      io.disconnect();
      top.disconnect();
    };
  }, []);

  // Mobile menu: lock scroll, Esc to close, return focus
  useEffect(() => {
    if (!open) return;
    window.__lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    menuRef.current?.querySelector<HTMLElement>("a")?.focus();
    const toggle = toggleRef.current;
    return () => {
      window.__lenis?.start();
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      toggle?.focus();
    };
  }, [open]);

  useGSAP(
    () => {
      if (!open || prefersReducedMotion() || !menuRef.current) return;
      gsap.from(menuRef.current.querySelectorAll("[data-menu-item]"), {
        yPercent: 100,
        duration: 0.9,
        stagger: 0.06,
        ease: "expo.out",
      });
    },
    { dependencies: [open] },
  );

  const go = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    // Wait a frame so the menu can release scroll lock
    requestAnimationFrame(() => {
      scrollToHash(href);
      history.replaceState(null, "", href);
    });
  };

  const dark = onDark && !open ? true : open;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,color,box-shadow,backdrop-filter] duration-500",
        dark ? "text-paper" : "text-charcoal",
        solid && !open && (onDark ? "bg-ink/70 backdrop-blur-md" : "bg-paper/80 backdrop-blur-md shadow-[0_1px_0_var(--rule-light)]"),
      )}
    >
      <nav aria-label="Aðalvalmynd" className="wrap flex h-16 items-center justify-between gap-6 md:h-[4.5rem]">
        <a
          href="#efni"
          onClick={(e) => {
            e.preventDefault();
            setOpen(false);
            if (window.__lenis) window.__lenis.scrollTo(0);
            else window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
          }}
          className="flex items-baseline gap-2 text-[0.9375rem] font-semibold tracking-[-0.02em]"
        >
          {company.name}
          <span className="sr-only">— efst á síðu</span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {nav.map((n) => {
            const isActive = active === n.href;
            return (
              <li key={n.href}>
                <a
                  href={n.href}
                  onClick={go(n.href)}
                  aria-current={isActive ? "true" : undefined}
                  className="group relative inline-flex h-10 items-center px-3 text-sm"
                >
                  <span className={cn("transition-opacity", isActive ? "opacity-100" : "opacity-70 group-hover:opacity-100")}>
                    {n.label}
                  </span>
                  <span
                    aria-hidden
                    className={cn(
                      "absolute inset-x-3 bottom-1.5 h-px origin-left bg-signal transition-transform duration-500 ease-[var(--ease-out-quint)]",
                      isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                    )}
                  />
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href={company.phone.href}
            className={cn(
              "inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors",
              dark ? "bg-paper text-ink hover:bg-signal" : "bg-ink text-paper hover:bg-charcoal",
            )}
          >
            <Phone className="size-3.5" strokeWidth={2} aria-hidden />
            <span>
              <span className="sr-only">Hringja í </span>
              {company.phone.display}
            </span>
          </a>
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="farsimavalmynd"
            className="relative grid size-10 place-items-center rounded-full md:hidden"
          >
            <span className="sr-only">{open ? "Loka valmynd" : "Opna valmynd"}</span>
            <span aria-hidden className={cn("absolute h-px w-5 bg-current transition-transform duration-500", open ? "rotate-45" : "-translate-y-[4px]")} />
            <span aria-hidden className={cn("absolute h-px w-5 bg-current transition-transform duration-500", open ? "-rotate-45" : "translate-y-[4px]")} />
          </button>
        </div>
      </nav>

      {open && (
        <div
          id="farsimavalmynd"
          ref={menuRef}
          className="fixed inset-0 top-16 flex flex-col justify-between bg-ink px-4 pb-8 pt-6 text-paper md:hidden"
        >
          <ul className="flex flex-col">
            {nav.map((n) => (
              <li key={n.href} className="overflow-hidden border-b border-rule-dark">
                <a data-menu-item href={n.href} onClick={go(n.href)} className="block py-4 text-[2.5rem] font-medium leading-none tracking-[-0.04em]">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="meta space-y-1 text-steel-light">
            <p>
              {company.address.street}, {company.address.postalCode} {company.address.city}
            </p>
            <p>
              <a href={`mailto:${company.email}`} className="text-paper">
                {company.email}
              </a>
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
