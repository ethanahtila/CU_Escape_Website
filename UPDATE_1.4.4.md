# CU Escape 1.4.4

Both desktop and mobile use release 1.4.4, network protocol 34. Replace **all files** in the existing GitHub deployment folder, commit, wait for Render to deploy, then have everyone refresh. This ZIP has not been published to the live site by this chat. Keep the existing Turso variables and database.

## Controls

- **R drops one carried key or paper everywhere**: solo, standard multiplayer, Key Mode, Puzzle Mode and Ranked.
- **F interacts** with pickups, lockers, elevator controls, rescue and exit. In Ranked, F punches when no interaction is targeted. Mobile has separate Drop and Punch buttons.
- Shift crouches; Shift + F enters vents; Space jumps. Movement and camera controls remain the same.

## Lag and disconnect changes

Removed spectator entry, entity possession and the always-on spectator camera packet stream. Clients no longer upload camera packets 25 times per second when nobody is watching. Game snapshots now target 10 updates per second, with complete fixture lists every two seconds; idle room snapshots target once per second. The simulation rate and local prediction remain unchanged.

Movement packets resend the latest bounded commands instead of allowing old unacknowledged commands to block new ones. Host transfer preserves the round, positions, inventories and exploration; the new host clears obsolete prediction/interpolation queues. Navigation reuses static neighbor checks, invalidates them when the layout/door state changes and retries inaccessible patrol targets less often.

Cedar Lake uses a separate lightweight overhead canvas while waiting/trading. The building renderer pauses behind it. Lobby positions send at eight updates per second and receive at about seven, with nearby-player limits and backpressure checks. Starting a match closes the campus WebSocket and cancels its animation. No lake simulation or position stream runs during a match. Network latency and hosting/device limitations can still affect performance.

## Ranked

- **Four students total**, including you. One matchmaking queue groups **exactly the same rank and level**; it never widens the range. Room codes do not apply. With fewer than four matching students, the queue waits.
- Ranked uses two entities on either building; casual SBCC remains Dr. White only.
- Being caught is an immediate elimination, with no jail respawn. Leaving/timeouts also lose. Four private keys and four personal locks remain.
- Opening your exit activates boosted speed and tracking against **you**, rather than every rival. If more than one exit has opened, entities pursue the most recent active opener, then a remaining opener. Ordinary hunting resumes when no opener remains inside.
- Diamond and above get all floors revealed. Each student chooses a clear starting location; invalid/occupied spots are rejected. After 90 seconds, any missing choice gets a valid automatic start. Entity markers move to random valid locations five times, settle, then the three-second countdown starts.
- Ranked credits, protected rank floors, monthly resets and high-rank time limits remain. Finishing first earns 20 **Flex Dollars**; second earns a random 4–9; third/fourth, eliminated players and forfeits earn none. Currency is never deducted for a loss.

## Records and achievements

Winning casual rounds automatically appear on their daily and all-time leaderboards. There is no posting prompt. Each category still displays only the fastest 50 runs and can show your own placement beyond that. Casual records remain community verified; Ranked uses its separate server-controlled standings.

The server evaluates each participating account's round statistics for multiplayer achievements, including Ranked escapes. Winning rounds and completed-round statistics are deduplicated. Existing 123 achievements, title unlocks, accounts and cosmetic ownership remain. Sign in to keep server records across devices; guest achievements stay on the current browser.

Easy, Normal and Hard entity profiles move a quarter of the way toward the previous next difficulty. Extreme extrapolates a quarter beyond its previous values, rather than wrapping to Easy. Key/paper totals and the gentle per-player scaling remain.

## Cedar Lake and trading

Standard multiplayer groups and Ranked queues enter the same Cedar Lake-inspired waiting world. Walk with WASD/arrows, on-screen direction buttons or taps. Use Settings to adjust your group's game; Waiting Lobby returns to the lake. Starting a casual game pulls only that room's students out. Ranked automatically pulls the four matched students out. Solo bypasses this lobby.

The **Trading Hall** menu button opens the same shared area. Walk near a table and press F, or tap a nearby table, to sit. Both students must be signed in. Each offers one to four owned cosmetics and sees both complete offers before accepting. Any edit resets both acceptances. Trading cannot proceed while either student has an active match.

| Rarity | Trade value |
| --- | ---: |
| Common | 1 |
| Uncommon | 2 |
| Rare | 4 |
| Epic | 8 |
| Legendary | 16 |
| Exotic | 32 |
| Mythic | 64 |
| Singularity / The Afterlight | 128 |

Both totals must match: two Uncommon equal one Rare; four Common equal one Rare. The maximum of four items per side still applies. Starters cannot be traded, and receiving an item already owned is rejected because the collection has no duplicate stacks. No currency is traded. Ownership changes commit together in one database transaction; traded equipped items reset to the starter for that slot. Disconnecting or standing up cancels uncommitted offers.

**Flex Dollars** is the new display name for Night Notes; existing balances and all 1,772 purchasable cosmetic IDs are preserved. Shop rotations, rarity chances and The Afterlight's exclusive rarity remain unchanged.

## Hosting and checks

Use one Node service instance for the shared queue and campus lobby. Multiple replicas need a shared real-time broker before they can represent a single global world; Turso already shares the saved account data. The default service supports up to 256 campus connections and 24 trading tables (48 simultaneous seats); additional students can walk/wait. This is bounded by host capacity, not an unlimited-player promise.

Run `npm ci` and `npm test` with Node 24+. New coverage includes four real Ranked clients, exact rank-level matching, host/guest disconnect movement, universal R dropping, Diamond setup, per-player pursuit, automatic multiplayer records, account achievements, atomic local/Turso trades and offer consent resets. Visual QA renders the lake canvas; a physical iPhone and the deployed Render instance have not been tested here.

Validation completed: **96 automated tests passed** in the final full regression run. The lake canvas was also rendered and inspected. This verifies the supplied build locally; it does not claim a deployed Render or physical iPhone playtest.
