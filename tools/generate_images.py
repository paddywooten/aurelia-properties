#!/usr/bin/env python3
"""
Procedural SVG artwork generator for the Aurelia Properties site.

Every listing, neighborhood and gallery image on the site is generated here so
the repository stays self-contained (no binary blobs, no hotlinked assets).

Usage:  python3 tools/generate_images.py
Output: assets/img/*.svg
"""

from __future__ import annotations

import math
import os
import random

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "assets", "img")

# --------------------------------------------------------------------------
# palettes: (sky_top, sky_bottom, sun, ground, ground_dark, structure,
#             structure_dark, roof, accent, haze)
# --------------------------------------------------------------------------
PALETTES = {
    "dawn":      ("#2b3f6b", "#e9a87c", "#ffd9a0", "#6f7f66", "#4e5c4a", "#f2ece1", "#d8cebb", "#4a4238", "#c46b4a", "#f6c8a0"),
    "golden":    ("#7fb2d9", "#f6d9a8", "#fff0c2", "#8f9468", "#6b7350", "#fbf6ec", "#e3d9c6", "#6b5544", "#d98a52", "#fbe3b8"),
    "noon":      ("#4a8fc7", "#bcdcf0", "#fdf6dc", "#7d9464", "#5d7350", "#ffffff", "#e6e1d5", "#54606b", "#3f7d63", "#dbeefb"),
    "dusk":      ("#1f2b4d", "#8a5b83", "#ffb37a", "#3d4a4a", "#2b3636", "#2f3a4a", "#243040", "#1d2530", "#e08a5a", "#c98aa6"),
    "mist":      ("#93a9b5", "#dfe6e4", "#f2f0e8", "#6f7d76", "#556059", "#f4f2ec", "#dedad0", "#5f6a68", "#7f9c8c", "#e3ecec"),
    "coast":     ("#3f86c4", "#cfeaf7", "#fffbe8", "#d9c9a8", "#b9a582", "#ffffff", "#e9e4d8", "#43607a", "#2b8a9b", "#bfe6f2"),
    "alpine":    ("#5b93c9", "#dbeaf6", "#ffffff", "#6f8464", "#4f6349", "#f7f4ee", "#e0dbd0", "#4a5560", "#5c8f7a", "#e8f2fa"),
    "desert":    ("#a97fb5", "#f3c98e", "#ffe9b8", "#c69c6d", "#9d7748", "#f6e7d4", "#dfcdb4", "#7a5b45", "#d1603f", "#f6d3a4"),
}

W, H = 1200, 800


def lerp(a, b, t):
    return tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3))


def hexc(rgb):
    return "#%02x%02x%02x" % rgb


def parse(c):
    c = c.lstrip("#")
    return tuple(int(c[i:i + 2], 16) for i in (0, 2, 4))


def shade(color, factor):
    r, g, b = parse(color)
    if factor >= 1:
        f = factor
        r, g, b = min(255, int(r * f)), min(255, int(g * f)), min(255, int(b * f))
    else:
        r, g, b = int(r * factor), int(g * factor), int(b * factor)
    return hexc((r, g, b))


def svg_open(defs=""):
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" '
        f'width="{W}" height="{H}" role="img" preserveAspectRatio="xMidYMid slice">'
        f"<defs>{defs}</defs>"
    )


