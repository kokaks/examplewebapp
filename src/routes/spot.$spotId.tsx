import { createFileRoute, notFound, useRouter } from "@tanstack/react-router";
import { ArrowLeft, Bookmark, BookmarkCheck, Navigation, X, ExternalLink } from "lucide-react";
import { useState } from "react";
import { DESTINATIONS, formatPrice, navLinks, spotFor } from "@/lib/data";
import { toggleSaved, useApp } from "@/lib/store";
import { ChanceBar, EaseTag, SpotMeta, TypeTag } from "@/components/parkaway";

export const Route = createFileRoute("/spot/$spotId")({
  validateSearch: (s: Record<string, unknown>): { dest?: string } => (typeof s["dest"] === "string" ? { dest: s["dest"] } : {}),
  loaderDeps: ({ search }) => ({ dest: search.dest }),
  loader: ({ params, deps }) => {
    const spot = spotFor(params.spotId, deps.dest);
    if (!spot) throw notFound();
    const dest = DESTINATIONS.find((d) => d.id === deps.dest) ?? DESTINATIONS[0]!;
    return { spot, dest };
  },
  head: ({ loaderData }) => {
    const n = loaderData?.spot.name ?? "Parking spot";
    return {
      meta: [
        { title: `${n} — parkaway` },
        { name: "description", content: `Price, chance of parking and walking time for ${n} in Yerevan.` },
        { property: "og:title", content: `${n} — parkaway` },
        { property: "og:description", content: `Price, chance of parking and walking time for ${n}.` },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  component: SpotPage,
});

function SpotPage() {
  const { spot, dest } = Route.useLoaderData();
  const { saved } = useApp();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const isSaved = saved.includes(spot.id);
  return (
    <div className="px-5 pt-6">
      <button onClick={() => router.history.back()} aria-label="Back" className="grid h-11 w-11 place-items-center rounded-xl border border-border bg-card"><ArrowLeft size={20} /></button>

      <div className="mt-5 space-y-5 rounded-2xl border border-border bg-card p-5">
        <div>
          <div className="flex items-center gap-2"><TypeTag type={spot.type} /><EaseTag chance={spot.chance} /></div>
          <h1 className="mt-3 text-2xl font-bold">{spot.name}</h1>
          <p className="text-sm text-muted-foreground">Near {dest.name}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-secondary p-3"><div className="text-xs text-muted-foreground">Price</div><div className="mt-1 text-lg font-bold">{formatPrice(spot.price)}</div></div>
          <div className="rounded-lg bg-secondary p-3"><div className="text-xs text-muted-foreground">Walk</div><div className="mt-1 text-lg font-bold">{spot.walk} min</div></div>
        </div>
        <ChanceBar chance={spot.chance} />
        <SpotMeta spot={spot} />
        <p className="text-xs text-muted-foreground">{spot.lat.toFixed(4)}, {spot.lng.toFixed(4)}</p>
      </div>

      <div className="mt-5 space-y-3">
        <button onClick={() => toggleSaved(spot.id)} className={`flex w-full items-center justify-center gap-2 rounded-xl border py-3.5 font-semibold ${isSaved ? "border-primary text-primary" : "border-border bg-card"}`}>
          {isSaved ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}{isSaved ? "Saved" : "Save spot"}
        </button>
        <button onClick={() => setOpen(true)} className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 text-lg font-bold text-primary-foreground active:scale-[0.99]">
          <Navigation size={22} />Let's go
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-ink/70" onClick={() => setOpen(false)}>
          <div className="animate-sheet w-full max-w-[430px] rounded-t-[28px] border-t border-border bg-card px-5 pb-8 pt-3" onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-border" />
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">Open with</h2>
              <button onClick={() => setOpen(false)} aria-label="Close"><X size={22} className="text-muted-foreground" /></button>
            </div>
            <ul className="space-y-2">
              {navLinks(spot.lat, spot.lng).map((l) => (
                <li key={l.name}>
                  <a href={l.href} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3.5 font-medium">
                    {l.name}<ExternalLink size={18} className="text-muted-foreground" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
