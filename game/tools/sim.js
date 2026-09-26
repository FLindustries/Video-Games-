#!/usr/bin/env node
// Plays Trenchbore's full economy with a simple player model, using the game's own data files.
// Usage: node game/tools/sim.js [--verbose]
const path = require('path');
const js = f => require(path.join(__dirname, '..', 'js', f));
['core.js', 'data/tree.js', 'data/world.js', 'data/bosses.js', 'data/relics.js', 'data/story.js', 'data/achievements.js', 'stats.js'].forEach(js);
const TB = globalThis.TB, E = TB.econ, T = TB.tree;
const verbose = process.argv.includes('--verbose');
// optional overrides for tuning sweeps: HPG=1.036 CG=1.017 node tools/sim.js
if (process.env.HPG) TB.econ.rockHp = L => 6 * Math.pow(+process.env.HPG, L);
if (process.env.CG) TB.econ.rockCoin = L => Math.pow(+process.env.CG, L);
if (process.env.ZF) for (const n of TB.tree.nodes) if (n.z != null) n.base = Math.round(20 * Math.pow(+process.env.ZF, n.z) * (n.w || 1));
if (process.env.HPK) process.env.HPK.split(',').forEach((v, i) => { TB.bosses[Object.keys(TB.bosses)[i]].hpK = +v; });
if (process.env.BK) for (const id in TB.bosses) TB.bosses[id].hpK *= Math.pow(+process.env.BK, TB.bosses[id].zone);

const SHOP_SECONDS = 8;    // reading the tree between dives
const TRAVEL = .45;        // seconds moving the drill between targets
const CATCH = .6;          // share of air pockets a player grabs
const DODGE = .75;         // share of hazards a player avoids
const S = { lv: { core: 1 }, cr: 0, sp: 0, pe: 0, beaten: [], relics: {}, bestL: 0, ng: 0 };

function zoneMix(z, st) {
  let W = 0, hp = 0, coin = 0, crea = 0, oy = 0, cache = 0, bub = 0, haz = 0, sting = 0, brk = 0;
  for (const id in z.spawn) {
    const k = TB.kinds[id]; let w = z.spawn[id];
    if (k.rare) w *= st.rare; if (k.cls === 'creature') w *= st.bait; if (id === 'oyster') w *= 1 + 2 * st.pearlSight; if (id === 'cache') w *= st.cacheW;
    W += w;
    if (k.cls === 'pickup') bub += w;
    else if (k.cls === 'hazard') { haz += w; sting += w * (k.sting || 2); }
    else { brk += w; hp += w * k.hp * (k.cls === 'creature' ? 1 / st.predator : 1) * (k.armor && !st.armorCut ? 2 : 1); coin += w * k.coin * (k.cls === 'creature' ? st.creaturePay : 1); if (k.cls === 'creature') crea += w; if (id === 'oyster') oy += w; if (id === 'cache') cache += w; }
  }
  return { hp: hp / brk, coin: coin / brk, crea: crea / brk, oy: oy / brk, cache: cache / brk, brkShare: brk / W, bubShare: bub / W, hazShare: haz / W, sting: haz ? sting / haz : 0 };
}

