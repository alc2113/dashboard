/* ============================================================
   Ad dashboard client registry
   ------------------------------------------------------------
   ads.html?client=<key> reads one entry from here. To onboard a
   client, add an entry: brand, title, the published sheet ID,
   the engine tab names, the result metric ("cpa" = lead-gen,
   "roas" = ecommerce), an optional password, and the optional
   layers (google, modeled, deals, sparkloop).

   Engine tabs (all on `sheetId`, gviz headers=1):
     dailyTab       Ad Daily                  daily ad-level rows (base of every tab)
     tagTab         Tagging                   AI themes by Ad ID, one column per theme
     tab            Ad Performance            per-ad rollup: Headline, Primary Text, Thumbnail
     platformTab    Platform Daily            ad x day x platform (Platform filter)
     eventTab       Meta Event Detail         pixel events by ad x day (Site Events tab)
     headlineTab    Headline Performance      per-asset rows (Headlines & Copy, Meta)
     bodyTab        Primary Text Performance  per-asset rows (Headlines & Copy, Meta)
     syncStatusTab  Sync Status               Key / Value: synced_at, data_through, ...
     Also read when present: Taxonomy, Budgets, Device Detail, Demographics, Hourly, PMax Channels.

   google (optional, may point at a DIFFERENT sheet): adds the Keywords tab and the
   Google section of Headlines & Copy from the tabs scripts/sog_sync.py writes.
     adDetailTab    Google Ad Detail   one row per ad group x day, MERGED into the base ad rows as
                                       "<Ad Group> (Google RSA)" pseudo-ads (Platform "Google", Format
                                       "RSA", Ad Set = Ad Group, Funnel from the sheet else "Prospecting",
                                       results = the Leads / Conversions column). Google rows carry no
                                       reach, pixel events, themes or platform breakdown, so Breakdowns,
                                       Site Events (Meta section), Creative and the Meta headline section
                                       stay Meta-only and say so.
     keywordThemes  [{name, match:[substrings]}]  optional keyword classifier for the Keywords tab's
                                       "Keyword Theme" grouping. A keyword can match several themes
                                       (joined with a comma); no match = "Other".

   brand: { name, initial, color } is the base every client has (header initial square + login
   card text). Optional client rebrand keys, all read by ads.html:
     logo         header image path (replaces the initial square), e.g. "assets/sog-badge.png"
     wordmark     login card image (replaces the brand name text), e.g. "assets/sog-wordmark.png"
     font         Google Fonts family to load for the whole page, e.g. "Montserrat"
     colors       { primary, primaryDark, accent, secondary, good, bad } CSS variable overrides;
                  only the keys given apply. primary / secondary / accent also become the first
                  three chart palette colors.
     headerName   text next to the logo, e.g. "SHADES OF GREEN" (default: brand.name)
     loginFooter  small line under the login card, e.g. "Prepared by CASSA STRATEGY"

   manageTags (optional, boolean): shows the Creative tab's "Manage tags" button + "Manage tag
   dimensions" dialog, which edits the sheet's Taxonomy tab by posting `tax_set` / `tax_del` to
   webhookUrl (the sog.html Apps Script contract). Only set it when that webhook handles those actions.

   secondaryResult (optional): { col, label, abbr }. A second conversion column on Ad Daily + Platform
   Daily (e.g. Registrations for The Unsealed) shown next to the primary result everywhere the
   primary result appears: tiles, WoW/MoM, Campaigns, Ad Explorer, Breakdowns, Leaderboard,
   Trends and Funnel. The asset tabs do not carry it, so Headlines & Copy shows a note instead.
   On the SparkLoop tab the "Ads x Earnings" block runs on this result instead of the primary one,
   labelled with abbr in parentheses (default "CR", the complete_registration event).

   ga4Events (optional): { sheetId, tab, metaTab, labels, callSources, pairs, metaOnly }. Adds the
   "Site-wide (GA4, all traffic)" section to the Site Events tab from the tabs sog_sync.py writes
   (GA4 site events + the campaign-level Meta Event Detail on the same sheet), compared side by
   side with Meta ads-attributed counts and never summed. labels / pairs / metaOnly are the site's
   GTM tag map (GA4 event -> plain name; Meta pixel event <-> GA4 twin; Meta-only events).

   NOTE (multi-tenant): this file is public, so every client's sheet ID and password
   is visible in page source. The password gate is a courtesy, not security.
   ============================================================ */
