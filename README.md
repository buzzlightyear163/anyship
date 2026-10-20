# AnyShip

Egen version av **https://www.useanycode.fun/** byggd i Vite + React + TypeScript (strict).
Rebrandad från **AnyCode** till **AnyShip** (ticker `$SHIP`, X `@UseAnyShip`) med egen identitet:
mörk bläcksvart bas med ritningsrutnät, elektrisk blå accent och märket som är halvt ritning, halvt färdig app.
Tagline: **Describe it. Ship it.**

## Starta

**Windows:** dubbelklicka på `start.bat`. Den installerar dependencies första gången och öppnar sajten på http://localhost:5173.

**Manuellt:**

```bash
npm install
npm run dev        # utvecklingsserver
npm run build      # typecheck + produktionsbygge till dist/
npm run preview    # kör dist/ lokalt
```

Kräver Node.js 18 eller senare.

## Routes

| Route | Innehåll |
|---|---|
| `/` | Hero med prompt och ett levande byggfönster (ritning → app) ovanför startpunkterna, löpande launch-rad, "What you walk away with", låst 3D-scrollsekvens för de tre stegen, senaste launches, CTA |
| `/build` | Launch-sidan: 4 steg (app, funktioner, namn och ikon, format), ritning som fylls i medan du fyller i formuläret, sammanfattning, launch-modal |
| `/apps` | Statistik, flikarna *Ready to use* och *Live launches* (`/apps#launches`), preview-modal, tre CTA-kort |
| `/watch` | Uppspelning av en build (20×, 60×, realtid) med app-fönstret som byggs, steg, kod som skrivs, logg och färdig fil |
| `/catalog` | 123 betalprogram med sök, plattformsfilter, sortering och "Show more" |
| `/docs` | Manualen med sidomeny och scrollspy: overview, quickstart, specs, fees, policy, outputs, apps, API, token, FAQ |
| `/token` | Tokenens CA, svävande token-mynt, köplänkar, marknadsdata från DexScreener och holder-förmåner |
| `/coin/:mint` | Dynamisk coin-sida: app-fönstret som byggs live, build-status, logg, fee split, fil med preview/nedladdning |
| `*` | 404 |

## Projektstruktur

```
src/
  components/   Header (med Connect wallet), Footer, Logo, Mark, CopyCA, AppIcon, KindIcon, StatusBadge,
                LaunchesTable, LaunchTicker, BuildWindow (ritning → app), StartCard, StepsScroll (3D-scroll),
                BuildPanels (progress, steg, logg, kod), LaunchModal, PreviewModal, Modal, Reveal
  layouts/      SiteLayout (header + footer + scroll/hash-hantering)
  pages/        Home, Build, Apps, Watch, Catalog, Docs, Token, Coin, NotFound
  hooks/        useBuilds, useNow, useReplay, useReveal, useCopy, useTitle
  lib/          brand.ts (allt varumärke), api.ts, buildEngine.ts, storage.ts, wallet.ts, walletContext.tsx, format.ts, types.ts
  data/         apps.ts (startpunkter), features.ts (funktionslistor), catalog.ts (programkatalogen), windows.ts (app-wireframes)
  styles/       global.css (tokens, knappar, header, footer, modal), pages.css (sidorna), home.css (startsidan + byggfönstret)
brand/          profilbild, X-banner, launch-post, X-mockup, märket som SVG, art-direction.md och HTML-källorna
public/
  assets/       logo.svg (favicon), og.png (delningsbild)
  api/          builds.json (mockdata)
  apps/         reelcut.html, inkwell.html, quill.html (riktiga, fungerande exempelappar)
```

## Dependencies

`react`, `react-dom`, `react-router-dom`, `lucide-react` (ikoner). Inget annat.
Typsnitt: Geist, Geist Mono och Instrument Serif från Google Fonts.

## Responsivt

Kontrollerat på 390, 768 och 1280 px utan horisontell scroll. Under 860 px blir navigationen en hamburgermeny,
launch-sidans sidopanel hamnar under formuläret, launches-tabellen blir kompakta rader, docs-menyn blir en
horisontell flik-rad och tabeller scrollar i sin ram.

## API och mockdata

- `public/api/builds.json` innehåller statistik och 14 launches. Tider räknas relativt till när sidan laddas, så
  builds som pågår rör sig framåt i realtid.
- Byggpipelinen (plan → write → review → test → package, 20 min) simuleras i `src/lib/buildEngine.ts`.
- Coins du "launchar" i demon sparas i webbläsaren (localStorage) och byggs i 30× fart så att de blir klara på ~40 s.
- Färdiga builds utan riktig fil får en genererad platshållarfil vid preview och nedladdning.
- `/token` hämtar riktig marknadsdata från DexScreener (publikt, read-only) så fort en riktig CA är satt.

Alla ställen som ska kopplas mot en riktig backend är märkta `TODO(backend)`:

| Fil | Ska kopplas mot |
|---|---|
| `src/lib/api.ts` | `GET /api/builds`, `GET /api/coin?mint=`, `GET /api/advance?ca=` |
| `src/components/LaunchModal.tsx` | `POST /api/token` (prepare/confirm), `POST /api/feeshare` (build/confirm) |
| `src/pages/Coin.tsx` | Finish setup / Retry: `POST /api/feeshare` + `POST /api/generate` |
| `src/lib/api.ts` → `stubFile` | `GET /api/build?ca=<mint>&dl=1` |

## Plånbok (Web3)

Connect wallet i headern och launch-modalen delar samma plånboksstatus. De hittar Phantom eller Solflare om de är
installerade och hämtar **bara den publika adressen**. Annars används en demo-plånbok. Inga transaktioner signeras eller skickas, och inga nycklar finns i koden.
Kedja: Solana. Länkar till pump.fun, DexScreener och Solscan byggs från mint-adressen.

## Ersatt jämfört med originalet

- Namnet AnyCode → AnyShip överallt, ny tagline, nytt märke (`src/components/Mark.tsx`, `public/assets/logo.svg`).
- Ny visuell identitet: mörkt i stället för originalets ljusa off-white och gröna, blå accent, ritningsrutnät.
- Layouten följer originalets struktur (hero till vänster, startpunktskort till höger, Connect wallet i headern)
  men med egna signaturdelar: byggfönstret, launch-raden, 3D-scrollsekvensen och token-myntet.
- Originalets contract address och treasury-adress är **inte** med. De är platshållare i `src/lib/brand.ts`.
- Andra företags logotyper används inte; startpunkter visas med egna ikoner och appar med monogram.
- Demo-appen på `/watch` heter Reelcut och är en riktig, fungerande videoklippare i `public/apps/reelcut.html`.
- Brödtexter är omskrivna med samma längd och innebörd.

## Rebranda

1. Öppna `src/lib/brand.ts` och ändra `name`, `ticker`, `tagline`, `site`, `xUrl`, `xHandle`, `ca`, `treasury`.
2. Färgerna ligger som tokens överst i `src/styles/global.css` (`--blue`, `--bg` osv.).
3. Märket: `src/components/Mark.tsx`, `public/assets/logo.svg` och `brand/anyship-mark.svg`.
4. Uppdatera `<title>` och meta-taggarna i `index.html`.
5. Se `BRANDING_TODO.md` för resten.

## Deploy

`vercel.json` skickar alla sidvägar till `index.html` så att direktlänkar som `/coin/<mint>` fungerar på Vercel.
