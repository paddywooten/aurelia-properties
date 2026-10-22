/* =========================================================================
   Aurelia Properties — Core UI
   Header, drawer, reveal, counters, sliders, tabs, accordion, lightbox,
   favourites, form validation and the home search panel.
   ========================================================================= */
(function () {
  "use strict";

  const AURELIA = (window.AURELIA = window.AURELIA || {});

  /* ----------------------------------------------------------------------
     Icon set (inline SVG, no external dependency)
     ---------------------------------------------------------------------- */
  const PATHS = {
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
    tag: '<path d="M20.6 13.4L12 22l-9-9V4h9l8.6 8.6a1.5 1.5 0 010 2.1z"/><circle cx="7.5" cy="7.5" r="1.4"/>',
    chart: '<path d="M3 21h18"/><path d="M6 21V10"/><path d="M11 21V4"/><path d="M16 21v-7"/><path d="M21 21v-4"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
    key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l8-8 2 2-2 2 2 2-2 2-2-2-2 2"/>',
    bed: '<path d="M3 18v-6h18v6"/><path d="M3 12V7"/><path d="M21 18v-6"/><path d="M3 18v2"/><path d="M21 18v2"/><path d="M7 12V9h5v3"/>',
    bath: '<path d="M3 12h18v3a5 5 0 01-5 5H8a5 5 0 01-5-5z"/><path d="M6 12V6a2 2 0 014 0"/><path d="M7 20l-1 2"/><path d="M17 20l1 2"/>',
    area: '<path d="M4 4h16v16H4z"/><path d="M4 9h16"/><path d="M9 4v16"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1116 0z"/><circle cx="12" cy="10" r="3"/>',
    heart: '<path d="M20.8 5.6a5 5 0 00-7.1 0L12 7.3l-1.7-1.7a5 5 0 10-7.1 7.1L12 21.5l8.8-8.8a5 5 0 000-7.1z"/>',
    arrow: '<path d="M5 12h14"/><path d="M13 6l6 6-6 6"/>',
    check: '<path d="M4 12.5l5 5L20 6.5"/>',
    phone: '<path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1 1 .4 1.9.7 2.8a2 2 0 01-.5 2.1L8.1 9.9a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.4c.9.3 1.8.6 2.8.7a2 2 0 011.7 2z"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2.5 6.5l9.5 6.5 9.5-6.5"/>',
    pin_off: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1116 0z"/><circle cx="12" cy="10" r="3"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/>',
    shield: '<path d="M12 2l8 3.5v6c0 5-3.4 9.3-8 10.5-4.6-1.2-8-5.5-8-10.5v-6z"/><path d="M9 12l2 2 4-4"/>',
    sparkle: '<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/>',
    home: '<path d="M3 10.5L12 3l9 7.5"/><path d="M5.5 9.5V20h13V9.5"/><path d="M9.5 20v-6h5v6"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    list: '<path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><circle cx="4" cy="6" r="1.2"/><circle cx="4" cy="12" r="1.2"/><circle cx="4" cy="18" r="1.2"/>',
    camera: '<path d="M3 8h3l2-3h8l2 3h3v12H3z"/><circle cx="12" cy="13" r="3.5"/>',
    close: '<path d="M6 6l12 12"/><path d="M18 6L6 18"/>',
    up: '<path d="M12 19V5"/><path d="M5 12l7-7 7 7"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18"/><path d="M8 3v4"/><path d="M16 3v4"/>',
    star: '<path d="M12 3l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.9 6.2 20.9l1.1-6.5L2.6 9.8l6.5-.9z"/>',
    sofa: '<path d="M4 11V8a2 2 0 012-2h12a2 2 0 012 2v3"/><path d="M2 13a2 2 0 014 0v4h12v-4a2 2 0 014 0v5H2z"/>',
    car: '<path d="M5 17h14"/><path d="M6.5 17v2H4v-2"/><path d="M20 17v2h-2.5v-2"/><path d="M4 13l1.6-5h12.8L20 13v4H4z"/><circle cx="7.5" cy="15.5" r=".8"/><circle cx="16.5" cy="15.5" r=".8"/>',
    tree: '<path d="M12 21v-6"/><path d="M12 15l-5-4h3l-4-5h12l-4 5h3z"/>',
    waves: '<path d="M2 8c2-2 4 2 6 0s4 2 6 0 4 2 6 0"/><path d="M2 14c2-2 4 2 6 0s4 2 6 0 4 2 6 0"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M4.9 4.9l1.4 1.4"/><path d="M17.7 17.7l1.4 1.4"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="M4.9 19.1l1.4-1.4"/><path d="M17.7 6.3l1.4-1.4"/>',
    lock: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 018 0v3"/>',
    doc: '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/>',
    twitter: '<path d="M22 5.9c-.7.3-1.5.5-2.3.6a4 4 0 001.8-2.2c-.8.5-1.7.8-2.6 1a4 4 0 00-6.9 3.7A11.4 11.4 0 013.2 4.7a4 4 0 001.2 5.4 4 4 0 01-1.8-.5 4 4 0 003.2 4 4 4 0 01-1.8.1 4 4 0 003.7 2.8A8 8 0 012 18.4a11.3 11.3 0 006.1 1.8c7.4 0 11.4-6.1 11.4-11.4v-.5c.8-.6 1.5-1.3 2-2.2z"/>',
    linkedin: '<path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>',
    instagram: '<rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.5" cy="6.5" r="1"/>',
    youtube: '<rect x="2" y="5" width="20" height="14" rx="4"/><path d="M10 9l5 3-5 3z"/>'
  };

  AURELIA.icon = function (name, size) {
    const p = PATHS[name] || PATHS.home;
    const s = size || 24;
    return (
      '<svg viewBox="0 0 24 24" width="' + s + '" height="' + s + '" fill="none" stroke="currentColor" ' +
      'stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + "</svg>"
    );
  };

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  /* ----------------------------------------------------------------------
     Icon hydration — fill any [data-icon] element with its SVG
     ---------------------------------------------------------------------- */
  function initIcons() {
    $$("[data-icon]").forEach((el) => {
      const name = el.getAttribute("data-icon");
      el.innerHTML = AURELIA.icon(name, el.getAttribute("data-icon-size") || 24);
    });
  }

  /* ----------------------------------------------------------------------
     Header + drawer
     ---------------------------------------------------------------------- */
  function initHeader() {
    const header = $(".header");
    const burger = $(".burger");
    const drawer = $(".drawer");

    if (header) {
      const onScroll = () => header.classList.toggle("is-stuck", window.scrollY > 12);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    if (burger && drawer) {
      const close = () => {
        drawer.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
        document.body.classList.remove("is-locked");
      };
      burger.addEventListener("click", () => {
        const open = !drawer.classList.contains("is-open");
        drawer.classList.toggle("is-open", open);
        burger.setAttribute("aria-expanded", String(open));
        document.body.classList.toggle("is-locked", open);
      });
      $$("a", drawer).forEach((a) => a.addEventListener("click", close));
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") close();
      });
    }

    // Mark the current page in the nav
    const here = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    $$(".nav__link, .drawer a[href]").forEach((link) => {
      const href = (link.getAttribute("href") || "").split("/").pop().toLowerCase();
      if (href && href === here) link.setAttribute("aria-current", "page");
    });
  }

  /* ----------------------------------------------------------------------
     Scroll reveal
     ---------------------------------------------------------------------- */
  function initReveal() {
    const items = $$("[data-reveal]");
    if (!items.length) return;

    const show = (el) => el.classList.add("is-visible");

    if (!("IntersectionObserver" in window)) {
      items.forEach(show);
      return;
    }

    // Anything already on screen is shown immediately and without a fade —
    // content the visitor is already looking at should never animate in.
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const pending = [];
    items.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < vh * 0.95 && r.bottom > 0) show(el);
      else pending.push(el);
    });

    if (!pending.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            show(entry.target);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    pending.forEach((el) => io.observe(el));

    // Safety net for layout shifts (late-loading fonts or images) that would
    // otherwise leave an element stranded below the fold.
    setTimeout(() => {
      pending.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < vh && r.bottom > 0) {
          show(el);
          io.unobserve(el);
        }
      });
    }, 900);
  }

  /* ----------------------------------------------------------------------
     Animated counters
     ---------------------------------------------------------------------- */
  function initCounters() {
    const counters = $$("[data-count]");
    if (!counters.length) return;

    const run = (el) => {
      const target = parseFloat(el.getAttribute("data-count"));
      const suffix = el.getAttribute("data-suffix") || "";
      const prefix = el.getAttribute("data-prefix") || "";
      const decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
      const dur = 1400;
      const start = performance.now();

      const tick = (now) => {
        const p = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        const value = target * eased;
        el.textContent =
          prefix + value.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    if (!("IntersectionObserver" in window)) {
      counters.forEach(run);
      return;
    }

    // Counters already on screen run straight away.
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const pending = [];
    counters.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < vh * 0.95 && r.bottom > 0) run(el);
      else pending.push(el);
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            run(entry.target);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    pending.forEach((el) => io.observe(el));
  }

  /* ----------------------------------------------------------------------
     Testimonial slider
     ---------------------------------------------------------------------- */
  function initSliders() {
    $$("[data-slider]").forEach((root) => {
      const items = $$(".slider__item", root);
      const dots = $$(".slider__dot", root);
      if (!items.length) return;
      let idx = 0;
      let timer = null;

      const show = (n) => {
        idx = (n + items.length) % items.length;
        items.forEach((it, i) => it.classList.toggle("is-active", i === idx));
        dots.forEach((d, i) => d.setAttribute("aria-selected", String(i === idx)));
      };
      const start = () => {
        if (dots.length < 2) return;
        stop();
        timer = setInterval(() => show(idx + 1), 7000);
      };
      const stop = () => { if (timer) clearInterval(timer); timer = null; };

      dots.forEach((d, i) => d.addEventListener("click", () => { show(i); start(); }));
      root.addEventListener("mouseenter", stop);
      root.addEventListener("mouseleave", start);
      show(0);
      start();
    });
  }

  /* ----------------------------------------------------------------------
     Tabs
     ---------------------------------------------------------------------- */
  function initTabs() {
    $$("[data-tabs]").forEach((root) => {
      const tabs = $$(".tab", root);
      const panels = $$(".tabpanel", root);
      tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
          tabs.forEach((t) => t.setAttribute("aria-selected", String(t === tab)));
          panels.forEach((p) => {
            p.hidden = p.id !== tab.getAttribute("aria-controls");
          });
        });
      });
    });
  }

  /* ----------------------------------------------------------------------
     Accordion
     ---------------------------------------------------------------------- */
  function initAccordions() {
    $$(".acc").forEach((acc) => {
      const buttons = $$(".acc__btn", acc);
      buttons.forEach((btn) => {
        btn.addEventListener("click", () => {
          const panel = document.getElementById(btn.getAttribute("aria-controls"));
          const open = btn.getAttribute("aria-expanded") === "true";
          if (acc.hasAttribute("data-accordion-single")) {
            buttons.forEach((b) => {
              b.setAttribute("aria-expanded", "false");
              const p = document.getElementById(b.getAttribute("aria-controls"));
              if (p) p.hidden = true;
            });
          }
          btn.setAttribute("aria-expanded", String(!open));
          if (panel) panel.hidden = open;
        });
      });
    });
  }

  /* ----------------------------------------------------------------------
     Lightbox
     ---------------------------------------------------------------------- */
  AURELIA.openLightbox = function (images, index, caption) {
    let lb = $(".lightbox");
    if (!lb) {
      lb = document.createElement("div");
      lb.className = "lightbox";
      lb.setAttribute("role", "dialog");
      lb.setAttribute("aria-modal", "true");
      lb.setAttribute("aria-label", "Image viewer");
      lb.innerHTML =
        '<button class="lightbox__close" aria-label="Close viewer">&times;</button>' +
        '<button class="lightbox__nav lightbox__nav--prev" aria-label="Previous image">&#8249;</button>' +
        '<img alt="">' +
        '<button class="lightbox__nav lightbox__nav--next" aria-label="Next image">&#8250;</button>' +
        '<div class="lightbox__caption"></div>';
      document.body.appendChild(lb);
    }
    const img = $("img", lb);
    const cap = $(".lightbox__caption", lb);
    let i = index || 0;

    const render = () => {
      img.src = images[i];
      img.alt = (caption || "") + " — image " + (i + 1) + " of " + images.length;
      cap.textContent = (caption ? caption + " · " : "") + (i + 1) + " / " + images.length;
    };

    lb.classList.add("is-open");
    document.body.classList.add("is-locked");
    render();

    const close = () => {
      lb.classList.remove("is-open");
      document.body.classList.remove("is-locked");
      document.removeEventListener("keydown", onKey);
    };
    const next = () => { i = (i + 1) % images.length; render(); };
    const prev = () => { i = (i - 1 + images.length) % images.length; render(); };
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };

    $(".lightbox__close", lb).onclick = close;
    $(".lightbox__nav--next", lb).onclick = next;
    $(".lightbox__nav--prev", lb).onclick = prev;
    lb.onclick = (e) => { if (e.target === lb) close(); };
    document.addEventListener("keydown", onKey);
  };

  /* ----------------------------------------------------------------------
     Favourites (localStorage)
     ---------------------------------------------------------------------- */
  const FAV_KEY = "aurelia.favourites";

  AURELIA.favourites = {
    all: function () {
      try {
        return JSON.parse(localStorage.getItem(FAV_KEY) || "[]");
      } catch (e) {
        return [];
      }
    },
    has: function (id) {
      return AURELIA.favourites.all().indexOf(id) !== -1;
    },
    toggle: function (id) {
      const list = AURELIA.favourites.all();
      const i = list.indexOf(id);
      if (i === -1) list.push(id);
      else list.splice(i, 1);
      try {
        localStorage.setItem(FAV_KEY, JSON.stringify(list));
      } catch (e) { /* storage unavailable */ }
      AURELIA.favourites.sync();
      return AURELIA.favourites.has(id);
    },
    sync: function () {
      const list = AURELIA.favourites.all();
      $$("[data-fav-btn]").forEach((btn) => {
        const on = AURELIA.favourites.has(btn.getAttribute("data-fav-btn"));
        btn.setAttribute("aria-pressed", String(on));
      });
      $$("[data-fav-count]").forEach((el) => {
        el.textContent = String(list.length);
        el.setAttribute("data-empty", String(list.length === 0));
      });
    }
  };

  function initFavourites() {
    AURELIA.favourites.sync();

    document.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-fav-btn]");
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();
      const id = btn.getAttribute("data-fav-btn");
      const added = AURELIA.favourites.toggle(id);
      btn.animate(
        [{ transform: "scale(1)" }, { transform: "scale(1.28)" }, { transform: "scale(1)" }],
        { duration: 320, easing: "cubic-bezier(.16,1,.3,1)" }
      );
      if (added) {
        const label = btn.getAttribute("data-fav-label");
        AURELIA.toast(label ? label + " saved to your shortlist" : "Saved to your shortlist");
      }
    });

    const favBtn = $("[data-fav-open]");
    if (favBtn) {
      favBtn.addEventListener("click", () => {
        location.href = "properties.html?view=favourites";
      });
    }
  }

  /* ----------------------------------------------------------------------
     Toast
     ---------------------------------------------------------------------- */
  AURELIA.toast = function (message) {
    let t = $(".toast");
    if (!t) {
      t = document.createElement("div");
      t.className = "toast";
      t.setAttribute("role", "status");
      t.setAttribute("aria-live", "polite");
      document.body.appendChild(t);
    }
    t.textContent = message;
    t.classList.add("is-visible");
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove("is-visible"), 2800);
  };

  /* ----------------------------------------------------------------------
     Forms
     ---------------------------------------------------------------------- */
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function fieldWrap(input) {
    return input.closest(".field") || input.parentElement;
  }

  function validateField(input) {
    const wrap = fieldWrap(input);
    const err = wrap ? wrap.querySelector(".field__error") : null;
    let message = "";

    const value = (input.value || "").trim();

    if (input.hasAttribute("required") && !value) {
      message = "This field is required.";
    } else if (input.type === "email" && value && !EMAIL_RE.test(value)) {
      message = "Please enter a valid email address.";
    } else if (input.type === "tel" && value && !/^[0-9+()\-.\s]{7,}$/.test(value)) {
      message = "Please enter a valid phone number.";
    } else if (input.type === "number" && value && isNaN(Number(value))) {
      message = "Please enter a number.";
    } else if (input.dataset.min && value && Number(value) < Number(input.dataset.min)) {
      message = "Value must be at least " + input.dataset.min + ".";
    }

    if (wrap) wrap.classList.toggle("has-error", !!message);
    if (err) err.textContent = message;
    input.setAttribute("aria-invalid", message ? "true" : "false");
    return !message;
  }

  function initForms() {
    $$("form[data-validate]").forEach((form) => {
      const inputs = $$("input, select, textarea", form).filter((el) => el.type !== "hidden");

      inputs.forEach((input) => {
        input.addEventListener("blur", () => validateField(input));
        input.addEventListener("input", () => {
          const wrap = fieldWrap(input);
          if (wrap && wrap.classList.contains("has-error")) validateField(input);
        });
      });

      form.addEventListener("submit", (e) => {
        e.preventDefault();
        let ok = true;
        let firstBad = null;
        inputs.forEach((input) => {
          if (!validateField(input)) {
            ok = false;
            if (!firstBad) firstBad = input;
          }
        });

        const status = $(".form__status", form);
        if (!ok) {
          if (status) {
            status.className = "form__status form__status--err is-visible";
            status.textContent = "Please correct the highlighted fields and try again.";
          }
          if (firstBad) firstBad.focus();
          return;
        }

        const btn = $("button[type=submit]", form);
        const original = btn ? btn.textContent : "";
        if (btn) {
          btn.disabled = true;
          btn.textContent = "Sending…";
        }

        // Front-end only: no backend is configured for this demo site.
        setTimeout(() => {
          if (btn) {
            btn.disabled = false;
            btn.textContent = original;
          }
          if (status) {
            status.className = "form__status form__status--ok is-visible";
            status.textContent =
              "Thank you — your enquiry has been received. A member of the team will be in touch within one business day.";
          }
          form.reset();
          inputs.forEach((input) => {
            const wrap = fieldWrap(input);
            if (wrap) wrap.classList.remove("has-error");
          });
        }, 900);
      });
    });

    // Newsletter (footer)
    $$("[data-newsletter]").forEach((form) => {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const input = $("input", form);
        if (!input || !EMAIL_RE.test(input.value.trim())) {
          if (input) {
            input.focus();
            input.style.borderColor = "var(--danger)";
          }
          AURELIA.toast("Please enter a valid email address.");
          return;
        }
        input.value = "";
        input.style.borderColor = "";
        AURELIA.toast("Subscribed — the Market Letter lands on the first of every month.");
      });
    });
  }

  /* ----------------------------------------------------------------------
     Back to top
     ---------------------------------------------------------------------- */
  function initBackToTop() {
    let btn = $(".back-to-top");
    if (!btn) {
      btn = document.createElement("button");
      btn.className = "back-to-top";
      btn.setAttribute("aria-label", "Back to top");
      btn.innerHTML = AURELIA.icon("up", 18);
      document.body.appendChild(btn);
    }
    const onScroll = () => btn.classList.toggle("is-visible", window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  /* ----------------------------------------------------------------------
     Home search panel → properties page
     ---------------------------------------------------------------------- */
  function initSearchPanel() {
    $$("[data-search-form]").forEach((form) => {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        $$("select, input", form).forEach((el) => {
          if (el.value && el.value !== "any" && el.value !== "") params.set(el.name, el.value);
        });
        const target = form.getAttribute("data-search-form");
        location.href = target + (params.toString() ? "?" + params.toString() : "");
      });
    });
  }

  /* ----------------------------------------------------------------------
     Smooth in-page links that respect the sticky header
     ---------------------------------------------------------------------- */
  function initAnchors() {
    $$('a[href^="#"]').forEach((a) => {
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      a.addEventListener("click", (e) => {
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 90;
        window.scrollTo({ top, behavior: "smooth" });
        history.replaceState(null, "", id);
      });
    });
  }

  /* ----------------------------------------------------------------------
     Boot
     ---------------------------------------------------------------------- */
  function boot() {
    initIcons();
    initHeader();
    initReveal();
    initCounters();
    initSliders();
    initTabs();
    initAccordions();
    initFavourites();
    initForms();
    initBackToTop();
    initSearchPanel();
    initAnchors();
    document.documentElement.classList.add("js-ready");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
