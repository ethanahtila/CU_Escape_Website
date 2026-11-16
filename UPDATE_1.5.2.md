# CU Escape 1.5.2 — Lanterns & Rivalries

Desktop and mobile share this version. No payments, premium entitlement, deluxe track or Stripe connection is included.

## Free passes

The menu's **Battle Passes** button opens two separate, saved account tracks:

| Track | Duration | Levels | Free rewards |
| --- | --- | --- | --- |
| Standard | Two calendar months | 100 | Every 4 levels: 25 rewards |
| Ranked | Three calendar months | 250 | Every 2 levels: 125 rewards |

The first seasons begin November 15, 2026, at Cedarville midnight. Standard ends January 15, 2027; Ranked ends February 15, 2027. New seasons follow automatically at midnight in America/New_York, accounting for daylight saving. Pass schedules are independent of the existing monthly ranked rating season. Each season generates a new exclusive collection with its own IDs, colors and theme. Old earned rewards remain owned and usable; old unearned rewards cannot be bought or traded.

Standard's first free track contains 7 skins, 6 headwear pieces, 6 hand items and 6 Flex Dollar rewards. Ranked contains 25 skins, 25 headwear pieces, 25 hand items, 25 Flex Dollar rewards and 25 exclusive titles. No store item is used as a pass reward. The Afterlight remains the only Singularity cosmetic.

Every level takes 1,000 XP. XP is awarded when a completed result saves, including completed losses:

- Standard: 30 XP per full minute, capped at 20 minutes, plus 150 / 225 / 300 / 400 for an Easy / Normal / Hard / Extreme win. Runs shorter than 30 seconds grant no XP. Both Key and Puzzle modes, solo and multiplayer, qualify. Ranked never grants standard XP.
- Ranked: 600 / 500 / 400 / 300 XP for places 1–4. A capture still counts as a ranked result. Disconnect forfeits grant no pass XP; existing rank/currency placement rules remain intact.

Rewards are awarded automatically, in the same transaction as XP. Replayed results cannot duplicate rewards. Previously completed games are not backfilled with pass XP. Progress and ownership use the existing account database, locally or on Turso; no additional service or environment variable is needed.

## Hand cosmetics

**Character & Items → Hand items** provides a third equipment slot, including Empty hand. It is independent of skins and hats. Equipped props appear in first person inside buildings and on campus, in character previews and on indoor multiplayer characters. They grant no gameplay advantage.

350 shop hand items were added: 50 each in Common, Uncommon, Rare, Epic, Legendary, Exotic and Mythic. Ten modeled families include lanterns, mugs, journals, crystals, compasses, radios, torches, orbs, pennants and relics. Higher tiers add glow and particle accents. The original 1,772 shop cosmetics remain, making 2,122 purchasable store cosmetics. Daily store size and rarity probabilities are unchanged. Store hand items can be traded using existing equal-rarity rules; trading an equipped item clears its slot.

## Deploy

Replace the full project in GitHub, including **pass-store.cjs**, **public/pass-rules.js**, **public/hand-items.js**, both HTML clients, both progression backends and the catalogs. Commit, wait for Render deployment, then refresh the game on all devices. Database tables are created automatically without deleting accounts, ranks, achievements, balances or owned items. Docker's copy list includes the new backend module.

This package does not publish itself to Render and does not change your Google Tag Manager destination configuration.

## Verification

Automated checks cover both device clients, actual profile HTTP requests, SQLite/Turso reward transactions, duplicate results, rollback and retry, season/DST boundaries, equipment persistence, exclusive-item purchase rejection and balanced cosmetic trades and all prior gameplay checks. Hand silhouettes, character previews and the first-person overlay were also rendered on a Canvas for visual inspection. A full interactive browser launch was unavailable in this workspace; no on-device iPhone or public Render verification is claimed.
