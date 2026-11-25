import type { Destination, NearbySpot } from "@/lib/data";

export function MapView({ dest, spots }: { dest: Destination; spots: NearbySpot[] }) {
  const span = 0.012;
  const pos = (lat: number, lng: number) => ({
    x: 50 + ((lng - dest.lng) / span) * 50,
    y: 50 - ((lat - dest.lat) / (span * 0.76)) * 50,
  });
  const clamp = (v: number) => Math.min(92, Math.max(8, v));
  return (
    <div className="relative h-full w-full overflow-hidden bg-map">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        {[[5,8,20,14],[30,6,25,18],[60,10,30,12],[8,30,18,22],[34,32,28,14],[70,30,22,24],[6,60,26,16],[40,56,18,24],[66,62,26,14],[10,82,30,14],[48,86,40,10]].map(([x,y,w,h], i) => (
          <rect key={i} x={x} y={y} width={w} height={h} rx="1.5" className="fill-map-block" />
        ))}
        <ellipse cx="62" cy="50" rx="10" ry="6" className="fill-map-park" />
        <g className="stroke-map-road" fill="none" strokeLinecap="round">
          <path d="M0 27 L100 24" strokeWidth="2.2" /><path d="M0 52 Q50 46 100 56" strokeWidth="3" />
          <path d="M0 79 L100 81" strokeWidth="2" /><path d="M27 0 L32 100" strokeWidth="2.4" />
          <path d="M58 0 Q55 50 63 100" strokeWidth="2" /><path d="M0 100 L95 0" strokeWidth="1.2" />
        </g>
      </svg>
      <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: "50%", top: "50%" }}>
        <div className="h-4 w-4 rounded-full border-2 border-foreground bg-primary shadow-[0_0_0_6px_color-mix(in_oklab,var(--primary)_25%,transparent)]" />
      </div>
      {spots.map((s, i) => {
        const p = pos(s.lat, s.lng);
        return (
          <div key={s.id} className="absolute -translate-x-1/2 -translate-y-full" style={{ left: `${clamp(p.x)}%`, top: `${clamp(p.y)}%` }}>
            <div className={`grid h-8 w-8 place-items-center rounded-full rounded-br-none rotate-45 border-2 border-background ${i === 0 ? "bg-primary text-primary-foreground" : "bg-foreground text-background"}`}>
              <span className="-rotate-45 text-sm font-bold">{i + 1}</span>
            </div>
          </div>
        );
      })}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}
