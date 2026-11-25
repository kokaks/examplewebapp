import { useSyncExternalStore } from "react";

export interface AppState { saved: string[]; units: "km" | "miles"; preferFree: boolean; language: string; }
const KEY = "parkaway:v1";
const DEFAULT: AppState = { saved: [], units: "km", preferFree: false, language: "English" };
let state: AppState = DEFAULT;
let loaded = false;
const subs = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try { state = { ...DEFAULT, ...JSON.parse(localStorage.getItem(KEY) ?? "{}") }; } catch { /* ignore */ }
}

export function setState(patch: Partial<AppState>) {
  load();
  state = { ...state, ...patch };
  localStorage.setItem(KEY, JSON.stringify(state));
  subs.forEach((f) => f());
}

export function toggleSaved(id: string) {
  load();
  setState({ saved: state.saved.includes(id) ? state.saved.filter((x) => x !== id) : [...state.saved, id] });
}

export function useApp(): AppState {
  return useSyncExternalStore(
    (cb) => { subs.add(cb); return () => subs.delete(cb); },
    () => { load(); return state; },
    () => DEFAULT,
  );
}
