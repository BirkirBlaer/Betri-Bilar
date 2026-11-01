import { demoMode } from "@/content/site";

/** Small fixed note so nobody mistakes the sales demo for the published site. */
export function DemoNotice() {
  if (!demoMode) return null;
  return (
    <p className="pointer-events-none fixed bottom-3 right-3 z-40 hidden rounded-full bg-ink/85 px-3 py-1.5 font-mono text-[0.6875rem] text-paper/80 backdrop-blur md:block">
      Sýnisútgáfa · efni merkt „til staðfestingar“ bíður samþykkis
    </p>
  );
}
