// Screens: title, dock (workshop tree, relics, logbook, map, stats, awards), settings, pause, endings.
(function () {
  const TB = globalThis.TB, G = TB.game, D = TB.draw;
  const $ = id => document.getElementById(id);
  const UI = TB.ui = {};
  const HEADS = ['Iron', 'Steel', 'Gold', 'Tungsten', 'Diamond', 'Obsidian', 'Hellforged', 'Heartstone'];
  const CUR = { cr: ['coin', 'credits'], sp: ['spec', 'specimens'], pe: ['pearl', 'pearls'] };
  const wallet = cur => cur === 'cr' ? G.S.cr : cur === 'sp' ? G.S.sp : G.S.pe;
  const lv = id => G.S.lv[id] || 0;
  let tab = 'workshop', lastReport = null;

  UI.show = id => { ['title', 'dock', 'ending'].forEach(s => { $(s).hidden = s !== id; }); $('cv').classList.toggle('playing', !id && G.mode === 'dive'); };
  UI.toast = (label, text) => {
    const t = document.createElement('div'); t.className = 'toast'; t.innerHTML = '<b>' + label + '</b> · ' + text;
    const box = $('toasts'); box.appendChild(t); while (box.children.length > 3) box.firstChild.remove(); setTimeout(() => t.remove(), 4200);
  };
  UI.save = () => TB.save(G.S);

  // ---------- title ----------
  UI.openTitle = function () {
    G.mode = 'title'; G.paused = false;
    $('demoBadge').hidden = !TB.DEMO;
    const has = G.S.dives > 0;
    $('btnPlay').textContent = has ? 'Continue' : 'Launch';
    $('btnNew').hidden = !has; $('btnNew').textContent = 'New game'; $('btnNew').classList.remove('danger');
    ['pause', 'settings', 'choice', 'demoEnd'].forEach(m => { $(m).hidden = true; });
    UI.show('title');
    TB.audio.setZone(0);
  };
  $('btnPlay').addEventListener('click', () => { TB.audio.unlock(); if (G.S.dives > 0) UI.openDock(null); else G.startDive(); });
  $('btnNew').addEventListener('click', e => {
    const b = e.currentTarget;
    if (!b.classList.contains('danger')) { b.classList.add('danger'); b.textContent = 'Erase save? Click again'; return; }
    TB.wipe(); G.S = TB.newSave(); UI.save(); UI.openTitle();
  });

  // ---------- dock ----------
  UI.onDiveStart = () => { ['pause', 'settings', 'choice', 'demoEnd'].forEach(m => { $(m).hidden = true; }); UI.show(null); };
  UI.onDiveEnd = report => { UI.openDock(report); UI.checkAch(); };
  UI.onDemoEnd = report => { UI.openDock(report); UI.checkAch(); $('demoEnd').hidden = false; };
  $('btnDemoOk').addEventListener('click', () => { $('demoEnd').hidden = true; });

  UI.openDock = function (report) {
    G.mode = 'dock'; G.paused = false; G.st = TB.statsFor(G.S);
    if (report !== undefined) lastReport = report;
    renderReport(lastReport);
    renderWallet();
    renderSubStats();
    syncCtl();
    const z = TB.zones[TB.startZone(G.S)];
    $('startLine').innerHTML = 'WINCH DROP · <b>' + TB.fmtDepth(z.from) + '</b> · ' + z.name.toUpperCase();
    $('nRelics').textContent = Object.keys(G.S.relics).length + '/' + TB.relics.length;
    $('nLog').textContent = Object.keys(TB.kinds).concat(Object.keys(TB.bosses)).filter(k => G.S.seen[k]).length + '/' + (Object.keys(TB.kinds).length + Object.keys(TB.bosses).length);
    $('nAch').textContent = Object.keys(G.S.ach).length + '/' + TB.achievements.length;
    UI.show('dock');
    setTab(tab);
    TB.audio.setZone(z.i);
    if (G.S.dives >= 1 && !G.S.tut.dock) { G.S.tut.dock = 1; tutorialTarget = 'drill1'; UI.toast('WORKSHOP', 'Click the Drill Motor to buy it, then launch again.'); }
  };

  function renderReport(r) {
    const S = G.S, h = $('rTitle');
    $('rNo').textContent = 'Nº ' + String(S.dives).padStart(2, '0');
    h.classList.remove('good');
    const rows = [];
    if (!r) {
      h.textContent = 'Docked';
      $('rHint').textContent = 'The Minnow is on the winch. Refit her, then launch.';
      rows.push(['Deepest ever', TB.fmtDepth(S.bestM)], ['Dives', S.dives]);
    } else {
      if (r.result) {
        h.textContent = r.result.boss + ' defeated'; h.classList.add('good');
        const next = TB.zones[r.result.zone.i + 1];
        const lim = TB.hullZones(S);
        $('rHint').textContent = !next ? '' : next.i < lim ? 'Next dive starts at ' + TB.fmtDepth(next.from) + ' in ' + next.name + '.' : 'Buy a Pressure Hull in the Hull & Oxygen branch to go deeper.';
      } else if (r.bossLeft != null) {
        h.textContent = 'Out of oxygen';
        $('rHint').textContent = 'The ' + TB.bosses[r.bossId].name + ' had ' + Math.ceil(r.bossLeft * 100) + '% left. ' + TB.bosses[r.bossId].hint;
      } else if (r.atLimit) {
        h.textContent = 'Hull limit';
        $('rHint').textContent = 'The Minnow cannot go deeper. Buy the next Pressure Hull with Pearls.';
      } else {
        h.textContent = 'Out of oxygen';
        const z = r.zone, boss = TB.bosses[z.boss];
        $('rHint').textContent = Math.round((1 - (r.L - z.L0) / TB.ZONE_LEN) * 100) + '% of ' + z.name + ' left above the ' + boss.name + '. Oxygen and Ballast get you deeper; the Drill pays for them.';
      }
      rows.push(['Depth reached', TB.fmtDepth(TB.metersAtL(r.L))], ['Credits', '+' + TB.fmt(r.cr)]);
      if (r.sp) rows.push(['Specimens', '+' + r.sp]);
      if (r.pe) rows.push(['Pearls', '+' + r.pe]);
      if (r.market) rows.push(['Black market', '+' + TB.fmt(r.market)]);
      rows.push(['Targets broken', r.broken]);
      if (r.relics && r.relics.length) rows.push(['Relics', r.relics.map(id => TB.relicById[id].name).join(', ')]);
    }
    $('rRows').innerHTML = rows.map(([a, b]) => '<div><dt>' + a + '</dt><dd>' + b + '</dd></div>').join('');
  }
  function renderWallet() {
    const S = G.S;
    $('wCr').textContent = TB.fmt(S.cr);
    $('wSp').hidden = !(lv('bio1') || S.sp); $('wSpN').textContent = TB.fmt(S.sp);
    $('wPe').hidden = !(S.pe || S.beaten.length); $('wPeN').textContent = TB.fmt(S.pe);
  }
  function renderSubStats() {
    const st = G.st = TB.statsFor(G.S);
    const rows = [['Drill', TB.fmt(st.dps) + ' dmg/s'], ['Drill head', HEADS[st.head]], ['Oxygen', st.air.toFixed(1) + ' s'], ['Sink speed', st.fins.toFixed(2)], ['Credit bonus', '×' + st.coinMult.toFixed(2)]];
    if (st.arms > 1) rows.push(['Drill arms', st.arms]);
    if (st.drones) rows.push(['Drones', st.drones]);
    $('subStats').innerHTML = rows.map(([a, b]) => '<div><span>' + a + '</span><b>' + b + '</b></div>').join('');
  }

  function syncCtl() { document.querySelectorAll('.ctl button').forEach(b => b.classList.toggle('on', b.dataset.ctl === G.S.control)); }
  document.querySelectorAll('.ctl button').forEach(b => b.addEventListener('click', () => { G.S.control = b.dataset.ctl; UI.save(); syncCtl(); }));
  $('btnDive').addEventListener('click', () => { TB.audio.unlock(); G.startDive(); });
  $('btnMenu').addEventListener('click', UI.openTitle);

  function setTab(t) {
    tab = t;
    document.querySelectorAll('.tab').forEach(b => b.classList.toggle('on', b.dataset.tab === t));
    ['workshop', 'relics', 'logbook', 'map', 'stats', 'ach'].forEach(p => { $('p-' + p).hidden = p !== t; });
    if (t === 'workshop') { sizeTree(); drawTree(); tipFor(hover || byId(lastPick)); }
    if (t === 'relics') renderRelics();
    if (t === 'logbook') renderLogbook();
    if (t === 'map') renderMap();
    if (t === 'stats') renderStats();
    if (t === 'ach') renderAch();
  }
  document.querySelectorAll('.tab').forEach(b => b.addEventListener('click', () => setTab(b.dataset.tab)));

  // ---------- workshop tree ----------
  const T = TB.tree, byId = id => T.byId[id];
  const tcv = $('treeCv'), tctx = tcv.getContext('2d');
  let hover = null, lastPick = 'drill1', tutorialTarget = null, drag = null, W = 1180, H = 834;
  // radial layout: each branch gets a slice sized by how many leaves it has
  const pos = {};
  (function layout() {
    const kids = T.kids, leaves = n => (kids[n.id] || []).reduce((a, c) => a + leaves(c), 0) || 1;
    const order = ['drill', 'systems', 'ancient', 'biology', 'salvage', 'hull'];
    const roots = order.flatMap(b => kids.core.filter(n => n.branch === b));
    const total = roots.reduce((a, r) => a + leaves(r), 0), gap = 6 * Math.PI / 180, R = d => d ? 90 + d * 140 : 0;
    pos.core = { x: 0, y: 0, a: 0 };
    const place = (n, a0, a1, d) => {
      const a = (a0 + a1) / 2; pos[n.id] = { x: Math.cos(a) * R(d), y: Math.sin(a) * R(d), a };
      let cur = a0; const span = a1 - a0, L = leaves(n);
      (kids[n.id] || []).forEach(c => { const w = span * leaves(c) / L; place(c, cur, cur + w, d + 1); cur += w; });
    };
    let start = -Math.PI / 2 - Math.PI * leaves(roots[0]) / total;
    roots.forEach(r => { const w = (2 * Math.PI - gap * roots.length) * leaves(r) / total; place(r, start + gap / 2, start + gap / 2 + w, 1); start += w + gap; });
  })();
  const cam = () => G.S.cam || (G.S.cam = { x: 0, y: 0, z: .8 });

  function vis(n) {
    if (n.id === 'core') return 'owned';
    const p = byId(n.parent), pv = vis(p);
    if (lv(p.id) > 0) return lv(n.id) > 0 ? 'owned' : TB.gateMet(G.S, n.gate) ? 'avail' : 'gated';
    if (pv === 'avail' || pv === 'gated') return 'ghost';
    return null;
  }
  const canBuy = n => vis(n) !== 'gated' && vis(n) !== 'ghost' && lv(n.id) < n.max && wallet(n.cur) >= T.cost(n, lv(n.id));

  function sizeTree() {
    const r = tcv.getBoundingClientRect(), k = TB.stageK || 1, dpr = Math.min(2, devicePixelRatio || 1);
    W = r.width / k || 1180; H = r.height / k || 834;
    tcv.width = Math.round(W * k * dpr); tcv.height = Math.round(H * k * dpr);
    tctx.setTransform(k * dpr, 0, 0, k * dpr, 0, 0);
  }
  function toWorld(sx, sy) { const c = cam(); return { x: (sx - W / 2) / c.z - c.x, y: (sy - H / 2) / c.z - c.y }; }
  function nodeAt(sx, sy) {
    const w = toWorld(sx, sy);
    let best = null, bd = 30;
    for (const n of T.nodes) { if (!vis(n)) continue; const p = pos[n.id], d = Math.hypot(p.x - w.x, p.y - w.y); if (d < bd) { bd = d; best = n; } }
    return best;
  }

  function drawTree() {
    if ($('p-workshop').hidden) return;
    const X = tctx, c = cam(), t = performance.now() / 1000;
    X.clearRect(0, 0, W, H);
    X.save(); X.translate(W / 2, H / 2); X.scale(c.z, c.z); X.translate(c.x, c.y);
    for (let d = 1; d <= 9; d++) { X.strokeStyle = 'rgba(140,190,255,.07)'; X.lineWidth = 1 / c.z; X.beginPath(); X.arc(0, 0, 90 + d * 140, 0, 6.28); X.stroke(); }
    for (const n of T.nodes) {
      const v = vis(n); if (!v || !n.parent) continue;
      const p = pos[n.parent], q = pos[n.id], col = T.branches[n.branch].color;
      X.strokeStyle = col; X.globalAlpha = v === 'owned' ? .85 : v === 'avail' ? .6 : .25; X.lineWidth = v === 'owned' ? 5 : 3;
      X.setLineDash(v === 'ghost' || v === 'gated' ? [8, 8] : []);
      X.beginPath(); X.moveTo(p.x, p.y); X.lineTo(q.x, q.y); X.stroke();
    }
    X.setLineDash([]); X.globalAlpha = 1;
    for (const n of T.nodes) {
      const v = vis(n); if (!v) continue;
      const p = pos[n.id], col = T.branches[n.branch].color, l = lv(n.id), can = canBuy(n), r = n.id === 'core' ? 38 : 24;
      X.save(); X.translate(p.x, p.y);
      if (n.id === 'core') {
        X.fillStyle = '#f0b429'; X.beginPath(); X.arc(0, 0, r, 0, 6.28); X.fill(); X.strokeStyle = '#3f2b06'; X.lineWidth = 3; X.stroke();
        X.fillStyle = '#7b8288'; X.beginPath(); X.arc(0, -4, 15, 0, 6.28); X.fill(); X.fillStyle = '#4fb6c7'; X.beginPath(); X.arc(0, -4, 11, 0, 6.28); X.fill();
        X.fillStyle = '#b7c1c9'; X.beginPath(); X.moveTo(-9, r - 2); X.lineTo(9, r - 2); X.lineTo(0, r + 22); X.fill();
        X.restore(); continue;
      }
      const shape = () => { X.beginPath(); if (n.max === 1) { X.moveTo(0, -r * 1.2); X.lineTo(r * 1.2, 0); X.lineTo(0, r * 1.2); X.lineTo(-r * 1.2, 0); X.closePath(); } else X.arc(0, 0, r, 0, 6.28); };
      if (can) { X.shadowColor = col; X.shadowBlur = 16 + Math.sin(t * 4) * 6; }
      shape(); X.fillStyle = v === 'owned' ? TB.css(TB.shade(TB.hex(col), -.65)) : v === 'avail' ? '#0c2644' : '#081a30'; X.fill();
      X.shadowBlur = 0;
      X.strokeStyle = v === 'ghost' || v === 'gated' ? 'rgba(143,179,196,.4)' : col; X.lineWidth = 3;
      X.setLineDash(v === 'ghost' ? [5, 5] : []); shape(); X.stroke(); X.setLineDash([]);
      if (v === 'owned' && n.max > 1 && l < n.max) { X.strokeStyle = col; X.lineWidth = 6; X.beginPath(); X.arc(0, 0, r + 6, -Math.PI / 2, -Math.PI / 2 + 6.283 * l / n.max); X.stroke(); }
      if (v === 'owned' && l >= n.max) { X.strokeStyle = col; X.lineWidth = 6; X.beginPath(); X.arc(0, 0, r + 6, 0, 6.283); X.stroke(); }
      X.textAlign = 'center'; X.textBaseline = 'middle';
      if (v === 'ghost') { X.fillStyle = 'rgba(143,179,196,.6)'; X.font = '22px ' + D.FONT.big; X.fillText('?', 0, 1); }
      else if (v === 'gated') { lock(X); }
      else { X.fillStyle = '#f4efe2'; X.font = '600 14px ' + D.FONT.mono; X.fillText(n.max === 1 ? (l ? '★' : '☆') : l >= n.max ? 'MAX' : l + '/' + n.max, 0, 1); }
      if (tutorialTarget === n.id && l === 0) { X.strokeStyle = '#f0b429'; X.lineWidth = 3; X.beginPath(); X.arc(0, 0, r + 14 + Math.sin(t * 5) * 5, 0, 6.28); X.stroke(); }
      if (hover === n) { X.strokeStyle = '#f4efe2'; X.lineWidth = 2; X.setLineDash([4, 4]); X.beginPath(); X.arc(0, 0, r + 12, 0, 6.28); X.stroke(); X.setLineDash([]); }
      X.textBaseline = 'alphabetic';
      if (c.z >= .55 && v !== 'ghost') {
        X.font = '13px ' + D.FONT.mono; X.fillStyle = v === 'gated' ? 'rgba(143,179,196,.6)' : '#c9dbef';
        X.lineWidth = 4; X.strokeStyle = '#0a2340'; X.strokeText(n.name, 0, r + 26); X.fillText(n.name, 0, r + 26);
        if (v === 'avail' || (v === 'owned' && l < n.max)) {
          const cst = T.cost(n, l), aff = wallet(n.cur) >= cst;
          X.fillStyle = aff ? (n.cur === 'cr' ? '#f6c453' : n.cur === 'sp' ? '#7be08a' : '#e8e2ff') : 'rgba(143,179,196,.7)';
          X.strokeText(TB.fmt(cst) + ' ' + CUR[n.cur][1], 0, r + 42); X.fillText(TB.fmt(cst) + ' ' + CUR[n.cur][1], 0, r + 42);
        }
      }
      X.restore();
    }
    X.restore();
  }
  function lock(X) {
    X.fillStyle = 'rgba(255,122,89,.85)'; X.fillRect(-8, -3, 16, 12);
    X.strokeStyle = 'rgba(255,122,89,.85)'; X.lineWidth = 2.5; X.beginPath(); X.arc(0, -4, 5.5, Math.PI, 0); X.stroke();
  }
  function tipFor(n) {
    const el = $('tip');
    if (!n || !vis(n)) { el.innerHTML = '<b>Workshop</b><span class="fx">Point at a part to see what it does. Buying a part reveals the parts connected to it.</span>'; return; }
    const b = T.branches[n.branch], v = vis(n), l = lv(n.id);
    if (n.id === 'core') { el.innerHTML = '<span class="br" style="color:' + b.color + '">' + b.name + '</span><b>The Minnow</b><span class="fx">Your sub. Every branch grows out of it.</span>'; return; }
    if (v === 'ghost') { el.innerHTML = '<span class="br" style="color:' + b.color + '">' + b.name + '</span><b>Unknown part</b><span class="fx">Buy ' + byId(n.parent).name + ' to reveal it.</span>'; return; }
    let cost;
    if (v === 'gated') cost = '<span class="cost lock">Locked · ' + T.GATES[n.gate] + '</span>';
    else if (l >= n.max) cost = '<span class="cost no">Fully upgraded</span>';
    else { const c = T.cost(n, l), aff = wallet(n.cur) >= c; cost = '<span class="cost' + (aff ? '' : ' no') + '"><i class="' + CUR[n.cur][0] + '"></i> ' + TB.fmt(c) + ' ' + CUR[n.cur][1] + (aff ? ' · click to buy' : ' · need ' + TB.fmt(c - wallet(n.cur)) + ' more') + '</span>'; }
    el.innerHTML = '<span class="br" style="color:' + b.color + '">' + b.name + '</span><b>' + n.name + '</b><span class="fx">' + n.fx + (n.max > 1 ? ' (per level)' : '') + '</span>' +
      '<span class="lv">Level ' + l + ' of ' + n.max + '</span>' + cost;
  }
  function buy(n, max) {
    let bought = 0;
    const before = new Set(T.nodes.filter(x => vis(x)).map(x => x.id));
    while (canBuy(n)) {
      const c = T.cost(n, lv(n.id));
      if (n.cur === 'cr') G.S.cr -= c; else if (n.cur === 'sp') G.S.sp -= c; else G.S.pe -= c;
      G.S.lv[n.id] = lv(n.id) + 1; bought++;
      if (!max) break;
    }
    if (!bought) { TB.audio.sfx('no'); return; }
    TB.audio.sfx('buy'); lastPick = n.id;
    if (tutorialTarget === n.id) tutorialTarget = null;
    const revealed = T.nodes.filter(x => vis(x) && !before.has(x.id));
    if (revealed.length) UI.toast('NEW PARTS', revealed.map(x => x.name).join(', '));
    if (n.id.startsWith('press')) UI.toast('HULL', 'The winch can now go deeper.');
    UI.save(); UI.checkAch();
    renderWallet(); renderSubStats();
    const z = TB.zones[TB.startZone(G.S)];
    $('startLine').innerHTML = 'WINCH DROP · <b>' + TB.fmtDepth(z.from) + '</b> · ' + z.name.toUpperCase();
    tipFor(n); drawTree();
  }
  const local = e => { const r = tcv.getBoundingClientRect(), k = TB.stageK || 1; return { x: (e.clientX - r.left) / k, y: (e.clientY - r.top) / k }; };
  tcv.addEventListener('pointerdown', e => { const p = local(e); drag = { x: p.x, y: p.y, moved: false }; tcv.setPointerCapture(e.pointerId); });
  tcv.addEventListener('pointermove', e => {
    const p = local(e);
    if (drag) {
      const dx = p.x - drag.x, dy = p.y - drag.y;
      if (drag.moved || Math.hypot(dx, dy) > 5) { drag.moved = true; tcv.classList.add('drag'); const c = cam(); c.x += dx / c.z; c.y += dy / c.z; drag.x = p.x; drag.y = p.y; drawTree(); }
      return;
    }
    const n = nodeAt(p.x, p.y);
    if (n !== hover) { hover = n; tipFor(n || byId(lastPick)); drawTree(); }
  });
  tcv.addEventListener('pointerup', e => {
    tcv.classList.remove('drag');
    if (drag && !drag.moved) { const p = local(e), n = nodeAt(p.x, p.y); if (n && n.id !== 'core') buy(n, e.shiftKey); }
    if (drag && drag.moved) UI.save();
    drag = null;
  });
  tcv.addEventListener('pointerleave', () => { hover = null; drawTree(); });
  tcv.addEventListener('wheel', e => {
    e.preventDefault();
    const c = cam(), p = local(e), before = toWorld(p.x, p.y);
    c.z = TB.clamp(c.z * (e.deltaY < 0 ? 1.12 : 1 / 1.12), .3, 2);
    const after = toWorld(p.x, p.y); c.x += after.x - before.x; c.y += after.y - before.y;
    drawTree();
  }, { passive: false });
  $('zIn').addEventListener('click', () => { cam().z = Math.min(2, cam().z * 1.2); drawTree(); });
  $('zOut').addEventListener('click', () => { cam().z = Math.max(.3, cam().z / 1.2); drawTree(); });
  $('zHome').addEventListener('click', () => { G.S.cam = { x: 0, y: 0, z: .8 }; drawTree(); });
  UI.tickTree = () => { if (G.mode === 'dock' && tab === 'workshop') drawTree(); };
  UI.resize = () => { if (G.mode === 'dock' && tab === 'workshop') { sizeTree(); drawTree(); } };

  // ---------- relics ----------
  function relicSource(r) {
    if (TB.bosses[r.from]) return 'Dropped by ' + TB.bosses[r.from].name;
    const z = TB.zones.find(z => z.id === r.from);
    return 'Found in caches in ' + (z ? z.name : 'the deep');
  }
  function renderRelics() {
    $('relicGrid').innerHTML = TB.relics.map(r => {
      const rank = G.S.relics[r.id] || 0;
      if (!rank) return '<div class="card off"><b>???</b><span class="meta">' + relicSource(r) + '</span></div>';
      return '<div class="card"><b>' + r.name + ' <span class="rank">' + ['', 'I', 'II', 'III'][rank] + '</span></b><span class="fx">' + r.text + (rank > 1 ? ' · ×' + TB.RANK_MULT[rank] : '') + '</span>' +
        (r.desc ? '<span class="desc">' + r.desc + '</span>' : '<span class="desc">Read it in the Logbook.</span>') + '<span class="meta">' + relicSource(r) + '</span></div>';
    }).join('');
  }

  // ---------- logbook ----------
  function renderLogbook() {
    const box = $('specGrid'); box.innerHTML = '';
    const entries = Object.keys(TB.kinds).map(k => ['k', k]).concat(Object.keys(TB.bosses).map(b => ['b', b]));
    const saveX = D.X, saveLights = D.lights;
    for (const [type, id] of entries) {
      const known = !!G.S.seen[id], def = type === 'k' ? TB.kinds[id] : TB.bosses[id];
      const card = document.createElement('div'); card.className = 'card' + (known ? '' : ' off');
      const c = document.createElement('canvas'); c.width = 440; c.height = 260; card.appendChild(c);
      card.insertAdjacentHTML('beforeend', '<b>' + (known ? def.name : 'Unknown') + '</b><span class="desc">' + (known ? def.desc : 'Not seen yet.') + '</span>');
      box.appendChild(card);
      const tc = c.getContext('2d'); D.X = tc; D.lights = [];
      tc.scale(2, 2); tc.translate(110, 70);
      try {
        if (type === 'b') { tc.scale(.4, .4); D.drawBoss({ id, def, x: 0, y: 0, t: 1, phaseT: 1, open: true, hit: 0, face: 1, hp: 1, max: 1, trail: [], shield: 0, shieldMax: 0, eyes: 5 }, true); }
        else {
          tc.scale(1.4, 1.4);
          const n = { k: def, id, s: (def.size[0] + def.size[1]) / 2, x: 0, y: 0, vx: 60, vy: 0, rot: .3, ph: 1, hit: 0, hp: 1, max: 1, burst: 0, hide: 0,
            verts: Array.from({ length: 9 }, (_, i) => [i / 9 * 6.283, .85 + (i % 3) * .08]), spots: [[.2, .1, .1], [-.3, .3, .08]], crack: [[0, .3, .6], [2, 2.3, .6], [4, 4.3, .6]], shards: [[.4, 1.2, 6], [2.2, 1.1, 5], [3.8, 1.3, 6], [5.2, 1, 5]] };
          D.drawThing(n, TB.zones[3].palA.map((c, i) => i === 4 ? TB.hex('#8b8173') : c));
        }
      } catch (e) {}
      if (!known) { tc.setTransform(1, 0, 0, 1, 0, 0); tc.globalCompositeOperation = 'source-atop'; tc.fillStyle = '#0c2745'; tc.fillRect(0, 0, 440, 260); tc.globalCompositeOperation = 'source-over'; }
    }
    D.X = saveX; D.lights = saveLights;
    $('heronLogs').innerHTML = [1, 2, 3, 4, 5, 6].map(i => G.S.relics['heron' + i] ? '<div class="heron">' + TB.heronLogs['heron' + i] + '</div>' : '<div class="heron" style="opacity:.5">Log ' + ['I', 'II', 'III', 'IV', 'V', 'VI'][i - 1] + ' · not found yet. ' + relicSource(TB.relicById['heron' + i]) + '.</div>').join('');
    const texts = G.S.heard.map(radioText).filter(Boolean);
    $('radioLog').innerHTML = texts.length ? texts.map(t => '<div>' + t + '</div>').join('') : '<div>No transmissions yet.</div>';
  }
  function radioText(key) {
    let m = /^z(\d)([end])$/.exec(key);
    if (m) return TB.radio.zone[+m[1]][{ e: 'enter', n: 'near', d: 'down' }[m[2]]];
    if (key.startsWith('f_')) return TB.radio.first[key.slice(2)];
    if (key === 'hull') return TB.radio.hullLimit;
    if (key === 'firstBoss') return TB.radio.firstBoss;
    return null;
  }

  // ---------- map, stats, awards ----------
  function renderMap() {
    const S = G.S, lim = TB.hullZones(S), start = TB.startZone(S);
    $('mapList').innerHTML = TB.zones.map((z, i) => {
      const reached = S.bestL >= z.L0 || i === 0, boss = TB.bosses[z.boss], beat = S.beaten.includes(z.boss);
      let note = !reached ? 'Unexplored' : 'Explored';
      if (i === start) note = 'The winch drops you here next dive';
      if (i >= lim) note = 'Needs Pressure Hull ' + ['I', 'II', 'III', 'IV', 'V', 'VI'][i - 3];
      if (TB.DEMO && i > 1) note = 'Not in the demo';
      const col = ['#2a7fa0', '#2c7a5c', '#3b4f9a', '#5a6a76', '#c85a2a', '#3aa08a', '#8a7ae0', '#c82a2a', '#ff3a6a'][i];
      return '<div class="z' + (reached || i <= lim - 1 ? '' : ' locked') + '"><div class="d">' + TB.fmtDepth(z.from) + '</div><div class="info" style="--c:' + col + '"><b>' + (reached ? z.name : '???') + '</b><span class="boss' + (beat ? ' done' : '') + '">' + (reached ? (beat ? '✓ ' : '') + boss.name : '') + '</span><span class="note">' + note + '</span></div></div>';
    }).join('');
  }
  function renderStats() {
    const S = G.S, owned = Object.keys(S.lv).filter(k => k !== 'core' && S.lv[k] > 0).length;
    const rows = [['Dives', S.dives], ['Time played', TB.fmtTime(S.play)], ['Deepest point', TB.fmtDepth(S.bestM)], ['Bosses beaten', S.beaten.length + ' / 9'],
      ['Parts owned', owned + ' / ' + (T.nodes.length - 1)], ['Relics', Object.keys(S.relics).length + ' / ' + TB.relics.length], ['Targets broken', TB.fmt(S.broken)],
      ['Air pockets popped', TB.fmt(S.bubbles)], ['Lucky finds', S.luckies], ['Awards', Object.keys(S.ach).length + ' / ' + TB.achievements.length],
      ['Endings seen', S.endings.length ? S.endings.join(', ') : 'none'], ['New Dive+', S.ng ? 'level ' + S.ng : 'not started']];
    if (S.endTime) rows.push(['First ending reached in', TB.fmtTime(S.endTime)]);
    $('statList').innerHTML = rows.map(([a, b]) => '<div><dt>' + a + '</dt><dd>' + b + '</dd></div>').join('');
  }
  function renderAch() {
    $('achGrid').innerHTML = TB.achievements.map(a => '<div class="card' + (G.S.ach[a.id] ? ' got' : ' off') + '"><b>' + a.name + '</b><span class="desc">' + a.desc + '</span></div>').join('');
  }
  UI.checkAch = function () {
    for (const a of TB.achievements) {
      if (G.S.ach[a.id]) continue;
      let ok = false; try { ok = a.test(G.S); } catch (e) {}
      if (ok) { G.S.ach[a.id] = Date.now(); UI.toast('AWARD', a.name); TB.audio.sfx('achieve'); }
    }
    UI.save();
  };

  // ---------- pause ----------
  UI.setPause = function (on) {
    if (G.mode !== 'dive' || !G.run || G.run.ending > 0) return;
    G.paused = on; $('pause').hidden = !on; syncCtl();
    $('cv').classList.toggle('playing', !on);
    if (on) TB.audio.motor(false, 0);
  };
  $('btnResume').addEventListener('click', () => UI.setPause(false));
  $('btnSurface').addEventListener('click', () => { UI.setPause(false); G.run.air = 0; G.run.emergencyUsed = 1; });

  // ---------- settings ----------
  function openSettings() {
    const s = TB.settings;
    $('sMaster').value = s.master; $('sMusic').value = s.music; $('sSfx').value = s.sfx;
    $('sNotation').value = s.notation; $('sShake').value = String(s.shake); $('sParticles').value = String(s.particles);
    $('saveCode').value = TB.exportSave(G.S); $('importCode').value = ''; $('importMsg').textContent = '';
    $('btnWipe').textContent = 'Erase all progress'; $('btnWipe').classList.add('danger');
    $('settings').hidden = false;
  }
  ['btnSettings1', 'btnSettings2', 'btnSettings3'].forEach(id => $(id).addEventListener('click', openSettings));
  const applySettings = () => {
    const s = TB.settings;
    s.master = +$('sMaster').value; s.music = +$('sMusic').value; s.sfx = +$('sSfx').value;
    s.notation = $('sNotation').value; s.shake = +$('sShake').value; s.particles = +$('sParticles').value;
    TB.saveSettings(s); TB.audio.applyVolumes();
  };
  ['sMaster', 'sMusic', 'sSfx', 'sNotation', 'sShake', 'sParticles'].forEach(id => $(id).addEventListener('input', applySettings));
  $('sFull').addEventListener('click', () => { try { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen(); } catch (e) {} });
  $('btnCopy').addEventListener('click', () => {
    const ta = $('saveCode');
    Promise.resolve().then(() => navigator.clipboard.writeText(ta.value)).then(() => { $('btnCopy').textContent = 'Copied'; }).catch(() => { ta.focus(); ta.select(); $('btnCopy').textContent = 'Press Ctrl+C'; });
  });
  $('btnImport').addEventListener('click', () => {
    const S = TB.importSave($('importCode').value);
    if (!S) { $('importMsg').textContent = 'That code did not work. Copy the whole code and try again.'; return; }
    G.S = S; UI.save(); $('importMsg').textContent = 'Save loaded.'; $('saveCode').value = TB.exportSave(G.S);
    if (G.mode === 'dock') UI.openDock(null);
  });
  $('btnWipe').addEventListener('click', e => {
    const b = e.currentTarget;
    if (b.textContent !== 'Click again to erase') { b.textContent = 'Click again to erase'; return; }
    TB.wipe(); G.S = TB.newSave(); UI.save(); $('settings').hidden = true; UI.openTitle();
  });
  $('btnCloseSet').addEventListener('click', () => { $('settings').hidden = true; if (G.mode === 'dock') UI.openDock(); });

  // ---------- the Heart and the endings ----------
  const hasAllLogs = () => [1, 2, 3, 4, 5, 6].every(i => G.S.relics['heron' + i]);
  UI.onHeart = function () {
    UI.save();
    if (hasAllLogs()) { $('choice').hidden = false; $('cv').classList.remove('playing'); }
    else UI.ending('break');
  };
  $('btnSeal').addEventListener('click', () => { $('choice').hidden = true; UI.ending('seal'); });
  $('btnBreak').addEventListener('click', () => { $('choice').hidden = true; UI.ending('break'); });
  UI.ending = function (kind) {
    const S = G.S, E = TB.endings[kind];
    G.mode = 'ending';
    if (!S.endings.includes(kind)) S.endings.push(kind);
    if (!S.endTime) S.endTime = S.play;
    UI.save(); UI.checkAch();
    TB.audio.setZone(kind === 'seal' ? 0 : 8);
    const el = $('ending'); el.className = 'screen ' + kind;
    $('endKicker').textContent = kind === 'seal' ? 'TRUE ENDING' : 'ENDING';
    $('endTitle').textContent = E.title;
    $('endLines').innerHTML = E.lines.map(l => '<p>' + l + '</p>').join('');
    $('credits').hidden = true; $('endBtns').hidden = true;
    $('endStats').textContent = '';
    UI.show('ending');
    const ps = [...$('endLines').children];
    ps.forEach((p, i) => setTimeout(() => p.classList.add('on'), 600 + i * 2200));
    setTimeout(() => {
      $('credits').innerHTML = TB.credits.map(([a, b]) => '<span>' + a + '</span><span>' + b + '</span>').join('');
      $('credits').hidden = false;
      $('endStats').textContent = S.dives + ' dives · ' + TB.fmtTime(S.play) + ' played · ' + Object.keys(S.relics).length + ' relics' + (kind === 'break' && !hasAllLogs() ? ' · Find all six Heron logs to see the other ending.' : '');
      $('endBtns').hidden = false;
    }, 600 + ps.length * 2200 + 800);
  };
  $('btnKeep').addEventListener('click', () => UI.openDock(null));
  $('btnNG').addEventListener('click', () => {
    const S = G.S;
    S.ng++; S.lv = { core: 1 }; S.cr = 0; S.sp = 0; S.pe = 0; S.beaten = []; S.bestL = 0; S.cam = null;
    UI.save(); UI.toast('NEW DIVE+', 'Level ' + S.ng + ': relics kept, everything is tougher and pays more.');
    UI.openDock(null);
  });
})();
