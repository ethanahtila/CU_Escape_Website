# CU Escape 1.4.5 — rendering and rewards

Desktop and mobile share **1.4.5 / protocol 35**. Replace all corresponding files in GitHub, let Render finish deploying, and have every student refresh the page. This archive has not been deployed by this chat.

## Performance fixes

The earlier network tests did not exercise the expensive moving render paths. This release addresses those paths directly:

- Floor/ceiling textures use batched pixel uploads instead of thousands of individual canvas draws. Unchanged views reuse their textures.
- Stair tracing hoists camera, floor-count and material constants out of its pixel loops and uses a balanced sampling grid. Collision surfaces, stair rules and building geometry are unchanged.
- Furniture depth testing uses small blocks for larger surfaces and retains individual-pixel precision for thin key/paper edges. Original vector outlines still clip the drawing.
- Large depth buffers are reused, with a separate immutable architectural cache and writable object surface. Moving no longer allocates/copies multiple megabytes of depth data each frame.
- Static café and pickup meshes are cached. Moving or dropping a collectible invalidates its cached pose; wall/frustum checks reject hidden objects before drawing their meshes.
- Navigation uses reusable typed-array search storage and cached patrol candidate cells instead of building large collections for every search.
- Exploration encoding is cached until it changes. The minimap redraws independently at about 12 updates per second, and menu backgrounds redraw less often.
- Active state updates target **up to 20 per second**, rather than 1.4.4's 10, while input prediction remains local and the authoritative simulation stays at 20 steps per second. Idle rooms remain throttled.
- Running snapshots are observed without adding work to the serialized database queue. Completed-run writes are scheduled per recipient so unrelated profile operations can run between them.

Cedar Lake still stops its client animation and closes its WebSocket before a match. No new game mode, decoration, entity behavior or collision advantage was added by these optimizations.

## Measured checks

`npm run benchmark` exercises the real rendering functions with a fixed four-student world and moving camera. `test/render-benchmark-results.json` records the comparison with 1.4.4. The benchmark uses the headless canvas fixture to isolate JavaScript rendering work; these are **local workload timings, not promised browser FPS**. Before and after sample counts are included in the JSON. Native canvas views of the stairs and café were also rendered and inspected.

Representative median milliseconds per moving frame:

| View | 1.4.4 | 1.4.5 |
| --- | ---: | ---: |
| ENS hall | 32.09 | 6.02 |
| ENS stairs | 214.79 | 11.32 |
| ENS exit | 166.64 | 10.57 |
| SBCC hall | 48.75 | 5.78 |
| SBCC stairs | 193.94 | 14.00 |
| SBCC café | 269.96 | 17.07 |

Actual rendering speed depends on the browser/device, and network latency and hosting capacity are separate factors. A physical phone and the deployed website have not been tested here. This release includes reproducible rendering checks as well as real-WebSocket movement/disconnect tests.

## Flex Dollars for completed casual wins

Both Key and Puzzle modes, on either building, award Flex Dollars when the team wins:

| Difficulty | Solo payout | Multiplayer pool |
| --- | ---: | ---: |
| Easy | 4 | 16 |
| Normal | 5 | 20 |
| Hard | 6 | 24 |
| Extreme | 8 | 32 |

The multiplayer pool is divided equally among the students in the completed round. For example, four students winning Normal receive 5 each; three students receive 20/3 each. Fractional shares are retained exactly and accumulate toward future purchases, rather than disappearing through rounding. The wallet's display may round long fractions. A one-student finish uses the solo payout.

Rewards share the completed round's identity, so repeated snapshots, retrying a save or reposting an existing run cannot pay it twice. Ordinary achievement imports do not mint currency. Existing balances, cosmetic ownership, achievements and shop pricing remain intact. New fraction and casual-reward ledger tables initialize automatically in the same SQLite/Turso database; keep your current database and hosting environment variables.

Casual wins still use the existing community/host verification model. Ranked remains simulated on the server. Server-account rewards require the supplied server and persistent storage; browser-only achievement storage is not a server wallet.

## Ranked placement rewards

First and second place now receive **both ranked credits and Flex Dollars whether or not they escaped**, including a captured placement. Reward eligibility follows the final placement:

- First: normal first-place ranked credits and **20 Flex Dollars**.
- Second: normal second-place ranked credits and a random **4–9 Flex Dollars**.
- Third/fourth: normal placement credit penalties and **0 Flex Dollars**.

High-rank credit adjustments and protected rank floors remain. A loss never deducts Flex Dollars. Escape-only achievements still require an actual escape; receiving a placement reward does not fabricate an escaped run.

## Controls and deployment

**R still drops one key/paper in every mode. F still interacts and punches in Ranked.** All four-player matching, Diamond setup, shared map, personal inventories, automatic records, trade consent and persistence changes from 1.4.4 remain.

Upload all files, including both `public/desktop.html` and `public/mobile.html`, `progression.cjs`, `progression-remote.cjs`, `progression-http.cjs`, `ranked.cjs`, `server.cjs` and `shop-rules.cjs`. Deploying only the HTML would miss the server reward changes. No Turso credentials or production account database are included in this archive.

Final validation: **104 automated tests passed**, including real four-student WebSocket movement, host/guest departures, renderer cache invalidation, buffer reuse, shared team payouts and SQLite/Turso reward persistence.
