# To-Do

Deze to-do lijst is gegenereerd door Mistral Medium 3.5.

## 1. Kapotte / foutgevoelige functionaliteit

- [ ] **`pb.admins` bestaat niet meer (alles breekt zodra de token verloopt):** Alle admin-pagina's gebruiken `pb.admins.authWithPassword(...)` — deprecated/verwijderd in SDK 0.25+ en vervangen door de `_superusers`-collectie (het import-script en `/result` gebruiken die al wél correct). Zodra de in-memory token van de module-level `pb` verloopt (of na een restart), crasht elke load. Vervang overal door `_superusers` — of beter: verhuis naar één centrale auth-helper.
- [ ] **Module-level PocketBase-instantie (race conditions):** Alle `+page.server.js`-bestanden delen één module-globale `pb`-instantie met één authStore. Bij gelijktijdige requests delen ze elkaars token-state; bij een mislukte auth loopt alles vast tot de server herstart. Maak per request een instantie (of gebruik `event.locals`), zoals je in andere apps met `hooks.server.js` doet.
- [ ] **`/result` crasht zonder bestuur of personen:** `bestuur = besturen[0]` kan `undefined` zijn en `JSON.parse(bestuur?.leden_json)` op `undefined` gooit een SyntaxError → kale 500 i.p.v. een lege gids. Ditzelfde geldt voor de admin-pagina's zodra er nog géén config/bestuur bestaat. Valideer netjes en toon een lege state.
- [ ] **Bestuursleden als vrije tekst i.p.v. koppeling:** Bestuursleden worden als `{rol, naam}` in `leden_json` getypt via een datalist — een typefout ("Klaas Smidt") zorgt ervoor dat het lid niet meer aan een persoon gekoppeld is. Sla `personen`-ID's op (met naam als weergave) zodat de koppeling stabiel blijft.
- [ ] **Dode link `/gids`:** De admin-home linkt "Gids genereren" naar `/gids`, maar de route heet `/result` — 404. Fix de link.
- [ ] **Personen zonder delete-confirm op serverfout:** Bij `delete` in personen wordt bij een PB-fout `{ success: false }` geretourneerd, maar de client verwijdert de persoon al optimistisch uit de tabel (`data.personen.filter(...)`) vóórdat het resultaat binnen is — een mislukte delete laat de rij verdwijnen maar in de DB staan blijven. Volg het resultaat pas na success.

## 2. Data & schema

- [ ] **Geen enkele input-validatie:** Alle `save`-actions sturen `formData` ongefilterd naar PB. Velden die géén form-input zijn (zoals `status` bij personen) kunnen via een gemanipuleerde POST elke willekeurige waarde krijgen. Valideer minimaal naam (verplicht), status (whitelist), geboortedatum (formaat DD-MM-YYYY), email, en lengtes.
- [ ] **Geboortedatum is tekst:** `geboortedatum` staat als los tekstveld in het schema; de verjaardagen-pagina doet zelf `parseInt(str.split('-')[0])`. Eén verkeerd formaat (`2024-05-01` i.p.v. `01-05-2024`) en de persoon staat in de verkeerde maand, stil. Maak het een date-veld óf valideer het formaat hard (server én client, `type="date"`).
- [ ] **Typo's in schemavelden:** `adres_thuisthuis` (i.p.v. `thuishuis`) en in `json_to_pb.js` `process.env.publicEnv.PUBLIC_POCKETBASE_URL` (i.p.v. `process.env.PUBLIC_POCKETBASE_URL`) — het import-script crasht dus meteen bij het opstarten. Fix het script; hernoem het DB-veld alleen als je ook de import/gids-data meeneemt.
- [ ] **`jaar`-veld bestuur wordt nergens gebruikt:** In het admin-formulier ontbreekt het `jaar`-veld terwijl het schema het kent (alleen het import-script vult het). Voeg het toe aan het formulier of gebruik `config.jaren` consequent.
- [ ] **Geen unieke indexen:** `studies.code` en `personen.naam` kunnen duplicaten bevatten (dubbele import = alles dubbel). Voeg een unieke index op `studies.code` toe en overweeg die op `personen.naam`.
- [ ] **Import-script niet idempotent:** `json_to_pb.js` maakt bij elke run alles opnieuw aan — een tweede run verdubbelt de hele database. Laat het script bestaande records upserten of eerst legen (met bevestiging).

