# Trenchbore: project notes for Claude

## Who the owner is
- The owner is not a developer. They direct the work, play the builds and give feedback; Claude builds everything.
- Write to them in plain, short English and give honest opinions.
- Everything is made by AI in code: art drawn on canvas and sound synthesized with Web Audio. No asset packs and no pixel artists, ever.
- PC only, no mobile.
- Paid games only: no free or ad-supported games.

## What exists
- `game/`: Trenchbore, the full game (HTML5 canvas, plain JS, no build step).
  - A submarine with a drill arm dives through 9 zones down to hell-like depths.
  - It has 9 bosses, an 81-part radial upgrade tree, 24 relics, story radio, a logbook, a map, awards and two endings.
  - See `game/README.md` for how to run it.
  - `game/tools/sim.js` is the balance simulator. It currently paces the 9 bosses across about 2.5–3 simulated hours.
  - `game/tools/package.sh` builds the itch.io zips (full and demo).
  - The published build is at https://claude.ai/artifact/WBqbHs8jMZXf7UwCzP8bcy.
- `reports/What players love in incrementals.md`: research on what players love and hate in this genre, UI patterns, suspense, and sales. The notes behind it are in `research_notes/`.
- `docs/plan/`: the original full-game plan page. `design/upgrade-tree.js` is the original tree plan.
- `prototypes/deepline/`: early prototypes (the old name was "Deep Line").

## Where we are
The owner played the build and asked for a rethink before any more changes. They are open to reshaping the game heavily, or even scrapping it. The research verdict is to reshape, not scrap: the loop is the same as the 95%+ games, and the real risk is the second half (zones 6–9).

### Owner feedback to act on
- Rename "Workshop" to **Upgrades**.
- **Upgrade tree:**
  - Pure black, mysterious background, with no blueprint grid and no field of "?" nodes.
  - Show only owned nodes plus the ones you can buy next; new branches grow out when you buy.
  - The tooltip goes right next to the mouse and shows the change, e.g. "8 → 12 dmg/s".
- **Speed upgrade:** it should not sit behind another purchase. Early credits are fine as they are: do NOT give more money early.
- **Left panel:** remove the dive report and stats side panel. Replace it with a between-dives scene: the ship at the surface, the sub on the winch, a short result that fades, and a big Dive button. Move the controls choice to Settings.
- **Map:** a drawn slice of the trench, dark below the explored depth, instead of a text list.
- **Relics:** the tab is hidden until the first relic is found, then a notification says it's unlocked. Don't show all relics or where they drop.
- **Logbook:** a "!" or "new" marker on the tab and on new entries.
- **Awards:**
  - The owner dislikes empty achievements; every goal must give something concrete.
  - Never use the word "contracts". Research found the loved games say Milestones or Unlocks.
- **Menu background:** remove the repeated grid pattern behind the menu screens. The in-dive scene background is a separate issue.
- **Health bars:** probably remove them on small targets and show damage visually (cracks, chunks, flinching). Keep a big boss bar.
- **Creatures:** each needs a purpose. Example: crabs steal the ore you broke and run off with it.
- **Background art:** avoid evenly repeated shapes. Use fewer, bigger shapes, with one landmark per zone.

### Research takeaways (details in the report)
- **Suspense:**
  - Hide what the game will become and change the rules at stages.
  - Tease with sound before sight and with silhouettes.
  - Keep one big mystery running under the whole game.
  - Mix predictable milestones with surprise finds.
- **What players punish:**
  - A second half that plays itself, or grind walls.
  - Deep zones that feel like early ones.
  - Weightless digging and weak endings.
  - Flashing and screen-shake toggles that don't actually work.
- **Money:**
  - Selling on itch.io alone likely earns only tens of dollars.
  - Plan: one itch page with a browser demo and a "$2.99 or more" price, used as a test; move to Steam if people like it.
  - Disclose AI use honestly.

## Next step the owner expects
Draw mockups of the new screens (between-dives scene, black upgrade tree, trench map) for the owner to approve before rebuilding. Don't change the game until they approve a direction.

## Working rules
- Test in a headless browser (Playwright) before showing builds. The owner judges by playing.
- Rebalance with `node game/tools/sim.js` after economy changes.
- Commit with clear messages.
