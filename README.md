# CU Escape — 1.4.6

A browser escape game with ENS and SBCC, Key and Puzzle modes, desktop/mobile controls, solo play, room-name multiplayer, saved accounts and four-student Ranked matchmaking.

Read [UPDATE_1.4.6.md](UPDATE_1.4.6.md) for this release's controls, performance changes, waiting lobby, trading, records and Ranked rules. This archive has not been deployed by this chat. Update 1.4.6 triples Ranked Flex income, doubles regular-win income and pays one-time 50/100/150 Flex Dollar achievement rewards, including previous unlocks. The 1.4.5 rendering fixes remain.

## Install or update

1. Extract the ZIP. Replace all corresponding files in the existing linked GitHub repository, including the new `campus.cjs`, `public/campus.js` and `public/ranked-setup.js`.
2. Commit to the branch Render deploys. Wait for the deployment to finish.
3. Keep the existing `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` environment variables and database. New tables initialize automatically; accounts, rank, achievements and purchases stay intact.
4. Have everyone refresh. Both editions use version **1.4.6 / protocol 36**. Old open tabs cannot join an updated round.

See [DEPLOY.md](DEPLOY.md) for hosting and [PERSISTENCE.md](PERSISTENCE.md) for Turso and backups. Use one Node service instance: its real-time rooms, shared matchmaking and campus world are held in that process. Multi-instance hosting requires a shared real-time broker.

For local development, use Node 24 or newer:

```sh
npm ci
npm start
```

Visit `http://localhost:3000`; `/desktop` and `/mobile` choose the controls. `npm test` runs the regression suite. The server supports HTTPS/WSS through a hosting provider or the included Caddy configuration. Secure Wi-Fi alone does not supply a multiplayer relay; the included Node server handles room connections. Render's linked-branch automatic deploy can publish later commits without players downloading a new HTML file.

## Play

Solo starts immediately. For standard multiplayer, students enter the same room name; the host's map, mode and difficulty are loaded automatically. Everyone waits in the Cedar Lake-inspired shared lobby until that room's host starts. Settings can change between rounds without requiring a new room name.

Ranked has no room code. It finds **three other students** at your exact rank and level for **four total**, chooses ENS or SBCC randomly, and runs Key Mode / Hard with private keys and personal locks. See the release notes for Diamond+ start selection and immediate elimination on capture.

| Control | Action |
| --- | --- |
| WASD | Move |
| Mouse / right-side swipe | Look horizontally and vertically |
| F | Interact; punch a nearby rival in Ranked when no object interaction is targeted |
| R | Drop one carried key or paper in every mode |
| Shift | Crouch for up to 15 seconds |
| Shift + F | Crawl through a vent |
| Space | Jump onto furniture |
| M / I | Map / Puzzle inventory |

Mobile offers a left movement joystick, right-side look gestures, Use, Drop, Punch in Ranked, Jump, Crouch, Map and Inventory buttons. On iPhone, open the hosted HTTPS link in Safari and tap the game to enable audio. Physical iPhone behavior should be checked after deployment; this package has not been tested on a physical phone here.

Furniture blocks both students and entities. Each building retains distinct decorations and per-room layouts. Vents, lockers and collectibles use valid accessible sample positions. SBCC has two floors and a fixed café; ENS has three floors. Normal SBCC uses Dr. White only; Ranked uses two entities on either map. Grounded collectibles have a slight glow. Standing on furniture creates a last-ground-position decoy for up to six seconds; ordinary jumps do not make you invisible.

The map is shared with your team and reveals markers only in discovered areas. Keys and paper fragments belong to their carriers; R passes an item by dropping it, and capture drops all carried items. Only a key's carrier can spend it on a lock. Puzzle fragments reconstruct the team's clue sheets while held; a wrong four-digit exit code raises a ten-second alarm. Locker hiding lasts at most 15 seconds. Vents lead through a four-second crawl and a visible room exit. Stairs are physical, and elevators have doors and aimed floor controls.

## Accounts, records and achievements

