#!/usr/bin/env python3
"""
Static site generator for the Aurelia Properties website.

Every page shares one layout (head, header, footer, scripts) so that
navigation, metadata and the contact details never drift apart.

Usage:  python3 tools/build_pages.py
Output: *.html in the project root
"""

from __future__ import annotations

import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def _read_data_ids():
    """Pull listing ids and article slugs out of the content data file."""
    src = open(os.path.join(ROOT, "assets", "js", "data.js"), encoding="utf-8").read()
    prop_ids = re.findall(r'^\s+id: "(p-\d+)",', src, re.M)
    block = re.search(r"\n    posts: \[(.*?)\n    \],", src, re.S)
    post_slugs = re.findall(r'^\s+slug: "([^"]+)",', block.group(1), re.M) if block else []
    return prop_ids, post_slugs


PROPERTIES, POST_SLUGS = _read_data_ids()

COMPANY = {
    "name": "Aurelia Properties",
    "tagline": "Real estate, refined.",
    "phone": "+1 (415) 555-0188",
    "phone_href": "+14155550188",
    "email": "hello@aureliaproperties.com",
    "address": "1180 Marina Vista Blvd, Suite 400",
    "city": "San Francisco, CA 94107",
    "hours": "Mon–Fri, 9:00am – 6:00pm PT",
    "license": "DRE #01884421 · Bonded & Insured",
}

NAV = [
    ("index.html", "Home"),
    ("properties.html", "Properties"),
    ("neighborhoods.html", "Neighborhoods"),
    ("services.html", "Services"),
    ("about.html", "About"),
    ("insights.html", "Journal"),
    ("contact.html", "Contact"),
]

BRAND_MARK = """<svg class="brand__mark" viewBox="0 0 48 48" fill="none" aria-hidden="true">
  <rect x="1.5" y="1.5" width="45" height="45" rx="11" stroke="#1d3b33" stroke-width="3"/>
  <path d="M11 33.5L24 14l13 19.5" stroke="#1d3b33" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M17 33.5L24 22.5l7 11" stroke="#c05f3c" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="24" cy="38" r="2.4" fill="#b08a4f"/>
</svg>"""


def header(active: str) -> str:
    items = []
    for href, label in NAV:
        cur = ' aria-current="page"' if href == active else ""
        items.append(f'<li><a class="nav__link" href="{href}"{cur}>{label}</a></li>')
    nav_list = "\n          ".join(items)

    drawer_items = "\n      ".join(
        f'<a href="{href}">{label}</a>' for href, label in NAV
    )

    return f"""    <header class="header">
      <div class="wrap header__inner">
        <a class="brand" href="index.html">
          {BRAND_MARK}
          <span class="brand__text">
            <span class="brand__name">{COMPANY['name']}</span>
            <span class="brand__tag">{COMPANY['tagline']}</span>
          </span>
        </a>

        <nav class="nav" aria-label="Primary">
          <ul class="nav__list">
          {nav_list}
          </ul>
        </nav>

        <div class="header__actions">
          <button class="fav-btn" data-fav-open aria-label="Open my shortlist">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.8 5.6a5 5 0 00-7.1 0L12 7.3l-1.7-1.7a5 5 0 10-7.1 7.1L12 21.5l8.8-8.8a5 5 0 000-7.1z"/></svg>
            <span class="fav-btn__count" data-fav-count data-empty="true">0</span>
          </button>
          <a class="btn btn--sm" href="contact.html">Book a valuation</a>
          <button class="burger" aria-expanded="false" aria-label="Open menu" aria-controls="drawer">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </header>

    <div class="drawer" id="drawer">
      {drawer_items}
      <a class="btn btn--light" href="contact.html">Book a valuation</a>
    </div>
"""


def footer() -> str:
    return f"""    <footer class="footer">
      <div class="wrap">
        <div class="footer__top">
          <div>
            <a class="brand" href="index.html">
              {BRAND_MARK}
              <span class="brand__text">
                <span class="brand__name">{COMPANY['name']}</span>
                <span class="brand__tag">{COMPANY['tagline']}</span>
              </span>
            </a>
            <p class="footer__brand">A boutique brokerage representing architecturally significant homes across the Bay Area and the Pacific Northwest. We sell fewer homes, and we sell them properly.</p>
            <form class="newsletter" data-newsletter novalidate>
              <label class="visually-hidden" for="nl-email">Email address</label>
              <input id="nl-email" type="email" name="email" placeholder="Email for the Market Letter" autocomplete="email">
              <button class="btn btn--sm btn--clay" type="submit">Join</button>
            </form>
          </div>

          <div>
            <h4>Explore</h4>
            <ul>
              <li><a href="properties.html">All properties</a></li>
              <li><a href="properties.html?type=house">Houses</a></li>
              <li><a href="properties.html?type=condo">Condos &amp; lofts</a></li>
              <li><a href="properties.html?type=townhouse">Townhouses</a></li>
              <li><a href="properties.html?status=pending">Pending &amp; recent sales</a></li>
              <li><a href="neighborhoods.html">Neighborhood guides</a></li>
            </ul>
          </div>

          <div>
            <h4>Services</h4>
            <ul>
              <li><a href="services.html#service-buying">Buyer representation</a></li>
              <li><a href="services.html#service-selling">Seller representation</a></li>
              <li><a href="services.html#service-valuation">Property valuation</a></li>
              <li><a href="services.html#service-investment">Investment &amp; portfolio</a></li>
              <li><a href="services.html#service-relocation">Relocation</a></li>
              <li><a href="services.html#service-management">Property management</a></li>
            </ul>
          </div>

          <div>
            <h4>Contact</h4>
            <ul>
              <li><a href="tel:{COMPANY['phone_href']}">{COMPANY['phone']}</a></li>
              <li><a href="mailto:{COMPANY['email']}">{COMPANY['email']}</a></li>
              <li>{COMPANY['address']}<br>{COMPANY['city']}</li>
              <li>{COMPANY['hours']}</li>
              <li>{COMPANY['license']}</li>
            </ul>
          </div>
        </div>

        <div class="footer__bottom">
          <span>&copy; {COMPANY['name']} Group LLC. All rights reserved. {COMPANY['license']}</span>
          <div class="flex gap-4 items-center flex-wrap">
            <a href="legal.html#privacy">Privacy</a>
            <a href="legal.html#terms">Terms</a>
            <span>Accessibility</span>
          </div>
          <div class="socials">
            <a href="#" aria-label="Aurelia Properties on Instagram">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.5" cy="6.5" r="1"/></svg>
            </a>
            <a href="#" aria-label="Aurelia Properties on LinkedIn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
            </a>
            <a href="#" aria-label="Aurelia Properties on YouTube">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="4"/><path d="M10 9l5 3-5 3z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
"""


def layout(
    *,
    filename: str,
    title: str,
    description: str,
    active: str,
    body: str,
    body_class: str = "",
    extra_js: str = "",
    og_image: str = "assets/img/hero.svg",
) -> str:
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{title}</title>
  <meta name="description" content="{description}">
  <meta name="theme-color" content="#1d3b33">
  <link rel="canonical" href="https://aureliaproperties.example.com/{filename}">

  <meta property="og:type" content="website">
  <meta property="og:site_name" content="{COMPANY['name']}">
  <meta property="og:title" content="{title}">
  <meta property="og:description" content="{description}">
  <meta property="og:image" content="{og_image}">
  <meta name="twitter:card" content="summary_large_image">

  <link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/css/styles.css">
  <noscript><style>[data-reveal]{{opacity:1 !important;transform:none !important}}</style></noscript>
</head>
<body{(' class="' + body_class + '"') if body_class else ''}>
  <a class="skip-link" href="#main">Skip to content</a>
{header(active)}
  <main id="main">
{body}
  </main>
{footer()}
  <script src="assets/js/data.js"></script>
  <script src="assets/js/main.js"></script>
  <script src="assets/js/properties.js"></script>{extra_js}
