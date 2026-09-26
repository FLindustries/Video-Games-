// Zones and everything that lives in them.
// Balance works in "L" units (50 per zone). The HUD shows real depth, which explodes with each zone.
(function () {
  const TB = globalThis.TB = globalThis.TB || {};

  // spawn tables are relative weights; kinds with minP only appear after that share of the zone
  TB.zones = [
    { id: 'shelf', name: 'Sunlit Shelf', act: 1, from: 0, to: 50, boss: 'clam',
      pal: ['#2a7fa0', '#0e3d56', '#0b2a38', '#123f55', '#8b8173'], dark: 0, bg: 'whale', air: 1,
      spawn: { rock: 64, copper: 10, hermit: 8, bubble: 11, jelly: 7 },
      music: { root: 57, scale: [0, 2, 4, 7, 9], bright: 1, tempo: 1 } },
    { id: 'kelp', name: 'Kelp Twilight', act: 1, from: 50, to: 200, boss: 'angler',
      pal: ['#11504f', '#07282b', '#061a1c', '#0b3434', '#5f6c5b'], dark: .35, bg: 'whale', air: 1, kelp: true,
      spawn: { rock: 45, iron: 14, silver: 8, viper: 9, lantern: 6, moray: 4, bubble: 9, jelly: 7 },
      music: { root: 55, scale: [0, 2, 3, 7, 9], bright: .8, tempo: .9 } },
    { id: 'midnight', name: 'Midnight Trench', act: 1, from: 200, to: 1000, boss: 'eye',
      pal: ['#0b1d36', '#040b18', '#040914', '#0a1628', '#4d5872'], dark: .78, bg: 'squid', air: 1,
      spawn: { rock: 40, gold: 9, oyster: 4, iron: 6, isopod: 9, vsquid: 6, frilled: 5, viper: 4, bubble: 10, jelly: 8 },
      music: { root: 52, scale: [0, 2, 3, 7, 8], bright: .55, tempo: .8 } },
    { id: 'wrecks', name: 'Wreck Graveyard', act: 2, from: 1000, to: 3000, boss: 'hollow',
      pal: ['#10222e', '#060d14', '#070c10', '#101c24', '#5a5f66'], dark: .8, bg: 'wreck', air: 1,
      spawn: { rock: 30, scrap: 16, platinum: 7, oyster: 4, wcrab: 10, diver: 5, mine: 6, cache: 2, isopod: 4, bubble: 10, jelly: 7 },
      music: { root: 50, scale: [0, 3, 5, 7, 10], bright: .45, tempo: .75, metal: true } },
    { id: 'vents', name: 'Hadal Vents', act: 2, from: 3000, to: 7000, boss: 'wyrm',
      pal: ['#241410', '#0a0404', '#140806', '#2a1610', '#4a3a34'], dark: .7, bg: 'vents', air: 1,
      spawn: { rock: 30, sulfur: 12, cobalt: 8, obsidian: 5, oyster: 4, tubeworm: 8, yeti: 8, magmaeel: 6, geyser: 5, cache: 2, bubble: 9, jelly: 4 },
      music: { root: 48, scale: [0, 1, 5, 7, 8], bright: .4, tempo: .85 } },
    { id: 'city', name: 'Sunken City', act: 2, from: 7000, to: 11000, boss: 'king',
      pal: ['#0c2230', '#040a12', '#0a1418', '#12262c', '#6a7a70'], dark: .78, bg: 'ruins', air: 1,
      spawn: { rock: 22, carved: 14, emerald: 8, ruby: 5, oyster: 4, sentinel: 10, eyeless: 9, idol: 5, cache: 3, bubble: 9, jelly: 7, mine: 3 },
      music: { root: 53, scale: [0, 2, 3, 7, 8, 11], bright: .45, tempo: .7 } },
    { id: 'floor', name: 'Beneath the Floor', act: 3, from: 11000, to: 30000, boss: 'titan',
      pal: ['#161420', '#07060c', '#0c0a12', '#1a1624', '#6a6480'], dark: .82, bg: 'crystals', air: 1.25,
      spawn: { rock: 30, diamond: 6, crystal: 16, oyster: 4, ccrawler: 10, rockworm: 8, pocket: 7, cache: 3, bubble: 8 },
      music: { root: 47, scale: [0, 2, 4, 6, 8, 10], bright: .35, tempo: .65 } },
    { id: 'red', name: 'The Red Below', act: 3, from: 30000, to: 66000, boss: 'warden',
      pal: ['#3a0808', '#120202', '#1a0404', '#2a0806', '#5a2a22'], dark: .6, bg: 'bones', air: 1.25,
      spawn: { rock: 20, brimstone: 14, bone: 10, hellglass: 5, oyster: 4, bcrab: 10, flayed: 7, wraith: 7, soul: 8, cache: 3, bubble: 8 },
      music: { root: 45, scale: [0, 1, 3, 6, 8], bright: .3, tempo: .9, harsh: true } },
    { id: 'heart', name: 'The Heart', act: 3, from: 66000, to: 66666, boss: 'heart',
      pal: ['#4a0612', '#140004', '#1c0206', '#300410', '#6a2030'], dark: .55, bg: 'eyes', air: 1.5,
      spawn: { rock: 10, heartstone: 10, brimstone: 10, hellglass: 6, bone: 6, wraith: 8, flayed: 6, soul: 10, bubble: 10, oyster: 4, mine: 3, pocket: 3 },
      music: { root: 44, scale: [0, 1, 2, 6, 7], bright: .25, tempo: 1.1, harsh: true } },
  ];
  TB.zones.forEach((z, i) => { z.i = i; z.L0 = i * TB.ZONE_LEN; z.L1 = (i + 1) * TB.ZONE_LEN; z.palA = z.pal.map(TB.hex); });
  TB.zoneAtL = L => TB.zones[TB.clamp(Math.floor(L / TB.ZONE_LEN), 0, TB.zones.length - 1)];
  TB.metersAtL = L => {
    const z = TB.zoneAtL(Math.min(L, TB.zones.length * TB.ZONE_LEN - 1e-6));
    const f = TB.clamp((L - z.L0) / TB.ZONE_LEN, 0, 1);
    return z.from + (z.to - z.from) * f;
  };

  // cls: ore (break for credits), creature (break for credits + specimens), cache (relics),
  //      pickup (air), hazard (hurts you, or explodes)
  TB.kinds = {
    // --- pickups and hazards
    bubble:    { name: 'Air Pocket', cls: 'pickup', size: [14, 14], draw: 'bubble', desc: 'Trapped air. Touch it with the sub or the drill to refill oxygen.' },
    jelly:     { name: 'Box Jellyfish', cls: 'hazard', beh: 'drift', size: [20, 24], draw: 'jelly', sting: 2.5, minP: .28, desc: 'Its sting cracks the seals and costs oxygen. Keep it off the hull.' },
    mine:      { name: 'Naval Mine', cls: 'hazard', beh: 'drift', size: [20, 22], draw: 'mine', sting: 3, blast: 160, desc: 'Left over from a war nobody mentions. Touch it and it goes off, taking everything nearby with it.' },
    geyser:    { name: 'Scalding Geyser', cls: 'hazard', beh: 'geyser', size: [24, 24], draw: 'geyser', sting: 2, heat: true, desc: 'A crack that spits boiling water every few seconds. Thermal Shielding makes you immune.' },
    pocket:    { name: 'Pressure Pocket', cls: 'hazard', beh: 'drift', size: [22, 30], draw: 'pocket', sting: 2, blast: 180, desc: 'Gas trapped at impossible pressure. It bursts when disturbed.' },
    soul:      { name: 'Burning Soul', cls: 'hazard', beh: 'seek', size: [18, 22], draw: 'soul', sting: 3, desc: 'It drifts toward the lamp. It looks like it is trying to say something.' },

    // --- rock and ore (hp and coin are multipliers on the depth curve)
    rock:      { name: 'Boulder', cls: 'ore', hp: 1, coin: 1, size: [16, 30], draw: 'rock', desc: 'Plain rock. Cheap, and everywhere.' },
    copper:    { name: 'Copper Ore', cls: 'ore', rare: 1, hp: 2.5, coin: 4, size: [20, 26], draw: 'ore', shard: '#e0874f', desc: 'Rock veined with copper. Tougher, pays four times more.' },
    iron:      { name: 'Iron Nodule', cls: 'ore', hp: 3, coin: 4, size: [20, 24], draw: 'nodule', desc: 'A dense metal lump from the twilight zone. Slow to grind, pays well.' },
    silver:    { name: 'Silver Ore', cls: 'ore', rare: 1, hp: 3.5, coin: 6, size: [20, 26], draw: 'ore', shard: '#dfe7ee', desc: 'Bright silver that catches the lamp.' },
    gold:      { name: 'Gold Ore', cls: 'ore', rare: 1, hp: 4, coin: 8, size: [22, 26], draw: 'ore', shard: '#f6c453', desc: 'Rock laced with gold. The reason Meridian took this contract.' },
    oyster:    { name: 'Pearl Oyster', cls: 'ore', hp: 5, coin: 3, pearl: 1, size: [22, 24], draw: 'oyster', desc: 'Cracks open to an Abyssal Pearl. Pearls buy drill heads and pressure hulls.' },
    scrap:     { name: 'Scrap Steel', cls: 'ore', hp: 3, coin: 5, size: [20, 28], draw: 'scrap', desc: 'Hull plating from ships that sank here. Some of it is not very old.' },
    platinum:  { name: 'Platinum Ore', cls: 'ore', rare: 1, hp: 5, coin: 10, size: [22, 26], draw: 'ore', shard: '#cfd8e6', desc: 'Pale, heavy and worth a fortune.' },
    sulfur:    { name: 'Sulfur Crystal', cls: 'ore', hp: 3, coin: 5, size: [20, 26], draw: 'ore', shard: '#e8e05a', glow: '#e8e05a', desc: 'Yellow crystals grown on the vent walls. They glow faintly.' },
    cobalt:    { name: 'Cobalt Ore', cls: 'ore', hp: 3.5, coin: 6, size: [20, 26], draw: 'ore', shard: '#4a7dff', desc: 'Deep blue ore. The heat makes it easier to cut.' },
    obsidian:  { name: 'Obsidian', cls: 'ore', rare: 1, hp: 6, coin: 11, size: [22, 28], draw: 'obsidian', desc: 'Volcanic glass, sharp enough to shave with. Rare.' },
    carved:    { name: 'Carved Stone', cls: 'ore', hp: 3, coin: 5, size: [22, 28], draw: 'carved', desc: 'Stone blocks from the city walls. The same symbol, over and over.' },
    emerald:   { name: 'Emerald', cls: 'ore', hp: 4, coin: 8, size: [20, 26], draw: 'ore', shard: '#3ee08a', desc: 'Set into the city streets like cobbles.' },
    ruby:      { name: 'Ruby', cls: 'ore', rare: 1, hp: 6, coin: 12, size: [20, 26], draw: 'ore', shard: '#ff3b5c', desc: 'Red as a warning light.' },
    crystal:   { name: 'Deep Crystal', cls: 'ore', hp: 3.5, coin: 6, size: [22, 30], draw: 'crystal', col: '#b9a8ff', desc: 'Crystal columns that hum when the drill touches them.' },
    diamond:   { name: 'Diamond', cls: 'ore', rare: 1, hp: 7, coin: 14, size: [20, 26], draw: 'ore', shard: '#dffbff', desc: 'Diamond, in chunks the size of your fist.' },
    brimstone: { name: 'Brimstone', cls: 'ore', hp: 3.5, coin: 6, size: [20, 28], draw: 'magma', glow: '#ff8a3c', desc: 'Burning stone. It should not burn down here. It does.' },
    bone:      { name: 'Bone Coral', cls: 'ore', hp: 4, coin: 7, size: [22, 28], draw: 'bone', desc: 'It grows like coral. It is not coral.' },
    hellglass: { name: 'Hellglass', cls: 'ore', rare: 1, hp: 7, coin: 15, size: [20, 26], draw: 'ore', shard: '#ff2a3a', glow: '#ff2a3a', desc: 'Red glass that is warm to the touch, through the hull.' },
    heartstone:{ name: 'Heartstone', cls: 'ore', rare: 1, hp: 8, coin: 18, size: [22, 28], draw: 'ore', shard: '#ff5a7a', glow: '#ff5a7a', desc: 'It beats. Slowly.' },
    cache:     { name: 'Relic Cache', cls: 'cache', hp: 6, coin: 10, size: [22, 22], draw: 'cache', desc: 'A strongbox from a lost ship. Holds a relic.' },

    // --- creatures (break for credits and, with the Specimen Lab, specimens)
    hermit:    { name: 'Hermit Crab', cls: 'creature', beh: 'crawl', hp: 2, coin: 2, size: [18, 22], draw: 'crab', col: '#c86b4a', shell: '#d9c4a0', desc: 'Carries a borrowed shell. Harmless, and worth a little.' },
    viper:     { name: 'Viperfish', cls: 'creature', beh: 'swim', hp: 2.5, coin: 3, size: [24, 28], draw: 'fish', col: ['#46586e', '#0f151e'], teeth: 1, lure: '#b8fbff', dots: '#7ff0ff', desc: 'Fast, glowing, all teeth. Let it swim into the drill.' },
    lantern:   { name: 'Lanternfish', cls: 'creature', beh: 'swarm', hp: .6, coin: .8, size: [9, 11], draw: 'fish', col: ['#5a7a8e', '#1a2630'], dots: '#9ff7ff', desc: 'They travel in schools of six. Sweep the drill through them.' },
    moray:     { name: 'Moray Eel', cls: 'creature', beh: 'lunge', hp: 3, coin: 4, size: [18, 20], draw: 'eel', col: '#5d6a2e', spot: '#c9d06a', bite: 1.5, desc: 'Hides in the walls and lunges at the hull. Bites cost oxygen.' },
    isopod:    { name: 'Giant Isopod', cls: 'creature', beh: 'crawl', hp: 5, coin: 6, size: [26, 30], draw: 'isopod', col: ['#d9d0e6', '#6d6480'], desc: 'An armoured bottom-crawler the size of a dog. A long grind.' },
    vsquid:    { name: 'Vampire Squid', cls: 'creature', beh: 'swim', hp: 3, coin: 4, size: [20, 24], draw: 'squid', col: '#6b1426', ink: true, desc: 'When hurt it bursts into a cloud of glowing ink that hides everything.' },
    frilled:   { name: 'Frilled Shark', cls: 'creature', beh: 'chase', hp: 4, coin: 5, size: [22, 24], draw: 'eel', col: '#5a4a3a', spot: '#8a7a64', frill: 1, bite: 2, desc: 'A living fossil with three hundred teeth. It hunts the sub.' },
    wcrab:     { name: 'Wreck Crab', cls: 'creature', beh: 'crawl', hp: 3, coin: 4, size: [20, 24], draw: 'crab', col: '#6e7780', shell: '#8a4a2a', desc: 'Lives in the wrecks and wears rust like armour.' },
    diver:     { name: 'Drowned Diver', cls: 'creature', beh: 'drift', hp: 2, coin: 6, size: [22, 24], draw: 'diver', relic: .25, desc: 'A pilot from an older expedition. The suit still has something in its pockets.' },
    tubeworm:  { name: 'Tube Worm Colony', cls: 'creature', beh: 'still', hp: 3, coin: 5, size: [22, 26], draw: 'worm', col: '#e03b3b', desc: 'Red plumes that pull back into their tubes when the drill comes near.' },
    yeti:      { name: 'Yeti Crab', cls: 'creature', beh: 'crawl', hp: 3.5, coin: 5, size: [20, 24], draw: 'crab', col: '#e8e2d2', shell: '#cfc6b4', hairy: 1, desc: 'Grows bacteria on its hairy claws and eats them. Fair enough.' },
    magmaeel:  { name: 'Magma Eel', cls: 'creature', beh: 'swim', hp: 4, coin: 6, size: [20, 22], draw: 'eel', col: '#2a1510', spot: '#ff7a2a', glow: '#ff7a2a', desc: 'Its skin is cracked with heat. It swims through the vent plumes on purpose.' },
    sentinel:  { name: 'Stone Sentinel', cls: 'creature', beh: 'drift', hp: 6, coin: 8, size: [24, 28], draw: 'sentinel', armor: .5, desc: 'A statue that moves. Half damage unless your drill head cuts armour.' },
    eyeless:   { name: 'Eyeless Fish', cls: 'creature', beh: 'swim', hp: 3, coin: 5, size: [20, 24], draw: 'fish', col: ['#d8d2c8', '#8a847a'], blind: 1, desc: 'Pale fish from the city canals. No eyes. They still find you.' },
    idol:      { name: 'Coral Idol', cls: 'creature', beh: 'drift', hp: 4, coin: 9, size: [22, 26], draw: 'idol', desc: 'A carved figure overgrown with coral. It turns to face the sub.' },
    ccrawler:  { name: 'Crystal Crawler', cls: 'creature', beh: 'crawl', hp: 5, coin: 7, size: [26, 30], draw: 'isopod', col: ['#dcd4ff', '#6a5ab0'], crystal: 1, desc: 'An isopod with crystal plates. The deep has changed it.' },
    rockworm:  { name: 'Rock Worm', cls: 'creature', beh: 'swim', hp: 4, coin: 6, size: [20, 22], draw: 'eel', col: '#6a6480', spot: '#9a92b0', desc: 'Eats stone. Moves through it like water.' },
    bcrab:     { name: 'Brimstone Crab', cls: 'creature', beh: 'crawl', hp: 4, coin: 6, size: [22, 26], draw: 'crab', col: '#3a1410', shell: '#ff6a2a', glow: '#ff6a2a', desc: 'Its shell is on fire and it does not seem to mind.' },
    flayed:    { name: 'Flayed Eel', cls: 'creature', beh: 'chase', hp: 4, coin: 7, size: [22, 24], draw: 'eel', col: '#8a2a2a', spot: '#e8b0a0', bite: 2.5, desc: 'An eel without skin. It follows the sound of the drill.' },
    wraith:    { name: 'Chain Wraith', cls: 'creature', beh: 'seek', hp: 4, coin: 8, size: [22, 26], draw: 'wraith', bite: 2, desc: 'Something wrapped in chains. The chains are from the Heron.' },
  };
  for (const k in TB.kinds) TB.kinds[k].id = k;

  if (typeof module !== 'undefined' && module.exports) module.exports = { zones: TB.zones, kinds: TB.kinds };
})();
