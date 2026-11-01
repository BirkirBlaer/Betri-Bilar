/**
 * Static technical drawing of the brake assembly. Shown before WebGL loads,
 * when WebGL is unavailable, and for visitors who prefer reduced motion.
 */
export function DiscDrawing({ className }: { className?: string }) {
  const drilled: { x: number; y: number }[] = [];
  const radii = [106, 127, 148];
  for (let i = 0; i < 12; i++) {
    radii.forEach((r, j) => {
      const a = (i / 12) * Math.PI * 2 + j * 0.085;
      drilled.push({ x: Math.cos(a) * r, y: Math.sin(a) * r });
    });
  }
  const bolts = Array.from({ length: 5 }, (_, i) => {
    const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
    return { x: Math.cos(a) * 55, y: Math.sin(a) * 55 };
  });
  return (
    <svg viewBox="-200 -200 400 400" className={className} aria-hidden fill="none">
      <g stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke">
        <circle r="160" />
        <circle r="156" strokeOpacity="0.4" />
        <circle r="86" />
        <circle r="82" strokeOpacity="0.4" />
        <circle r="30" />
        {bolts.map((b, i) => (
          <circle key={i} cx={b.x} cy={b.y} r="7.5" />
        ))}
        {drilled.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r="4.2" strokeOpacity="0.7" />
        ))}
        <path d="M -190 0 H 190 M 0 -190 V 190" strokeOpacity="0.25" strokeDasharray="6 4 1 4" />
        {/* caliper outline */}
        <path
          d="M 176.3 -78.3 A 192 192 0 0 1 176.3 78.3 L 102.8 45.7 A 112 112 0 0 0 102.8 -45.7 Z"
          transform="rotate(-35.5)"
          className="text-signal"
          stroke="currentColor"
          strokeWidth="1.25"
        />
      </g>
    </svg>
  );
}
