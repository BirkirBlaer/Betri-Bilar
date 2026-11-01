"use client";

import { useRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { ArrowUpRight, ArrowDown, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { gsap, useGSAP, isFinePointer, prefersReducedMotion } from "@/lib/gsap";
import { scrollToHash } from "@/components/site/smooth-scroll";

type Props = ComponentPropsWithoutRef<"a"> & {
  variant?: "solid" | "line";
  tone?: "dark" | "light";
  icon?: "arrow" | "down" | "phone";
  magnetic?: boolean;
  children: ReactNode;
};

const icons = { arrow: ArrowUpRight, down: ArrowDown, phone: Phone };

/**
 * Link styled as a button. Magnetic on desktop (fine pointer, motion allowed),
 * with an arrow that slides out and back in on hover. In-page anchors use smooth scroll.
 */
export function ActionLink({
  variant = "solid",
  tone = "dark",
  icon = "arrow",
  magnetic = true,
  className,
  children,
  href,
  onClick,
  ...rest
}: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const Icon = icons[icon];

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !magnetic || !isFinePointer() || prefersReducedMotion()) return;
      const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * 0.22);
        yTo((e.clientY - (r.top + r.height / 2)) * 0.3);
      };
      const leave = () => { xTo(0); yTo(0); };
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      return () => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
      };
    },
    { dependencies: [magnetic] },
  );

  const vertical = icon === "down";

  return (
    <a
      ref={ref}
      href={href}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented && href?.startsWith("#")) {
          e.preventDefault();
          scrollToHash(href);
          history.replaceState(null, "", href);
        }
      }}
      className={cn(
        "group relative inline-flex min-h-12 items-center gap-3 rounded-full pl-6 pr-2 text-[0.9375rem] font-medium tracking-[-0.01em] transition-colors duration-300 will-change-transform select-none",
        variant === "solid" && tone === "dark" && "bg-signal text-ink hover:bg-paper",
        variant === "solid" && tone === "light" && "bg-ink text-paper hover:bg-charcoal",
        variant === "line" && tone === "dark" && "text-paper ring-1 ring-inset ring-rule-dark hover:ring-paper/50",
        variant === "line" && tone === "light" && "text-charcoal ring-1 ring-inset ring-rule-light hover:ring-charcoal/50",
        className,
      )}
      {...rest}
    >
      <span>{children}</span>
      <span
        aria-hidden
        className={cn(
          "relative grid size-9 place-items-center overflow-hidden rounded-full",
          variant === "solid" && tone === "dark" && "bg-ink text-paper",
          variant === "solid" && tone === "light" && "bg-paper text-ink",
          variant === "line" && tone === "dark" && "bg-paper/10 text-paper",
          variant === "line" && tone === "light" && "bg-charcoal/8 text-charcoal",
        )}
      >
        <Icon
          className={cn(
            "size-4 transition-transform duration-500 ease-[var(--ease-out-quint)]",
            vertical ? "group-hover:translate-y-6" : "group-hover:translate-x-6 group-hover:-translate-y-6",
          )}
          strokeWidth={1.75}
        />
        <Icon
          className={cn(
            "absolute size-4 transition-transform duration-500 ease-[var(--ease-out-quint)]",
            vertical ? "-translate-y-6 group-hover:translate-y-0" : "-translate-x-6 translate-y-6 group-hover:translate-x-0 group-hover:translate-y-0",
          )}
          strokeWidth={1.75}
        />
      </span>
    </a>
  );
}
