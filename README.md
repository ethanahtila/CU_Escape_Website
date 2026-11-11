# CU Escape Website — release 1.1.1

This is the current ENS + SBCC game, with Key and Puzzle modes, desktop/mobile controls, and an included multiplayer relay. This archive updates the supplied live version; the changes in this package have not been deployed by this chat.

## Publish once

Use your existing hosting service to redeploy this update. The first-time setup below is only needed when moving to a new host.

One supported hosting route is Render:

1. Put the contents of this folder into a GitHub repository (package.json must be at its root).
2. Sign in to Render and create a Node Web Service connected to that repository. Alternatively, create a Blueprint using the included render.yaml.
3. Build command: `npm ci`. Start command: `npm start`. Health-check path: `/healthz`. Node version: 24. Run ONE instance. Review your hosting plan before deployment; the supplied Blueprint selects the free plan.
4. After deployment finishes, Render provides the actual HTTPS address. That is the link to share. No custom domain is required.
5. Open that link on three devices, join the same room, start a round and verify movement and interactions on the intended Wi-Fi.

Hosting documentation: https://render.com/docs/deploy-node-express-app and https://render.com/docs/websocket

A static-only host cannot run this multiplayer relay. The web service handles HTTPS/WSS on one address. On a campus-managed server, place HTTPS in front of the Node app and forward WebSocket upgrades for `/relay`. Preserve the public Host header, or set PUBLIC_ORIGIN to the exact public HTTPS origin.

## Playing

Open the website link. Phone/tablet controls are selected automatically, with an option to switch controls in the menu. Choose Play solo, or enter a shared room name and choose Join multiplayer. Copy room link produces a link that works for either device type. The first student is host; wait for friends and start the round. Different room names create separate games. Each room supports up to 16 students.

Players do not need to download files. Being on the same Wi-Fi is not required. Campus Wi-Fi must permit HTTPS and secure WebSocket traffic to the published host; sharing the Wi-Fi alone does not guarantee connectivity.

## Updating the game

Update the hosted desktop.html and mobile.html files together and redeploy. Players refresh the same website address to load the update. HTML is served with no-store caching. Already-open tabs continue running their loaded version until refreshed. A server deployment/restart disconnects existing multiplayer sessions, so publish between games. Do not run two independent server instances: rooms live in memory and are not shared across instances.

The downloadable HTML editions are separate copies; changing them in ChatGPT does not automatically publish this website. Future website updates must also be deployed to your host.

## Local development

Run `npm ci`, `npm test`, then `npm start`. Open http://localhost:3000. This local address is not a public share link. PORT defaults to 3000, HOST to 0.0.0.0. The health endpoint is `/healthz`.

The host browser runs the simulation. Host departure transfers authority to a remaining player. Restarting the server ends connections; no permanent saves or accounts are provided. The relay isolates rooms, assigns player identities, restricts snapshots to the current host, permits key dropping and puzzle/elevator/locker actions, and sends heartbeat pings.

## Contents

public/index.html selects controls; public/desktop.html and public/mobile.html contain both maps and modes. server.cjs serves the website and multiplayer relay. package-lock.json pins dependencies. Dockerfile and render.yaml are optional deployment configurations. test/ contains local verification tests.

## Checks performed for this release

Nine automated website/server tests passed, including three real WebSocket clients, separate room isolation, host handoff, origin checks, secure-URL configuration, device routing and invitation links. Additional full-game client simulations passed for both device host types, paper capture/rescue, vent travel, late joins, host changes, key and keypad exits, and switching back to ENS. These are local checks, not a live public deployment, physical iPhone test or campus firewall test.

## Secure multiplayer (WSS)

Secure Wi-Fi is not a substitute for TLS on the game server. The hosted clients already choose `wss://<your website>/relay` automatically. Render supplies HTTPS/WSS after deployment. For your own server, the included compose.yaml and Caddyfile provide automatic HTTPS and WebSocket proxying: point a real domain to your server, allow inbound ports 80/443, set GAME_DOMAIN to that domain in .env, then run `docker compose up -d --build`. Caddy requests and renews the certificate. No real public domain, server, or certificate has been provisioned by this package. Documentation: https://caddyserver.com/docs/automatic-https

Alternatively, set both TLS_CERT_PATH and TLS_KEY_PATH to valid certificate/key files before `npm start`; the Node server will serve HTTPS and WSS directly. Never commit real TLS private keys. Certificate hostnames must match the URL and be trusted by players' browsers. A self-signed development certificate does not create a public trusted service.

## Release 1.1.0 gameplay

Opening the exit starts permanent double-speed pursuit for every active entity (including both ENS entities), with building-wide tracking even in solo. Unlocking without opening the doors does not trigger it. Puzzle Mode triggers the same phase when the correct code opens the exit. Hiding and rescue immunity still work.

The round wins when everyone is outside and loses only when everyone is jailed. Outside players may use F / USE to return if a teammate is jailed. Jailed players can move and turn within the empty barred cell but cannot leave or interact. Rescuing teleports prisoners just outside the cell; they receive five seconds of immunity and the rescuer receives two. When each immunity ends, entities receive that player's location at that moment for a ten-second investigation. The timers survive late joins and host transfers.

Additional release checks passed for jail confinement and movement on both maps/devices; correct 5s/2s rescue immunity and expiration reveals; rescue timers across host transfer; outside-player reentry and loss/win conditions; permanent final pursuit; and three real TLS-validated WSS connections with HTTPS game serving. The WSS test used a temporary local development certificate, not a public certificate or deployed domain.

## Release 1.1.1 — multiplayer coordination and movement

This update was built from the supplied live-deployment archive. Hosting routes, relay configuration, TLS/WSS support, maps, modes, per-player key ownership, exit surge, rescue/reentry and barred jail behavior are retained. Redeploy this entire package, then have every player refresh before joining. Protocol 21 requires all players to use the new update.

- Each additional player adds 0.8% entity speed, 2.5% sight/memory/search duration and a small route-update increase. Ordinary multiplayer uses sight and memory rather than immediately knowing every player's position. The permanent double-speed, building-wide exit pursuit remains.
- ENS entities that see one another within ten tiles for three continuous seconds choose separate reachable destinations for up to eight seconds. Walls and different floors reset the sight timer. SBCC still has only Dr. White.
- Discovery from every player's authoritative position is combined into one team floor map, including landmark/enemy-marker visibility. New joins and host changes keep the accumulated discovery. It resets with the round.
- The yellow key HUD now displays team-carried keys / remaining locks. Dropping or using a key decreases the shared carried total. The team list still shows individual inventories; only the carrier may unlock a door or drop that key. Used keys and dropped keys remain accounted for by the existing objective text. Puzzle inventory is unchanged.
- Movement uses sequenced, acknowledged commands and replay of unprocessed inputs. Position corrections preserve camera heading; intentional vent-exit facing is preserved. Pointer-lock transitions and abandoned drags are reset, and repeated jail snapshots no longer clear held controls.

Local verification includes simulated delayed updates, partial acknowledgments, camera/stair/jail correction, shared discovery with late join/host handoff, key ownership/HUD agreement, gradual scaling and entity separation, plus three full game clients through the actual relay. Campus-network latency and device performance still require a live playtest after redeployment.

Verification result for this package: all 19 included tests passed, including three full game clients through the real relay and delayed-update movement simulations.
