# CU Escape Website — release 1.3.2

This is the current ENS + SBCC game, with Key and Puzzle modes, desktop/mobile controls, and an included multiplayer relay. This archive updates the supplied live version; the changes in this package have not been deployed by this chat.

## Current update: 1.3.2

Upload all extracted files to the existing linked repository and commit; Render can auto-deploy the linked branch. This package has not itself been deployed. All players must refresh after deployment: the new client protocol is 25.

### Multiplayer room entry

Successful joins now enter the 3D multiplayer lobby immediately. The host sees a visible Start game button; guests see the room/player count and who is hosting. Room settings remain available, and the menu always has Enter multiplayer lobby while waiting. Connection text clears once synchronization finishes. Starting from either button publishes a fresh round and opens gameplay for all clients. Returning the group to settings after a round still works.

### SBCC furniture

SBCC now uses a dedicated physical furniture palette instead of ENS desks, lab benches and bookcases: drawer-pedestal executive desks, swivel chairs, pedestal conference/seminar tables, upholstered sofas, filing cabinets, credenzas, stone planters, framed digital displays, presentation podiums, padded theater seats, enclosed server racks and dual-screen security consoles. These have different silhouettes and modeled structural parts, not just changed colors. Each named room and annex room retains its fixed placement profile. Walkways and interactable spawn slots remain clear. Player/entity collision includes seat backs, sofa arms and console monitors. ENS furniture and the café fixtures/layout are retained.

### Elevator inspection

After the opening alert delay, entities investigate the elevator as before. Each entity that reaches the landing checks it for three seconds, then resumes hunting. Once those checks finish (or another entity is diverted to a player/another alert), the empty car closes in place. Doors wait for students and entities to clear the cabin and threshold. Closing does not send the elevator to another floor or trigger a new AI alert. Players use F to open/call the elevator again; the existing eight-second outside-call and fifteen-second arrival delays remain. Inspection progress is shared in snapshots and survives host handoff.

### Controls

- WASD moves. Mouse movement / right-side touch dragging looks left, right, up and down. Arrow keys also turn and tilt the view.
- F is the single world-interaction key: collect keys/papers, use or leave lockers, open/call elevators, aim at a small floor button to select it, rescue, unlock/open the exit, or return from outside to rescue.
- Shift + F crawls through a nearby vent. On mobile, toggle crouch and tap USE.
- Space jumps. Mobile has a JUMP button. Players can jump onto suitable tables/desks/chairs and move over them; entities stay on the floor and must navigate around furniture. Only sufficiently high airborne jumps evade contact; standing on a desk is not an immunity state.
- If carrying keys/papers and no nearby object has an interaction, F drops one carried item. The on-screen action hint indicates this. M opens the map; I opens the puzzle inventory.

### Rooms and graphics

Every room in both maps, including annex rooms, has a sample defining fixed furnishing groups and possible collectible, vent and locker slots. The 160 individually keyed room profiles define the ENS palette and the separate SBCC palette, with a separate anchor list for each room. Fixtures fit the actual room shape while maintaining door approaches, and stay in the same positions across matches and devices. Jail samples remain empty. The café keeps its existing layout.

Furniture uses grounded 3D meshes with table/chair legs, beveled tops, monitors, shelves, lecterns, plants and wall-mounted boards. Players and entities share physical collision geometry; monitors, chair backs and lockers are also solid. Keys and paper fragments are smaller physical meshes resting on the ground, with thin visible edges and a very faint ground glow, including dropped items. The sample generator preserves door approaches and connected walking paths. Random interactive items are selected from its clear, fixed slots.

### Local audio and player names

The menu has a player-name field and separate entity-footstep and chase-music sliders, alongside background/capture music controls and the master mute. Preferences are stored locally in that browser. Names apply on the next join (or immediately for solo), are limited to 20 characters, and appear on player labels, the team list and the full map.

