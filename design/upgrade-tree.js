// Trenchbore full-game upgrade tree (design data).
// Drawn by docs/plan/index.html and meant to be loaded by the finished game.
//
// Every node: id, name, branch, parent, max level, currency, effect per level,
// and an optional gate (a milestone that must be reached before it can be bought).
// Currencies: cr = Credits (all salvage), sp = Specimens (creatures, from zone 2),
//             pe = Abyssal Pearls (bosses and pearl oysters, from zone 3).
(function (root) {
  const branches = {
    core:    { name: 'The Minnow',     color: '#f0b429', what: 'Your sub. Every branch grows out of it.' },
    drill:   { name: 'Drill',          color: '#3fe0c5', what: 'Cut faster, crit harder, and climb the drill-head ladder.' },
    hull:    { name: 'Hull & Oxygen',  color: '#7fd8ff', what: 'Stay down longer, sink faster, survive the pressure.' },
    salvage: { name: 'Salvage',        color: '#f6c453', what: 'Earn more from every rock, creature, boss and relic.' },
    systems: { name: 'Systems',        color: '#b18cff', what: 'Machines that fight for you: sonar, drones, torpedoes.' },
    biology: { name: 'Biology',        color: '#7be08a', what: 'Study the creatures. Opens after the Giant Clam.' },
    ancient: { name: 'Ancient',        color: '#ff6b4a', what: 'Power from the Sunken City. Opens in Act 3.' },
  };

  const N = (id, name, branch, parent, max, cur, fx, gate) => ({ id, name, branch, parent, max, cur, fx, gate: gate || null });

  const nodes = [
    N('core', 'The Minnow', 'core', null, 1, 'cr', 'Your one-seat salvage sub. Owned from the start.'),

    // ---- Drill
    N('drill1', 'Drill Motor', 'drill', 'core', 10, 'cr', '+4 damage per second'),
    N('drill2', 'Wider Bit', 'drill', 'drill1', 8, 'cr', 'Bigger drill head, longer arm reach'),
    N('drill3', 'Serrated Flutes', 'drill', 'drill2', 5, 'cr', '+4% critical hit chance'),
    N('drill4', 'Critical Grind', 'drill', 'drill3', 5, 'cr', '+25% critical damage'),
    N('drill5', 'Shatter', 'drill', 'drill4', 3, 'cr', 'Rocks below 8 / 12 / 16% health crumble instantly'),
    N('head1', 'Steel Head', 'drill', 'drill1', 1, 'pe', '×2 drill damage. New look.', 'Beat the Giant Clam'),
    N('head2', 'Gold Head', 'drill', 'head1', 1, 'pe', '×2 drill damage, +10% credits', 'Beat the Anglerfish'),
    N('head3', 'Tungsten Head', 'drill', 'head2', 1, 'pe', '×2.5 drill damage', 'Beat the Leviathan'),
    N('head4', 'Diamond Head', 'drill', 'head3', 1, 'pe', '×2.5 drill damage, cuts armour', 'Beat the Hollow Survey'),
    N('head5', 'Obsidian Head', 'drill', 'head4', 1, 'pe', '×3 drill damage, heat-proof', 'Beat the Vent Wyrm'),
    N('head6', 'Hellforged Head', 'drill', 'head5', 1, 'pe', '×3 drill damage, sets targets burning', 'Beat the Crystal Titan'),
    N('head7', 'Heartstone Head', 'drill', 'head6', 1, 'pe', '×4 drill damage', 'Beat the Warden'),
    N('drill6', 'Drill Motor II', 'drill', 'head1', 10, 'cr', '+25% damage'),
    N('drill7', 'Overheat', 'drill', 'drill6', 5, 'cr', '+8% damage while the tip glows hot'),
    N('drill8', 'Resonance', 'drill', 'drill7', 5, 'cr', 'Damage ramps up the longer you hold one target'),
    N('drill9', 'Boss Breaker', 'drill', 'drill6', 5, 'cr', '+20% damage to bosses'),
    N('drill10', 'Drill Motor III', 'drill', 'head4', 10, 'pe', '+40% damage'),
    N('drill11', 'Second Arm', 'drill', 'head5', 1, 'pe', 'A second drill arm that cuts the nearest target by itself'),
    N('drill13', 'Third Arm', 'drill', 'drill11', 1, 'pe', 'A third drill arm', 'Beat the Warden'),
    N('drill12', 'Hellfire Coating', 'drill', 'head6', 3, 'pe', 'Burning targets take damage over time'),

    // ---- Hull & Oxygen
    N('hull1', 'Oxygen Tank', 'hull', 'core', 10, 'cr', '+1.5 s of oxygen'),
    N('hull2', 'Ballast', 'hull', 'hull1', 10, 'cr', '+0.35 m/s sink speed'),
    N('hull3', 'Air Scrubber', 'hull', 'hull1', 5, 'cr', '+0.3 s from every air pocket'),
    N('hull4', 'Hull Plating', 'hull', 'hull3', 4, 'cr', 'Jellyfish stings cost 20% less oxygen'),
    N('hull5', 'Reserve Tank', 'hull', 'hull2', 5, 'cr', '+3 s of oxygen'),
    N('hull6', 'Headlamp', 'hull', 'hull1', 5, 'cr', 'Wider, longer light in the dark zones'),
    N('hull7', 'Floodlight', 'hull', 'hull6', 3, 'cr', 'Anything in your light takes +10% damage'),
    N('hull8', 'Emergency O2', 'hull', 'hull5', 3, 'cr', 'Once per dive, refill 20 / 30 / 40% when empty'),
    N('press1', 'Pressure Hull I', 'hull', 'hull2', 1, 'pe', 'Rated to 3 km. Opens the Wreck Graveyard', 'Beat the Leviathan'),
    N('press2', 'Pressure Hull II', 'hull', 'press1', 1, 'pe', 'Rated to 7 km. Opens the Hadal Vents', 'Beat the Hollow Survey'),
    N('press3', 'Pressure Hull III', 'hull', 'press2', 1, 'pe', 'Rated to 11 km. Opens the Sunken City', 'Beat the Vent Wyrm'),
    N('press4', 'Pressure Hull IV', 'hull', 'press3', 1, 'pe', 'Rated to 30 km. Opens Beneath the Floor', 'Beat the Drowned King'),
    N('press5', 'Pressure Hull V', 'hull', 'press4', 1, 'pe', 'Rated to 66 km. Opens the Red Below', 'Beat the Crystal Titan'),
    N('press6', 'Unrated Hull', 'hull', 'press5', 1, 'pe', 'No rating. Opens the Heart', 'Beat the Warden'),
    N('hull9', 'Thermal Shielding', 'hull', 'press2', 1, 'pe', 'Vent heat and geysers cannot hurt you'),
    N('hull10', 'Sealed Cockpit', 'hull', 'hull4', 3, 'cr', '15% chance per level to ignore a sting'),
    N('hull11', 'Deep Reserve', 'hull', 'hull8', 5, 'pe', '+5 s of oxygen'),

    // ---- Salvage
    N('sal1', 'Refinery', 'salvage', 'core', 10, 'cr', '+25% credits from everything'),
    N('sal2', 'Ore Scanner', 'salvage', 'sal1', 5, 'cr', '+3% chance for rare ore'),
    N('sal3', 'Lucky Strike', 'salvage', 'sal2', 5, 'cr', '+4% chance a target pays ×5'),
    N('sal4', 'Golden Touch', 'salvage', 'sal3', 3, 'cr', 'Ore sometimes upgrades to the next tier'),
    N('sal5', 'Pressure Pay', 'salvage', 'sal1', 5, 'cr', '+1% credits per 100 m of depth'),
    N('sal6', 'Market Contacts', 'salvage', 'sal5', 5, 'cr', '+20% boss bounty'),
    N('sal7', 'Deep Contracts', 'salvage', 'sal6', 5, 'pe', '+10% credits per boss beaten'),
    N('sal8', 'Relic Detector', 'salvage', 'sal2', 5, 'cr', '+relic chance in wrecks and caches', 'Reach the Wreck Graveyard'),
    N('sal9', 'Appraiser', 'salvage', 'sal8', 5, 'pe', 'Duplicate relics rank up faster'),
    N('sal10', 'Salvage Nets', 'salvage', 'sal1', 5, 'cr', '+20% credits from creatures'),
    N('sal11', 'Bounty Board', 'salvage', 'sal10', 3, 'sp', 'First of each creature per dive pays ×10'),
    N('sal12', 'Black Market', 'salvage', 'sal11', 1, 'sp', 'Sell spare specimens for credits'),

    // ---- Systems
    N('sys1', 'Shockwave', 'systems', 'core', 5, 'cr', 'Anything you break damages what is around it'),
    N('sys2', 'Sonar Pulse', 'systems', 'sys1', 5, 'cr', 'Every 4 s, damage everything on screen'),
    N('sys3', 'Long Sonar', 'systems', 'sys2', 5, 'cr', 'Sonar fires 0.4 s sooner'),
    N('sys4', 'ROV Drone', 'systems', 'sys2', 5, 'cr', 'A drone cuts the nearest target by itself'),
    N('sys5', 'Second Drone', 'systems', 'sys4', 1, 'pe', 'Two drones'),
    N('sys6', 'Third Drone', 'systems', 'sys5', 1, 'pe', 'Three drones'),
    N('sys7', 'Drone Cutters', 'systems', 'sys4', 5, 'cr', '+30% drone damage'),
    N('sys8', 'Torpedo Bay', 'systems', 'sys1', 5, 'cr', 'Fires a torpedo at a creature every 3 s'),
    N('sys9', 'Homing Torpedoes', 'systems', 'sys8', 3, 'cr', 'Torpedoes chase their target'),
    N('sys10', 'Depth Charges', 'systems', 'sys8', 5, 'cr', 'A big blast below you every 6 s'),
    N('sys11', 'Chain Lightning', 'systems', 'sys10', 5, 'pe', 'Blasts arc between nearby targets'),
    N('sys12', 'Auto-Drill', 'systems', 'sys7', 1, 'pe', 'When you let go, the drill keeps cutting the nearest target'),
    N('sys13', 'Harpoon Gun', 'systems', 'sys9', 3, 'pe', 'Harpoons a boss for big damage every 10 s'),
    N('sys14', 'Flare Launcher', 'systems', 'sys2', 3, 'cr', 'Flares light up the dark and stun jellyfish'),

    // ---- Biology (opens after the Giant Clam; spends Specimens)
    N('bio1', 'Specimen Lab', 'biology', 'core', 1, 'cr', 'Creatures start dropping Specimens', 'Beat the Giant Clam'),
    N('bio2', 'Bait Lure', 'biology', 'bio1', 5, 'sp', 'More creatures show up'),
    N('bio3', 'Predator Instinct', 'biology', 'bio2', 5, 'sp', '+15% damage to creatures'),
    N('bio4', 'Taxidermy', 'biology', 'bio2', 5, 'sp', 'Creatures pay +25%'),
    N('bio5', 'Toxin Study', 'biology', 'bio1', 4, 'sp', 'Stings hurt less; jellyfish can be drilled for specimens'),
    N('bio6', 'Jelly Tamer', 'biology', 'bio5', 3, 'sp', 'Jellyfish drift away from the hull'),
    N('bio7', 'Symbiote', 'biology', 'bio5', 3, 'sp', 'Each creature you kill gives back 0.3 s of oxygen'),
    N('bio8', 'Bioluminescence', 'biology', 'bio1', 3, 'sp', 'Creatures glow, so you see them in the dark'),
    N('bio9', 'Weak Spot Study', 'biology', 'bio8', 5, 'sp', 'Bosses show a weak spot: +crit chance on it'),
    N('bio10', 'Abyss Adaptation', 'biology', 'bio8', 5, 'sp', 'The dark is less dark'),
    N('bio11', 'Parasite Culture', 'biology', 'bio3', 3, 'sp', 'Hits infect creatures with damage over time'),

    // ---- Ancient (opens in the Sunken City; spends Pearls)
    N('anc1', 'Inscription Reader', 'ancient', 'core', 1, 'pe', 'Read the city walls. Opens this branch', 'Reach the Sunken City'),
    N('anc2', 'Ancient Motor', 'ancient', 'anc1', 5, 'pe', '×1.5 all damage'),
    N('anc3', 'Rune Hull', 'ancient', 'anc1', 3, 'pe', 'Chance to ignore any hazard'),
    N('anc4', 'Blood Pact', 'ancient', 'anc2', 5, 'pe', 'More damage the lower your oxygen'),
    N('anc5', 'Echo of the Heron', 'ancient', 'anc3', 3, 'pe', 'Relic effects +50%'),
    N('anc6', 'Heart Resonance', 'ancient', 'anc4', 3, 'pe', 'Big damage bonus against the Heart'),
    N('anc7', 'Pearl Sight', 'ancient', 'anc1', 3, 'pe', 'Pearls drop more often'),
  ];

  const tree = { branches, nodes };
  if (typeof module !== 'undefined' && module.exports) module.exports = tree;
  else root.DEEPLINE_TREE = tree;
})(this);
