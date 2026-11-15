# CU Escape 1.4.7 — Reliable records and Best Run

Desktop and mobile use **1.4.7 / protocol 37**.

## Automatic leaderboard saves

Winning casual runs save to the Daily and All-time boards matching their building, game mode and difficulty. All 32 casual categories retain their top 50 results and personal placement. A cooperative win finalizes when the whole team escapes; being outside while teammates are still inside does not finalize the team result. Ranked keeps its separate season leaderboard.

Solo restarts now create fresh run sessions. Failed initial requests retry, and completed submissions remain queued when you leave a round, change settings or reload the browser. Multiplayer winners are journaled together before their results are processed. Persisted completed jobs recover after a server restart. Repeated requests do not duplicate runs, Flex Dollars or achievement payouts. The recorded completion date determines the daily category, including delayed saves.

The finish screen shows save status. View leaderboard opens the saved run's category even after menu settings change. An open leaderboard refreshes every five seconds and when a save receipt arrives.

## One overall Best Run

Profile now shows **Best Run** and a single fastest escape time across saved maps, modes and difficulties. Existing saved casual records count immediately. Newly recorded successful Ranked escapes can improve it; captures and other non-escape placements cannot. This does not mix Ranked runs into casual time leaderboards.

Previously unsaved results and historical Ranked times that were never stored cannot be recovered. Best Run displays a dash until a qualifying saved escape exists.

## Update the live game

Replace all corresponding files in the linked GitHub repository, commit and wait for Render's deployment. Keep the same Turso database and environment variables; the new tables initialize automatically. Everyone should refresh afterward. This archive has not been deployed by this chat.

Keep browser storage so queued solo results can retry under the same account. Server-side recovery requires the existing persistent database. Active unfinished matches still end during a deployment.

All 1.4.6 reward rates and achievement backpay remain. No account reset is needed.

Validation: **122 automated tests passed**, covering both editions, real multiplayer connections, local SQLite/Turso behavior, startup/save failures, restart/reload recovery, idempotent awards, leaderboard filtering/refresh and overall best times.
