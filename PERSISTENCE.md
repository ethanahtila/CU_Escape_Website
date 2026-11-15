# Turso storage — update 1.4.6

The game now connects directly to an external Turso/libSQL database. With this option, Render runs the game and multiplayer server; Turso stores accounts, password hashes, sessions, achievements, selected titles, ranks, leaderboards, wallets, permanent cosmetic ownership, equipped looks and personal daily shops. A paid Render disk is not required for Turso mode. The connection is server-side; database credentials never belong in HTML or GitHub.

## Finish the setup you already started

1. Extract this archive and upload **all its contents** to the root of your existing linked GitHub repository, replacing the older code. Keep the `public` folder intact. Commit the changes.
2. Open the existing game service in Render. In **Environment**, retain the `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` values you already added. Both are required. The token must permit reads and writes. Use your database URL, not the dashboard page URL.
3. Choose **Save, rebuild, and deploy**, or deploy the latest GitHub commit. Keep Node 24 and one service instance.
4. The server connects to Turso and creates all tables automatically. You do not need to upload a SQLite file or manually create tables when starting with an empty database. Existing tables are preserved using `CREATE TABLE IF NOT EXISTS`.
5. Open `https://YOUR-GAME-HOST/api/status`. The response should include `"persistent":true`, `"storage":"turso"` and `"achievements":123`. No credentials appear in this response.
6. Refresh the game on every device. Create a username/password account, equip an unlocked title and test an escape. Redeploy/restart the game service and log back in to confirm that saved progress remains. Test Ranked with five separate signed-in profiles.

If the deployment fails during storage initialization, check both environment variable names, the copied URL, token read/write permissions and Turso service availability. The server fails startup rather than silently saving accounts to Render's temporary local files. A fully initialized game can continue simulating while an individual ranked result waits for a database retry; result messages are sent after the save succeeds. Results that cannot reach the database before the game process is terminated cannot be guaranteed recoverable.

No `CU_PERSISTENT_STORAGE` flag or `CU_DATA_FILE` path is needed in Turso mode. Do not point `CU_DATA_FILE` at a Turso URL. The program automatically uses cloud storage when both Turso variables are present. If only one is present, startup reports a configuration error. Clear obsolete local-disk variables if you are no longer using that option.

## Existing saved data

Creating an empty Turso database starts a new database; it does **not** automatically copy records from an older local SQLite file. If you have existing accounts/records to preserve, obtain a consistent backup of that file and migrate/import it before directing players to the new database. Turso's import option is intended for that situation. Keep the original backup until accounts and scores have been verified. This code package contains no player database or credentials.

## Free-plan limits and backups

Turso is an external service with its own plan limits and availability. Monitor usage in its dashboard and keep independent private backups of important records. Do not delete the database when updating game code. The game does not enable paid overages or change any hosting plan. Game rooms and matchmaking remain in the Node server's memory, so use one service instance; deploying still ends active matches even though completed saved records remain in Turso.

## Accounts, achievements and privacy

Passwords use salted async scrypt. The browser saves a random thirty-day session token instead of the password. Logging out revokes that device session. Accounts and progression follow the profile ID, so signing in on another device restores the same progress. There is no email-based password reset in this release; keep your password safely. Older recovery-code profiles can attach a username/password if their records were preserved.

There are 123 achievements, including the original hundred, ten secret challenges and 23 new server-awarded currency/collection goals. Secret names, goals and titles are withheld from the public browser catalog and from unearned profile responses. Qualifying signed-in progress reveals them. Casual statistics and achievements are community reported by the game client, as casual run submissions already are. They are not comprehensive anti-cheat verification. Ranked credits, ranked finish/win milestones and rank achievements are awarded by the authoritative server; importing casual progress never grants them.

Daily boards use `America/New_York` dates. Ranked seasons change at midnight on the 15th there; matches belong to the season they started. All-time casual records do not automatically reset. Keep the database and backups to retain them.

## Optional local SQLite mode

Without Turso variables, local development still uses `data/cu-escape.sqlite`, or the path in `CU_DATA_FILE`. Keep that directory to retain local records. SQLite storage on Render requires a persistent disk and `CU_PERSISTENT_STORAGE=1`; its free temporary filesystem is not permanent account storage. `render.persistent.yaml` remains an optional disk-backed example. Docker Compose retains local SQLite files in the named `game_data` volume; do not delete that volume if it contains records.

## References

- Turso SQL over HTTP: https://docs.turso.tech/sdk/http/reference
- Turso import: https://docs.turso.tech/cloud/migrate-to-turso
- Render environment settings: https://render.com/docs/configure-environment-variables

## Economy persistence

Update 1.4.6 creates its wallet, currency-award, ownership, equipment, shop-seed and personal-rotation tables automatically. Keep the same database and environment settings. Existing accounts and achievement IDs are preserved; Notes start at zero, with no retroactive payouts for races recorded before this feature. Wallets and items do not reset with ranked seasons. Purchases are atomic and owned items prevent duplicate charges after a network retry. Shop rotation rows use account ID and Cedarville date; refreshing, changing a name or logging in elsewhere does not reroll them. Retain the private shop seed with the database. No secret token or seed is sent to clients.

Update 1.4.6 also creates completed-round achievement deduplication and cosmetic-trade audit tables. No existing account, balance or ownership IDs are renamed. Keep the same database.

Version 1.4.6 adds `currency_fractions` and `casual_currency_awards` automatically. Existing integer wallet balances keep their value. Equal team shares use exact fractional units; no account reset or manual database upload is needed.

Version 1.4.6 creates `achievement_currency_awards` automatically. Previous achievements are credited once when that profile loads; keep the existing database and account identities. Payments do not reset with ranked seasons.
