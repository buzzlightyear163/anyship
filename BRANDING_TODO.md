# Branding att fylla i

Allt nedan är platshållare. Resten av sajten fungerar redan.

## Måste fyllas i före launch

- [x] **Contract address** för `$SHIP` → `ca` i `src/lib/brand.ts` (satt). Visas i CA-pillen, på `/token` och i manualen.
      När den är satt hämtar `/token` live-priser automatiskt.
- [ ] **Treasury-plånbok** → `treasury` i `src/lib/brand.ts`. Visas i manualen under *Launches and fees*.
- [ ] **X-konto** → `xUrl` och `xHandle` (nu `@UseAnyShip`).
- [ ] **Domän** → `site` och meta-taggarna i `index.html`.

## Klart

- [x] Märke, profilbild, X-banner och launch-post i `brand/` (se `brand/art-direction.md`).
- [x] Delningsbild `public/assets/og.png` och favicon.

## Bra att byta

- [ ] `og:image` i `index.html` pekar på `/assets/og.png`. Byt till full URL när domänen är klar, så att X hittar bilden.
- [ ] Namn på exempel-builds i `public/api/builds.json` (Hearth, Lumen, Reelcut …) om du vill ha andra.
- [ ] Avgifter: `launchFeeSol` och `creatorShare` i `src/lib/brand.ts` om du vill ändra från 0.025 SOL och 50/50.

## Backend (inte branding, men behövs för riktiga launches)

Se tabellen under *API och mockdata* i `README.md`. Sök efter `TODO(backend)` i koden.
