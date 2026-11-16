# CU Escape 1.5.5 — Quick Comms

Desktop and mobile now automatically use the chat for the current section. There is no manual Public/Party channel picker.

## Public and Party

- **Public chat** is for campus and the waiting area. It reaches the people connected to the shared campus.
- **Party chat** is for the current match, reaching only the students in that room or ranked match, across all floors and distances.
- Entering a match switches to Party. Returning to the campus/waiting section switches to Public. Histories remain separate; messages and notifications from the other section are not displayed. An unavailable Party connection never falls back to sending to Public.
- A section change closes an open composer and clears its unsent draft, preventing an unfinished Public message from accidentally being sent to a party or vice versa.

## Controls

Press **/** to open typing chat. Press **Enter** to send and **Escape** or **Close** to resume gameplay. Enter by itself no longer opens chat. Typed letters do not trigger gameplay controls. Chat settings for text size, hiding messages and muting senders remain available.

Press **C** to open the quick-chat picker, select a callout with the mouse, or press C/Escape to close it. The picker releases the pointer lock without clearing held movement inputs. WASD and mobile joystick movement continue while the picker is open and after selecting a message. It does not focus a text box or open the phone keyboard. Touch devices have a **Quick chat** button with large clickable choices.

The twelve choices are:

- Stuck in jail — please help!
- Found a key!
- Found a key, but I can’t pick it up!
- Found a puzzle clue!
- I’m getting chased!
- Entity nearby — hide!
- Meet at the exit.
- Bring your keys to the exit.
- I need help!
- On my way!
- Wait for me!
- Ready to start!

Quick messages use the current section's chat and the same message limits as typed chat. They are ordinary player callouts and do not create entity-attracting noise. Enabled message notifications show a short five-second text notice, so teammates can read a callout without opening the composer. Notifications can be disabled in chat Settings.

## Deployment and checks

Commit the complete updated project, including both HTML clients, public/chat.js, public/campus.js and the server/campus/ranked modules. Wait for Render to deploy and refresh existing tabs. There are no additional services, dependencies or environment variables.

Checks cover separate histories and destinations, automatic section changes, no cross-section fallback, slash/Enter/C controls, held keyboard and touch movement while choosing a quick message, and the existing real-socket multiplayer tests. Existing game and progression checks also run. This archive is not itself a deployment; no public Render or physical iPhone test is claimed.
