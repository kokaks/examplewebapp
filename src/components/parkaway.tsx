import { Link } from "@tanstack/react-router";
import { Home, Bookmark, Settings, Footprints, MapPin } from "lucide-react";
import type { ReactNode } from "react";
import { ease, formatDistance, formatPrice, type NearbySpot } from "@/lib/data";
import { useApp } from "@/lib/store";

export function Logo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-label="parkaway">
      <rect width="40" height="40" rx="11" className="fill-cream" />
      <g className="stroke-ink" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M20 6v9M16.5 11.5 20 15l3.5-3.5" />
        <path d="M20 34v-9M16.5 28.5 20 25l3.5 3.5" />
        <path d="M6 20h9M11.5 16.5 15 20l-3.5 3.5" />
        <path d="M34 20h-9M28.5 16.5 25 20l3.5 3.5" />
      </g>
    </svg>
  );
}

export function EaseTag({ chance }: { chance: number }) {
  const e = ease(chance);
  const cls = e === "Easy" ? "bg-success/15 text-success" : e === "Busy" ? "bg-warning/15 text-warning" : "bg-danger/15 text-danger";
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${cls}`}>{e}</span>;
}

export function TypeTag({ type }: { type: string }) {
  return <span className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground">{type}</span>;
}

export function ChanceBar({ chance }: { chance: number }) {
  const e = ease(chance);
  const bar = e === "Easy" ? "bg-success" : e === "Busy" ? "bg-warning" : "bg-danger";
  const txt = e === "Easy" ? "text-success" : e === "Busy" ? "text-warning" : "text-danger";
  return (
    <div>
      <div className="mb-1.5 flex justify-between text-xs">
        <span className="text-muted-foreground">Chance of finding parking</span>
        <span className={`font-semibold ${txt}`}>{chance}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-secondary">
        <div className={`h-full rounded-full ${bar}`} style={{ width: `${chance}%` }} />
      </div>
    </div>
  );
}

export function SpotMeta({ spot }: { spot: NearbySpot }) {
  const { units } = useApp();
  return (
    <div className="flex items-center gap-4 text-sm text-muted-foreground">
      <span className="flex items-center gap-1"><MapPin size={14} />{formatDistance(spot.distance, units)}</span>
      <span className="flex items-center gap-1"><Footprints size={14} />{spot.walk} min walk</span>
    </div>
  );
}

export function SpotCard({ spot, index, best, destId }: { spot: NearbySpot; index: number; best?: boolean; destId: string }) {
  return (
    <Link to="/spot/$spotId" params={{ spotId: spot.id }} search={{ dest: destId }}
      className={`block space-y-3 rounded-xl border bg-card p-4 transition active:scale-[0.99] ${best ? "border-primary" : "border-border"}`}>
      <div className="flex items-start gap-3">
        <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-sm font-bold ${best ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"}`}>{index + 1}</span>
        <div className="min-w-0 flex-1">
          {best && <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-primary">Best match</div>}
          <div className="truncate font-semibold">{spot.name}</div>
          <div className="mt-1 flex items-center gap-2"><TypeTag type={spot.type} /><span className="text-sm font-medium">{formatPrice(spot.price)}</span></div>
        </div>
      </div>
      <ChanceBar chance={spot.chance} />
      <SpotMeta spot={spot} />
    </Link>
  );
}

export function PageHeader({ title, left, right }: { title: string; left?: ReactNode; right?: ReactNode }) {
  return (
    <header className="flex items-center gap-3 px-5 pb-3 pt-6">
      {left}
      <h1 className="flex-1 text-xl font-bold">{title}</h1>
      {right}
    </header>
  );
}

export function TabBar() {
  const tabs = [
    { to: "/", label: "Home", icon: Home },
    { to: "/saved", label: "Saved", icon: Bookmark },
    { to: "/settings", label: "Settings", icon: Settings },
  ] as const;
  return (
    <nav className="fixed bottom-0 left-1/2 z-30 flex w-full max-w-[430px] -translate-x-1/2 border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
      {tabs.map(({ to, label, icon: Icon }) => (
        <Link key={to} to={to} activeOptions={{ exact: to === "/" }}
          className="flex flex-1 flex-col items-center gap-1 py-2.5 text-xs text-muted-foreground"
          activeProps={{ className: "text-primary" }}>
          <Icon size={22} />{label}
        </Link>
      ))}
    </nav>
  );
}
