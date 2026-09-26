// The nine guardians, one at the floor of each zone.
// hpK multiplies the health of a boulder at that depth. pearls are paid on the first kill.
(function () {
  const TB = globalThis.TB = globalThis.TB || {};
  TB.bosses = {
    clam:   { name: 'Giant Clam', zone: 0, hpK: 15.5, pearls: 5, relic: 'clampearl', r: 110, y: 610,
      cycle: [2.0, 1.4], sway: .18, speed: .5, spawn: null,
      hint: 'It can only be hurt while its shell is open.',
      desc: 'Guards the bottom of the shelf. Only hurt while its shell is open.' },
    angler: { name: 'Anglerfish', zone: 1, hpK: 55, pearls: 7, relic: 'lure', r: 96, y: 600,
      cycle: null, sway: .8, speed: 1.0, spawn: { kind: 'jelly', every: 3 },
      hint: 'It swims fast and calls jellyfish. A bigger drill head and Sonar Pulse help.',
      desc: 'Its lure is the only light at 200 metres. It calls jellyfish to guard it.' },
    eye:    { name: 'The Leviathan', zone: 2, hpK: 145, pearls: 14, relic: 'lens', r: 120, y: 620,
      cycle: [2.6, 1.4], sway: .25, speed: .6, spawn: { kind: 'jelly', every: 2.4 },
      hint: 'It shuts its eye to block damage. Hit it while it is open.',
      desc: 'An eye the size of a house, set in a body nobody has seen the end of.' },
    hollow: { name: 'The Hollow Survey', zone: 3, hpK: 275, pearls: 22, relic: 'hollowcore', r: 100, y: 590,
      cycle: null, sway: .6, speed: .7, spawn: { kind: 'mine', every: 3.2 },
      hint: 'The Heron drops mines. Keep your hull away from them, or let them hit it.',
      desc: 'The lost survey sub Heron, overgrown and moving on its own. It lays mines.' },
    wyrm:   { name: 'Vent Wyrm', zone: 4, hpK: 570, pearls: 30, relic: 'wyrmscale', r: 70, y: 600,
      cycle: [3.0, 1.8], sway: .9, speed: .8, spawn: { kind: 'magmaeel', every: 4 }, burrow: true,
      hint: 'It hides in the vents between attacks. Hit it when it surfaces.',
      desc: 'A serpent that lives inside the vent plumes. It burrows out of reach between attacks.' },
    king:   { name: 'The Drowned King', zone: 5, hpK: 780, pearls: 22, relic: 'crown', r: 110, y: 600,
      cycle: null, sway: .3, speed: .5, spawn: { kind: 'sentinel', every: 5 }, shield: .35,
      hint: 'Break his coral shield first. Then the king himself.',
      desc: 'The last ruler of the city, still on his throne. Coral grows over him like armour.' },
    titan:  { name: 'Crystal Titan', zone: 6, hpK: 130, pearls: 44, relic: 'crystalheart', r: 115, y: 610,
      cycle: [2.4, 1.6], sway: .35, speed: .55, spawn: { kind: 'ccrawler', every: 4.5 }, reflect: true,
      hint: 'When it glows white it reflects damage back as lost oxygen. Wait, then cut.',
      desc: 'A body of living crystal. When it glows it throws the drill’s force back at you.' },
    warden: { name: 'The Warden', zone: 7, hpK: 225, pearls: 80, relic: 'chain', r: 105, y: 590,
      cycle: null, sway: .5, speed: .7, spawn: { kind: 'soul', every: 3 }, chains: true,
      hint: 'Its chains grab the sub and slow you down. Keep moving and cut the chains loose.',
      desc: 'Something built to keep the Heart in. It has been doing its job for a very long time.' },
    heart:  { name: 'The Thing That Waits', zone: 8, hpK: 385, pearls: 0, relic: null, r: 140, y: 560,
      cycle: [2.2, 1.2], sway: .2, speed: .45, spawn: { kind: 'soul', every: 2.2 }, phases: true,
      hint: 'It opens more eyes as it weakens. Hit the open ones.',
      desc: 'The Heart of the trench. It has been waiting for a drill.' },
  };
  for (const k in TB.bosses) TB.bosses[k].id = k;
  if (typeof module !== 'undefined' && module.exports) module.exports = TB.bosses;
})();
