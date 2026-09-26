// Economy curves and everything the sub can do, derived from the tree and relics.
// Pure functions: the game and the balance simulator both use them.
(function () {
  const TB = globalThis.TB = globalThis.TB || {};

  TB.econ = {
    spawnEvery: .30,                                  // seconds between spawns
    rockHp: L => 6 * Math.pow(1.037, L),              // boulder health at depth L
    rockCoin: L => Math.pow(1.02, L),                // boulder credits at depth L
    bossHp: id => { const b = TB.bosses[id]; return b.hpK * TB.econ.rockHp(TB.zones[b.zone].L1); },
    bossBounty: id => 40 * TB.econ.rockCoin(TB.zones[TB.bosses[id].zone].L1),
    ngHp: ng => Math.pow(4, ng),                      // New Dive+ toughness
    ngPay: ng => Math.pow(3, ng),
  };

  TB.statsFor = function (S) {
    const L = id => S.lv[id] || 0;
    const echo = 1 + .17 * L('anc5');
    const rf = key => {
      let v = 0;
      for (const id in S.relics) { const r = TB.relicById[id]; if (r && r.fx === key) v += r.v * TB.RANK_MULT[Math.min(3, S.relics[id])] * echo; }
      return v;
    };
    const has = id => !!S.relics[id];
    const heads = (L('head1') ? 2 : 1) * (L('head2') ? 2 : 1) * (L('head3') ? 2.5 : 1) * (L('head4') ? 2.5 : 1) * (L('head5') ? 3 : 1) * (L('head6') ? 3 : 1) * (L('head7') ? 4 : 1);
    const headTier = ['head7', 'head6', 'head5', 'head4', 'head3', 'head2', 'head1'].findIndex(h => L(h));
    const st = {
      head: headTier < 0 ? 0 : 7 - headTier,           // 0 iron .. 7 heartstone
      dps: (8 + 4 * L('drill1')) * heads * (1 + .25 * L('drill6')) * (1 + .4 * L('drill10')) * Math.pow(1.5, L('anc2')) * (1 + rf('dmg')),
      crit: .04 * L('drill3') + rf('crit'),
      critMult: 1.5 + .25 * L('drill4') + rf('critdmg'),
      radius: 28 + 5 * L('drill2') + rf('size'),
      reach: 190 + 14 * L('drill2'),
      shatter: [0, .08, .12, .16][L('drill5')],
      overheat: .08 * L('drill7'),
      resonance: .12 * L('drill8'),
      bossDmg: 1 + .2 * L('drill9') + rf('boss'),
      armorCut: L('head4') > 0,
      burn: .2 * L('drill12'),
      arms: 1 + L('drill11') + L('drill13'),
      air: 8 + 1.5 * L('hull1') + 3 * L('hull5') + 5 * L('hull11') + rf('air'),
      fins: 1.5 + .35 * L('hull2'),
      bubble: (1.5 + .3 * L('hull3')) * (1 + rf('bubble')),
      sting: Math.max(.15, (1 - .2 * L('hull4')) * (1 - .15 * L('bio5')) * (1 - rf('sting'))),
      lamp: 1 + .15 * L('hull6') + rf('lamp'),
      flood: .1 * L('hull7'),
      emergency: [0, .2, .3, .4][L('hull8')],
      shrug: Math.min(.8, .15 * L('hull10') + .12 * L('anc3')),
      heatProof: L('hull9') > 0 || L('head5') > 0 || has('wyrmscale'),
      heatMult: Math.max(.2, 1 - rf('heat')),
      coinMult: (1 + .25 * L('sal1')) * (1 + .08 * L('sal7') * S.beaten.length) * (1 + rf('coin')) * (L('head2') ? 1.1 : 1),
      pressurePay: .04 * L('sal5'),                    // per zone index
      rare: (1 + .35 * L('sal2')) * (1 + rf('rare')),
      lucky: .04 * L('sal3'),
      golden: .05 * L('sal4'),
      bounty: 1 + .2 * L('sal6'),
      cacheW: 1 + .5 * L('sal8'),
      appraiser: L('sal9'),
      creaturePay: (1 + .2 * L('sal10') + .25 * L('bio4')) * (1 + rf('creature')),
      bountyBoard: L('sal11') ? 1 + 3 * L('sal11') : 1,
      blackMarket: L('sal12') > 0,
      shock: .15 * L('sys1'),
      sonar: .25 * L('sys2') * (1 + rf('sonar')),
      sonarCd: 4 - .4 * L('sys3'),
      drones: L('sys4') ? 1 + L('sys5') + L('sys6') : 0,
      droneDps: .06 * L('sys4') * (1 + .2 * L('sys7')) * (1 + rf('drone')),
      torpedo: .4 * L('sys8'),
      homing: L('sys9'),
      charges: .6 * L('sys10'),
      lightning: L('sys11'),
      autoDrill: L('sys12') > 0,
      harpoon: 3 * L('sys13'),
      flares: L('sys14'),
      specimens: L('bio1') > 0,
      bait: 1 + .2 * L('bio2'),
      predator: 1 + .15 * L('bio3'),
      drillJelly: L('bio5') > 0,
      calm: .33 * L('bio6') + rf('calm'),
      symbiote: .3 * L('bio7'),
      glow: L('bio8'),
      weakSpot: .08 * L('bio9'),
      adapt: .08 * L('bio10'),
      parasite: .1 * L('bio11'),
      bloodPact: .1 * L('anc4'),
      heartRes: 1 + .5 * L('anc6'),
      pearlSight: L('anc7'),
      pearlMult: 1 + rf('pearl'),
    };
    return st;
  };

  // which zones the hull allows: zones 0-2 always, then one more per pressure hull
  TB.hullZones = S => 3 + ['press1', 'press2', 'press3', 'press4', 'press5', 'press6'].filter(id => S.lv[id]).length;
  // the zone the winch drops you into: one past the deepest boss beaten, capped by the hull
  TB.startZone = S => {
    const beaten = TB.zones.filter(z => S.beaten.includes(z.boss)).length;
    return Math.min(beaten, TB.hullZones(S) - 1, TB.zones.length - 1, TB.DEMO ? 1 : 99);
  };
  TB.gateMet = (S, gate) => {
    if (!gate) return true;
    if (gate === 'wrecks') return S.bestL >= TB.zones[3].L0;
    if (gate === 'city') return S.bestL >= TB.zones[5].L0;
    return S.beaten.includes(gate);
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = TB;
})();
