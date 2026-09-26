# Trenchbore

A drilling-submarine incremental game. Everything in it is made in code: the art is drawn on a canvas and the sound is synthesized.

- Open `index.html` through any web server to play (the artifact page is the quickest way).
- `node tools/sim.js` plays the full economy with a simple player model and prints when each boss falls. Add `--verbose` for every dive.
- `tools/package.sh` builds the two itch.io uploads in `dist/`: the full game and the demo, which stops after the Anglerfish.

## Balance targets (from the simulator)

These times assume a skilled, simulated player, so real players will take longer. The whole game runs about 2.5 to 3 hours.

| Boss | Minutes |
|---|---|
| Giant Clam | about 13 |
| Anglerfish (demo ends) | about 27 |
| Leviathan | about 42 |
| Hollow Survey | about 60 |
| Vent Wyrm | about 78 |
| Drowned King | about 92 |
| Crystal Titan | about 115 |
| Warden | about 140 |
| The Thing That Waits | about 170 |

These are the balance levers:

- Rock health growth and pay growth: `js/stats.js`
- Boss health (`hpK`): `js/data/bosses.js`
- Price growth per zone (×5): `js/data/tree.js`

## Releasing on itch.io

1. Run `tools/package.sh`.
2. Create two projects: "Trenchbore Demo" (free) and "Trenchbore" (paid).
3. For each project, set Kind of project to HTML and upload the matching zip. Tick "This file will be played in the browser".
4. Set the viewport to 1600 × 900, turn on the fullscreen button, and turn on "Automatically start on page load".
5. In the AI disclosure, say the graphics, sound and code are AI-generated.
6. Set up payouts under Settings → Payouts before the paid page goes live.
