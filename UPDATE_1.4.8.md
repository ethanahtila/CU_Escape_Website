# CU Escape 1.4.8 — Completed-game progression repair

Desktop and mobile use **1.4.8 / protocol 38**. Upload all corresponding server and public files together.

## The blocked-save failure

Previously, the browser always retried the first queued result. If that result was invalid or its ticket was gone, it could block every later result indefinitely. Signed-in casual achievements relied on those results reaching the server, so they also stopped updating. A regression test reproduces this failure on 1.4.7 and passes with this update.

Each queued result now has its own retry state. An older failed game cannot stop a newer game from saving. Missing tickets are reacquired for the same account/round. Invalid results stay listed in Profile with their actual error and a retry control. Pending results remain account-bound and survive reloads with browser storage intact. A small independent retry timer also runs when there are pending results, so saves do not rely entirely on rendering the match.

Casual timing no longer rejects a completed game because its simulation clock and server wall clock disagree. Durations must still be finite, at least one second and at most 24 hours; session ownership/categories and assisted-result restrictions remain. Casual records are still community verified. Ranked retains its server-controlled timing.

## Results and achievements

- A completed casual win saves automatically to its exact building/mode/difficulty Daily and All-time boards and updates applicable achievements and rewards.
- A completed casual loss updates applicable career achievement progress, without awarding a win pool or creating an escape leaderboard entry.
- Cooperative team results finalize when the whole team escapes or loses, and each connected profile receives its own result.
- A final multiplayer snapshot can save even if the server missed the initial running snapshot.
- An open Achievements tab refreshes after the saved profile updates. Existing rewards and deduplication ledgers remain in place.
- Older stored wins that were still marked unpublished become visible automatically. Their original date is retained; an older win does not become a new entry in today's board. No rewards are duplicated.

The profile's single overall Best Run remains. Timed boards retain the top 50 and personal placement; other map/mode/difficulty categories stay separate. There is no manual submission step.

## Check the deployed update

Replace all corresponding files in the linked GitHub repository, commit and wait for Render to finish. Keep the current Turso database and environment variables. New migration bookkeeping initializes automatically; no account reset or manual SQLite upload is required. Have everyone refresh afterward.

The main menu should show **Records connected · 1.4.8**. If client, records script and server versions differ, it shows an incomplete-update message with those versions. Profile lists pending saves and actual errors. The finish screen reports when the result and achievements have saved.

This archive has not been deployed by this chat. Previously stored wins can be published and browser-queued valid results can retry; results that never reached either storage location cannot be reconstructed.

Validation includes signed-in accounts on both editions, all 16 casual category combinations, SQLite/Turso behavior, rejected-queue recovery, clock changes, win/loss achievement processing, older record migration, and live achievement refresh. See the full regression suite under `test/`.

Full regression result: **129 tests passed, zero failed**.
