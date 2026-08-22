# Sito Silicious APS

Sito vetrina del progetto **Silicious — Message in a'mpolla**.

Sito statico: solo HTML, CSS e JavaScript. Nessun programma da installare, nessuna
compilazione, nessun database. Si pubblica su GitHub Pages e si aggiorna modificando
un unico file di dati.

## Vedere il sito sul proprio computer

Tasto destro su `serve.ps1` → **Esegui con PowerShell**, poi apri
<http://localhost:8080>. Per fermare il server: `CTRL + C` nella finestra nera.

```powershell
powershell -ExecutionPolicy Bypass -File serve.ps1
```

## Aggiornare i contenuti

Quasi tutto si aggiorna da **`data/contenuti.js`**: numeri, Messaggi, progetti,
partner, anagrafica dell'associazione. Le pagine si aggiornano da sole.

Guida passo passo: [`docs/COME-AGGIORNARE.md`](docs/COME-AGGIORNARE.md).

## Pubblicare online

Istruzioni per GitHub Pages e per il dominio: [`docs/DEPLOY.md`](docs/DEPLOY.md).

## Struttura delle cartelle

```
index.html               Home — il progetto
messaggi/                Archivio dei Messaggi + scheda del Messaggio n°1
progetti/                "Il Tempo Restituito": progetti, linee di intervento, proposte
associazione/            Chi siamo, governance, trasparenza
sostieni/                Diventa socio, donazioni
contatti/                Modulo di contatto
data/contenuti.js        ★ TUTTI I DATI DEL SITO — il file da modificare
assets/css/style.css     Colori, tipografia, impaginazione
assets/js/site.js        Logica: KPI, barre del tempo, archivio, moduli
assets/img/              Logo (vettoriale e PNG)
docs/                    Guide operative
serve.ps1                Anteprima locale
```

## Da completare prima della pubblicazione

Nel file `data/contenuti.js` sono contrassegnate con `DA COMPLETARE` le informazioni
ancora mancanti: codice fiscale, sede legale, IBAN, indirizzo e-mail ufficiale,
estremi RUNTS e profili social.
