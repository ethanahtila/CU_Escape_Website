# Persistent rankings and profiles

Version 1.3.5 includes the database and APIs, but this chat has not changed or deployed your Render service. Your existing free web-service configuration remains in `render.yaml`. Casual multiplayer continues to work there. On Render, profiles, leaderboards and ranked are disabled until persistent storage is explicitly configured, so temporary data is not presented as permanent progress.

## Existing Render service

1. Commit **all** updated files to the existing GitHub repository. Keep Node 24 and one service instance.
2. In Render, use a service plan that supports persistent disks and attach a disk mounted at `/var/data`. This requires a hosting change that can cost money; the package does not perform it.
3. Set `CU_DATA_FILE=/var/data/cu-escape.sqlite` and `CU_PERSISTENT_STORAGE=1` in that service's environment, then deploy.
4. Visit `/api/status` on your game URL and confirm `persistent` is `true`. Test four separate profiles joining Ranked and a published casual win. Reload and redeploy to verify your records remain.

`render.persistent.yaml` is an optional example for a **new** disk-backed service. For your existing service, make the settings above in its dashboard rather than creating an accidental second service. The normal `render.yaml` intentionally stays free.

Render documents free-service storage limitations at https://render.com/docs/free and disk setup at https://render.com/docs/disks. Setting the flag alone does not make a disk persistent. Never use a free service's temporary filesystem for permanent records. There is no absolute forever guarantee: keep backups, retain the disk and continue operating the service.

## Backups and other hosting

The SQLite database contains profiles, hashed recovery credentials, submissions, achievements and seasonal rankings. Back it up regularly using SQLite's online backup facilities (or stop the service before copying the database). Do not copy only the main file while it is actively writing in WAL mode. Keep backups private and test restoring one. Never commit the data directory to GitHub.

Docker Compose uses a named volume for `/app/data`. Preserve that volume across rebuilds, and do not remove it with `docker compose down -v`. A local `npm start` stores records in `data/cu-escape.sqlite`; preserve that directory or configure `CU_DATA_FILE` on a persistent volume. Run only one Node service instance with this SQLite setup. Active games are memory-resident and end when the server restarts, even though recorded progress survives.

## Player identity and records

Each browser receives a random profile credential. **Profile / titles → Show my recovery code** lets the player privately save it and restore the same account on another device. A display name is not authentication; anyone who has the recovery code has the profile. Losing both browser data and the code loses access to that profile. Raw credentials are not stored in the database.

Casual boards are opt-in, community-submitted records from solo clients or the multiplayer host, with basic session checks. They are not cheat-proof competitive verification. Spectator-assisted rounds cannot submit. Ranked simulation, private keys, movement limits, actions and credit awards run on the server; clients cannot submit their own ranked result. This is a foundation for competitive play, not a comprehensive anti-cheat system.

Daily boards filter by the current date in `America/New_York`; older runs remain stored for all-time boards. Ranked season boundaries are midnight on the 15th in that timezone. A match is credited to the season it started in. A new season starts everyone at Wood with zero credits, while unlocked cosmetic titles remain. Keep the server clock accurate.