</body>
</html>
"""


# ---------------------------------------------------------------------------
# Shared page sections
# ---------------------------------------------------------------------------

def cta_band(title: str, copy: str, primary: str = "Book a valuation", secondary: str = "See our services") -> str:
    return f"""    <section class="section section--dark">
      <div class="wrap">
        <div class="grid-wide" style="align-items:center">
          <div>
            <span class="eyebrow">Get started</span>
            <h2>{title}</h2>
            <p class="lede" style="color:rgba(255,255,255,.78);max-width:52ch">{copy}</p>
            <div class="flex gap-3 flex-wrap mt-6">
              <a class="btn btn--light" href="contact.html">{primary}</a>
              <a class="btn btn--outline-light" href="services.html">{secondary}</a>
            </div>
          </div>
          <div class="cta">
            <div class="cta__card">
              <h3>Sell with Aurelia</h3>
              <p>Pre-listing consultation, professional photography, floor plans, and a launch plan built around the first two weeks.</p>
              <a class="link-arrow" style="color:#f8f5ef" href="services.html#service-selling">Seller representation</a>
            </div>
            <div class="cta__card">
              <h3>Buy with Aurelia</h3>
              <p>A retained buyer's agent who works only for you, with honest advice on what a home is actually worth.</p>
              <a class="link-arrow" style="color:#f8f5ef" href="services.html#service-buying">Buyer representation</a>
            </div>
          </div>
        </div>
      </div>
    </section>
"""


def page_head(title: str, copy: str, crumbs: str) -> str:
    return f"""    <section class="page-head">
      <div class="wrap">
        <nav class="breadcrumb" aria-label="Breadcrumb">
          <a href="index.html">Home</a><span>/</span>{crumbs}
        </nav>
        <h1>{title}</h1>
        <p>{copy}</p>
      </div>
    </section>
"""


# ---------------------------------------------------------------------------
# Pages
# ---------------------------------------------------------------------------

CTA_BAND = cta_band(
    "Ready when you are.",
    "Whether you are thinking of selling in the spring, buying this year, or simply want a straight answer about what your home is worth — the first conversation is free and the second is optional.",
)


def build_index() -> str:
    body = """    <section class="hero">
      <div class="hero__bg">
        <img src="assets/img/hero.svg" alt="A contemporary hillside residence overlooking the bay at golden hour" width="1200" height="800">
      </div>
      <div class="wrap hero__inner">
        <div class="hero__copy">
          <span class="eyebrow" style="color:var(--gold-500)">Est. 2026 · San Francisco &amp; the Peninsula</span>
          <h1>Homes worth <em>waiting</em> for.</h1>
          <p>We represent a small number of architecturally significant homes. Fewer listings, better preparation, and a negotiation built on evidence rather than hope.</p>
          <div class="hero__meta">
            <span class="hero__pill"><b>$1.2M</b> average list price</span>
            <span class="hero__pill"><b>31</b> days average to close</span>
            <span class="hero__pill"><b>98%</b> of list price achieved</span>
          </div>
        </div>

        <form class="search-panel" data-search-form="properties.html" role="search">
          <div class="search-field">
            <label for="sp-type">Property type</label>
            <select id="sp-type" name="type">
              <option value="any">Any type</option>
              <option value="house">House</option>
              <option value="condo">Condo</option>
              <option value="townhouse">Townhouse</option>
              <option value="loft">Loft</option>
              <option value="multi-family">Multi-family</option>
            </select>
          </div>
          <div class="search-field">
            <label for="sp-min">Price from</label>
            <select id="sp-min" name="min">
              <option value="">No minimum</option>
              <option value="750000">$750,000</option>
              <option value="1000000">$1,000,000</option>
              <option value="1500000">$1,500,000</option>
              <option value="2000000">$2,000,000</option>
              <option value="3000000">$3,000,000</option>
              <option value="5000000">$5,000,000</option>
            </select>
          </div>
          <div class="search-field">
            <label for="sp-max">Price to</label>
            <select id="sp-max" name="max">
              <option value="">No maximum</option>
              <option value="1500000">$1,500,000</option>
              <option value="2500000">$2,500,000</option>
              <option value="4000000">$4,000,000</option>
              <option value="6000000">$6,000,000</option>
              <option value="10000000">$10,000,000</option>
            </select>
          </div>
          <div class="search-field">
            <label for="sp-beds">Bedrooms</label>
            <select id="sp-beds" name="beds">
              <option value="0">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
              <option value="5">5+</option>
            </select>
          </div>
          <button class="btn btn--clay" type="submit">Search properties</button>
        </form>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div class="section-head">
          <span class="eyebrow">Currently available</span>
          <h2>Featured properties</h2>
          <p>A selection from the current portfolio. Every listing is photographed, measured and researched before it reaches this page.</p>
        </div>
        <div class="prop-grid" data-featured></div>
        <div class="flex gap-3 mt-7 flex-wrap">
          <a class="btn" href="properties.html">View all properties</a>
          <a class="btn btn--ghost" href="properties.html?view=favourites">Open my shortlist</a>
        </div>
      </div>
    </section>

    <section class="section section--sand">
      <div class="wrap">
        <div class="grid-wide">
          <div data-reveal>
            <span class="eyebrow">The difference</span>
            <h2>Preparation is not staging.</h2>
            <p class="lede">The gap between a listing that sits and a listing that sells is almost never the photographs. It is the weeks of preparation that happen before anyone sees the house.</p>
            <p>Every Aurelia listing gets a pre-listing walkthrough before a single photograph is taken. We look for the deferred maintenance that buyers will price in as risk, the repairs that will show up at inspection, and the handful of changes that remove doubt rather than add decoration.</p>
            <a class="link-arrow mt-5" href="services.html#service-selling">How we prepare a listing</a>
          </div>
          <div class="split__media" data-reveal data-reveal-delay="2">
            <img src="assets/img/editorial-staging.svg" alt="An interior prepared for photography" width="1200" height="800">
          </div>
        </div>

        <div class="value-strip mt-7" data-reveal>
          <div>
            <h3>We list less</h3>
            <p>Twelve to eighteen homes a year per agent. More attention per listing than a volume brokerage can give.</p>
          </div>
          <div>
            <h3>We prepare more</h3>
            <p>Nine days of work before launch, on average, focused on the things buyers discount hardest.</p>
          </div>
          <div>
            <h3>We report honestly</h3>
            <p>Weekly written reporting on showings, feedback and market movement — including when to change course.</p>
          </div>
          <div>
            <h3>We close carefully</h3>
            <p>Escrow managed by our own operations desk. Thirty-one days average, with no surprises at the end.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div class="section-head section-head--center">
          <span class="eyebrow">By the numbers</span>
          <h2>Sixteen years of measured results</h2>
        </div>
        <div class="stats-strip">
          <div class="stat" data-reveal>
            <div class="stat__num"><span data-count="480" data-suffix="+">0</span></div>
            <div class="stat__label">Homes sold</div>
          </div>
          <div class="stat" data-reveal data-reveal-delay="1">
            <div class="stat__num"><span data-count="98" data-suffix="%">0</span></div>
            <div class="stat__label">Of list price achieved</div>
          </div>
          <div class="stat" data-reveal data-reveal-delay="2">
            <div class="stat__num"><span data-count="31" data-suffix="">0</span></div>
            <div class="stat__label">Days average to close</div>
          </div>
          <div class="stat" data-reveal data-reveal-delay="3">
            <div class="stat__num"><span data-count="16" data-suffix="">0</span></div>
            <div class="stat__label">Years in practice</div>
          </div>
        </div>
      </div>
    </section>

    <section class="section section--sand">
      <div class="wrap">
        <div class="section-head">
          <span class="eyebrow">What we do</span>
          <h2>Six ways we work with clients</h2>
          <p>Every engagement is retained, documented and staffed by the people you meet on the first day.</p>
        </div>
        <div class="grid grid-3" data-services></div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div class="section-head section-head--center">
          <span class="eyebrow">Neighbourhoods</span>
          <h2>Where we work</h2>
          <p>Six areas we know street by street — because the difference between two similar streets is often the whole decision.</p>
        </div>
        <div class="grid grid-3" data-neighborhoods></div>
        <div class="text-c mt-7">
          <a class="btn btn--ghost" href="neighborhoods.html">Read the area guides</a>
        </div>
      </div>
    </section>

    <section class="section section--forest">
      <div class="wrap">
        <div class="grid-wide">
          <div>
            <span class="eyebrow">Client stories</span>
            <h2>What clients say when we are not in the room</h2>
            <p class="lede" style="color:rgba(255,255,255,.72)">We ask every client, at the end of a transaction, whether we would recommend us. These are their answers, unedited.</p>
          </div>
          <div class="slider" data-slider>
            <div class="slider__track" data-testimonials></div>
            <div class="slider__nav"></div>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div class="section-head">
          <span class="eyebrow">Rentals</span>
          <h2>Homes available to rent</h2>
        </div>
        <div class="prop-grid" data-rentals></div>
      </div>
    </section>

