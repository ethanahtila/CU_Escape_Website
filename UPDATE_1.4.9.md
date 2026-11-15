# CU Escape 1.4.9 — Cedar Lake Campus

Desktop and mobile use **1.4.9 / protocol 39**. The 1.4.8 leaderboard, achievement and save-queue repairs remain.

## Explore and find players

Select **Explore Campus / Find Players** in the menu. You spawn beside Cedar Lake near the SSC patio, in a shared first-person campus. Walk around the campus represented by the reference map, including the residence and athletics areas. The irregular shoreline, lake path, roads and relative building locations replace the earlier generic oval lake. There are 63 named exterior buildings. ENS and SBCC have public entrances; other building doors say **Coming soon**.

At an ENS or SBCC entrance, press **F** or the mobile Enter button. Browse open public groups, join one, or choose Key/Puzzle and a difficulty to create a public group. No room name needs to be typed or shared. Other students arriving at that building can join the group. The host starts when ready. Lobbies fill up to the existing 16-player capacity; a started or full public lobby disappears from the joinable list.

Public groups inherit the host settings automatically and remain associated with that building. Hosts can change mode/difficulty between rounds. Leave a public group before choosing a different building. Existing private room-name multiplayer remains available and stays out of public listings. Ranked retains its separate four-player matchmaking; leave its queue before joining a casual public group.

## SSC patio trading

All **24 trading tables are on the lakeside patio in front of Stevens Student Center (SSC)**. Their positions are fixed. Use the Trading Hall menu option for a campus waypoint, walk to a table, and press F / Sit. The existing two-person offers, equal rarity values, ownership checks and saved transactions are retained. Players must sign in to trade.

## Campus controls

| Control | Action |
| --- | --- |
| WASD | Walk / strafe |
| Mouse or drag | Look horizontally and vertically |
| Arrow keys | Walk forward/back and turn |
| Shift | Run on campus |
| F | Enter a public building lobby / sit at a nearby trade table |
| M | Toggle campus map |
| Campus map / Lake–full map buttons | View the lake area or whole map |
| Find a building | Search names and mark a walking destination |

Phones support left-side movement and right-side swipe looking, plus visible movement, Run and Enter/Sit buttons. The building-game controls and mechanics remain as before.

## Graphics, scale and performance

The campus is a **stylized approximation**, not a measured digital twin. Published floor areas inform the landmarks, while footprints, heights, paths and façade proportions use the campus illustration and available exterior references. Exact dimensions were not established for every building. See **CAMPUS_SOURCES.md** for provenance and limitations. Existing ENS/SBCC indoor escape layouts are retained.

The scene uses static meshes, procedural brick/grass/glass/water materials, capped resolution, distance culling and a small fountain animation. It downloads no third-party models or photo textures at runtime. Nearby presence is capped at 64 students per client, including yourself, and uses the existing throttled campus connection. Public lobby refreshes happen only while viewing an entrance panel. Movement does not query the account database.

Campus meshes upload once and are reused. On entering a match, the campus animation, socket and GPU resources are released, including when game settings had hidden the campus screen. The building renderer pauses while the campus is visible. A slower software renderer supports browsers without WebGL; campus maps remain available if 3D graphics cannot initialize. Real phone/GPU and Wi-Fi performance still need checking after deployment.

## Deploy

Replace all corresponding files in the linked GitHub repository, **commit**, wait for Render to deploy, and refresh every browser. Include the new world, renderer and public-matchmaking modules; updating only the HTML is insufficient. Keep the same single Node service and Turso settings. No account reset, extra server or manual database upload is needed. This ZIP has not been deployed by this chat.

Validation covers cross-device public lobby entry, inherited settings, private-room isolation, capacity/start rules, blocked movement, reachable entrances, correct lake triangulation, SSC patio placement, mobile controls and renderer cleanup. The graphics shaders were also compiled and their rendered output inspected with a GLES driver. A full browser/physical-iPhone visual session was not available in this environment.

Full regression result: **136 tests passed, zero failed**.
