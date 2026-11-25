export type SpotType = "Lot" | "Paid street" | "Free street";
export interface Spot { id: string; name: string; type: SpotType; lat: number; lng: number; price: number | "Free"; chance: number; }
export interface Destination { id: string; name: string; area: string; lat: number; lng: number; }
export interface NearbySpot extends Spot { distance: number; walk: number; }

export const SPOTS: Spot[] = [
  { id: "northern-lot", name: "Northern Ave Underground", type: "Lot", lat: 40.1815, lng: 44.514, price: 600, chance: 85 },
  { id: "abovyan", name: "Abovyan St", type: "Paid street", lat: 40.183, lng: 44.518, price: 300, chance: 45 },
  { id: "mashtots", name: "Mashtots Ave", type: "Paid street", lat: 40.184, lng: 44.508, price: 300, chance: 55 },
  { id: "tamanyan", name: "Tamanyan St", type: "Free street", lat: 40.19, lng: 44.516, price: "Free", chance: 30 },
  { id: "cascade-lot", name: "Cascade Parking", type: "Lot", lat: 40.1925, lng: 44.514, price: 500, chance: 70 },
  { id: "moskovyan", name: "Moskovyan St", type: "Free street", lat: 40.1875, lng: 44.5175, price: "Free", chance: 25 },
  { id: "republic-lot", name: "Republic Square Lot", type: "Lot", lat: 40.1772, lng: 44.5135, price: 700, chance: 75 },
  { id: "amiryan", name: "Amiryan St", type: "Paid street", lat: 40.179, lng: 44.5085, price: 300, chance: 60 },
  { id: "khanjyan", name: "Khanjyan St", type: "Free street", lat: 40.1745, lng: 44.52, price: "Free", chance: 40 },
  { id: "saryan", name: "Saryan St", type: "Paid street", lat: 40.1885, lng: 44.506, price: 300, chance: 50 },
  { id: "matenadaran-lot", name: "Matenadaran Lot", type: "Lot", lat: 40.1915, lng: 44.52, price: 400, chance: 65 },
  { id: "mall-lot", name: "Yerevan Mall Parking", type: "Lot", lat: 40.1595, lng: 44.494, price: "Free", chance: 90 },
];

export const DESTINATIONS: Destination[] = [
  { id: "republic-square", name: "Republic Square", area: "Kentron", lat: 40.1777, lng: 44.5126 },
  { id: "cascade", name: "Cascade", area: "Kentron", lat: 40.1913, lng: 44.5152 },
  { id: "opera-house", name: "Opera House", area: "Kentron", lat: 40.186, lng: 44.515 },
  { id: "vernissage", name: "Vernissage", area: "Kentron", lat: 40.1768, lng: 44.517 },
  { id: "northern-avenue", name: "Northern Avenue", area: "Kentron", lat: 40.182, lng: 44.5148 },
  { id: "blue-mosque", name: "Blue Mosque", area: "Kentron", lat: 40.1782, lng: 44.506 },
  { id: "matenadaran", name: "Matenadaran", area: "Kentron", lat: 40.1922, lng: 44.521 },
  { id: "tumanyan-st", name: "Tumanyan St", area: "Kentron", lat: 40.185, lng: 44.513 },
  { id: "saryan-st", name: "Saryan St", area: "Kentron", lat: 40.188, lng: 44.507 },
  { id: "yerevan-mall", name: "Yerevan Mall", area: "Shengavit", lat: 40.159, lng: 44.493 },
];

export const CATEGORIES = [
  { label: "Food", query: "Northern" },
  { label: "Coffee", query: "Saryan" },
  { label: "Pharmacy", query: "Tumanyan" },
  { label: "Groceries", query: "Mall" },
] as const;

export const RECENT_IDS = ["cascade", "republic-square", "opera-house", "yerevan-mall"];

function meters(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371000, r = Math.PI / 180;
  const dLat = (b.lat - a.lat) * r, dLng = (b.lng - a.lng) * r;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLng / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(h)));
}

export function searchDestinations(q: string) {
  const t = q.trim().toLowerCase();
  if (!t) return DESTINATIONS;
  return DESTINATIONS.filter((d) => d.name.toLowerCase().includes(t));
}

export type Filter = "All" | "Free" | "Lots" | "Paid";

/** Nearby spots for a destination (closest 6), with distance/walk. */
export function nearbySpots(dest: Destination): NearbySpot[] {
  return SPOTS.map((s) => {
    const distance = meters(dest, s);
    return { ...s, distance, walk: Math.max(1, Math.round(distance / 80)) };
  }).sort((a, b) => a.distance - b.distance).slice(0, 6);
}

export function bestSpots(dest: Destination, filter: Filter, preferFree: boolean): NearbySpot[] {
  let list = nearbySpots(dest);
  if (filter === "Free") list = list.filter((s) => s.price === "Free");
  if (filter === "Lots") list = list.filter((s) => s.type === "Lot");
  if (filter === "Paid") list = list.filter((s) => s.price !== "Free");
  if (preferFree && filter === "All") {
    const free = list.filter((s) => s.price === "Free");
    if (free.length) list = free;
  }
  return [...list].sort((a, b) => b.chance - a.chance).slice(0, 3);
}

export function spotFor(id: string, destId?: string): NearbySpot | undefined {
  const s = SPOTS.find((x) => x.id === id);
  if (!s) return undefined;
  const d = DESTINATIONS.find((x) => x.id === destId) ?? DESTINATIONS[0]!;
  const distance = meters(d, s);
  return { ...s, distance, walk: Math.max(1, Math.round(distance / 80)) };
}

export function ease(chance: number): "Easy" | "Busy" | "Hard" {
  return chance >= 70 ? "Easy" : chance >= 45 ? "Busy" : "Hard";
}

export function formatPrice(p: number | "Free") {
  return p === "Free" ? "Free" : `${p} AMD/h`;
}

export function formatDistance(m: number, units: "km" | "miles") {
  if (units === "miles") {
    const mi = m / 1609.34;
    return mi < 0.1 ? `${Math.round(m * 3.281)} ft` : `${mi.toFixed(1)} mi`;
  }
  return m < 1000 ? `${m} m` : `${(m / 1000).toFixed(1)} km`;
}

export function navLinks(lat: number, lng: number) {
  return [
    { name: "Google Maps", href: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}` },
    { name: "Apple Maps", href: `https://maps.apple.com/?daddr=${lat},${lng}` },
    { name: "Yandex Maps", href: `https://yandex.com/maps/?rtext=~${lat},${lng}&rtt=auto` },
    { name: "Yandex Navigator", href: `yandexnavi://build_route_on_map?lat_to=${lat}&lon_to=${lng}` },
    { name: "Waze", href: `https://waze.com/ul?ll=${lat},${lng}&navigate=yes` },
  ];
}
