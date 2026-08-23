# Come aggiornare il sito

## Provare le tre palette (temporaneo)

Finché non hai scelto i colori definitivi, puoi cambiarli aggiungendo un
parametro all'indirizzo. La scelta resta valida mentre navighi tra le pagine.

| Indirizzo | Palette |
|---|---|
| `.../?stile=base` | pesca, verde vigna, cielo — accento rosso vino |
| `.../?stile=terra` | cotto, salvia, sabbia — accento terracotta |
| `.../?stile=fredda` | lilla, menta, cielo — accento indaco |

Quando avrai deciso, si tiene la palette scelta in cima a
`assets/css/style.css` e si cancellano le altre due insieme alla funzione
`applicaStileDiProva` in `assets/js/site.js`.


Tutto quello che cambia nel tempo — numeri, Messaggi, progetti — sta in un solo file:

```
data/contenuti.js
```

Si apre con qualsiasi editor di testo (Blocco note va benissimo, meglio ancora
Visual Studio Code). Le pagine del sito leggono quel file e si aggiornano da sole.

## Tre regole per non rompere niente

1. Il testo va sempre tra `"virgolette doppie"`.
2. Le righe di un elenco finiscono con una virgola `,` **tranne l'ultima**.
3. Le date si scrivono `"2026-11-15"` — anno, mese, giorno.

Se dopo una modifica il sito mostra pagine vuote, quasi sempre manca una virgoletta
o una virgola. Premi `F12` nel browser: la scheda **Console** dice dove.

---

## Aggiornare i numeri (KPI)

Nel blocco `kpi`:

```js
kpi: {
  soci: 12,
  fondiRaccolti: 18500,
  fondiErogati: 4500,
  progettiFinanziati: 1,
  ettariSeguiti: 2.4,
  nota: "Dati aggiornati al ..."
}
```

I numeri **Messaggi avviati** e **Magnum in custodia** non si scrivono a mano:
il sito li conta da solo dai Messaggi.

Ricordati di aggiornare anche la riga in alto:

```js
aggiornato: "2026-11-20",
```

---

## Far avanzare un Messaggio nel tempo

Ogni Messaggio ha un campo `stato` che comanda le barre del tempo:

| `stato`       | Significato                                        |
|---------------|----------------------------------------------------|
| `"ampolla"`   | il vino affina nell'ampolla di vetro                |
| `"bottiglia"` | imbottigliato, le magnum riposano                   |
| `"concluso"`  | evento «Il Tempo Restituito» celebrato              |

**Quando imbottigli**, per il Messaggio n°1:

```js
stato: "bottiglia",
date: {
  riempimento: "2025-12-13",
  imbottigliamento: "2026-11-14",     // la data vera
  imbottigliamentoStimato: false,     // non è più una previsione
  evento: "2029-11-15",
  eventoStimato: true
},
magnum: 37,            // quante ne sono uscite davvero
magnumAzienda: 1,      // quante restano alla cantina ospitante
magnumAsta: 36,        // quante vanno all'asta
```

Il sito passa automaticamente a mostrare il conto alla rovescia verso l'evento.

Il KPI «Magnum in custodia» è calcolato come `magnum − magnumAzienda`: quelle
effettivamente conservate dall'Associazione. Non va scritto a mano.

---

## Cambiare la fotografia di un Messaggio

Ogni Messaggio ha una foto di copertina, quella che compare nelle schede
dell'archivio:

```js
copertina: "assets/img/messaggio-01/ampolla-piena.jpg",
copertinaAlt: "Descrizione della foto per chi non la può vedere",
```

Le foto vanno messe in `assets/img/messaggio-01/` (una cartella per Messaggio).
**Ridimensionale prima di caricarle**: massimo 1400 pixel di lato lungo e qualità
80. Una foto da telefono pesa 5-8 MB e renderebbe il sito lentissimo.

Il campo `copertinaAlt` non è un dettaglio: è quello che leggono i non vedenti e
i motori di ricerca. Descrivi che cosa si vede, non «foto ampolla».

---

## Aggiungere un nuovo Messaggio

1. In `data/contenuti.js`, copia **tutto il blocco** del Messaggio n°1
   (dalla `{` alla `}`), incollalo sotto e mettici una virgola in mezzo.
2. Cambia `numero`, `slug`, `pagina`, azienda, vigna, date, ecc.
3. Duplica il file `messaggi/messaggio-01.html`, rinominalo `messaggio-02.html`
   e riscrivi i testi delle schede tecniche. Dentro, cambia anche i due
   `data-messaggio="1"` in `data-messaggio="2"`.
4. Aggiungi la nuova pagina in `sitemap.xml`.

L'archivio in home e nella pagina Messaggi si popola da solo.

---

## Pubblicare una scheda di degustazione

Quando la magnum viene aperta, nel Messaggio corrispondente sostituisci
`degustazione: null` con:

```js
degustazione: {
  data: "2029-11-15",
  punteggio: 95,
  degustatore: "Nome Cognome",
  note: "Le note di degustazione, in un paragrafo."
},
```

Se non vuoi pubblicare un punteggio, scrivi `punteggio: null`.

---

## Aggiungere un progetto

Nell'elenco `progetti`, aggiungi un blocco:

```js
{
  slug: "muretti-a-secco-ispoli",
  titolo: "Recupero dei muretti a secco",
  messaggio: 1,
  luogo: "Mercatale in Val di Pesa (FI)",
  stato: "in-corso",          // "proposto" | "in-corso" | "concluso"
  importo: 4500,
  anno: 2030,
  descrizione: "Che cosa viene fatto e che effetto ha."
}
```

Compare automaticamente nella sezione giusta della pagina *Restituzione*.

---

## Mandare online le modifiche

Dalla cartella del sito, in PowerShell:

```bash
git add -A
git commit -m "Aggiornati i dati di agosto"
git push
```

GitHub Pages ripubblica il sito da solo, in genere entro un minuto.
