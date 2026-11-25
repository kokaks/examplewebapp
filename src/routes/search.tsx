import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, MapPin, Search, X } from "lucide-react";
import { useState } from "react";
import { searchDestinations } from "@/lib/data";

export const Route = createFileRoute("/search")({
  validateSearch: (s: Record<string, unknown>): { q?: string } => (typeof s["q"] === "string" ? { q: s["q"] } : {}),
  head: () => ({
    meta: [
      { title: "Search destinations — parkaway" },
      { name: "description", content: "Find a destination in central Yerevan to see nearby parking." },
      { property: "og:title", content: "Search destinations — parkaway" },
      { property: "og:description", content: "Find a destination in central Yerevan to see nearby parking." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const [query, setQuery] = useState(q ?? "");
  const navigate = useNavigate();
  const results = searchDestinations(query);
  return (
    <div className="px-5 pt-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate({ to: "/" })} aria-label="Back" className="grid h-11 w-11 place-items-center rounded-xl border border-border bg-card"><ArrowLeft size={20} /></button>
        <label className="flex flex-1 items-center gap-2 rounded-xl border border-primary bg-card px-3.5 py-3">
          <Search size={18} className="text-primary" />
          <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Where to?" className="w-full bg-transparent text-base outline-none placeholder:text-muted-foreground" />
          {query && <button onClick={() => setQuery("")} aria-label="Clear"><X size={18} className="text-muted-foreground" /></button>}
        </label>
      </div>
      <ul className="mt-5 space-y-2">
        {results.map((d) => (
          <li key={d.id}>
            <Link to="/results/$destId" params={{ destId: d.id }} className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3.5">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-secondary"><MapPin size={18} className="text-primary" /></span>
              <div><div className="font-medium">{d.name}</div><div className="text-xs text-muted-foreground">{d.area}, Yerevan</div></div>
            </Link>
          </li>
        ))}
        {results.length === 0 && <p className="py-10 text-center text-muted-foreground">No places match "{query}"</p>}
      </ul>
    </div>
  );
}
