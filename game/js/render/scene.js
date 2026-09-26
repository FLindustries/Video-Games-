// Scene drawing: water, canyon walls, zone backdrops, the surface and ship, darkness and light.
(function () {
  const TB = globalThis.TB;
  const D = TB.draw = TB.draw || { X: null, lights: [], T: 0 };
  const { SW, SH } = TB;
  D.PXM = 26; D.ANCHOR = 150; D.FIELD_L = 150; D.FIELD_R = SW - 150;
  D.glow = (x, y, r, a) => D.lights.push({ x, y, r, a });

  // colours and darkness blend into a new zone over its first 15%
  D.palAt = function (L) {
    const z = TB.zoneAtL(L), f = (L - z.L0) / TB.ZONE_LEN;
    if (z.i === 0 || f >= .15) return { p: z.palA, dark: z.dark, z };
    const prev = TB.zones[z.i - 1], t = Math.max(0, f / .15);
    return { p: z.palA.map((c, i) => TB.mixA(prev.palA[i], c, t)), dark: TB.lerp(prev.dark, z.dark, t), z };
  };

  const snow = Array.from({ length: 150 }, () => ({ x: Math.random(), y: Math.random(), z: .25 + Math.random() * .75 }));
  D.stepSnow = (dt, speed) => { for (const f of snow) { f.y -= dt * speed * .02 * (.4 + f.z); f.x += dt * .004 * Math.sin(D.T * .3 + f.z * 9); if (f.y < -.02) { f.y = 1.02; f.x = Math.random(); } } };

  const wallEdge = (wy, seed) => 46 * Math.sin(wy * .0035 + seed) + 24 * Math.sin(wy * .0093 + seed * 2.3) + 10 * Math.sin(wy * .027 + seed * 4.1);
  const hash = i => { const v = Math.sin(i * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };

  D.drawWater = function (L, walls) {
    const X = D.X, P = D.palAt(Math.max(0, L)), p = P.p, cam = L * D.PXM;
    const g = X.createLinearGradient(0, 0, 0, SH);
    g.addColorStop(0, TB.css(p[0])); g.addColorStop(1, TB.css(p[1]));
    X.fillStyle = g; X.fillRect(0, 0, SW, SH);
    const ray = Math.max(0, 1 - Math.max(0, L) / 40);
    if (ray > 0) {
      X.save(); X.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 7; i++) {
        const x = 120 + i * 230 + Math.sin(D.T * .15 + i * 1.7) * 60, w = 40 + (i % 3) * 25;
        const rg = X.createLinearGradient(0, 0, 0, SH);
        rg.addColorStop(0, 'rgba(190,235,255,' + (.09 * ray) + ')'); rg.addColorStop(1, 'rgba(190,235,255,0)');
        X.fillStyle = rg; X.beginPath(); X.moveTo(x - w / 2, 0); X.lineTo(x + w / 2, 0); X.lineTo(x + w * 2.6 - 120, SH); X.lineTo(x - w * 1.6 - 120, SH); X.closePath(); X.fill();
      }
      X.restore();
    }
    drawBackdrop(P.z, p, cam);
    if (D.farBeast) drawFarBeast(D.farBeast, p);
    if (walls) {
      for (const [layer, par, base, col] of [[0, .45, 175, TB.css(p[3], .85)], [1, 1, 85, TB.css(p[2])]]) {
        for (let side = 0; side < 2; side++) {
          X.beginPath(); X.moveTo(side ? SW : 0, -30);
          for (let sy = -30; sy <= SH + 30; sy += 18) { const w = base + wallEdge(sy + cam * par, side * 7 + layer * 3); X.lineTo(side ? SW - w : w, sy); }
          X.lineTo(side ? SW : 0, SH + 30); X.closePath(); X.fillStyle = col; X.fill();
          if (layer === 1) { X.strokeStyle = TB.css(TB.shade(p[0], .2), .25); X.lineWidth = 2; X.stroke(); }
        }
      }
      X.fillStyle = TB.css(TB.shade(p[2], .12));
      for (let side = 0; side < 2; side++) {
        const start = Math.floor((cam - 60) / 70);
        for (let i = start; i < start + 16; i++) {
          const sy = i * 70 - cam, w = 85 + wallEdge(i * 70, side * 7 + 3), len = 18 + Math.abs(Math.sin(i * 12.9 + side)) * 30;
          X.beginPath(); X.ellipse(side ? SW - w + 4 : w - 4, sy, len, 5, 0, 0, 6.28); X.fill();
        }
      }
      if (P.z.kelp) {
        const k = Math.min(1, (L - P.z.L0) / 8);
        X.strokeStyle = 'rgba(70,140,80,' + (.55 * k) + ')'; X.lineWidth = 5; X.lineCap = 'round';
        const step = 130, off = cam % step;
        for (let side = 0; side < 2; side++) for (let i = -1; i < SH / step + 2; i++) {
          const yb = i * step - off + step, w = 85 + wallEdge(yb + cam, side * 7 + 3), bx = side ? SW - w : w, dir = side ? -1 : 1;
          X.beginPath(); X.moveTo(bx, yb);
          for (let j = 1; j <= 8; j++) X.lineTo(bx + dir * (j * 9 + Math.sin(D.T * 1.3 + j * .6 + i) * 8), yb - j * 16);
          X.stroke();
        }
      }
    }
    const red = P.z.i >= 7;
    for (const f of snow) {
      X.globalAlpha = .1 + .3 * f.z;
      X.fillStyle = red ? (f.z > .8 ? '#ffb070' : '#ff8a6a') : L > 130 && f.z > .85 ? '#8ff5e0' : '#e8f2f7';
      X.fillRect(f.x * SW, f.y * SH, .8 + f.z * 1.8, .8 + f.z * 1.8);
    }
    X.globalAlpha = 1;
  };

  // far background, one flavour per zone
  function drawBackdrop(z, p, cam) {
    const X = D.X, col = TB.css(TB.shade(p[1], -.3), .55), par = .3, sp = 420;
    const off = (cam * par) % sp, base = Math.floor(cam * par / sp);
    X.fillStyle = col; X.strokeStyle = col;
    for (let i = -1; i < SH / sp + 2; i++) {
      const idx = base + i, y = i * sp - off, r = hash(idx), side = r < .5 ? 0 : 1, x = side ? SW - 260 - r * 200 : 260 + r * 200;
      if (z.bg === 'wreck') {
        X.save(); X.translate(x, y); X.rotate((r - .5) * .8);
        X.beginPath(); X.moveTo(-180, 0); X.lineTo(160, 0); X.lineTo(130, 50); X.lineTo(-150, 50); X.closePath(); X.fill();
        X.fillRect(-60, -50, 90, 50); X.fillRect(-20, -110, 12, 60);
        X.restore();
      } else if (z.bg === 'vents') {
        const h = 160 + r * 200;
        X.beginPath(); X.moveTo(x - 30, y + 200); X.lineTo(x - 14, y + 200 - h); X.lineTo(x + 14, y + 200 - h); X.lineTo(x + 30, y + 200); X.fill();
        X.fillStyle = 'rgba(255,140,60,.06)';
        for (let k = 0; k < 4; k++) { X.beginPath(); X.arc(x + Math.sin(D.T + k + idx) * 14, y + 200 - h - 30 - k * 40 - (D.T * 30 % 40), 20 + k * 8, 0, 6.28); X.fill(); }
        X.fillStyle = col;
      } else if (z.bg === 'ruins') {
        X.fillRect(x - 90, y, 26, 220); X.fillRect(x + 64, y + 20, 26, 200);
        X.beginPath(); X.arc(x, y, 90, Math.PI, 0); X.lineWidth = 24; X.stroke();
        X.fillRect(x - 110, y - 20, 220, 18);
      } else if (z.bg === 'crystals') {
        X.beginPath(); X.moveTo(x - 50, y + 220); X.lineTo(x - 10, y - 80 * r - 40); X.lineTo(x + 30, y + 220); X.fill();
        X.beginPath(); X.moveTo(x + 10, y + 220); X.lineTo(x + 60, y + 40); X.lineTo(x + 90, y + 220); X.fill();
      } else if (z.bg === 'bones') {
        X.lineWidth = 16; X.lineCap = 'round';
        for (let k = 0; k < 5; k++) { X.beginPath(); X.arc(x, y + k * 50, 120 - k * 8, Math.PI * 1.1, Math.PI * 1.9); X.stroke(); }
        X.beginPath(); X.moveTo(x, y - 40); X.lineTo(x, y + 240); X.stroke();
      } else if (z.bg === 'eyes') {
        for (let k = 0; k < 3; k++) {
          const ex = x + (hash(idx * 3 + k) - .5) * 400, ey = y + k * 120, open = Math.max(0, Math.sin(D.T * .8 + idx + k * 2));
          X.fillStyle = 'rgba(255,60,40,' + (.35 * open) + ')'; X.beginPath(); X.ellipse(ex, ey, 22, 10 * open + .5, 0, 0, 6.28); X.fill();
          X.fillStyle = 'rgba(0,0,0,.8)'; X.beginPath(); X.ellipse(ex, ey, 3, 8 * open + .5, 0, 0, 6.28); X.fill();
          if (open > .3) D.glow(ex, ey, 40, .3 * open);
        }
        X.fillStyle = col;
      }
    }
  }

  function drawFarBeast(fb, p) {
    const X = D.X;
    X.save(); X.translate(fb.x, fb.y); X.scale(fb.dir, 1);
    X.fillStyle = TB.css(TB.shade(p[1], -.25), .6);
    if (fb.kind === 'whale') {
      X.beginPath(); X.moveTo(260, 0); X.quadraticCurveTo(200, -70, 0, -60); X.quadraticCurveTo(-200, -50, -300, 0);
      X.lineTo(-380, -50 + Math.sin(fb.t) * 10); X.lineTo(-360, 0); X.lineTo(-380, 50 + Math.sin(fb.t) * 10); X.lineTo(-300, 10);
      X.quadraticCurveTo(-100, 70, 100, 50); X.quadraticCurveTo(220, 40, 260, 0); X.fill();
      X.beginPath(); X.moveTo(40, 40); X.lineTo(-20, 110 + Math.sin(fb.t * 1.3) * 10); X.lineTo(-60, 40); X.fill();
    } else {
      X.beginPath(); X.ellipse(0, 0, 200, 55, 0, 0, 6.28); X.fill();
      X.beginPath(); X.moveTo(200, -40); X.lineTo(300, 0); X.lineTo(200, 40); X.fill();
      X.strokeStyle = X.fillStyle; X.lineWidth = 12; X.lineCap = 'round';
      for (let i = 0; i < 6; i++) { X.beginPath(); X.moveTo(-190, -30 + i * 12); X.bezierCurveTo(-300, -40 + i * 16 + Math.sin(fb.t * 2 + i) * 30, -420, i * 12 + Math.cos(fb.t * 1.6 + i) * 40, -520, -20 + i * 14); X.stroke(); }
    }
    X.restore();
  }
  D.stepFarBeast = function (dt, L) {
    D.farT = (D.farT == null ? 6 : D.farT) - dt;
    const z = TB.zoneAtL(Math.max(0, L));
    if (!D.farBeast && D.farT <= 0 && (z.bg === 'whale' || z.bg === 'squid')) {
      D.farBeast = { kind: z.bg, dir: Math.random() < .5 ? 1 : -1, y: L < 0 ? 760 : 250 + Math.random() * 400, t: 0 };
      D.farBeast.x = D.farBeast.dir > 0 ? -500 : SW + 500;
    }
    if (D.farBeast) { const f = D.farBeast; f.x += f.dir * 38 * dt; f.t += dt; if (f.x < -600 || f.x > SW + 600) { D.farBeast = null; D.farT = 18 + Math.random() * 20; } }
  };

  D.drawSurface = function (y, shipX) {
    const X = D.X;
    const sky = X.createLinearGradient(0, y - 700, 0, y);
    sky.addColorStop(0, '#0c1630'); sky.addColorStop(.55, '#33385e'); sky.addColorStop(.85, '#c0725a'); sky.addColorStop(1, '#f2a36b');
    X.fillStyle = sky; X.fillRect(0, y - 900, SW, 900);
    X.fillStyle = 'rgba(255,220,180,.85)'; X.beginPath(); X.arc(shipX > 900 ? 610 : 1250, y - 30, 54, 0, 6.28); X.fill();
    D.drawShip(shipX, y);
    X.fillStyle = 'rgba(29,95,124,.92)';
    X.beginPath(); X.moveTo(0, y);
    for (let x = 0; x <= SW; x += 20) X.lineTo(x, y + Math.sin(x * .02 + D.T * 1.6) * 4 + Math.sin(x * .007 - D.T) * 3);
    X.lineTo(SW, y + 60); X.lineTo(0, y + 60); X.closePath(); X.fill();
    X.strokeStyle = 'rgba(255,220,190,.55)'; X.lineWidth = 2; X.beginPath();
    for (let x = 0; x <= SW; x += 20) { const yy = y + Math.sin(x * .02 + D.T * 1.6) * 4 + Math.sin(x * .007 - D.T) * 3; x ? X.lineTo(x, yy) : X.moveTo(x, yy); }
    X.stroke();
  };
  D.drawShip = function (cx, y) {
    const X = D.X, bob = Math.sin(D.T * 1.1) * 4;
    X.save(); X.translate(cx, y + bob);
    X.fillStyle = '#1b2433';
    X.beginPath(); X.moveTo(-430, -60); X.lineTo(330, -60); X.lineTo(300, 40); X.lineTo(-400, 40); X.closePath(); X.fill();
    X.fillStyle = '#b8402f'; X.fillRect(-412, 12, 718, 10);
    X.fillStyle = '#e8e2d2'; X.font = '24px ' + D.FONT.big; X.textAlign = 'left'; X.fillText('MERIDIAN SALVAGE', -330, -24);
    X.fillStyle = '#2a3446'; X.fillRect(-380, -150, 250, 90); X.fillRect(-340, -205, 150, 55);
    X.fillStyle = '#ffd28a';
    for (let i = 0; i < 6; i++) X.fillRect(-365 + i * 38, -128, 22, 14);
    for (let i = 0; i < 3; i++) X.fillRect(-325 + i * 44, -188, 26, 12);
    X.fillStyle = '#1b2433'; X.fillRect(-300, -250, 6, 45); X.fillRect(-312, -238, 30, 4);
    X.fillStyle = '#ff5a3c'; X.beginPath(); X.arc(-297, -252, 3, 0, 6.28); X.fill();
    X.strokeStyle = '#d99a1e'; X.lineWidth = 12; X.lineCap = 'round';
    X.beginPath(); X.moveTo(230, -60); X.lineTo(420, -250); X.lineTo(320, -60); X.stroke();
    X.fillStyle = '#2b2b2b'; X.beginPath(); X.arc(420, -250, 9, 0, 6.28); X.fill();
    X.restore();
  };

  // darkness with the headlamp cone and every light source cut out of it
  D.drawDark = function (dark, lamp, extra) {
    if (dark <= .01) return;
    const X = D.X, L = D.lctx;
    L.globalCompositeOperation = 'source-over';
    L.clearRect(0, 0, SW, SH);
    L.fillStyle = extra && extra.red ? 'rgba(12,0,2,' + dark + ')' : 'rgba(1,3,8,' + dark + ')'; L.fillRect(0, 0, SW, SH);
    L.globalCompositeOperation = 'destination-out';
    const cut = (x, y, r, a) => { const g = L.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, 'rgba(0,0,0,' + a + ')'); g.addColorStop(1, 'rgba(0,0,0,0)'); L.fillStyle = g; L.beginPath(); L.arc(x, y, r, 0, 6.28); L.fill(); };
    if (lamp) {
      const flick = extra && extra.flicker ? (Math.random() < .06 ? .2 : 1) : 1;
      for (const [spread, len, a] of [[.62, 620, .5], [.42, 700, .75]]) {
        const ln = len * lamp.mult, g = L.createRadialGradient(lamp.x, lamp.y, 10, lamp.x, lamp.y, ln);
        g.addColorStop(0, 'rgba(0,0,0,' + a * flick + ')'); g.addColorStop(.7, 'rgba(0,0,0,' + a * .5 * flick + ')'); g.addColorStop(1, 'rgba(0,0,0,0)');
        L.fillStyle = g; L.beginPath(); L.moveTo(lamp.x, lamp.y); L.arc(lamp.x, lamp.y, ln, lamp.ang - spread, lamp.ang + spread); L.closePath(); L.fill();
      }
      cut(lamp.hx, lamp.hy, 190, .85);
    }
    for (const l of D.lights) cut(l.x, l.y, l.r, l.a);
    X.save(); X.setTransform(1, 0, 0, 1, 0, 0); X.drawImage(D.shadeCv, 0, 0); X.restore();
    if (lamp) {
      X.save(); X.globalCompositeOperation = 'lighter';
      const g = X.createRadialGradient(lamp.x, lamp.y, 10, lamp.x, lamp.y, 600 * lamp.mult);
      g.addColorStop(0, 'rgba(255,236,190,' + (.1 * dark) + ')'); g.addColorStop(1, 'rgba(255,236,190,0)');
      X.fillStyle = g; X.beginPath(); X.moveTo(lamp.x, lamp.y); X.arc(lamp.x, lamp.y, 600 * lamp.mult, lamp.ang - .42, lamp.ang + .42); X.closePath(); X.fill();
      X.restore();
    }
  };
})();
