// Drawing every rock, ore, hazard and creature. All shapes are built in code.
(function () {
  const TB = globalThis.TB;
  const D = TB.draw;
  D.FONT = { big: '"Saira Stencil One", "Chakra Petch", sans-serif', mono: '"Share Tech Mono", ui-monospace, monospace', body: '"Chakra Petch", sans-serif' };
  const { css, shade, hex } = TB;

  // --- shared shapes for rock-like things
  function rockPath(n, s) {
    const X = D.X; X.beginPath();
    n.verts.forEach(([a, r], i) => { const x = Math.cos(a) * s * r, y = Math.sin(a) * s * r; i ? X.lineTo(x, y) : X.moveTo(x, y); });
    X.closePath();
  }
  function rockBody(n, base, opts = {}) {
    const X = D.X, s = n.s;
    rockPath(n, s);
    const g = X.createLinearGradient(-s, -s, s, s);
    g.addColorStop(0, css(shade(base, .28))); g.addColorStop(.55, css(base)); g.addColorStop(1, css(shade(base, -.55)));
    X.fillStyle = g; X.fill();
    X.strokeStyle = css(shade(base, -.7)); X.lineWidth = 2; X.stroke();
    X.save(); rockPath(n, s); X.clip();
    X.fillStyle = css(shade(base, -.35), .6);
    for (const [x, y, r] of n.spots) { X.beginPath(); X.arc(x * s, y * s, r * s, 0, 6.28); X.fill(); }
    X.fillStyle = css(shade(base, .45), .35);
    X.beginPath(); X.ellipse(-s * .35, -s * .4, s * .35, s * .16, -.6, 0, 6.28); X.fill();
    X.restore();
    const dmg = n.max ? 1 - n.hp / n.max : 0;
    if (dmg > .12 && !opts.noCracks) {
      X.strokeStyle = opts.crackCol || css(shade(base, -.85)); X.lineWidth = 2;
      n.crack.forEach(([a0, a1, len], i) => {
        if (dmg < .12 + i * .28) return;
        X.beginPath(); X.moveTo(0, 0); X.lineTo(Math.cos(a0) * s * len * .5, Math.sin(a0) * s * len * .5); X.lineTo(Math.cos(a1) * s * len, Math.sin(a1) * s * len); X.stroke();
      });
    }
  }
  function flash(n, path) {
    if (n.hit <= 0) return;
    const X = D.X; path(); X.fillStyle = 'rgba(255,245,230,.45)'; X.fill();
  }
  function shards(n, color, glow) {
    const X = D.X, c = hex(color);
    for (const [a, len, w] of n.shards) {
      const x1 = Math.cos(a) * n.s * .2, y1 = Math.sin(a) * n.s * .2, x2 = Math.cos(a) * n.s * len, y2 = Math.sin(a) * n.s * len;
      const nx = -Math.sin(a) * w, ny = Math.cos(a) * w;
      X.beginPath(); X.moveTo(x1 + nx, y1 + ny); X.lineTo(x2, y2); X.lineTo(x1 - nx, y1 - ny); X.closePath();
      const g = X.createLinearGradient(x1, y1, x2, y2); g.addColorStop(0, css(shade(c, -.45))); g.addColorStop(1, css(shade(c, .35)));
      X.fillStyle = g; X.fill();
    }
    const tw = (Math.sin(D.T * 5 + n.ph) + 1) / 2, [a, len] = n.shards[0];
    X.save(); X.translate(Math.cos(a) * n.s * len, Math.sin(a) * n.s * len); X.rotate(-n.rot);
    X.fillStyle = 'rgba(255,255,240,' + tw + ')';
    X.beginPath(); X.moveTo(0, -9 * tw); X.lineTo(2, 0); X.lineTo(0, 9 * tw); X.lineTo(-2, 0); X.closePath(); X.fill();
    X.beginPath(); X.moveTo(-9 * tw, 0); X.lineTo(0, 2); X.lineTo(9 * tw, 0); X.lineTo(0, -2); X.closePath(); X.fill();
    X.restore();
  }

  const DRAW = {
    rock(n, pal) { const X = D.X; X.save(); X.translate(n.x, n.y); X.rotate(n.rot); rockBody(n, pal[4]); flash(n, () => rockPath(n, n.s)); X.restore(); },
    ore(n, pal) {
      const X = D.X, k = n.k; X.save(); X.translate(n.x, n.y); X.rotate(n.rot);
      rockBody(n, shade(pal[4], -.3)); shards(n, k.shard); flash(n, () => rockPath(n, n.s)); X.restore();
      D.glow(n.x, n.y, k.glow ? 70 : 40, k.glow ? .5 : .3);
    },
    nodule(n) {
      const X = D.X; X.save(); X.translate(n.x, n.y); X.rotate(n.rot);
      rockBody(n, [58, 64, 72]);
      X.fillStyle = 'rgba(190,205,220,.8)'; n.spots.forEach(([x, y]) => { X.beginPath(); X.arc(x * n.s * .8, y * n.s * .8, 2.2, 0, 6.28); X.fill(); });
      flash(n, () => rockPath(n, n.s)); X.restore();
    },
    oyster(n) {
      const X = D.X, s = n.s, open = n.hit > 0 ? .5 : .15 + Math.sin(D.T * 1.5 + n.ph) * .08;
      X.save(); X.translate(n.x, n.y); X.rotate(n.rot * .2);
      X.fillStyle = '#4a4458'; X.beginPath(); X.ellipse(0, 4, s, s * .45, 0, 0, Math.PI); X.fill();
      X.fillStyle = '#f4f0ff'; X.beginPath(); X.arc(0, 2, s * .28, 0, 6.28); X.fill();
      X.save(); X.translate(0, 2); X.rotate(-open);
      X.fillStyle = '#6a6280'; X.beginPath(); X.ellipse(0, 0, s, s * .5, 0, Math.PI, 0); X.fill();
      X.strokeStyle = '#2a2436'; X.lineWidth = 2; X.stroke();
      X.strokeStyle = 'rgba(40,30,60,.5)'; for (let i = -3; i <= 3; i++) { X.beginPath(); X.moveTo(i * s * .25, 0); X.lineTo(i * s * .1, -s * .45); X.stroke(); }
      X.restore(); X.restore();
      D.glow(n.x, n.y, 55, .45);
      D.hpBar(n);
    },
    scrap(n) {
      const X = D.X, s = n.s; X.save(); X.translate(n.x, n.y); X.rotate(n.rot);
      const path = () => { X.beginPath(); X.moveTo(-s, -s * .6); X.lineTo(s * .8, -s * .9); X.lineTo(s, s * .5); X.lineTo(-s * .4, s * .9); X.lineTo(-s * .9, s * .3); X.closePath(); };
      path(); const g = X.createLinearGradient(-s, -s, s, s); g.addColorStop(0, '#8a8f96'); g.addColorStop(1, '#3a3e44'); X.fillStyle = g; X.fill();
      X.strokeStyle = '#1e2126'; X.lineWidth = 2; X.stroke();
      X.fillStyle = 'rgba(160,80,40,.6)'; X.beginPath(); X.arc(s * .3, s * .2, s * .35, 0, 6.28); X.fill();
      X.fillStyle = '#c4cad2'; for (const [x, y] of [[-.6, -.4], [.5, -.6], [-.2, .5]]) { X.beginPath(); X.arc(x * s, y * s, 2, 0, 6.28); X.fill(); }
      flash(n, path); X.restore();
    },
    obsidian(n) {
      const X = D.X; X.save(); X.translate(n.x, n.y); X.rotate(n.rot);
      rockBody(n, [20, 16, 28], { crackCol: '#b89aff' });
      X.strokeStyle = 'rgba(200,180,255,.6)'; X.lineWidth = 1.5;
      for (const [a] of n.shards) { X.beginPath(); X.moveTo(0, 0); X.lineTo(Math.cos(a) * n.s * .8, Math.sin(a) * n.s * .8); X.stroke(); }
      flash(n, () => rockPath(n, n.s)); X.restore();
      D.glow(n.x, n.y, 45, .3);
    },
    carved(n, pal) {
      const X = D.X, s = n.s; X.save(); X.translate(n.x, n.y); X.rotate(n.rot * .3);
      const path = () => { X.beginPath(); X.rect(-s, -s * .75, s * 2, s * 1.5); };
      path(); X.fillStyle = css(shade(pal[4], .1)); X.fill(); X.strokeStyle = css(shade(pal[4], -.6)); X.lineWidth = 2; X.stroke();
      X.strokeStyle = 'rgba(140,255,220,' + (.35 + Math.sin(D.T * 2 + n.ph) * .2) + ')'; X.lineWidth = 2;
      X.beginPath(); X.arc(0, 0, s * .35, 0, 6.28); X.moveTo(-s * .6, -s * .4); X.lineTo(s * .6, s * .4); X.moveTo(0, -s * .6); X.lineTo(0, s * .6); X.stroke();
      flash(n, path); X.restore();
      D.glow(n.x, n.y, 40, .25);
    },
    crystal(n) {
      const X = D.X, s = n.s, c = hex(n.k.col); X.save(); X.translate(n.x, n.y); X.rotate(n.rot * .3);
      const cols = [[-.5, 1.1, .3], [0, 1.4, .35], [.5, 1, .28]];
      for (const [ox, h, w] of cols) {
        X.beginPath(); X.moveTo(ox * s - w * s, s * .6); X.lineTo(ox * s - w * s, -h * s * .5); X.lineTo(ox * s, -h * s); X.lineTo(ox * s + w * s, -h * s * .5); X.lineTo(ox * s + w * s, s * .6); X.closePath();
        const g = X.createLinearGradient(ox * s - w * s, 0, ox * s + w * s, 0); g.addColorStop(0, css(shade(c, -.4))); g.addColorStop(.5, css(shade(c, .4))); g.addColorStop(1, css(shade(c, -.2)));
        X.fillStyle = n.hit > 0 ? '#ffffff' : g; X.fill(); X.strokeStyle = css(shade(c, -.6), .8); X.lineWidth = 1.5; X.stroke();
      }
      X.restore(); D.glow(n.x, n.y, 60, .4); D.hpBar(n);
    },
    magma(n) {
      const X = D.X, k = n.k; X.save(); X.translate(n.x, n.y); X.rotate(n.rot);
      rockBody(n, [42, 26, 22], { noCracks: true });
      X.strokeStyle = k.glow || '#ff8a3c'; X.shadowColor = k.glow || '#ff6a1c'; X.shadowBlur = 12; X.lineWidth = 2.5;
      n.crack.forEach(([a0, a1, len]) => { X.beginPath(); X.moveTo(0, 0); X.lineTo(Math.cos(a0) * n.s * len * .5, Math.sin(a0) * n.s * len * .5); X.lineTo(Math.cos(a1) * n.s * len, Math.sin(a1) * n.s * len); X.stroke(); });
      X.shadowBlur = 0; flash(n, () => rockPath(n, n.s)); X.restore();
      D.glow(n.x, n.y, 110, .7);
    },
    bone(n) {
      const X = D.X, s = n.s; X.save(); X.translate(n.x, n.y); X.rotate(n.rot);
      X.strokeStyle = n.hit > 0 ? '#ffffff' : '#e8dcc4'; X.lineCap = 'round';
      const branch = (x, y, a, len, w, d) => { if (d > 3) return; const x2 = x + Math.cos(a) * len, y2 = y + Math.sin(a) * len; X.lineWidth = w; X.beginPath(); X.moveTo(x, y); X.lineTo(x2, y2); X.stroke(); branch(x2, y2, a - .5, len * .7, w * .7, d + 1); branch(x2, y2, a + .45, len * .65, w * .7, d + 1); };
      branch(0, s * .8, -Math.PI / 2, s * .8, 6, 0);
      X.fillStyle = '#e8dcc4'; X.beginPath(); X.ellipse(0, s * .8, s * .5, s * .2, 0, 0, 6.28); X.fill();
      X.restore(); D.hpBar(n);
    },
    cache(n) {
      const X = D.X, s = n.s; X.save(); X.translate(n.x, n.y); X.rotate(Math.sin(n.ph) * .15);
      const path = () => { X.beginPath(); X.rect(-s, -s * .6, s * 2, s * 1.3); };
      path(); const g = X.createLinearGradient(0, -s, 0, s); g.addColorStop(0, '#7a5a2e'); g.addColorStop(1, '#3a2a14'); X.fillStyle = g; X.fill();
      X.strokeStyle = '#1e140a'; X.lineWidth = 2; X.stroke();
      X.fillStyle = '#b89a4a'; X.fillRect(-s, -s * .15, s * 2, 5); X.fillRect(-4, -s * .3, 8, 12);
      X.fillStyle = 'rgba(255,230,150,' + (.4 + Math.sin(D.T * 3) * .3) + ')'; X.fillRect(-s * .9, -s * .6, s * 1.8, 2);
      flash(n, path); X.restore();
      D.glow(n.x, n.y, 80, .55); D.hpBar(n);
    },

    // --- pickups and hazards
    bubble(n) {
      const X = D.X, w = Math.sin(n.ph * 1.3);
      X.save(); X.translate(n.x, n.y);
      for (const [ox, oy, r] of [[0, 0, 1], [n.s * .9, -n.s * .7, .55], [-n.s * .7, -n.s * .9, .4]]) {
        const rr = n.s * r * (1 + w * .05);
        X.beginPath(); X.arc(ox, oy, rr, 0, 6.28); X.fillStyle = 'rgba(160,230,255,.12)'; X.fill();
        X.strokeStyle = 'rgba(190,240,255,.85)'; X.lineWidth = 1.8; X.stroke();
        X.beginPath(); X.arc(ox - rr * .35, oy - rr * .35, rr * .25, 0, 6.28); X.fillStyle = 'rgba(255,255,255,.75)'; X.fill();
      }
      X.restore(); D.glow(n.x, n.y, 45, .35);
    },
    jelly(n) { drawJelly(n, ['rgba(255,215,245,.95)', 'rgba(220,120,245,.75)', 'rgba(150,60,210,.55)'], '#e59bff'); },
    mine(n) {
      const X = D.X, s = n.s, blink = Math.sin(D.T * 6 + n.ph) > .6;
      X.save(); X.translate(n.x, n.y); X.rotate(n.rot * .3);
      X.strokeStyle = '#2a2e33'; X.lineWidth = 4;
      for (let i = 0; i < 8; i++) { const a = i / 8 * 6.28; X.beginPath(); X.moveTo(Math.cos(a) * s * .8, Math.sin(a) * s * .8); X.lineTo(Math.cos(a) * s * 1.3, Math.sin(a) * s * 1.3); X.stroke(); }
      const g = X.createRadialGradient(-s * .3, -s * .3, 2, 0, 0, s); g.addColorStop(0, '#6a7078'); g.addColorStop(1, '#22262a');
      X.fillStyle = g; X.beginPath(); X.arc(0, 0, s, 0, 6.28); X.fill();
      X.fillStyle = blink ? '#ff3b3b' : '#5a1010'; X.beginPath(); X.arc(0, 0, 4, 0, 6.28); X.fill();
      X.restore(); if (blink) D.glow(n.x, n.y, 50, .6);
    },
    geyser(n) {
      const X = D.X, s = n.s, act = n.burst > 0;
      X.save(); X.translate(n.x, n.y);
      X.fillStyle = '#2a1a14'; X.beginPath(); X.moveTo(-s * 1.2, s); X.lineTo(-s * .4, -s * .3); X.lineTo(s * .4, -s * .3); X.lineTo(s * 1.2, s); X.fill();
      X.fillStyle = '#ff7a2a'; X.fillRect(-s * .3, -s * .35, s * .6, 4);
      if (act) {
        const h = 180 * Math.min(1, n.burst * 2);
        const g = X.createLinearGradient(0, -s * .3, 0, -s * .3 - h); g.addColorStop(0, 'rgba(255,200,150,.8)'); g.addColorStop(1, 'rgba(255,200,150,0)');
        X.fillStyle = g; X.beginPath(); X.moveTo(-s * .3, -s * .3); X.lineTo(-s * .9, -s * .3 - h); X.lineTo(s * .9, -s * .3 - h); X.lineTo(s * .3, -s * .3); X.fill();
      } else {
        X.fillStyle = 'rgba(255,200,150,.3)'; for (let i = 0; i < 3; i++) { X.beginPath(); X.arc(Math.sin(D.T * 3 + i) * 6, -s * .5 - ((D.T * 40 + i * 20) % 60), 4, 0, 6.28); X.fill(); }
      }
      X.restore(); D.glow(n.x, n.y - 20, act ? 160 : 60, act ? .7 : .4);
    },
    pocket(n) {
      const X = D.X, s = n.s * (1 + Math.sin(D.T * 5 + n.ph) * .08);
      X.save(); X.translate(n.x, n.y);
      const g = X.createRadialGradient(0, 0, 2, 0, 0, s); g.addColorStop(0, 'rgba(255,255,255,.05)'); g.addColorStop(.7, 'rgba(200,220,255,.15)'); g.addColorStop(1, 'rgba(230,240,255,.6)');
      X.fillStyle = g; X.beginPath(); X.arc(0, 0, s, 0, 6.28); X.fill();
      X.strokeStyle = 'rgba(255,255,255,' + (.4 + Math.sin(D.T * 9 + n.ph) * .3) + ')'; X.lineWidth = 2; X.setLineDash([5, 5]); X.stroke(); X.setLineDash([]);
      X.restore();
    },
    soul(n) {
      const X = D.X, s = n.s, fl = Math.sin(D.T * 12 + n.ph);
      X.save(); X.translate(n.x, n.y);
      const g = X.createRadialGradient(0, 0, 2, 0, 0, s * 1.4); g.addColorStop(0, 'rgba(255,240,200,.95)'); g.addColorStop(.5, 'rgba(255,120,40,.7)'); g.addColorStop(1, 'rgba(255,40,20,0)');
      X.fillStyle = g; X.beginPath(); X.moveTo(0, -s * 1.8 - fl * 4); X.quadraticCurveTo(s * 1.2, -s * .2, s * .8, s * .6); X.quadraticCurveTo(0, s * 1.2, -s * .8, s * .6); X.quadraticCurveTo(-s * 1.2, -s * .2, 0, -s * 1.8 - fl * 4); X.fill();
      X.fillStyle = 'rgba(60,10,0,.8)'; X.beginPath(); X.arc(-s * .3, 0, 3, 0, 6.28); X.arc(s * .3, 0, 3, 0, 6.28); X.fill();
      X.beginPath(); X.ellipse(0, s * .4, 3, 5 + fl * 2, 0, 0, 6.28); X.fill();
      X.restore(); D.glow(n.x, n.y, 110, .75);
    },

    // --- creatures
    crab(n) {
      const X = D.X, k = n.k, s = n.s, c = hex(k.col), walk = Math.sin(D.T * 10 + n.ph);
      X.save(); X.translate(n.x, n.y); X.scale(n.vx >= 0 ? 1 : -1, 1);
      X.strokeStyle = css(shade(c, -.3)); X.lineWidth = 3;
      for (let i = 0; i < 3; i++) for (const side of [-1, 1]) { X.beginPath(); X.moveTo(side * s * .5, s * .1 + i * 4); X.lineTo(side * s * 1.1, s * .5 + i * 5 + walk * 3 * side); X.stroke(); }
      for (const side of [-1, 1]) {
        X.beginPath(); X.moveTo(side * s * .6, -s * .1); X.lineTo(side * s * 1.1, -s * .6); X.stroke();
        X.fillStyle = css(shade(c, .1)); X.beginPath(); X.ellipse(side * s * 1.15, -s * .75, s * .3, s * .2, side * .6, 0, 6.28); X.fill();
      }
      if (k.hairy) { X.strokeStyle = 'rgba(240,235,220,.8)'; X.lineWidth = 1; for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI; X.beginPath(); X.moveTo(Math.cos(a) * s * .7, -Math.sin(a) * s * .5); X.lineTo(Math.cos(a) * s * 1, -Math.sin(a) * s * .8); X.stroke(); } }
      const sc = hex(k.shell || k.col);
      X.beginPath(); X.ellipse(0, 0, s * .75, s * .5, 0, 0, 6.28);
      const g = X.createLinearGradient(0, -s * .5, 0, s * .5); g.addColorStop(0, css(shade(sc, .25))); g.addColorStop(1, css(shade(sc, -.4)));
      X.fillStyle = n.hit > 0 ? '#ffffff' : g; X.fill(); X.strokeStyle = css(shade(sc, -.6)); X.lineWidth = 2; X.stroke();
      X.fillStyle = '#111'; X.beginPath(); X.arc(s * .25, -s * .45, 2.5, 0, 6.28); X.arc(s * .45, -s * .4, 2.5, 0, 6.28); X.fill();
      X.restore();
      if (k.glow) D.glow(n.x, n.y, 70, .5);
      D.hpBar(n);
    },
    fish(n) {
      const X = D.X, k = n.k, s = n.s, dir = n.vx >= 0 ? 1 : -1, wig = Math.sin(n.ph * 4) * .15;
      X.save(); X.translate(n.x, n.y); X.scale(dir, 1);
      X.fillStyle = k.col[1];
      X.beginPath(); X.moveTo(-s * 1.3, 0); X.lineTo(-s * 2.1, -s * .5 + wig * s); X.lineTo(-s * 1.9, 0); X.lineTo(-s * 2.1, s * .5 + wig * s); X.closePath(); X.fill();
      X.beginPath(); X.moveTo(-s * 1.4, 0);
      X.quadraticCurveTo(-s * .5, -s * .55 + wig * s * .3, s * .5, -s * .52); X.quadraticCurveTo(s * 1.25, -s * .45, s * 1.3, -s * .02);
      if (k.teeth) { X.lineTo(s * .7, s * .2); X.lineTo(s * 1.45, s * .32); }
      X.quadraticCurveTo(s * .9, s * .6, s * .2, s * .5); X.quadraticCurveTo(-s * .6, s * .45 + wig * s * .3, -s * 1.4, 0); X.closePath();
      const g = X.createLinearGradient(0, -s * .6, 0, s * .6); g.addColorStop(0, k.col[0]); g.addColorStop(1, k.col[1]);
      X.fillStyle = n.hit > 0 ? '#e8eef4' : g; X.fill(); X.strokeStyle = 'rgba(150,190,230,.35)'; X.lineWidth = 1.5; X.stroke();
      if (k.teeth) { X.fillStyle = '#eef6ff'; for (let i = 0; i < 4; i++) { const x = s * (.78 + i * .16); X.beginPath(); X.moveTo(x, s * .3); X.lineTo(x + 3, -s * .12 - (i % 2) * 5); X.lineTo(x + 6, s * .3); X.fill(); } }
      if (!k.blind) { X.fillStyle = '#dff4ff'; X.beginPath(); X.arc(s * .72, -s * .18, s * .15, 0, 6.28); X.fill(); X.fillStyle = '#05080c'; X.beginPath(); X.arc(s * .75, -s * .18, s * .07, 0, 6.28); X.fill(); }
      else { X.strokeStyle = 'rgba(120,110,100,.6)'; X.lineWidth = 1; X.beginPath(); X.arc(s * .72, -s * .18, s * .12, 0, 6.28); X.stroke(); }
      if (k.dots) { X.fillStyle = k.dots; for (let i = 0; i < 6; i++) { X.beginPath(); X.arc(-s * 1.05 + i * s * .26, s * .33, Math.max(1.2, s * .07), 0, 6.28); X.fill(); } }
      if (k.lure) {
        X.strokeStyle = '#2a3a4c'; X.lineWidth = 2; X.beginPath(); X.moveTo(s * .2, -s * .5); X.quadraticCurveTo(s * .7, -s * 1.3, s * 1.15, -s * 1.0 + Math.sin(n.ph * 2) * 3); X.stroke();
        X.fillStyle = k.lure; X.beginPath(); X.arc(s * 1.15, -s * 1.0 + Math.sin(n.ph * 2) * 3, 3.5, 0, 6.28); X.fill();
      }
      X.restore();
      if (k.lure) D.glow(n.x + dir * s * 1.15, n.y - s, 55, .7);
      if (k.dots && D.creatureGlow) D.glow(n.x, n.y, 40, .4);
      D.hpBar(n);
    },
    eel(n) {
      const X = D.X, k = n.k, s = n.s, dir = n.vx >= 0 ? 1 : -1, len = s * 4, seg = 10;
      X.save(); X.translate(n.x, n.y); X.scale(dir, 1);
      const pts = [];
      for (let i = 0; i <= seg; i++) { const t = i / seg; pts.push([s * 1.2 - t * len, Math.sin(n.ph * 3 - t * 5) * s * .35 * t]); }
      X.lineCap = 'round'; X.lineJoin = 'round';
      X.strokeStyle = n.hit > 0 ? '#ffffff' : k.col; X.lineWidth = s * .75;
      X.beginPath(); pts.forEach(([x, y], i) => i ? X.lineTo(x, y) : X.moveTo(x, y)); X.stroke();
      X.strokeStyle = k.spot; X.lineWidth = 2; X.setLineDash([3, 7]);
      X.beginPath(); pts.forEach(([x, y], i) => i ? X.lineTo(x, y - s * .15) : X.moveTo(x, y - s * .15)); X.stroke(); X.setLineDash([]);
      if (k.frill) { X.strokeStyle = 'rgba(200,120,110,.7)'; X.lineWidth = 2; for (let i = 0; i < 5; i++) { X.beginPath(); X.moveTo(s * .6, -s * .4 + i * s * .2); X.lineTo(s * .3, -s * .55 + i * s * .25); X.stroke(); } }
      X.fillStyle = n.hit > 0 ? '#ffffff' : k.col; X.beginPath(); X.ellipse(s * 1.2, 0, s * .55, s * .42, 0, 0, 6.28); X.fill();
      X.fillStyle = '#f4efe2'; for (let i = 0; i < 3; i++) { X.beginPath(); X.moveTo(s * (1.35 + i * .12), s * .1); X.lineTo(s * (1.4 + i * .12), s * .35); X.lineTo(s * (1.45 + i * .12), s * .1); X.fill(); }
      X.fillStyle = k.glow || '#e8f0d0'; X.beginPath(); X.arc(s * 1.35, -s * .15, 3, 0, 6.28); X.fill();
      X.restore();
      if (k.glow) D.glow(n.x, n.y, 90, .5);
      D.hpBar(n);
    },
    isopod(n) {
      const X = D.X, k = n.k, s = n.s;
      X.save(); X.translate(n.x, n.y);
      X.strokeStyle = css(shade(hex(k.col[1]), -.1)); X.lineWidth = 2.5;
      for (let i = 0; i < 6; i++) for (const side of [-1, 1]) { const y = -s * .7 + i * s * .3; X.beginPath(); X.moveTo(side * s * .72, y); X.lineTo(side * s * 1.1, y + Math.sin(D.T * 12 + i + side) * 4 + 4); X.stroke(); }
      X.beginPath(); X.moveTo(-s * .2, -s * 1.1); X.quadraticCurveTo(-s * .8, -s * 1.8, -s * 1.1, -s * 1.5 + Math.sin(D.T * 3) * 3);
      X.moveTo(s * .2, -s * 1.1); X.quadraticCurveTo(s * .8, -s * 1.8, s * 1.1, -s * 1.5 + Math.cos(D.T * 3) * 3); X.stroke();
      for (let i = 0; i < 8; i++) {
        const y = -s * 1.1 + i * s * .3, w = s * (.55 + .35 * Math.sin(Math.PI * (i + .6) / 8));
        X.beginPath(); X.ellipse(0, y + s * .15, w, s * .19, 0, 0, 6.28);
        const g = X.createLinearGradient(0, y, 0, y + s * .34); g.addColorStop(0, k.col[0]); g.addColorStop(1, k.col[1]);
        X.fillStyle = n.hit > 0 ? '#ffffff' : g; X.fill(); X.strokeStyle = 'rgba(40,30,60,.8)'; X.lineWidth = 1.5; X.stroke();
        if (k.crystal && i % 2) { X.fillStyle = 'rgba(230,220,255,.8)'; X.beginPath(); X.moveTo(-w * .4, y + s * .1); X.lineTo(-w * .2, y - s * .2); X.lineTo(0, y + s * .1); X.fill(); }
      }
      X.fillStyle = '#15121c'; X.beginPath(); X.arc(-s * .3, -s * .92, 3, 0, 6.28); X.arc(s * .3, -s * .92, 3, 0, 6.28); X.fill();
      X.restore();
      if (k.crystal) D.glow(n.x, n.y, 60, .35);
      D.hpBar(n);
    },
    squid(n) {
      const X = D.X, k = n.k, s = n.s, dir = n.vx >= 0 ? 1 : -1, pulse = Math.sin(n.ph * 2);
      X.save(); X.translate(n.x, n.y); X.rotate(dir * Math.PI / 2);
      X.strokeStyle = k.col; X.lineWidth = 3;
      for (let i = 0; i < 8; i++) { X.beginPath(); X.moveTo(-s * .5 + i * s * .14, s * .5); X.quadraticCurveTo(-s * .6 + i * s * .17 + pulse * 5, s * 1.2, -s * .7 + i * s * .2, s * 1.8 + pulse * 6); X.stroke(); }
      X.fillStyle = 'rgba(40,0,10,.6)'; X.beginPath(); X.moveTo(-s * .7, s * .5); X.quadraticCurveTo(0, s * 1.5, s * .7, s * .5); X.fill();
      X.beginPath(); X.moveTo(0, -s * 1.3); X.quadraticCurveTo(s * .9, -s * .2, s * .6, s * .6); X.lineTo(-s * .6, s * .6); X.quadraticCurveTo(-s * .9, -s * .2, 0, -s * 1.3);
      X.fillStyle = n.hit > 0 ? '#ffffff' : k.col; X.fill();
      X.fillStyle = '#ff4a5a'; X.beginPath(); X.arc(-s * .3, s * .2, 4, 0, 6.28); X.arc(s * .3, s * .2, 4, 0, 6.28); X.fill();
      X.restore(); D.glow(n.x, n.y, 45, .4); D.hpBar(n);
    },
    diver(n) {
      const X = D.X, s = n.s; X.save(); X.translate(n.x, n.y); X.rotate(Math.sin(n.ph * .5) * .4);
      X.fillStyle = '#5a5040'; X.fillRect(-s * .45, -s * .2, s * .9, s * 1.1);
      X.strokeStyle = '#5a5040'; X.lineWidth = s * .28; X.lineCap = 'round';
      X.beginPath(); X.moveTo(-s * .45, 0); X.lineTo(-s * 1, s * .5 + Math.sin(D.T + n.ph) * 5); X.moveTo(s * .45, 0); X.lineTo(s * .9, s * .6); X.moveTo(-s * .2, s * .9); X.lineTo(-s * .3, s * 1.6); X.moveTo(s * .2, s * .9); X.lineTo(s * .35, s * 1.6); X.stroke();
      const g = X.createRadialGradient(-s * .15, -s * .7, 2, 0, -s * .55, s * .55); g.addColorStop(0, '#e8c070'); g.addColorStop(1, '#8a5a1a');
      X.fillStyle = n.hit > 0 ? '#fff' : g; X.beginPath(); X.arc(0, -s * .55, s * .5, 0, 6.28); X.fill();
      X.fillStyle = '#0a1418'; X.beginPath(); X.arc(0, -s * .55, s * .24, 0, 6.28); X.fill();
      X.restore(); D.hpBar(n);
    },
    worm(n) {
      const X = D.X, k = n.k, s = n.s, hide = n.hide || 0;
      X.save(); X.translate(n.x, n.y);
      for (let i = 0; i < 4; i++) {
        const ox = (i - 1.5) * s * .45, h = s * (1.2 + (i % 2) * .5);
        X.fillStyle = '#e8e2d2'; X.fillRect(ox - 4, -h, 8, h + s * .5);
        if (hide < .8) { X.fillStyle = n.hit > 0 ? '#fff' : k.col; X.beginPath(); X.arc(ox, -h - 4 * (1 - hide), 8 * (1 - hide) + 1, 0, 6.28); X.fill(); }
      }
      X.fillStyle = '#3a2a20'; X.beginPath(); X.ellipse(0, s * .5, s * 1.1, s * .3, 0, 0, 6.28); X.fill();
      X.restore(); D.hpBar(n);
    },
    sentinel(n) {
      const X = D.X, s = n.s; X.save(); X.translate(n.x, n.y); X.rotate(Math.sin(n.ph * .4) * .1);
      const g = X.createLinearGradient(-s, 0, s, 0); g.addColorStop(0, '#4a5a54'); g.addColorStop(.5, '#8a9a90'); g.addColorStop(1, '#3a4a44');
      X.fillStyle = n.hit > 0 ? '#fff' : g;
      X.fillRect(-s * .6, -s * .4, s * 1.2, s * 1.6);
      X.beginPath(); X.arc(0, -s * .7, s * .45, 0, 6.28); X.fill();
      X.fillRect(-s * 1, -s * .3, s * .35, s * 1); X.fillRect(s * .65, -s * .3, s * .35, s * 1);
      X.fillStyle = 'rgba(140,255,220,' + (.6 + Math.sin(D.T * 3 + n.ph) * .3) + ')'; X.fillRect(-s * .3, -s * .78, s * .6, 5);
      X.strokeStyle = 'rgba(20,30,28,.6)'; X.lineWidth = 2; X.beginPath(); X.moveTo(-s * .3, 0); X.lineTo(s * .2, s * .4); X.lineTo(-s * .1, s * .9); X.stroke();
      X.restore(); D.glow(n.x, n.y - n.s * .7, 40, .35); D.hpBar(n);
    },
    idol(n) {
      const X = D.X, s = n.s; X.save(); X.translate(n.x, n.y);
      X.fillStyle = n.hit > 0 ? '#fff' : '#b8866a';
      X.beginPath(); X.moveTo(-s * .6, s); X.lineTo(-s * .5, -s * .3); X.quadraticCurveTo(0, -s * 1.5, s * .5, -s * .3); X.lineTo(s * .6, s); X.closePath(); X.fill();
      X.fillStyle = '#e06a6a'; for (let i = 0; i < 6; i++) { X.beginPath(); X.arc(Math.sin(i * 2.1) * s * .5, Math.cos(i * 1.3) * s * .6, s * .15, 0, 6.28); X.fill(); }
      X.fillStyle = '#1a0a08'; X.beginPath(); X.arc(-s * .2, -s * .4, 3, 0, 6.28); X.arc(s * .2, -s * .4, 3, 0, 6.28); X.fill();
      X.restore(); D.hpBar(n);
    },
    wraith(n) {
      const X = D.X, s = n.s, sw = Math.sin(D.T * 2 + n.ph);
      X.save(); X.translate(n.x, n.y);
      X.fillStyle = n.hit > 0 ? '#fff' : 'rgba(30,20,28,.92)';
      X.beginPath(); X.moveTo(0, -s * 1.3); X.quadraticCurveTo(s, -s, s * .8, s * .6); for (let i = 4; i >= 0; i--) X.lineTo(-s * .8 + i * s * .4, s * (1 + (i % 2) * .3 + sw * .1)); X.quadraticCurveTo(-s, -s, 0, -s * 1.3); X.fill();
      X.strokeStyle = '#8a8f96'; X.lineWidth = 3; X.setLineDash([6, 4]);
      X.beginPath(); X.moveTo(-s, -s * .4); X.lineTo(s, s * .2); X.moveTo(-s, s * .3); X.lineTo(s, -s * .3); X.stroke(); X.setLineDash([]);
      X.fillStyle = '#ff5a3c'; X.beginPath(); X.arc(-s * .25, -s * .6, 2.5, 0, 6.28); X.arc(s * .25, -s * .6, 2.5, 0, 6.28); X.fill();
      X.restore(); D.glow(n.x, n.y - n.s * .6, 40, .4); D.hpBar(n);
    },
  };

  function drawJelly(n, cols, shadow) {
    const X = D.X, s = n.s, p = Math.sin(n.ph * 1.6);
    X.save(); X.translate(n.x, n.y);
    X.strokeStyle = 'rgba(235,160,255,.55)'; X.lineWidth = 1.6;
    for (let i = 0; i < 7; i++) { const x0 = -s * .8 + i * s * .27; X.beginPath(); X.moveTo(x0, s * .15); for (let j = 1; j <= 7; j++) X.lineTo(x0 + Math.sin(n.ph + i * .8 + j * .7) * (3 + j), s * .15 + j * s * .38); X.stroke(); }
    X.strokeStyle = 'rgba(255,190,240,.7)'; X.lineWidth = 4;
    for (const o of [-.2, .2]) { X.beginPath(); X.moveTo(s * o, s * .1); X.quadraticCurveTo(s * o * 3 + Math.sin(n.ph) * 6, s * 1.2, s * o * 2, s * 1.9); X.stroke(); }
    X.scale(1 + p * .06, 1 - p * .08);
    X.beginPath(); X.moveTo(-s, s * .15); X.bezierCurveTo(-s * 1.05, -s * 1.2, s * 1.05, -s * 1.2, s, s * .15);
    for (let i = 5; i >= 0; i--) X.quadraticCurveTo(-s + (i + .5) * s * 2 / 6, s * .38, -s + i * s * 2 / 6, s * .15);
    X.closePath();
    const g = X.createRadialGradient(0, -s * .4, 2, 0, -s * .2, s * 1.1);
    g.addColorStop(0, cols[0]); g.addColorStop(.6, cols[1]); g.addColorStop(1, cols[2]);
    X.fillStyle = n.hit > 0 ? '#fff' : g; X.shadowColor = shadow; X.shadowBlur = 18; X.fill(); X.shadowBlur = 0;
    X.fillStyle = 'rgba(255,240,250,.5)'; X.beginPath(); X.ellipse(0, -s * .3, s * .4, s * .25, 0, 0, 6.28); X.fill();
    X.restore();
    D.glow(n.x, n.y, 95, .6);
  }

  D.hpBar = function (n) {
    if (!n.max || n.hp >= n.max || n.hp <= 0) return;
    const X = D.X, w = n.s * 2;
    X.fillStyle = 'rgba(0,0,0,.55)'; X.fillRect(n.x - w / 2, n.y - n.s * 1.7, w, 4);
    X.fillStyle = '#ff7a59'; X.fillRect(n.x - w / 2, n.y - n.s * 1.7, w * Math.max(0, n.hp / n.max), 4);
  };
  D.drawThing = function (n, pal) {
    const f = DRAW[n.k.draw];
    if (f) f(n, pal);
    if (D.creatureGlow && n.k.cls === 'creature') D.glow(n.x, n.y, 60 + 20 * D.creatureGlow, .25 + .15 * D.creatureGlow);
    if (n.burnT > 0) D.glow(n.x, n.y, 50, .5);
  };
  D.drawNewTag = function (n) {
    const X = D.X;
    X.globalAlpha = Math.min(1, n.isNew);
    X.font = '15px ' + D.FONT.mono; X.textAlign = 'center';
    const label = 'NEW · ' + n.k.name.toUpperCase(), w = X.measureText(label).width + 16;
    X.fillStyle = 'rgba(3,8,15,.85)'; X.fillRect(n.x - w / 2, n.y - n.s * 2 - 34, w, 24);
    X.fillStyle = '#3fe0c5'; X.fillText(label, n.x, n.y - n.s * 2 - 17);
    X.globalAlpha = 1;
  };
})();
