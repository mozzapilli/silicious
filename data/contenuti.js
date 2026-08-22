/* ==========================================================================
   SILICIOUS — ARCHIVIO DATI DEL SITO
   --------------------------------------------------------------------------
   Questo è l'unico file da modificare per aggiornare numeri, Messaggi e
   progetti. Non serve toccare le pagine HTML: si aggiornano da sole.

   REGOLE PER MODIFICARE SENZA ROMPERE NULLA
   1. Il testo va sempre tra "virgolette doppie".
   2. Ogni riga finisce con una virgola , tranne l'ultima di ogni blocco.
   3. Le date si scrivono così: "2026-11-15"  (anno-mese-giorno).
   4. I numeri si scrivono senza virgolette e col punto decimale: 0.9
   5. null significa "ancora non disponibile": la sezione resta nascosta.

   ⚠️  Le voci contrassegnate con  // DA COMPLETARE  contengono valori
       provvisori: vanno sostituite con i dati reali prima della pubblicazione.
   ========================================================================== */

window.SILICIOUS = {

  /* Data dell'ultimo aggiornamento dei dati qui sotto (compare nel footer). */
  aggiornato: "2026-08-22",


  /* ======================================================================
     1. ANAGRAFICA DELL'ASSOCIAZIONE
     ====================================================================== */
  associazione: {
    nome: "Silicious APS",
    nomeEsteso: "Associazione di Promozione Sociale Silicious",
    payoff: "Message in a'mpolla",
    costituzione: "2026",
    codiceFiscale: "DA COMPLETARE",          // DA COMPLETARE — codice fiscale attribuito
    runts: "Iscrizione in corso",            // DA COMPLETARE — numero e data di iscrizione al RUNTS
    sede: "DA COMPLETARE",                   // DA COMPLETARE — indirizzo della sede legale
    email: "info@silicious.org",             // DA COMPLETARE — casella reale da attivare
    iban: "DA COMPLETARE",                   // DA COMPLETARE — IBAN del conto associativo
    presidente: "Silvio Broggi",
    vicePresidente: "Marco Broggi",
    sociFondatori: 7,
    social: {
      instagram: "",                         // DA COMPLETARE — es. "https://instagram.com/silicious"
      facebook: ""                           // DA COMPLETARE
    }
  },


  /* ======================================================================
     2. INDICATORI (KPI) — i riquadri con i numeri grandi
     Alcuni numeri sono calcolati da soli dai Messaggi qui sotto
     (Messaggi avviati, magnum in custodia): non vanno scritti a mano.
     ====================================================================== */
  kpi: {
    soci: 7,                    // numero di soci attuali
    fondiRaccolti: 0,           // euro raccolti da aste e donazioni (totale storico)
    fondiErogati: 0,            // euro effettivamente destinati ai progetti
    progettiFinanziati: 0,      // progetti conclusi o finanziati
    ettariSeguiti: 0.9,         // ettari di vigneto raccontati dai Messaggi
    nota: "Dati aggiornati al 22 agosto 2026. L'Associazione è nel primo anno di attività."
  },


  /* ======================================================================
     3. I MESSAGGI
     Un blocco { ... } per ogni Messaggio. Per aggiungerne uno, copiare
     l'intero blocco e cambiarne i contenuti.

     stato:  "ampolla"   = vino in affinamento nell'ampolla di vetro
             "bottiglia" = imbottigliato, magnum in riposo
             "concluso"  = evento "Il Tempo Restituito" celebrato
     ====================================================================== */
  messaggi: [
    {
      numero: 1,
      slug: "messaggio-01",
      pagina: "messaggi/messaggio-01.html",
      titolo: "Vigna del Borraccio",
      azienda: "Fattoria Ispoli",
      vignaiolo: "Francesco Palombi",
      luogo: "Mercatale in Val di Pesa (FI)",
      regione: "Toscana",
      denominazione: "Chianti Classico",
      annata: 2025,
      vitigno: "Sangiovese in purezza",
      ettari: 0.9,
      magnum: 40,               // numero di magnum previste o effettive
      stato: "ampolla",

      date: {
        riempimento: "2025-12-13",        // giorno in cui l'ampolla è stata riempita
        imbottigliamento: "2026-11-15",   // data prevista o effettiva
        imbottigliamentoStimato: true,    // true = data ancora indicativa
        evento: "2029-11-15",             // "Il Tempo Restituito"
        eventoStimato: true
      },

      estratto: "Sangiovese in purezza da una parcella di 0,9 ettari su argille " +
                "e calcare, in conduzione biologica storica. Un'annata equilibrata, " +
                "vendemmiata il 27 settembre 2025.",

      /* Scheda di degustazione: resta null finché il vino non viene aperto.
         Quando sarà disponibile, sostituire null con un blocco come questo:
         degustazione: {
           data: "2029-11-15",
           punteggio: 95,           // su 100, oppure null
           degustatore: "Nome Cognome",
           note: "Testo delle note di degustazione."
         }                                                                   */
      degustazione: null,

      /* Progetto finanziato con l'asta di questo Messaggio: null finché
         non è stato scelto. Poi indicare lo slug dal blocco "progetti". */
      progetto: null
    }
  ],


  /* ======================================================================
     4. PROGETTI DI RESTITUZIONE
     stato: "proposto" | "in-corso" | "concluso"
     Finché l'elenco è vuoto [], la pagina mostra un messaggio di attesa.
     ====================================================================== */
  progetti: [
    // Esempio di blocco da copiare quando il primo progetto sarà deliberato:
    // {
    //   slug: "muretti-a-secco-ispoli",
    //   titolo: "Recupero dei muretti a secco",
    //   messaggio: 1,
    //   luogo: "Mercatale in Val di Pesa (FI)",
    //   stato: "in-corso",
    //   importo: 4500,
    //   anno: 2030,
    //   descrizione: "Breve descrizione dell'intervento e del suo effetto."
    // }
  ],


  /* ======================================================================
     5. LINEE DI INTERVENTO
     I cinque ambiti in cui l'Associazione destina i fondi raccolti.
     ====================================================================== */
  lineeIntervento: [
    {
      titolo: "Salvaguardia idrogeologica di vigneti storici ed eroici",
      testo: "Ripristino di drenaggi superficiali, manutenzione di muretti a secco " +
             "degradati e consolidamento di terrazzamenti: micro-interventi di " +
             "manutenzione straordinaria che l'azienda agricola non riuscirebbe a " +
             "sostenere da sola."
    },
    {
      titolo: "Recupero di biotipi locali",
      testo: "Assistenza agronomica specialistica per il recupero di ceppi centenari " +
             "e varietà autoctone minori: potatura di riforma, reinnesto, sostituzione " +
             "delle fallanze con materiale genetico del luogo."
    },
    {
      titolo: "Salute del suolo e biodiversità",
      testo: "Campagne di analisi del suolo e rilievi di biodiversità funzionale " +
             "(Indice Bigot) per fornire al vignaiolo dati oggettivi con cui ridurre " +
             "gli input chimici e aumentare la resilienza dell'agrosistema."
    },
    {
      titolo: "Segnaletica e valorizzazione del luogo",
      testo: "Piccoli interventi di pannellistica informativa nei vigneti dei Messaggi, " +
             "con materiali a basso impatto e design essenziale, per restituire alla " +
             "comunità le chiavi di lettura del paesaggio viticolo."
    },
    {
      titolo: "Borse di lavoro per operazioni manuali specializzate",
      testo: "Contributi a sostegno della manodopera in operazioni ad alto valore " +
             "aggiunto — scacchiatura, sfogliatura, selezione dei grappoli — favorendo " +
             "l'impiego di giovani e persone in formazione."
    }
  ],


  /* ======================================================================
     6. PARTNER E COLLABORAZIONI
     ====================================================================== */
  partner: [
    { nome: "Perleuve Srl", ruolo: "Dati viticoli, monitoraggio dei vigneti e Indice Bigot", sito: "" },
    { nome: "Banca del Vino di Pollenzo", ruolo: "Stoccaggio e conservazione delle magnum", sito: "" },
    { nome: "Wine Globe", ruolo: "Fornitura e personalizzazione delle ampolle di vetro da 60 litri", sito: "" }
  ]
};
