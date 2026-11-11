# Publish CU Escape with HTTPS + WSS

The project is configured for a Node.js 24 web service and a same-origin secure WebSocket relay. The game is not publicly live until it is deployed to a hosting account.

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

## Updating the existing live service to 1.1.3

Replace the deployed repository contents with this package and redeploy the existing service; keep its current URL and hosting settings. This archive keeps package.json and public/ at the ZIP root. Everyone should refresh the game after deployment, because multiplayer protocol 22 requires matching clients. A deployment restarts the relay and ends current connections, so update between rounds. No live deployment was performed while preparing this archive.

Version 1.1.3 includes changes to both public HTML clients and server.cjs (registered player names), plus protocol 22. Update all files together, let Render finish its deployment, then refresh every player's game tab before starting a new room. Controls are E for interactions, Shift+E for vents, and Space for jump.