{CTA_BAND}
"""
    return body


def build_properties() -> str:
    body = """    <section class="page-head">
      <div class="wrap">
        <nav class="breadcrumb" aria-label="Breadcrumb">
          <a href="index.html">Home</a><span>/</span>Properties
        </nav>
        <h1>The portfolio</h1>
        <p>Twelve active listings across the Bay Area and the Peninsula. Filter by price, type or size — or tell us what you are looking for and we will search off-market as well.</p>
      </div>
    </section>

    <section class="section" data-properties>
      <div class="wrap">
        <div class="toolbar">
          <div class="toolbar__row">
            <div class="search-field" style="flex:2 1 260px">
              <label for="fq">Search</label>
              <input id="fq" type="search" placeholder="Address, neighbourhood or keyword" data-filter-q>
            </div>
            <div class="search-field">
              <label for="ft">Type</label>
              <select id="ft" data-filter-type>
                <option value="any">Any type</option>
                <option value="house">House</option>
                <option value="condo">Condo</option>
                <option value="townhouse">Townhouse</option>
                <option value="loft">Loft</option>
                <option value="multi-family">Multi-family</option>
              </select>
            </div>
            <div class="search-field">
              <label for="fs">Status</label>
              <select id="fs" data-filter-status>
                <option value="any">Any status</option>
                <option value="for-sale">For sale</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div class="search-field">
              <label for="fb">Beds</label>
              <select id="fb" data-filter-beds>
                <option value="0">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>
            </div>
          </div>

          <div class="toolbar__row">
            <div class="search-field">
              <label for="fmin">Price from</label>
              <input id="fmin" type="number" placeholder="No minimum" step="50000" min="0" data-filter-min>
            </div>
            <div class="search-field">
              <label for="fmax">Price to</label>
              <input id="fmax" type="number" placeholder="No maximum" step="50000" min="0" data-filter-max>
            </div>
            <div class="search-field">
              <label for="fba">Baths</label>
              <select id="fba" data-filter-baths>
                <option value="0">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>
            <div class="search-field">
              <label for="fsort">Sort by</label>
              <select id="fsort" data-sort>
                <option value="featured">Featured first</option>
                <option value="price-asc">Price — low to high</option>
                <option value="price-desc">Price — high to low</option>
                <option value="size-desc">Largest first</option>
                <option value="beds-desc">Most bedrooms</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>

          <div class="toolbar__meta">
            <p class="toolbar__count" data-result-count><b>0</b> properties available</p>
            <div class="flex gap-3 items-center flex-wrap">
              <button class="btn btn--ghost btn--sm" data-filter-clear>Clear filters</button>
              <div class="viewtoggle" role="group" aria-label="Result layout">
                <button data-view-btn="grid" aria-pressed="true" aria-label="Grid view">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
                </button>
                <button data-view-btn="list" aria-pressed="false" aria-label="List view">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><circle cx="4" cy="6" r="1.2"/><circle cx="4" cy="12" r="1.2"/><circle cx="4" cy="18" r="1.2"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6">
          <div class="prop-grid" data-grid></div>
          <div class="prop-list hidden" data-list></div>

          <div class="panel panel--sand text-c hidden" data-empty>
            <h3>No properties match those filters</h3>
            <p class="muted">Try widening your price range, or <a href="contact.html">tell us what you are looking for</a> — roughly a third of what we transact never reaches a public listing page.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section section--sand">
      <div class="wrap">
        <div class="grid-wide" style="align-items:center">
          <div>
            <span class="eyebrow">Off-market</span>
            <h2>Some of our best homes are never listed publicly.</h2>
            <p class="lede">We work with a number of owners who prefer a discreet sale. Register your requirements and we will contact you when something matches — including homes that have not yet been photographed.</p>
            <a class="btn btn--clay mt-4" href="contact.html">Register your search</a>
          </div>
          <div class="panel">
            <h3 class="mb-0">What a private sale involves</h3>
            <ul class="checklist mt-4">
              <li><span>A valuation prepared specifically for a quiet transaction</span></li>
              <li><span>Photography only for buyers who have signed an NDA</span></li>
              <li><span>One to three scheduled showings rather than an open period</span></li>
              <li><span>Negotiation conducted entirely through counsel</span></li>
              <li><span>Full reporting, identical to any other listing</span></li>
            </ul>
          </div>
        </div>
      </div>
    </section>
