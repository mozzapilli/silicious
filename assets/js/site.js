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

  function trovaMessaggio(nodo) {
    var n = parseInt(nodo.getAttribute("data-messaggio"), 10);
    return (D.messaggi || []).filter(function (x) { return x.numero === n; })[0];
  }

  function renderStatoMessaggio(nodo) {
    var m = trovaMessaggio(nodo);
    if (!m) { nodo.innerHTML = ""; return; }
    nodo.innerHTML = barraMessaggio(m);
  }

  /* --------------------------- L'ampolla che si riempie -----------------
     Il disegno non rappresenta il livello del vino — l'ampolla è piena dal
     primo giorno — ma il tempo trascorso della fase in corso: si riempie via
     via che ci si avvicina alla fine dell'affinamento.                     */

  var ALTEZZA_UTILE = 190;   // dalla base della sfera alla sommità del collo
  var BASE_Y = 256;

  function renderAmpolla(nodo) {
    var m = trovaMessaggio(nodo);
    if (!m) { nodo.innerHTML = ""; return; }
    var f = faseCorrente(m);
    var p = m.stato === "concluso" ? 100 : percentuale(f.da, f.a);
    var colore = m.coloreVino || "#7C1E2B";
    var salita = ALTEZZA_UTILE * (1 - p / 100);

    nodo.innerHTML =
      '<div class="ampolla">' +
        '<svg viewBox="0 0 220 300" role="img" aria-label="Disegno dell\'ampolla riempita per ' +
            Math.round(p) + ' per cento, a rappresentare il tempo trascorso">' +
          "<defs>" +
            '<clipPath id="dentro-ampolla">' +
              '<rect x="88" y="66" width="44" height="50"/>' +
              '<circle cx="110" cy="182" r="74"/>' +
            "</clipPath>" +
          "</defs>" +

          /* Il vino, ritagliato dentro la sagoma. Quanto scende il blocco rispetto
             al bordo superiore è scritto in --salita: da lì il CSS ricava sia la
             posizione finale sia l'animazione di riempimento. */
          '<g clip-path="url(#dentro-ampolla)">' +
            '<rect class="livello" x="20" y="66" width="180" height="' + ALTEZZA_UTILE + '" ' +
                  'fill="' + esc(colore) + '" style="--salita:' + salita.toFixed(1) + 'px"/>' +
            '<rect class="livello pelo" x="20" y="66" width="180" height="3" ' +
                  'style="--salita:' + salita.toFixed(1) + 'px"/>' +
          "</g>" +

          /* il vetro */
          '<circle class="vetro" cx="110" cy="182" r="74"/>' +
          '<path class="vetro" d="M88 108 L88 66 L132 66 L132 108"/>' +
          '<ellipse class="acciaio" cx="110" cy="64" rx="34" ry="7"/>' +
          '<path class="acciaio" d="M104 62 L104 34 Q110 26 116 34 L116 62 Z"/>' +
          '<path class="sostegno" d="M74 240 L64 278 M110 256 L110 280 M146 240 L156 278"/>' +
          '<path class="riflesso" d="M72 150 Q66 182 80 212"/>' +
        "</svg>" +

        '<div class="ampolla-legenda">' +
          '<span class="ampolla-percento">' + Math.round(p) + "%</span>" +
          '<span class="ampolla-fase">' + esc(f.etichetta.toLowerCase()) + " · " +
            esc(f.daLabel.toLowerCase()) + " " + esc(meseAnno(f.da)) + "</span>" +
          (f.contoLabel
            ? '<span class="ampolla-manca">Mancano <strong>' + esc(mancano(f.a)) +
              "</strong> " + esc(f.contoLabel) + "</span>"
            : "") +
        "</div>" +
      "</div>";
  }

  /* ------------------------- L'azienda ospitante ------------------------ */

  function renderAzienda(nodo) {
    var m = trovaMessaggio(nodo);
    var a = m && m.aziendaInfo;
    if (!a) { nodo.innerHTML = ""; return; }

    var collegamenti = [
      { url: a.sito,      testo: "Sito dell'azienda" },
      { url: a.instagram, testo: "Instagram" },
      { url: a.facebook,  testo: "Facebook" },
      { url: a.consorzio, testo: "Scheda del Consorzio Chianti Classico" }
    ].filter(function (c) { return c.url; });

    nodo.innerHTML =
      '<div class="scheda azienda">' +
        '<span class="meta">Azienda ospitante</span>' +
        "<h3>" + esc(m.azienda) + "</h3>" +
        (m.vignaiolo ? "<p>Vignaiolo: <strong>" + esc(m.vignaiolo) + "</strong></p>" : "") +
        (a.indirizzo ? '<p class="guida">' + esc(a.indirizzo) + "</p>" : "") +
        (a.nota ? "<p>" + esc(a.nota) + "</p>" : "") +
        '<div class="piede collegamenti">' +
          collegamenti.map(function (c) {
            return '<a href="' + esc(c.url) + '" target="_blank" rel="noopener noreferrer">' +
              esc(c.testo) + "</a>";
          }).join("") +
        "</div>" +
      "</div>";
  }

  /* --------------------------------- Mappa ------------------------------
     La mappa si carica solo se il visitatore la chiede: finché non clicca,
     nessun dato parte verso server esterni.                                */

  var LEAFLET = {
    css: { url: "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
           sri: "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" },
    js:  { url: "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js",
           sri: "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" }
  };

  function renderMappa(nodo) {
    var m = trovaMessaggio(nodo);
    var mp = m && m.mappa;
    if (!mp || !mp.lat) { nodo.innerHTML = ""; return; }

    var osm = "https://www.openstreetmap.org/?mlat=" + mp.lat + "&mlon=" + mp.lon +
              "#map=" + (mp.zoom || 16) + "/" + mp.lat + "/" + mp.lon;

    nodo.innerHTML =
      '<div class="mappa-attesa">' +
        "<p><strong>" + esc(mp.etichetta || m.azienda) + "</strong><br>" +
          '<span class="guida piccolo">' + mp.lat.toFixed(5).replace(".", ",") + "° N — " +
          mp.lon.toFixed(5).replace(".", ",") + "° E</span></p>" +
        '<button class="btn" type="button">Mostra la mappa</button>' +
        '<p class="piccolo guida">La mappa è fornita da OpenStreetMap: si carica solo se la ' +
          "richiedi, e in quel momento il tuo indirizzo IP raggiunge i loro server. " +
          'In alternativa puoi <a href="' + esc(osm) + '" target="_blank" rel="noopener noreferrer">' +
          "aprire la posizione su OpenStreetMap</a>.</p>" +
      "</div>";

    el("button", nodo).addEventListener("click", function () {
      nodo.innerHTML = '<div class="mappa" id="mappa-' + m.numero + '"></div>' +
        '<p class="piccolo guida" style="margin-top:10px">Cartografia © contributori OpenStreetMap.</p>';
      caricaLeaflet(function () { disegnaMappa("mappa-" + m.numero, m); },
        function () {
          nodo.innerHTML = '<p class="vuoto">Non è stato possibile caricare la mappa. ' +
            '<a href="' + esc(osm) + '" target="_blank" rel="noopener noreferrer">' +
            "Apri la posizione su OpenStreetMap</a>.</p>";
        });
    });
  }

  function caricaLeaflet(ok, ko) {
    if (window.L) { ok(); return; }
    var css = document.createElement("link");
    css.rel = "stylesheet"; css.href = LEAFLET.css.url;
    css.integrity = LEAFLET.css.sri; css.crossOrigin = "anonymous";
    document.head.appendChild(css);

    var js = document.createElement("script");
    js.src = LEAFLET.js.url;
    js.integrity = LEAFLET.js.sri; js.crossOrigin = "anonymous";
    js.onload = ok; js.onerror = ko;
    document.head.appendChild(js);
  }

  function disegnaMappa(id, m) {
    var mp = m.mappa;
    var mappa = L.map(id, { scrollWheelZoom: false }).setView([mp.lat, mp.lon], mp.zoom || 16);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(mappa);

    L.circleMarker([mp.lat, mp.lon], {
      radius: 9, color: "#6B1F2E", weight: 2, fillColor: "#6B1F2E", fillOpacity: .85
    }).addTo(mappa).bindTooltip(mp.etichetta || m.azienda, { permanent: false });

    if (mp.vigna && mp.vigna.length > 2) {
      var poligono = L.polygon(mp.vigna, {
        color: "#6B1F2E", weight: 2, fillColor: "#A97B4F", fillOpacity: .35
      }).addTo(mappa).bindTooltip(m.titolo, { permanent: false });
      mappa.fitBounds(poligono.getBounds().pad(0.6));
    }
  }

  /* ------------------------ L'annata: dati meteo ------------------------ */

  function renderMeteo(nodo) {
    var m = trovaMessaggio(nodo);
    var w = m && m.meteo;
    if (!w) { nodo.innerHTML = ""; return; }

    var indici = (w.indici || []).map(function (i) {
      var confronto = "";
      if (i.media !== undefined && i.media !== null) {
        var su = i.valore > i.media;
        /* Su numeri piccoli la percentuale è fuorviante — undici giorni contro tre
           fanno "+267%", che suona enorme e dice poco. Meglio il dato nudo. */
        if (i.media >= 50) {
          var scarto = Math.round((i.valore - i.media) / i.media * 100);
          confronto = (scarto > 0 ? "+" : "") + scarto + "% " + (su ? "sopra" : "sotto") +
                      " la media di " + numero(i.media);
        } else {
          confronto = "contro una media di " + numero(i.media);
        }
        confronto = '<span class="scarto ' + (su ? "su" : "giu") + '">' + confronto + "</span>";
      }
      return '<div class="indice">' +
          '<span class="numero">' + numero(i.valore) +
            (i.unita ? ' <small>' + esc(i.unita) + "</small>" : "") + "</span>" +
          '<span class="etichetta">' + esc(i.etichetta) + "</span>" +
          confronto +
        "</div>";
    }).join("");

    nodo.innerHTML =
      '<div class="griglia griglia-3 indici">' + indici + "</div>" +
      graficoMensile(w) +
      '<div class="racconto-annata">' +
        (w.racconto || []).map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("") +
      "</div>" +
      '<p class="piccolo guida fonte-dati"><strong>Fonte dei dati:</strong> ' + esc(w.fonte) +
        " Periodo considerato: " + esc(w.periodo) + "; confronto con la " + esc(w.riferimento) + ".</p>";
  }

  function graficoMensile(w) {
    var dati = w.mensili || [];
    if (!dati.length) return "";

    var W = 680, H = 300, ML = 44, MR = 44, MT = 20, MB = 46;
    var larghezza = W - ML - MR, altezza = H - MT - MB;
    var passo = larghezza / dati.length;

    var maxP = Math.max.apply(null, dati.map(function (d) {
      return Math.max(d.pioggia, d.pioggiaMedia); }));
    maxP = Math.ceil(maxP / 25) * 25;
    var maxT = 30;

    var yP = function (v) { return MT + altezza - (v / maxP) * altezza; };
    var yT = function (v) { return MT + altezza - (v / maxT) * altezza; };

    var barre = dati.map(function (d, i) {
      var x = ML + i * passo;
      var largaMedia = passo * 0.30, larga = passo * 0.30;
      return '<rect class="barra-media" x="' + (x + passo * 0.16) + '" y="' + yP(d.pioggiaMedia) +
               '" width="' + largaMedia + '" height="' + (MT + altezza - yP(d.pioggiaMedia)) + '"/>' +
             '<rect class="barra-anno" x="' + (x + passo * 0.50) + '" y="' + yP(d.pioggia) +
               '" width="' + larga + '" height="' + (MT + altezza - yP(d.pioggia)) + '"/>' +
             '<text class="etichetta-x" x="' + (x + passo / 2) + '" y="' + (MT + altezza + 20) +
               '">' + esc(d.mese) + "</text>";
    }).join("");

    var punti = function (chiave) {
      return dati.map(function (d, i) {
        return (ML + i * passo + passo / 2).toFixed(1) + "," + yT(d[chiave]).toFixed(1);
      }).join(" ");
    };

    var pallini = dati.map(function (d, i) {
      return '<circle class="punto-temp" cx="' + (ML + i * passo + passo / 2) +
             '" cy="' + yT(d.temp) + '" r="3.5"/>';
    }).join("");

    var tacche = "";
    for (var v = 0; v <= maxP; v += maxP / 4) {
      tacche += '<line class="griglia-linea" x1="' + ML + '" y1="' + yP(v) + '" x2="' + (W - MR) +
                '" y2="' + yP(v) + '"/>' +
                '<text class="tacca" x="' + (ML - 8) + '" y="' + (yP(v) + 4) + '" text-anchor="end">' +
                v + "</text>";
    }
    for (var t = 0; t <= maxT; t += 10) {
      tacche += '<text class="tacca destra" x="' + (W - MR + 8) + '" y="' + (yT(t) + 4) + '">' +
                t + "</text>";
    }

    return '<figure class="grafico">' +
        '<svg viewBox="0 0 ' + W + " " + H + '" role="img" ' +
          'aria-label="Pioggia mensile del 2025 confrontata con la media 1995-2024 e temperatura media mensile del 2025">' +
          tacche + barre +
          '<polyline class="linea-temp" points="' + punti("temp") + '"/>' + pallini +
        "</svg>" +
        '<figcaption class="legenda-grafico">' +
          '<span><i class="chiave media"></i>Pioggia, media 1995–2024 (mm)</span>' +
          '<span><i class="chiave anno"></i>Pioggia 2025 (mm)</span>' +
          '<span><i class="chiave temp"></i>Temperatura media 2025 (°C, scala a destra)</span>' +
        "</figcaption>" +
      "</figure>";
  }

  function renderDegustazione(nodo) {
    var m = trovaMessaggio(nodo);
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
    "ampolla": renderAmpolla,
    "azienda": renderAzienda,
    "mappa": renderMappa,
    "meteo": renderMeteo,
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
