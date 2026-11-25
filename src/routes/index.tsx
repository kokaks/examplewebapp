import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, Utensils, Coffee, Pill, ShoppingBasket, ChevronRight, Clock } from "lucide-react";
import { CATEGORIES, DESTINATIONS, RECENT_IDS, bestSpots } from "@/lib/data";
import { EaseTag, Logo } from "@/components/parkaway";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "parkaway — Looking for parking in Yerevan?" },
      { name: "description", content: "Search a destination in Kentron and see the spots where you're most likely to park." },
      { property: "og:title", content: "parkaway — Looking for parking?" },
      { property: "og:description", content: "Search a destination in Kentron and see the spots where you're most likely to park." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const ICONS = { Food: Utensils, Coffee, Pharmacy: Pill, Groceries: ShoppingBasket };

function Home() {
  const recent = RECENT_IDS.map((id) => DESTINATIONS.find((d) => d.id === id)!).map((d) => ({ d, chance: bestSpots(d, "All", false)[0]?.chance ?? 0 }));
  return (
    <div className="px-5 pt-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2.5"><Logo size={36} /><span className="text-lg font-bold tracking-tight">parkaway</span></div>
        <span className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium">
          <span className="h-2 w-2 rounded-full bg-warning" />Traffic: moderate
        </span>
      </header>

      <h1 className="mt-8 text-3xl font-extrabold leading-tight tracking-tight">Looking for<br />parking?</h1>

      <Link to="/search" className="mt-5 flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-4 text-muted-foreground">
        <Search size={20} className="text-primary" />Where to?
      </Link>

      <div className="mt-5 grid grid-cols-4 gap-2.5">
        {CATEGORIES.map((c) => {
          const Icon = ICONS[c.label];
          return (
            <Link key={c.label} to="/search" search={{ q: c.query }} className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card py-3.5 text-xs font-medium">
              <Icon size={22} className="text-primary" />{c.label}
            </Link>
          );
        })}
      </div>

      <h2 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Recent places</h2>
      <ul className="overflow-hidden rounded-xl border border-border bg-card">
        {recent.map(({ d, chance }) => (
          <li key={d.id} className="border-b border-border last:border-0">
            <Link to="/results/$destId" params={{ destId: d.id }} className="flex items-center gap-3 px-4 py-3.5">
              <Clock size={18} className="text-muted-foreground" />
              <div className="flex-1"><div className="font-medium">{d.name}</div><div className="text-xs text-muted-foreground">{d.area}</div></div>
              <EaseTag chance={chance} /><ChevronRight size={18} className="text-muted-foreground" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
