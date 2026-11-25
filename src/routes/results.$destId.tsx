import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { DESTINATIONS, bestSpots, type Filter } from "@/lib/data";
import { useApp } from "@/lib/store";
import { MapView } from "@/components/MapView";
import { SpotCard } from "@/components/parkaway";

export const Route = createFileRoute("/results/$destId")({
  loader: ({ params }) => {
    const dest = DESTINATIONS.find((d) => d.id === params.destId);
    if (!dest) throw notFound();
    return { dest };
  },
  head: ({ loaderData }) => {
    const n = loaderData?.dest.name ?? "Destination";
    return {
      meta: [
        { title: `Parking near ${n} — parkaway` },
        { name: "description", content: `The best parking spots near ${n}, ranked by your chance of finding a space.` },
        { property: "og:title", content: `Parking near ${n} — parkaway` },
        { property: "og:description", content: `The best parking spots near ${n}, ranked by chance of parking.` },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  component: Results,
});

const FILTERS: Filter[] = ["All", "Free", "Lots", "Paid"];

function Results() {
  const { dest } = Route.useLoaderData();
  const { preferFree } = useApp();
  const [filter, setFilter] = useState<Filter>("All");
  const spots = bestSpots(dest, filter, preferFree);
  return (
    <div>
      <div className="relative h-72">
        <MapView dest={dest} spots={spots} />
        <Link to="/search" aria-label="Back" className="absolute left-4 top-5 grid h-11 w-11 place-items-center rounded-xl border border-border bg-card/90 backdrop-blur"><ArrowLeft size={20} /></Link>
      </div>
      <section className="animate-sheet relative -mt-8 rounded-t-[28px] border-t border-border bg-background px-5 pt-3">
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-border" />
        <p className="text-xs uppercase tracking-wide text-muted-foreground">Parking near</p>
        <h1 className="text-2xl font-bold">{dest.name}</h1>
        <div className="mt-4 flex gap-2">
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium ${filter === f ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"}`}>{f}</button>
          ))}
        </div>
        {preferFree && filter === "All" && <p className="mt-3 text-xs text-muted-foreground">Showing free parking first (Settings).</p>}
        <div className="mt-4 space-y-3 pb-4">
          {spots.map((s, i) => <SpotCard key={s.id} spot={s} index={i} best={i === 0} destId={dest.id} />)}
          {spots.length === 0 && <p className="py-8 text-center text-muted-foreground">No {filter.toLowerCase()} parking near here.</p>}
        </div>
      </section>
    </div>
  );
}
