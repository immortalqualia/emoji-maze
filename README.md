# Emoji Maze

[Play in your browser](https://immortalqualia.github.io/emoji-maze/)

Explore a semantic space of **1,146 emojis**. Find the target by moving between related emojis or combining their meanings.

The game runs entirely in the browser. No account, backend, installation, or live AI inference is required. You can also open the local `index.html` directly.

## How movement works

Your position is a vector, not necessarily a single emoji. Selecting several emojis **adds their vectors together**. That sum becomes your new position; it is not replaced by the nearest individual emoji.

The screen shows nine main suggestions. Each row also previews nine neighbors of its main emoji. **Every emoji in these rows is clickable**, including the smaller ones on the right.

## Mouse controls

- Click an emoji in the suggestions, previews, or **Memory** to add it to the expression field.
- Select multiple emojis to combine them, then press **Move**.
- Click an emoji inside the expression field to remove it.
- Press **+** beside a main suggestion to save it to Memory.
- Press **×** beside a Memory item to remove it.
- **Clear** clears the selected expression without moving.
- **Random jump** teleports to a random emoji while keeping the current target and Memory.
- **New game** resets the session: target, starting position, Memory, streak, history, counters, and GOD MODE. The selected difficulty and font remain selected.

Saving to Memory does not apply an emoji's vector. Memory items only participate in an expression when explicitly selected. Emojis in Memory and emojis used in the current position are excluded from suggestions.

## Touch controls (phones and tablets)

- Tap any emoji in the field or **Memory** to add it to the expression. Select one or more, then tap **Move**.
- Tap a selected emoji inside the expression field to remove it.
- Hold a **main emoji in the leftmost column** for about half a second to save it to Memory. Emojis to the right cannot be saved directly.
- Hold an emoji in **Memory** to open **Delete / Cancel**. Tap **Delete** to remove it, or **Cancel** to keep it.
- A successful hold does not also select the emoji. Moving your finger cancels the hold, so scrolling does not accidentally save anything.

The phone field shows all nine rows without horizontal scrolling. The main emojis are distinguished by a background and separator; row numbers, arrows, and the desktop **+ / ×** controls are hidden. Memory, the expression field, and **Move** stay at the bottom of the screen.

## Keyboard controls

The text input is still available:

- `1`–`9`: select a main suggestion and move.
- `25`: move to the sum of suggestions 2 and 5.
- `2q` or `25qw`: combine main suggestions with Memory items.
- `q`: move to the first Memory item. Memory keys follow `qwertyuiopasdfghjklzxcvbnm`; the letters are not shown in the mouse interface.
- `+2`: save main suggestion 2 to Memory.
- `-q`: remove the first Memory item.
- `0`: random jump.
- `quit` or `exit`: full New game reset.

Press **Enter** or **Move** to submit typed commands. One symbol and multiple symbols use the same vector-summing rule. Repeated selections add the same vector again.

## Goals and modes

A goal is reached when the target is the **nearest emoji to your position vector**, before suggestion exclusions are applied.

Completing a goal plays a victory sound and flash, increases the streak, and starts a fresh round. Memory clears; completed-round history remains. The next target appears in the center with a white, misty glow and **FIND THIS EMOJI**.

- **Normal mode** is the default. It excludes a fixed pool of 110 emojis from target selection.
- **Impossible mode** selects targets **only from that pool of 110**.
- Changing mode starts a new game and resets the session.

The pool was identified as unreachable from the graph's selected central starting point, **🦙 llama**, using ordinary clicks without Memory manipulation, combinations, random jumps, or cheats. This is not a claim that these emojis are impossible from every starting point or under every game mechanic. Both modes keep all 1,146 emojis in the world.

## Path hints and statistics

**Steps** estimates the shortest route using the nine main suggestions at each position. It does not count combinations, Memory-letter teleports, random jumps, or shortcuts through the clickable previews. Memory exclusions are respected. `Steps: no path` means no route exists under that restricted movement model.

Below the goal, the game tracks:

- Starting emoji and target.
- Time spent on the current goal and each completed goal.
- Actual moves and random jumps.
- Normal / Impossible mode.
- Total completed-goal time, total moves, and total random jumps.

A submitted expression counts as one move, regardless of its length. A random jump also counts as one move. Selecting, saving, or removing emojis does not count as a move.

A completed round receives **(Steps: no path)** only if it had no ordinary route **at the start of that round**. Later changes do not alter this marker.

## Saved games

Progress is saved automatically in this browser after actions, periodically during play, and when the page goes into the background. Reopening or reloading the page restores the position (including combined vectors), target, Memory, expression, streak, statistics, selected emoji set, and mode, including GOD MODE.

The round timer pauses while the page is hidden and resumes when you return. Time spent with the page closed is not counted. **New game** replaces the saved session with a fresh one.

Saves are local to the browser and site, not shared between devices. Clearing site data removes them; private browsing or blocked/full browser storage may prevent persistence. Incompatible or damaged saves start a fresh game rather than breaking the page.

## Sounds

- Fewer Steps after a move: ascending, cheerful sound.
- More Steps: descending, sad sound.
- `no path`: a separate sound.
- Goal reached: victory sound, taking priority over movement feedback.
- Unchanged Steps: silence.

For comparisons, the previous `no path` value is treated as zero. Audio starts in response to interaction; there is no startup sound.

## GOD MODE

The field at the bottom accepts an emoji from the dataset. Entering a valid emoji teleports there immediately, resets statistics, and replaces the statistics display with **GOD MODE**. Invalid input does not activate it.

GOD MODE remains active across completed rounds. **New game** turns it off.

## Emoji fonts

The small bottom selector switches between **Twemoji COLR** and **Noto Color Emoji**. Both bundled fonts contain every emoji in this dataset. The choice is remembered locally when browser storage is available.

Font licenses and attribution are included in `fonts/` in the published site (`web/fonts/` in the full local project).

## Dataset

- Unicode Emoji **15.0 or earlier**, fully qualified, single-codepoint entries only.
- The 24 repetitive clock-face emojis are excluded. Watch, alarm clock, and hourglasses remain.
- Inputs contain the emoji symbol, CLDR English name, and CLDR keywords.
- Embeddings: **Jina v5 text-small text-matching**, 1,024 dimensions, **not normalized**.
- Similarity and suggestions use **Euclidean distance** in the raw embedding space.

The browser loads precomputed vectors. No model runs or downloads during play. The full local project also contains the Python data-building tools and the older console prototype; the GitHub repository contains the browser version.
