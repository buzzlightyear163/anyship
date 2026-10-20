# AnyShip – art direction

**Idé:** din beskrivning blir en färdig app. En app-ikon som är halvt ritning (streckad) och halvt färdig (solid), med en blå bygglinje emellan.

**Material:** kodsymbol + ritningsrutnät. Allt ritat i kod (SVG/HTML), ingen AI-text i bilderna.

**Värld:** bläcksvart `#07080B`, vitt `#F4F5F7`, en accent i elektrisk blå `#3E64FF` (text-variant `#5F7FFF`/`#6A86FF`). Grön `#33D17A` bara för "Live".

**Typografi:** Geist 600 med tight spärrning för rubriker, Instrument Serif Italic i blått för accentordet ("Ship it."), Geist Mono för etiketter och metarader.

**Tagline:** Describe it. Ship it.

## Filer

| Fil | Storlek | Användning |
|---|---|---|
| `anyship_avatar.png` | 2000×2000 | pump.fun-bild + X-profilbild |
| `anyship_banner.png` | 3000×1000 | X-header ("Describe it. [märket] Ship it.") |
| `anyship_post.png` | 3200×1800 | Launch-post: app-fönster som är halvt ritning, halvt färdigt |
| `anyship_review.jpg` | | X-mockup med skyddszoner och avatar i 96/48/32/24 px |
| `anyship_prelaunch_reveal.png` | 3200×1800 | Pre-launch reveal: "Any app. Your version." med en vägg av app-fönster som byggs |
| `anyship_prelaunch_call.png` | 3200×1800 | Sista call: "One stage left.", nästan färdig 3D-ikon, stegen med LAUNCH kvar, CA-varning |
| `anyship-mark.svg` | | Märket (vit + blå, `currentColor`) |
| `source/*.html` | | Källorna. Ändra text och rendera om med 2× skala (pre-launch-bilderna använder `bw.css`, `windows.js` och `bwrender.js` i samma mapp) |

## Kompositioner

- **Banner:** split-rubrik runt märket. Måttlinje "~20 MIN" ovanför, SPEC/FILE under, `$SHIP · LIVE · SOLANA` nere till höger (utanför profilbildens cirkel).
- **Post:** produkten som bevis. Rubrik "Describe any app. Ship it." till vänster, ett chatt-app-fönster till höger där den blå linjen bygger det från ritning till färdig app.
- **Avatar:** bara märket på bläcksvart med svag blå glöd.

## Märket

`viewBox="16 2 168 196"`: streckad vänsterhalva (`stroke-width 16`, `dasharray 24 13.18`), blå stapel `x 93–107`, solid högerhalva med radie 44. Testat läsbart ner till 24 px.
