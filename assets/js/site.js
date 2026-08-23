/* ==========================================================================
   Silicious — logica del sito
   Legge i dati da data/contenuti.js e riempie le parti dinamiche delle pagine.
   Nessuna libreria esterna, nessuna compilazione: funziona anche aprendo i
   file direttamente da disco.
   ========================================================================== */

(function () {
  "use strict";

  var D = window.SILICIOUS || {};

  /* ----------------------------- Utilità ------------------------------- */

  function el(sel, ctx) { return (ctx || document).querySelector(sel); }
  function els(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  function data(iso) { return iso ? new Date(iso + "T12:00:00") : null; }

  function dataEstesa(iso) {
    var d = data(iso);
    if (!d) return "—";
    return d.toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" });
  }

  function meseAnno(iso) {
    var d = data(iso);
    if (!d) return "—";
    return d.toLocaleDateString("it-IT", { month: "long", year: "numeric" });
  }

  function numero(n, decimali) {
    if (n === null || n === undefined) return "—";
    return n.toLocaleString("it-IT", {
      minimumFractionDigits: decimali || 0,
      maximumFractionDigits: decimali === undefined ? 0 : decimali
    });
  }

  function euro(n) {
    if (n === null || n === undefined) return "—";
    return "€ " + numero(n);
  }

  /* Distanza in linguaggio naturale da oggi a una data futura. */
  function mancano(iso) {
    var d = data(iso);
    if (!d) return "—";
    var oggi = new Date();
    var giorni = Math.ceil((d - oggi) / 86400000);
    if (giorni <= 0) return "conclusa";
    if (giorni < 45) return giorni + (giorni === 1 ? " giorno" : " giorni");
    var mesi = Math.round(giorni / 30.44);
    if (mesi < 24) return mesi + " mesi";
    var anni = Math.floor(mesi / 12);
    var resto = mesi % 12;
    return anni + " anni" + (resto ? " e " + resto + (resto === 1 ? " mese" : " mesi") : "");
  }

  function percentuale(daIso, aIso) {
    var da = data(daIso), a = data(aIso);
    if (!da || !a || a <= da) return 100;
    var p = ((new Date()) - da) / (a - da) * 100;
    return Math.max(0, Math.min(100, p));
  }

  function testo(html) {
    var t = document.createElement("div");
    t.innerHTML = html;
    return t.firstElementChild;
  }

  function esc(s) {
    return String(s === null || s === undefined ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* ------------------------- Fasi di un Messaggio ----------------------- */

  var FASI = {
    ampolla:   { etichetta: "In ampolla",  classe: "ampolla"   },
    bottiglia: { etichetta: "In bottiglia", classe: "bottiglia" },
    concluso:  { etichetta: "Concluso",    classe: "conclusa"  }
  };

  function faseCorrente(m) {
    var f = FASI[m.stato] || FASI.ampolla;
    if (m.stato === "ampolla") {
      return {
        etichetta: f.etichetta, classe: f.classe,
        da: m.date.riempimento, a: m.date.imbottigliamento,
        daLabel: "Riempimento dell'ampolla",
        aLabel: "Imbottigliamento" + (m.date.imbottigliamentoStimato ? " (previsto)" : ""),
        contoLabel: "all'imbottigliamento",
        descrizione: "Il vino riposa nell'ampolla di vetro da 60 litri presso la cantina ospitante."
      };
    }
    if (m.stato === "bottiglia") {
      return {
        etichetta: f.etichetta, classe: f.classe,
        da: m.date.imbottigliamento, a: m.date.evento,
        daLabel: "Imbottigliamento",
        aLabel: "Il Tempo Restituito" + (m.date.eventoStimato ? " (previsto)" : ""),
        contoLabel: "all'evento «Il Tempo Restituito»",
        descrizione: "Le magnum riposano in cantina, in attesa dell'evento conclusivo."
      };
    }
    return {
      etichetta: f.etichetta, classe: f.classe,
      da: m.date.imbottigliamento, a: m.date.evento,
      daLabel: "Imbottigliamento", aLabel: "Il Tempo Restituito",
      contoLabel: null,
      descrizione: "Il ciclo di questo Messaggio si è concluso con l'asta benefica."
    };
  }

  /* --------------------------------- KPI -------------------------------- */

  function renderKpi(nodo) {
    var messaggi = D.messaggi || [];
    var k = D.kpi || {};
    /* In custodia all'Associazione: il totale meno quelle che restano alla cantina. */
    var magnum = messaggi.reduce(function (s, m) {
      return s + ((m.magnum || 0) - (m.magnumAzienda || 0));
    }, 0);
    var asta = messaggi.reduce(function (s, m) { return s + (m.magnumAsta || 0); }, 0);
    var quali = (nodo.getAttribute("data-kpi") || "messaggi,magnum,soci,fondi").split(",");

    var voci = {
      messaggi:  { valore: numero(messaggi.length), etichetta: "Messaggi avviati" },
      magnum:    { valore: numero(magnum),          etichetta: "Magnum in custodia" },
      asta:      { valore: numero(asta),            etichetta: "Magnum destinate all'asta" },
      soci:      { valore: numero(k.soci),          etichetta: "Soci dell'Associazione" },
      fondi:     { valore: euro(k.fondiRaccolti),   etichetta: "Fondi raccolti" },
      erogati:   { valore: euro(k.fondiErogati),    etichetta: "Fondi erogati" },
      progetti:  { valore: numero(k.progettiFinanziati), etichetta: "Progetti finanziati" },
      ettari:    { valore: numero(k.ettariSeguiti, 1),   etichetta: "Ettari di vigneto seguiti" }
    };

    nodo.innerHTML = quali.map(function (nome) {
      var v = voci[nome.trim()];
      if (!v) return "";
      return '<div class="kpi"><span class="numero">' + esc(v.valore) + "</span>" +
             '<span class="etichetta">' + esc(v.etichetta) + "</span></div>";
    }).join("");
  }

  /* ---------------------------- Barre del tempo ------------------------- */

  function barraMessaggio(m) {
    var f = faseCorrente(m);
    var p = m.stato === "concluso" ? 100 : percentuale(f.da, f.a);
    var conto = f.contoLabel
      ? '<span class="conto">' + esc(mancano(f.a)) + "<small>" + esc(f.contoLabel) + "</small></span>"
      : "";

    return '<article class="tempo">' +
        '<div class="testata">' +
          '<span class="titolo">Messaggio n°' + esc(m.numero) + " — " + esc(m.titolo) + "</span>" +
          '<span class="fase ' + f.classe + '">' + esc(f.etichetta) + "</span>" +
        "</div>" +
        '<p class="sottotesto">' + esc(m.azienda) + ", " + esc(m.luogo) + ". " + esc(f.descrizione) + "</p>" +
        '<div class="barra"><i style="width:' + p.toFixed(1) + '%"></i></div>' +
        '<div class="barra-estremi">' +
          "<span>" + esc(f.daLabel) + " · " + esc(meseAnno(f.da)) + "</span>" +
          "<span>" + esc(f.aLabel) + " · " + esc(meseAnno(f.a)) + "</span>" +
        "</div>" + conto +
      "</article>";
  }

  function renderTempo(nodo) {
    var messaggi = (D.messaggi || []).filter(function (m) { return m.stato !== "concluso"; });
    if (!messaggi.length) {
      nodo.innerHTML = '<p class="vuoto">Nessun Messaggio in corso in questo momento.</p>';
      return;
    }
    nodo.innerHTML = messaggi.map(barraMessaggio).join("");
  }

  /* ----------------------------- Archivio ------------------------------- */

  function renderArchivio(nodo) {
    var base = nodo.getAttribute("data-base") || "";
    var messaggi = D.messaggi || [];
    if (!messaggi.length) {
      nodo.innerHTML = '<p class="vuoto">L\'archivio sarà popolato con il primo Messaggio.</p>';
      return;
    }
    nodo.innerHTML = messaggi.map(function (m) {
      var f = faseCorrente(m);
      var foto = m.copertina
        ? '<img class="copertina" src="' + esc(base + m.copertina) + '" alt="' +
          esc(m.copertinaAlt || "") + '" loading="lazy" width="800" height="600">'
        : "";
      return '<a class="scheda scheda-link' + (foto ? " con-foto" : "") +
          '" href="' + esc(base + m.pagina) + '">' + foto +
          '<div class="corpo">' +
            '<span class="meta">Messaggio n°' + esc(m.numero) + " · " + esc(m.annata) + "</span>" +
            "<h3>" + esc(m.titolo) + "</h3>" +
            "<p><strong>" + esc(m.azienda) + "</strong><br>" + esc(m.luogo) + "</p>" +
            "<p>" + esc(m.denominazione) + " · " + esc(m.vitigno) + "</p>" +
            '<div class="piede"><span class="fase ' + f.classe + '">' + esc(f.etichetta) + "</span></div>" +
          "</div>" +
        "</a>";
    }).join("");
  }

  /* ----------------------------- Progetti ------------------------------- */

  var STATI_PROGETTO = { "proposto": "Proposto", "in-corso": "In corso", "concluso": "Concluso" };

  function renderProgetti(nodo) {
    var filtro = nodo.getAttribute("data-stato");
    var lista = (D.progetti || []).filter(function (p) { return !filtro || p.stato === filtro; });
    if (!lista.length) {
      nodo.innerHTML = '<p class="vuoto">' + esc(nodo.getAttribute("data-vuoto") ||
        "Nessun progetto da mostrare per ora.") + "</p>";
      return;
    }
    nodo.innerHTML = lista.map(function (p) {
      return '<article class="scheda">' +
          '<span class="meta">' + esc(STATI_PROGETTO[p.stato] || p.stato) +
            (p.anno ? " · " + esc(p.anno) : "") + "</span>" +
          "<h3>" + esc(p.titolo) + "</h3>" +
          "<p>" + esc(p.descrizione) + "</p>" +
          '<div class="piede piccolo guida">' + esc(p.luogo || "") +
            (p.importo ? " · " + esc(euro(p.importo)) : "") +
            (p.messaggio ? " · Messaggio n°" + esc(p.messaggio) : "") +
          "</div>" +
        "</article>";
    }).join("");
  }

  /* -------------------------- Linee di intervento ----------------------- */

  function renderLinee(nodo) {
    nodo.innerHTML = (D.lineeIntervento || []).map(function (l, i) {
      return '<article class="passo">' +
          '<span class="num">' + (i + 1 < 10 ? "0" : "") + (i + 1) + "</span>" +
          "<h3>" + esc(l.titolo) + "</h3>" +
          "<p>" + esc(l.testo) + "</p>" +
        "</article>";
    }).join("");
  }

  /* -------------------------------- Partner ----------------------------- */

  function renderPartner(nodo) {
    nodo.innerHTML = (D.partner || []).map(function (p) {
      var nome = p.sito
        ? '<a href="' + esc(p.sito) + '" rel="noopener">' + esc(p.nome) + "</a>"
        : esc(p.nome);
      return '<article class="scheda"><h3>' + nome + "</h3><p>" + esc(p.ruolo) + "</p></article>";
    }).join("");
  }

  /* ----------------- Blocchi della pagina di un Messaggio --------------- */

  function renderStatoMessaggio(nodo) {
    var n = parseInt(nodo.getAttribute("data-messaggio"), 10);
    var m = (D.messaggi || []).filter(function (x) { return x.numero === n; })[0];
    if (!m) { nodo.innerHTML = ""; return; }
    nodo.innerHTML = barraMessaggio(m);
  }

  function renderDegustazione(nodo) {
    var n = parseInt(nodo.getAttribute("data-messaggio"), 10);
    var m = (D.messaggi || []).filter(function (x) { return x.numero === n; })[0];
    var d = m && m.degustazione;
    if (!d) {
      nodo.innerHTML = '<p class="vuoto">La scheda di degustazione sarà pubblicata ' +
        "dopo l'apertura delle magnum, in occasione dell'evento «Il Tempo Restituito».</p>";
      return;
    }
    nodo.innerHTML = '<div class="tempo">' +
        '<div class="testata"><span class="titolo">Scheda di degustazione</span>' +
          (d.punteggio ? '<span class="fase bottiglia">' + esc(d.punteggio) + "/100</span>" : "") +
        "</div>" +
        '<p class="sottotesto">' + esc(dataEstesa(d.data)) +
          (d.degustatore ? " · " + esc(d.degustatore) : "") + "</p>" +
        "<p>" + esc(d.note) + "</p>" +
      "</div>";
  }

  /* --------------------------- Moduli via e-mail ------------------------ */
  /* Il sito è statico: i moduli compongono un'e-mail già pronta.
     Per passare a un servizio di invio (es. Formspree) vedere docs/DEPLOY.md. */

  function collegaModuli() {
    els("form[data-email]").forEach(function (form) {
      form.addEventListener("submit", function (ev) {
        ev.preventDefault();
        var destinatario = form.getAttribute("data-email") ||
          (D.associazione && D.associazione.email) || "";
        var oggetto = form.getAttribute("data-oggetto") || "Messaggio dal sito Silicious";
        var righe = [];
        els("input, textarea, select", form).forEach(function (campo) {
          if (!campo.name || campo.type === "submit") return;
          var etichetta = el('label[for="' + campo.id + '"]', form);
          righe.push((etichetta ? etichetta.textContent.trim() : campo.name) + ": " + campo.value);
        });
        window.location.href = "mailto:" + destinatario +
          "?subject=" + encodeURIComponent(oggetto) +
          "&body=" + encodeURIComponent(righe.join("\n\n"));
        var esito = el(".esito-modulo", form);
        if (esito) {
          esito.textContent = "Si sta aprendo il tuo programma di posta con il messaggio già pronto. " +
            "Se non succede nulla, scrivi direttamente a " + destinatario + ".";
        }
      });
    });
  }

  /* ------------------------- Navigazione e footer ----------------------- */

  function collegaNavigazione() {
    var bottone = el(".menu-toggle");
    var nav = el(".nav");
    if (bottone && nav) {
      bottone.addEventListener("click", function () {
        var aperto = nav.classList.toggle("aperto");
        bottone.setAttribute("aria-expanded", aperto ? "true" : "false");
      });
    }
  }

  function riempiSegnaposto() {
    var a = D.associazione || {};
    els("[data-testo]").forEach(function (nodo) {
      var chiave = nodo.getAttribute("data-testo");
      var valori = {
        anno: new Date().getFullYear(),
        aggiornato: dataEstesa(D.aggiornato),
        email: a.email,
        iban: a.iban,
        sede: a.sede,
        codiceFiscale: a.codiceFiscale,
        runts: a.runts,
        presidente: a.presidente,
        vicePresidente: a.vicePresidente,
        sociFondatori: a.sociFondatori,
        notaKpi: (D.kpi || {}).nota
      };
      if (valori[chiave] !== undefined && valori[chiave] !== null && valori[chiave] !== "") {
        nodo.textContent = valori[chiave];
      }
    });
    els("[data-mailto]").forEach(function (nodo) {
      nodo.setAttribute("href", "mailto:" + (a.email || ""));
      if (!nodo.textContent.trim()) nodo.textContent = a.email || "";
    });
  }

  /* --------------------------------- Avvio ------------------------------ */

  var BLOCCHI = {
    "kpi": renderKpi,
    "tempo": renderTempo,
    "archivio": renderArchivio,
    "progetti": renderProgetti,
    "linee": renderLinee,
    "partner": renderPartner,
    "stato-messaggio": renderStatoMessaggio,
    "degustazione": renderDegustazione
  };

  function avvia() {
    collegaNavigazione();
    riempiSegnaposto();
    collegaModuli();
    els("[data-blocco]").forEach(function (nodo) {
      var fn = BLOCCHI[nodo.getAttribute("data-blocco")];
      if (fn) {
        try { fn(nodo); }
        catch (e) { console.error("Silicious — errore nel blocco", nodo.getAttribute("data-blocco"), e); }
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", avvia);
  } else {
    avvia();
  }
})();