window.AD_CLIENTS = {
  sog: {
    // Client rebrand carried over from sog.html (style sheet by figdesign): badge + wordmark assets,
    // Montserrat, primary greens #20534b / #83c48c / #c3e1b4, navy #34344a, coral #f26b6c, teal #65c8d0.
    // Mapped: primary = dark green, accent = coral (theme share bars), secondary = teal (2nd chart color).
    // Brand green #83c48c, mint #c3e1b4 and navy #34344a were only chart palette slots 4-5 in sog.html.
    brand:    { name: "CASSA STRATEGY", initial: "C", color: "#20534b",
                logo: "assets/sog-badge.png", wordmark: "assets/sog-wordmark.png", font: "Montserrat",
                colors: { primary: "#20534b", primaryDark: "#173d37", accent: "#f26b6c", secondary: "#65c8d0" },
                headerName: "SHADES OF GREEN", loginFooter: "Prepared by CASSA STRATEGY" },
    title:    "Shades of Green, Ad Performance",
    subtitle: "Keyed on ad ID, so renames never break it.",
    sheetId:  "1gklZFfDPiH-5Rd-91cK6EpRAPJvLf2myedT0TE1Cqng",
    dailyTab: "Ad Daily",       // daily ad-level rows (date filter / trends / breakdowns)
    tagTab:   "Tagging",        // AI tags by Ad ID (joined onto the daily rows)
    tab:      "Ad Performance", // per-ad rollup (headline, primary text, thumbnail)
    platformTab: "Platform Daily",
    eventTab: "Meta Event Detail",
    headlineTab: "Headline Performance",
    bodyTab: "Primary Text Performance",
    syncStatusTab: "Sync Status",
    password: "sog2026",
    // Apps Script /exec that writes tag edits back to the Tagging + Ad Performance tabs.
    // Empty = edits work in the page but show as unsaved (webhook not configured).
    webhookUrl: "https://script.google.com/macros/s/AKfycbyIcrWD0Ac4RRbRtH4tDJMa7pigPDgS8TuL178KV_yFxFiw_-qz87nMfph_jsB4YzdEHA/exec",
    manageTags: true,           // the SOG webhook handles tax_set / tax_del (Manage tag dimensions dialog)
    // "cpa" (lead-gen: Leads/CPA) | "roas" (ecommerce: Revenue/ROAS)
    resultMetric: "cpa",
    resultLabel: "Calls",       // Complete Registration = a booked discovery call; tiles read Calls / Cost per call
    // Google Ads layer: Keywords + RSA headline/description tabs on the SOG main dashboard sheet.
    google: {
      sheetId: "19X1yl62Z_xSRic4Xz8JTurKjNNgcmRWuXNRYM5zYnfA",
      adDetailTab: "Google Ad Detail",   // merged into the base ad rows as "<Ad Group> (Google RSA)"
      keywordsTab: "Keywords",
      headlineTab: "Headline Performance",
      descriptionTab: "Description Performance",
      // Keyword Theme rules (ported from sog.html classifyKeywordTheme). Substrings are matched
      // against the lower-cased keyword padded with a space on each side, so " sog " is a whole word.
      keywordThemes: [
        { name: "Branded SOG",    match: ["shades of green", "shadesofgreen", " sog "] },
        { name: "Branded Brandy", match: ["brandy"] },
        { name: "Atlanta",        match: ["atlanta"] },
        { name: "Eco",            match: ["eco ", "eco-", "permaculture", "sustainable", "organic", "regenerative", "native",
                                          "pollinator", "edible", "biodiversity", "habitat", "wildlife", "clover", "meadow",
                                          "food forest", "rain garden", "drought", "xeriscap", "no mow", "rewild"] },
        { name: "Landscape",      match: ["landscape", "landscaping", "landscaper", "yard design", "garden design",
                                          "backyard", "hardscape", "yard architect", "outdoor architect", "lawn", " yard "] }
      ]
    },
    // GA4 site-wide events (all traffic) + campaign-level Meta pixel events, both written by
    // scripts/sog_sync.py to the SOG main dashboard sheet. Shown on the Site Events tab under the
    // Meta pixel section, side by side and never summed. Mapping ported from sog.html (GTM tag map,
    // spec 2026-07-20); labels are in display order.
    ga4Events: {
      sheetId: "19X1yl62Z_xSRic4Xz8JTurKjNNgcmRWuXNRYM5zYnfA",
      tab: "Site Events",
      metaTab: "Meta Event Detail",
      labels: {
        generate_lead: "Guide Downloads",
        video_signup: "Intro Video Signups",
        newsletter_signup: "Newsletter Signups",
        try_waitlist: "TRY Waitlist",
        careers_application: "Careers Applications",
        volunteer_signup: "Volunteer Signups",
        book_outbound_click: "Book Order Clicks",
        purchase: "Book Purchases",
        form_submit: "Discovery Calls"
      },
      // form_submit rows from any other source are grouped as "Other Form Submits"
      callSources: ["discovery-call", "ecolawns-call"],
      // Meta pixel event <-> GA4 twin
      pairs: [
        ["AddToWishlist", "generate_lead"],
        ["StartTrial", "video_signup"],
        ["Contact", "newsletter_signup"],
        ["AddToCart", "try_waitlist"],
        ["SubmitApplication", "careers_application"],
        ["Donate", "volunteer_signup"],
        ["FindLocation", "book_outbound_click"],
        ["Subscribe", "purchase"],
        ["CompleteRegistration", "form_submit"]
      ],
      // Meta-only events with no GA4 twin on the site side
      metaOnly: {
        InitiateCheckout: "Kajabi Checkout Started",
        Schedule: "Webinar Registrations",
        Purchase: "TRY Course Purchases",
        "Custom (unmapped)": "Custom (unmapped pixel events)",
        Lead: "Lead (Kajabi)"
      }
    },
    // CRM truth layer (optional): adds a "Cost per Booking" tab reading monthly
    // Modeled Metrics (+ GA4 Traffic) tabs. May live in a different spreadsheet
    // than the ad-ID product sheet. corrFactor is the client's source-loss
    // correction midpoint (omit to hide the toggle).
    modeled: {
      sheetId: "19X1yl62Z_xSRic4Xz8JTurKjNNgcmRWuXNRYM5zYnfA",  // SOG main dashboard sheet
      tab: "Modeled Metrics",
      ga4Tab: "GA4 Traffic",
      noun: "Booking",          // the CRM conversion, singular ("Booking" / "Order"...)
      crmName: "HubSpot",
      corrFactor: 1.375,
      corrNote: "Some paid-driven bookings lose their source to the HubSpot Meetings widget cookie issue. 1.375 is the July 2026 cross-channel analysis midpoint (bounds +11% to +37%)."
    },
    // CRM pipeline + revenue (optional): adds a "Pipeline & Revenue" tab reading
    // the deal snapshot tab (one row per CRM deal, joined to spend from the
    // modeled + daily ad rows). Same sheet as `modeled` for SOG.
    deals: {
      sheetId: "19X1yl62Z_xSRic4Xz8JTurKjNNgcmRWuXNRYM5zYnfA",  // SOG main dashboard sheet
      dealsTab: "HS Deals",
      crmName: "HubSpot"
    },
    // Creative themes v2 (2026-09-17). Fallback only: the live list comes from the sheet's Taxonomy tab.
    dimensions: ["Format", "Audience", "Funnel", "Placement",
                 "Selling angle", "Look", "What's shown", "Text on the creative", "AI-made", "Who's talking",
                 "Shape", "Video length", "Story type", "Shows SOG's own work"],
    aiDims:     ["Selling angle", "Look", "What's shown", "Text on the creative", "AI-made", "Who's talking",
                 "Shape", "Video length", "Story type", "Shows SOG's own work"],
    editOptions: {
      "Selling angle": ["What it does", "How it feels", "Limited time", "Deal or discount", "Reviews and proof",
                        "Dream outcome", "Fixes a problem", "Season or holiday", "Just shows the product"],
      "Look": ["Studio with people", "Studio product", "Phone-shot by the brand", "Phone-shot by a creator", "Graphic or animation"],
      "What's shown": ["Person with product", "One product", "Several products", "No product shown"],
      "Text on the creative": ["None", "Text only", "Text with offer", "Text with reviews or stars", "Text with button"],
      "AI-made": ["Yes", "No"],
      "Who's talking": ["The brand", "A team member", "A customer", "A creator", "No one"],
      "Story type": ["Client home tour", "Problem and fix", "Before and after", "How we do it", "Why it matters"],
      "Shows SOG's own work": ["Yes", "No"],
    },
  },

  unsealed: {
    brand:    { name: "CASSA STRATEGY", initial: "C", color: "#209D50" },
    title:    "The Unsealed, Ad Performance",
    subtitle: "Ranked by cost per purchase. Keyed on ad ID, so renames never break it.",
    sheetId:  "1vtKRPmM5A4WVkTIv4KsO2BSUeWhpVi9XDt3nN5Bkq0o",
    dailyTab: "Ad Daily",
    tagTab:   "Tagging",
    tab:      "Ad Performance",
    platformTab: "Platform Daily",
    eventTab: "Meta Event Detail",
    headlineTab: "Headline Performance",
    bodyTab: "Primary Text Performance",
    syncStatusTab: "Sync Status",
    password: "unsealed2026",
    // Apps Script /exec from theunsealed.html (tag edits + Taxonomy edits).
    webhookUrl: "https://script.google.com/macros/s/AKfycbyGfdQtwVnTyF_UzTBXJ6ta_QnAx4aGob5WuJiqRd9s59cDz7CZjl5YF7h0dYmkoekEKA/exec",
    manageTags: true,
    // Subscription: purchases (sub starts) primary, ranked on cost per purchase.
    resultMetric: "cpa",
    resultLabel: "Purchases",
    // Secondary conversion: SparkLoop signups (Meta complete_registration), reported on Ad Daily and
    // Platform Daily as "Registrations". Shown beside purchases everywhere; never replaces them.
    secondaryResult: { col: "Registrations", label: "Registrations" },
    // SparkLoop Earn tabs (written by scripts/unsealed_sparkloop_pull.py on the
    // main Unsealed dashboard sheet). Optional: tab appears only when data loads.
    sparkloop: {
      sheetId: "1rEOXHebRMyfbAhldCsoJeLqnpokoqgOZ28yJXztsoZs",
      payoutsTab: "SparkLoop Payouts",
      partnersTab: "SparkLoop Partners",
    },
    dimensions: ["Format", "Audience", "Funnel", "Placement",
                 "Message Motivator", "Secondary Motivator", "Production Style",
                 "Subject", "Aspect Ratio", "Offer", "Product/Service"],
    aiDims:     ["Message Motivator", "Secondary Motivator", "Production Style",
                 "Subject", "Aspect Ratio", "Offer", "Product/Service"],
    editOptions: {
      "Message Motivator":   ["Functional benefit", "Emotional benefit", "Urgency/scarcity",
                              "Offer-based", "Social proof", "Aspirational", "Problem/solution", "Seasonal moment"],
      "Secondary Motivator": ["None", "Functional benefit", "Emotional benefit", "Urgency/scarcity",
                              "Offer-based", "Social proof", "Aspirational", "Problem/solution", "Seasonal moment"],
      "Production Style":    ["Lo-fi creator", "Lo-fi brand", "Polished product", "Polished lifestyle", "Graphic-animation"],
      "Subject":             ["People+product", "Product-only", "Talent-led"],
      "Aspect Ratio":        ["9:16", "4:5", "1:1", "16:9", "Other"],
      // Starting guess for a subscription storytelling platform. Refine in the sheet's Taxonomy tab.
      "Product/Service":     ["Paid membership", "Free signup", "Community", "Other"],
    },
  },

  birdandbean: {
    brand:    { name: "BIRD & BEAN", initial: "B", color: "#3B4A63", loginFooter: "Prepared by CASSA STRATEGY" },
    title:    "Bird & Bean, Ad Performance",
    subtitle: "Meta ads only. Attribution 7-day click, 1-day view (the account setting). Refreshed nightly.",
    sheetId:  "1CoTnsa-aAU4nyPh83vuI0T2o7hhI2da5XVncMdXQvzQ",
    dailyTab: "Ad Daily",
    tagTab:   "Tagging",
    tab:      "Ad Performance",
    platformTab: "Platform Daily",
    eventTab: "Meta Event Detail",
    headlineTab: "Headline Performance",
    bodyTab: "Primary Text Performance",
    syncStatusTab: "Sync Status",
    password: "birdandbean2026",
    // Saves tag edits to the B&B sheet (deployed by Amy 2026-09-17); copied from birdandbean.html.
    webhookUrl: "https://script.google.com/macros/s/AKfycbwHPIxdHxfJok4DxZySyev12tWqUerxx29UcF00JLoXYvbYvAXpaPb3NAXRe-q9KaQBwQ/exec",
    // manageTags is deliberately NOT set: the B&B webhook may not handle the tax_set / tax_del actions.
    // Confirm the Apps Script supports them before turning the Manage tags dialog on here.
    resultMetric: "roas",
    resultLabel: "Purchases",
    // In-store (Shopify POS) sales uploaded to Meta as offline events; ads track them from 2026-10-24.
    instore: { since: "Oct 24, 2026", start: "2026-10-24" },
    // Fallback only. The live theme list comes from the sheet's Taxonomy tab.
    aiDims: ["Selling angle", "Look", "What's shown", "Text on the creative", "AI-made", "Who's talking",
             "Shape", "Video length", "Hook", "Product line", "Background color", "Offer type", "Landing Page"],
    editOptions: {},
  },

  // Prospect demo (PJ's Pet Shop). Runs on the template as ads.html?client=demo; demo.html redirects here.
  // Sheet generated by scripts/demo_template_generate.py (2026-09-22). Every layer reads the same sheetId.
  demo: {
    brand:    { name: "CASSA STRATEGY", initial: "C", color: "#209D50" },
    title:    "PJ's Pet Shop, Ad Performance",
    subtitle: "Demo data. Ecommerce, Meta + Google.",
    sheetId:  "1l1tQTUmQoXggFWlDOMgGx152BbzX-_12suwlefabt9E",
    dailyTab: "Ad Daily", tagTab: "Tagging", tab: "Ad Performance",
    platformTab: "Platform Daily", eventTab: "Meta Event Detail",
    headlineTab: "Headline Performance", bodyTab: "Primary Text Performance", syncStatusTab: "Sync Status",
    password: "demo2026",
    webhookUrl: "",
    resultMetric: "roas",
    resultLabel: "Purchases",
    google: {
      keywordsTab: "Keywords",
      adDetailTab: "Google Ad Detail",
      headlineTab: "Google Headline Performance",
      descriptionTab: "Google Description Performance",
      keywordThemes: [
        { name: "Brand",      match: ["pj"] },
        { name: "Competitor", match: ["chewy", "petco", "petsmart", "amazon"] }
      ]
    },
    modeled: { tab: "Modeled Metrics", ga4Tab: "GA4 Traffic", noun: "Order", crmName: "CRM" },
    deals:   { dealsTab: "HS Deals", changesTab: "HS Deal Changes", crmName: "CRM" },
    aiDims: [], editOptions: {},   // fallback only; the sheet's Taxonomy tab is the live list
  },

  // Onboarding template (ecommerce shape). Copy, fill in, uncomment:
  // swick: {
  //   brand:    { name: "CASSA STRATEGY", initial: "C", color: "#7b1e3b" },
  //   title:    "Swick Wines, Ad Performance",
  //   subtitle: "Ranked by ROAS. Keyed on ad ID, so renames never break it.",
  //   sheetId:  "<published sheet id>",
  //   dailyTab: "Ad Daily", tagTab: "Tagging", tab: "Ad Performance",
  //   platformTab: "Platform Daily", eventTab: "Meta Event Detail",
  //   headlineTab: "Headline Performance", bodyTab: "Primary Text Performance", syncStatusTab: "Sync Status",
  //   password: "",
  //   webhookUrl: "",
  //   resultMetric: "roas",
  //   resultLabel: "Purchases",
  //   aiDims: [], editOptions: {},   // fallback only; the sheet's Taxonomy tab is the live list
  // },
};