"""
    return body


def build_property() -> str:
    body = """    <div data-detail>
      <section class="section section--sm">
        <div class="wrap">
          <nav class="breadcrumb" style="color:var(--ink-4)" aria-label="Breadcrumb">
            <a href="index.html" style="color:var(--ink-3)">Home</a><span>/</span>
            <a href="properties.html" style="color:var(--ink-3)">Properties</a><span>/</span>
            <span style="color:var(--ink-4)">Listing</span>
          </nav>
          <div class="detail-head mb-0" data-detail-head></div>
        </div>
      </section>

      <section class="section-sm" style="padding-top:0">
        <div class="wrap">
          <div class="gallery" data-gallery></div>
        </div>
      </section>

      <section class="section-sm" style="padding-top:0">
        <div class="wrap">
          <div class="spec-grid" data-detail-specs></div>
        </div>
      </section>

      <section class="section-sm" style="padding-top:0">
        <div class="wrap">
          <div class="grid-wide">
            <div>
              <span class="eyebrow">The property</span>
              <div data-detail-description></div>

              <h3 class="mt-7">Features and finishes</h3>
              <ul class="amenity-grid" data-detail-amenities></ul>

              <h3 class="mt-7">At a glance</h3>
              <div class="chips-row" data-detail-features></div>

              <h3 class="mt-7">Nearby schools</h3>
              <ul class="amenity-grid" data-detail-schools></ul>
            </div>

            <aside class="stack-lg">
              <div class="panel">
                <div class="agent-card" data-detail-agent></div>
              </div>

              <div class="panel" id="detail-enquiry">
                <h3 class="mb-0">Request a viewing</h3>
                <p class="tiny muted">We reply within one business day, and we will confirm a time that suits you.</p>
                <form class="form" data-validate novalidate>
                  <input type="hidden" name="property" data-enquiry-id>
                  <div class="field">
                    <label for="e-name">Full name <span class="req">*</span></label>
                    <input id="e-name" name="name" type="text" required autocomplete="name">
                    <span class="field__error"></span>
                  </div>
                  <div class="field">
                    <label for="e-email">Email <span class="req">*</span></label>
                    <input id="e-email" name="email" type="email" required autocomplete="email">
                    <span class="field__error"></span>
                  </div>
                  <div class="field">
                    <label for="e-phone">Phone</label>
                    <input id="e-phone" name="phone" type="tel" autocomplete="tel">
                    <span class="field__error"></span>
                  </div>
                  <div class="field">
                    <label for="e-property">Property</label>
                    <input id="e-property" name="subject" type="text" data-enquiry-property readonly>
                    <span class="field__error"></span>
                  </div>
                  <div class="field">
                    <label for="e-message">Message</label>
                    <textarea id="e-message" name="message" rows="4" placeholder="Tell us when you would like to view the property."></textarea>
                    <span class="field__error"></span>
                  </div>
                  <label class="check">
                    <input type="checkbox" name="consent" required>
                    <span>I agree to be contacted about this property and understand my details will be held by Aurelia Properties.</span>
                  </label>
                  <button class="btn btn--block" type="submit">Request viewing</button>
                  <div class="form__status" role="status"></div>
                </form>
              </div>

              <div class="panel" data-calc>
                <h3 class="mb-0">Monthly cost estimate</h3>
                <p class="tiny muted">Principal, interest, property tax and insurance at 6.4% over 30 years.</p>
                <div class="calc mt-4">
                  <div class="calc__inputs">
                    <div class="field">
                      <label for="c-price">Purchase price</label>
                      <input id="c-price" type="number" step="25000" min="0" data-calc-price>
                      <span class="field__error"></span>
                    </div>
                    <div class="field">
                      <label for="c-down">Down payment</label>
                      <input id="c-down" type="number" step="25000" min="0" data-calc-down>
                      <span class="field__error"></span>
                    </div>
                    <div class="field">
                      <label for="c-downpct">Down payment %</label>
                      <input id="c-downpct" type="range" min="5" max="60" step="1" value="20" data-calc-down-pct>
                      <span class="field__error"></span>
                    </div>
                    <div class="field">
                      <label for="c-rate">Interest rate %</label>
                      <input id="c-rate" type="number" step="0.05" min="0" max="20" value="6.4" data-calc-rate>
                      <span class="field__error"></span>
                    </div>
                    <div class="field">
                      <label for="c-term">Term (years)</label>
                      <select id="c-term" data-calc-term>
                        <option value="30">30 years</option>
                        <option value="20">20 years</option>
                        <option value="15">15 years</option>
                      </select>
                      <span class="field__error"></span>
                    </div>
                    <div class="field">
                      <label for="c-tax">Property tax %</label>
                      <input id="c-tax" type="number" step="0.1" min="0" max="5" value="1.2" data-calc-tax>
                      <span class="field__error"></span>
                    </div>
                    <div class="field">
                      <label for="c-ins">Insurance %</label>
                      <input id="c-ins" type="number" step="0.1" min="0" max="5" value="0.35" data-calc-ins>
                      <span class="field__error"></span>
                    </div>
                  </div>
                  <div class="calc__out">
                    <div class="calc__row"><span>Purchase price</span><b data-out-principal>$0</b></div>
                    <div class="calc__row"><span>Total interest over term</span><b data-out-interest>$0</b></div>
                    <div class="calc__row"><span>Annual property tax</span><b data-out-tax>$0</b></div>
                    <div class="calc__row"><span>Annual insurance</span><b data-out-insurance>$0</b></div>
                    <div class="calc__total">
                      <span>Est. monthly</span>
                      <b data-out-total>$0</b>
                    </div>
                    <p class="tiny" style="color:rgba(255,255,255,.6);margin-top:var(--sp-3)" data-out-rate></p>
                  </div>
                </div>
              </div>

              <div class="panel panel--sand">
                <h4 class="mb-0">A note on accuracy</h4>
                <p class="tiny muted mt-4">Figures are an estimate for planning purposes only and do not constitute a loan offer. Property tax is a modelled estimate and will vary by assessment. Confirm current rates with your lender.</p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section class="section section--sand">
        <div class="wrap">
          <div class="section-head">
            <span class="eyebrow">You may also like</span>
            <h2>Similar properties</h2>
          </div>
          <div class="prop-grid" data-similar></div>
        </div>
      </section>
    </div>

    <div class="wrap" data-detail-missing hidden>
      <section class="section">
        <div class="panel text-c">
          <h2>We could not find that listing</h2>
          <p class="muted">It may have sold, been withdrawn, or the address may have been mistyped.</p>
          <a class="btn mt-4" href="properties.html">Browse all properties</a>
        </div>
      </section>
    </div>
"""
    return body


def build_about() -> str:
    body = """    <section class="page-head">
      <div class="wrap">
        <nav class="breadcrumb" aria-label="Breadcrumb">
          <a href="index.html">Home</a><span>/</span>About
        </nav>
        <h1>A boutique brokerage, on purpose.</h1>
        <p>We were founded on a simple constraint: an agent can represent twelve to eighteen homes a year properly, and no more than that. Everything else about Aurelia follows from it.</p>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div class="split">
          <div data-reveal>
            <span class="eyebrow">Our story</span>
            <h2>Started in 2009 with one listing.</h2>
            <p class="lede">Elena Marchetti left a global brokerage after eleven years and took a single house on Sea Cliff — a mid-century property that had been on the market for a year and needed something more than a listing sign.</p>
            <p>We rebuilt Aurelia around what that listing taught us. Buyers did not want more options; they wanted fewer, better ones, and someone willing to tell them the truth about each. Sellers did not want a photographer; they wanted a marketing plan and an honest weekly report.</p>
            <p>Sixteen years later the practice is six partners and a team of twenty-two, operating across San Francisco, the Peninsula and the North Bay. We still take fewer listings than we are offered, and we still turn down work we do not think we can execute well.</p>
            <blockquote class="quote mt-6">
              We would rather lose a listing than take it badly.
              <cite>Elena Marchetti, Founding Partner</cite>
            </blockquote>
          </div>
          <div class="split__media" data-reveal data-reveal-delay="2">
            <img src="assets/img/editorial-story.svg" alt="The Aurelia Properties office" width="1200" height="800">
          </div>
        </div>
      </div>
    </section>

    <section class="section section--sand">
      <div class="wrap">
        <div class="section-head section-head--center">
          <span class="eyebrow">Milestones</span>
          <h2>Sixteen years, briefly</h2>
        </div>
        <div class="grid-wide" style="gap:var(--sp-8)">
          <div class="timeline" data-reveal>
            <div class="timeline__item">
              <div class="timeline__year">2009</div>
              <h3>Aurelia Properties opens</h3>
              <p>Founded in a two-room office on Union Street with one listing and one part-time assistant.</p>
            </div>
            <div class="timeline__item">
              <div class="timeline__year">2013</div>
              <h3>The Peninsula practice</h3>
              <p>First dedicated team covering Woodside and Atherton, driven almost entirely by referral.</p>
            </div>
            <div class="timeline__item">
              <div class="timeline__year">2016</div>
              <h3>Operations desk established</h3>
              <p>In-house escrow and transaction management, cutting average time to close by eleven days.</p>
            </div>
            <div class="timeline__item">
              <div class="timeline__year">2019</div>
              <h3>Investment desk</h3>
              <p>Formally launched for 1031 exchanges and multi-family acquisitions after two years of informal work.</p>
            </div>
            <div class="timeline__item">
              <div class="timeline__year">2023</div>
              <h3>North Bay coverage</h3>
              <p>Mill Valley and San Rafael added, taking the practice to six core neighbourhoods.</p>
            </div>
            <div class="timeline__item">
              <div class="timeline__year">2026</div>
              <h3>480 homes and counting</h3>
              <p>Twenty-two people, six neighbourhoods, and a deliberate refusal to grow faster than we can staff.</p>
            </div>
          </div>
          <div class="split__media" data-reveal data-reveal-delay="2">
            <img src="assets/img/editorial-office.svg" alt="The Aurelia Properties workspace" width="1200" height="800">
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div class="section-head section-head--center">
          <span class="eyebrow">Principles</span>
          <h2>How we decide what to do</h2>
        </div>
        <div class="grid grid-3">
          <div class="feature" data-reveal>
            <div class="feature__icon" data-icon="sparkle"></div>
            <h3>Fewer listings, deeper work</h3>
            <p>An agent carrying twenty active listings gives each about four hours a week. We cap the number at twelve to eighteen so that the number is twelve to eighteen.</p>
          </div>
          <div class="feature" data-reveal data-reveal-delay="1">
            <div class="feature__icon" data-icon="shield"></div>
            <h3>One side of the table</h3>
            <p>Our buyer's agents are retained by the buyer and paid by the buyer. There is no split commission to negotiate, and no incentive to shade a recommendation.</p>
          </div>
          <div class="feature" data-reveal data-reveal-delay="2">
            <div class="feature__icon" data-icon="chart"></div>
            <h3>Reporting you can act on</h3>
            <p>Every listing receives a written weekly report — showings, feedback, comparable activity and our recommendation for the week ahead.</p>
          </div>
          <div class="feature" data-reveal data-reveal-delay="3">
            <div class="feature__icon" data-icon="search"></div>
            <h3>Preparation over promotion</h3>
            <p>Marketing cannot rescue a poorly prepared property. We spend the first nine days fixing what buyers discount.</p>
          </div>
          <div class="feature" data-reveal data-reveal-delay="4">
            <div class="feature__icon" data-icon="compass"></div>
            <h3>Advice you can act on</h3>
            <p>We will tell you when a price is wrong, when a market is not there yet, and when to walk away from a house you love.</p>
          </div>
          <div class="feature" data-reveal data-reveal-delay="5">
            <div class="feature__icon" data-icon="lock"></div>
            <h3>Discretion as standard</h3>
            <p>Private sales, off-market access and NDAs are routine parts of our practice, not special arrangements.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section section--forest">
      <div class="wrap">
        <div class="section-head section-head--center">
          <span class="eyebrow">The team</span>
          <h2>Who you will actually be working with</h2>
          <p>No juniors, no hand-offs. The agent you meet is the agent who does the work.</p>
        </div>
        <div class="grid grid-3" data-team></div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div class="grid-wide" style="align-items:center">
          <div>
            <span class="eyebrow">Offices</span>
            <h2>Two rooms, one team</h2>
            <p class="lede">Our San Francisco office is on the waterfront in Fort Mason; the Peninsula office is above the train station in San Mateo. Both are open to clients without an appointment.</p>
            <div class="contact-tiles mt-6">
              <div class="contact-tile">
                <div class="contact-tile__icon" data-icon="home"></div>
                <div><strong>San Francisco</strong><span>1180 Marina Vista Blvd, Suite 400</span><span>San Francisco, CA 94107</span></div>
              </div>
              <div class="contact-tile">
                <div class="contact-tile__icon" data-icon="pin"></div>
                <div><strong>San Mateo</strong><span>210 E 3rd Avenue</span><span>San Mateo, CA 94401</span></div>
              </div>
            </div>
          </div>
          <div class="split__media" data-reveal data-reveal-delay="2">
            <img src="assets/img/editorial-landscape.svg" alt="The Bay Area landscape" width="1200" height="800">
          </div>
        </div>
      </div>
    </section>
