import { demoMode } from "@/content/site";
import { cn } from "@/lib/utils";

/**
 * Small marker on content that still needs the owner's confirmation.
 * Visible only while NEXT_PUBLIC_DEMO_MODE is not "false".
 */
export function Unverified({ show = true, className }: { show?: boolean; className?: string }) {
  if (!demoMode || !show) return null;
  return (
    <span
      title="Sýnisútgáfa: þetta þarf eigandi að staðfesta fyrir birtingu"
      className={cn(
        "ml-2 inline-flex translate-y-[-0.15em] items-center rounded-full border border-dashed border-current px-2 py-0.5 align-middle font-mono text-[0.625rem] font-normal tracking-normal opacity-60",
        className,
      )}
    >
      til staðfestingar
    </span>
  );
}
