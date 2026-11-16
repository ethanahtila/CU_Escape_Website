# CU Escape 1.5.3 — Explorers & Champions

Desktop and mobile share version 1.5.3. Both free passes now require **500 XP per level**. Standard remains 100 levels over two months; ranked remains 250 levels over three months. XP earnings, reward spacing, game difficulty, rank credits and season dates are unchanged. Deluxe passes and payments remain disabled.

## Visually separate passes

The standard pass is a campus expedition collection, beginning with **Lanterns of Cedar Lake**. Its seven skins now have distinct clothing construction: ranger poncho, archive layers, storm coat, insulated surveyor parka, workshop overalls, aurora robe and the Beacon Voyager mantle. Six head pieces have separate shapes: wide-brim hat, aviator cap, hood, mining helmet, beret and goggles. Six exclusive hand props are a camera, expedition map, specimen jar, umbrella, signal kite and beacon staff.

The ranked pass begins with **Obsidian Arena**, with separate future theme names. Its cosmetic families are fortress armor, duelist mantles, circuit suits, jagged rift equipment and solar champion regalia. Each advances through Initiate, Ascendant, Elite, Exalted and Apex designs. Higher grades visibly add plates, fins, crests, leg armor and orbiting equipment. Ranked head pieces include helmets, diadems, visors, horns and orbital halos. Ranked hand pieces include cosmetic arena blades, trophies, drones, gauntlets and reactor cores. These are appearance items with no added gameplay abilities.

Each of the 25 ranked skins, 25 head pieces and 25 hand props has different geometry within its category. The standard models are separate from the ranked models. The new art does not replace store cosmetics or change The Afterlight.

## Clearer reward previews

Pass cards now show the reward itself: a large hand prop, a close-up of headwear, or a skin with neutral accessories. The player's currently equipped gear no longer obscures the item being previewed. Reward names identify the actual item; descriptive text and separate track banners make the two passes easier to distinguish. Flex Dollar and title rewards have distinct large labels. The collection also uses the improved individual-item previews.

## Existing progress

All saved XP remains. For example, 8,500 XP becomes level 17 at the new threshold. Missing milestone rewards are granted automatically when the profile next loads. Grants use the existing per-level reward ledger, so previously paid rewards are not paid again. The conversion is transactional and retries safely after a database failure. Existing ownership, equipment, titles and IDs remain valid; pass cosmetics already earned receive their updated appearance.

Legacy XP totals above the new completion cap remain stored. The pass display caps at its final level, and further results do not reduce the saved total. No account or database reset is needed. Both SQLite and Turso use the same rules.

## Deployment and verification

Commit the full updated project to GitHub, wait for Render to deploy, and refresh all game tabs. Include the new **public/pass-art.js**, the updated public clients/scripts, **pass-store.cjs** and both progression backends. Public assets are included by the existing Docker copy step.

Checks cover geometry differences independent of color, both device menus, real profile HTTP requests, preserved legacy XP, milestone conversion, failed-grant rollback, repeated profile loads, reward/equipment persistence and the existing gameplay suite. The designs were also rendered to Canvas and visually inspected. This package does not deploy itself or claim an on-device Safari or live Render test.
