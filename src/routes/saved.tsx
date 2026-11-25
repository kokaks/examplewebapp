import { createFileRoute, Link } from "@tanstack/react-router";
import { Bookmark, Trash2 } from "lucide-react";
import { SPOTS, formatPrice } from "@/lib/data";
import { toggleSaved, useApp } from "@/lib/store";
import { EaseTag, PageHeader, TypeTag } from "@/components/parkaway";

export const Route = createFileRoute("/saved")({
  head: () => ({
    meta: [
      { title: "Saved spots — parkaway" },
      { name: "description", content: "Your saved parking spots in Yerevan." },
      { property: "og:title", content: "Saved spots — parkaway" },
      { property: "og:description", content: "Your saved parking spots in Yerevan." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Saved,
});

function Saved() {
  const { saved } = useApp();
  const spots = saved.map((id) => SPOTS.find((s) => s.id === id)).filter((s) => s !== undefined);
  return (
    <div>
      <PageHeader title="Saved spots" />
      <div className="space-y-3 px-5">
        {spots.length === 0 && (
          <div className="flex flex-col items-center rounded-xl border border-dashed border-border px-6 py-12 text-center">
            <Bookmark size={32} className="text-muted-foreground" />
            <p className="mt-3 font-medium">No saved spots yet</p>
            <p className="mt-1 text-sm text-muted-foreground">Tap "Save spot" on any parking spot to keep it here.</p>
            <Link to="/search" className="mt-5 rounded-xl bg-primary px-5 py-2.5 font-semibold text-primary-foreground">Find parking</Link>
          </div>
        )}
        {spots.map((s) => (
          <div key={s.id} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
            <Link to="/spot/$spotId" params={{ spotId: s.id }} className="min-w-0 flex-1">
              <div className="truncate font-semibold">{s.name}</div>
              <div className="mt-1.5 flex flex-wrap items-center gap-2"><TypeTag type={s.type} /><span className="text-sm">{formatPrice(s.price)}</span><EaseTag chance={s.chance} /></div>
            </Link>
            <button onClick={() => toggleSaved(s.id)} aria-label={`Remove ${s.name}`} className="grid h-10 w-10 place-items-center rounded-lg border border-border text-danger"><Trash2 size={18} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
