# Creative Fatigue CSV — pull spec

One row per **ad per day**, Meta Ads (level = Ad, time increment = 1 day).
Matches the SOG dashboard's `Meta Ad Detail` schema (`sog.html`, `normalizeMetaAdDetail`)
plus the fields the fatigue analysis needs that the current pull lacks
(Ad ID, Reach, Frequency).

## Columns

| Column | Source field (Meta API) | Notes |
|---|---|---|
| Date | `date_start` | daily grain |
| Ad ID | `ad_id` | join key to the AI tag sheet ("Ad Performance" tab) |
| Ad Name | `ad_name` | dashboard also joins tags by name — keep both |
| Ad Set | `adset_name` | |
| Campaign | `campaign_name` | |
| Spend | `spend` | |
| Impressions | `impressions` | |
| Reach | `reach` | currently absent at ad level in the dashboard pull |
| Frequency | `frequency` | impressions ÷ reach |
| Clicks | `inline_link_clicks` | link clicks, not all clicks |
| CTR % | `inline_link_click_ctr` | or compute Clicks ÷ Impressions |
| CPC | `cost_per_inline_link_click` | |
| CPM | `cpm` | |
| Leads (Results) | `actions` (optimization event) | calls booked / leads |
| Cost/Lead | `cost_per_action_type` | |

## Optional (video creative)

- 3-second video plays (`video_3_sec_watched_actions`) and ThruPlays — hook/hold rate.

## Second tab (ad-set level)

- First-time impression ratio — Meta only reports this at ad-set level, not per ad.

## Caveats for the analysis

1. **Reach and frequency do not sum across days** — they are deduplicated per
   reporting period. The daily rows are fine for spend/CTR/results trends, but
   pull frequency again at weekly or cumulative-since-launch grain for the
   actual fatigue curve.
2. **Platform-reported Leads are inflated ~6x after June 26, 2026** (enhanced
   conversions fix). Results before/after that date are not comparable;
   HubSpot bookings remain the outcome source of truth.
3. Include the ad's launch date (or days live) if possible, so fatigue curves
   can be aligned by ad age rather than calendar date.
