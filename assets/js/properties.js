/* =========================================================================
   Aurelia Properties — Listings engine
   Renders, filters and sorts the property collection, and drives the
   dynamic property detail page.
   ========================================================================= */
(function () {
  "use strict";

  const AURELIA = (window.AURELIA = window.AURELIA || {});
  const D = () => AURELIA.data;
  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));

  const TYPE_ORDER = { house: 0, townhouse: 1, condo: 2, loft: 3, "multi-family": 4, apartment: 5 };

  /* ----------------------------------------------------------------------
     Card markup
     ---------------------------------------------------------------------- */
  function cardHTML(p) {
    const statusBadge = {
      "for-sale": '<span class="badge badge--sale">For Sale</span>',
      pending: '<span class="badge badge--pending">Pending</span>',
      sold: '<span class="badge badge--sold">Sold</span>',
      rent: '<span class="badge badge--rent">For Rent</span>'
    }[p.status] || "";

    const newBadge = p.newListing ? '<span class="badge badge--new">New</span>' : "";
    const featBadge = p.featured ? '<span class="badge badge--feature">Featured</span>' : "";

    const price = p.status === "rent" ? AURELIA.formatRent(p.price) : AURELIA.formatPrice(p.price);

    const beds = p.beds > 0
      ? '<span>' + AURELIA.icon("bed", 15) + "<b>" + p.beds + "</b> bed" + (p.beds === 1 ? "" : "s") + "</span>"
      : '<span>' + AURELIA.icon("sofa", 15) + "<b>Studio</b></span>";

    return (
      '<article class="card" data-id="' + p.id + '">' +
        '<div class="card__media">' +
          '<a href="property.html?id=' + p.id + '" aria-label="View ' + escapeHTML(p.title) + '">' +
            '<img src="' + p.images[0] + '" alt="' + escapeHTML(p.title) + " — " + escapeHTML(p.address) + '" loading="lazy" width="600" height="400">' +
          "</a>" +
          '<div class="card__badges">' + statusBadge + newBadge + featBadge + "</div>" +
          '<button class="card__fav" data-fav-btn="' + p.id + '" data-fav-label="' + escapeHTML(p.title) + '" aria-pressed="false" aria-label="Save ' + escapeHTML(p.title) + ' to shortlist">' +
            AURELIA.icon("heart", 19) +
          "</button>" +
        "</div>" +
        '<div class="card__body">' +
          '<div class="card__price">' + price + "</div>" +
          '<h3 class="card__title"><a href="property.html?id=' + p.id + '">' + escapeHTML(p.title) + "</a></h3>" +
          '<div class="card__addr">' + AURELIA.icon("pin", 14) + escapeHTML(p.address) + ", " + escapeHTML(p.city) + "</div>" +
          '<div class="card__specs">' +
            beds +
            '<span>' + AURELIA.icon("bath", 15) + "<b>" + p.baths + "</b> baths</span>" +
            '<span>' + AURELIA.icon("area", 15) + "<b>" + AURELIA.formatNumber(p.sqft) + "</b> sqft</span>" +
            '<span class="card__type">' + AURELIA.typeLabel(p.type) + "</span>" +
          "</div>" +
        "</div>" +
      "</article>"
    );
  }

  function escapeHTML(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  /* ----------------------------------------------------------------------
     Filtering + sorting
     ---------------------------------------------------------------------- */
  function readFilters() {
    const q = new URLSearchParams(location.search);
    return {
      q: (q.get("q") || "").toLowerCase().trim(),
      type: q.get("type") || "any",
      minPrice: parseInt(q.get("min"), 10) || 0,
      maxPrice: parseInt(q.get("max"), 10) || 0,
      beds: parseInt(q.get("beds"), 10) || 0,
      baths: parseFloat(q.get("baths")) || 0,
      status: q.get("status") || "any",
      sort: q.get("sort") || "featured",
      view: q.get("view") || "grid",
      favouritesOnly: q.get("view") === "favourites"
    };
  }

  function applyFilters(list, f) {
    return list.filter((p) => {
      if (f.favouritesOnly && !AURELIA.favourites.has(p.id)) return false;
      if (f.type !== "any" && p.type !== f.type) return false;
      if (f.status !== "any" && p.status !== f.status) return false;
      if (f.beds && p.beds < f.beds) return false;
      if (f.baths && p.baths < f.baths) return false;
      if (f.minPrice && p.price < f.minPrice) return false;
      if (f.maxPrice && p.price > f.maxPrice) return false;
      if (f.q) {
        const hay = [p.title, p.address, p.city, p.state, p.zip, p.type, p.summary, (p.features || []).join(" ")]
          .join(" ")
          .toLowerCase();
        if (hay.indexOf(f.q) === -1) return false;
      }
      return true;
    });
  }

  function sortList(list, sort) {
    const out = list.slice();
    switch (sort) {
      case "price-asc":  out.sort((a, b) => a.price - b.price); break;
      case "price-desc": out.sort((a, b) => b.price - a.price); break;
      case "size-desc":  out.sort((a, b) => b.sqft - a.sqft); break;
      case "beds-desc":  out.sort((a, b) => b.beds - a.beds || b.sqft - a.sqft); break;
      case "newest":     out.sort((a, b) => (b.newListing ? 1 : 0) - (a.newListing ? 1 : 0) || b.yearBuilt - a.yearBuilt); break;
      default:
        out.sort((a, b) => {
          const fa = a.featured ? 0 : 1;
          const fb = b.featured ? 0 : 1;
          if (fa !== fb) return fa - fb;
          const ta = TYPE_ORDER[a.type] == null ? 9 : TYPE_ORDER[a.type];
          const tb = TYPE_ORDER[b.type] == null ? 9 : TYPE_ORDER[b.type];
          if (ta !== tb) return ta - tb;
          return b.price - a.price;
        });
    }
    return out;
  }

  /* ----------------------------------------------------------------------
     Properties index page
     ---------------------------------------------------------------------- */
  function initIndex() {
    const root = $("[data-properties]");
    if (!root) return;

    const all = D().properties;
    const results = $("[data-results]");
    const countEl = $("[data-result-count]");
    const emptyEl = $("[data-empty]");
    const gridWrap = $("[data-grid]");
    const listWrap = $("[data-list]");
    const sortSel = $("[data-sort]");
    const searchInput = $("[data-filter-q]");
    const clearBtn = $("[data-filter-clear]");

    const f = readFilters();
    let current = f;

    // Seed the controls from the URL
    if (searchInput) searchInput.value = f.q;
    if (sortSel) sortSel.value = f.sort;
    $$("[data-filter-type]").forEach((el) => {
      el.value = f.type;
      el.addEventListener("change", () => {
        current = Object.assign({}, current, { type: el.value });
        render();
      });
    });
    $$("[data-filter-beds]").forEach((el) => {
      el.value = String(f.beds);
      el.addEventListener("change", () => {
        current = Object.assign({}, current, { beds: parseInt(el.value, 10) || 0 });
        render();
      });
    });
    $$("[data-filter-status]").forEach((el) => {
      el.value = f.status;
      el.addEventListener("change", () => {
        current = Object.assign({}, current, { status: el.value });
        render();
      });
    });
    $$("[data-filter-min]").forEach((el) => {
      el.value = f.minPrice || "";
      el.addEventListener("change", () => {
        current = Object.assign({}, current, { minPrice: parseInt(el.value, 10) || 0 });
        render();
      });
    });
    $$("[data-filter-max]").forEach((el) => {
      el.value = f.maxPrice || "";
      el.addEventListener("change", () => {
        current = Object.assign({}, current, { maxPrice: parseInt(el.value, 10) || 0 });
        render();
      });
    });
    $$("[data-filter-baths]").forEach((el) => {
      el.value = String(f.baths);
      el.addEventListener("change", () => {
        current = Object.assign({}, current, { baths: parseFloat(el.value) || 0 });
        render();
      });
    });

    if (searchInput) {
      let debounce;
      searchInput.addEventListener("input", () => {
        clearTimeout(debounce);
        debounce = setTimeout(() => {
          current = Object.assign({}, current, { q: searchInput.value.toLowerCase().trim() });
          render();
        }, 220);
      });
    }

    if (sortSel) {
      sortSel.addEventListener("change", () => {
        current = Object.assign({}, current, { sort: sortSel.value });
        render();
      });
    }

    // View toggle
    const setView = (view) => {
      current = Object.assign({}, current, { view });
      $$("[data-view-btn]").forEach((b) => b.setAttribute("aria-pressed", String(b.getAttribute("data-view-btn") === view)));
      if (gridWrap) gridWrap.classList.toggle("hidden", view !== "grid");
      if (listWrap) listWrap.classList.toggle("hidden", view !== "list");
    };
    $$("[data-view-btn]").forEach((b) => {
      b.addEventListener("click", () => setView(b.getAttribute("data-view-btn")));
    });

    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        current = { q: "", type: "any", minPrice: 0, maxPrice: 0, beds: 0, baths: 0, status: "any", sort: "featured", view: current.view, favouritesOnly: false };
        if (searchInput) searchInput.value = "";
        $$("[data-filter-type]").forEach((el) => (el.value = "any"));
        $$("[data-filter-beds]").forEach((el) => (el.value = "0"));
        $$("[data-filter-status]").forEach((el) => (el.value = "any"));
        $$("[data-filter-min]").forEach((el) => (el.value = ""));
        $$("[data-filter-max]").forEach((el) => (el.value = ""));
        $$("[data-filter-baths]").forEach((el) => (el.value = "0"));
        if (sortSel) sortSel.value = "featured";
        render();
      });
    }

    function render() {
      const filtered = applyFilters(all, current);
      const sorted = sortList(filtered, current.sort);
      const shown = current.favouritesOnly ? sorted : sorted;

      if (gridWrap) gridWrap.innerHTML = shown.map(cardHTML).join("");
      if (listWrap) listWrap.innerHTML = shown.map(cardHTML).join("");

      const n = shown.length;
      if (countEl) {
        countEl.innerHTML = "<b>" + n + "</b> " + (n === 1 ? "property" : "properties") +
          (current.favouritesOnly ? " on your shortlist" : " available");
      }
      if (results) results.setAttribute("data-count", String(n));
      if (emptyEl) emptyEl.classList.toggle("hidden", n !== 0);

      // Keep the URL shareable
      const params = new URLSearchParams();
      if (current.q) params.set("q", current.q);
      if (current.type !== "any") params.set("type", current.type);
      if (current.minPrice) params.set("min", current.minPrice);
      if (current.maxPrice) params.set("max", current.maxPrice);
      if (current.beds) params.set("beds", current.beds);
      if (current.baths) params.set("baths", current.baths);
      if (current.status !== "any") params.set("status", current.status);
      if (current.sort !== "featured") params.set("sort", current.sort);
      if (current.view !== "grid") params.set("view", current.view);
      history.replaceState(null, "", location.pathname + (params.toString() ? "?" + params.toString() : ""));

      AURELIA.favourites.sync();
      setView(current.view);
    }

    setView(f.view);
    render();
  }

  /* ----------------------------------------------------------------------
     Property detail page
     ---------------------------------------------------------------------- */
  function initDetail() {
    const root = $("[data-detail]");
    if (!root) return;

    const params = new URLSearchParams(location.search);
    const id = params.get("id");
    const p = AURELIA.propertyById(id);

    if (!p) {
      const main = $("[data-detail-missing]");
      if (main) {
        main.classList.remove("hidden");
        main.removeAttribute("hidden");
      }
      root.classList.add("hidden");
      root.setAttribute("hidden", "");
      return;
    }

    const isRental = p.status === "rent";
    const price = isRental ? AURELIA.formatRent(p.price) : AURELIA.formatPrice(p.price);

    document.title = p.title + " — Aurelia Properties";
    const metaDesc = $('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", p.summary);

    /* --- gallery --- */
    const gallery = $("[data-gallery]");
    if (gallery) {
      const main = p.images[0];
      const thumbs = p.images.slice(1, 4);
      gallery.innerHTML =
        '<div class="gallery__main">' +
          '<img id="gallery-main-img" src="' + main + '" alt="' + escapeHTML(p.title) + '" width="1200" height="800">' +
          '<button class="gallery__expand" data-gallery-expand>' + AURELIA.icon("camera", 16) + " View all photos</button>" +
        "</div>" +
        '<div class="gallery__thumbs">' +
          thumbs.map((src, i) =>
            '<button class="gallery__thumb" data-gallery-thumb="' + src + '" aria-label="View photo ' + (i + 2) + '">' +
              '<img src="' + src + '" alt="' + escapeHTML(p.title) + " photo " + (i + 2) + '" loading="lazy" width="600" height="400">' +
            "</button>"
          ).join("") +
        "</div>";

      const mainImg = $("#gallery-main-img", gallery);
      $$("[data-gallery-thumb]", gallery).forEach((t) => {
        t.addEventListener("click", () => {
          mainImg.src = t.getAttribute("data-gallery-thumb");
        });
      });
      $("[data-gallery-expand]", gallery).addEventListener("click", () => {
        AURELIA.openLightbox(p.images, 0, p.title);
      });
    }

    /* --- header --- */
    const head = $("[data-detail-head]");
    if (head) {
      const badge = isRental
        ? '<span class="badge badge--rent">For Rent</span>'
        : p.status === "pending"
          ? '<span class="badge badge--pending">Sale Pending</span>'
          : '<span class="badge badge--sale">For Sale</span>';

      head.innerHTML =
        '<div>' +
          '<div class="flex gap-2 items-center flex-wrap mb-0">' + badge +
            (p.newListing ? '<span class="badge badge--new">New Listing</span>' : "") +
            (p.featured ? '<span class="badge badge--feature">Featured</span>' : "") +
          "</div>" +
          "<h1>" + escapeHTML(p.title) + "</h1>" +
          '<div class="detail-head__meta">' +
            "<span>" + AURELIA.icon("pin", 15) + escapeHTML(p.address) + ", " + escapeHTML(p.city) + ", " + escapeHTML(p.state) + " " + escapeHTML(p.zip) + "</span>" +
            "<span>" + AURELIA.icon("calendar", 15) + "Listed March 2026</span>" +
            "<span>" + AURELIA.icon("tag", 15) + "DRE #01884421</span>" +
          "</div>" +
        "</div>" +
        '<div class="text-c" style="text-align:right">' +
          '<div class="detail-head__price">' + price + "</div>" +
          (isRental ? "" : '<div class="muted tiny mt-4">Est. $' + Math.round(p.price * 0.0062).toLocaleString("en-US") + "/mo with 20% down</div>") +
          '<div class="flex gap-2 mt-4" style="justify-content:flex-end;flex-wrap:wrap">' +
            '<button class="btn btn--ghost btn--sm" data-fav-btn="' + p.id + '" data-fav-label="' + escapeHTML(p.title) + '" aria-pressed="false">' +
              AURELIA.icon("heart", 16) + " <span>Shortlist</span></button>" +
            '<button class="btn btn--clay btn--sm" data-scroll="#detail-enquiry">Schedule a viewing</button>' +
          "</div>" +
        "</div>";
    }

    /* --- key specs --- */
    const specs = $("[data-detail-specs]");
    if (specs) {
      specs.innerHTML =
        '<div><dt>Bedrooms</dt><dd>' + (p.beds > 0 ? p.beds : "Studio") + "</dd></div>" +
        '<div><dt>Bathrooms</dt><dd>' + p.baths + "</dd></div>" +
        '<div><dt>Interior</dt><dd>' + AURELIA.formatNumber(p.sqft) + " sqft</dd></div>" +
        '<div><dt>Lot</dt><dd>' + escapeHTML(p.lot) + "</dd></div>" +
        '<div><dt>Year built</dt><dd>' + p.yearBuilt + "</dd></div>" +
        '<div><dt>Parking</dt><dd>' + p.parking + " car" + (p.parking === 1 ? "" : "s") + "</dd></div>" +
        '<div><dt>Property type</dt><dd>' + AURELIA.typeLabel(p.type) + "</dd></div>" +
        '<div><dt>HOA dues</dt><dd>' + (p.hoa ? "$" + p.hoa + "/mo" : "None") + "</dd></div>";
    }

    /* --- description --- */
    const desc = $("[data-detail-description]");
    if (desc) {
      desc.innerHTML =
        '<p class="lede">' + escapeHTML(p.summary) + "</p>" +
        "<p>" + escapeHTML(p.description) + "</p>";
    }

    /* --- amenities --- */
    const amen = $("[data-detail-amenities]");
    if (amen) {
      amen.innerHTML = (p.amenities || [])
        .map((a) => "<li>" + AURELIA.icon("check", 16) + "<span>" + escapeHTML(a) + "</span></li>")
        .join("");
    }

    /* --- features / schools --- */
    const feats = $("[data-detail-features]");
    if (feats && p.features) {
      feats.innerHTML = p.features
        .map((f) => '<span class="chip">' + escapeHTML(f) + "</span>")
        .join("");
    }
    const schools = $("[data-detail-schools]");
    if (schools && p.schools) {
      schools.innerHTML = p.schools.map((s) => "<li>" + AURELIA.icon("sparkle", 16) + "<span>" + escapeHTML(s) + "</span></li>").join("");
    }

    /* --- agent --- */
    const agent = D().team.find((m) => m.id === p.agent);
    const agentBox = $("[data-detail-agent]");
    if (agentBox && agent) {
      agentBox.innerHTML =
        '<img src="' + agent.image + '" alt="' + escapeHTML(agent.name) + '" width="144" height="144">' +
        "<div>" +
          "<strong>" + escapeHTML(agent.name) + "</strong>" +
          "<span>" + escapeHTML(agent.role) + " · " + escapeHTML(agent.licence) + "</span>" +
          '<div class="flex gap-2 mt-4 flex-wrap">' +
            '<a class="btn btn--ghost btn--sm" href="tel:' + agent.phone.replace(/[^+\d]/g, "") + '">' + AURELIA.icon("phone", 15) + " Call</a>" +
            '<a class="btn btn--ghost btn--sm" href="' + agent.email.replace(/^mailto:/, "mailto:") + '">' + AURELIA.icon("mail", 15) + " Email</a>" +
          "</div>" +
        "</div>";
    }

    /* --- calculator defaults --- */
    const calcPrice = $("[data-calc-price]");
    if (calcPrice) {
      calcPrice.value = p.price;
      calcPrice.dispatchEvent(new Event("input"));
    }
    const calcHidden = $("[data-calc-value]");
    if (calcHidden) calcHidden.value = p.price;

    /* --- enquiry form defaults --- */
    const subject = $("[data-enquiry-property]");
    if (subject) subject.value = p.title + " — " + p.address;
    const hiddenId = $("[data-enquiry-id]");
    if (hiddenId) hiddenId.value = p.id;

    /* --- similar listings --- */
    const similar = $("[data-similar]");
    if (similar) {
      const pool = D().properties
        .filter((x) => x.id !== p.id)
        .map((x) => {
          let score = 0;
          if (x.type === p.type) score += 3;
          if (x.city === p.city) score += 2;
          score += Math.max(0, 3 - Math.abs(Math.log((x.price || 1) / (p.price || 1))) * 2);
          score += Math.max(0, 2 - Math.abs(x.beds - p.beds));
          return { x, score };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map((r) => r.x);

      similar.innerHTML = pool.map(cardHTML).join("");
    }

    AURELIA.favourites.sync();
  }

  /* ----------------------------------------------------------------------
     Mortgage calculator
     ---------------------------------------------------------------------- */
  function initCalculator() {
    const root = $("[data-calc]");
    if (!root) return;

    const price = $("[data-calc-price]", root);
    const down = $("[data-calc-down]", root);
    const downPct = $("[data-calc-down-pct]", root);
    const rate = $("[data-calc-rate]", root);
    const term = $("[data-calc-term]", root);
    const tax = $("[data-calc-tax]", root);
    const ins = $("[data-calc-ins]", root);

    const outPrincipal = $("[data-out-principal]", root);
    const outInterest = $("[data-out-interest]", root);
    const outTax = $("[data-out-tax]", root);
    const outInsurance = $("[data-out-insurance]", root);
    const outTotal = $("[data-out-total]", root);
    const outRate = $("[data-out-rate]", root);

    function money(n) {
      return "$" + Math.round(n).toLocaleString("en-US");
    }

    function compute() {
      const p = Number(price.value) || 0;
      let d = Number(down.value) || 0;
      if (downPct) {
        d = Math.round((p * Number(downPct.value)) / 100);
        down.value = d;
      }
      const r = (Number(rate.value) || 0) / 100 / 12;
      const n = (Number(term.value) || 30) * 12;
      const loan = Math.max(0, p - d);

      const payment = r > 0 ? (loan * r) / (1 - Math.pow(1 + r, -n)) : loan / n;
      const totalInterest = payment * n - loan;

      const annualTax = (Number(tax.value) || 0) / 100 * p / 12;
      const annualIns = (Number(ins.value) || 0) / 100 * p / 12;
      const total = payment + annualTax + annualIns;

      if (outPrincipal) outPrincipal.textContent = money(p);
      if (outInterest) outInterest.textContent = money(totalInterest);
      if (outTax) outTax.textContent = money(annualTax * 12);
      if (outInsurance) outInsurance.textContent = money(annualIns * 12);
      if (outTotal) outTotal.textContent = money(total);
      if (outRate) {
        outRate.textContent =
          "Principal & interest " + money(payment) + "  ·  Tax " + money(annualTax) +
          "  ·  Insurance " + money(annualIns);
      }
    }

    [price, down, downPct, rate, term, tax, ins].forEach((el) => {
      if (el) el.addEventListener("input", compute);
      if (el) el.addEventListener("change", compute);
    });

    // Keep the down-payment field and percentage in sync
    if (down && downPct && price) {
      down.addEventListener("input", () => {
        const p = Number(price.value) || 0;
        downPct.value = p ? Math.min(100, Math.round((Number(down.value) / p) * 100)) : 0;
      });
      downPct.addEventListener("input", () => {
        const p = Number(price.value) || 0;
        down.value = Math.round((p * Number(downPct.value)) / 100);
      });
    }

    compute();
  }

  /* ----------------------------------------------------------------------
     Home page: featured listings + neighbourhood tiles
     ---------------------------------------------------------------------- */
  function initHome() {
    const feat = $("[data-featured]");
    if (feat) {
      const list = D().properties.filter((p) => p.featured).slice(0, 6);
      feat.innerHTML = list.map(cardHTML).join("");
    }

    const latest = $("[data-latest]");
    if (latest) {
      const list = D().properties.slice().sort((a, b) => b.yearBuilt - a.yearBuilt).slice(0, 3);
      latest.innerHTML = list.map(cardHTML).join("");
    }

    const hoods = $("[data-neighborhoods]");
    if (hoods) {
      hoods.innerHTML = D().neighborhoods
        .map(
          (n) =>
            '<a class="tile" href="neighborhoods.html#' + n.slug + '">' +
              '<div class="tile__media"><img src="' + n.image + '" alt="' + escapeHTML(n.name) + '" loading="lazy" width="600" height="450"></div>' +
              '<div class="tile__body">' +
                '<h3 class="tile__title">' + escapeHTML(n.name) + "</h3>" +
                '<p class="tile__text">' + escapeHTML(n.tagline) + "</p>" +
                '<div class="card__specs mt-4"><span>Median <b>' + escapeHTML(n.stats.median) + "</b></span>" +
                '<span>Walk <b>' + n.stats.walk + "</b></span>" +
                '<span>Schools <b>' + n.stats.school + "/10</b></span></div>" +
              "</div>" +
            "</a>"
        )
        .join("");
    }

    const rentals = $("[data-rentals]");
    if (rentals) {
      rentals.innerHTML = D().rentals
        .map(
          (r) =>
            '<article class="card">' +
              '<div class="card__media">' +
                '<img src="' + r.images[0] + '" alt="' + escapeHTML(r.title) + '" loading="lazy" width="600" height="400">' +
                '<div class="card__badges"><span class="badge badge--rent">For Rent</span></div>' +
              "</div>" +
              '<div class="card__body">' +
                '<div class="card__price">' + AURELIA.formatRent(r.rent) + "</div>" +
                '<h3 class="card__title">' + escapeHTML(r.title) + "</h3>" +
                '<div class="card__addr">' + AURELIA.icon("pin", 14) + escapeHTML(r.address) + ", " + escapeHTML(r.city) + "</div>" +
                '<p class="muted tiny mt-4">' + escapeHTML(r.summary) + "</p>" +
                '<div class="card__specs">' +
                  "<span>" + (r.beds > 0 ? "<b>" + r.beds + "</b> bed" + (r.beds === 1 ? "" : "s") : "<b>Studio</b>") + "</span>" +
                  "<span><b>" + r.baths + "</b> bath" + (r.baths === 1 ? "" : "s") + "</span>" +
                  "<span><b>" + AURELIA.formatNumber(r.sqft) + "</b> sqft</span>" +
                "</div>" +
              "</div>" +
            "</article>"
        )
        .join("");
    }
  }

  /* ----------------------------------------------------------------------
     Services page renderer
     ---------------------------------------------------------------------- */
  function initServices() {
    const root = $("[data-services]");
    const nav = $("[data-services-nav]");
    const body = $("[data-services-body]");

    if (!root && !nav && !body) return;

    const icons = {
      search: "search", tag: "tag", chart: "chart",
      compass: "compass", key: "key"
    };

    if (root) {
      root.innerHTML = D().services
        .map(
          (s) =>
            '<article class="feature" data-reveal id="service-' + s.slug + '">' +
              '<div class="feature__icon">' + AURELIA.icon(icons[s.icon] || "home", 25) + "</div>" +
              "<h3>" + escapeHTML(s.title) + "</h3>" +
              '<p class="mb-0">' + escapeHTML(s.short) + "</p>" +
            "</article>"
        )
        .join("");
    }

    if (nav) {
      nav.innerHTML = D().services
        .map(
          (s) =>
            '<a class="chip" href="#detail-service-' + s.slug + '">' + escapeHTML(s.title) + "</a>"
        )
        .join("");
    }

    if (body) {
      body.innerHTML = D().services
        .map(
          (s) =>
            '<div class="split" id="detail-service-' + s.slug + '" style="padding-block:var(--sp-6);border-bottom:1px solid var(--line)">' +
              "<div>" +
                '<span class="eyebrow">Service</span>' +
                "<h2>" + escapeHTML(s.title) + "</h2>" +
                "<p>" + escapeHTML(s.body) + "</p>" +
              "</div>" +
              '<div class="panel panel--sand">' +
                '<h4 class="mb-0">What is included</h4>' +
                '<ul class="checklist mt-4">' +
                  s.points.map((pt) => "<li><span>" + escapeHTML(pt) + "</span></li>").join("") +
                "</ul>" +
              "</div>" +
            "</div>"
        )
        .join("");
    }
  }

  /* ----------------------------------------------------------------------
     Team + testimonials + posts renderers
     ---------------------------------------------------------------------- */
  function initTeam() {
    const root = $("[data-team]");
    if (!root) return;
    root.innerHTML = D().team
      .map(
        (m) =>
          '<div class="team-card" data-reveal>' +
            '<img src="' + m.image + '" alt="' + escapeHTML(m.name) + '" loading="lazy" width="400" height="400">' +
            "<h3>" + escapeHTML(m.name) + "</h3>" +
            '<div class="team-card__role">' + escapeHTML(m.role) + "</div>" +
            "<p>" + escapeHTML(m.bio) + "</p>" +
            '<div class="flex gap-2 mt-4" style="justify-content:center;flex-wrap:wrap">' +
              '<a class="btn btn--ghost btn--sm" href="mailto:' + m.email + '">Email</a>' +
            "</div>" +
          "</div>"
      )
      .join("");
  }

  function initTestimonials() {
    const root = $("[data-testimonials]");
    if (!root) return;
    root.innerHTML = D().testimonials
      .map(
        (t) =>
          '<figure class="slider__item">' +
            "<p>“" + escapeHTML(t.quote) + "”</p>" +
            '<figcaption class="slider__person">' +
              '<img class="slider__avatar" src="' + t.image + '" alt="" width="108" height="108" loading="lazy">' +
              "<div><strong>" + escapeHTML(t.name) + "</strong><span>" + escapeHTML(t.detail) + "</span></div>" +
            "</figcaption>" +
          "</figure>"
      )
      .join("");
  }

  function initPosts() {
    const root = $("[data-posts]");
    if (!root) return;

    const cat = new URLSearchParams(location.search).get("cat");
    let list = D().posts.slice();
    if (cat && cat !== "all") list = list.filter((p) => p.category === cat);

    root.innerHTML = list
      .map(
        (p) =>
          '<article class="post">' +
            '<a href="post.html?slug=' + p.slug + '"><img src="' + p.image + '" alt="" loading="lazy" width="440" height="330"></a>' +
            "<div>" +
              '<div class="post__meta"><span class="badge">' + escapeHTML(p.category) + "</span>" +
              "<span>" + escapeHTML(formatDate(p.date)) + "</span>" +
              "<span>" + escapeHTML(p.readTime) + " read</span>" +
              "<span>By " + escapeHTML(p.author) + "</span></div>" +
              "<h3><a href=\"post.html?slug=" + p.slug + '">' + escapeHTML(p.title) + "</a></h3>" +
              "<p>" + escapeHTML(p.excerpt) + "</p>" +
              '<a class="link-arrow mt-4" href="post.html?slug=' + p.slug + '">Read the piece</a>' +
            "</div>" +
          "</article>"
      )
      .join("");

    const cats = $("[data-post-cats]");
    if (cats) {
      const unique = Array.from(new Set(D().posts.map((p) => p.category)));
      cats.innerHTML =
        '<button class="chip" data-post-cat="all" aria-pressed="' + (cat === "all" || !cat) + '">All</button>' +
        unique
          .map(
            (c) =>
              '<button class="chip" data-post-cat="' + escapeHTML(c) + '" aria-pressed="' + (cat === c) + '">' +
              escapeHTML(c) + "</button>"
          )
          .join("");

      $$("[data-post-cat]", cats).forEach((btn) => {
        btn.addEventListener("click", () => {
          const v = btn.getAttribute("data-post-cat");
          location.href = v === "all" ? "insights.html" : "insights.html?cat=" + encodeURIComponent(v);
        });
      });
    }
  }

  function initPost() {
    const root = $("[data-post]");
    if (!root) return;

    const slug = new URLSearchParams(location.search).get("slug");
    const p = D().posts.find((x) => x.slug === slug);

    if (!p) {
      const miss = $("[data-post-missing]");
      if (miss) {
        miss.classList.remove("hidden");
        miss.removeAttribute("hidden");
      }
      root.classList.add("hidden");
      root.setAttribute("hidden", "");
      return;
    }

    document.title = p.title + " — Aurelia Journal";
    const md = $('meta[name="description"]');
    if (md) md.setAttribute("content", p.excerpt);

    const body = $("[data-post-body]");
    if (body) {
      body.innerHTML =
        '<div class="post__meta"><span class="badge">' + escapeHTML(p.category) + "</span>" +
        "<span>" + escapeHTML(formatDate(p.date)) + "</span>" +
        "<span>" + escapeHTML(p.readTime) + " read</span>" +
        "<span>By " + escapeHTML(p.author) + "</span></div>" +
        "<h1>" + escapeHTML(p.title) + "</h1>" +
        '<img src="' + p.image + '" alt="" style="border-radius:var(--r-lg);margin-block:var(--sp-6)" width="1200" height="800">' +
        p.body
          .split("\n\n")
          .map((para) => (para.startsWith("## ") ? "<h2>" + escapeHTML(para.slice(3)) + "</h2>" : "<p>" + escapeHTML(para) + "</p>"))
          .join("");
    }

    const more = $("[data-post-more]");
    if (more) {
      more.innerHTML = D().posts
        .filter((x) => x.slug !== p.slug)
        .slice(0, 3)
        .map(
          (x) =>
            '<a class="tile" href="post.html?slug=' + x.slug + '">' +
              '<div class="tile__media"><img src="' + x.image + '" alt="" loading="lazy" width="600" height="450"></div>' +
              '<div class="tile__body">' +
                '<div class="post__meta"><span class="badge">' + escapeHTML(x.category) + "</span><span>" + escapeHTML(x.readTime) + "</span></div>" +
                '<h3 class="tile__title">' + escapeHTML(x.title) + "</h3>" +
                '<p class="tile__text">' + escapeHTML(x.excerpt.slice(0, 90)) + "…</p>" +
              "</div>" +
            "</a>"
        )
        .join("");
    }
  }

  function formatDate(iso) {
    const d = new Date(iso + "T12:00:00");
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  }

  /* ----------------------------------------------------------------------
     FAQ + neighbourhood deep links
     ---------------------------------------------------------------------- */
  function initFaqs() {
    const root = $("[data-faqs]");
    if (!root) return;
    root.innerHTML = D().faqs
      .map(
        (f, i) =>
          '<div class="acc__item">' +
            '<h3 class="mb-0"><button class="acc__btn" aria-expanded="false" aria-controls="faq-' + i + '">' + escapeHTML(f.q) + "</button></h3>" +
            '<div class="acc__panel" id="faq-' + i + '" hidden><p>' + escapeHTML(f.a) + "</p></div>" +
          "</div>"
      )
      .join("");
  }

  function initNeighborhoodDeepLink() {
    const slug = location.hash.replace("#", "");
    if (!slug) return;
    const target = document.getElementById(slug);
    if (target) {
      setTimeout(() => {
        const top = target.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top, behavior: "smooth" });
      }, 250);
    }
  }

  /* ----------------------------------------------------------------------
     Neighborhood guides (long-form sections)
     ---------------------------------------------------------------------- */
  function initNeighborhoodGuides() {
    const root = $("[data-hood-guides]");
    if (!root) return;

    root.innerHTML = D().neighborhoods
      .map(
        (n) =>
          '<article class="split" id="' + n.slug + '" style="padding-block:var(--sp-7);border-bottom:1px solid var(--line);scroll-margin-top:100px">' +
            '<div>' +
              '<span class="eyebrow">Area guide</span>' +
              "<h2>" + escapeHTML(n.name) + "</h2>" +
              '<p class="lede">' + escapeHTML(n.tagline) + "</p>" +
              "<p>" + escapeHTML(n.blurb) + "</p>" +
              '<div class="chips-row mt-5">' +
                n.highlights.map((h) => '<span class="chip">' + escapeHTML(h) + "</span>").join("") +
              "</div>" +
              '<a class="link-arrow mt-5" href="properties.html?q=' + encodeURIComponent(n.name) + '">See listings in ' + escapeHTML(n.name) + "</a>" +
            "</div>" +
            '<div>' +
              '<div class="split__media" style="margin-bottom:var(--sp-5)">' +
                '<img src="' + n.image + '" alt="' + escapeHTML(n.name) + '" loading="lazy" width="1200" height="800">' +
              "</div>" +
              '<div class="spec-grid spec-grid--2x2">' +
                '<div><dt>Median price</dt><dd>' + escapeHTML(n.stats.median) + "</dd></div>" +
                '<div><dt>Walk score</dt><dd>' + n.stats.walk + "</dd></div>" +
                '<div><dt>Commute</dt><dd>' + escapeHTML(n.stats.commute) + "</dd></div>" +
                '<div><dt>Schools</dt><dd>' + n.stats.school + "/10</dd></div>" +
              "</div>" +
            "</div>" +
          "</article>"
      )
      .join("");
  }

  /* ----------------------------------------------------------------------
     Boot
     ---------------------------------------------------------------------- */
  function boot() {
    initHome();
    initIndex();
    initDetail();
    initCalculator();
    initServices();
    initTeam();
    initTestimonials();
    initPosts();
    initPost();
    initFaqs();
    initNeighborhoodGuides();
    initNeighborhoodDeepLink();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
