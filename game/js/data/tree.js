// The upgrade tree: 81 parts in six branches around the sub.
// A part shows once its parent has at least one level. Gated parts also need a milestone.
// Currencies: cr = Credits, sp = Specimens, pe = Abyssal Pearls.
// Credit prices scale with the zone (z) where the part is meant to be bought: ×5 per zone.
(function () {
  const TB = globalThis.TB = globalThis.TB || {};

  const branches = {
    core:    { name: 'The Minnow',    color: '#f0b429', what: 'Your sub. Every branch grows out of it.' },
    drill:   { name: 'Drill',         color: '#3fe0c5', what: 'Cut faster, crit harder, and climb the drill-head ladder.' },
    hull:    { name: 'Hull & Oxygen', color: '#7fd8ff', what: 'Stay down longer, sink faster, survive the pressure.' },
    salvage: { name: 'Salvage',       color: '#f6c453', what: 'Earn more from every rock, creature, boss and relic.' },
    systems: { name: 'Systems',       color: '#b18cff', what: 'Machines that fight for you: sonar, drones, torpedoes.' },
    biology: { name: 'Biology',       color: '#7be08a', what: 'Study the creatures. Opens after the Giant Clam.' },
    ancient: { name: 'Ancient',       color: '#ff6b4a', what: 'Power from the Sunken City. Opens in Act 3.' },
  };

  // id, name, branch, parent, max, currency, effect text, options { base, g, z, w, gate }
  const N = (id, name, branch, parent, max, cur, fx, o = {}) => ({ id, name, branch, parent, max, cur, fx, gate: o.gate || null, base: o.base, g: o.g, z: o.z, w: o.w });
  const nodes = [
    N('core', 'The Minnow', 'core', null, 1, 'cr', 'Your one-seat salvage sub. Owned from the start.'),

    // ---- Drill
    N('drill1', 'Drill Motor', 'drill', 'core', 25, 'cr', '+4 damage per second', { base: 5, g: 1.6 }),
    N('drill2', 'Wider Bit', 'drill', 'drill1', 8, 'cr', 'Bigger drill head, longer arm reach', { base: 8, g: 1.5 }),
    N('drill3', 'Serrated Flutes', 'drill', 'drill2', 5, 'cr', '+4% critical hit chance', { z: 1 }),
    N('drill4', 'Critical Grind', 'drill', 'drill3', 5, 'cr', '+25% critical damage', { z: 2, w: 1.5 }),
    N('drill5', 'Shatter', 'drill', 'drill4', 3, 'cr', 'Targets below 8 / 12 / 16% health crumble instantly', { z: 3, w: 2 }),
    N('head1', 'Steel Head', 'drill', 'drill1', 1, 'pe', '×2 drill damage', { base: 3, gate: 'clam' }),
    N('head2', 'Gold Head', 'drill', 'head1', 1, 'pe', '×2 drill damage, +10% credits', { base: 5, gate: 'angler' }),
    N('head3', 'Tungsten Head', 'drill', 'head2', 1, 'pe', '×2.5 drill damage', { base: 8, gate: 'eye' }),
    N('head4', 'Diamond Head', 'drill', 'head3', 1, 'pe', '×2.5 drill damage, cuts through armour', { base: 12, gate: 'hollow' }),
    N('head5', 'Obsidian Head', 'drill', 'head4', 1, 'pe', '×3 drill damage, heat-proof', { base: 16, gate: 'wyrm' }),
    N('head6', 'Hellforged Head', 'drill', 'head5', 1, 'pe', '×3 drill damage, sets targets burning', { base: 22, gate: 'titan' }),
    N('head7', 'Heartstone Head', 'drill', 'head6', 1, 'pe', '×4 drill damage', { base: 30, gate: 'warden' }),
    N('drill6', 'Drill Motor II', 'drill', 'head1', 20, 'cr', '+25% damage', { z: 1, w: 1.5, g: 1.6 }),
    N('drill7', 'Overheat', 'drill', 'drill6', 5, 'cr', '+8% damage while the tip glows hot', { z: 4 }),
    N('drill8', 'Resonance', 'drill', 'drill7', 5, 'cr', 'Up to +12% damage per level the longer you hold one target', { z: 5 }),
    N('drill9', 'Boss Breaker', 'drill', 'drill6', 5, 'cr', '+20% damage to bosses', { z: 3 }),
    N('drill10', 'Drill Motor III', 'drill', 'head4', 30, 'cr', '+40% damage', { z: 5, w: 2, g: 1.7 }),
    N('drill11', 'Second Arm', 'drill', 'head5', 1, 'pe', 'A second drill arm that cuts the nearest target by itself', { base: 15 }),
    N('drill13', 'Third Arm', 'drill', 'drill11', 1, 'pe', 'A third drill arm', { base: 25, gate: 'warden' }),
    N('drill12', 'Hellfire Coating', 'drill', 'head6', 3, 'pe', 'Burning targets take 20% of your damage per second', { base: 4, g: 1.5 }),

    // ---- Hull & Oxygen
    N('hull1', 'Oxygen Tank', 'hull', 'core', 15, 'cr', '+1.5 s of oxygen', { base: 6, g: 1.7 }),
    N('hull2', 'Ballast', 'hull', 'hull1', 15, 'cr', 'Sink 0.35 faster', { base: 10, g: 1.7 }),
    N('hull3', 'Air Scrubber', 'hull', 'hull1', 5, 'cr', '+0.3 s from every air pocket', { base: 20, g: 1.6 }),
    N('hull4', 'Hull Plating', 'hull', 'hull3', 4, 'cr', 'Stings and bites cost 20% less oxygen', { z: 1 }),
    N('hull5', 'Reserve Tank', 'hull', 'hull2', 8, 'cr', '+3 s of oxygen', { z: 2, g: 1.7 }),
    N('hull6', 'Headlamp', 'hull', 'hull1', 5, 'cr', 'Wider, longer light in the dark zones', { z: 2 }),
    N('hull7', 'Floodlight', 'hull', 'hull6', 3, 'cr', 'Anything in your light takes +10% damage', { z: 4 }),
    N('hull8', 'Emergency O2', 'hull', 'hull5', 3, 'cr', 'Once per dive, refill 20 / 30 / 40% when empty', { z: 3, w: 2 }),
    N('press1', 'Pressure Hull I', 'hull', 'hull2', 1, 'pe', 'Rated to 3 km. Opens the Wreck Graveyard', { base: 4, gate: 'eye' }),
    N('press2', 'Pressure Hull II', 'hull', 'press1', 1, 'pe', 'Rated to 7 km. Opens the Hadal Vents', { base: 7, gate: 'hollow' }),
    N('press3', 'Pressure Hull III', 'hull', 'press2', 1, 'pe', 'Rated to 11 km. Opens the Sunken City', { base: 10, gate: 'wyrm' }),
    N('press4', 'Pressure Hull IV', 'hull', 'press3', 1, 'pe', 'Rated to 30 km. Opens Beneath the Floor', { base: 14, gate: 'king' }),
    N('press5', 'Pressure Hull V', 'hull', 'press4', 1, 'pe', 'Rated to 66 km. Opens the Red Below', { base: 18, gate: 'titan' }),
    N('press6', 'Unrated Hull', 'hull', 'press5', 1, 'pe', 'No rating. Opens the Heart', { base: 24, gate: 'warden' }),
    N('hull9', 'Thermal Shielding', 'hull', 'press2', 1, 'pe', 'Vent heat and geysers cannot hurt you', { base: 6 }),
    N('hull10', 'Sealed Cockpit', 'hull', 'hull4', 3, 'cr', '15% chance per level to shrug off a sting or bite', { z: 5 }),
    N('hull11', 'Deep Reserve', 'hull', 'hull8', 5, 'pe', '+5 s of oxygen', { base: 2, g: 1.5 }),

    // ---- Salvage
    N('sal1', 'Refinery', 'salvage', 'core', 20, 'cr', '+25% credits from everything', { base: 12, g: 1.7 }),
    N('sal2', 'Ore Scanner', 'salvage', 'sal1', 5, 'cr', 'Rare ore shows up 35% more often', { z: 1 }),
    N('sal3', 'Lucky Strike', 'salvage', 'sal2', 5, 'cr', '+4% chance a target pays ×5', { z: 2 }),
    N('sal4', 'Golden Touch', 'salvage', 'sal3', 3, 'cr', '5% chance per level that ore pays double', { z: 4 }),
    N('sal5', 'Pressure Pay', 'salvage', 'sal1', 5, 'cr', '+4% credits per zone below the surface', { z: 3 }),
    N('sal6', 'Market Contacts', 'salvage', 'sal5', 5, 'cr', '+20% boss bounty', { z: 4 }),
    N('sal7', 'Deep Contracts', 'salvage', 'sal6', 5, 'pe', '+8% credits per boss beaten', { base: 2, g: 1.5 }),
    N('sal8', 'Relic Detector', 'salvage', 'sal2', 5, 'cr', 'Relic caches show up more often', { z: 3, gate: 'wrecks' }),
    N('sal9', 'Appraiser', 'salvage', 'sal8', 5, 'pe', 'Relic caches pay credits too', { base: 2, g: 1.6 }),
    N('sal10', 'Salvage Nets', 'salvage', 'sal1', 5, 'cr', '+20% credits from creatures', { z: 1 }),
    N('sal11', 'Bounty Board', 'salvage', 'sal10', 3, 'sp', 'First of each creature per dive pays ×10', { base: 15, g: 1.8 }),
    N('sal12', 'Black Market', 'salvage', 'sal11', 1, 'sp', 'Specimens you bring up also pay credits', { base: 30 }),

    // ---- Systems
    N('sys1', 'Shockwave', 'systems', 'core', 5, 'cr', 'Anything you break damages what is around it', { base: 40, g: 1.6 }),
    N('sys2', 'Sonar Pulse', 'systems', 'sys1', 5, 'cr', 'Every 4 s, damage everything on screen', { z: 2, w: 2 }),
    N('sys3', 'Long Sonar', 'systems', 'sys2', 5, 'cr', 'Sonar fires 0.4 s sooner', { z: 3 }),
    N('sys4', 'ROV Drone', 'systems', 'sys2', 5, 'cr', 'A drone cuts the nearest target by itself', { z: 3, w: 2 }),
    N('sys5', 'Second Drone', 'systems', 'sys4', 1, 'pe', 'Two drones', { base: 6 }),
    N('sys6', 'Third Drone', 'systems', 'sys5', 1, 'pe', 'Three drones', { base: 10 }),
    N('sys7', 'Drone Cutters', 'systems', 'sys4', 5, 'cr', '+30% drone damage', { z: 4 }),
    N('sys8', 'Torpedo Bay', 'systems', 'sys1', 5, 'cr', 'Fires a torpedo at a creature every 3 s', { z: 2, w: 1.5 }),
    N('sys9', 'Homing Torpedoes', 'systems', 'sys8', 3, 'cr', 'Torpedoes chase their target and hit harder', { z: 4 }),
    N('sys10', 'Depth Charges', 'systems', 'sys8', 5, 'cr', 'A big blast below you every 6 s', { z: 4, w: 1.5 }),
    N('sys11', 'Chain Lightning', 'systems', 'sys10', 5, 'pe', 'Blasts arc to nearby targets', { base: 3, g: 1.5 }),
    N('sys12', 'Auto-Drill', 'systems', 'sys7', 1, 'pe', 'Let go of the mouse and the arm keeps cutting the nearest target', { base: 8 }),
    N('sys13', 'Harpoon Gun', 'systems', 'sys9', 3, 'pe', 'Harpoons a boss for heavy damage every 10 s', { base: 4, g: 1.6 }),
    N('sys14', 'Flare Launcher', 'systems', 'sys2', 3, 'cr', 'Flares light up the dark and stun jellyfish', { z: 3 }),

    // ---- Biology (Specimens)
    N('bio1', 'Specimen Lab', 'biology', 'core', 1, 'cr', 'Creatures start dropping Specimens', { z: 1, w: 3, gate: 'clam' }),
    N('bio2', 'Bait Lure', 'biology', 'bio1', 5, 'sp', 'More creatures show up', { base: 4, g: 1.45 }),
    N('bio3', 'Predator Instinct', 'biology', 'bio2', 5, 'sp', '+15% damage to creatures', { base: 6, g: 1.45 }),
    N('bio4', 'Taxidermy', 'biology', 'bio2', 5, 'sp', 'Creatures pay +25%', { base: 6, g: 1.45 }),
    N('bio5', 'Toxin Study', 'biology', 'bio1', 4, 'sp', 'Stings hurt 15% less; jellyfish can be drilled', { base: 5, g: 1.5 }),
    N('bio6', 'Jelly Tamer', 'biology', 'bio5', 3, 'sp', 'Jellyfish drift away from the hull', { base: 10, g: 1.6 }),
    N('bio7', 'Symbiote', 'biology', 'bio5', 3, 'sp', 'Each creature you kill gives back 0.3 s of oxygen', { base: 12, g: 1.6 }),
    N('bio8', 'Bioluminescence', 'biology', 'bio1', 3, 'sp', 'Creatures glow, so you see them in the dark', { base: 8, g: 1.5 }),
    N('bio9', 'Weak Spot Study', 'biology', 'bio8', 5, 'sp', '+8% critical chance against bosses', { base: 20, g: 1.45 }),
    N('bio10', 'Abyss Adaptation', 'biology', 'bio8', 5, 'sp', 'The dark is 8% less dark', { base: 15, g: 1.45 }),
    N('bio11', 'Parasite Culture', 'biology', 'bio3', 3, 'sp', 'Hits infect creatures with damage over time', { base: 25, g: 1.6 }),

    // ---- Ancient (Pearls)
    N('anc1', 'Inscription Reader', 'ancient', 'core', 1, 'pe', 'Read the city walls. Opens this branch', { base: 5, gate: 'city' }),
    N('anc2', 'Ancient Motor', 'ancient', 'anc1', 5, 'pe', '×1.5 all damage', { base: 5, g: 1.4 }),
    N('anc3', 'Rune Hull', 'ancient', 'anc1', 3, 'pe', '12% chance per level to ignore any hazard', { base: 4, g: 1.5 }),
    N('anc4', 'Blood Pact', 'ancient', 'anc2', 5, 'pe', 'Up to +10% damage per level as your oxygen runs low', { base: 5, g: 1.4 }),
    N('anc5', 'Echo of the Heron', 'ancient', 'anc3', 3, 'pe', 'Relic effects +17% per level', { base: 5, g: 1.5 }),
    N('anc6', 'Heart Resonance', 'ancient', 'anc4', 3, 'pe', '+50% damage against the Heart per level', { base: 6, g: 1.5 }),
    N('anc7', 'Pearl Sight', 'ancient', 'anc1', 3, 'pe', 'Pearl oysters show up far more often', { base: 4, g: 1.5 }),
  ];

  const byId = {};
  const kids = {};
  for (const n of nodes) {
    byId[n.id] = n;
    if (n.parent) (kids[n.parent] = kids[n.parent] || []).push(n);
    if (n.base == null) n.base = Math.round(20 * Math.pow(5, n.z || 0) * (n.w || 1));
    if (n.g == null) n.g = n.max > 1 ? 1.5 : 1;
  }
  const cost = (n, lv) => Math.round(n.base * Math.pow(n.g, lv));

  // gates: milestone id -> readable requirement
  const GATES = {
    clam: 'Beat the Giant Clam', angler: 'Beat the Anglerfish', eye: 'Beat the Leviathan', hollow: 'Beat the Hollow Survey',
    wyrm: 'Beat the Vent Wyrm', king: 'Beat the Drowned King', titan: 'Beat the Crystal Titan', warden: 'Beat the Warden',
    wrecks: 'Reach the Wreck Graveyard', city: 'Reach the Sunken City',
  };

  TB.tree = { branches, nodes, byId, kids, cost, GATES };
  // the plan page reads the same file
  globalThis.DEEPLINE_TREE = { branches, nodes: nodes.map(n => Object.assign({}, n, { gate: n.gate ? GATES[n.gate] : null })) };
  if (typeof module !== 'undefined' && module.exports) module.exports = TB.tree;
})();
