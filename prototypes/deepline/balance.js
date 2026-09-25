// Deepline balance: every number that shapes progression lives here.
// Loaded by the game (index.html) and by the simulator (tools/balance-sim.js),
// so tuning happens in one place.
(function (root) {
  const B = {
    base: { dps: 8, radius: 28, air: 8, fins: 1.5, sting: 2.5, bubble: 1.5 },

    // A rock at depth d has hp0 * hpGrowth^d health and pays coin0 * coinGrowth^d coins.
    // Health grows faster than pay, so upgrades have to keep up.
    rock: { hp0: 6, hpGrowth: 1.03, coin0: 1, coinGrowth: 1.018 },
    types: {
      rock:    { hp: 1, coin: 1 },
      crystal: { hp: 4, coin: 6 },
      iron:    { hp: 3, coin: 4 },
      vent:    { hp: 2, coin: 3 },
    },
    spawnEvery: 0.5,   // seconds between spawns in the shaft
    bubbleShare: 0.1,  // share of spawns that are air bubbles (air is capped at the tank size)
    jellyShare: 0.1,   // share of spawns that are jellyfish (below 5 m)

    zones: [
      { id: 'shelf',    name: 'Sunlit Shelf',    from: 0,   to: 50,  boss: { id: 'clam',   name: 'Giant Clam',     hp: 170 } },
      { id: 'kelp',     name: 'Kelp Twilight',   from: 50,  to: 120, boss: { id: 'angler', name: 'Anglerfish',     hp: 4200 } },
      { id: 'midnight', name: 'Midnight Trench', from: 120, to: 200, boss: { id: 'eye',    name: 'Leviathan Eye', hp: 60000 } },
    ],

    // Upgrade tree. col/row place the node on the tree screen (root at 0,0).
    // req: [parentId, parentLevel] reveals the node.
    upgrades: [
      { id: 'dmg',    name: 'Drill Power',    cat: 'drill',   col: 0,  row: 0,  req: null,           base: 5,    growth: 1.45, max: 10, desc: 'More damage per second.' },
      { id: 'air',    name: 'Air Tank',       cat: 'air',     col: -1, row: 0,  req: ['dmg', 1],     base: 6,    growth: 1.5,  max: 10, desc: 'Stay down longer.' },
      { id: 'size',   name: 'Drill Size',     cat: 'drill',   col: 1,  row: 0,  req: ['dmg', 1],     base: 8,    growth: 1.5,  max: 8,  desc: 'A wider drill hits more rocks at once.' },
      { id: 'value',  name: 'Salvage',        cat: 'coin',    col: 0,  row: 1,  req: ['dmg', 1],     base: 12,   growth: 1.55, max: 10, desc: 'More coins from every rock.' },
      { id: 'fins',   name: 'Fins',           cat: 'air',     col: -2, row: 0,  req: ['air', 1],     base: 10,   growth: 1.55, max: 10, desc: 'Sink faster.' },
      { id: 'bubble', name: 'Rebreather',     cat: 'air',     col: -1, row: -1, req: ['air', 2],     base: 20,   growth: 1.6,  max: 5,  desc: 'Bubbles give more air.' },
      { id: 'suit',   name: 'Stingproof Suit', cat: 'air',    col: -2, row: -1, req: ['bubble', 1],  base: 30,   growth: 1.7,  max: 4,  desc: 'Jellyfish take less air.' },
      { id: 'tank2',  name: 'Deep Tank',      cat: 'air',     col: -3, row: 0,  req: ['fins', 3],    base: 120,  growth: 1.7,  max: 5,  desc: 'A second tank. Much longer dives.' },
      { id: 'shock',  name: 'Shockwave',      cat: 'ability', col: 2,  row: 0,  req: ['size', 2],    base: 40,   growth: 1.6,  max: 5,  desc: 'Breaking a rock damages rocks around it.' },
      { id: 'sonar',  name: 'Sonar Pulse',    cat: 'ability', col: 2,  row: -1, req: ['shock', 1],   base: 150,  growth: 1.8,  max: 5,  desc: 'Every 4 s, damages every rock in the shaft.' },
      { id: 'drone',  name: 'Drill Drone',    cat: 'ability', col: 3,  row: -1, req: ['sonar', 1],   base: 400,  growth: 1.8,  max: 5,  desc: 'A drone drills the nearest rock on its own.' },
      { id: 'bit2',   name: 'Tungsten Bit',   cat: 'drill',   col: 0,  row: -1, req: ['dmg', 5],     base: 250,  growth: 1,    max: 1,  desc: 'Doubles all drill damage.' },
      { id: 'dmg2',   name: 'Drill Power II', cat: 'drill',   col: 0,  row: -2, req: ['bit2', 1],    base: 400,  growth: 1.55, max: 10, desc: '+25% drill damage per level.' },
      { id: 'bit3',   name: 'Diamond Bit',    cat: 'drill',   col: 0,  row: -3, req: ['dmg2', 5],    base: 15000, growth: 1,    max: 1,  desc: 'Triples all drill damage.' },
      { id: 'crystal', name: 'Prospector',    cat: 'coin',    col: 1,  row: 1,  req: ['value', 2],   base: 35,   growth: 1.6,  max: 5,  desc: 'Gold crystals show up more often.' },
      { id: 'lucky',  name: 'Lucky Strike',   cat: 'coin',    col: 1,  row: 2,  req: ['crystal', 1], base: 80,   growth: 1.65, max: 5,  desc: 'Chance for a rock to pay 5×.' },
      { id: 'gold2',  name: 'Pressure Pay',   cat: 'coin',    col: 0,  row: 2,  req: ['value', 5],   base: 300,  growth: 1.8,  max: 5,  desc: 'Coins grow with depth: +1% per 10 m per level.' },
    ],
  };

  B.cost = (u, lv) => Math.round(u.base * Math.pow(u.growth, lv));

  // Everything the game needs to know about the player's current build.
  B.stats = (lv) => {
    const L = id => lv[id] || 0;
    return {
      dps: (B.base.dps + 4 * L('dmg')) * (L('bit2') ? 2 : 1) * (1 + 0.25 * L('dmg2')) * (L('bit3') ? 3 : 1),
      radius: B.base.radius + 5 * L('size'),
      air: B.base.air + 1.5 * L('air') + 3 * L('tank2'),
      fins: B.base.fins + 0.35 * L('fins'),
      coinMult: 1 + 0.25 * L('value'),
      pressurePay: 0.01 * L('gold2'), // per 10 m
      crystalChance: 0.08 + 0.03 * L('crystal'),
      bubble: B.base.bubble + 0.3 * L('bubble'),
      sting: B.base.sting * (1 - 0.2 * L('suit')),
      shock: 0.15 * L('shock'),        // share of the broken rock's max hp dealt nearby
      sonar: 0.5 * L('sonar'),         // × dps, every 4 s, to every rock
      drone: 0.2 * L('drone'),         // × dps, on the nearest rock
      lucky: 0.04 * L('lucky'),
    };
  };

  // What one level of an upgrade means, for the tree's "now → next" line.
  B.effect = {
    dmg: l => `${B.base.dps + 4 * l} base dmg/s`,
    air: l => `${B.base.air + 1.5 * l} s air`,
    size: l => `${B.base.radius + 5 * l} px drill`,
    value: l => `×${(1 + 0.25 * l).toFixed(2)} coins`,
    fins: l => `${(B.base.fins + 0.35 * l).toFixed(2)} m/s`,
    bubble: l => `+${(B.base.bubble + 0.3 * l).toFixed(1)} s per bubble`,
    suit: l => `−${(B.base.sting * (1 - 0.2 * l)).toFixed(1)} s per sting`,
    tank2: l => `+${3 * l} s air`,
    shock: l => `${15 * l}% splash`,
    sonar: l => `${50 * l}% dmg pulse`,
    drone: l => `${20 * l}% dmg drone`,
    bit2: l => (l ? '×2 damage' : 'not installed'),
    dmg2: l => `+${25 * l}% damage`,
    bit3: l => (l ? '×3 damage' : 'not installed'),
    crystal: l => `${8 + 3 * l}% crystals`,
    lucky: l => `${4 * l}% lucky rocks`,
    gold2: l => `+${l}% per 10 m`,
  };

  B.rockHp = d => B.rock.hp0 * Math.pow(B.rock.hpGrowth, d);
  B.rockCoin = d => B.rock.coin0 * Math.pow(B.rock.coinGrowth, d);
  B.zoneAt = d => B.zones.find(z => d < z.to) || B.zones[B.zones.length - 1];

  if (typeof module !== 'undefined' && module.exports) module.exports = B;
  else root.DEEPLINE_BALANCE = B;
})(this);
