#!/usr/bin/env node
// Plays Deepline's economy with a simple player model and prints the progression curve.
// Usage: node tools/balance-sim.js [--verbose]
//
// It is a model, not the real game: it answers "how many dives and minutes until each
// boss falls, and is gold ever too plentiful?" so balance changes can be checked before
// anyone plays them.

const B = require('../prototypes/deepline/balance.js');
const verbose = process.argv.includes('--verbose');

const SHOP_SECONDS = 6;   // time a player spends in the tree between dives
const TRAVEL = 0.35;      // seconds moving the drill between targets
// Bubbles are B.bubbleShare of spawns; a player catches about 60% of them.
const BUBBLES_CAUGHT = (1 / B.spawnEvery) * B.bubbleShare * 0.6;
const BOSS_UPTIME = { clam: 0.6, angler: 0.75, eye: 0.65 };

function typeMix(d, s) {
  const zi = B.zones.indexOf(B.zoneAt(d));
  const mix = {
    crystal: d >= 8 ? s.crystalChance : 0,
    iron: zi >= 1 ? 0.13 : 0, viper: zi >= 1 ? 0.10 : 0,
    vent: zi >= 2 ? 0.10 : 0, isopod: zi >= 2 ? 0.08 : 0,
  };
  mix.rock = 1 - Object.values(mix).reduce((a, b) => a + b, 0);
  let hp = 0, coin = 0;
  for (const k in mix) { hp += mix[k] * B.types[k].hp; coin += mix[k] * B.types[k].coin; }
  return { hp: hp * B.rockHp(d), coin: coin * B.rockCoin(d) };
}

function dive(lv, start) {
  const s = B.stats(lv);
  const bossZone = B.zoneAt(start);
  const boss = bossZone.boss;
  let air = s.air, depth = start, t = 0, coins = 0, bossHp = boss.hp, beat = false;
  const dt = 0.05;
  const spawnCap = (1 / B.spawnEvery) * (1 - B.bubbleShare - B.jellyShare); // destructible rocks entering per second
  while (air > 0) {
    t += dt; air -= dt;
    if (depth < bossZone.to) {
      depth = Math.min(bossZone.to, depth + s.fins * dt);
      const m = typeMix(depth, s);
      const multi = 1 + (s.radius - B.base.radius) / 35;
      const effDps = s.dps * (1 + s.drone) * (1 + s.sonar * 1.2);
      let kills = (multi / (m.hp / effDps + TRAVEL)) * (1 + s.shock * 1.5);
      kills = Math.min(kills, spawnCap);
      coins += kills * dt * m.coin * s.coinMult * (1 + s.pressurePay * depth / 10) * (1 + s.lucky * 4);
      air = Math.min(s.air, air + dt * (BUBBLES_CAUGHT * s.bubble - (depth > 5 ? s.sting / 12 : 0)));
    } else {
      bossHp -= dt * (s.dps * BOSS_UPTIME[boss.id] * (1 + s.drone) + s.dps * s.sonar / 4);
      air = Math.min(s.air, air + dt * BUBBLES_CAUGHT * s.bubble);
      if (bossHp <= 0) { beat = true; break; }
    }
  }
  return { t, depth, coins: Math.floor(coins), beat, boss, bossLeft: Math.max(0, bossHp / boss.hp) };
}

function shop(lv, bank) {
  const bought = [];
  const weight = { dmg: 1.3, air: 1.1, fins: 1.0, size: 0.9, value: 1.1, bit2: 1.6, dmg2: 1.4, bit3: 1.6 };
  for (;;) {
    let best = null, bestScore = 0;
    for (const u of B.upgrades) {
      const l = lv[u.id] || 0;
      if (l >= u.max) continue;
      if (u.req && (lv[u.req[0]] || 0) < u.req[1]) continue;
      const c = B.cost(u, l);
      if (c > bank) continue;
      const sc = (weight[u.id] || 1) / c;
      if (sc > bestScore) { bestScore = sc; best = u; }
    }
    if (!best) break;
    bank -= B.cost(best, lv[best.id] || 0);
    lv[best.id] = (lv[best.id] || 0) + 1;
    bought.push(best.id);
  }
  return { bank, bought };
}

const lv = {};
let bank = 0, checkpoint = 0, clock = 0, dives = 0;
const milestones = [];
let maxGain = 0;
while (dives < 400) {
  dives++;
  const r = dive(lv, checkpoint);
  clock += r.t + SHOP_SECONDS;
  bank += r.coins;
  maxGain = Math.max(maxGain, r.coins);
  const sh = shop(lv, bank);
  bank = sh.bank;
  if (verbose) {
    console.log(`dive ${String(dives).padStart(3)} | ${(clock / 60).toFixed(1).padStart(5)} min | ${r.depth.toFixed(0).padStart(3)} m` +
      ` | +${String(r.coins).padStart(6)} coins | dps ${B.stats(lv).dps.toFixed(0).padStart(6)}` +
      (r.depth >= B.zoneAt(checkpoint).to ? ` | ${r.boss.name} ${r.beat ? 'BEATEN' : (100 * r.bossLeft).toFixed(0) + '% left'}` : '') +
      ` | bought: ${sh.bought.join(', ') || '-'}`);
  }
  if (r.beat) {
    milestones.push({ boss: r.boss.name, dives, minutes: clock / 60 });
    const zi = B.zones.findIndex(z => z.boss === r.boss);
    if (zi === B.zones.length - 1) break;
    checkpoint = B.zones[zi].to;
  }
}

console.log('\nBoss milestones');
for (const m of milestones) console.log(`  ${m.boss.padEnd(15)} dive ${String(m.dives).padStart(3)}  ${m.minutes.toFixed(1)} min`);
if (milestones.length < B.zones.length) console.log('  (demo not finished within 400 dives: too hard)');
const owned = B.upgrades.filter(u => lv[u.id]).map(u => `${u.id}:${lv[u.id]}`).join(' ');
console.log(`\nFinal build: ${owned}`);
