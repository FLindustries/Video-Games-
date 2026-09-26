// 24 relics. Bosses drop their own on the first kill; caches and drowned divers drop the rest.
// Finding a duplicate ranks a relic up: rank I ×1, II ×1.5, III ×2.
(function () {
  const TB = globalThis.TB = globalThis.TB || {};
  const R = (id, name, from, fx, v, text, desc) => ({ id, name, from, fx, v, text, desc });
  TB.relics = [
    R('clampearl', 'Clam Pearl', 'clam', 'coin', .10, '+10% credits', 'Big enough to need both hands.'),
    R('lure', "Angler's Lure", 'angler', 'lamp', .20, 'Headlamp reaches 20% further', 'Still glowing, days later.'),
    R('lens', 'Leviathan Lens', 'eye', 'crit', .05, '+5% critical chance', 'A scale off the eye. Things look sharper through it.'),
    R('hollowcore', 'Hollow Core', 'hollow', 'drone', .25, 'Drones cut 25% harder', 'The Heron’s reactor, still warm.'),
    R('wyrmscale', 'Wyrm Scale', 'wyrm', 'air', 2, '+2 s oxygen, heat-proof', 'Shed skin from the Vent Wyrm.'),
    R('crown', 'Drowned Crown', 'king', 'pearl', .20, '+20% pearls', 'The king will not need it.'),
    R('crystalheart', 'Crystal Heart', 'titan', 'size', 6, 'Bigger drill head', 'It hums in time with the drill.'),
    R('chain', "Warden's Chain", 'warden', 'dmg', .15, '+15% all damage', 'Each link is stamped HERON.'),
    R('dogtag', "Heron's Dog Tag", 'wrecks', 'air', 3, '+3 s oxygen', 'M. OKAFOR. PILOT. BLOOD TYPE O.'),
    R('compass', "Captain's Compass", 'wrecks', 'rare', .30, 'Rare ore shows up 30% more', 'The needle points down.'),
    R('helmet', 'Brass Helmet', 'wrecks', 'sting', .15, 'Stings and bites cost 15% less', 'An old diving helmet, dented from the inside.'),
    R('bell', "Ship's Bell", 'wrecks', 'sonar', .30, 'Sonar hits 30% harder', 'It rings by itself at depth.'),
    R('harpoon', 'Rusted Harpoon', 'wrecks', 'boss', .10, '+10% damage to bosses', 'Somebody fought something down here.'),
    R('ventidol', 'Vent Idol', 'vents', 'heat', .50, 'Heat hurts half as much', 'Carved from obsidian by someone with no tools.'),
    R('fossil', 'Fossil Tooth', 'vents', 'creature', .20, 'Creatures pay 20% more', 'From something much bigger than the Wyrm.'),
    R('coralidol', 'Coral Idol', 'city', 'bubble', .25, 'Air pockets give 25% more', 'The city’s people prayed to it for air.'),
    R('flute', 'Bone Flute', 'city', 'calm', .30, 'Jellyfish drift away from you', 'Play it and the jellyfish listen.'),
    R('hellshard', 'Hellglass Shard', 'red', 'critdmg', .25, '+25% critical damage', 'Warm through the glove.'),
    R('heron1', 'Heron Log I', 'wrecks', 'dmg', .02, '+2% damage. Part of the story.', null),
    R('heron2', 'Heron Log II', 'wrecks', 'dmg', .02, '+2% damage. Part of the story.', null),
    R('heron3', 'Heron Log III', 'vents', 'dmg', .02, '+2% damage. Part of the story.', null),
    R('heron4', 'Heron Log IV', 'city', 'dmg', .02, '+2% damage. Part of the story.', null),
    R('heron5', 'Heron Log V', 'floor', 'dmg', .02, '+2% damage. Part of the story.', null),
    R('heron6', 'Heron Log VI', 'red', 'dmg', .02, '+2% damage. Part of the story.', null),
  ];
  TB.relicById = Object.fromEntries(TB.relics.map(r => [r.id, r]));
  TB.RANK_MULT = [0, 1, 1.5, 2];
  if (typeof module !== 'undefined' && module.exports) module.exports = TB.relics;
})();