"""
    return body


def build_services() -> str:
    body = """    <section class="page-head">
      <div class="wrap">
        <nav class="breadcrumb" aria-label="Breadcrumb">
          <a href="index.html">Home</a><span>/</span>Services
        </nav>
        <h1>Everything we do, in detail.</h1>
        <p>Six services, each retained in writing, each staffed by the people you meet on the first day. No tiered packages, no add-ons, no surprise line items.</p>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div class="chips-row mb-0" data-services-nav></div>
        <div class="grid grid-3 mt-6" data-services></div>
      </div>
    </section>

    <section class="section" style="padding-top:0">
      <div class="wrap">
        <div data-services-body></div>
      </div>
    </section>

    <section class="section section--sand">
      <div class="wrap">
        <div class="grid-wide" style="align-items:start">
          <div>
            <span class="eyebrow">Process</span>
            <h2>How a listing runs</h2>
            <p class="lede">Six stages over roughly nine days before we launch, then a weekly rhythm you can see and question.</p>
          </div>
          <div class="steps">
            <div class="step">
              <h3>Pre-listing walkthrough</h3>
              <p>We spend two hours in the property with a contractor, a photographer and a copywriter, and produce a prioritised list of everything that affects price. No charge, and no obligation to list with us.</p>
            </div>
            <div class="step">
              <h3>Preparation</h3>
              <p>You decide what to fix. We coordinate the trades, hold the schedule, and manage the budget. Most of our clients spend between five and twenty thousand dollars here, and it returns roughly six to ten times that.</p>
            </div>
            <div class="step">
              <h3>Positioning</h3>
              <p>Photography, film, floor plans and a written positioning document covering the buyer, the story and the two objections we expect to hear first.</p>
            </div>
            <div class="step">
              <h3>Launch</h3>
              <p>Listing photography published, portals activated, our own database and broker network alerted on the same day. Your first open house is within ten days of launch.</p>
            </div>
            <div class="step">
              <h3>Negotiation</h3>
              <p>We manage every offer, in writing, with a recommendation attached. You see the full picture — price, terms, contingencies and timing — and we tell you what we would accept.</p>
            </div>
            <div class="step">
              <h3>Escrow and close</h3>
              <p>Our own operations desk coordinates inspections, appraisal, title and lender. You get a weekly status and a single point of contact until the keys are in your hand.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div class="section-head section-head--center">
          <span class="eyebrow">Engagement</span>
          <h2>How we charge</h2>
          <p>One flat rate, agreed in writing before we begin. The fee covers everything listed below.</p>
        </div>
        <div class="pricing">
          <div class="price-card">
            <h3>Seller — Standard</h3>
            <div class="price-card__price">1.5% <small>of sale price</small></div>
            <p class="tiny muted">Minimum fee $9,500. Suitable for properties under $1.2M.</p>
            <ul>
              <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5 5L20 6.5"/></svg> Full preparation management</li>
              <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5 5L20 6.5"/></svg> Photography, film and floor plans</li>
              <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5 5L20 6.5"/></svg> Listing and portal management</li>
              <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5 5L20 6.5"/></svg> Negotiation and escrow handling</li>
            </ul>
            <a class="btn btn--ghost btn--block" href="contact.html">Enquire</a>
          </div>

          <div class="price-card price-card--featured">
            <h3>Seller — Signature</h3>
            <div class="price-card__price">2.5% <small>of sale price</small></div>
            <p class="tiny muted">Minimum fee $18,000. Our most chosen engagement.</p>
            <ul>
              <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5 5L20 6.5"/></svg> Everything in Standard</li>
              <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5 5L20 6.5"/></svg> Dedicated project manager</li>
              <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5 5L20 6.5"/></svg> Staging for the first ten days</li>
              <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5 5L20 6.5"/></svg> Copywriting and film</li>
              <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5 5L20 6.5"/></svg> Private broker network preview</li>
            </ul>
            <a class="btn btn--block" href="contact.html">Enquire</a>
          </div>

          <div class="price-card">
            <h3>Buyer &amp; Investor</h3>
            <div class="price-card__price">Fixed fee</div>
            <p class="tiny muted">Quoted per engagement. Never a percentage of the purchase price.</p>
            <ul>
              <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5 5L20 6.5"/></svg> Retained buyer's representation</li>
              <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5 5L20 6.5"/></svg> Comparable sales analysis</li>
              <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5 5L20 6.5"/></svg> Offer negotiation</li>
              <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5 5L20 6.5"/></svg> Inspection and escrow coordination</li>
            </ul>
            <a class="btn btn--ghost btn--block" href="contact.html">Enquire</a>
          </div>
        </div>

        <div class="notice mt-6">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v5"/><path d="M12 16.5h.01"/></svg>
          <p><strong>A note on fees.</strong> Figures shown are typical and vary by property, service complexity and market conditions. Every engagement is quoted in writing before any work begins. We never charge for staging marketing materials, and we do not charge separate buyer-side fees to the buyers we represent.</p>
        </div>
      </div>
    </section>

    <section class="section section--sand">
      <div class="wrap">
        <div class="section-head section-head--center">
          <span class="eyebrow">Questions</span>
          <h2>Frequently asked</h2>
        </div>
        <div class="acc wrap-narrow mx-auto" data-faqs></div>
      </div>
    </section>