Sign up with a unique username and a password of 12–128 characters. Usernames are case-insensitive. Passwords use salted scrypt hashes; they are not stored in plain text. Login restores rank, achievements, titles, purchases and equipped cosmetics on another device. Sessions last 30 days. There is no email password-reset service, so keep the password safely. Legacy recovery-code profiles can be linked to a username/password.

The menu includes **Achievements & Titles**, **My Rank**, **Leaderboards**, **Store**, **Skins & Headgear**, and **Trading Hall**. All 123 achievements remain, including ten secret challenges; each now pays 50, 100 or 150 Flex Dollars once, with earlier unlocks automatically credited when the saved profile loads. No reset is needed; earned rank and achievement titles share one equipped slot. My Rank shows progress to the next level, not merely the next rank. Guest achievements remain on the current browser; server progression requires persistent storage.

Winning casual games are saved automatically to their daily and all-time boards. There are 32 casual categories (two buildings × two modes × four difficulties × two scopes), each displaying the top 50 and your own placement. Ranked has one season leaderboard. Daily boards and shops reset at midnight `America/New_York`, including daylight-saving changes. Ranked seasons reset on the 15th at midnight there. All-time casual results never reset automatically. Casual records rely on the client/host and are marked community verified; Ranked simulation and results are server-controlled.

Ranks are Wood, Bronze, Silver, Gold, Diamond, Mythic, Legendary, Masters, Platinum and Pro, with five 150-credit levels per rank. Base escape rewards are +50–75 / +20–45 / −5–20 / −25–45 by place. Gains gradually reduce and losses increase from Diamond upward. A reached rank protects its first level from demotion. Mythic has an eleven-minute limit, decreasing by one minute per rank to seven at Pro. Captures, disconnects and timeouts eliminate a student; no loss can spend Flex Dollars.

## Cosmetics and trading

**Flex Dollars** replaces the currency name Night Notes without resetting balances. Ranked first place pays 60 and second place pays 12–27 even without escaping; third/fourth pay none. Casual solo wins pay 8 / 10 / 12 / 16 by difficulty; multiplayer wins split 32 / 40 / 48 / 64 equally across the team, retaining fractional shares. Awards and purchases are persistent and idempotent, with currency updates inside transactions. There are no real-money purchases or client-controlled wallet updates.

Each account gets a different five-item daily store. Yesterday's items are excluded. Existing purchases and equipped skin/headgear survive seasons and devices. There are **1,772 purchasable cosmetics**: seven populated rarity tiers with **253 each** (169 skins + 84 headgear), plus **The Afterlight**, the only Singularity item. Two starters are free. Ordinary rarity weights remain 45% Common, 27% Uncommon, 17% Rare, 7% Epic, 2.8% Legendary, 0.9% Exotic and 0.3% Mythic. The Afterlight has a separate **0.01% check per eligible personal daily rotation** and costs 1,000,000 Flex Dollars. Higher rarities add reactive effects but confer no gameplay advantage.

Trading requires two signed-in students seated at the same table, up to four items per side, equal combined rarity value and both acceptances of the current offer. Each rarity doubles the preceding tier's trade value. Currency and starters cannot be traded. Duplicate incoming cosmetics are refused because collections do not have item stacks. Ownership transfers together or not at all; accounts do not lose currency in a trade. See the release notes for details and current lobby capacity.

## Performance and verification

Spectator mode and its continuous camera-upload stream are disabled. The lake pauses the building renderer, uses throttled nearby-player messages, and closes its connection and animation before a match. Navigation caches static checks, with dynamic doors/layouts invalidating the cache. Active snapshots target up to 20 Hz while local input prediction remains responsive. Floor/ceiling drawing is batched, geometry/depth buffers are reused, and moving render paths have reproducible benchmark coverage. Host transfer preserves round state and continues held movement.

Automated tests cover both device editions, real WebSocket groups, host changes, personal inventories, shared exploration, furniture/stairs/elevators, Ranked matching, Diamond preparation, rewards, automatic boards, account achievements, cosmetic ownership and local/Turso transactions. Real-world Wi-Fi, server capacity and physical phone performance still need checking on the deployed game.
