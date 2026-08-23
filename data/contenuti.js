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
    costituzione: "16 giugno 2026",
    codiceFiscale: "94166290307",
    /* Domanda presentata, iscrizione non ancora perfezionata. Quando arriva
       il numero di repertorio, sostituire questa riga. */
    runts: "Domanda di iscrizione presentata il 10 agosto 2026 — pratica TSFO-01_002797906",
    sede: "Piazza Paolo Diacono 8 — 33043 Cividale del Friuli (UD)",
    email: "info@silicious.it",
    iban: "DA COMPLETARE",                   // DA COMPLETARE — IBAN del conto associativo
    presidente: "Marco Broggi",         // ideatore del progetto
    vicePresidente: "Silvio Broggi",
    consigliere: "Marta Sherpi",
    sociFondatori: 9,
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

     magnum: totale prodotto. magnumAzienda: quante restano alla cantina
     ospitante. magnumAsta: quante vengono battute all'asta benefica.
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
      stato: "ampolla",

      /* Magnum: totali previste (o effettive dopo l'imbottigliamento),
         quante restano all'azienda ospitante e quante vanno all'asta. */
      magnum: 39,
      magnumAzienda: 1,
      magnumAsta: 38,

      /* Fotografia usata nelle schede dell'archivio. */
      copertina: "assets/img/messaggio-01/ampolla-airlock.jpg",
      copertinaAlt: "L'ampolla coperta di nero con il gorgogliatore montato sul coperchio d'acciaio",

      /* Colore del vino nel disegno dell'ampolla: l'unico colore di tutto il
         sito, ed è voluto — lì il colore è un dato, non una decorazione.
         Sangiovese giovane: rubino con riflessi granato. Per un bianco
         servirebbe un ambra tipo "#D8B76A". */
      coloreVino: "#7C1E2B",

      /* ---- L'azienda ospitante ----
         Dati verificati sul sito dell'azienda e sul portale del Consorzio.
         Il recapito telefonico è il cellulare personale del vignaiolo e non
         viene pubblicato: chi vuole contattarlo passa dal sito dell'azienda. */
      aziendaInfo: {
        indirizzo: "Via Santa Lucia 2, località Mercatale — 50026 San Casciano in Val di Pesa (FI)",
        sito: "https://www.fattoria-ispoli.com/",
        instagram: "https://www.instagram.com/fattoria.ispoli/",
        facebook: "https://www.facebook.com/fattoria.ispoli",
        consorzio: "https://www.chianticlassico.com/it/aziende/fattoria-ispoli/",
        nota: "Azienda biologica certificata, tra le prime del Chianti Classico a intraprendere " +
              "questa strada negli anni Ottanta."
      },

      /* ---- Mappa ----
         Coordinate della cantina. Per disegnare il contorno della Vigna del
         Borraccio riempire "vigna" con l'elenco dei vertici [latitudine, longitudine]:
         si ottiene in due minuti su geojson.io disegnando il perimetro sulla
         foto satellitare, oppure esportando la particella da 4Grapes / dal
         fascicolo aziendale. Finché resta null, la mappa mostra solo la cantina. */
      mappa: {
        lat: 43.644126,
        lon: 11.243592,
        zoom: 16,
        etichetta: "Fattoria Ispoli",
        vigna: null
      },

      /* ---- L'annata dal punto di vista meteorologico ----
         I valori vengono dalla rianalisi ERA5: sono la ricostruzione del clima
         su una cella di circa 9 km centrata sulla tenuta, NON la stazione
         meteo aziendale. Se Ispoli ha dati propri, sostituiscili: sono meglio. */
      meteo: {
        periodo: "1 aprile – 27 settembre 2025",
        riferimento: "media 1995–2024, stessa finestra",
        fonte: "Rianalisi ERA5 elaborata via Open-Meteo sul punto della tenuta " +
               "(43,6438 N — 11,2433 E). Non sono dati di stazione aziendale.",

        indici: [
          { etichetta: "Pioggia cumulata",      valore: 465,  unita: "mm", media: 345 },
          { etichetta: "Gradi giorno, base 10", valore: 1911, unita: "",   media: 1632 },
          { etichetta: "Giorni oltre 35 °C",    valore: 11,   unita: "",   media: 3 }
        ],

        mensili: [
          { mese: "Apr", pioggia:  95, pioggiaMedia: 78, temp: 13.5, tempMedia: 11.6 },
          { mese: "Mag", pioggia:  94, pioggiaMedia: 76, temp: 16.3, tempMedia: 15.8 },
          { mese: "Giu", pioggia:  15, pioggiaMedia: 46, temp: 24.9, tempMedia: 20.4 },
          { mese: "Lug", pioggia:  91, pioggiaMedia: 27, temp: 24.1, tempMedia: 23.4 },
          { mese: "Ago", pioggia: 100, pioggiaMedia: 36, temp: 24.4, tempMedia: 23.4 },
          { mese: "Set", pioggia:  69, pioggiaMedia: 89, temp: 20.1, tempMedia: 18.8 }
        ],

        racconto: [
          "L'annata comincia prima di cominciare. Tra ottobre 2024 e marzo 2025 sono caduti " +
          "704 millimetri: l'argilla del Borraccio è arrivata alla primavera con la riserva " +
          "idrica piena, ed è questa scorta che spiega buona parte di quello che succede dopo.",

          "Aprile e maggio restano sopra la media per pioggia — 95 e 94 millimetri contro 78 e 76 — " +
          "con temperature di poco superiori alla norma. Poi giugno rompe il ritmo: 15 millimetri " +
          "contro i 46 abituali e una media mensile di 4,5 gradi sopra la norma, con tre giorni " +
          "oltre i 35 °C fra il 28 e il 30. Il periodo asciutto si allunga fino al 5 luglio, " +
          "tredici giorni consecutivi senza pioggia.",

          "È il momento in cui l'annata avrebbe potuto perdersi, e non lo fa. Luglio e agosto " +
          "riportano acqua molto sopra la media — 91 e 100 millimetri contro 27 e 36 — che " +
          "interrompe lo stress prima che diventi blocco vegetativo. La seconda ondata di calore, " +
          "dal 9 al 13 agosto, tocca il massimo assoluto della stagione con 37,3 °C il 13, ma " +
          "trova la pianta rifornita.",

          "Settembre torna sotto la media di pioggia, 69 millimetri contro 89, con temperature " +
          "miti. La vendemmia del Borraccio è del 27 settembre.",

          "La lettura d'insieme è di un'annata calda in termini assoluti — 1.911 gradi giorno " +
          "contro una media di 1.632 — ma in cui il caldo è arrivato concentrato in due episodi " +
          "brevi, con acqua prima e dopo ciascuno. Per accumulo termico il 2025 somiglia al 2023 " +
          "e al 2018; per disponibilità idrica sta molto sopra entrambi, con 465 millimetri " +
          "contro i 400 del 2023 e i 337 del 2018. È la combinazione, più che il singolo dato, " +
          "a raccontare la maturazione regolare osservata in vigna."
        ]
      },

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
