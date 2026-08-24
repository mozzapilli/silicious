# Informativa privacy — cosa far controllare prima di pubblicarla

La bozza è in `privacy/index.html`. **Non è collegata dal sito e non è
indicizzabile**: nell'intestazione c'è un `<meta name="robots" content="noindex,
nofollow">` con accanto un commento che spiega di toglierlo dopo la revisione.

Si vede all'indirizzo `https://silicious.it/privacy/` — chi non conosce
l'indirizzo non ci arriva.

## Cosa ho scritto sulla base di fatti verificati

Queste parti descrivono il sito com'è, misurato, non come si presume che sia:

- il sito non usa cookie e non scrive nel deposito locale del browser;
- non contatta nessun server esterno per mostrarsi (i caratteri sono ospitati
  sul sito dal 24 agosto 2026, prima arrivavano da Google);
- la mappa contatta unpkg.com e tile.openstreetmap.org **solo** dopo un clic;
- i moduli non inviano nulla: aprono il programma di posta dell'utente.

## Cosa deve confermare il commercialista o un legale

1. **Responsabile della protezione dei dati.** Ho scritto che non è stato
   nominato perché non ricorre l'art. 37. Da confermare.

2. **Tempi di conservazione.** Ho messo i termini abituali: due anni per la
   corrispondenza, dieci anni per contabilità e libro soci. Vanno confermati.

3. **Dati richiesti ai soci.** Ho elencato nome, data e luogo di nascita,
   residenza, codice fiscale, e-mail e telefono, che sono quelli dell'atto
   costitutivo. Se il modulo di adesione ne chiede altri l'elenco va allineato.

4. **Nomina del commercialista a responsabile del trattamento.** L'informativa
   dice che lo studio è nominato ai sensi dell'art. 28. **Serve l'atto di
   nomina firmato**: se non c'è, va fatto — altrimenti l'informativa dichiara
   una cosa che non esiste.

5. **Fornitore della posta.** Aruba è nominata genericamente come fornitore
   della casella. Verificare che il contratto includa le clausole sul
   trattamento.

6. **Trasferimento negli Stati Uniti.** Ho citato la decisione di adeguatezza
   del 10 luglio 2023 e l'adesione di GitHub all'EU-U.S. Data Privacy
   Framework. Verificare che l'adesione sia ancora attiva al momento della
   pubblicazione.

## Quando i moduli inizieranno a inviare davvero

Oggi i moduli aprono il programma di posta e nessun dato passa dal sito. Se un
domani si passa a un servizio di invio tipo Formspree, cambiano due cose:

- l'informativa va aggiornata con quel fornitore;
- nei moduli serve una casella di spunta di presa visione, con il collegamento
  a questa pagina.

## Da fare per pubblicarla

1. Far leggere la bozza a chi di dovere e correggere i punti sopra.
2. Togliere la riga `<meta name="robots" content="noindex, nofollow">` e il
   commento che la precede.
3. Aggiungere il collegamento nel piede di tutte le pagine.
4. Aggiungere la pagina a `sitemap.xml`.

Il punto 2, 3 e 4 li faccio io in cinque minuti: basta dirmi che è approvata.
