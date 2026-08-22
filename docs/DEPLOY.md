# Pubblicazione del sito

## 1. Repository su GitHub

Il codice sta nel repository **`mozzapilli/silicious`** (pubblico).

Prima pubblicazione, dalla cartella del sito:

```bash
git add -A
git commit -m "Prima versione del sito"
git branch -M main
git remote add origin https://github.com/mozzapilli/silicious.git
git push -u origin main
```

Al primo `push` si apre il browser per l'autenticazione GitHub: le credenziali
vengono poi ricordate da Git Credential Manager.

## 2. Attivare GitHub Pages

Su GitHub: repository **silicious** → **Settings** → **Pages**

- *Source*: **Deploy from a branch**
- *Branch*: **main**, cartella **/ (root)** → **Save**

Dopo un minuto il sito è online su
`https://mozzapilli.github.io/silicious/`

> Nota: finché il sito sta in questo indirizzo, i link della pagina 404 non
> funzionano (usano percorsi assoluti). Si sistemano da soli quando il dominio
> personalizzato è attivo.

## 3. Dominio silicious.org

Sono stati scelti due domini: **silicious.org** come indirizzo ufficiale e
**silicious.it** che rimanda al primo.

### a) Nel repository

Crea un file chiamato `CNAME` (senza estensione) nella cartella principale, con
dentro una sola riga:

```
silicious.org
```

Poi `git add CNAME`, `git commit`, `git push`.

> ⚠️ Aggiungi il file `CNAME` **solo dopo** aver configurato il DNS del punto (b),
> altrimenti il sito su `mozzapilli.github.io` smette di rispondere.

### b) Dal pannello di chi ti ha venduto il dominio

Per `silicious.org` crea questi record:

| Tipo  | Nome  | Valore                |
|-------|-------|-----------------------|
| A     | `@`   | `185.199.108.153`     |
| A     | `@`   | `185.199.109.153`     |
| A     | `@`   | `185.199.110.153`     |
| A     | `@`   | `185.199.111.153`     |
| CNAME | `www` | `mozzapilli.github.io.` |

Per `silicious.it`, invece, imposta un **redirect permanente (301)** verso
`https://silicious.org` — quasi tutti i registrar offrono questa funzione senza costi.

### c) Ultimo passaggio

Su GitHub → Settings → Pages: inserisci `silicious.org` in *Custom domain*,
attendi la verifica e spunta **Enforce HTTPS**. Il certificato viene emesso
gratuitamente da GitHub, può richiedere qualche ora.

## 4. Da correggere nei documenti dell'Associazione

Il regolamento operativo (Art. 5) e la roadmap indicano **silicious.it** come sito
ufficiale. Se l'indirizzo ufficiale diventa `silicious.org`, quei documenti vanno
allineati prima del deposito definitivo.

## 5. Moduli: dalla posta elettronica a un servizio di invio

Oggi i moduli (contatti, adesione, proposta di progetto) aprono il programma di
posta dell'utente con il messaggio già compilato. Funziona ovunque e non manda dati
a terzi, ma perde chi usa la webmail senza client configurato.

Per ricevere gli invii direttamente via e-mail si può usare un servizio gratuito
tipo Formspree:

1. Crea un endpoint su formspree.io con l'indirizzo dell'Associazione.
2. In ogni `<form ...>` aggiungi `action="https://formspree.io/f/xxxxxxx"` e `method="POST"`.
3. Togli l'attributo `data-oggetto`: la logica via e-mail si disattiva da sola.

Prima di attivarlo serve una pagina di **informativa privacy** (GDPR) e una
casella di spunta di consenso nel modulo.

## 6. Cose ancora da mettere a posto

- [ ] Casella e-mail ufficiale su dominio proprio (es. `info@silicious.org`)
- [ ] Codice fiscale, sede legale, estremi RUNTS e IBAN in `data/contenuti.js`
- [ ] Fotografie della vigna, della cantina e dell'ampolla
- [ ] Pagina Informativa privacy e Cookie policy
- [ ] Profili Instagram/Facebook da collegare nel footer
- [ ] Immagine di anteprima social dedicata (1200×630 px)