def sky_defs(pid, pal):
    top, bottom, sun, ground, gdark, s1, s2, roof, accent, haze = [parse(c) for c in pal]
    grain_dots = grain_pattern(pid)
    return f"""
    <linearGradient id="sky{pid}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="{hexc(top)}"/>
      <stop offset="62%" stop-color="{hexc(lerp(top, bottom, .55))}"/>
      <stop offset="100%" stop-color="{hexc(bottom)}"/>
    </linearGradient>
    <linearGradient id="grd{pid}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="{hexc(ground)}"/>
      <stop offset="100%" stop-color="{hexc(gdark)}"/>
    </linearGradient>
    <linearGradient id="wall{pid}" x1="0" y1="0" x2="0.4" y2="1">
      <stop offset="0%" stop-color="{hexc(s1)}"/>
      <stop offset="100%" stop-color="{hexc(s2)}"/>
    </linearGradient>
    <linearGradient id="glass{pid}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="{hexc(haze)}"/>
      <stop offset="55%" stop-color="{hexc(accent)}"/>
      <stop offset="100%" stop-color="{hexc(s2)}"/>
    </linearGradient>
    <radialGradient id="sun{pid}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="{hexc(sun)}" stop-opacity="0.95"/>
      <stop offset="60%" stop-color="{hexc(sun)}" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="{hexc(sun)}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="haze{pid}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="{hexc(haze)}" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="{hexc(haze)}" stop-opacity="0"/>
    </linearGradient>
    <filter id="soft{pid}" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="7"/>
    </filter>
    <pattern id="grain{pid}" width="200" height="200" patternUnits="userSpaceOnUse">
      {grain_dots}
    </pattern>
    <linearGradient id="wood{pid}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#6b4a2f"/>
      <stop offset="45%" stop-color="#8a6339"/>
      <stop offset="100%" stop-color="#5c3f27"/>
    </linearGradient>
    """


def grain_pattern(pid: int, count: int = 24) -> str:
    """A cheap tiled noise pattern.

    A full-canvas feTurbulence filter is far too expensive to rasterise when
    dozens of these images appear on one page, so the film-grain is built from
    a small repeating tile of translucent dots instead.
    """
    rng = random.Random(9000 + pid)
    tile = 200
    dots = []
    for _ in range(count):
        x = rng.uniform(0, tile)
        y = rng.uniform(0, tile)
        r = rng.uniform(0.6, 2.2)
        o = rng.uniform(0.03, 0.10)
        dots.append(
            f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{r:.1f}" fill="#ffffff" opacity="{o:.2f}"/>'
        )
        dots.append(
            f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{r:.1f}" fill="#000000" opacity="{o*0.75:.2f}"/>'
        )
    return "".join(dots)


def hills(rng, y, pal, pid, count=3, amp=70):
    ground, gdark = parse(pal[3]), parse(pal[4])
    out = []
    for i in range(count):
        base = lerp(ground, gdark, 0.15 + i * 0.22)
        pts = [f"0,{H}"]
        step = W // 9
        for x in range(0, W + step, step):
            h = y - abs(math.sin(x / (240 + i * 90) + rng.random() * 0.4)) * amp * (1 - i * 0.18)
            pts.append(f"{x:.0f},{h:.0f}")
        pts.append(f"{W},{H}")
        out.append(f'<polygon points="{" ".join(pts)}" fill="{hexc(base)}" opacity="{0.55 + i * 0.15}"/>')
    return "".join(out)


def tree(x, base_y, h, pal, rng):
    dark = shade(pal[9], 0.62)
    mid = shade(pal[9], 0.85)
    trunk_w = max(3, h * 0.045)
    out = [
        f'<rect x="{x - trunk_w/2:.1f}" y="{base_y - h*0.42:.1f}" width="{trunk_w:.1f}" '
        f'height="{h*0.42:.1f}" fill="#4a3a2c"/>'
    ]
    for i in range(3):
        r = h * (0.36 - i * 0.07)
        cy = base_y - h * (0.46 + i * 0.17)
        cx = x + rng.uniform(-h * 0.06, h * 0.06)
        fill = mid if i == 0 else dark
        out.append(f'<ellipse cx="{cx:.1f}" cy="{cy:.1f}" rx="{r*0.85:.1f}" ry="{r:.1f}" fill="{fill}"/>')
    return "".join(out)


def bush(x, y, w, pal, rng):
    base = shade(pal[3], 0.85)
    hi = shade(pal[9], 0.95)
    out = []
    for i in range(3):
        cx = x + rng.uniform(-w * 0.25, w * 0.25)
        r = w * rng.uniform(0.28, 0.42)
        out.append(f'<ellipse cx="{cx:.1f}" cy="{y - r*0.35:.1f}" rx="{r:.1f}" ry="{r*0.75:.1f}" fill="{hi if i == 0 else base}"/>')
    return "".join(out)


