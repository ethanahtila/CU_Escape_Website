# CU Escape 1.5.8 — Touch Restored

Desktop and mobile use version 1.5.8, protocol 41. This update repairs mobile controls without changing game rules or rewards.

- The chat container no longer blocks touches on its invisible area. Only actual chat buttons and visible panels accept input. Chat notifications let touches pass through. Landscape positioning no longer stretches the chat container between top and bottom anchors.
- Mobile Jump remains pending until a physics update consumes it, including at 60/120 Hz. Multiplayer guests send the jump with their predicted movement. A tap produces one jump and clears on control reset.
- The campus has a permanent **Leave lobby** button above **Enter / sit**. It returns to the menu and leaves the room or ranked queue when applicable. Both actions respond to touch-down even while another finger is moving/turning, without duplicating the action on the generated click.
- Movement and right-swipe turning remain independent, allowing actions while holding movement.

Deploy the complete package through the existing GitHub/Render workflow, wait for deployment, then reload every open game tab. The menu/status should report 1.5.8. No database migration or account reset is needed. This package does not deploy itself.

Regression checks exercise mobile button events, high-refresh jump timing, host/guest jump delivery, concurrent movement/turning, chat overlay hit-test CSS and leaving all four campus lobby types. Physical iPhone/Safari testing and live deployment are not claimed.
