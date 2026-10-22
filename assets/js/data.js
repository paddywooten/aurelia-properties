/* =========================================================================
   Aurelia Properties — Listing dataset
   A single source of truth for every property, neighborhood and team member.
   Exposed as window.AURELIA.data
   ========================================================================= */
(function () {
  "use strict";

  const AURELIA = (window.AURELIA = window.AURELIA || {});

  AURELIA.data = {
    company: {
      name: "Aurelia Properties",
      legal: "Aurelia Properties Group LLC",
      tagline: "Real estate, refined.",
      founded: 2009,
      phone: "+1 (415) 555-0188",
      phoneHref: "+14155550188",
      email: "hello@aureliaproperties.com",
      emailHref: "mailto:hello@aureliaproperties.com",
      address: "1180 Marina Vista Blvd, Suite 400",
      city: "San Francisco, CA 94107",
      hours: "Mon–Fri, 9:00am – 6:00pm PT",
      license: "DRE #01884421 · Bonded & Insured",
      blurb:
        "A boutique brokerage representing architecturally significant homes across the Bay Area and the Pacific Northwest. We sell fewer homes, and we sell them properly."
    },

    /* ------------------------------------------------------------------
       Properties
       price: number in USD. rent: monthly rent for rental listings.
       ------------------------------------------------------------------ */
    properties: [
      {
        id: "p-101",
        title: "Cliffside Glass Pavilion",
        address: "14 Sea Cliff Avenue",
        city: "Sea Cliff",
        state: "CA",
        zip: "94121",
        price: 4850000,
        type: "house",
        status: "for-sale",
        beds: 4,
        baths: 3.5,
        sqft: 3280,
        lot: "0.28 ac",
        yearBuilt: 2019,
        parking: 2,
        hoa: 0,
        featured: true,
        newListing: true,
        style: "modern",
        images: [
          "assets/img/property-01.svg",
          "assets/img/property-01-living.svg",
          "assets/img/property-01-kitchen.svg",
          "assets/img/property-01-bedroom.svg"
        ],
        summary:
          "A glass-walled pavilion cantilevered over the Pacific, with uninterrupted water views from every principal room.",
        description:
          "Set on a quiet bluff above Baker Beach, this architect-designed residence dissolves the line between interior and landscape. The main level opens through sliding glass walls to a cantilevered deck, offering 180-degree ocean views from Sea Cliff to the Golden Gate. Inside, a restrained palette of white oak, honed Calacatta marble and blackened steel keeps attention on the light. The primary suite occupies its own wing with a private terrace and a bathroom finished in book-matched travertine. A separate lower level provides a full guest apartment, media room and gym — rare for the bluff.",
        amenities: [
          "Ocean-facing deck with glass railings",
          "Chef's kitchen with butler's pantry",
          "Laakso limestone floors throughout",
          "Radiant heat on all levels",
          "Smart home with full Lutron integration",
          "Two-car garage with EV charging",
          "Primary suite with private terrace",
          "Lower-level guest apartment",
          "Fitness studio and sauna",
          "Whole-home water filtration",
          "Ducted vacuum system",
          "Custom millwork by local shop"
        ],
        agent: "a-1",
        features: ["Views", "New Construction", "Guest House"],
        schools: ["Vista Ridge Elementary — 0.4 mi", "Marina Preparatory — 1.1 mi", "Presidio Elementary — 2.3 mi"]
      },
      {
        id: "p-102",
        title: "The Linden Row",
        address: "220 Linden Street",
        city: "Noe Valley",
        state: "CA",
        zip: "94114",
        price: 2895000,
        type: "house",
        status: "for-sale",
        beds: 3,
        baths: 2,
        sqft: 2140,
        lot: "2,850 sq ft",
        yearBuilt: 1924,
        parking: 1,
        hoa: 0,
        featured: true,
        style: "classic",
        images: [
          "assets/img/property-02.svg",
          "assets/img/property-02-living.svg",
          "assets/img/property-02-kitchen.svg",
          "assets/img/property-02-bedroom.svg"
        ],
        summary:
          "A meticulously restored 1924 Edwardian with the original millwork, a garden studio and a walkable corner location.",
        description:
          "The Linden Row is a house of quiet craftsmanship — the kind that rewards a second look. Original box-beam ceilings, pocket doors and quarter-sawn oak floors have been carefully restored rather than replaced. The kitchen opens to a south-facing garden through a wall of French doors, and a detached studio at the rear of the lot — fully permitted, insulated and wired — offers a calm place to work. On the corner of Linden and 26th, the front porch sits above the street level and catches the afternoon light.",
        amenities: [
          "Original 1924 millwork and oak floors",
          "Detached permitted garden studio",
          "South-facing landscaped garden",
          "Renovated chef's kitchen",
          "Wood-burning fireplace with original mantel",
          "Full-height windows, original casings",
          "Secure basement storage",
          "Walk score of 96",
          "Fruit trees and raised beds",
          "Two-zone radiator heating"
        ],
        agent: "a-2",
        features: ["Historic", "Garden", "Walkable"],
        schools: ["Alvarado Elementary — 0.3 mi", "James Lick Middle — 0.9 mi", "Mission High — 1.6 mi"]
      },
      {
        id: "p-103",
        title: "Harborline Residences 12B",
        address: "4 Embarcadero Center, Unit 12B",
        city: "Embarcadero",
        state: "CA",
        zip: "94111",
        price: 1295000,
        type: "condo",
        status: "for-sale",
        beds: 2,
        baths: 2,
        sqft: 1380,
        lot: "—",
        yearBuilt: 2014,
        parking: 1,
        hoa: 685,
        featured: true,
        style: "townhouse",
        images: [
          "assets/img/property-03.svg",
          "assets/img/property-03-living.svg",
          "assets/img/property-03-kitchen.svg",
          "assets/img/property-03-bedroom.svg"
        ],
        summary:
          "A corner residence on the twelfth floor with a wraparound terrace over the Bay Bridge.",
        description:
          "Twelve floors above the Embarcadero, this corner unit captures light from three exposures. The great room opens directly to a wraparound terrace with views across the Bay Bridge to the East Bay hills. Interiors are calm and contemporary — wide-plank white oak, quartz counters and a kitchen island that seats six. Full-service building with a 25-metre lap pool, a residents' lounge and direct access to the Bay Trail.",
        amenities: [
          "Wraparound terrace, 480 sq ft",
          "Bay Bridge and Bay Trail views",
          "Floor-to-ceiling glazing",
          "Concierge and attended lobby",
          "25 m lap pool and fitness centre",
          "Two underground parking spaces",
          "Separate service entrance",
          "EV-ready charging bay",
          "In-unit laundry and utility room",
          "Storage cage, deeded"
        ],
        agent: "a-3",
        features: ["View", "High-Rise", "Pool"],
        schools: ["Rincon Elementary — 0.6 mi", "Presidio Middle — 1.4 mi"]
      },
      {
        id: "p-104",
        title: "Alder Creek Ranch",
        address: "8700 Alder Creek Road",
        city: "Woodside",
        state: "CA",
        zip: "94062",
        price: 3450000,
        type: "house",
        status: "for-sale",
        beds: 5,
        baths: 4,
        sqft: 4100,
        lot: "2.1 ac",
        yearBuilt: 1978,
        parking: 3,
        hoa: 0,
        featured: false,
        style: "villa",
        images: [
          "assets/img/property-04.svg",
          "assets/img/property-04-living.svg",
          "assets/img/property-04-kitchen.svg",
          "assets/img/property-04-bedroom.svg"
        ],
        summary:
          "Two and a half acres of level ground, a renovated ranch house and a pool that backs onto nothing but redwoods.",
        description:
          "Set behind a gated drive on a rare level parcel in Woodside, Alder Creek Ranch pairs a single-storey plan with a two-bedroom guest cottage. The main house was comprehensively renovated in 2021 — new roof, systems, kitchen and baths — while keeping its generous 1970s proportions and the original exposed-beam great room. A heated pool sits at the edge of the redwood grove, and the parcel is level, fenced and irrigated throughout.",
        amenities: [
          "2.1 level, fenced acres",
          "Heated swimming pool",
          "Two-bedroom guest cottage",
          "Gated private drive",
          "Redwood grove on two boundaries",
          "Renovated 2021 — systems, roof, kitchen",
          "Three-car garage with workshop",
          "Orchard with 40 fruit trees",
          "Irrigation on all zones",
          "Home generator, solar array",
          "Wine cellar, temperature controlled",
          "Direct trail access"
        ],
        agent: "a-4",
        features: ["Acreage", "Pool", "Guest House"],
        schools: ["Woodside Elementary — 1.2 mi", "Thornewood Elementary — 2.0 mi"]
      },
      {
        id: "p-105",
        title: "Cypress Court Villa",
        address: "7 Cypress Court",
        city: "Atherton",
        state: "CA",
        zip: "94027",
        price: 7950000,
        type: "house",
        status: "for-sale",
        beds: 6,
        baths: 7,
        sqft: 6850,
        lot: "1.4 ac",
        yearBuilt: 2016,
        parking: 4,
        hoa: 0,
        featured: true,
        style: "villa",
        images: [
          "assets/img/property-05.svg",
          "assets/img/property-05-living.svg",
          "assets/img/property-05-kitchen.svg",
          "assets/img/property-05-bedroom.svg"
        ],
        summary:
          "A six-bedroom compound built around a 60-foot lap pool, with a guest pavilion and a championship court.",
        description:
          "Cypress Court is a house built for long California summers. The main residence wraps around a 60-foot travertine-edged lap pool, with full-height sliding walls on three sides. Six suites are arranged across two levels, including a primary wing with dual dressing rooms and a private garden courtyard. Outside: a guest pavilion, a tennis court and a motor court for six. The build is recent, the systems are current, and the gardens are mature.",
        amenities: [
          "60-foot lap pool and spa",
          "Six ensuite bedrooms",
          "Detached guest pavilion",
          "Championship tennis court",
          "Motor court for six vehicles",
          "Formal dining, two kitchens",
          "Home cinema, 12 seats",
          "Wine wall, 900 bottles",
          "Elevator to all levels",
          "Staff suite with separate entry",
          "Full home automation",
          "Three fireplaces"
        ],
        agent: "a-1",
        features: ["Luxury", "Pool", "Guest House", "Tennis"],
        schools: ["Atherton Elementary — 0.7 mi", "Menlo-Atherton High — 2.1 mi"]
      },
      {
        id: "p-106",
        title: "The Wren Cottage",
        address: "58 Wren Street",
        city: "Bernal Heights",
        state: "CA",
        zip: "94110",
        price: 1295000,
        type: "house",
        status: "for-sale",
        beds: 2,
        baths: 1,
        sqft: 1120,
        lot: "2,975 sq ft",
        yearBuilt: 1908,
        parking: 1,
        hoa: 0,
        featured: false,
        style: "classic",
        images: [
          "assets/img/property-06.svg",
          "assets/img/property-06-living.svg",
          "assets/img/property-06-kitchen.svg",
          "assets/img/property-06-bedroom.svg"
        ],
        summary:
          "A storybook Edwardian cottage on a sunny Bernal block, with a deep garden and an original carriage house.",
        description:
          "One of the more intact cottages on this block, The Wren retains its 1908 façade — arched door surround, bay window and original ironwork — behind which is a thoroughly modern interior. A single-storey plan opens to a 90-foot garden with a mature lemon tree, and at the rear stands a carriage house that has been converted into a proper studio with a bathroom and kitchenette.",
        amenities: [
          "Original 1908 façade and ironwork",
          "90-foot deep south garden",
          "Mature lemon and plum trees",
          "Converted carriage-house studio",
          "Renovated kitchen with butler's pantry",
          "Radiant floors throughout",
          "Fenced side and rear yards",
          "Walk to Cortland Avenue",
          "City views from the upper level",
          "Off-street parking"
        ],
        agent: "a-2",
        features: ["Historic", "Garden", "Cottage"],
        schools: ["Bernal Heights Elementary — 0.2 mi", "Livingston Middle — 0.8 mi"]
      },
      {
        id: "p-107",
        title: "Shoreline Loft 5A",
        address: "601 Van Ness Avenue, Unit 5A",
        city: "Cow Hollow",
        state: "CA",
        zip: "94102",
        price: 3895000,
        type: "loft",
        status: "for-sale",
        beds: 2,
        baths: 2.5,
        sqft: 2460,
        lot: "—",
        yearBuilt: 2001,
        parking: 2,
        hoa: 892,
        featured: true,
        style: "townhouse",
        images: [
          "assets/img/property-07.svg",
          "assets/img/property-07-living.svg",
          "assets/img/property-07-kitchen.svg",
          "assets/img/property-07-bedroom.svg"
        ],
        summary:
          "A 2,460 sq ft loft with 22-foot ceilings, a private roof terrace and views to the church spires.",
        description:
          "The corner of the building's fifth and sixth floors was combined into a true loft: 22-foot ceilings, exposed steel, and a wall of steel-framed glass facing the bay. A private roof terrace above — reachable by a second staircase — offers outdoor space rare for this close to downtown. Two parking spaces, a private elevator landing and a deeded storage room complete the offering.",
        amenities: [
          "22-foot ceilings, exposed structure",
          "Private 700 sq ft roof terrace",
          "Steel-framed corner glazing",
          "Private elevator landing",
          "Two side-by-side parking spaces",
          "Deeded storage room",
          "Top-floor position — no overhead neighbours",
          "In-unit laundry",
          "Air conditioning throughout",
          "Wine storage, walk-in pantry"
        ],
        agent: "a-3",
        features: ["View", "Loft", "Penthouse"],
        schools: ["Alta Vista Elementary — 0.5 mi", "Town School for Boys — 0.7 mi"]
      },
      {
        id: "p-108",
        title: "Marina View Townhouse",
        address: "3310 Fillmore Street",
        city: "Marina District",
        state: "CA",
        zip: "94123",
        price: 2150000,
        type: "townhouse",
        status: "for-sale",
        beds: 3,
        baths: 2.5,
        sqft: 1890,
        lot: "1,240 sq ft",
        yearBuilt: 2012,
        parking: 1,
        hoa: 320,
        featured: false,
        style: "townhouse",
        images: [
          "assets/img/property-08.svg",
          "assets/img/property-08-living.svg",
          "assets/img/property-08-kitchen.svg",
          "assets/img/property-08-bedroom.svg"
        ],
        summary:
          "A tri-level townhouse two blocks from the Marina Green, with a rooftop deck and a ground-floor flex suite.",
        description:
          "Behind a gate on a quiet Marina block, this three-level townhouse offers 1,890 square feet arranged around a double-height stair. The main living level opens to a west-facing deck; the roof deck above takes in the Golden Gate and the Palace of Fine Arts. A ground-level suite with its own entrance works equally well as a guest room, office or au pair's quarters.",
        amenities: [
          "Private roof deck with Golden Gate views",
          "Double-height stair core",
          "Ground-floor suite with separate entry",
          "West-facing main-level deck",
          "Custom millwork throughout",
          "Gas fireplace, tile surround",
          "One-car garage + permit-ready pad",
          "Heat pump heating and cooling",
          "Walk to Marina Green and Chestnut",
          "HOA covers exterior and insurance"
        ],
        agent: "a-5",
        features: ["Rooftop", "Walkable", "Multi-Level"],
        schools: ["Marina Middle — 0.6 mi", "George Washington High — 1.0 mi"]
      },
      {
        id: "p-109",
        title: "Pine Hollow Estate",
        address: "1200 Pine Hollow Road",
        city: "Los Altos Hills",
        state: "CA",
        zip: "94024",
        price: 6420000,
        type: "house",
        status: "for-sale",
        beds: 5,
        baths: 5.5,
        sqft: 5480,
        lot: "1.9 ac",
        yearBuilt: 2008,
        parking: 3,
        hoa: 0,
        featured: true,
        style: "modern",
        images: [
          "assets/img/property-09.svg",
          "assets/img/property-09-living.svg",
          "assets/img/property-09-kitchen.svg",
          "assets/img/property-09-bedroom.svg"
        ],
        summary:
          "A contemporary hillside estate of glass and cedar overlooking the whole valley floor.",
        description:
          "Built into the contour of the hill, Pine Hollow is a house of planes — cantilevered concrete, cedar soffits and a continuous band of glass framing the valley from San Mateo to the foothills. The main floor holds a great room, formal dining and a dual-island kitchen; below, a level garden level contains a guest suite, gym and wine room. A sheltered motor court keeps the cars out of sight.",
        amenities: [
          "Panoramic valley and bay views",
          "Cantilevered concrete construction",
          "Cedar-clad interiors",
          "Dual-island kitchen with butler's pantry",
          "Lower-level guest suite",
          "Gym, sauna and steam shower",
          "Temperature-controlled wine room",
          "Three-car sheltered motor court",
          "Solar array with battery backup",
          "Native drought-tolerant landscaping",
          "Gated entry with intercom"
        ],
        agent: "a-4",
        features: ["View", "Luxury", "Modern"],
        schools: ["Los Altos Elementary — 1.5 mi", "Castilleja High — 2.4 mi"]
      },
      {
        id: "p-110",
        title: "Chapel Row Apartment 3",
        address: "812 Chapel Street, Apartment 3",
        city: "Mission District",
        state: "CA",
        zip: "94110",
        price: 4150000,
        type: "multi-family",
        status: "for-sale",
        beds: 6,
        baths: 4,
        sqft: 3800,
        lot: "3,150 sq ft",
        yearBuilt: 1906,
        parking: 4,
        hoa: 0,
        featured: false,
        style: "classic",
        images: [
          "assets/img/property-10.svg",
          "assets/img/property-10-living.svg",
          "assets/img/property-10-kitchen.svg",
          "assets/img/property-10-bedroom.svg"
        ],
        summary:
          "A well-run four-unit Edwardian with a legal ADU, strong tenancy and a walkable location.",
        description:
          "A handsome 1906 Edwardian converted to four legal units — three two-bedroom apartments and a garden-level ADU — with off-street parking for four cars. The building has been maintained to an unusually high standard: newer roof, sewer line and electrical, with original staircases and mouldings left intact. Current tenancy is stable, and the rear garden has been professionally landscaped with a mature wisteria.",
        amenities: [
          "Four legal units incl. garden ADU",
          "Off-street parking for four cars",
          "New roof, sewer and electrical",
          "Original staircases and mouldings",
          "Landscaped rear garden with wisteria",
          "Separate utility meters",
          "Laundry room, per unit",
          "Vacant ADU — flexible",
          "Zoned R-3(G)",
          "Walk to 24th and Mission"
        ],
        agent: "a-5",
        features: ["Multi-Family", "Investment", "Walkable"],
        schools: ["Mission High — 0.4 mi", "Bryant Elementary — 0.9 mi"]
      },
      {
        id: "p-111",
        title: "Dune House",
        address: "45 Coastal Highway",
        city: "Pacifica",
        state: "CA",
        zip: "94044",
        price: 1675000,
        type: "house",
        status: "for-sale",
        beds: 3,
        baths: 2.5,
        sqft: 1720,
        lot: "6,200 sq ft",
        yearBuilt: 1983,
        parking: 2,
        hoa: 0,
        featured: false,
        style: "coastal",
        images: [
          "assets/img/property-11.svg",
          "assets/img/property-11-living.svg",
          "assets/img/property-11-kitchen.svg",
          "assets/img/property-11-bedroom.svg"
        ],
        summary:
          "A cedar-clad beach house with a roof deck, an outdoor shower and sand under the fence line.",
        description:
          "Two blocks from the sand, Dune House is a shingled cedar home arranged across two levels with the ocean visible from nearly every window. The upper level holds the main living space and a roof deck with a built-in firepit; the lower level opens to a sheltered courtyard with an outdoor shower and a cedar hot tub.",
        amenities: [
          "Ocean views from most rooms",
          "Roof deck with built-in firepit",
          "Outdoor shower and cedar hot tub",
          "Two blocks to the beach",
          "Skylit stairwell to the roof deck",
          "Vaulted ceilings, exposed beams",
          "Fireplace with raised hearth",
          "Two-car garage, workshop bay",
          "Buried utilities",
          "Backup generator"
        ],
        agent: "a-2",
        features: ["Beach", "View", "Cabin"],
        schools: ["Pacifica's Linda Mar Elementary — 0.8 mi", "Terra Nova High — 2.6 mi"]
      },
      {
        id: "p-112",
        title: "Brookdale Mews",
        address: "92 Brookdale Lane",
        city: "Mill Valley",
        state: "CA",
        zip: "94941",
        price: 2350000,
        type: "townhouse",
        status: "pending",
        beds: 3,
        baths: 2.5,
        sqft: 1980,
        lot: "980 sq ft",
        yearBuilt: 2018,
        parking: 2,
        hoa: 415,
        featured: false,
        style: "townhouse",
        images: [
          "assets/img/property-12.svg",
          "assets/img/property-12-living.svg",
          "assets/img/property-12-kitchen.svg",
          "assets/img/property-12-bedroom.svg"
        ],
        summary:
          "A gated mews of eight townhouses at the edge of Mount Tamalpais, in escrow.",
        description:
          "One of eight townhouses in a gated mews development completed in 2018, tucked into the hillside at the foot of Mount Tamalpais. Each unit has a private entrance, an open main floor with a west-facing terrace, and a two-car garage directly beneath. The development is landscaped with native planting and shares a green with the adjacent open space.",
        amenities: [
          "Private entrance and terrace",
          "Two-car internal garage",
          "West-facing terrace with mountain light",
          "Secure gated development",
          "Native landscaping, shared green",
          "9 ft ceilings on main level",
          "Heat pump heating and cooling",
          "Oak floors, 9 ft ceilings",
          "Close to downtown Mill Valley",
          "HOA covers grounds and insurance"
        ],
        agent: "a-3",
        features: ["Gated", "Modern", "Newer"],
        schools: ["Mill Valley Elementary — 0.7 mi", "Mill Valley Middle — 1.1 mi"]
      }
    ],

    /* ------------------------------------------------------------------
       Rental listings
       ------------------------------------------------------------------ */
    rentals: [
      {
        id: "r-201",
        title: "Garden Flat 2",
        address: "18 Clement Street, Flat 2",
        city: "Clement Street",
        state: "CA",
        zip: "94118",
        rent: 4200,
        type: "apartment",
        beds: 2,
        baths: 1,
        sqft: 980,
        available: "Available now",
        images: ["assets/img/property-06.svg", "assets/img/property-06-living.svg", "assets/img/property-06-kitchen.svg"],
        summary: "A quiet rear garden flat with a private entrance, two blocks from Clement Street shops."
      },
      {
        id: "r-202",
        title: "North Beach Loft 4C",
        address: "640 Union Street, Unit 4C",
        city: "North Beach",
        state: "CA",
        zip: "94133",
        rent: 3650,
        type: "loft",
        beds: 1,
        baths: 1,
        sqft: 1100,
        available: "Available 1 Sept",
        images: ["assets/img/property-07.svg", "assets/img/property-07-living.svg"],
        summary: "A warehouse conversion with 16-foot ceilings, a mezzanine and a north-facing window wall."
      },
      {
        id: "r-203",
        title: "Berkeley Hills Retreat",
        address: "3050 Grizzly Peak Boulevard",
        city: "Berkeley Hills",
        state: "CA",
        zip: "94708",
        rent: 5500,
        type: "house",
        beds: 3,
        baths: 2,
        sqft: 1850,
        available: "Available now",
        images: ["assets/img/property-04.svg", "assets/img/property-04-living.svg"],
        summary: "A mid-century cabin among the redwoods, with a hot tub and views to the Bay."
      },
      {
        id: "r-204",
        title: "Sunset Studio 12",
        address: "1730 Irving Street, Unit 12",
        city: "Inner Sunset",
        state: "CA",
        zip: "94122",
        rent: 2400,
        type: "apartment",
        beds: 0,
        baths: 1,
        sqft: 520,
        available: "Available now",
        images: ["assets/img/property-03.svg", "assets/img/property-03-living.svg"],
        summary: "A bright, efficient studio a block from the park, with a shared garden and laundry."
      }
    ],

    /* ------------------------------------------------------------------
       Neighborhoods
       ------------------------------------------------------------------ */
    neighborhoods: [
      {
        slug: "harbor",
        name: "Harbor District",
        tagline: "Working waterfront, converted warehouses, salt air.",
        image: "assets/img/neighborhood-harbor.svg",
        blurb:
          "A dense, resilient quarter where the old canneries and shipping offices have become galleries, restaurants and light-industrial lofts. The ferry terminal anchors a morning commute, and the waterfront path is the best free walk in the city.",
        stats: { median: "$1,340,000", walk: "88", commute: "22 min", school: "7.4" },
        highlights: ["Ferry building & market", "Waterfront greenway", "Warehouse conversion lofts", "Sunday farmers' market"]
      },
      {
        slug: "northwood",
        name: "Northwood",
        tagline: "Tree-lined streets, excellent schools, quiet evenings.",
        image: "assets/img/neighborhood-northwood.svg",
        blurb:
          "Northwood is the neighbourhood people move to and stay in. Mature canopy, low traffic, and a main street that still supports a grocer, a hardware store and a café. The schools are consistently among the strongest in the region.",
        stats: { median: "$2,150,000", walk: "71", commute: "28 min", school: "9.1" },
        highlights: ["Top-rated elementary", "Nature preserve trailhead", "Independent bookshop", "Annual block party"]
      },
      {
        slug: "oldtown",
        name: "Old Town",
        tagline: "Victorians, corner cafés and the best light in the city.",
        image: "assets/img/neighborhood-oldtown.svg",
        blurb:
          "One of the few neighbourhoods where the original street grid survives intact. The bay windows catch the afternoon sun, the sidewalks are wide, and a walk along the avenue takes you past nine architectural styles in a single block.",
        stats: { median: "$1,780,000", walk: "95", commute: "19 min", school: "6.9" },
        highlights: ["Preservation district", "Historic cinema", "Award-winning bakeries", "Ferry to Angel Island"]
      },
      {
        slug: "lakeside",
        name: "Lakeside",
        tagline: "Wake-up swims and trailheads before work.",
        image: "assets/img/neighborhood-lakeside.svg",
        blurb:
          "A lakefront district shaped by a twenty-two mile shoreline path. Sunrise swimmers, mid-morning kayakers, and a path that stays busy until dark. Housing ranges from 1960s condos to architect-designed new builds.",
        stats: { median: "$1,095,000", walk: "79", commute: "26 min", school: "8.2" },
        highlights: ["22-mile shoreline path", "Community sailing club", "Saturday farmers' market", "New waterfront development"]
      },
      {
        slug: "riverside",
        name: "Riverside",
        tagline: "Big skies, small footprint, easy living.",
        image: "assets/img/neighborhood-riverside.svg",
        blurb:
          "East of the main city, the river widens and the lots grow. Riverside is where the region still feels rural — equestrian paths, orchards and a downtown that has grown into a proper collection of restaurants and shops.",
        stats: { median: "$1,460,000", walk: "62", commute: "34 min", school: "8.6" },
        highlights: ["Equestrian trails", "Riverfront park", "Restored rail depot", " orchards & vineyards"]
      },
      {
        slug: "canyon",
        name: "Canyon",
        tagline: "Above it all, on the edge of the ridgeline.",
        image: "assets/img/neighborhood-canyon.svg",
        blurb:
          "The higher ground. Canyon sits on the shoulder of the ridge where the light comes in long over the valley and the houses get bigger. Properties here are fewer, further apart, and worth the drive.",
        stats: { median: "$2,780,000", walk: "34", commute: "38 min", school: "9.4" },
        highlights: ["Ridgeline trail network", "Sunrise viewpoints", "Larger parcels", "Rural character"]
      }
    ],

    /* ------------------------------------------------------------------
       Team
       ------------------------------------------------------------------ */
    team: [
      { id: "a-1", name: "Elena Marchetti", role: "Founding Partner", image: "assets/img/portrait-1.svg", licence: "DRE #01288421", phone: "+1 (415) 555-0191", email: "elena@aureliaproperties.com", bio: "Elena founded Aurelia in 2009 after eleven years at a global brokerage. She is known for a quiet, exacting style and a refusal to list a property she would not live in herself." },
      { id: "a-2", name: "Marcus Oyelaran", role: "Partner, Sales", image: "assets/img/portrait-2.svg", licence: "DRE #01455210", phone: "+1 (415) 555-0192", email: "marcus@aureliaproperties.com", bio: "Marcus leads the Noe Valley and Bernal portfolio. Two decades in residential sales, and a specialist in historically sensitive properties." },
      { id: "a-3", name: "Priya Raghunathan", role: "Partner, Condos & Lofts", image: "assets/img/portrait-3.svg", licence: "DRE #01773318", phone: "+1 (415) 555-0193", email: "priya@aureliaproperties.com", bio: "Priya handles the high-rise and conversion market, where her background in development finance makes her a genuinely useful negotiator." },
      { id: "a-4", name: "Daniel Whitfield", role: "Director, Country & Estates", image: "assets/img/portrait-4.svg", licence: "DRE #01604902", phone: "+1 (650) 555-0194", email: "daniel@aureliaproperties.com", bio: "Daniel covers the peninsula and the country estates — parcels with wells, septic, easements and everything else that makes rural transactions complicated." },
      { id: "a-5", name: "Sofia Bergström", role: "Director, Investment", image: "assets/img/portrait-5.svg", licence: "DRE #01819945", phone: "+1 (415) 555-0195", email: "sofia@aureliaproperties.com", bio: "Sofia works with individual and institutional investors on 1031 exchanges, portfolio acquisitions and multi-family dispositions." },
      { id: "a-6", name: "James Whitfield", role: "Director, Operations", image: "assets/img/portrait-6.svg", licence: "—", phone: "+1 (415) 555-0196", email: "james@aureliaproperties.com", bio: "James runs the back office: escrow, disclosure, inspection scheduling and the thousand small things that keep a closing on schedule." }
    ],

    /* ------------------------------------------------------------------
       Services
       ------------------------------------------------------------------ */
    services: [
      {
        slug: "buying",
        title: "Buyer Representation",
        icon: "search",
        short: "A dedicated buyer's agent who works only for you.",
        body: "We are not a listing brokerage pretending to represent both sides. Your agent is retained by you, is paid by you, and is accountable to you. That means honest advice about what a home is actually worth, which includes telling you when to walk away from a house you love.",
        points: ["Full-time buyer's representation", "Comparable-sales analysis before every offer", "Negotiation and escrow management", "Home inspection coordination", "Off-market and pocket-listing access"]
      },
      {
        slug: "selling",
        title: "Seller Representation",
        icon: "tag",
        short: "Preparation, photography, pricing and negotiation that adds up.",
        body: "The difference between a good price and a high price is preparation. We begin with a pre-listing walkthrough, then handle styling, professional photography, floor plans, and a launch plan built around the first two weeks — where the majority of a listing's value is decided.",
        points: ["Pre-listing preparation consult", "Professional photography and film", "3D tour and floor plans", "Print, digital and broker outreach", "Weekly written performance reporting"]
      },
      {
        slug: "valuation",
        title: "Property Valuation",
        icon: "chart",
        short: "A pricing opinion you can actually act on.",
        body: "Our valuation report goes beyond a number. You receive the active inventory, the closed comparables, the adjustments we made and the reasoning behind the range — so you can decide, not just comply.",
        points: ["Comparative market analysis", "Active and expired inventory review", "Value range with documented adjustments", "Pricing strategy and timing advice", "Repair and improvement prioritisation"]
      },
      {
        slug: "investment",
        title: "Investment & Portfolio",
        icon: "chart",
        short: "Numbers-first analysis for owners who treat property seriously.",
        body: "We model every acquisition on cap rate, cash-on-cash return, debt service coverage and the realistic cost of holding — then stress-test it against a range of vacancy and rate scenarios before you make an offer.",
        points: ["1031 exchange coordination", "Multi-family acquisition and disposition", "Rent and expense analysis", "Renovation scoping and contractor referral", "1031 and capital-gains coordination"]
      },
      {
        slug: "relocation",
        title: "Relocation & New Area",
        icon: "compass",
        short: "Buying in a city you do not yet know.",
        body: "Relocating means choosing a neighbourhood you have never lived in. We build a shortlist grounded in commute, schools, climate and daily rhythm — then arrange the school tours, area drives and due diligence that turn a shortlist into an address.",
        points: ["Neighbourhood orientation tours", "School and commute analysis", "Temporary rental sourcing", "Area and market briefings", "Local service referrals"]
      },
      {
        slug: "management",
        title: "Property Management",
        icon: "key",
        short: "Owners who live elsewhere still need someone local.",
        body: "Our management service covers the full life of a tenancy — screening, lease execution, rent collection, maintenance dispatch, inspections and the annual reconciliation — with a single point of contact and a monthly statement that reconciles to the dollar.",
        points: ["Tenant screening and placement", "Lease preparation and renewal", "Rent collection and accounting", "Maintenance and vendor management", "Vacancy and turnover planning"]
      }
    ],

    /* ------------------------------------------------------------------
       Insights / journal
       ------------------------------------------------------------------ */
    posts: [
      {
        slug: "buying-in-a-soft-market",
        title: "What a soft market actually rewards",
        date: "2026-09-18",
        category: "Market",
        readTime: "6 min",
        author: "Elena Marchetti",
        image: "assets/img/editorial-valuation.svg",
        excerpt: "Inventory is up, days on market are longer, and the negotiation has shifted back to buyers. Here is how we advise clients to use that shift — and where we still warn them not to push.",
        body: "For the first time in four years, buyers in our core neighbourhoods can negotiate without feeling they are being unreasonable. That changes strategy in ways that are not always obvious.\n\nThe first is on pace. A soft market rewards patience, but not passivity. If a property has been on the market for more than sixty days and the seller has not moved on price, the terms have usually moved more than the number. Inspection and escrow conditions carry more weight than they did in 2022.\n\nThe second is on scope. Sellers who took their homes off the market in 2021 and are now returning tend to have deferred maintenance. Buyers should treat the inspection as an allocation tool rather than a contest: decide in advance what you will fix and what you will not accept, and let that decide the offer.\n\nThe third is that leverage still matters more than headline. A buyer with a higher rate but more cash is often the stronger buyer in a slow market, because they can close on their timetable rather than the lender's."
      },
      {
        slug: "preparing-a-home-for-market",
        title: "Nine days of preparation that moved a price by $340,000",
        date: "2026-08-30",
        category: "Selling",
        readTime: "8 min",
        author: "Marcus Oyelaran",
        image: "assets/img/editorial-staging.svg",
        excerpt: "A case study from Bernal Heights: what we changed before the listing went live, what it cost, and what it returned in the first ten days.",
        body: "The house had been on the market for eleven days at $1,895,000 with no offers and two showings. It was a good house — good bones, bad presentation.\n\nBefore relisting we spent nine days on a small, precise set of changes. We repaired the foundation crack and re-graded the rear slope, which is legally required disclosure anyway and which buyers were pricing in as a much larger risk than it warranted. We rewired the kitchen and replaced the two failing panel doors. We cleared the front garden back to the original 1912 planting and repainted the trim in a colour chosen from a photograph of the block in 1948.\n\nTotal cost: $71,400. We relisted at $2,135,000 and received nine offers in the first ten days, closing at $2,235,000 — $340,000 above the original list, and $268,000 above the original asking price.\n\nNone of this was staging in the cosmetic sense. It was the removal of doubt."
      },
      {
        slug: "the-case-for-buying-where-you-work",
        title: "The case for buying where you already spend your mornings",
        date: "2026-08-04",
        category: "Neighbourhoods",
        readTime: "5 min",
        author: "Sofia Bergström",
        image: "assets/img/neighborhood-lakeside.svg",
        excerpt: "Commute time is not just minutes lost. It is the difference between a week that feels long and one that does not — and it is measurable in resale terms.",
        body: "There is a persistent argument in our field that buyers should stretch outward for space. The data generally points the other way.\n\nWithin two kilometres of the largest employment centres in the region, resale velocity is roughly forty per cent faster and the discount at appraisal is materially smaller. Buyers in the outer districts pay a premium that is mostly recovered in price, but they recover it over a longer hold.\n\nThe less visible cost is daily. A forty-five minute door-to-door commute is not neutral — over a working year it is around 195 hours, which is close to five full working weeks.\n\nWhere the outer districts genuinely win is on value per square foot and on lot size. If your work is genuinely location-flexible, the argument holds. If it is not, we would rather help you find the right two-bedroom near the office than a four-bedroom an hour away."
      },
      {
        slug: "1031-exchanges-explained",
        title: "A 1031 exchange, without the folklore",
        date: "2026-07-12",
        category: "Investment",
        readTime: "9 min",
        author: "Sofia Bergström",
        image: "assets/img/editorial-landscape.svg",
        excerpt: "Deadlines, timelines and the mistakes that most often cost investors their qualification. Written for people who are doing this for the first time.",
        body: "A 1031 exchange is a tax deferral, not a tax exemption. That single distinction prevents most of the misunderstanding we encounter.\n\nThe basic rule: you sell an investment property, and within 45 days of the sale you either acquire a replacement property or identify a qualified intermediary to hold the proceeds. Within 180 days of the sale you must complete the acquisition. Fail either deadline and the gain is recognised in the year of the sale.\n\nThe most common costly mistake we see is the 45-day identification deadline, which people assume is comfortable because they have 180 days for the acquisition. It is not. Identifying replacement properties and getting a qualified intermediary lined up takes longer than people expect, particularly for anything that is not a straightforward single-family purchase.\n\nA second, subtler issue: boot. If the replacement property costs less than the net sale proceeds, the difference is 'boot' and it must be recognised as income. Getting the purchase price right is therefore not a negotiating decision — it is a tax decision.\n\nWe work with a qualified intermediary and a tax adviser on every exchange, and we begin the replacement search before the sale closes."
      },
      {
        slug: "sustainable-retrofits",
        title: "Five retrofits that pay back before you sell",
        date: "2026-06-21",
        category: "Renovation",
        readTime: "7 min",
        author: "Daniel Whitfield",
        image: "assets/img/editorial-process.svg",
        excerpt: "Not the upgrades buyers love most — the ones that measurably reduce what a buyer will discount. Insulation, heat pumps, drainage, electrical, and water.",
        body: "Buyers discount for uncertainty. The five retrofits below reduce uncertainty and running costs at the same time, which is why they do so well.\n\nFirst, insulation and air sealing. It is invisible, so it gets discounted hardest — but the appraisal and inspection both reward it.\n\nSecond, heat pump replacement. Running costs are the first thing a buyer's lender and agent will calculate.\n\nThird, drainage. A seller who can say 'we had a full drainage survey in 2024' removes an entire category of buyer anxiety, and it is not expensive relative to the discount it prevents.\n\nFourth, panel capacity and grounding. Older panels are a common failure at inspection and a common reason for a last-minute credit request.\n\nFifth, water. A whole-house filter and a repiped manifold with labelled shut-offs is a small, visible signal of care that buyers consistently notice.\n\nNone of these are glamorous. All of them are money."
      },
      {
        slug: "reading-a-floor-plan",
        title: "How to read a floor plan without being an architect",
        date: "2026-05-29",
        category: "Buying",
        readTime: "4 min",
        author: "Priya Raghunathan",
        image: "assets/img/editorial-office.svg",
        excerpt: "Four things to check on any plan before you visit: circulation, light, storage and where the noise goes.",
        body: "Floor plans are the most useful document in a listing and the least-read. Here are four checks.\n\nCirculation: trace a path from the front door to the furthest room without doubling back. If the plan forces a loop through the living room to reach the kitchen, the home will feel smaller than its square footage suggests.\n\nLight: note the orientation of the main glazing, then the position of the building on the site. South and west glazing in this region is generous in winter and punishing in summer without shading — look for overhangs, shutters or a plan that mitigates it.\n\nStorage: count the closets. Compare against a simple benchmark of roughly one linear foot of shelving per bedroom plus a decent utility allowance. Modern plans often look open and generous while quietly offering almost none.\n\nNoise: check the adjacency of the primary bedroom to the living room, the stairwell and the street-facing elevation. A great plan on paper can still be acoustically hopeless.\n\nPrint the plan and take it with you. Mark it up on site."
      }
    ],

    /* ------------------------------------------------------------------
       Testimonials
       ------------------------------------------------------------------ */
    testimonials: [
      { quote: "We interviewed five agencies. Aurelia was the only one that told us not to buy the first house we saw — and they were right. Six months later we bought a different place with the same budget and a third more space.", name: "Priya & Rohan Menon", detail: "Bought in Noe Valley", image: "assets/img/portrait-3.svg" },
      { quote: "Our listing was live on a Thursday and had eleven offers by Monday. The photography, the floor plan and the way the report was structured did more work than any single negotiation tactic could have.", name: "Marguerite Walsh", detail: "Sold in Bernal Heights", image: "assets/img/portrait-1.svg" },
      { quote: "We were buying in a city we had never lived in. The neighbourhood briefings and the school tour arrangement were worth more than the fee on their own.", name: "Tomas & Ines Vidal", detail: "Relocated to Mill Valley", image: "assets/img/portrait-5.svg" },
      { quote: "Thirty-one days from listing agreement to close, no surprises, and a shortlist of buyers who were actually qualified. I have used four brokers in twenty years and none managed it like that.", name: "Gerald Okonkwo", detail: "Sold in Atherton", image: "assets/img/portrait-4.svg" }
    ],

    /* ------------------------------------------------------------------
       FAQ
       ------------------------------------------------------------------ */
    faqs: [
      { q: "What does a home sell for in my neighbourhood?", a: "It depends on four things: the specific condition of the property, the shape of the current inventory, the rate at which comparable listings are selling, and how far your timeline sits from the market's. We will give you a documented value range in writing within two business days of a walkthrough, with the reasoning attached." },
      { q: "Should I sell before I buy?", a: "In this market, usually yes — unless your current home has an unusual advantage or you are able to finance the gap comfortably. Selling first removes the negotiation leverage that a contingent offer gives a buyer, and it lets you purchase without a timeline tax. We will model both paths for you before you decide." },
      { q: "Do you work with first-time buyers?", a: "Yes, and roughly a third of our transactions are first-time purchases. We will explain what you can actually afford, including the costs most buyers only discover late — insurance, escrow, and the moving targets in pre-approval." },
      { q: "How long does a transaction take?", a: "A clean sale with financing typically runs 30 to 45 days from accepted offer to close. Cash transactions can close in under two weeks. Complications — trust sales, probate, foundation issues, or a failed inspection — extend that, and we will flag them at the outset rather than during escrow." },
      { q: "What does your fee cover?", a: "Everything: listing preparation, photography, film, floor plans, marketing, showing coordination, negotiation, escrow management, disclosure review, and closing logistics. We do not charge for staging the marketing materials or for the buyer-side services we perform for our own buyers." },
      { q: "Do you handle properties outside the Bay Area?", a: "We work across the Bay Area, the Peninsula and the North Bay. For properties further afield we maintain a referral network of independent brokers we have worked with for years and trust with our own clients." }
    ]
  };

  /* ----------------------------------------------------------------------
     Derived helpers
     ---------------------------------------------------------------------- */
  AURELIA.formatPrice = function (n) {
    if (n == null) return "—";
    return "$" + Number(n).toLocaleString("en-US");
  };

  AURELIA.formatRent = function (n) {
    return "$" + Number(n).toLocaleString("en-US") + "/mo";
  };

  AURELIA.formatCompact = function (n) {
    if (n >= 1000000) {
      const m = n / 1000000;
      return "$" + (m >= 10 ? m.toFixed(1) : m.toFixed(2).replace(/0$/, "")) + "M";
    }
    if (n >= 1000) return "$" + Math.round(n / 1000) + "K";
    return "$" + n;
  };

  AURELIA.formatNumber = function (n) {
    return Number(n).toLocaleString("en-US");
  };

  AURELIA.propertyById = function (id) {
    const list = AURELIA.data.properties.concat(AURELIA.data.rentals);
    return list.find(function (p) { return p.id === id; });
  };

  AURELIA.typeLabel = function (t) {
    const map = {
      house: "House",
      condo: "Condo",
      townhouse: "Townhouse",
      loft: "Loft",
      "multi-family": "Multi-family",
      apartment: "Apartment"
    };
    return map[t] || t;
  };
})();