def window_block(x, y, w, h, pid, lit=True, cols=2, rows=1):
    out = [
        f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="3" fill="url(#glass{pid})" '
        f'stroke="rgba(35,40,45,.35)" stroke-width="3"/>'
    ]
    if lit:
        out.append(f'<rect x="{x+3}" y="{y+3}" width="{max(2, w*0.22):.1f}" height="{max(2, h*0.34):.1f}" '
                   f'fill="rgba(255,240,200,.45)"/>')
    for c in range(1, cols):
        cx = x + w * c / cols
        out.append(f'<line x1="{cx:.1f}" y1="{y}" x2="{cx:.1f}" y2="{y+h}" stroke="rgba(35,40,45,.4)" stroke-width="2.5"/>')
    for r in range(1, rows):
        ry = y + h * r / rows
        out.append(f'<line x1="{x}" y1="{ry:.1f}" x2="{x+w}" y2="{ry:.1f}" stroke="rgba(35,40,45,.4)" stroke-width="2.5"/>')
    return "".join(out)


def door(x, y, w, h, pid):
    return (
        f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="url(#wood{pid})"/>'
        f'<circle cx="{x+w*0.78:.1f}" cy="{y+h*0.52:.1f}" r="{min(w,h)*0.06:.1f}" fill="#e8d9a8"/>'
    )


def grain(pid):
    return f'<rect width="{W}" height="{H}" fill="url(#grain{pid})" opacity="0.55"/>'


def vignette():
    return (
        f'<rect width="{W}" height="{H}" fill="none"/>'
        f'<radialGradient id="vig" cx="50%" cy="45%" r="72%">'
        f'<stop offset="60%" stop-color="rgba(0,0,0,0)"/>'
        f'<stop offset="100%" stop-color="rgba(0,0,0,.28)"/></radialGradient>'
        f'<rect width="{W}" height="{H}" fill="url(#vig)"/>'
    )


# --------------------------------------------------------------------------
# scenes
# --------------------------------------------------------------------------

