import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { setState, useApp } from "@/lib/store";
import { Logo, PageHeader } from "@/components/parkaway";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — parkaway" },
      { name: "description", content: "Units, free parking preference and language for parkaway." },
      { property: "og:title", content: "Settings — parkaway" },
      { property: "og:description", content: "Units, free parking preference and language for parkaway." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SettingsPage,
});

const LANGS = ["English", "Հայերեն", "Русский"];

function SettingsPage() {
  const { units, preferFree } = useApp();
  const [note, setNote] = useState<string | null>(null);
  return (
    <div>
      <PageHeader title="Settings" />
      <div className="space-y-5 px-5">
        <section className="space-y-4 rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">Units</span>
            <div className="flex rounded-full bg-secondary p-1">
              {(["km", "miles"] as const).map((u) => (
                <button key={u} onClick={() => setState({ units: u })} className={`rounded-full px-4 py-1.5 text-sm font-medium ${units === u ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>{u}</button>
              ))}
            </div>
          </div>
          <div className="h-px bg-border" />
          <button role="switch" aria-checked={preferFree} onClick={() => setState({ preferFree: !preferFree })} className="flex w-full items-center justify-between text-left">
            <span><span className="block font-medium">Prefer free parking</span><span className="text-xs text-muted-foreground">Show free spots first in results</span></span>
            <span className={`relative h-7 w-12 rounded-full transition ${preferFree ? "bg-primary" : "bg-secondary"}`}>
              <span className={`absolute top-1 h-5 w-5 rounded-full bg-foreground transition-all ${preferFree ? "left-6" : "left-1"}`} />
            </span>
          </button>
        </section>

        <section className="rounded-xl border border-border bg-card p-4">
          <h2 className="mb-3 font-medium">Language</h2>
          <div className="space-y-2">
            {LANGS.map((l) => (
              <button key={l} onClick={() => setNote(l === "English" ? null : `${l} is coming soon`)}
                className={`flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left ${l === "English" ? "border-primary" : "border-border"}`}>
                {l}<span className="text-xs text-muted-foreground">{l === "English" ? "Active" : "Coming soon"}</span>
              </button>
            ))}
          </div>
          {note && <p className="mt-3 text-sm text-warning">{note}</p>}
        </section>

        <section className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3"><Logo size={40} /><div><div className="font-bold">parkaway</div><div className="text-xs text-muted-foreground">Version 1.0</div></div></div>
          <p className="mt-3 text-sm text-muted-foreground">parkaway helps drivers in central Yerevan (Kentron) find the spot where they're most likely to park. Parking data shown is sample data.</p>
        </section>
      </div>
    </div>
  );
}
