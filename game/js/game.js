// The dive: controls, drilling, creatures, hazards, machines, bosses, rewards.
(function () {
  const TB = globalThis.TB;
  const D = TB.draw, E = TB.econ, SW = TB.SW, SH = TB.SH;
  const G = TB.game = {
    S: null, st: null, mode: 'title', paused: false, run: null,
    sub: { x: SW / 2, y: 330, tilt: 0, vx: 0, vy: 0, heat: 0, grind: 0, spin: 0 },
    arms: [], drones: [], parts: [], floats: [], rings: [], shots: [], inks: [],
    radioQ: [], radioCur: null, hint: null, shake: 0,
    ptr: { x: SW / 2, y: 420, moved: 0 }, keys: {},
  };
  const HR = 44;
  const { clamp, rand } = TB;
  const P = () => TB.settings.particles;

  // ---------- helpers ----------
  G.addShake = v => { if (TB.settings.shake) G.shake = Math.max(G.shake, v * TB.settings.shake); };
  G.float = (x, y, text, color, size = 20, life) => G.floats.push({ x, y, text, color, size, t: 0, life: life || (size > 26 ? 2.2 : 1) });
  G.burst = (x, y, color, n, speed = 160, size = 3.5) => {
    n = Math.round(n * P());
    for (let i = 0; i < n; i++) { const a = Math.random() * 6.28, v = speed * (.3 + Math.random() * .7); G.parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, t: 0, life: .4 + Math.random() * .5, color, size: 2 + Math.random() * size, rot: Math.random() * 6 }); }
  };
  G.say = (text, who) => { if (text) G.radioQ.push({ text, who: who || 'SURFACE' }); };
  G.sayOnce = (key, text, who) => { if (!text || G.S.heard.includes(key)) return; G.S.heard.push(key); G.say(text, who); };
  G.setHint = (text, secs = 5) => { G.hint = { text, t: secs }; };
  const lightAdd = (x, y, r, a, life) => G.lightsTimed.push({ x, y, r, a, life, t: 0 });
  G.lightsTimed = [];

  // ---------- spawning ----------
  function zoneOf(L) { return TB.zoneAtL(Math.min(L, TB.zones.length * TB.ZONE_LEN - .01)); }
  function pickKind(L, bossy) {
    const z = zoneOf(L), st = G.st, prog = (L - z.L0) / TB.ZONE_LEN, table = {};
    for (const id in z.spawn) {
      const k = TB.kinds[id];
      let w = z.spawn[id];
      if (k.minP && prog < k.minP && z.i === 0) continue;
      if (bossy && (k.cls === 'hazard' || k.id === 'cache')) continue;
      if (k.rare) w *= st.rare;
      if (k.cls === 'creature') w *= st.bait;
      if (id === 'oyster') w *= 1 + 2 * st.pearlSight;
      if (id === 'cache') w *= st.cacheW;
      table[id] = w;
    }
    return TB.weighted(table);
  }
  function makeNode(L, id, bossy) {
    const k = TB.kinds[id], st = G.st, s = rand(k.size[0], k.size[1]);
    let hp = 0;
    if (k.cls === 'ore' || k.cls === 'creature' || k.cls === 'cache') hp = E.rockHp(L) * k.hp * (id === 'rock' ? s / 23 : 1) * E.ngHp(G.S.ng);
    if (id === 'jelly' || id === 'soul') hp = E.rockHp(L) * .8 * E.ngHp(G.S.ng);
    const n = {
      k, id, s, hp, max: hp, L,
      x: D.FIELD_L + s + Math.random() * (D.FIELD_R - D.FIELD_L - 2 * s), y: SH + s * 2 + 10,
      vx: 0, vy: bossy ? -(36 + Math.random() * 10) : -(34 + st.fins * 14 + Math.random() * 14),
      rot: Math.random() * 6.28, vr: (Math.random() - .5) * .8, ph: Math.random() * 6.28, hit: 0, dead: false, hold: 0,
    };
    const b = k.beh;
    if (b === 'swim') { n.vx = (Math.random() < .5 ? -1 : 1) * (70 + Math.random() * 60); n.vy *= .6; n.rot = 0; n.vr = 0; }
    if (b === 'crawl') { n.vy *= .55; n.vx = (Math.random() - .5) * 40; n.rot = 0; n.vr = 0; }
    if (b === 'swarm') { n.vx = (Math.random() < .5 ? -1 : 1) * 90; n.vy *= .7; n.rot = 0; n.vr = 0; }
    if (b === 'chase' || b === 'seek' || b === 'lunge') { n.rot = 0; n.vr = 0; n.vx = Math.random() < .5 ? -40 : 40; }
    if (b === 'lunge') { n.x = Math.random() < .5 ? D.FIELD_L + 10 : D.FIELD_R - 10; n.vx = 0; }
    if (id === 'jelly' || id === 'soul' || id === 'bubble') { n.rot = 0; n.vr = 0; if (id === 'jelly') n.vy *= .8; }
    if (b === 'geyser') { n.rot = 0; n.vr = 0; n.burstT = 1 + Math.random() * 3; n.burst = 0; }
    if (['rock', 'ore', 'nodule', 'obsidian', 'magma', 'carved'].includes(k.draw)) {
      const kv = 8 + Math.floor(Math.random() * 4);
      n.verts = Array.from({ length: kv }, (_, i) => [i / kv * 6.283 + (Math.random() - .5) * .45, .78 + Math.random() * .34]);
      n.spots = Array.from({ length: 4 }, () => [(Math.random() - .5) * 1.1, (Math.random() - .5) * 1.1, .06 + Math.random() * .1]);
      n.crack = Array.from({ length: 3 }, (_, i) => { const a0 = i * 2.1 + Math.random(); return [a0, a0 + (Math.random() - .5) * .8, .45 + Math.random() * .3]; });
      n.shards = Array.from({ length: 4 }, () => [Math.random() * 6.28, .9 + Math.random() * .5, 4 + Math.random() * 4]);
    }
    return n;
  }
  function spawn(L, bossy) {
    const id = pickKind(L, bossy), R = G.run;
    if (TB.kinds[id].beh === 'swarm') {
      const lead = makeNode(L, id, bossy);
      for (let i = 0; i < 6; i++) { const n = makeNode(L, id, bossy); n.x = clamp(lead.x + rand(-50, 50), D.FIELD_L, D.FIELD_R); n.y = lead.y + rand(-30, 30); n.vx = lead.vx * rand(.9, 1.1); R.nodes.push(n); }
      return;
    }
    R.nodes.push(makeNode(L, id, bossy));
  }

  // ---------- drill geometry ----------
  const drillBase = () => HR * .62 + 22;
  G.mainPose = function () {
    const sub = G.sub, a = G.arms[0];
    if (G.S.control === 'arm' && a) return { x: a.ex, y: a.ey, ang: a.ang };
    const d = drillBase();
    return { x: sub.x - Math.sin(sub.tilt) * d, y: sub.y + Math.cos(sub.tilt) * d, ang: sub.tilt };
  };
  function segOf(pose) {
    const L = D.drillLen(G.st), sn = Math.sin(pose.ang), cs = Math.cos(pose.ang);
    return { ax: pose.x - sn * L * .2, ay: pose.y + cs * L * .2, bx: pose.x - sn * L, by: pose.y + cs * L };
  }
  function segHit(px, py, g) {
    const dx = g.bx - g.ax, dy = g.by - g.ay;
    const t = clamp(((px - g.ax) * dx + (py - g.ay) * dy) / (dx * dx + dy * dy), 0, 1);
    const cx = g.ax + dx * t, cy = g.ay + dy * t;
    return { d: Math.hypot(px - cx, py - cy), t, cx, cy, w: D.drillHalf(G.st) * (1 - t * .75) };
  }
  function ik(arm, sx, sy, tx, ty, reach, dt, side) {
    const L = D.drillLen(G.st);
    let px = tx - sx, py = ty - sy; const d = Math.hypot(px, py) || 1; px /= d; py /= d;
    const want = clamp(d - L, 30, reach), e = Math.min(1, dt * 16);
    arm.sx = sx; arm.sy = sy;
    arm.ex += (sx + px * want - arm.ex) * e; arm.ey += (sy + py * want - arm.ey) * e;
    arm.ang += TB.angDiff(Math.atan2(-px, py), arm.ang) * e;
    const L1 = reach / 2 + 4, vx = arm.ex - sx, vy = arm.ey - sy, Dd = clamp(Math.hypot(vx, vy), 1, 2 * L1 - 1);
    const a = Math.atan2(vy, vx), off = Math.acos(clamp(Dd / (2 * L1), -1, 1));
    arm.elx = sx + Math.cos(a + side * off) * L1; arm.ely = sy + Math.sin(a + side * off) * L1;
  }
  const newArm = () => ({ sx: 0, sy: 0, ex: G.sub.x, ey: G.sub.y + 160, elx: G.sub.x, ely: G.sub.y + 80, ang: 0, heat: 0, grind: 0, spin: 0, target: null, hold: 0 });

  // ---------- damage ----------
  function dmgMult(n, arm, onBoss) {
    const st = G.st, R = G.run;
    let m = 1 + (st.crit + (onBoss ? st.weakSpot : 0)) * (st.critMult - 1);
    if (arm && arm.heat > .6) m *= 1 + st.overheat;
    if (arm) m *= 1 + st.resonance * Math.min(1, arm.hold / 2);
    if (onBoss) m *= st.bossDmg * (G.run.boss && G.run.boss.id === 'heart' ? st.heartRes : 1);
    else if (n && n.k.cls === 'creature') m *= st.predator;
    if (n && n.k.armor && !st.armorCut) m *= n.k.armor;
    if (st.flood && inLamp(onBoss ? R.boss : n)) m *= 1 + st.flood;
    m *= 1 + st.bloodPact * (1 - R.air / R.maxAir);
    return m;
  }
  function inLamp(t) {
    if (!t) return false;
    const lp = G.lamp; if (!lp) return false;
    const dx = t.x - lp.x, dy = t.y - lp.y, d = Math.hypot(dx, dy);
    return d < 650 * lp.mult && Math.abs(TB.angDiff(Math.atan2(dy, dx), lp.ang)) < .5;
  }
  G.hurt = function (n, amount, src) {
    if (n.dead) return;
    const k = n.k;
    if (k.cls === 'pickup') return;
    if (k.id === 'mine' || k.id === 'pocket') { explode(n); return; }
    if (k.cls === 'hazard' && !(k.id === 'jelly' && G.st.drillJelly && src === 'drill')) return;
    n.hp -= amount; n.hit = .07;
    if (src === 'drill' && G.st.burn) n.burnT = 3;
    if (src === 'drill' && G.st.parasite && k.cls === 'creature') n.parT = 3;
    if (k.ink && !n.inked) { n.inked = true; G.inks.push({ x: n.x, y: n.y, r: 20, t: 0, life: 4 }); }
    if (n.hp <= 0 || (G.st.shatter && n.max && n.hp / n.max < G.st.shatter && k.cls !== 'hazard')) breakNode(n);
  };

  function coinsFor(n) {
    const st = G.st, R = G.run, k = n.k, z = zoneOf(R.L);
    let c = E.rockCoin(R.L) * k.coin * st.coinMult * (1 + st.pressurePay * z.i) * E.ngPay(G.S.ng);
    if (k.cls === 'creature') {
      c *= st.creaturePay;
      if (!R.firstKinds[k.id] && st.bountyBoard > 1) { c *= st.bountyBoard; G.float(n.x, n.y - 40, 'BOUNTY ×' + st.bountyBoard, '#7be08a', 18); }
      R.firstKinds[k.id] = true;
    }
    let lucky = false;
    if (Math.random() < st.lucky) { c *= 5; lucky = true; G.S.luckies++; }
    if (k.cls === 'ore' && Math.random() < st.golden) c *= 2;
    return { c: Math.max(1, Math.round(c)), lucky };
  }
  function breakNode(n) {
    const S = G.S, R = G.run, st = G.st, k = n.k;
    n.dead = true;
    if (k.id === 'bubble') {
      R.air = Math.min(R.maxAir, R.air + st.bubble); S.bubbles++;
      G.burst(n.x, n.y, '#9fe6ff', 10, 100, 3); G.float(n.x, n.y - 16, '+' + st.bubble.toFixed(1) + ' s O₂', '#9fe6ff');
      TB.audio.sfx('bubble'); return;
    }
    if (k.id === 'jelly') {
      S.jellyDrilled++; G.burst(n.x, n.y, '#e59bff', 14, 150, 3);
      if (st.specimens) { R.sp += 1; G.float(n.x, n.y - 16, '+1 SPECIMEN', '#7be08a', 17); }
      TB.audio.sfx('squish'); return;
    }
    const { c, lucky } = coinsFor(n);
    R.cr += c; R.broken++; S.broken++;
    const creature = k.cls === 'creature';
    const col = k.shard || (creature ? '#c7d3e0' : k.id === 'rock' ? TB.css(D.palAt(R.L).p[4]) : '#b9a8a0');
    G.burst(n.x, n.y, col, creature ? 12 : 14, 180, creature ? 3 : 5);
    if (creature) G.burst(n.x, n.y, 'rgba(20,24,40,.8)', 8, 70, 8);
    if (k.shard) G.burst(n.x, n.y, '#fff3c4', 6, 220, 2);
    G.float(n.x, n.y - 16, (lucky ? 'LUCKY +' : '+') + TB.fmt(c), '#f6c453', lucky ? 28 : k.id === 'rock' ? 19 : 23);
    lightAdd(n.x, n.y, 90, .6, .25);
    G.addShake(k.id === 'rock' ? 2 : 4);
    TB.audio.sfx(lucky ? 'lucky' : creature ? 'squish' : k.shard ? 'ore' : 'brk');
    if (creature && st.specimens) { R.sp += 1; G.float(n.x, n.y + 10, '+1 SPECIMEN', '#7be08a', 15); }
    if (creature && st.symbiote) R.air = Math.min(R.maxAir, R.air + st.symbiote);
    if (k.pearl) {
      const p = 1 + (Math.random() < st.pearlMult - 1 ? 1 : 0);
      R.pe += p; G.float(n.x, n.y - 44, '+' + p + ' PEARL', '#e8e2ff', 24); TB.audio.sfx('pearl'); lightAdd(n.x, n.y, 140, .8, .6);
    }
    if (k.id === 'cache') { G.dropRelic(zoneOf(R.L), n); if (st.appraiser) { const bonus = c * 4 * st.appraiser; R.cr += bonus; G.float(n.x, n.y - 70, '+' + TB.fmt(bonus) + ' APPRAISED', '#f6c453', 18); } }
    if (k.relic && Math.random() < k.relic) G.dropRelic(zoneOf(R.L), n);
    if (st.shock > 0) {
      const dmg = st.shock * n.max;
      G.rings.push({ x: n.x, y: n.y, r: 6, max: 100, t: 0, life: .3, color: '#b18cff', w: 2 });
      for (const o of R.nodes) if (!o.dead && o !== n && Math.hypot(o.x - n.x, o.y - n.y) < 100) G.hurt(o, dmg, 'shock');
    }
  }
  function explode(n) {
    const R = G.run, k = n.k;
    n.dead = true;
    G.burst(n.x, n.y, '#ffd08a', 30, 320, 5); G.burst(n.x, n.y, 'rgba(40,40,40,.8)', 16, 120, 10);
    G.rings.push({ x: n.x, y: n.y, r: 10, max: k.blast, t: 0, life: .45, color: '#ffe0a0', w: 5 });
    lightAdd(n.x, n.y, 320, .9, .5);
    G.addShake(16); TB.audio.sfx('boom');
    for (const o of R.nodes) if (!o.dead && o !== n && Math.hypot(o.x - n.x, o.y - n.y) < k.blast) G.hurt(o, G.st.dps * 3, 'blast');
    if (R.boss && Math.hypot(R.boss.x - n.x, R.boss.y - n.y) < k.blast + R.boss.def.r) bossHurt(G.st.dps * 3);
    if (Math.hypot(G.sub.x - n.x, G.sub.y - n.y) < k.blast + HR) hurtSub(k.sting, k.name);
  }
  function hurtSub(amount, what, heat) {
    const st = G.st, R = G.run;
    if (Math.random() < st.shrug) { G.float(G.sub.x, G.sub.y - HR - 20, 'SHRUGGED OFF', '#9fe6ff', 18); return; }
    let a = amount * st.sting * (heat ? st.heatMult : 1);
    R.air -= a; R.hurt = true; R.alarm = .5;
    G.float(G.sub.x, G.sub.y - HR - 20, '−' + a.toFixed(1) + ' s O₂', '#e59bff', 24);
    G.addShake(12); TB.audio.sfx('sting');
  }

  // ---------- relics ----------
  G.dropRelic = function (zone, at) {
    const S = G.S, R = G.run;
    const logs = TB.relics.filter(r => r.id.startsWith('heron') && r.from === zone.id && !S.relics[r.id]);
    let r;
    if (logs.length) r = logs[0];
    else {
      let pool = TB.relics.filter(x => x.from === zone.id && !x.id.startsWith('heron'));
      if (!pool.length) pool = TB.relics.filter(x => x.from === 'wrecks' && !x.id.startsWith('heron'));
      r = TB.pick(pool);
    }
    if (!r) return;
    giveRelic(r, at.x, at.y);
  };
  function giveRelic(r, x, y) {
    const S = G.S, had = S.relics[r.id] || 0;
    S.relics[r.id] = Math.min(3, had + 1);
    G.run.relicsFound.push(r.id);
    G.float(x, y - 60, (had ? 'RANK UP · ' : 'RELIC · ') + r.name.toUpperCase(), '#f0b429', 26, 2.6);
    lightAdd(x, y, 260, .9, 1); TB.audio.sfx('relic');
    if (r.id.startsWith('heron') && !had) G.say(TB.heronLogs[r.id], 'HERON LOG');
    G.st = TB.statsFor(S);
  }

  // ---------- flow ----------
  G.startDive = function () {
    const S = G.S; TB.audio.unlock();
    G.st = TB.statsFor(S);
    const z = TB.zones[TB.startZone(S)], L = z.L0;
    G.run = { L, startZone: z.i, air: G.st.air, maxAir: G.st.air, nodes: [], cr: 0, sp: 0, pe: 0, broken: 0, spawnT: 0, boss: null,
      sonarT: G.st.sonarCd, torpT: 3, chargeT: 6, harpT: 10, flareT: 2, ending: 0, result: null, alarm: 0, intro: 1.6, firstKinds: {},
      relicsFound: [], hurt: false, emergencyUsed: 0, atLimit: false, chainT: 6, t: 0 };
    G.parts = []; G.floats = []; G.rings = []; G.shots = []; G.inks = []; G.radioQ = []; G.radioCur = null; G.lightsTimed = [];
    const sub = G.sub;
    sub.x = SW / 2; sub.y = L === 0 ? D.ANCHOR + 40 : 260; sub.tilt = 0; sub.vx = sub.vy = 0; sub.heat = sub.grind = 0; sub.chained = 0;
    G.ptr.x = SW / 2; G.ptr.y = 480;
    G.arms = Array.from({ length: G.st.arms }, newArm);
    G.drones = Array.from({ length: G.st.drones }, (_, i) => ({ i, x: sub.x + 60 * (i + 1), y: sub.y - 40, target: null, firing: false }));
    for (let i = 0; i < 9; i++) { const id = pickKind(L + 1, false); const k = TB.kinds[id]; if (k.cls === 'hazard' || k.beh === 'swarm') continue; const n = makeNode(L + 1, id); n.y = SH * (.55 + i * .06); G.run.nodes.push(n); }
    G.mode = 'dive'; G.paused = false;
    TB.audio.setZone(z.i); TB.audio.setBoss(false);
    G.float(SW / 2, 250, z.name.toUpperCase(), '#f4efe2', 44, 2.6);
    G.sayOnce('z' + z.i + 'e', TB.radio.zone[z.i].enter);
    if (!S.tut.move) { S.tut.move = 1; G.setHint(S.control === 'arm' ? 'Move the mouse. The drill arm reaches where you point.' : S.control === 'keys' ? 'Steer with WASD or the arrow keys.' : 'Move the mouse. The sub follows your aim.', 7); }
    TB.ui.onDiveStart();
  };

  function spawnBoss() {
    const R = G.run, z = zoneOf(R.L - .01), def = TB.bosses[z.boss];
    const hp = E.bossHp(def.id) * E.ngHp(G.S.ng);
    R.boss = { id: def.id, def, hp, max: hp, x: SW / 2, y: SH + 220, t: 0, phaseT: 0, open: true, hit: 0, spawnT: def.spawn ? def.spawn.every : 0, blockT: 0, face: 1,
      trail: [], shieldMax: def.shield ? hp * def.shield : 0, shield: def.shield ? hp * def.shield : 0, chainT: 6, eyes: 1 };
    R.hurt = false;
    G.S.seen[def.id] = true;
    G.float(SW / 2, 250, def.name.toUpperCase(), '#ff7a59', 52, 2.6);
    G.addShake(12); TB.audio.sfx('boss'); TB.audio.setBoss(true);
    G.sayOnce('firstBoss', TB.radio.firstBoss);
  }
  function bossHurt(amount) {
    const b = G.run.boss; if (!b) return;
    if (b.shield > 0) { b.shield -= amount; b.hit = .07; if (b.shield <= 0) { G.float(b.x, b.y - 120, 'SHIELD BROKEN', '#ff9ab0', 30); G.addShake(10); TB.audio.sfx('boom'); } return; }
    b.hp -= amount; b.hit = .07;
  }
  const bossVulnerable = b => b && (!b.def.cycle || b.open);

  function bossDown() {
    const R = G.run, S = G.S, b = R.boss, z = zoneOf(R.L - .01), st = G.st;
    const first = !S.beaten.includes(b.id);
    const bounty = Math.round(E.bossBounty(b.id) * st.coinMult * st.bounty * E.ngPay(S.ng));
    R.cr += bounty;
    const pearls = first ? Math.round(b.def.pearls * st.pearlMult) : 1;
    R.pe += pearls;
    G.burst(b.x, b.y, '#ffffff', 60, 360, 4); G.burst(b.x, b.y, '#f6c453', 40, 260); G.burst(b.x, b.y, 'rgba(20,24,40,.9)', 30, 140, 10);
    G.rings.push({ x: b.x, y: b.y, r: 10, max: 700, t: 0, life: 1, color: '#f4efe2', w: 6 });
    lightAdd(b.x, b.y, 700, .95, 1.4);
    G.float(b.x, b.y - 150, 'DEFEATED', '#f4efe2', 60, 2.4);
    G.float(b.x, b.y - 90, '+' + TB.fmt(bounty), '#f6c453', 36, 2.4);
    if (pearls) G.float(b.x, b.y - 40, '+' + pearls + ' PEARLS', '#e8e2ff', 30, 2.4);
    G.addShake(22); TB.audio.sfx('win'); TB.audio.setBoss(false);
    if (!R.hurt) S.flawless++;
    if (first) S.beaten.push(b.id);
    if (first && b.def.relic) giveRelic(TB.relicById[b.def.relic], b.x, b.y + 40);
    G.sayOnce('z' + z.i + 'd', TB.radio.zone[z.i].down);
    R.boss = null;
    R.result = { boss: b.def.name, id: b.id, zone: z, first };
    R.ending = b.id === 'heart' ? 3 : 2.4;
    for (const n of R.nodes) if (n.k.cls === 'hazard') { n.dead = true; G.burst(n.x, n.y, '#e59bff', 6); }
  }

  G.endDive = function () {
    const R = G.run, S = G.S, st = G.st;
    G.mode = 'dock'; TB.audio.motor(false, 0); TB.audio.setBoss(false);
    let market = 0;
    if (st.blackMarket && R.sp) market = Math.round(R.sp * E.rockCoin(R.L) * 25 * st.coinMult);
    S.cr += R.cr + market; S.sp += R.sp; S.pe += R.pe;
    S.dives++;
    S.bestL = Math.max(S.bestL, R.L); S.bestM = Math.max(S.bestM, TB.metersAtL(R.L));
    S.maxCr = Math.max(S.maxCr, S.cr);
    const report = { L: R.L, cr: R.cr, sp: R.sp, pe: R.pe, market, broken: R.broken, result: R.result, relics: R.relicsFound, atLimit: R.atLimit,
      bossLeft: R.bossLeft, bossId: R.bossId, zone: zoneOf(R.L) };
    if (R.result && R.result.id === 'heart') { TB.ui.onHeart(report); return; }
    if (TB.DEMO && R.result && R.result.id === 'angler' && R.result.first) { TB.save(S); TB.ui.onDemoEnd(report); return; }
    TB.save(S);
    TB.ui.onDiveEnd(report);
  };

  // ---------- update ----------
  G.update = function (dt) {
    D.T += dt;
    const R = G.run;
    D.stepSnow(dt, G.mode === 'dive' && R && !R.boss && !R.ending ? G.st.fins : .5);
    D.stepFarBeast(dt, G.mode === 'dive' && R ? R.L : -1);
    if (G.mode === 'title') {
      const surf = D.ANCHOR + 15.5 * D.PXM;
      G.sub.x = 1100 + 420; G.sub.y = surf - 125 + Math.sin(D.T * 1.1) * 4; G.sub.tilt = Math.sin(D.T * .9) * .05; G.sub.spin += dt * .4;
    }
    if (G.mode === 'dive' && !G.paused) { G.S.play += dt; updateRun(dt); }
    if (G.paused) return;
    for (const p of G.parts) { p.t += dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= .93; p.vy *= .93; p.vy -= 10 * dt; }
    G.parts = G.parts.filter(p => p.t < p.life);
    for (const f of G.floats) { f.t += dt; f.y -= dt * (f.size > 26 ? 12 : 44); }
    G.floats = G.floats.filter(f => f.t < f.life);
    for (const r of G.rings) r.t += dt;
    G.rings = G.rings.filter(r => r.t < r.life);
    for (const l of G.lightsTimed) l.t += dt;
    G.lightsTimed = G.lightsTimed.filter(l => l.t < l.life);
    for (const k of G.inks) { k.t += dt; k.r = Math.min(160, k.r + dt * 200); }
    G.inks = G.inks.filter(k => k.t < k.life);
    G.shake = Math.max(0, G.shake - dt * 40);
    if (G.hint) { G.hint.t -= dt; if (G.hint.t <= 0) G.hint = null; }
    if (!G.radioCur && G.radioQ.length) G.radioCur = Object.assign({ t: 0 }, G.radioQ.shift());
    if (G.radioCur) {
      G.radioCur.t += dt;
      if (G.radioCur.t * 45 < G.radioCur.text.length && Math.random() < .3) TB.audio.sfx('radio');
      if (G.radioCur.t > G.radioCur.text.length / 45 + 4.5) G.radioCur = null;
    }
  };

  function steer(dt) {
    const S = G.S, st = G.st, R = G.run, sub = G.sub, c = S.control, oldx = sub.x;
    const slow = sub.chained > 0 ? .25 : 1;
    if (c === 'follow') {
      const off = drillBase() + D.drillLen(st);
      const tx = clamp(G.ptr.x, 110, SW - 110), ty = clamp(G.ptr.y - off, 110, SH - 200);
      const ease = Math.min(1, dt * (R.intro > 0 ? 3 : 14) * slow);
      sub.x += (tx - sub.x) * ease; sub.y += (ty - sub.y) * ease;
    } else if (c === 'keys') {
      const k = G.keys, ax = (k.d || k.arrowright ? 1 : 0) - (k.a || k.arrowleft ? 1 : 0), ay = (k.s || k.arrowdown ? 1 : 0) - (k.w || k.arrowup ? 1 : 0);
      sub.vx += ax * 2400 * dt * slow; sub.vy += ay * 2400 * dt * slow;
      const damp = Math.pow(.015, dt); sub.vx *= damp; sub.vy *= damp;
      const sp = Math.hypot(sub.vx, sub.vy), mx = 460 * slow; if (sp > mx) { sub.vx *= mx / sp; sub.vy *= mx / sp; }
      sub.x = clamp(sub.x + sub.vx * dt, 110, SW - 110); sub.y = clamp(sub.y + sub.vy * dt, 110, SH - 200);
    } else {
      sub.x += clamp(clamp(G.ptr.x, 220, SW - 220) - sub.x, -170 * dt * slow, 170 * dt * slow);
      sub.y += (200 + Math.sin(D.T * 1.2) * 6 - sub.y) * Math.min(1, dt * (R.intro > 0 ? 1.5 : 3));
    }
    const vx = (sub.x - oldx) / Math.max(dt, 1e-3);
    sub.tilt += (clamp(vx * (c === 'arm' ? .0006 : .0011), -.38, .38) - sub.tilt) * Math.min(1, dt * 6);
    // arms
    const idle = performance.now() - G.ptr.moved > 1000;
    G.arms.forEach((arm, i) => {
      if (i === 0 && c !== 'arm') return;
      const side = i === 0 ? (G.ptr.x > sub.x ? -1 : 1) : i === 1 ? 1 : -1;
      const sx = sub.x + (i === 0 ? 0 : (i === 1 ? -1 : 1) * HR * .85), sy = sub.y + HR * (i === 0 ? .7 : .35);
      let tx = G.ptr.x, ty = G.ptr.y;
      const auto = i > 0 || (st.autoDrill && idle);
      if (auto) {
        const t = autoTarget(arm, sx, sy, st.reach * (i === 0 ? 1 : .85));
        if (t) { tx = t.x; ty = t.y; } else { tx = sx + (i === 0 ? 0 : (i === 1 ? -120 : 120)); ty = sy + 160; }
      }
      ik(arm, sx, sy, tx, ty, st.reach * (i === 0 ? 1 : .85), dt, side);
    });
  }
  function autoTarget(arm, sx, sy, reach) {
    const R = G.run, st = G.st;
    if (R.boss && bossVulnerable(R.boss) && Math.hypot(R.boss.x - sx, R.boss.y - sy) < reach + R.boss.def.r + 120) return R.boss;
    if (arm.target && !arm.target.dead && Math.hypot(arm.target.x - sx, arm.target.y - sy) < reach + 140) return arm.target;
    let best = null, bd = 1e9;
    for (const n of R.nodes) {
      if (n.dead || n.k.cls === 'hazard' || n.k.cls === 'pickup') continue;
      const d = Math.hypot(n.x - sx, n.y - sy);
      if (d < reach + 120 && d < bd) { bd = d; best = n; }
    }
    arm.target = best;
    return best;
  }

  function updateRun(dt) {
    const R = G.run, S = G.S, st = G.st, sub = G.sub;
    R.t += dt;
    steer(dt);
    R.intro = Math.max(0, R.intro - dt);
    sub.chained = Math.max(0, (sub.chained || 0) - dt);
    if (R.ending > 0) {
      R.ending -= dt;
      for (const n of R.nodes) n.y += n.vy * dt * .4;
      sub.grind *= .9; TB.audio.motor(true, sub.grind);
      if (R.ending <= 0) G.endDive();
      return;
    }
    const z = zoneOf(R.L);
    R.air -= dt * z.air;
    R.alarm = Math.max(0, R.alarm - dt);
    // sinking and zone events
    if (!R.boss) {
      const before = R.L, floor = z.L1, beaten = S.beaten.includes(z.boss);
      R.L = Math.min(floor, R.L + st.fins * dt);
      const prog = (R.L - z.L0) / TB.ZONE_LEN;
      if (prog > .85) G.sayOnce('z' + z.i + 'n', TB.radio.zone[z.i].near);
      if (R.L >= floor) {
        if (!beaten) spawnBoss();
        else if (!R.atLimit) { R.atLimit = true; G.sayOnce('hull', TB.radio.hullLimit); }
      }
      const zb = zoneOf(before);
      if (zoneOf(R.L) !== zb) { G.sayOnce('z' + zoneOf(R.L).i + 'e', TB.radio.zone[zoneOf(R.L).i].enter); TB.audio.setZone(zoneOf(R.L).i); }
    }
    if (!S.tut.air && S.dives === 0 && R.air < R.maxAir * .4) { S.tut.air = 1; G.setHint('Oxygen is your timer. Touch air pockets to refill it.', 6); }
    // spawning
    R.spawnT -= dt;
    if (R.spawnT <= 0) { R.spawnT = E.spawnEvery * (R.boss ? 1.5 : 1); spawn(R.L, !!R.boss); }

    // cutting: main drill (hull or arm) plus extra arms
    const cutters = [];
    if (S.control !== 'arm') cutters.push({ pose: G.mainPose(), arm: sub, main: true });
    G.arms.forEach((a, i) => { if (i === 0 && S.control !== 'arm') return; cutters.push({ pose: { x: a.ex, y: a.ey, ang: a.ang }, arm: a, main: i === 0, share: i === 0 ? 1 : .6 }); });
    for (const c of cutters) c.seg = segOf(c.pose), c.grinding = 0;

    for (const n of R.nodes) {
      const k = n.k;
      moveNode(n, dt);
      if (n.dead) continue;
      if (!S.seen[k.id] && n.y < SH - 60 && n.y > 0) { S.seen[k.id] = true; n.isNew = 4; G.sayOnce('f_' + k.id, TB.radio.first[k.id]); }
      if (n.isNew) n.isNew = Math.max(0, n.isNew - dt);
      if (n.burnT > 0) { n.burnT -= dt; G.hurt(n, st.burn * st.dps * dt, 'burn'); }
      if (n.parT > 0) { n.parT -= dt; G.hurt(n, st.parasite * st.dps * dt, 'burn'); }
      if (n.dead) continue;
      const touchHull = Math.hypot(n.x - sub.x, n.y - sub.y) < HR + n.s * .8;
      // hazards and pickups
      if (k.cls === 'pickup') {
        if (touchHull || cutters.some(c => { const h = segHit(n.x, n.y, c.seg); return h.d < h.w + n.s; })) breakNode(n);
        continue;
      }
      if (k.id === 'geyser') {
        if (n.burst > 0 && !n.hitSub && Math.abs(sub.x - n.x) < 50 && sub.y < n.y && n.y - sub.y < 220) {
          n.hitSub = true;
          if (!st.heatProof) hurtSub(k.sting, k.name, true);
        }
        continue;
      }
      let drilled = null;
      for (const c of cutters) { const h = segHit(n.x, n.y, c.seg); if (h.d < h.w + n.s * .8 + 4) { drilled = { c, h }; break; } }
      if (k.cls === 'hazard' && k.id !== 'mine' && k.id !== 'pocket') {
        if (G.flareActive && k.id === 'jelly' && Math.hypot(G.flareActive.x - n.x, G.flareActive.y - n.y) < 260) { if (drilled && st.drillJelly) cut(n, drilled, dt); continue; }
        if (drilled && k.id === 'jelly' && st.drillJelly) { cut(n, drilled, dt); continue; }
        if (touchHull || drilled) { n.dead = true; G.burst(n.x, n.y, k.id === 'soul' ? '#ff8a3c' : '#e59bff', 16, 150, 3); hurtSub(k.sting, k.name); }
        continue;
      }
      if ((k.id === 'mine' || k.id === 'pocket') && (touchHull || drilled)) { explode(n); continue; }
      if (k.bite && touchHull && !n.bitT) { n.bitT = 1.5; hurtSub(k.bite, k.name); TB.audio.sfx('bite'); n.vx = -n.vx || (n.x > sub.x ? 200 : -200); n.flee = 1.2; }
      if (drilled) cut(n, drilled, dt);
    }
    // grind state per cutter
    for (const c of cutters) {
      const a = c.arm;
      a.grind += (c.grinding - a.grind) * Math.min(1, dt * 12);
      a.heat = clamp(a.heat + (c.grinding ? dt * .7 : -dt * .5), 0, 1);
      a.spin = (a.spin + dt * (1.6 + a.grind * 4.5)) % 1;
      a.hold = c.grinding ? a.hold + dt : 0;
    }
    const mainC = cutters.find(c => c.main);
    const g = mainC ? mainC.arm.grind : 0;
    if (g > .5) G.addShake(1.6);
    TB.audio.motor(true, g);

    machines(dt, cutters);
    R.nodes = R.nodes.filter(n => !n.dead && n.y > -100 && n.y < SH + 200);

    if (R.boss) updateBoss(dt, cutters);
    if (!R.boss && R.result) return;

    if (R.air <= 0) {
      if (st.emergency && !R.emergencyUsed) { R.emergencyUsed = 1; R.air = R.maxAir * st.emergency; G.float(sub.x, sub.y - 80, 'EMERGENCY OXYGEN', '#9fe6ff', 28); TB.audio.sfx('bubble'); return; }
      R.air = 0;
      if (R.boss) { R.bossLeft = R.boss.hp / R.boss.max; R.bossId = R.boss.id; }
      G.endDive();
    }
  }

  function cut(n, drilled, dt) {
    const { c, h } = drilled, st = G.st;
    const dmg = st.dps * dt * (c.share || 1) * dmgMult(n, c.arm, false);
    G.hurt(n, dmg, 'drill');
    c.grinding = 1;
    if (c.arm.target !== n) { c.arm.target = n; c.arm.hold = 0; }
    const ux = (n.x - h.cx) / (h.d || 1), uy = (n.y - h.cy) / (h.d || 1);
    n.x += ux * 14 * dt; n.y += uy * 14 * dt; n.shake = .1;
    grindFx(h.cx + ux * h.w, h.cy + uy * h.w, ux, uy, n, dt);
    if (st.crit > 0 && Math.random() < dt * st.crit * 4) { G.float(n.x + rand(-10, 10), n.y - n.s - 10, 'CRIT', '#ffd24a', 16); TB.audio.sfx('crit'); }
  }
  function grindFx(x, y, ux, uy, n, dt) {
    const k = n.k || {}, pal = D.palAt(G.run.L).p;
    const col = k.shard || (k.cls === 'creature' ? '#c7d3e0' : k.id === 'boss' ? '#ffffff' : TB.css(TB.shade(pal[4], .15)));
    const side = Math.random() < .5 ? -1 : 1, pm = P();
    if (Math.random() < dt * 45 * pm) { const sp = 140 + Math.random() * 200; G.parts.push({ x, y, vx: (ux * .6 - uy * side) * sp, vy: (uy * .6 + ux * side) * sp - 60, t: 0, life: .35 + Math.random() * .3, color: col, size: 2.5 + Math.random() * 3.5, rot: Math.random() * 6 }); }
    if (Math.random() < dt * 28 * pm) { const sp = 260 + Math.random() * 260; G.parts.push({ x, y, vx: -uy * side * sp, vy: ux * side * sp - 120, t: 0, life: .18 + Math.random() * .15, color: Math.random() < .6 ? '#ffe7a8' : '#ffffff', size: 1.6, rot: 0 }); }
    if (Math.random() < dt * 10 * pm) G.parts.push({ x, y, vx: (Math.random() - .5) * 60, vy: -20 - Math.random() * 30, t: 0, life: .8 + Math.random() * .5, color: 'rgba(170,175,180,.25)', size: 10 + Math.random() * 10, rot: 0, dust: 1 });
  }

  function moveNode(n, dt) {
    const k = n.k, sub = G.sub, st = G.st;
    n.ph += dt * 3; n.hit = Math.max(0, n.hit - dt); n.rot += n.vr * dt;
    if (n.bitT) n.bitT = Math.max(0, n.bitT - dt);
    if (n.flee) n.flee = Math.max(0, n.flee - dt);
    const b = k.beh;
    if (b === 'chase' && !n.flee) {
      const dx = sub.x - n.x, dy = sub.y - n.y, d = Math.hypot(dx, dy) || 1;
      if (d < 700) { n.vx += (dx / d * 130 - n.vx) * Math.min(1, dt * 2); n.y += (dy / d) * 60 * dt; }
    } else if (b === 'seek') {
      const dx = sub.x - n.x, dy = sub.y - n.y, d = Math.hypot(dx, dy) || 1;
      if (d < 600) { n.x += dx / d * 50 * dt; n.y += dy / d * 50 * dt; }
    } else if (b === 'lunge') {
      const dx = sub.x - n.x, dy = sub.y - n.y, d = Math.hypot(dx, dy);
      if (!n.lunging && d < 380 && !n.flee) { n.lunging = .7; n.vx = dx / d * 480; n.ly = dy / d * 480; TB.audio.sfx('bite', .7); }
      if (n.lunging) { n.lunging -= dt; n.y += (n.ly || 0) * dt; if (n.lunging <= 0) { n.lunging = 0; n.flee = 2; n.vx = -n.vx * .3; } }
    } else if (b === 'geyser') {
      n.burstT -= dt;
      if (n.burstT <= 0) { n.burst = 1; n.burstT = 4; n.hitSub = false; TB.audio.sfx('sonar', .4); }
      if (n.burst > 0) n.burst = Math.max(0, n.burst - dt);
    } else if (k.id === 'tubeworm') {
      const d = Math.hypot(sub.x - n.x, sub.y - n.y); n.hide = clamp((n.hide || 0) + (d < 260 ? dt * 3 : -dt * 2), 0, 1);
    }
    if (k.id === 'jelly' && st.calm) {
      const dx = n.x - sub.x, dy = n.y - sub.y, d = Math.hypot(dx, dy) || 1;
      if (d < 320) { n.x += dx / d * st.calm * 90 * dt; n.y += dy / d * st.calm * 40 * dt; }
    }
    n.x += n.vx * dt; n.y += n.vy * dt;
    if (n.vx && (n.x < D.FIELD_L || n.x > D.FIELD_R)) { n.vx = -n.vx; n.x = clamp(n.x, D.FIELD_L, D.FIELD_R); }
  }

  // ---------- machines: sonar, drones, torpedoes, charges, harpoon, flares ----------
  function nearest(x, y, filter, maxD = 2000) {
    let best = null, bd = maxD;
    for (const n of G.run.nodes) { if (n.dead || !filter(n)) continue; const d = Math.hypot(n.x - x, n.y - y); if (d < bd) { bd = d; best = n; } }
    return best;
  }
  const breakable = n => n.k.cls === 'ore' || n.k.cls === 'creature' || n.k.cls === 'cache';
  function machines(dt, cutters) {
    const R = G.run, st = G.st, sub = G.sub, b = R.boss;
    if (st.sonar > 0) {
      R.sonarT -= dt;
      if (R.sonarT <= 0) {
        R.sonarT = st.sonarCd;
        G.rings.push({ x: sub.x, y: sub.y, r: HR, max: 1100, t: 0, life: .7, color: '#b18cff', w: 3 });
        TB.audio.sfx('sonar');
        for (const n of R.nodes) if (n.y < SH + 10 && n.y > -20 && n.k.cls !== 'hazard') G.hurt(n, st.dps * st.sonar, 'sonar');
        if (bossVulnerable(b)) bossHurt(st.dps * st.sonar * st.bossDmg);
      }
    }
    G.drones.forEach(dr => {
      const bossT = bossVulnerable(b) ? b : null;
      if (!bossT && (!dr.target || dr.target.dead || dr.target.y < 40)) dr.target = nearest(dr.x, dr.y, n => breakable(n) && n.y > 60 && n.y < SH - 30);
      const tg = bossT || dr.target;
      const gx = tg ? tg.x + 40 * (dr.i % 2 ? -1 : 1) : sub.x + 90 * (dr.i % 2 ? -1 : 1), gy = tg ? tg.y - (tg === b ? tg.def.r + 30 : 50) : sub.y - 40 - dr.i * 20;
      const dx = gx - dr.x, dy = gy - dr.y, dist = Math.hypot(dx, dy), sp = 620 * dt;
      if (dist > 1) { dr.x += dx / dist * Math.min(sp, dist); dr.y += dy / dist * Math.min(sp, dist); }
      dr.firing = !!tg && dist < 60; dr.tx = tg ? tg.x : null; dr.ty = tg ? tg.y : null;
      if (dr.firing) { const d = st.dps * st.droneDps * dt; if (tg === b) bossHurt(d * st.bossDmg); else G.hurt(tg, d, 'drone'); }
    });
    if (st.torpedo) {
      R.torpT -= dt;
      if (R.torpT <= 0) {
        R.torpT = 3;
        const t = nearest(sub.x, sub.y, n => n.k.cls === 'creature') || (bossVulnerable(b) ? b : nearest(sub.x, sub.y, breakable));
        if (t) { const a = Math.atan2(t.y - sub.y, t.x - sub.x); G.shots.push({ type: 'torpedo', x: sub.x, y: sub.y + 20, vx: Math.cos(a) * 420, vy: Math.sin(a) * 420, target: t, dmg: st.dps * st.torpedo * (1 + .3 * st.homing), life: 3 }); TB.audio.sfx('torpedo'); }
      }
    }
    if (st.charges) {
      R.chargeT -= dt;
      if (R.chargeT <= 0) { R.chargeT = 6; G.shots.push({ type: 'charge', x: sub.x, y: sub.y + 30, vx: 0, vy: 160, fuse: .9, dmg: st.dps * st.charges, life: 2 }); }
    }
    if (st.harpoon && bossVulnerable(b)) {
      R.harpT -= dt;
      if (R.harpT <= 0) { R.harpT = 10; const a = Math.atan2(b.y - sub.y, b.x - sub.x); G.shots.push({ type: 'harpoon', x: sub.x, y: sub.y, vx: Math.cos(a) * 700, vy: Math.sin(a) * 700, target: b, dmg: st.dps * st.harpoon * st.bossDmg, life: 2 }); TB.audio.sfx('torpedo', .6); }
    }
    if (st.flares) {
      R.flareT -= dt;
      if (R.flareT <= 0) { R.flareT = 8; G.shots.push({ type: 'flare', x: sub.x, y: sub.y, vx: rand(-160, 160), vy: rand(80, 200), life: 2 + st.flares, flare: true }); }
    }
    G.flareActive = null;
    for (const p of G.shots) {
      p.life -= dt;
      if (p.type === 'flare') { p.vx *= .97; p.vy *= .97; p.x += p.vx * dt; p.y += p.vy * dt; G.flareActive = p; continue; }
      if (p.type === 'torpedo' && st.homing && p.target && !p.target.dead) {
        const a = Math.atan2(p.target.y - p.y, p.target.x - p.x), sp = Math.hypot(p.vx, p.vy), cur = Math.atan2(p.vy, p.vx);
        const na = cur + TB.angDiff(a, cur) * Math.min(1, dt * 5); p.vx = Math.cos(na) * sp; p.vy = Math.sin(na) * sp;
      }
      p.x += p.vx * dt; p.y += p.vy * dt;
      if (p.type === 'charge') { p.vy *= .96; p.fuse -= dt; if (p.fuse <= 0) { blast(p.x, p.y, 150, p.dmg); p.life = 0; } continue; }
      const t = p.target;
      if (t && (t === b ? Math.hypot(t.x - p.x, t.y - p.y) < t.def.r : !t.dead && Math.hypot(t.x - p.x, t.y - p.y) < t.s + 12)) {
        if (t === b) bossHurt(p.dmg); else G.hurt(t, p.dmg, 'torpedo');
        G.burst(p.x, p.y, '#ffd08a', 12, 200, 3); lightAdd(p.x, p.y, 120, .7, .3); TB.audio.sfx('boom', 1.6);
        if (st.lightning) arc(p.x, p.y, p.dmg * .5, 1 + st.lightning);
        p.life = 0;
      }
    }
    G.shots = G.shots.filter(p => p.life > 0 && p.y > -100 && p.y < SH + 100);
  }
  function blast(x, y, r, dmg) {
    G.rings.push({ x, y, r: 10, max: r, t: 0, life: .4, color: '#ffd08a', w: 4 });
    G.burst(x, y, '#ffd08a', 20, 260, 4); lightAdd(x, y, 260, .85, .4); G.addShake(8); TB.audio.sfx('boom');
    for (const n of G.run.nodes) if (!n.dead && Math.hypot(n.x - x, n.y - y) < r) G.hurt(n, dmg, 'blast');
    const b = G.run.boss; if (bossVulnerable(b) && Math.hypot(b.x - x, b.y - y) < r + b.def.r) bossHurt(dmg * G.st.bossDmg);
    if (G.st.lightning) arc(x, y, dmg * .5, 1 + G.st.lightning);
  }
  function arc(x, y, dmg, count) {
    let from = { x, y };
    const hit = new Set();
    for (let i = 0; i < count; i++) {
      const t = nearest(from.x, from.y, n => breakable(n) && !hit.has(n), 220);
      if (!t) break;
      hit.add(t); G.hurt(t, dmg, 'zap');
      G.rings.push({ x: t.x, y: t.y, r: 4, max: 30, t: 0, life: .2, color: '#bfe8ff', w: 2 });
      G.zaps = G.zaps || []; G.zaps.push({ x1: from.x, y1: from.y, x2: t.x, y2: t.y, t: .15 });
      from = t;
    }
    if (hit.size) TB.audio.sfx('zap');
  }

  // ---------- bosses ----------
  function updateBoss(dt, cutters) {
    const R = G.run, b = R.boss, def = b.def, st = G.st, sub = G.sub;
    b.t += dt; b.hit = Math.max(0, b.hit - dt); b.blockT = Math.max(0, b.blockT - dt);
    if (def.phases) {
      b.eyes = 1 + Math.floor((1 - b.hp / b.max) * 4.99);
      const speed = 1 + (b.eyes - 1) * .15;
      b.phaseT += dt * speed; if (b.phaseT >= (b.open ? def.cycle[0] : def.cycle[1])) { b.phaseT = 0; b.open = !b.open; }
    } else if (def.cycle) { b.phaseT += dt; if (b.phaseT >= (b.open ? def.cycle[0] : def.cycle[1])) { b.phaseT = 0; b.open = !b.open; } }
    const amp = (D.FIELD_R - D.FIELD_L) / 2 - def.r;
    const nx = SW / 2 + Math.sin(b.t * def.speed) * amp * def.sway;
    b.face = nx >= b.x ? 1 : -1;
    b.x = nx;
    b.y += (def.y + Math.sin(b.t * 1.2) * 18 - b.y) * Math.min(1, dt * 1.5);
    if (def.burrow) { b.trail.unshift([b.x, b.y]); if (b.trail.length > 14) b.trail.length = 14; }
    if (def.spawn) {
      b.spawnT -= dt;
      if (b.spawnT <= 0) {
        b.spawnT = def.spawn.every * (def.phases ? 1 - (b.eyes - 1) * .12 : 1);
        const n = makeNode(R.L, def.spawn.kind, true);
        n.x = clamp(b.x + (Math.random() - .5) * def.r * 1.6, D.FIELD_L + 20, D.FIELD_R - 20); n.y = b.y - def.r * .4; n.vy = -70;
        R.nodes.push(n);
      }
    }
    if (def.chains) {
      b.chainT -= dt;
      if (b.chainT <= 0) { b.chainT = 6; sub.chained = 2.2; G.float(sub.x, sub.y - 90, 'CHAINED', '#8f96a0', 26); TB.audio.sfx('block', .5); }
      b.chained = sub.chained;
    }
    for (const c of cutters) {
      const h = segHit(b.x, b.y, c.seg);
      if (h.d < def.r * .85 + h.w * .5) {
        if (bossVulnerable(b)) {
          bossHurt(st.dps * dt * (c.share || 1) * dmgMult(null, c.arm, true));
          c.grinding = 1;
          const ux = (b.x - h.cx) / (h.d || 1), uy = (b.y - h.cy) / (h.d || 1);
          grindFx(h.cx + ux * h.w, h.cy + uy * h.w, ux, uy, { k: { id: 'boss' } }, dt);
        } else if (def.reflect) {
          G.run.air -= dt * .8 * st.sting; G.run.alarm = .3; G.run.hurt = true;
          if (b.blockT <= 0) { b.blockT = .9; G.float(h.cx, h.cy - 30, 'REFLECTED', '#ffffff', 20); TB.audio.sfx('block'); }
        } else if (b.blockT <= 0) {
          b.blockT = .9; G.float(h.cx, h.cy - 30, def.burrow ? 'BURROWED' : 'BLOCKED', '#8fb3c4', 20); TB.audio.sfx('block'); G.burst(h.cx, h.cy, '#9aa6b2', 6, 100, 2);
        }
      }
    }
    if (def.phases && Math.random() < dt * .6) TB.audio.sfx('heartbeat');
    if (b.hp <= 0) bossDown();
  }

  // ---------- draw ----------
  G.lampNow = function () {
    const S = G.S, sub = G.sub, a = G.arms[0];
    const ang = S.control === 'arm' && a && G.mode === 'dive' ? a.ang : sub.tilt;
    return { x: sub.x - Math.sin(ang) * (HR - 8), y: sub.y + Math.cos(ang) * (HR - 8), ang: Math.PI / 2 + ang, mult: G.st ? G.st.lamp : 1, hx: sub.x, hy: sub.y };
  };
  G.draw = function () {
    const X = D.X, R = G.run, dive = G.mode === 'dive' && R;
    D.lights = G.lightsTimed.map(l => ({ x: l.x, y: l.y, r: l.r, a: l.a * (1 - l.t / l.life) }));
    D.creatureGlow = G.st ? G.st.glow : 0;
    const L = dive ? R.L : -15.5;
    X.save();
    if (G.shake > 0) X.translate((Math.random() - .5) * G.shake, (Math.random() - .5) * G.shake);
    D.drawWater(L, !!dive);
    const surfaceY = D.ANCHOR - L * D.PXM;
    if (surfaceY > -300) D.drawSurface(surfaceY, dive ? SW / 2 - 420 : 1100);
    if (!dive) {
      const top = surfaceY - 250 + Math.sin(D.T * 1.1) * 4;
      X.strokeStyle = '#141414'; X.lineWidth = 3; X.beginPath(); X.moveTo(1100 + 420, top); X.lineTo(G.sub.x, G.sub.y - HR - 10); X.stroke();
    }
    const pal = D.palAt(Math.max(0, L)).p;
    if (dive) {
      for (const n of R.nodes) {
        if (n.shake > 0) { n.shake -= 1 / 60; const ox = (Math.random() - .5) * 4, oy = (Math.random() - .5) * 4; n.x += ox; n.y += oy; D.drawThing(n, pal); n.x -= ox; n.y -= oy; }
        else D.drawThing(n, pal);
      }
      if (R.boss) D.drawBoss(R.boss);
      for (const k of G.inks) { X.fillStyle = 'rgba(30,6,24,' + (.85 * (1 - k.t / k.life)) + ')'; X.beginPath(); X.arc(k.x, k.y, k.r, 0, 6.28); X.fill(); }
      for (const p of G.shots) D.drawShot(p);
      G.drones.forEach(D.drawDrone);
      if (G.S.control === 'arm') G.arms.forEach((a, i) => D.drawArm(a, G.st, G.sub, i === 0));
      else G.arms.forEach((a, i) => { if (i > 0) D.drawArm(a, G.st, G.sub, false); });
      if (G.S.control === 'arm' && G.st.reach) {
        X.strokeStyle = 'rgba(255,236,190,.35)'; X.lineWidth = 1.5; const px = G.ptr.x, py = G.ptr.y;
        X.beginPath(); X.moveTo(px - 9, py); X.lineTo(px - 4, py); X.moveTo(px + 4, py); X.lineTo(px + 9, py); X.moveTo(px, py - 9); X.lineTo(px, py - 4); X.moveTo(px, py + 4); X.lineTo(px, py + 9); X.stroke();
      }
    }
    const st = G.st || TB.statsFor(G.S);
    const subDrill = !dive || G.S.control !== 'arm';
    if (dive && subDrill) { G.sub.heat = G.sub.heat || 0; }
    D.drawSub(G.sub, st, G.S, subDrill, dive ? R.alarm : 0);
    if (G.zaps) { X.strokeStyle = '#cfefff'; X.lineWidth = 2; for (const z of G.zaps) { X.beginPath(); X.moveTo(z.x1, z.y1); X.lineTo((z.x1 + z.x2) / 2 + rand(-12, 12), (z.y1 + z.y2) / 2 + rand(-12, 12)); X.lineTo(z.x2, z.y2); X.stroke(); z.t -= 1 / 60; } G.zaps = G.zaps.filter(z => z.t > 0); }
    for (const r of G.rings) { const t = r.t / r.life; X.globalAlpha = 1 - t; X.strokeStyle = r.color; X.lineWidth = r.w; X.beginPath(); X.arc(r.x, r.y, r.r + (r.max - r.r) * t, 0, 6.28); X.stroke(); }
    X.globalAlpha = 1;
    for (const p of G.parts) {
      X.globalAlpha = 1 - p.t / p.life; X.fillStyle = p.color;
      if (p.dust) { X.beginPath(); X.arc(p.x, p.y, p.size * (1 + p.t), 0, 6.28); X.fill(); continue; }
      X.save(); X.translate(p.x, p.y); X.rotate(p.rot + p.t * 4); X.fillRect(-p.size / 2, -p.size / 2, p.size, p.size); X.restore();
    }
    X.globalAlpha = 1;
    X.restore();
    if (dive) {
      const P = D.palAt(R.L), z = P.z;
      const dark = Math.max(0, P.dark - (G.st.adapt || 0));
      const lamp = G.lampNow();
      G.lamp = lamp;
      // the drill tip lights the water while it grinds
      const tips = [];
      if (G.S.control !== 'arm') tips.push([segOf(G.mainPose()), G.sub]);
      G.arms.forEach((a, i) => { if (i === 0 && G.S.control !== 'arm') return; tips.push([segOf({ x: a.ex, y: a.ey, ang: a.ang }), a]); });
      for (const [sg, a] of tips) if (a.grind > .1 || a.heat > .05) D.lights.push({ x: sg.bx, y: sg.by, r: 110 + a.heat * 70, a: Math.min(.9, .6 * a.grind + .4 * a.heat) });
      D.drawDark(dark, lamp, { red: z.i >= 7, flicker: z.i >= 7 });
      for (const n of R.nodes) if (n.isNew > 0) D.drawNewTag(n);
    }
    X.textAlign = 'center';
    for (const f of G.floats) {
      X.globalAlpha = Math.min(1, 2 * (1 - f.t / f.life));
      X.font = (f.size > 26 ? f.size + 'px ' + D.FONT.big : '700 ' + f.size + 'px ' + D.FONT.body);
      X.lineWidth = 4; X.strokeStyle = 'rgba(3,8,15,.6)'; X.strokeText(f.text, f.x, f.y);
      X.fillStyle = f.color; X.fillText(f.text, f.x, f.y);
    }
    X.globalAlpha = 1;
    if (dive) { if (R.boss) D.drawBossBar(R.boss); D.drawHud(G); }
  };
})();