function dive() {
  const st = TB.statsFor(S), z = TB.zones[TB.startZone(S)];
  let L = z.L0, air = st.air, t = 0, cr = 0, sp = 0, pe = 0, bossHp = null, beat = false, dt = .05;
  const boss = TB.bosses[z.boss], rate = 1 / E.spawnEvery;
  let m = zoneMix(z, st);
  const multi = 1 + (st.radius - 28) / 45 + (st.arms - 1) * .45;
  const effDps = st.dps * (1 + st.crit * (st.critMult - 1)) * (1 + st.overheat * .5) * (1 + st.resonance * .4);
  while (air > 0) {
    t += dt; air -= dt * z.air;
    const machinesDps = st.dps * (st.drones * st.droneDps + st.sonar / st.sonarCd * 5 + st.torpedo / 3 + st.charges / 6 * 3);
    if (L < z.L1 || S.beaten.includes(z.boss)) {
      L = Math.min(z.L1, L + st.fins * dt);
      const hp = E.rockHp(L) * m.hp;
      let kills = multi / (hp / effDps + TRAVEL) * (1 + st.shock * 1.5) + machinesDps / hp;
      kills = Math.min(kills, rate * m.brkShare * 1.1);
      const coin = E.rockCoin(L) * m.coin * st.coinMult * (1 + st.pressurePay * z.i) * (1 + st.lucky * 4) * (1 + st.golden * .5);
      cr += kills * dt * coin;
      if (st.specimens) sp += kills * dt * m.crea;
      pe += kills * dt * m.oy * st.pearlMult;
      if (Math.random() < kills * dt * m.cache) { const pool = TB.relics.filter(r => r.from === z.id || r.from === 'wrecks'); const r = pool[Math.floor(Math.random() * pool.length)]; S.relics[r.id] = Math.min(3, (S.relics[r.id] || 0) + 1); }
      air = Math.min(st.air, air + dt * (rate * m.bubShare * CATCH * st.bubble - rate * m.hazShare * (1 - DODGE) * m.sting * st.sting * (st.calm ? .6 : 1)));
    } else {
      if (bossHp == null) bossHp = E.bossHp(boss.id);
      const up = boss.cycle ? boss.cycle[0] / (boss.cycle[0] + boss.cycle[1]) : .8;
      const machBoss = st.dps * (st.drones * st.droneDps + st.sonar / st.sonarCd + st.torpedo / 3 + st.charges / 6);
      bossHp -= dt * (effDps * st.bossDmg * up * (1 + (st.arms - 1) * .6) + machBoss * st.bossDmg * up + st.harpoon * st.dps * st.bossDmg / 10);
      air = Math.min(st.air, air + dt * (rate * .7 * m.bubShare * CATCH * st.bubble));
      if (bossHp <= 0) { beat = true; break; }
    }
  }
  if (beat) { cr += E.bossBounty(boss.id) * st.coinMult * st.bounty; pe += boss.pearls * st.pearlMult; S.beaten.push(boss.id); if (boss.relic) S.relics[boss.relic] = 1; }
  if (st.blackMarket) cr += sp * E.rockCoin(L) * 25 * st.coinMult;
  S.cr += Math.floor(cr); S.sp += Math.floor(sp); S.pe += Math.floor(pe + Math.random());
  S.bestL = Math.max(S.bestL, L);
  return { t, L, cr, beat, boss: boss.name, left: bossHp == null ? null : Math.max(0, bossHp / E.bossHp(boss.id)) };
}

const WEIGHT = { drill1: 2, hull1: 1.4, hull2: 1.3, sal1: 1.3, drill2: 1.1, drill6: 1.6, drill10: 2, head1: 50, head2: 50, head3: 50, head4: 50, head5: 50, head6: 50, head7: 50,
  press1: 60, press2: 60, press3: 60, press4: 60, press5: 60, press6: 60, anc2: 3, sys4: 1.3, bio1: 3 };
function shop() {
  const bought = [];
  for (let guard = 0; guard < 500; guard++) {
    let best = null, bs = 0;
    for (const n of T.nodes) {
      if (n.id === 'core') continue;
      const l = S.lv[n.id] || 0; if (l >= n.max) continue;
      if (!(S.lv[n.parent] > 0) || !TB.gateMet(S, n.gate)) continue;
      const c = T.cost(n, l), have = n.cur === 'cr' ? S.cr : n.cur === 'sp' ? S.sp : S.pe;
      if (c > have) continue;
      const sc = (WEIGHT[n.id] || 1) / (c / (n.cur === 'pe' ? .02 : n.cur === 'sp' ? 1 : have + 1));
      if (sc > bs) { bs = sc; best = n; }
    }
    if (!best) break;
    const c = T.cost(best, S.lv[best.id] || 0);
    if (best.cur === 'cr') S.cr -= c; else if (best.cur === 'sp') S.sp -= c; else S.pe -= c;
    S.lv[best.id] = (S.lv[best.id] || 0) + 1; bought.push(best.id);
  }
  return bought;
}

let clock = 0, dives = 0;
const miles = [];
while (dives < 600) {
  dives++;
  const r = dive();
  clock += r.t + SHOP_SECONDS;
  const b = shop();
  if (verbose) console.log('dive ' + String(dives).padStart(3) + ' | ' + (clock / 60).toFixed(1).padStart(6) + ' min | ' + TB.fmtDepth(TB.metersAtL(r.L)).padStart(9) + ' | +' + TB.fmt(r.cr).padStart(7) + ' | dps ' + TB.fmt(TB.statsFor(S).dps).padStart(7) +
    (r.left != null ? ' | ' + r.boss + (r.beat ? ' BEATEN' : ' ' + Math.round(r.left * 100) + '% left') : '') + ' | pe ' + S.pe + ' sp ' + S.sp + ' | ' + (b.slice(0, 8).join(',') || '-'));
  if (r.beat) { miles.push([r.boss, dives, clock / 60]); if (r.boss === TB.bosses.heart.name) break; }
}
console.log('\nBoss milestones');
for (const [n, d, m] of miles) console.log('  ' + n.padEnd(22) + ' dive ' + String(d).padStart(3) + '  ' + m.toFixed(1).padStart(6) + ' min');
if (miles.length < 9) console.log('  (did not finish within 600 dives)');
const owned = T.nodes.filter(n => S.lv[n.id]).length - 1;
console.log('\nParts owned ' + owned + '/81, relics ' + Object.keys(S.relics).length + '/24, pearls left ' + S.pe + ', specimens left ' + S.sp);
