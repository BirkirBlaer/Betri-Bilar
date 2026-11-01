import Image from "next/image";
import { getPhoto } from "@/content/photos";
import { demoMode } from "@/content/site";
import { cn } from "@/lib/utils";

type Props = {
  slot: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  /** Class for the <img>, e.g. to oversize it for parallax. */
  imgClassName?: string;
  tone?: "dark" | "light";
  /** Fill the parent instead of using the slot's aspect ratio. */
  fill?: boolean;
};

/**
 * Renders a processed photo for a slot, or — until the owner's photo is added —
 * a placeholder frame that says which photo belongs there. Never substitutes stock imagery.
 */
export function Photo({ slot, sizes, priority, className, imgClassName, tone = "dark", fill }: Props) {
  const { slot: s, photo } = getPhoto(slot);
  const [w, h] = s.aspect;

  return (
    <div className={cn("relative overflow-hidden", className)} style={fill ? undefined : { aspectRatio: `${w} / ${h}` }}>
      {photo ? (
        <Image
          src={photo.src}
          alt={photo.alt ?? s.alt}
          width={photo.width}
          height={photo.height}
          sizes={sizes}
          priority={priority}
          placeholder="blur"
          blurDataURL={photo.blur}
          className={cn("photo-grade absolute inset-0 size-full object-cover", imgClassName)}
        />
      ) : (
        <PhotoPlaceholder brief={s.brief} id={s.id} tone={tone} className={imgClassName} top={fill} />
      )}
    </div>
  );
}

function PhotoPlaceholder({ brief, id, tone, className, top }: { brief: string; id: string; tone: "dark" | "light"; className?: string; top?: boolean }) {
  const dark = tone === "dark";
  return (
    <div
      role="img"
      aria-label={`Mynd frá Betri Bílum kemur hér: ${brief}`}
      className={cn(
        "absolute inset-0 size-full",
        dark ? "bg-ink-2 text-steel-light" : "bg-paper-2 text-steel",
        className,
      )}
    >
      {/* Fine construction grid — reads as a frame waiting for its photo */}
      <svg aria-hidden className="absolute inset-0 size-full opacity-[0.55]" preserveAspectRatio="none">
        <defs>
          <pattern id={`g-${id}`} width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M48 0H0V48" fill="none" stroke="currentColor" strokeOpacity="0.14" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#g-${id})`} />
        <line x1="0" y1="0" x2="100%" y2="100%" stroke="currentColor" strokeOpacity="0.12" />
        <line x1="100%" y1="0" x2="0" y2="100%" stroke="currentColor" strokeOpacity="0.12" />
      </svg>
      {demoMode && (
        <div className={cn("absolute inset-x-0 flex items-end justify-between gap-4", top ? "wrap top-24" : "bottom-0 p-[clamp(0.75rem,2vw,1.25rem)]")}>
          <p className="max-w-[34ch] text-[0.8125rem] leading-snug">
            <span className={cn("block font-medium", dark ? "text-paper" : "text-charcoal")}>Mynd frá Betri Bílum</span>
            {brief}
          </p>
          <span className="shrink-0 font-mono text-[0.625rem] opacity-70">{id}</span>
        </div>
      )}
    </div>
  );
}