def scene_exterior(pid, pal, rng, style="modern"):
    top, bottom, sun, ground, gdark, s1, s2, roof, accent, haze = pal
    gy = 520
    out = [svg_open(sky_defs(pid, pal))]
    out.append(f'<rect width="{W}" height="{H}" fill="url(#sky{pid})"/>')
    sunx, suny = rng.uniform(180, 1020), rng.uniform(120, 250)
    out.append(f'<circle cx="{sunx:.0f}" cy="{suny:.0f}" r="150" fill="url(#sun{pid})"/>')
    out.append(f'<circle cx="{sunx:.0f}" cy="{suny:.0f}" r="46" fill="{sun}" opacity="0.9"/>')
    out.append(hills(rng, gy - 40, pal, pid, count=3, amp=90))
    out.append(f'<rect x="0" y="{gy}" width="{W}" height="{H-gy}" fill="url(#grd{pid})"/>')
    out.append(f'<rect x="0" y="{gy}" width="{W}" height="70" fill="url(#haze{pid})"/>')

    cx = W * rng.uniform(0.44, 0.56)
    if style == "modern":
        bw, bh = 460, 250
        x, y = cx - bw / 2, gy - bh
        out.append(f'<rect x="{x}" y="{y}" width="{bw}" height="{bh}" fill="url(#wall{pid})"/>')
        out.append(f'<rect x="{x-18}" y="{y-16}" width="{bw+36}" height="16" fill="{roof}"/>')
        out.append(f'<rect x="{x+bw*0.52}" y="{y-72}" width="{bw*0.44}" height="72" fill="url(#wall{pid})"/>')
        out.append(f'<rect x="{x+bw*0.50}" y="{y-80}" width="{bw*0.46}" height="10" fill="{roof}"/>')
        out.append(window_block(x + 40, y + 55, 150, 120, pid, cols=3))
        out.append(window_block(x + 230, y + 40, 190, 135, pid, cols=3))
        out.append(door(x + 40, y + bh - 92, 74, 92, pid))
        out.append(f'<rect x="{x-30}" y="{gy-14}" width="{bw+60}" height="14" fill="{shade(accent,.75)}"/>')
    elif style == "classic":
        bw, bh = 400, 240
        x, y = cx - bw / 2, gy - bh
        out.append(f'<rect x="{x}" y="{y}" width="{bw}" height="{bh}" fill="url(#wall{pid})"/>')
        out.append(f'<polygon points="{x-26},{y} {cx},{y-118} {x+bw+26},{y}" fill="{roof}"/>')
        out.append(f'<rect x="{cx-42}" y="{y-190}" width="84" height="76" fill="url(#wall{pid})"/>')
        out.append(f'<polygon points="{cx-52},{y-190} {cx},{y-238} {cx+52},{y-190}" fill="{roof}"/>')
        out.append(window_block(x + 46, y + 54, 84, 92, pid, cols=2, rows=2))
        out.append(window_block(x + 160, y + 40, 84, 92, pid, cols=2, rows=2))
        out.append(window_block(x + 262, y + 54, 84, 92, pid, cols=2, rows=2))
        out.append(door(x + 168, y + bh - 108, 68, 108, pid))
        out.append(f'<rect x="{x-24}" y="{gy-12}" width="{bw+48}" height="12" fill="{shade(accent,.8)}"/>')
    elif style == "coastal":
        bw, bh = 420, 210
        x, y = cx - bw / 2, gy - bh
        out.append(f'<rect x="{x}" y="{y}" width="{bw}" height="{bh}" fill="url(#wall{pid})"/>')
        out.append(f'<polygon points="{x-30},{y} {cx},{y-96} {x+bw+30},{y}" fill="{roof}"/>')
        out.append(f'<rect x="{x+bw*0.6}" y="{y-62}" width="76" height="62" fill="url(#wall{pid})"/>')
        out.append(f'<rect x="{x+bw*0.6-8}" y="{y-70}" width="92" height="10" fill="{roof}"/>')
        out.append(window_block(x + 44, y + 44, 118, 108, pid, cols=3))
        out.append(window_block(x + 196, y + 44, 118, 108, pid, cols=3))
        out.append(door(x + 330, y + bh - 96, 62, 96, pid))
        out.append(f'<rect x="0" y="{gy+96}" width="{W}" height="26" fill="#2b8a9b" opacity=".55"/>')
    elif style == "villa":
        bw, bh = 520, 280
        x, y = cx - bw / 2, gy - bh
        out.append(f'<rect x="{x}" y="{y}" width="{bw}" height="{bh}" fill="url(#wall{pid})"/>')
        out.append(f'<rect x="{x-20}" y="{y-18}" width="{bw+40}" height="18" fill="{roof}"/>')
        out.append(f'<rect x="{x+bw*0.18}" y="{y-58}" width="{bw*0.4}" height="58" fill="url(#wall{pid})"/>')
        out.append(f'<rect x="{x+bw*0.16}" y="{y-66}" width="{bw*0.44}" height="10" fill="{roof}"/>')
        out.append(window_block(x + 44, y + 62, 130, 120, pid, cols=3))
        out.append(window_block(x + 210, y + 44, 150, 140, pid, cols=3))
        out.append(window_block(x + 396, y + 62, 92, 120, pid, cols=2))
        out.append(door(x + 200, y + bh - 108, 76, 108, pid))
        # pool
        out.append(f'<rect x="{cx-300}" y="{gy+150}" width="600" height="66" rx="10" fill="#4aa8c0" opacity=".85"/>')
        out.append(f'<rect x="{cx-300}" y="{gy+150}" width="600" height="66" rx="10" fill="none" stroke="#ffffff" stroke-width="4" opacity=".6"/>')
        for i in range(4):
            out.append(f'<line x1="{cx-260+i*150}" y1="{gy+160}" x2="{cx-230+i*150}" y2="{gy+206}" stroke="#ffffff" stroke-width="3" opacity=".35"/>')
    else:  # townhouse
        bw, bh = 340, 330
        x, y = cx - bw / 2, gy - bh
        out.append(f'<rect x="{x}" y="{y}" width="{bw}" height="{bh}" fill="url(#wall{pid})"/>')
        out.append(f'<rect x="{x-10}" y="{y-16}" width="{bw+20}" height="16" fill="{roof}"/>')
        for row in range(3):
            out.append(window_block(x + 38, y + 36 + row * 92, 84, 66, pid, cols=2))
            out.append(window_block(x + 156, y + 36 + row * 92, 84, 66, pid, cols=2))
            out.append(window_block(x + 252, y + 36 + row * 92, 60, 66, pid, cols=2))
        out.append(door(x + 150, y + bh - 92, 60, 92, pid))
        out.append(f'<rect x="{x-16}" y="{gy-10}" width="{bw+32}" height="10" fill="{shade(accent,.8)}"/>')

    # landscaping
    for i in range(7):
        tx = 60 + i * 175 + rng.uniform(-30, 30)
        if abs(tx - cx) < 150:
            continue
        out.append(tree(tx, gy + rng.uniform(4, 30), rng.uniform(110, 190), pal, rng))
    out.append(bush(cx + rng.uniform(180, 260), gy + 20, 120, pal, rng))
    out.append(bush(cx - rng.uniform(200, 280), gy + 26, 110, pal, rng))
    # path
    out.append(f'<path d="M {cx-44} {gy} L {cx+44} {gy} L {cx+90} {H} L {cx-90} {H} Z" fill="{shade(ground,1.12)}" opacity=".55"/>')
    out.append(grain(pid))
    out.append(vignette())
    out.append("</svg>")
    return "".join(out)