Footsteps are audible within sight range plus six tiles on the same floor, with distance attenuation and wall muffling. Every new chase independently chooses one of two original action scores with equal probability: Night Signal at 188 BPM (distorted bass, bent synth stabs and industrial break percussion) or Redline at 204 BPM (racing arpeggios, layered synth strings and heavy drums). Both are faster than the previous 156 BPM score. The selection stays fixed during the chase and survives brief menu/mute pauses. A soft distortion stage and output compressor control the denser mix. These are original synthesized compositions with the requested broad cinematic moods, not film recordings or recreated film melodies. It starts with clear line of sight up to three tiles beyond entity sight; this does not change entity detection. Once the exit opens and the permanent entity buffs activate, chase music plays for every player across all floors and hiding states until the round ends. Capture Doxology still takes priority. Locker and vent creaks never trigger AI alerts. Elevator doors slide and ding on opening and closing; an original light instrumental loop plays only inside the car. New effects and elevator-music sliders are saved independently with existing audio preferences. Alert callouts use the generic Loud noise label for elevators, rescue-expiry reveals and keypad alarms.


### Play another round with the same group

At the end of a multiplayer round, the host chooses Menu or New randomized round to return the entire connected group to the lobby. The host can then change the map, mode and difficulty and choose Start round. During a round, Return group to lobby is also available in the host’s menu. Guests wait for the host. No page reload or new room is needed.

In the lobby, the host can edit the room-name field and select Rename room for everyone. The relay moves the existing group together, retains player IDs/names and rejects occupied names. Copy room link uses the actual connected room. Leave room exits the group without reloading the page.

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

The round wins when everyone is outside and loses only when everyone is jailed. Outside players may use E / USE to return if a teammate is jailed. Jailed players can move and turn within the empty barred cell but cannot leave or interact. Rescuing teleports prisoners just outside the cell; they receive five seconds of immunity and the rescuer receives two. When each immunity ends, entities receive that player's location at that moment for a ten-second investigation. The timers survive late joins and host transfers.

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

Release 1.1.2 verification: 29 tests passed covering grounded room samples and collision, reachable interactive slots across both maps and expansion tiers, jump physics and partial movement acknowledgment, vertical elevator aiming, flat collectible geometry, local audio/mute/capture transitions, shared player names and host transfer, and full clients through the real relay. Native canvas renders were inspected for classroom furniture, compact elevator buttons and vertical views. These are local checks; the update still needs deployment and a live device/network playtest.

Release 1.1.3 verification: 35 tests passed, including repeated multiplayer rounds with map/mode/difficulty changes, whole-group room renaming and host handoff, original room-object profiles across expansion tiers, F interactions, reachable spawns, physical collectibles with a faint glow, and audio/mute/finale transitions. Native canvas renders were inspected for the smaller pickups and visible edges. The sounds are synthesized in-browser; subjective music balance and campus-network/device performance still need a live playtest after redeployment.

Release 1.1.4 verification: 36 automated tests passed. New checks force both chase-score choices on desktop and mobile, verify faster scheduling and selection stability during playback/mute/menu pauses, and cover rerolling for a new chase, exit-finale music and capture priority. Other gameplay, lobby, room, relay and control checks remain included. Browser audio playback could not be exercised in this environment; listen on your actual device after deployment to judge the mix and musical feel.

Release 1.1.5 verification: all 41 automated tests passed. Elevator checks cover investigation completion on both devices, waiting for both ENS entities, cabin/doorway clearance, closing without travel, reopening with F and the usual alert delay, normal passenger trips, and host handoff/late joining with inspection and door state preserved.

Release 1.3.1 verification: all 43 automated tests passed, including disjoint ENS/SBCC furniture palettes, grounded SBCC geometry, detailed seat/sofa/monitor collision, matching desktop/mobile room profiles, accessible spawns and routes across expansion tiers, and unchanged ENS/cafe geometry. Native canvas views of an office, meeting room, cybersecurity room and auditorium were inspected. Existing lobby, relay, chase audio and elevator inspection tests remain included.

Release 1.3.2 verification: all 44 automated tests passed. New real-relay checks use the Join multiplayer and visible Start game button handlers for three clients, including a mobile host, on ENS Key Mode and SBCC Puzzle Mode. They verify entry leaves the settings overlay, lobby/waiting controls are visible, gameplay opens for everyone, remote movement reaches the host, and the same group can restart from the settings menu. These are local automated checks; the updated package still requires deployment and refreshing all players’ tabs.