## 3. Gids-generatie (resultaatpagina)

- [ ] **Verjaardagen sorteren alleen op dag:** `verjaardagen[m].sort((a, b) => a.dag - b.dag)` — prima per maand, maar personen zonder geldige datum vallen stil weg; toon een waarschuwing in de admin als iemand een ongeldig formaat heeft.
- [ ] **Reünisten-splitsing onverklaarbaar voor de gebruiker:** Reünisten mét foto komen in het fotogrid, zónder foto in een tekstlijst achteraan — dat is nu impliciet gedrag. Beschrijf het in de admin-UI (bijv. een hint bij de reünist-status) zodat de gids-maker snapt welke lijst waar terechtkomt.
- [ ] **Kleurveld ongevalideerd:** `hoofdkleur` gaat als vrije tekst de DB in; een ongeldige waarde breekt de CSS-variabele (`style="--primary-color: {..}"`). Met `type="color"` in de admin is het gros gedekt, maar valideer server-side op `#RRGGBB`.
- [ ] **Printflow controleren:** De gids is A4-geprint; check dat `break-after-page` + de `@page`-regels in Chrome én Firefox de pagina's exact op A4-breuk zetten (de lege tweede sectie suggereert handmatige paginatie). Voeg een "Print als PDF"-knop toe i.p.v. reliance op Ctrl+P.
- [ ] **Foto's zonder thumbnail:** Personen-bestanden (max 100 MB!) worden ongeschaald in de gids en in de admin-tabel geladen (`object-cover` op de browser). Voeg `thumbs` toe aan het foto-veld in het schema en gebruik een `100x100`-thumb in overzichten — nu kan één gids tientallen MB aan foto's laden.

## 4. Hygiëne & DevOps

- [ ] **`console.error('PB Error:', err.data)` enige logging:** Fouten uit actions worden alleen in de serverconsole gedumpt en de gebruiker krijgt een vage `{ success: false }` zonder foutmelding in de UI. Toon de foutmelding (bijv. "Naam is verplicht") in het formulier.
- [ ] **`pocketbase` in devDependencies:** Runtime-dependency van de server — hoort in `dependencies` (deploy zonder devdeps breekt).
- [ ] **`@sveltejs/adapter-auto` ongebruikt:** `svelte.config.js` gebruikt `adapter-node`; verwijderen uit devDependencies.
- [ ] **Svelte 4-syntax:** `export let data`, `on:click`, `<slot>` op Svelte 5 — migreren naar runes is hier optioneel maar klein genoeg om in één keer te doen.
- [ ] **Deploy op `pull_request`:** Deployt naar productie bij elke PR — beperk tot `push` op main.
- [ ] **Geen `.dockerignore`:** `COPY . /usr/src/app` neemt `.env` (met PB-superuser-credentials!) en `node_modules` mee in de build. Direct toevoegen.
- [ ] **`npm install` i.p.v. `npm ci`:** In de Dockerfile; en pin `node:lts-alpine` op een vaste versie.
- [ ] **README aanvullen:** Documenteer de env-variabelen (`POCKETBASE_EMAIL/PASSWORD` zijn superuser-credentials — noem expliciet dat ze geheim moeten blijven) en hoe `json_to_pb.js` werkt.
- [ ] **robots.txt:** De app bevat leden-PII achter CapRover-auth, maar `/result` is server-side open zonder app-auth. Overweeg `Disallow: /` — deze tool hoeft niet geïndexeerd te worden.