def scene_interior(pid, pal, rng, kind="living"):
    wall = pal[5]
    accent = pal[8]
    out = [svg_open(sky_defs(pid, pal))]
    out.append(f'<rect width="{W}" height="{H}" fill="{wall}"/>')
    out.append(f'<rect x="0" y="0" width="{W}" height="{H}" fill="url(#haze{pid})" opacity=".35"/>')
    floor_y = 545
    out.append(f'<rect x="0" y="{floor_y}" width="{W}" height="{H-floor_y}" fill="#8a6a4a"/>')
    for i in range(14):
        y = floor_y + (H - floor_y) * (i + 1) / 14
        out.append(f'<line x1="0" y1="{y:.0f}" x2="{W}" y2="{y:.0f}" stroke="#6f5236" stroke-width="2" opacity=".4"/>')
    for i in range(16):
        x = W * (i + 0.5) / 16
        out.append(f'<line x1="{x:.0f}" y1="{floor_y}" x2="{W/2 + (x-W/2)*1.7:.0f}" y2="{H}" stroke="#6f5236" stroke-width="2" opacity=".25"/>')

    if kind == "living":
        # skirting + wall/floor junction
        out.append(f'<rect x="0" y="{floor_y-14}" width="{W}" height="14" fill="{shade(wall,.6)}"/>')
        # large window with view
        out.append(f'<rect x="90" y="70" width="470" height="330" rx="6" fill="url(#glass{pid})" stroke="{shade(wall,.55)}" stroke-width="14"/>')
        out.append(f'<line x1="325" y1="70" x2="325" y2="400" stroke="{shade(wall,.55)}" stroke-width="10"/>')
        out.append(f'<circle cx="440" cy="150" r="44" fill="{pal[2]}" opacity=".8"/>')
        out.append(f'<polygon points="90,400 220,290 330,400" fill="{shade(pal[4],.9)}" opacity=".8"/>')
        out.append(f'<polygon points="330,400 440,300 560,400" fill="{shade(pal[4],.95)}" opacity=".8"/>')
        # rug
        out.append(f'<ellipse cx="640" cy="660" rx="430" ry="92" fill="{shade(accent,1.12)}" opacity=".3"/>')
        # sofa (back, seat, arms, cushions, legs)
        out.append(f'<ellipse cx="640" cy="602" rx="250" ry="26" fill="#3a2a1a" opacity=".28"/>')
        out.append(f'<rect x="330" y="392" width="620" height="150" rx="22" fill="{shade(accent,.92)}"/>')
        out.append(f'<rect x="356" y="318" width="568" height="120" rx="26" fill="{accent}"/>')
        for i in range(4):
            out.append(f'<rect x="{392+i*138}" y="286" width="108" height="76" rx="18" fill="{shade(accent,1.22)}"/>')
        out.append(f'<rect x="306" y="360" width="70" height="182" rx="20" fill="{shade(accent,.98)}"/>')
        out.append(f'<rect x="904" y="360" width="70" height="182" rx="20" fill="{shade(accent,.98)}"/>')
        out.append(f'<rect x="330" y="528" width="620" height="30" rx="10" fill="#5a4128"/>')
        for lx in (366, 900):
            out.append(f'<rect x="{lx}" y="552" width="18" height="26" fill="#4a3623"/>')
        # coffee table
        out.append(f'<ellipse cx="640" cy="700" rx="190" ry="46" fill="#4a3623" opacity=".3"/>')
        out.append(f'<ellipse cx="640" cy="686" rx="190" ry="44" fill="#7a5a3c"/>')
        out.append(f'<ellipse cx="640" cy="678" rx="190" ry="44" fill="#8d6a47"/>')
        out.append(f'<rect x="628" y="678" width="24" height="52" fill="#5a4128"/>')
        out.append(f'<ellipse cx="560" cy="664" rx="34" ry="10" fill="{shade(accent,1.3)}"/>')
        # pendant light
        out.append(f'<line x1="640" y1="0" x2="640" y2="120" stroke="#3b3b3b" stroke-width="5"/>')
        out.append(f'<path d="M 600 120 L 680 120 L 655 175 L 625 175 Z" fill="#3b3b3b"/>')
        out.append(f'<circle cx="640" cy="182" r="14" fill="{pal[2]}" opacity=".9"/>')
        # plant
        out.append(tree(1120, 600, 230, pal, rng))
    elif kind == "kitchen":
        out.append(f'<rect x="0" y="0" width="{W}" height="90" fill="{shade(wall,.85)}"/>')
        out.append(f'<rect x="0" y="90" width="{W}" height="24" fill="{shade(wall,.65)}"/>')
        # cabinets
        out.append(f'<rect x="90" y="180" width="1020" height="250" fill="{shade(wall,.8)}"/>')
        out.append(f'<rect x="70" y="410" width="1060" height="40" rx="6" fill="#3b3b3b"/>')
        for i in range(6):
            out.append(f'<rect x="{110+i*168}" y="200" width="148" height="110" rx="5" fill="{shade(wall,.95)}" stroke="{shade(wall,.65)}" stroke-width="3"/>')
            out.append(f'<rect x="{110+i*168}" y="320" width="148" height="110" rx="5" fill="{shade(wall,.95)}" stroke="{shade(wall,.65)}" stroke-width="3"/>')
        out.append(f'<rect x="420" y="140" width="380" height="40" rx="8" fill="#9aa3a8"/>')
        for i in range(5):
            out.append(f'<circle cx="{460+i*72}" cy="160" r="7" fill="#ffffff" opacity=".7"/>')
        # island
        out.append(f'<ellipse cx="600" cy="700" rx="330" ry="40" fill="#3a2a1a" opacity=".26"/>')
        out.append(f'<rect x="300" y="470" width="600" height="34" rx="8" fill="#4a3a2c"/>')
        out.append(f'<rect x="320" y="504" width="560" height="120" fill="#6f5236"/>')
        for i in range(3):
            out.append(f'<circle cx="{440+i*160}" cy="540" r="9" fill="#c9a227"/>')
        out.append(f'<ellipse cx="700" cy="452" rx="70" ry="16" fill="#dfe3e6"/>')
        out.append(f'<rect x="690" y="386" width="20" height="66" fill="#b9c1c6"/>')
        # fridge
        out.append(f'<rect x="70" y="200" width="150" height="290" rx="10" fill="#c9ced1" stroke="{shade(wall,.6)}" stroke-width="4"/>')
        out.append(f'<line x1="70" y1="330" x2="220" y2="330" stroke="{shade(wall,.6)}" stroke-width="4"/>')
        out.append(f'<rect x="195" y="260" width="10" height="46" rx="5" fill="#8b9296"/>')
        out.append(f'<rect x="195" y="360" width="10" height="70" rx="5" fill="#8b9296"/>')
        # pendant lights
        for px in (430, 600, 770):
            out.append(f'<line x1="{px}" y1="0" x2="{px}" y2="150" stroke="#3b3b3b" stroke-width="4"/>')
            out.append(f'<path d="M {px-34} 150 L {px+34} 150 L {px+18} 196 L {px-18} 196 Z" fill="#3b3b3b"/>')
            out.append(f'<circle cx="{px}" cy="202" r="11" fill="{pal[2]}" opacity=".9"/>')
    else:  # bedroom
        out.append(f'<rect x="0" y="{floor_y-14}" width="{W}" height="14" fill="{shade(wall,.6)}"/>')
        out.append(f'<rect x="120" y="230" width="520" height="300" rx="16" fill="{shade(wall,.92)}"/>')
        out.append(f'<rect x="120" y="150" width="520" height="120" rx="24" fill="{shade(wall,1.05)}"/>')
        out.append(f'<rect x="740" y="300" width="380" height="230" rx="14" fill="{shade(wall,.9)}"/>')
        out.append(f'<rect x="740" y="264" width="380" height="56" rx="16" fill="{shade(wall,1.03)}"/>')
        out.append(f'<rect x="160" y="300" width="230" height="100" rx="18" fill="#ffffff" opacity=".9"/>')
        out.append(f'<rect x="160" y="370" width="230" height="130" rx="14" fill="{shade(accent,1.15)}" opacity=".72"/>')
        out.append(f'<ellipse cx="360" cy="556" rx="270" ry="26" fill="#3a2a1a" opacity=".26"/>')
        out.append(f'<rect x="110" y="470" width="580" height="80" rx="12" fill="#6f5236"/>')
        out.append(f'<rect x="140" y="540" width="34" height="70" fill="#5a4128"/>')
        out.append(f'<rect x="626" y="540" width="34" height="70" fill="#5a4128"/>')
        # nightstands + lamps
        for nx in (44, 700):
            out.append(f'<rect x="{nx}" y="430" width="88" height="86" rx="8" fill="#6f5236"/>')
            out.append(f'<rect x="{nx+24}" y="356" width="40" height="76" rx="8" fill="{shade(pal[2],1.05)}"/>')
        # window with view
        out.append(f'<rect x="920" y="120" width="220" height="200" rx="8" fill="url(#glass{pid})" stroke="{shade(wall,.6)}" stroke-width="10"/>')
        out.append(f'<line x1="1030" y1="120" x2="1030" y2="320" stroke="{shade(wall,.6)}" stroke-width="8"/>')
        out.append(f'<circle cx="990" cy="180" r="28" fill="{pal[2]}" opacity=".85"/>')
        out.append(f'<polygon points="920,320 990,250 1050,320" fill="{shade(pal[4],.9)}" opacity=".8"/>')
        out.append(bush(1160, 610, 130, pal, rng))
        out.append(f'<ellipse cx="1160" cy="604" rx="70" ry="14" fill="#3a2a1a" opacity=".25"/>')
    out.append(grain(pid))
    out.append(vignette())
    out.append("</svg>")
    return "".join(out)