"""
    return body


def build_neighborhoods() -> str:
    body = """    <section class="page-head">
      <div class="wrap">
        <nav class="breadcrumb" aria-label="Breadcrumb">
          <a href="index.html">Home</a><span>/</span>Neighborhoods
        </nav>
        <h1>Six areas, in detail.</h1>
        <p>Anyone can list a neighbourhood name. These guides cover what the streets are actually like, what the trade-offs are, and who tends to like them — including the parts that are not flattering.</p>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div class="grid grid-3" data-neighborhoods></div>
      </div>
    </section>

    <section class="section section--sand">
      <div class="wrap">
        <div class="section-head">
          <span class="eyebrow">Full guides</span>
          <h2>Neighbourhood notes</h2>
          <p>Written by the agents who work these streets daily.</p>
        </div>
        <div id="hood-guides" data-hood-guides></div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div class="grid-wide" style="align-items:center">
          <div>
            <span class="eyebrow">Comparing</span>
            <h2>Not sure which area fits?</h2>
            <p class="lede">Tell us how you commute, what your weekends look like, and what you want the house to feel like. We will come back with two or three specific streets rather than a list of areas.</p>
            <a class="btn mt-4" href="contact.html">Book a consultation</a>
          </div>
          <div class="panel">
            <h3 class="mb-0">Questions worth asking yourself</h3>
            <ul class="checklist mt-4">
              <li><span>How long is the commute at 8am, not on a Sunday?</span></li>
              <li><span>What happens on a winter evening — is there anywhere to go?</span></li>
              <li><span>Do you need a car, and where would you park two of them?</span></li>
              <li><span>What will the street look like in ten years?</span></li>
              <li><span>Do you want a house, or a place that is easy to resell?</span></li>
            </ul>
          </div>
        </div>
      </div>
    </section>
"""
    return body


def build_insights() -> str:
    body = """    <section class="page-head">
      <div class="wrap">
        <nav class="breadcrumb" aria-label="Breadcrumb">
          <a href="index.html">Home</a><span>/</span>Journal
        </nav>
        <h1>The Aurelia Journal</h1>
        <p>Market analysis, case studies and the occasional opinion. Written by the agents doing the work, not by a content team.</p>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div class="chips-row mb-0" data-post-cats></div>
        <div class="mt-6" data-posts></div>
        <div class="panel text-c hidden" data-post-missing>
          <h3>No articles in that category yet</h3>
          <p class="muted">Try another category, or <a href="contact.html">ask us a question directly</a>.</p>
        </div>
      </div>
    </section>

    <section class="section section--sand">
      <div class="wrap">
        <div class="grid-wide" style="align-items:center">
          <div>
            <span class="eyebrow">Market Letter</span>
            <h2>One email a month. Nothing else.</h2>
            <p class="lede">Our monthly letter goes out on the first Tuesday: the numbers that moved, the streets that changed, and what we are seeing in our own transactions before it reaches the data.</p>
            <form class="form mt-5" data-newsletter novalidate style="max-width:440px">
              <div class="field">
                <label for="jl-email">Email address</label>
                <input id="jl-email" name="email" type="email" placeholder="you@example.com" required autocomplete="email">
                <span class="field__error"></span>
              </div>
              <button class="btn" type="submit">Subscribe</button>
            </form>
          </div>
          <div class="split__media" data-reveal data-reveal-delay="2">
            <img src="assets/img/editorial-valuation.svg" alt="Market analysis on the desk" width="1200" height="800">
          </div>
        </div>
      </div>
    </section>
"""
    return body


def build_post() -> str:
    body = """    <div data-post>
      <section class="section">
        <div class="wrap">
          <nav class="breadcrumb" style="color:var(--ink-4)" aria-label="Breadcrumb">
            <a href="index.html" style="color:var(--ink-3)">Home</a><span>/</span>
            <a href="insights.html" style="color:var(--ink-3)">Journal</a><span>/</span>
            <span style="color:var(--ink-4)">Article</span>
          </nav>
          <div class="article" data-post-body></div>
        </div>
      </section>

      <section class="section section--sand">
        <div class="wrap">
          <div class="section-head">
            <span class="eyebrow">Keep reading</span>
            <h2>More from the journal</h2>
          </div>
          <div class="grid grid-3" data-post-more></div>
        </div>
      </section>
    </div>

    <div class="wrap" data-post-missing hidden>
      <section class="section">
        <div class="panel text-c">
          <h2>We could not find that article</h2>
          <p class="muted">It may have been moved or renamed.</p>
          <a class="btn mt-4" href="insights.html">Back to the journal</a>
        </div>
      </section>
    </div>
