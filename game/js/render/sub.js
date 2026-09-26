// The Minnow: hull, drill arms, drill heads, drones and weapons.
(function () {
  const TB = globalThis.TB;
  const D = TB.draw;
  D.HR = 44;
  // [dark edge, body, highlight, flute edge] for each drill head, iron to heartstone
  D.HEADS = [
    ['#3a3e42', '#7d858c', '#c4ccd2', '#9aa2a9'], ['#3b434a', '#9aa5ae', '#e9eef2', '#c8ced3'], ['#6a4a0a', '#d9a441', '#ffe58c', '#fff0b0'],
    ['#1c1f23', '#5d656d', '#aab3bb', '#d9a441'], ['#12505c', '#8ff0ff', '#e6fdff', '#bff8ff'], ['#0b0b12', '#3a2e4a', '#8a7aa8', '#b89aff'],
    ['#3a0a04', '#c83a10', '#ff9a4a', '#ffd08a'], ['#3a0a1a', '#c8284a', '#ff8aa0', '#ffd0dc'],
  ];
  D.drillLen = st => 56 + st.radius * .9;
  D.drillHalf = st => 15 + st.radius * .34;

  // a drill head pointing down from (0, yb) in the current transform
  D.drawDrillHead = function (st, sub, yb, heat, grind, spin) {
    const X = D.X, len = D.drillLen(st), hw = D.drillHalf(st), tipY = yb + len, mat = D.HEADS[st.head];
    X.save();
    if (grind > .1) X.translate((Math.random() - .5) * 2.4 * grind, (Math.random() - .5) * 2.4 * grind);
    X.fillStyle = '#15191c'; X.fillRect(-hw * .6, yb - 5, hw * 1.2, 7);
    const head = () => { X.beginPath(); X.moveTo(-hw, yb); X.lineTo(hw, yb); X.quadraticCurveTo(hw * .92, yb + len * .55, 0, tipY); X.quadraticCurveTo(-hw * .92, yb + len * .55, -hw, yb); X.closePath(); };
    head();
    const g = X.createLinearGradient(-hw, 0, hw, 0);
    g.addColorStop(0, mat[0]); g.addColorStop(.3, mat[1]); g.addColorStop(.42, mat[2]); g.addColorStop(.62, mat[1]); g.addColorStop(1, mat[0]);
    X.fillStyle = g; X.fill();
    X.save(); head(); X.clip();
    for (let i = 0; i < 6; i++) {
      const f = ((i / 6) + spin) % 1, y = yb + f * len, w = hw * Math.pow(1 - f, .8) + 2, tw = w * .55;
      X.strokeStyle = 'rgba(0,0,0,.55)'; X.lineWidth = 6 * (1 - f * .6);
      X.beginPath(); X.moveTo(-w - 2, y + tw); X.quadraticCurveTo(0, y + tw * .1, w + 2, y - tw); X.stroke();
      X.strokeStyle = mat[3]; X.globalAlpha = .7; X.lineWidth = 1.5;
      X.beginPath(); X.moveTo(-w - 2, y + tw + 4); X.quadraticCurveTo(0, y + tw * .1 + 4, w + 2, y - tw + 4); X.stroke();
      X.globalAlpha = 1;
    }
    if (heat > .02) {
      const hg = X.createLinearGradient(0, yb + len * .35, 0, tipY);
      hg.addColorStop(0, 'rgba(255,110,30,0)'); hg.addColorStop(1, 'rgba(255,140,50,' + (heat * .85) + ')');
      X.fillStyle = hg; X.fillRect(-hw, yb, 2 * hw, len);
    }
    X.restore();
    head(); X.strokeStyle = 'rgba(0,0,0,.6)'; X.lineWidth = 1.5; X.stroke();
    X.fillStyle = heat > .5 ? '#ffd7a0' : mat[3];
    X.beginPath(); X.moveTo(-hw * .22, tipY - len * .16); X.lineTo(hw * .22, tipY - len * .16); X.lineTo(0, tipY + 2); X.closePath(); X.fill();
    if (grind > .1) { X.fillStyle = 'rgba(255,236,190,' + grind * .9 + ')'; X.beginPath(); X.arc(0, tipY, 5 + Math.random() * 4, 0, 6.28); X.fill(); }
    X.restore();
  };

  D.drawArm = function (arm, st, sub, main) {
    const X = D.X, segs = [[arm.sx, arm.sy, arm.elx, arm.ely], [arm.elx, arm.ely, arm.ex, arm.ey]];
    X.lineCap = 'round';
    for (const [w, col] of [[18, '#161b1f'], [11, main ? '#d99a1e' : '#b8801a']]) {
      X.strokeStyle = col; X.lineWidth = w;
      for (const [a, b, c, d] of segs) { X.beginPath(); X.moveTo(a, b); X.lineTo(c, d); X.stroke(); }
    }
    X.strokeStyle = 'rgba(200,210,220,.7)'; X.lineWidth = 3;
    X.beginPath(); X.moveTo(arm.sx + (arm.elx - arm.sx) * .15, arm.sy + (arm.ely - arm.sy) * .15 - 7); X.lineTo(arm.sx + (arm.elx - arm.sx) * .8, arm.sy + (arm.ely - arm.sy) * .8 - 7); X.stroke();
    for (const [x, y] of [[arm.sx, arm.sy], [arm.elx, arm.ely], [arm.ex, arm.ey]]) {
      X.fillStyle = '#39434b'; X.beginPath(); X.arc(x, y, 10, 0, 6.28); X.fill();
      X.fillStyle = '#9aa5ae'; X.beginPath(); X.arc(x, y, 3.5, 0, 6.28); X.fill();
    }
    X.save(); X.translate(arm.ex, arm.ey); X.rotate(arm.ang);
    const hw = D.drillHalf(st);
    X.fillStyle = '#23292e'; X.fillRect(-hw * .8, -16, hw * 1.6, 14);
    X.fillStyle = '#3c454c'; X.fillRect(-hw * .8, -16, hw * 1.6, 4);
    D.drawDrillHead(st, sub, 0, arm.heat, arm.grind, arm.spin);
    X.restore();
  };

  D.drawSub = function (sub, st, S, showDrill, alarm) {
    const X = D.X, hl = D.HR, lv = id => S.lv[id] || 0;
    X.save(); X.translate(sub.x, sub.y); X.rotate(sub.tilt);
    if (showDrill) {
      const hw = D.drillHalf(st), y0 = hl * .62, yb = y0 + 22;
      X.fillStyle = '#23292e'; X.fillRect(-hw - 9, y0 - 6, 2 * hw + 18, yb - y0 + 4);
      X.fillStyle = '#3c454c'; X.fillRect(-hw - 9, y0 - 6, 2 * hw + 18, 5);
      D.drawDrillHead(st, sub, yb, sub.heat, sub.grind, sub.spin);
    }
    for (const side of [-1, 1]) {
      X.save(); X.translate(side * (hl + 4), 8);
      X.fillStyle = '#39434b'; X.fillRect(-9, -13, 18, 26);
      X.fillStyle = '#20262b'; X.fillRect(-9, -13, 18, 5);
      const pw = 2 + Math.abs(Math.sin(D.T * 38 + side)) * 9;
      X.fillStyle = 'rgba(210,220,230,.55)'; X.beginPath(); X.ellipse(side * 12, 0, pw / 2, 14, 0, 0, 6.28); X.fill();
      X.restore();
    }
    const tanks = lv('hull1') >= 7 ? 2 : lv('hull1') >= 3 ? 1 : 0;
    for (let i = 0; i < tanks; i++) {
      const side = i ? 1 : -1;
      X.save(); X.translate(side * hl * .72, -hl * .72); X.rotate(side * .5);
      X.fillStyle = '#d7dde2'; X.beginPath(); X.ellipse(0, 0, 8, 17, 0, 0, 6.28); X.fill();
      X.fillStyle = '#3fe0c5'; X.fillRect(-8, -3, 16, 5); X.restore();
    }
    if (lv('hull2') >= 5) { X.fillStyle = '#5a646c'; X.fillRect(-hl * .5, -hl - 16, hl, 6); }
    const plated = lv('hull4') >= 2;
    const hg = X.createRadialGradient(-hl * .35, -hl * .4, 4, 0, 0, hl);
    hg.addColorStop(0, '#ffe58c'); hg.addColorStop(.5, '#f0b429'); hg.addColorStop(1, '#8a5d0b');
    X.fillStyle = hg; X.beginPath(); X.arc(0, 0, hl, 0, 6.28); X.fill();
    X.strokeStyle = plated ? '#5a646c' : '#3f2b06'; X.lineWidth = plated ? 5 : 3; X.stroke();
    X.save(); X.beginPath(); X.arc(0, 0, hl, 0, 6.28); X.clip();
    X.fillStyle = '#2d220a'; X.fillRect(-hl, 16, hl * 2, 9);
    X.fillStyle = '#c9c1a8'; for (let i = -4; i <= 4; i++) { X.beginPath(); X.arc(i * 10, 20.5, 1.8, 0, 6.28); X.fill(); }
    X.fillStyle = 'rgba(0,0,0,.25)'; X.fillRect(-hl, 26, hl * 2, 30);
    X.restore();
    X.fillStyle = '#b8870f'; X.fillRect(-12, -hl - 9, 24, 12); X.fillStyle = '#6b4e0c'; X.fillRect(-14, -hl - 12, 28, 5);
    X.fillStyle = '#7b8288'; X.beginPath(); X.arc(0, -6, 19, 0, 6.28); X.fill();
    const pg = X.createRadialGradient(-4, -10, 2, 0, -6, 15);
    pg.addColorStop(0, '#d8fbff'); pg.addColorStop(.5, '#4fb6c7'); pg.addColorStop(1, '#0d3a48');
    X.fillStyle = pg; X.beginPath(); X.arc(0, -6, 14, 0, 6.28); X.fill();
    X.fillStyle = 'rgba(10,30,40,.75)'; X.beginPath(); X.arc(2, -2, 6, Math.PI, 0); X.fill(); X.beginPath(); X.arc(2, -7, 3.5, 0, 6.28); X.fill();
    X.fillStyle = 'rgba(255,255,255,.7)'; X.beginPath(); X.arc(-6, -12, 3, 0, 6.28); X.fill();
    X.fillStyle = '#f7f3e6'; X.fillRect(-7, hl - 12, 14, 7);
    X.restore();
    if (alarm > 0) { X.strokeStyle = 'rgba(255,90,80,' + Math.min(1, alarm * 1.6) + ')'; X.lineWidth = 4; X.beginPath(); X.arc(sub.x, sub.y, D.HR + 8, 0, 6.28); X.stroke(); }
  };

  D.drawDrone = function (dr) {
    const X = D.X;
    if (dr.firing && dr.tx != null) {
      X.strokeStyle = 'rgba(190,160,255,.85)'; X.lineWidth = 2.5;
      X.beginPath(); X.moveTo(dr.x, dr.y + 8); X.lineTo(dr.tx + (Math.random() - .5) * 10, dr.ty + (Math.random() - .5) * 10); X.stroke();
    }
    X.save(); X.translate(dr.x, dr.y + Math.sin(D.T * 5 + dr.i) * 3);
    X.fillStyle = '#e9e4f5'; X.fillRect(-15, -8, 30, 14); X.fillStyle = '#8f76d8'; X.fillRect(-15, -8, 30, 4);
    X.fillStyle = '#20252c'; X.fillRect(-19, -4, 5, 9); X.fillRect(14, -4, 5, 9);
    X.fillStyle = '#b8fbff'; X.beginPath(); X.arc(0, 8, 3, 0, 6.28); X.fill();
    X.restore();
    D.glow(dr.x, dr.y + 12, 90, .6);
  };
  D.drawShot = function (p) {
    const X = D.X;
    X.save(); X.translate(p.x, p.y); X.rotate(Math.atan2(p.vy, p.vx));
    if (p.type === 'torpedo') {
      X.fillStyle = '#c8ced3'; X.fillRect(-12, -4, 22, 8); X.fillStyle = '#ff5a3c'; X.fillRect(8, -4, 5, 8);
      X.fillStyle = 'rgba(200,230,255,.5)'; X.beginPath(); X.arc(-16, 0, 4 + Math.random() * 3, 0, 6.28); X.fill();
    } else if (p.type === 'harpoon') {
      X.strokeStyle = '#d7dde2'; X.lineWidth = 4; X.beginPath(); X.moveTo(-26, 0); X.lineTo(14, 0); X.stroke();
      X.fillStyle = '#d7dde2'; X.beginPath(); X.moveTo(22, 0); X.lineTo(10, -7); X.lineTo(10, 7); X.fill();
    } else if (p.type === 'charge') {
      X.fillStyle = '#39434b'; X.beginPath(); X.arc(0, 0, 9, 0, 6.28); X.fill();
      X.fillStyle = Math.sin(D.T * 20) > 0 ? '#ff3b3b' : '#5a1010'; X.beginPath(); X.arc(0, 0, 3, 0, 6.28); X.fill();
    } else if (p.type === 'flare') {
      X.fillStyle = '#fff6c9'; X.beginPath(); X.arc(0, 0, 5, 0, 6.28); X.fill();
    }
    X.restore();
    if (p.type === 'flare') D.glow(p.x, p.y, 260, .95);
    if (p.type === 'torpedo') D.glow(p.x, p.y, 40, .4);
  };
})();