def scene_aerial(pid, pal, rng):
    out = [svg_open(sky_defs(pid, pal))]
    out.append(f'<rect width="{W}" height="{H}" fill="url(#grd{pid})"/>')
    for i in range(40):
        x, y = rng.uniform(0, W), rng.uniform(0, H)
        w, h = rng.uniform(60, 220), rng.uniform(40, 140)
        c = shade(rng.choice([pal[3], pal[4], pal[8], pal[9]]), rng.uniform(0.75, 1.15))
        out.append(f'<rect x="{x:.0f}" y="{y:.0f}" width="{w:.0f}" height="{h:.0f}" rx="8" fill="{c}" opacity=".65"/>')
    # road
    out.append(f'<path d="M -50 300 C 300 220, 700 460, 1250 320" stroke="#55585c" stroke-width="46" fill="none"/>')
    out.append(f'<path d="M -50 300 C 300 220, 700 460, 1250 320" stroke="#e8e2d2" stroke-width="4" fill="none" stroke-dasharray="26 22"/>')
    # river
    out.append(f'<path d="M -40 720 C 260 640, 420 800, 760 720 S 1180 640, 1260 700" stroke="#3f7fa0" stroke-width="58" fill="none" opacity=".8"/>')
    for i in range(26):
        tx, ty = rng.uniform(40, W - 40), rng.uniform(60, H - 60)
        out.append(tree(tx, ty, rng.uniform(30, 62), pal, rng))
    out.append(grain(pid))
    out.append(vignette())
    out.append("</svg>")
    return "".join(out)


