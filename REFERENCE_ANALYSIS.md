# Referensanalys – useanycode.fun

Analyserad 2026-10-14.

## Uppdatering 2026-10-20

En skärmdump av originalets startsida visade den riktiga stilen: ljus off-white bakgrund, mörkgrön primärfärg,
hero-rubriken i tre rader till vänster, ett "Pick a starting point"-kort med 8 rutor till höger, och
Connect wallet + Launch an app i headern. AnyShip följer den strukturen men har nu en egen identitet
(mörk, blå, ritning → app) eftersom projektet ska se ut som ett eget.

## Hur referensen lästes

Ingen webbläsare kunde nås under bygget (datorn var inte ansluten), och sandlådans nätverk når inte sajten direkt.
Allt innehåll, alla routes och API-strukturen hämtades därför som renderad text. Det betyder:

- **Exakt matchat:** sidstruktur, rubriker, textinnehåll, knappar, länkar, formulärfält, steg, tabeller, API-endpoints, avgifter.
- **Rekonstruerat:** typsnitt, exakta färger, mått, ikoner och animationer. Det enda visuella som syntes i källan
  var `theme-color: #FFFFFF`, alltså en vit sajt. Stilen är byggd därefter.

**Nästa steg:** öppna originalet och klonen sida vid sida i Chrome och justera tokens i `src/styles/global.css`
(`:root`) samt mått i `pages.css`.

## Routes

`/`, `/build`, `/apps` (+ `#launches`), `/watch`, `/catalog`, `/docs` (+ ankare), `/token`, `/coin/<mint>`.

Upptäckta via länkar i innehållet och via manualen (`/docs`), som också beskriver `/coin/<mint>`.

## Layout

- Sticky header med logga, nav (Launch, Software, Apps, Docs, Token), X-ikon och CTA.
- Startsida: centrerad hero → prompt-ruta → CA-pill → startpunkter → 4 kort → 3 steg → senaste launches → svart CTA-block.
- `/build`: tvåkolumns layout, formulär i 4 numrerade steg till vänster och sticky blueprint + sammanfattning till höger.
- `/docs`: sidomeny i tre grupper (Start, Platform, Reference) + innehållskolumn.

## Designsystem (rekonstruerat)

- Typsnitt: Geist (rubriker 600, tight letter-spacing), Geist Mono för adresser, tider, filnamn.
- Färger: vit bakgrund, `#0b0b0c` text och primärknappar, grå skala för text och linjer, grön/blå/gul/röd för status.
- Radier: 8–12 px på kontroller, 16 px på kort, 20–24 px på stora block.
- Container: 1120 px innehåll, 24 px gutter (16 px på mobil).

## Breakpoints

980 px (kortgrid 4→2), 860 px (hamburgermeny, steg 3→1), 760 px (tabell → kompakta rader, statistik 3→2),
640 px (mobil typografi), 560 px (1 kolumn).

## Komponenter

Header, mobilmeny, Footer, CopyCA, AppIcon (monogram), StatusBadge, LaunchesTable, ProgressHead, StageStepper,
StageList, LogPanel, CodePanel, Modal, LaunchModal, PreviewModal, Reveal.

## Animationer

Hero-element glider in i tur och ordning, sektioner tonar in vid scroll, statusprickar pulserar,
build-loggen och koden strömmar in, blueprint-rader animeras in. Allt stängs av vid `prefers-reduced-motion`.

## Funktioner

- Prompt på startsidan → `/build?idea=…`. Startpunkter → `/build?app=…`. Katalog → `/build?from=…`.
- Originalitetskontroll: namnet får inte innehålla produkten som inspirerat.
- Ticker föreslås från namnet. Ikon-uppladdning med dra-och-släpp, beskärs till 256×256.
- Launch-modal i fyra steg (demo). Coin-sidan följer builden live, med Finish setup och Retry.
- Watch-sidan spelar upp en build i tre hastigheter med kod som skrivs och logg.
- Katalogen har sök, plattformsfilter, tre sorteringar och paginering.

## Externa integrationer

- pump.fun (launch + fee sharing) – mockat.
- OpenRouter (kodmodell) – inte i frontend.
- Phantom / Solflare – endast publik adress.
- DexScreener – riktig read-only data på `/token`.
- Solscan – länkar.
