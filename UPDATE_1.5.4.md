# CU Escape 1.5.4 — Campus Comms

Desktop and mobile now include text chat. Voice chat and microphone permissions are not required.

## Controls

- Press **Enter** to open chat, type a message, then press **Enter** to send. **Escape** or **Close** returns to gameplay. Sending keeps the panel open for a conversation.
- On mobile, tap **Chat**, type with the phone keyboard, and tap **Send** or its Enter key. The button is placed above the right-side movement/action controls on touch devices.
- Open **Settings** inside chat at any time to choose normal/large text, turn the unread badge on/off, or hide messages. These preferences are stored on this browser.
- Tap a sender's name to mute that connection locally. **Clear muted players** in Settings restores muted messages. Muting does not affect anyone else's chat.

Movement, looking and local interaction actions are suppressed while the chat panel is open. Opening/closing clears held keyboard/touch controls, so typing W/F/R/Space cannot walk, interact, punch, drop keys or jump. The game and other players continue running; chat does not pause the match. Existing puzzle/keypad input retains Enter when its own interface is open. Composition input is supported.

## Channels

- **Room:** the students in your current standard multiplayer room, regardless of floor, distance, capture or escape. Chat continues across rounds and room renames while the room exists.
- **Ranked match:** only the four matched students. Eliminated students can still chat, and the conversation remains available after the race until they leave or queue again. Other ranked matches are separate.
- **Campus:** everyone connected to the shared campus, including waiting/trading players. If both campus and room connections exist, choose the channel from the chat dropdown.

Solo play has no remote recipients. Join multiplayer or explore campus to communicate with other people. Chat does not make entity-attracting noise.

## Storage and performance

Chat uses the existing WebSocket connections. There is no new service, polling loop, database table or external subscription. Each conversation retains its last 40 messages in server memory for late joiners. History disappears when its room/match is discarded or the server restarts. Messages are not saved to profiles or sent to game analytics. Server-assigned names prevent message name/identity spoofing; text is displayed literally rather than interpreted as HTML.

Messages are limited to 240 characters. A connection can send a burst of four, then replenishes one allowance every two seconds. Excess chat receives a chat-only warning rather than disconnecting the student. Client lists/history and unread counts are bounded.

## Deploy

Replace and commit the complete project in GitHub, wait for Render to deploy, then refresh both desktop and mobile tabs. Include the new **chat.cjs** and **public/chat.js**, updated server/room/campus/ranked files and both HTML clients. The Docker copy list includes the new server module. No additional environment variables or database setup are needed. This package does not deploy itself.

## Validation

Tests cover actual room/campus WebSockets, four-student ranked isolation, identity spoof rejection, message limits and history, database-independent delivery, literal text rendering, keyboard/touch release, IME handling, keypad Enter ownership and three real desktop/mobile game clients exchanging chat. Existing game, persistence and progression tests also run. No public Render or physical iPhone test is claimed.
