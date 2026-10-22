# Aurelia Properties

A complete, production-ready marketing website for a boutique real estate brokerage.

Static HTML, CSS and vanilla JavaScript — no build step, no framework, no runtime
dependencies. Open `index.html` and it works.

---

## Highlights

**Eleven pages**
`index` · `properties` · `property` · `about` · `services` · `neighborhoods` ·
`insights` · `post` · `contact` · `legal` · `404`

**Working listing engine**
- Filter by keyword, type, status, bedrooms, bathrooms and price range
- Six sort orders (featured, price, size, bedrooms, newest)
- Grid and list layouts
- Shareable, URL-synced filter state — every search is a bookmarkable link
- Live result count, empty state, and a one-click reset

**Dynamic property detail pages**
One `property.html` template renders every listing from `?id=…`, including the
gallery, specification table, amenities, schools, assigned agent, and three
similar listings ranked by type, location, price and bedroom count.

**Mortgage calculator**
Live amortisation with adjustable price, down payment (amount *and* percentage,
kept in sync), interest rate, term, property tax and insurance.

**Shortlist**
Save properties to a `localStorage` shortlist, surfaced in the header with a live
count and a dedicated "my shortlist" view of the portfolio.

**Gallery lightbox**
Keyboard-navigable image viewer (arrow keys, Escape) with a caption counter.

**Forms**
Client-side validation with inline error messages, accessible
`aria-invalid`/`aria-describedby` wiring, and a success state. Forms are
front-end only — see [Wiring up a backend](#wiring-up-a-backend).

**Details that matter**
- Scroll-reveal animations that never hide content from keyboard users or
  visitors without JavaScript
- Animated stat counters
- Testimonial slider, accordions, tabs, and a mobile navigation drawer
- Responsive from 320 px upward, with a print stylesheet
- Skip link, focus-visible outlines, ARIA labelling, semantic landmarks

**Performance**
- Every image is a generated SVG — no binary assets, nothing to optimise
- `loading="lazy"` on below-the-fold imagery
- No jQuery, no web fonts blocking (Google Fonts loads with `display=swap`)
- Total page weight is a few hundred kilobytes

---

## Getting started

The site is plain files, so any static server works:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Opening `index.html` directly from disk also works, with one caveat: some
browsers restrict `localStorage` on `file://` URLs, which disables the
shortlist. Use a local server if you want to exercise that feature.

---

## Project structure

```
.
├── index.html                 Home
├── properties.html            Portfolio — filters, sorting, grid/list
├── property.html              Listing detail — driven by ?id=
├── about.html                 Story, timeline, principles, team
├── services.html              Six services, process, pricing, FAQ
├── neighborhoods.html         Six area guides
├── insights.html              Journal index
├── post.html                  Journal article — driven by ?slug=
├── contact.html               Contact form, offices, map, FAQ
├── legal.html                 Privacy policy and terms
├── 404.html                   Not found
│
├── assets/
│   ├── css/styles.css         Design system — tokens, layout, components
│   ├── js/
│   │   ├── data.js            All content: listings, team, services, articles
│   │   ├── main.js            UI behaviour: header, reveal, forms, shortlist
│   │   └── properties.js      Listing engine, detail page, calculator
│   └── img/*.svg              Generated artwork (73 files)
│
├── tools/
│   ├── build_pages.py         Regenerates the HTML from a shared layout
│   ├── generate_images.py     Regenerates all SVG artwork
│   ├── qa_copy.sh             Builds a screenshot-friendly copy for QA
│   └── serve_slow.py          Static server with a delaying endpoint
│
└── .github/workflows/
    └── pages.yml              Deploys to GitHub Pages on every push
```

### Where to edit content

**Almost everything lives in `assets/js/data.js`.** To change a listing price,
a team member, a neighbourhood statistic or a journal article, edit that file —
no HTML changes required.

Copy, navigation and the contact details live in `tools/build_pages.py`, which
renders every page from one shared layout so they cannot drift apart.

---

## Working on the site

### Regenerating the HTML

```bash
python3 tools/build_pages.py
```

Writes all eleven pages to the repository root.

### Regenerating the artwork

```bash
python3 tools/generate_images.py
```

Writes 73 SVGs to `assets/img/`. Each scene is drawn procedurally from a
palette and a seed, so the output is deterministic — the same command always
produces the same files, and there are no binary assets in the repository.

The generator deliberately avoids full-canvas `feTurbulence` filters: they are
expensive enough to rasterise that a page full of them visibly stalls image
decoding. Film grain is built from a cheap repeating tile instead.

### Visual QA

```bash
./tools/qa_copy.sh /tmp/qa-site 8100
python3 -m http.server 8100 --directory /tmp/qa-site
```

This copies the site with lazy-loading stripped and transitions disabled, so a
headless screenshot captures the finished state rather than a half-faded
animation.

`tools/serve_slow.py` is a static server with one extra route: `/slow.png`
responds only after a delay. Pointing an `<img>` at it holds a page's `load`
event open long enough for a headless browser to capture content that is
generated or animated after the initial paint.

```bash
python3 tools/serve_slow.py . 8000 15
```

---

## Deploying

### GitHub Pages

The included workflow (`.github/workflows/pages.yml`) publishes the site on
every push to `main`:

1. **Settings → Pages → Source → GitHub Actions**
2. Push to `main`

The workflow regenerates the HTML and artwork from source before publishing, so
the deployed site always matches the generator, not whatever happened to be
committed.

For a custom domain, add a `CNAME` file containing the domain and point the
DNS at GitHub's Pages servers.

### Any other static host

Upload the repository root. Because the site is pre-built and dependency-free,
there is nothing to compile — but the repository root also contains `tools/`
and `.github/`, which are harmless to publish.

---

## Wiring up a backend

The forms are front-end only and currently simulate a successful submission.
To connect a real endpoint, find the submit handler in `assets/js/main.js`
(`initForms`) and replace the `setTimeout` block with a `fetch` call:

```js
fetch("/api/enquiry", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(Object.fromEntries(new FormData(form)))
})
  .then((r) => { if (!r.ok) throw new Error(r.statusText); showSuccess(); })
  .catch(() => showError());
```

The client-side validation can stay exactly as it is — it already guarantees
the payload has the shape the endpoint expects.

---

## Browser support

Current Chrome, Edge, Firefox and Safari. The site uses `aspect-ratio`,
`clamp()`, CSS custom properties, `IntersectionObserver` and the `hidden`
attribute — all baseline in browsers from 2020 onward.

JavaScript is progressively enhanced: with scripting disabled, the navigation,
copy, contact details and legal pages all remain readable, and the reveal
animations are disabled so no content is ever stranded invisible.

---

## Content disclaimer

Aurelia Properties is a fictional brokerage. The listings, prices, team
members, statistics and articles are invented for demonstration purposes, and
the property valuation figures are illustrative only — they do not constitute a
valuation, a loan offer, or legal, tax or financial advice.

---

## Licence

MIT — see [LICENSE](LICENSE).