def scene_portrait(pid, pal, rng):
    out = [svg_open(sky_defs(pid, pal))]
    top, bottom = parse(pal[0]), parse(pal[1])
    out.append(f'<rect width="{W}" height="{H}" fill="url(#sky{pid})"/>')
    out.append(f'<circle cx="{W*0.5:.0f}" cy="{H*0.36:.0f}" r="118" fill="{shade(pal[9],1.05)}" opacity=".85"/>')
    out.append(f'<path d="M {W*0.5-170} {H} C {W*0.5-150} {H*0.62}, {W*0.5+150} {H*0.62}, {W*0.5+170} {H} Z" fill="{shade(pal[8],.8)}"/>')
    out.append(f'<path d="M {W*0.5-52} {H*0.56} C {W*0.5-52} {H*0.72}, {W*0.5+52} {H*0.72}, {W*0.5+52} {H*0.56} Z" fill="{shade(pal[9],1.02)}"/>')
    out.append(grain(pid))
    out.append(vignette())
    out.append("</svg>")
    return "".join(out)


# --------------------------------------------------------------------------
# build sheet
# --------------------------------------------------------------------------
PROPERTY_STYLES = ["modern", "classic", "coastal", "villa", "townhouse"]


def build():
    os.makedirs(OUT, exist_ok=True)
    idx = 0

    def emit(name, svg):
        nonlocal idx
        path = os.path.join(OUT, name)
        with open(path, "w", encoding="utf-8") as fh:
            fh.write(svg)
        idx += 1

    # 12 listing heroes + galleries (3 extra each)
    for p in range(12):
        pal_name = list(PALETTES)[p % len(PALETTES)]
        pal = PALETTES[pal_name]
        style = PROPERTY_STYLES[p % len(PROPERTY_STYLES)]
        rng = random.Random(1000 + p)
        emit(f"property-{p+1:02d}.svg", scene_exterior(idx, pal, rng, style))
        for g, gk in enumerate(["living", "kitchen", "bedroom"]):
            rg = random.Random(2000 + p * 10 + g)
            emit(f"property-{p+1:02d}-{gk}.svg", scene_interior(idx, pal, rg, gk))

    # neighborhood cards
    for n, pname in enumerate(["harbor", "northwood", "oldtown", "lakeside", "riverside", "canyon"]):
        pal = PALETTES[list(PALETTES)[n % len(PALETTES)]]
        rng = random.Random(3000 + n)
        emit(f"neighborhood-{pname}.svg", scene_exterior(idx, pal, rng, PROPERTY_STYLES[n % len(PROPERTY_STYLES)]))

    # editorial / about / services
    for e, pname in enumerate(["story", "team", "office", "process", "valuation", "relocation", "staging", "landscape"]):
        pal = PALETTES[list(PALETTES)[(e + 2) % len(PALETTES)]]
        rng = random.Random(4000 + e)
        emit(f"editorial-{pname}.svg", scene_exterior(idx, pal, rng, PROPERTY_STYLES[e % len(PROPERTY_STYLES)]))

    # team portraits
    for i in range(6):
        pal = PALETTES[list(PALETTES)[i % len(PALETTES)]]
        rng = random.Random(5000 + i)
        emit(f"portrait-{i+1}.svg", scene_portrait(idx, pal, rng))

    # hero + misc
    pal = PALETTES["golden"]
    emit("hero.svg", scene_exterior(idx, pal, random.Random(9001), "modern"))
    pal = PALETTES["mist"]
    emit("map.svg", scene_aerial(idx, pal, random.Random(9002)))
    pal = PALETTES["dusk"]
    emit("cta-band.svg", scene_exterior(idx, pal, random.Random(9003), "modern"))
    pal = PALETTES["noon"]
    emit("about-hero.svg", scene_exterior(idx, pal, random.Random(9004), "classic"))

    print(f"generated {idx} svg files in {OUT}")


if __name__ == "__main__":
    build()