"""
    return body


def build_contact() -> str:
    body = """    <section class="page-head">
      <div class="wrap">
        <nav class="breadcrumb" aria-label="Breadcrumb">
          <a href="index.html">Home</a><span>/</span>Contact
        </nav>
        <h1>Let's start with a conversation.</h1>
        <p>Tell us what you are considering — a valuation, a purchase, a sale, or a neighbourhood you have not lived in before. We reply within one business day, and there is no charge for the first conversation.</p>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div class="grid-wide">
          <div>
            <div class="panel">
              <h2 class="mb-0">Send us a message</h2>
              <p class="tiny muted">Fields marked with an asterisk are required. We use your details only to respond to this enquiry.</p>
              <form class="form mt-5" data-validate novalidate>
                <div class="form__row">
                  <div class="field">
                    <label for="c-name">Full name <span class="req">*</span></label>
                    <input id="c-name" name="name" type="text" required autocomplete="name">
                    <span class="field__error"></span>
                  </div>
                  <div class="field">
                    <label for="c-email">Email <span class="req">*</span></label>
                    <input id="c-email" name="email" type="email" required autocomplete="email">
                    <span class="field__error"></span>
                  </div>
                </div>
                <div class="form__row">
                  <div class="field">
                    <label for="c-phone">Phone</label>
                    <input id="c-phone" name="phone" type="tel" autocomplete="tel">
                    <span class="field__error"></span>
                  </div>
                  <div class="field">
                    <label for="c-interest">I'm interested in <span class="req">*</span></label>
                    <select id="c-interest" name="interest" required>
                      <option value="">Please select…</option>
                      <option value="buying">Buying a property</option>
                      <option value="selling">Selling a property</option>
                      <option value="valuation">A valuation (free, no obligation)</option>
                      <option value="investment">Investment or portfolio advice</option>
                      <option value="relocation">Relocating to the area</option>
                      <option value="management">Property management</option>
                      <option value="rental">Finding a rental</option>
                      <option value="other">Something else</option>
                    </select>
                    <span class="field__error"></span>
                  </div>
                </div>
                <div class="form__row">
                  <div class="field">
                    <label for="c-budget">Budget</label>
                    <select id="c-budget" name="budget">
                      <option value="">Prefer not to say</option>
                      <option value="under-1m">Under $1,000,000</option>
                      <option value="1m-2m">$1,000,000 – $2,000,000</option>
                      <option value="2m-4m">$2,000,000 – $4,000,000</option>
                      <option value="4m-plus">$4,000,000+</option>
                    </select>
                    <span class="field__error"></span>
                  </div>
                  <div class="field">
                    <label for="c-area">Area of interest</label>
                    <input id="c-area" name="area" type="text" placeholder="Neighbourhood or address">
                    <span class="field__error"></span>
                  </div>
                </div>
                <div class="field">
                  <label for="c-message">Message <span class="req">*</span></label>
                  <textarea id="c-message" name="message" rows="6" required placeholder="A sentence or two about what you are looking for, and any timing you have in mind."></textarea>
                  <span class="field__error"></span>
                  <span class="tiny muted">Do not include sensitive financial details in this message.</span>
                </div>
                <label class="check">
                  <input type="checkbox" name="consent" required>
                  <span>I agree to Aurelia Properties storing these details in order to respond to my enquiry. <a href="legal.html#privacy">Privacy policy</a>.</span>
                </label>
                <button class="btn btn--lg" type="submit">Send enquiry</button>
                <div class="form__status" role="status"></div>
              </form>
            </div>
          </div>

          <aside class="stack-lg">
            <div class="panel">
              <h3 class="mb-0">Talk to us</h3>
              <div class="contact-tiles mt-5">
                <div class="contact-tile">
                  <div class="contact-tile__icon" data-icon="phone"></div>
                  <div><strong>Telephone</strong><a href="tel:+14155550188">+1 (415) 555-0188</a><span class="tiny">Mon–Fri, 9:00am – 6:00pm PT</span></div>
                </div>
                <div class="contact-tile">
                  <div class="contact-tile__icon" data-icon="mail"></div>
                  <div><strong>Email</strong><a href="mailto:hello@aureliaproperties.com">hello@aureliaproperties.com</a><span class="tiny">Replies within one business day</span></div>
                </div>
                <div class="contact-tile">
                  <div class="contact-tile__icon" data-icon="home"></div>
                  <div><strong>San Francisco office</strong><span>1180 Marina Vista Blvd, Suite 400</span><span>San Francisco, CA 94107</span></div>
                </div>
                <div class="contact-tile">
                  <div class="contact-tile__icon" data-icon="pin"></div>
                  <div><strong>San Mateo office</strong><span>210 E 3rd Avenue</span><span>San Mateo, CA 94401</span></div>
                </div>
              </div>
            </div>

            <div class="panel panel--sand">
              <h4 class="mb-0">Looking to sell?</h4>
              <p class="tiny muted mt-4">Request a valuation and we will prepare a written price range with the comparable sales and adjustments behind it. There is no charge and no obligation to list with us.</p>
              <a class="btn btn--clay btn--sm mt-4" href="properties.html">See recent sales</a>
            </div>

            <div class="panel">
              <h4 class="mb-0">Office hours</h4>
              <ul class="checklist mt-4" style="gap:var(--sp-2)">
                <li><span>Monday to Friday — 9:00am to 6:00pm PT</span></li>
                <li><span>Saturday — 10:00am to 2:00pm by appointment</span></li>
                <li><span>Sunday — closed</span></li>
              </ul>
              <p class="tiny muted mt-4">Viewings outside these hours are arranged routinely.</p>
            </div>
          </aside>
        </div>
      </div>
    </section>

    <section class="section section--sand">
      <div class="wrap">
        <div class="section-head section-head--center">
          <span class="eyebrow">Find us</span>
          <h2>Marina Vista Boulevard</h2>
        </div>
        <iframe
          class="map-embed"
          title="Map showing the Aurelia Properties San Francisco office"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          src="https://www.openstreetmap.org/export/embed.html?bbox=-122.4465%2C37.7795%2C-122.4265%2C37.7925&amp;layer=mapnik&amp;marker=37.7860%2C-122.4365"></iframe>
        <p class="tiny muted mt-4 text-c">Map data &copy; OpenStreetMap contributors. The office entrance is on the courtyard side of the building; street parking is metered until 6pm.</p>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div class="section-head section-head--center">
          <span class="eyebrow">Questions</span>
          <h2>Before you write</h2>
        </div>
        <div class="acc wrap-narrow mx-auto" data-faqs></div>
      </div>
    </section>
"""
    return body


def build_legal() -> str:
    body = """    <section class="page-head">
      <div class="wrap">
        <nav class="breadcrumb" aria-label="Breadcrumb">
          <a href="index.html">Home</a><span>/</span>Legal
        </nav>
        <h1>Privacy &amp; terms</h1>
        <p>Plain-language policies. If anything here is unclear, ask us and we will explain it — that is what the privacy contact details are for.</p>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div class="grid-wide">
          <div class="stack-lg">
            <div class="panel" id="privacy">
              <span class="eyebrow">Policy</span>
              <h2 class="mb-0">Privacy policy</h2>
              <p class="tiny muted">Last updated 1 September 2026</p>

              <h3>What we collect</h3>
              <p>When you submit a form on this website we collect the name, email address, telephone number and message you provide, along with the page you submitted it from. We do not collect payment details, and we do not use third-party advertising trackers on this site.</p>

              <h3>Why we collect it</h3>
              <p>Only to respond to your enquiry, to provide a valuation or consultation you have asked for, and — if you have opted in — to send the monthly Market Letter. We do not sell or share your details with third parties for marketing purposes.</p>

              <h3>How long we keep it</h3>
              <p>Enquiry records are retained for twenty-four months and then deleted. If you become a client, records are retained for the period required by California law, which is generally three years after a transaction closes.</p>

              <h3>Your rights</h3>
              <p>You may ask us for a copy of the information we hold about you, ask us to correct it, or ask us to delete it. Under the California Consumer Privacy Act, you also have the right to know what we collect and to opt out of its sale — we do not sell personal information. Write to <a href="mailto:privacy@aureliaproperties.com">privacy@aureliaproperties.com</a> and we will respond within thirty days.</p>

              <h3>Local storage</h3>
              <p>This website stores your shortlist of saved properties in your browser's local storage. That data stays on your device, is never transmitted to us, and is removed when you clear your browser storage.</p>

              <h3>Cookies</h3>
              <p>We set no advertising or analytics cookies. The only browser storage this site uses is the local-storage shortlist described above, and the fonts and map tiles loaded from Google Fonts and OpenStreetMap, which are subject to those providers' own privacy policies.</p>
            </div>

            <div class="panel" id="terms">
              <span class="eyebrow">Policy</span>
              <h2 class="mb-0">Terms of use</h2>
              <p class="tiny muted">Last updated 1 September 2026</p>

              <h3>No offer, no advice</h3>
              <p>All property details, prices, dimensions, photography, floor plans and area information on this website are provided for general information only. They do not constitute an offer, a valuation, a contract, or legal, tax or financial advice. Property information is believed to be accurate but is not warranted or guaranteed.</p>

              <h3>Accuracy of measurements</h3>
              <p>Square footage, lot size and any figures described as "estimated" are approximations prepared from public records and our own knowledge. Buyers should verify all material dimensions and figures independently.</p>

              <h3>Estimates and calculators</h3>
              <p>Mortgage calculator outputs are illustrative estimates for planning purposes only. They are not a loan offer, a commitment to lend, or a representation of the terms you would receive. Interest rates, taxes and insurance costs change and are modelled at the values shown.</p>

              <h3>Availability</h3>
              <p>Listings are updated frequently but properties can be withdrawn, sold or placed under contract without notice. Availability is confirmed only in a signed agreement. Where a property is shown as pending, it remains viewable by arrangement.</p>

              <h3>Intellectual property</h3>
              <p>The text, photography, floor plans, illustrations and design of this website belong to Aurelia Properties Group LLC or are used under licence. You may not reproduce them commercially without written permission. You are welcome to link to any page.</p>

              <h3>Third-party links</h3>
              <p>This site may link to external websites, including mapping and mapping services. We are not responsible for their content, accuracy or practices, and we do not endorse them by linking.</p>

              <h3>Governing law</h3>
              <p>These terms are governed by the laws of the State of California. Any dispute will be handled in the state or federal courts located in San Francisco County.</p>
            </div>
          </div>

          <aside>
            <div class="panel panel--sand">
              <h4 class="mb-0">Licensing</h4>
              <p class="tiny muted mt-4">Aurelia Properties Group LLC is a licensed real estate brokerage in the State of California. Broker of record: Elena Marchetti, DRE #01884421. All listing information is deemed reliable but not guaranteed.</p>
            </div>
            <div class="panel mt-4">
              <h4 class="mb-0">Fair housing</h4>
              <p class="tiny muted mt-4">Aurelia Properties complies fully with the federal Fair Housing Act, the California Fair Housing Act and the Fair Housing Act. We do not discriminate on the basis of race, colour, religion, sex, sexual orientation, gender identity, national origin, ancestry, age, disability, familial status or marital status.</p>
            </div>
            <div class="panel mt-4">
              <h4 class="mb-0">Contact</h4>
              <p class="tiny muted mt-4">Questions about these policies can be sent to <a href="mailto:privacy@aureliaproperties.com">privacy@aureliaproperties.com</a> or by post to 1180 Marina Vista Blvd, Suite 400, San Francisco, CA 94107.</p>
            </div>
          </aside>
        </div>
      </div>
    </section>
