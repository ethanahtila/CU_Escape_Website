# Publish CU Escape with HTTPS + WSS

The project is configured for a Node.js 24 web service and a same-origin secure WebSocket relay. The game is not publicly live until it is deployed to a hosting account.

For version 1.5.1 saved accounts, ranked and leaderboards, read **PERSISTENCE.md**. Add both `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` to the existing service environment to use external storage without a paid Render disk. The game initializes its tables automatically. Local SQLite remains an alternative with persistent disk storage.

## Render deployment (no custom domain required)

1. Create a new, private or public GitHub repository named `cu-escape`.
2. Upload the **contents of this folder** to the repository root. `package.json`, `package-lock.json`, `server.cjs`, `render.yaml`, and `public/` must be at the root level.
3. In Render, choose **New → Blueprint** and connect that repository. Render will detect `render.yaml`; review the service settings and create the web service.
4. Wait for the deployment to finish. Render will assign an `https://...onrender.com` URL and terminate HTTPS for the service. The client automatically connects to `wss://<same-host>/relay` for multiplayer.
5. Open the HTTPS URL on multiple devices, join the same room name, and test movement and interactions. Share the room link from inside the game.

The included Blueprint specifies one Node instance. Keep it at one instance: room/player state is held in memory and is not shared between instances. The free plan may spin down when idle; the first visit after idle can take time to wake. A restart/deploy disconnects active rooms.

## Alternative: your own domain/server

Point the domain's DNS to the server, allow inbound TCP ports 80 and 443, set `GAME_DOMAIN` to the domain, then run `docker compose up -d --build`. Caddy obtains and renews the TLS certificate and proxies HTTPS/WSS to the game server. Do not expose the Node port publicly or commit private TLS keys.

## Local run

Requires Node.js 24 or newer:

```sh
npm ci
npm test
npm start
```

Open `http://localhost:3000`. Local development uses `ws://`; production HTTPS automatically uses `wss://`.

## Important deployment boundary

This package contains the game, Node server, and WSS relay, but it does not include a hosting account, GitHub repository, domain, or deployed public URL. Those must be created/authorized by the site owner. A static website host alone cannot run the multiplayer relay.

## Updating the existing live service to 1.5.1

Replace all corresponding repository files with this package, including both HTML clients, progression scripts and server modules. Commit to the linked deployment branch and wait for Render to finish. Keep the existing URL, Turso database and environment variables. The new run-session, completed-result journal and Ranked escape-time tables initialize automatically; no manual upload or account reset is required.

Both clients use version **1.5.1 / protocol 41**. Everyone must refresh after deployment. Update between rounds because deployments disconnect active games. Already journaled completed results recover after restart; active unfinished games do not survive deployment. Browser-queued solo results retry on the same saved account when the game is reopened with its browser storage intact.

Controls remain F for interactions, Shift+F for vents, R to drop, and Space to jump. This archive has not been deployed by this chat.

After updating, the main menu should show **Records connected · 1.5.1**. If it reports an incomplete update, replace all corresponding files rather than only the HTML, wait for deployment and refresh. Keep the existing browser storage and saved account so pending results can retry. Profile lists pending saves, actual errors and a retry button. No manual leaderboard submission is needed.

For campus/public lobbies, include `campus-matchmaking.cjs`, `public/campus-world.js`, `public/campus-renderer.js`, the updated `public/campus.js`, both HTML clients and `server.cjs`. No extra service or external model/CDN dependency is required. Public rooms and campus presence share the existing single Node process. Active lobbies end on a deploy/restart, like other live rooms; accounts and inventory stay in the existing database.

Version 1.5.1 changes the shared `public/campus-world.js` terrain and collision data used by both clients and the campus server. Replace it together with the renderer, campus controls, both HTML files and the version/status files. Commit all corresponding files and refresh after deployment; mixed versions can disagree about walking surfaces. Existing accounts, purchases, rank and progression use the same database with no additional migration.

For the analytics update, include `public/analytics.js`, all three HTML pages and `server.cjs`. The server now serves the shared collector and allows the Google tag/Analytics endpoints in the website CSP. No extra Node service or Turso change is required. After deploying, test the container at the live game URL, and connect/publish its Google Analytics destination if not already configured; see ANALYTICS_SETUP.md.
