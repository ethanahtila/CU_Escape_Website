# CU Escape 1.5.6 — Chat Focus

Sending a typed message with **Send** or **Enter** now clears and unfocuses the text box while leaving the chat panel and messages visible. Keyboard focus returns to the game or campus canvas, so WASD controls the character again. On mobile, blurring the input dismisses the keyboard.

Click the text box again or press **/** to compose another message. Movement is suppressed only while composing, rather than whenever chat is visible. Escape/Close still hides the panel. Public/Party routing, chat settings and quick chat remain available. Switching from a visible, unfocused chat panel to quick chat preserves held movement.

Desktop/mobile checks cover button and Enter sends, panel visibility, released caret/focus, restored movement, refocusing to type again and quick chat after sending, alongside the existing chat/campus and website integration checks.

Commit the complete updated project to GitHub, let Render deploy and refresh game tabs. No new service, environment setting or database migration is required. This archive has not itself been deployed.