"""
    return body


def build_404() -> str:
    body = """    <section class="section" style="padding-top:calc(var(--header-h) + 5rem);padding-bottom:5rem">
      <div class="wrap wrap-narrow text-c">
        <span class="eyebrow" style="justify-content:center">Error 404</span>
        <h1>This address does not exist.</h1>
        <p class="lede">The page you were looking for has moved, or the address was mistyped. The links below will get you back on track.</p>
        <div class="flex gap-3 mt-6 flex-wrap" style="justify-content:center">
          <a class="btn" href="index.html">Back to home</a>
          <a class="btn btn--ghost" href="properties.html">Browse properties</a>
          <a class="btn btn--ghost" href="contact.html">Contact us</a>
        </div>
      </div>
    </section>
"""
    return body


# ---------------------------------------------------------------------------
# Build
# ---------------------------------------------------------------------------

PAGES = [
    ("index.html", build_index, {
        "title": "Aurelia Properties — Boutique Real Estate Brokerage, San Francisco",
        "description": "A boutique real estate brokerage representing architecturally significant homes across San Francisco, the Peninsula and the North Bay. Fewer listings, better preparation, honest advice.",
        "active": "index.html",
    }),
    ("properties.html", build_properties, {
        "title": "Properties for Sale — Aurelia Properties",
        "description": "Browse the current Aurelia Properties portfolio: houses, condos, townhouses and lofts across San Francisco, the Peninsula and the North Bay. Filter by price, type, bedrooms and status.",
        "active": "properties.html",
    }),
    ("property.html", build_property, {
        "title": "Listing — Aurelia Properties",
        "description": "Full details, photography, amenities, schools and a monthly cost estimate for this Aurelia Properties listing.",
        "active": "properties.html",
    }),
    ("about.html", build_about, {
        "title": "About — Aurelia Properties",
        "description": "Sixteen years, six neighbourhoods and a deliberate refusal to grow faster than we can staff. The story, the principles and the team behind Aurelia Properties.",
        "active": "about.html",
    }),
    ("services.html", build_services, {
        "title": "Services — Aurelia Properties",
        "description": "Buyer and seller representation, property valuation, investment advice, relocation and property management. Every engagement retained in writing, with a flat fee agreed before work begins.",
        "active": "services.html",
    }),
    ("neighborhoods.html", build_neighborhoods, {
        "title": "Neighborhood Guides — Aurelia Properties",
        "description": "Detailed guides to the six neighbourhoods we work: the Harbor District, Northwood, Old Town, Lakeside, Riverside and Canyon.",
        "active": "neighborhoods.html",
    }),
    ("insights.html", build_insights, {
        "title": "The Aurelia Journal — Market Analysis and Real Estate Insights",
        "description": "Market analysis, listing case studies and real estate insights written by the agents doing the work in the San Francisco Bay Area.",
        "active": "insights.html",
    }),
    ("post.html", build_post, {
        "title": "Journal — Aurelia Properties",
        "description": "An article from the Aurelia Journal.",
        "active": "insights.html",
    }),
    ("contact.html", build_contact, {
        "title": "Contact — Aurelia Properties",
        "description": "Request a free property valuation, book a consultation or talk to an Aurelia Properties agent. Offices in San Francisco and San Mateo. We reply within one business day.",
        "active": "contact.html",
    }),
    ("legal.html", build_legal, {
        "title": "Privacy & Terms — Aurelia Properties",
        "description": "Privacy policy and terms of use for the Aurelia Properties website, in plain language.",
        "active": "legal.html",
    }),
    ("404.html", build_404, {
        "title": "Page not found — Aurelia Properties",
        "description": "The page you were looking for could not be found.",
        "active": "",
    }),
]


SITE_URL = "https://aureliaproperties.example.com"

ROBOTS = """User-agent: *
Allow: /

Sitemap: {url}/sitemap.xml
"""

SITEMAP_PAGES = [
    ("index.html", "1.0", "weekly"),
    ("properties.html", "0.9", "daily"),
    ("about.html", "0.7", "monthly"),
    ("services.html", "0.8", "monthly"),
    ("neighborhoods.html", "0.7", "monthly"),
    ("insights.html", "0.7", "weekly"),
    ("contact.html", "0.8", "monthly"),
    ("legal.html", "0.3", "yearly"),
]


def write_sitemap():
    urls = []
    for path, priority, freq in SITEMAP_PAGES:
        urls.append(
            f"  <url>\n"
            f"    <loc>{SITE_URL}/{path}</loc>\n"
            f"    <lastmod>2026-10-22</lastmod>\n"
            f"    <changefreq>{freq}</changefreq>\n"
            f"    <priority>{priority}</priority>\n"
            f"  </url>"
        )

    # Every listing and article gets its own entry.
    listing_urls = []
    for pid in PROPERTIES:
        listing_urls.append(
            f"  <url>\n"
            f"    <loc>{SITE_URL}/property.html?id={pid}</loc>\n"
            f"    <lastmod>2026-10-22</lastmod>\n"
            f"    <changefreq>weekly</changefreq>\n"
            f"    <priority>0.8</priority>\n"
            f"  </url>"
        )

    post_urls = []
    for slug in POST_SLUGS:
        post_urls.append(
            f"  <url>\n"
            f"    <loc>{SITE_URL}/post.html?slug={slug}</loc>\n"
            f"    <lastmod>2026-10-22</lastmod>\n"
            f"    <changefreq>monthly</changefreq>\n"
            f"    <priority>0.6</priority>\n"
            f"  </url>"
        )

    xml = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + "\n".join(urls + listing_urls + post_urls)
        + "\n</urlset>\n"
    )

    with open(os.path.join(ROOT, "sitemap.xml"), "w", encoding="utf-8") as fh:
        fh.write(xml)

    with open(os.path.join(ROOT, "robots.txt"), "w", encoding="utf-8") as fh:
        fh.write(ROBOTS.format(url=SITE_URL))

    print(f"wrote sitemap.xml ({len(urls) + len(listing_urls) + len(post_urls)} urls)")
    print("wrote robots.txt")


def build() -> None:
    for filename, builder, opts in PAGES:
        html = layout(
            filename=filename,
            title=opts["title"],
            description=opts["description"],
            active=opts["active"],
            body=builder(),
        )
        with open(os.path.join(ROOT, filename), "w", encoding="utf-8") as fh:
            fh.write(html)
        print(f"wrote {filename}")

    write_sitemap()


if __name__ == "__main__":
    build()
