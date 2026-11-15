# CU Escape 1.5.1 — Site-wide visitor analytics

Desktop and mobile use **1.5.1 / protocol 41**.

The supplied **GTM-KNS96ZMB** container is installed on the shared entry page, desktop game and mobile game using Google's current async installation snippet. The site security policy permits the Google tag and Analytics requests. Each document loads the container once; it is not reloaded for every menu, room, frame or server packet.

All game services run within those pages and share that tag. A lightweight collector queues section events for menus, sign-in, profiles, achievements/titles, leaderboards/rank, store/cosmetics, campus exploration, public lobbies, waiting rooms, Ranked queue and trading. It also queues deduplicated match start/end events for solo, standard multiplayer and Ranked. Player counts are anonymous totals, not names or identifiers.

The collector does not include usernames, passwords, account/session tokens, room names, private round/match IDs, positions or chat. Default page-location context removes query strings and fragments, and referrer context retains only the origin. No analytics work is added to the rendering loop. Duplicate snapshots do not create duplicate match-start records; blocking analytics does not stop gameplay.

This browser tag belongs in the website pages. It is not inserted into Turso database rows, JSON APIs, health checks or WebSocket messages, which would not run browser JavaScript and would misrepresent backend requests as people. The existing Node service serves the updated pages and collector; no additional hosting service or database migration is required.

**The container must have a connected, published Google Analytics destination for visitor reports.** If it already does, retain that setup. Section/match events require the documented GA event tag/trigger if you want them forwarded to Analytics. See **ANALYTICS_SETUP.md** for setup and verification. No Google account settings were accessed or published here, and live reporting has not been verified in your account.

Upload all corresponding GitHub files, **commit**, wait for Render to deploy and refresh. Keep your current website URL and Turso settings. Counting begins after the deployed tag and its Analytics destination are active; earlier visits cannot be reconstructed. Reports are estimates, and blocked scripts or different browsers/devices affect visitor counts.

The terrain, game mechanics, saved progression, rewards and multiplayer features from 1.5.0 are retained. This archive has not been deployed by this chat.

Validation: **146 automated tests passed, zero failed**, including site-wide installation/CSP checks, URL-context sanitization, actual solo/multiplayer/ranked event hooks, duplicate prevention and analytics failure isolation. Live collection into the owner’s Google account was not tested.
