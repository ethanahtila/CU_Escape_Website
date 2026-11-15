# View game visits and service usage

Container: **GTM-KNS96ZMB**. It is installed in `/`, `/index.html`, `/desktop` and `/mobile`. The entry aliases serve the same document. Menu sections and game services share the desktop/mobile documents, so they share the same tag rather than loading additional copies.

## After committing and deploying the update

1. Open [Google Tag Manager](https://tagmanager.google.com/) and select **GTM-KNS96ZMB**.
2. If this container already has a published Google Analytics destination, keep it and proceed to verification below.
3. Otherwise, create/select your game property and Web data stream in [Google Analytics](https://analytics.google.com/). Copy its Google Analytics Tag/Measurement ID, normally beginning `G-`. This is different from the installed container ID.
4. In Tag Manager, add a **Google Analytics** destination tag (or **Google tag**, depending on the interface). Enter that Analytics tag ID and choose the initialization trigger for all pages/all initialization events. Save it. Keep just one base Analytics destination for the game so page views are not sent twice by duplicate configurations.
5. Use **Preview** and connect to the game's live HTTPS URL. Check that the container loads on both `/desktop` and `/mobile` and that the Analytics page-view tag fires. You can also use **Test** in the container installation dialog.
6. Use **Submit → Publish** to make unpublished container changes live. Committing to GitHub deploys the game code; publishing in Tag Manager deploys your Google tag configuration. Both are necessary when both have changed.
7. Open the game in a fresh browser window or a second device. Check **Realtime** in Analytics, then the regular reports after processing. Visitors do not need to sign in to the game.

For the count you originally asked for, use **Total users/Users** over the desired date range. Sessions count visits, including returns. Page views count page loads; the entry page redirects to a device page, so page views are not the same as people. Visitors using multiple browsers/devices may count more than once, and blocked analytics can go uncounted. Tracking starts when the deployed/published setup becomes active; it cannot recover old unrecorded visits.

## Optional: report each game service and actual plays

The code already queues these events. To forward them to your Analytics destination in Tag Manager:

1. Create a **Custom Event** trigger with the regular expression `^cu_game_(section|start|end)$` and enable regular-expression matching.
2. Create Data Layer Variables for the parameter names below, using the same names as the Data Layer Variable Name. Use the standard data-layer variable type; custom JavaScript variables are unnecessary.
3. Create a **Google Analytics: GA4 Event** tag using the same Analytics destination/tag ID. Set Event Name to the built-in **{{Event}}** variable. Add the parameters you want using their corresponding Data Layer Variables and use the Custom Event trigger from step 1.
4. Preview the game, check the events/parameters, then **Submit → Publish**. Missing parameters are cleared between events to prevent an old match's settings from leaking into a later service view.

| Event | When | Parameters |
| --- | --- | --- |
| `cu_game_section` | A tracked section opens | `game_section`, `game_version`, `device_type` |
| `cu_game_start` | The player enters a running match | `play_type`, `game_map`, `game_mode`, `game_difficulty`, `player_count`, `game_version`, `device_type` |
| `cu_game_end` | Win, loss, leaving a running game, or personal Ranked result | Match parameters plus `result`, `duration_seconds`; Ranked also supplies `placement` |

Section values include `menu`, `login`, `signup`, `profile`, `achievements`, `titles`, `leaderboards`, `rank`, `store`, `skins`, `rarities`, `campus`, `waiting_lobby`, `trading`, `ranked_queue`, `public_lobbies`, `gameplay` and `results`. Result values are `won`, `lost`, `left`, `escaped` or `eliminated`. These are usage events, not authoritative leaderboard records or a replacement for the game's existing saved results.

Register any event parameters you want to use as custom dimensions/metrics in Google Analytics reports. Raw events can first be checked in Tag Manager Preview / Analytics DebugView. Adding the container alone does not automatically create these custom reports or their event-forwarding tag.

## Scope and operation

- The Google script loads asynchronously. The game does not wait for a tracking request or response. No analytics requests are added to the animation or movement-packet loops.
- Your container's published tags determine what Google ultimately loads and collects. The included game event collector uses only the listed non-personal parameters. It does not forward game credentials or private room/round identifiers.
- Website page context is sanitized before tag initialization: query/hash values are omitted, and the referrer is reduced to its origin. If you add tags with custom URL parameters later, review that tag's own settings.
- There is no browser tag to paste into Render's background processes, Turso, the JSON APIs or the WSS relay. Their player-facing activity is represented by the browser's service/match events. Backend request volume and human visitor counts are different measurements.
- The server CSP includes Google's documented endpoints for Analytics without Ads. Custom tags using other vendors may need their own CSP allowances. No Ads/remarketing setup was added.
- No Google dashboard access, property configuration or container publication was performed while preparing this package.

Official references:

- [Install a web container — current async snippet](https://support.google.com/tagmanager/answer/14847097?hl=en)
- [Set up Google Analytics in Tag Manager](https://support.google.com/tagmanager/answer/9442095?hl=en)
- [Google tag Content Security Policy guidance](https://developers.google.com/tag-platform/security/guides/csp)

- [Set up custom Google Analytics events in Tag Manager](https://support.google.com/tagmanager/answer/13034206?hl=en)
