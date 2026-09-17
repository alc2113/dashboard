/* ============================================================
   Ad dashboard client registry
   ------------------------------------------------------------
   ads.html?client=<key> reads one entry from here. To onboard a
   client, add an entry: brand, title, the published sheet ID +
   tab, the dimensions to break down, which are AI-tagged, the
   dropdown options for editable controlled dims, and the result
   metric ("cpa" = lead-gen, "roas" = ecommerce).

   NOTE (multi-tenant): this file is public, so every client's
   sheet ID is visible in page source — same trade-off as the
   other gviz dashboards. For true per-tenant isolation, split
   into per-client builds or add an auth layer later.
   ============================================================ */
window.AD_CLIENTS = {
  sog: {
    brand:    { name: "CASSA STRATEGY", initial: "C", color: "#209D50" },
    title:    "Shades of Green — Ad Performance",
    subtitle: "Keyed on ad ID, so renames never break it.",
    sheetId:  "1gklZFfDPiH-5Rd-91cK6EpRAPJvLf2myedT0TE1Cqng",
    dailyTab: "Ad Daily",       // daily ad-level rows (date filter / trends / breakdowns)
    tagTab:   "Tagging",        // AI tags by Ad ID (joined onto the daily rows)
    tab:      "Ad Performance", // legacy per-ad rollup (kept for reference)
    // Apps Script /exec that writes tag edits back to the Tagging + Ad Performance tabs.
    // Empty = edits work in the page but show as unsaved (webhook not configured).
    webhookUrl: "https://script.google.com/macros/s/AKfycbyIcrWD0Ac4RRbRtH4tDJMa7pigPDgS8TuL178KV_yFxFiw_-qz87nMfph_jsB4YzdEHA/exec",
    // "cpa" (lead-gen → Leads/CPA) | "roas" (ecommerce → Revenue/ROAS)
    resultMetric: "cpa",
    resultLabel: "Leads",       // what the conversion is called (Leads / Purchases / Signups…)
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
    // the deal snapshot + change-log tabs (one row per CRM deal, joined to spend
    // from the modeled + daily ad rows). Same sheet as `modeled` for SOG.
    deals: {
      sheetId: "19X1yl62Z_xSRic4Xz8JTurKjNNgcmRWuXNRYM5zYnfA",  // SOG main dashboard sheet
      dealsTab: "HS Deals",
      changesTab: "HS Deal Changes",
      crmName: "HubSpot"
    },
    // Creative themes v2 (2026-09-17). Names mirror the sheet's Taxonomy tab.
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
    title:    "The Unsealed — Ad Performance",
    subtitle: "Ranked by cost per purchase. Keyed on ad ID, so renames never break it.",
    sheetId:  "1vtKRPmM5A4WVkTIv4KsO2BSUeWhpVi9XDt3nN5Bkq0o",
    tab:      "Ad Performance",
    webhookUrl: "",
    // Subscription: purchases (sub starts) primary, ranked on cost per purchase.
    resultMetric: "cpa",
    resultLabel: "Purchases",
    // SparkLoop Earn tabs (written by scripts/unsealed_sparkloop_pull.py on the
    // main Unsealed dashboard sheet). Optional — tab appears only when data loads.
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
      // Starting guess for a subscription storytelling platform — refine in the sheet's Taxonomy tab.
      "Product/Service":     ["Paid membership", "Free signup", "Community", "Other"],
    },
  },

  // Onboarding template (ecommerce shape). Copy, fill in, uncomment:
  // swick: {
  //   brand:    { name: "CASSA STRATEGY", initial: "C", color: "#7b1e3b" },
  //   title:    "Swick Wines — Ad Performance",
  //   subtitle: "Ranked by ROAS. Keyed on ad ID, so renames never break it.",
  //   sheetId:  "<published sheet id>",
  //   tab:      "Ad Performance",
  //   webhookUrl: "",
  //   resultMetric: "roas",
  //   dimensions: ["Format","Audience","Funnel","Message Motivator","Secondary Motivator",
  //                "Production Style","Subject","Aspect Ratio","Offer","Product/Service"],
  //   aiDims:     ["Message Motivator","Secondary Motivator","Production Style",
  //                "Subject","Aspect Ratio","Offer","Product/Service"],
  //   editOptions: { /* …same controlled dims; Product/Service: ["Red","White","Sparkling","Club","Other"] */ },
  // },
};
