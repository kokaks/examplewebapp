# Examplewebapp

Build "parkaway", a mobile-first web app (React + Tailwind) that helps drivers in central Yerevan (Kentron) find parking. No backend: use local mock data and localStorage. It should feel like a real, simple app.

DATA: a mock list of 12 parking spots in Kentron (name, type: Lot / Paid street / Free street, lat/lng, price per hour in AMD or "Free", chance of finding parking 0-100, distance in meters from a destination, walking minutes), and 10 destinations (Republic Square, Cascade, Opera House, Vernissage, Northern Avenue, Blue Mosque, Matenadaran, Tumanyan St, Saryan St, Yerevan Mall). Each destination has its own nearby spots.

SCREENS
1) Start: header with the parkaway icon (cream rounded square, four black arrows pointing inward) and a "Traffic: moderate" pill; title "Looking for parking?"; a "Where to?" search bar; category tiles (Food, Coffee, Pharmacy, Groceries) that search for a destination; "Recent places" list with Easy (green) / Busy (amber) / Hard (red) tags.
2) Search: typing shows matching destinations (case-insensitive, partial match); tapping one opens Results.
3) Results: a static stylized dark map image at the top with numbered pins, and a bottom sheet with the 3 best spots for that destination (sorted by chance of parking, the first labelled "Best match"). Each card: name, type tag, price, a "Chance of finding parking" bar with %, distance and walking time. A filter row: All / Free / Lots / Paid.
4) Spot detail: bigger card with all info, a "Save spot" button and a big "Let's go" button.
5) "Let's go" sheet: choose Google Maps, Apple Maps, Yandex Maps, Yandex Navigator or Waze (open the real app links to the spot's coordinates).
6) Saved: list of saved spots (localStorage) with remove buttons.
7) Settings: units (km / miles), "Prefer free parking" toggle that filters results, language selector (English only works; others say "coming soon"), About.
Bottom tab bar: Home, Saved, Settings.

STYLE: dark basalt #14151a background, cards #1b1d24, borders #3a3d4a, text #eef0f4, secondary #9498a6, accent apricot #f5a536, green #34c77b, amber #f0b43c, red #e2574c. Inter font, 20px rounded cards. Works perfectly at 360-430px wide; on desktop show it centered in a phone-width column.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://examplewebapp.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/98b91ad2-d2b0-48f4-8e72-babb0c5db357).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
