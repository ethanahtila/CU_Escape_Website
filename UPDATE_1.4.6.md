# CU Escape 1.4.6 — Flex rewards and achievement backpay

Both editions use **1.4.6 / protocol 36**. This update increases **Flex Dollars**, not ranked rating credits or cosmetic prices. The rendering, controls, maps, AI and movement fixes from 1.4.5 are retained.

## Match income

Ranked Flex Dollar rewards are tripled:

| Ranked placement | Flex Dollars |
| --- | ---: |
| First | 60 |
| Second | 12–27 |
| Third/fourth | 0 |

Second place uses the previous random 4–9 roll multiplied by three. Top-two placement rewards still apply even without an escape. Ranked rating-credit gains/losses and rank floors have not been multiplied.

Regular-match win rewards are doubled, in both game modes and buildings:

| Difficulty | Solo win | Multiplayer pool |
| --- | ---: | ---: |
| Easy | 8 | 32 |
| Normal | 10 | 40 |
| Hard | 12 | 48 |
| Extreme | 16 | 64 |

The team pool is split equally. Fractional shares remain exact and carry into later purchases. Match payouts are separate from any achievements earned during that match. Earlier paid matches retain their recorded amounts; retrying or reposting them does not pay an increased amount again.

## Achievement rewards

All **123 existing achievements** now have an explicit one-time reward:

| Achievement challenge | Flex Dollars |
| --- | ---: |
| Easier goals | 50 |
| More difficult goals | 100 |
| Most difficult goals | 150 |

Examples: first escape pays 50, a Hard escape pays 100, and Speed Demon pays 150. Secret challenges pay 150 and retain their hidden names/requirements until earned. Longer win streak totals, higher rank milestones and large economic goals use the higher tiers. There are 39 rewards of 50, 45 of 100 and 39 of 150. All 123 together total 12,300 Flex Dollars.

The Achievements tab displays each reward and **Paid** once it has been credited. Awards happen automatically through the saved profile; there is no claim/redeem button. Rank title choices themselves, such as the starter Wood title, are not extra achievements and do not pay currency.

Achievement currency contributes to lifetime earnings and balance goals. If a payment completes a currency achievement, that newly completed achievement can also pay its one-time reward. The reward ledger bounds this process: an achievement can never pay twice, including after spending the money, changing titles, logging in on another device or starting another ranked season.

## Existing players are included

**No achievements are reset.** Previously earned achievements are automatically credited the next time that saved profile is loaded or the player signs in after deployment. Existing unlocks, equipped titles, rank, cosmetics and balances are preserved. Backpay is lazy per profile, so updating the service does not scan every player's account during startup.

Older browser-only achievements can also receive their one-time payments when that progress is linked/synchronized to a saved account using the existing sign-up/profile flow. Currency cannot be saved without the game server/profile storage. Players must keep using their existing account; starting a different account does not copy another account's history.

The private server catalog determines each payment, and a unique account/achievement ledger records it. Ledger inserts and wallet increments commit in the same transaction. Backfill is batched, not one SQL request per achievement. Concurrent loads, restarts and retries do not duplicate payments; failed transactions roll back both money and ledger rows. No profile password or production database is included in this ZIP.

## Deploy

Replace all corresponding files in the existing GitHub repository and let Render finish deploying. Keep the same Turso URL, token and database. `achievement_currency_awards` is created automatically; there is no manual migration, account reset or SQLite upload to perform. Have every player refresh afterward.

This archive has not been deployed by this chat. The new rates and backpay apply after the updated server is deployed.

Validation: **113 automated tests passed** in the full regression suite. Additional focused UI/reward checks also passed. Tests cover old-unlock backpay, concurrent loads, transaction rollback, persistence, exact payouts, and reward visibility on both editions.
