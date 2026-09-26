// Drawing the nine bosses and their health bar.
(function () {
  const TB = globalThis.TB;
  const D = TB.draw;
  const openAmt = (b, still, speed) => still ? 1 : !b.def.cycle ? 1 : b.open ? Math.min(1, b.phaseT * speed) : Math.max(0, 1 - b.phaseT * speed);

  const BOSS = {
    clam(b, still) {
      const X = D.X, r = b.def.r, open = openAmt(b, still, 4), lift = 10 + open * 58, flash = b.hit > 0;
      X.fillStyle = flash ? '#ffd9e6' : '#c9607c';
      X.beginPath(); X.ellipse(0, -4, r * .92, 12 + open * 30, 0, 0, 6.28); X.fill();
      X.fillStyle = '#e88aa3';
      for (let i = -6; i <= 6; i++) { X.beginPath(); X.arc(i * r * .14, -4 - open * 24, 7, 0, 6.28); X.fill(); }
      if (open > .2) {
        const pg = X.createRadialGradient(-8, -18, 3, 0, -10, 26); pg.addColorStop(0, '#ffffff'); pg.addColorStop(1, '#c8d6ff');
        X.fillStyle = pg; X.beginPath(); X.arc(0, -10, 22 * open, 0, 6.28); X.fill();
        D.glow(b.x, b.y - 10, 140 * open, .6);
      }
      const shell = up => {
        X.save(); X.translate(0, up ? -lift : 6); X.beginPath();
        if (up) { X.moveTo(-r, 0); X.bezierCurveTo(-r, -r * .9, r, -r * .9, r, 0); } else { X.moveTo(-r, 0); X.bezierCurveTo(-r * .95, r * .75, r * .95, r * .75, r, 0); }
        for (let i = 12; i >= 0; i--) X.lineTo(-r + i * r * 2 / 12, (i % 2 ? (up ? 10 : -10) : 0));
        X.closePath();
        const g = X.createLinearGradient(0, up ? -r * .8 : 0, 0, up ? 0 : r * .7);
        g.addColorStop(0, up ? '#8f86a8' : '#4a4460'); g.addColorStop(1, up ? '#4d4663' : '#2a2638');
        X.fillStyle = g; X.fill(); X.strokeStyle = '#1d1a28'; X.lineWidth = 3; X.stroke();
        X.strokeStyle = 'rgba(20,16,30,.45)';
        for (let i = -4; i <= 4; i++) { X.beginPath(); X.moveTo(i * r * .23, 0); X.lineTo(i * r * .1, up ? -r * .66 : r * .52); X.stroke(); }
        X.fillStyle = 'rgba(120,150,110,.5)';
        for (let i = 0; i < 5; i++) { X.beginPath(); X.arc(-r * .6 + i * r * .3, (up ? -1 : 1) * r * (.3 + (i % 2) * .15), 6, 0, 6.28); X.fill(); }
        X.restore();
      };
      shell(false); shell(true);
    },
    angler(b, still) {
      const X = D.X, r = b.def.r, flash = b.hit > 0;
      X.scale(b.face, 1);
      X.beginPath();
      X.moveTo(r * 1.1, -r * .15); X.bezierCurveTo(r * .9, -r * 1.05, -r * .7, -r * 1.0, -r * 1.05, -r * .1);
      X.lineTo(-r * 1.6, -r * .6 + Math.sin(b.t * 5) * 8); X.lineTo(-r * 1.5, 0); X.lineTo(-r * 1.6, r * .6 + Math.sin(b.t * 5) * 8); X.lineTo(-r * 1.0, r * .2);
      X.bezierCurveTo(-r * .6, r * .95, r * .8, r * 1.0, r * 1.2, r * .45); X.closePath();
      const g = X.createLinearGradient(0, -r, 0, r); g.addColorStop(0, '#3a4a52'); g.addColorStop(1, '#0c1214');
      X.fillStyle = flash ? '#6f8791' : g; X.fill(); X.strokeStyle = '#56707a'; X.lineWidth = 3; X.stroke();
      X.fillStyle = '#050606'; X.beginPath(); X.moveTo(r * 1.1, -r * .1); X.quadraticCurveTo(r * .35, r * .1, r * 1.2, r * .45); X.closePath(); X.fill();
      X.fillStyle = '#eee8d8';
      for (let i = 0; i < 7; i++) { const t = i / 6, x = r * (1.08 - t * .5 + t * t * .45), y = -r * .08 + t * r * .12; X.beginPath(); X.moveTo(x - 4, y); X.lineTo(x, y + 18 + (i % 2) * 10); X.lineTo(x + 4, y); X.fill(); }
      for (let i = 0; i < 6; i++) { const t = i / 5, x = r * (1.15 - t * .5 + t * t * .4), y = r * .43 - t * r * .05; X.beginPath(); X.moveTo(x - 4, y); X.lineTo(x, y - 16 - (i % 2) * 8); X.lineTo(x + 4, y); X.fill(); }
      X.fillStyle = '#e8f0e0'; X.beginPath(); X.arc(r * .45, -r * .45, 9, 0, 6.28); X.fill();
      X.fillStyle = '#000'; X.beginPath(); X.arc(r * .47, -r * .45, 4, 0, 6.28); X.fill();
      const lx = r * 1.45 + Math.sin(b.t * 2.5) * 10, ly = -r * 1.35 + Math.cos(b.t * 2) * 6;
      X.strokeStyle = '#56707a'; X.lineWidth = 4; X.beginPath(); X.moveTo(r * .2, -r * .9); X.quadraticCurveTo(r * .9, -r * 1.9, lx, ly); X.stroke();
      X.fillStyle = '#fff6c9'; X.shadowColor = '#fff1a0'; X.shadowBlur = 30; X.beginPath(); X.arc(lx, ly, 11, 0, 6.28); X.fill(); X.shadowBlur = 0;
      D.glow(b.x + b.face * lx, b.y + ly, still ? 60 : 320, .95);
    },
    eye(b, still) {
      const X = D.X, r = b.def.r, open = openAmt(b, still, 3), flash = b.hit > 0;
      X.fillStyle = '#1d0b12'; X.beginPath();
      for (let i = 0; i <= 24; i++) { const a = i / 24 * 6.283, rr = r * (1.45 + .12 * Math.sin(a * 5 + b.t * 1.5) + .06 * Math.sin(a * 11 - b.t)); i ? X.lineTo(Math.cos(a) * rr, Math.sin(a) * rr * .8) : X.moveTo(Math.cos(a) * rr, Math.sin(a) * rr * .8); }
      X.closePath(); X.fill();
      X.strokeStyle = 'rgba(160,30,50,.55)'; X.lineWidth = 2.5;
      for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283; X.beginPath(); X.moveTo(Math.cos(a) * r * 1.02, Math.sin(a) * r * .82); X.quadraticCurveTo(Math.cos(a + .3) * r * 1.25, Math.sin(a + .3) * r, Math.cos(a + .1) * r * 1.4, Math.sin(a + .1) * r * 1.1); X.stroke(); }
      eyeball(0, 0, r, open, flash, still ? null : b, '#ffe07a', '#f0602a');
      D.glow(b.x, b.y, (still ? 60 : 260) * (.3 + open * .7), .8);
    },
    hollow(b, still) {
      const X = D.X, r = b.def.r, flash = b.hit > 0;
      X.rotate(Math.sin(b.t * .8) * .12);
      X.strokeStyle = '#3a4a2a'; X.lineWidth = 7; X.lineCap = 'round';
      for (let i = 0; i < 5; i++) { X.beginPath(); X.moveTo(-r * .3 + i * r * .15, r * .7); X.bezierCurveTo(-r * .6 + i * r * .3, r * 1.3, -r + i * r * .5 + Math.sin(b.t * 2 + i) * 20, r * 1.6, -r * 1.1 + i * r * .55, r * 2 + Math.sin(b.t * 1.5 + i) * 15); X.stroke(); }
      const g = X.createRadialGradient(-r * .3, -r * .35, 6, 0, 0, r);
      g.addColorStop(0, flash ? '#fff' : '#b89a4a'); g.addColorStop(.6, '#7a6428'); g.addColorStop(1, '#3a2e10');
      X.fillStyle = g; X.beginPath(); X.arc(0, 0, r, 0, 6.28); X.fill(); X.strokeStyle = '#1e1808'; X.lineWidth = 4; X.stroke();
      X.fillStyle = 'rgba(90,120,80,.7)';
      for (let i = 0; i < 14; i++) { const a = i * 2.3; X.beginPath(); X.arc(Math.cos(a) * r * .75, Math.sin(a) * r * .7, 6 + (i % 3) * 3, 0, 6.28); X.fill(); }
      X.fillStyle = '#2a2208'; X.fillRect(-r, r * .3, r * 2, r * .18);
      X.fillStyle = '#e8e2d2'; X.font = '18px ' + D.FONT.big; X.textAlign = 'center'; X.fillText('HERON', 0, r * .44);
      X.fillStyle = '#55595e'; X.beginPath(); X.arc(0, -r * .1, r * .42, 0, 6.28); X.fill();
      const pg = X.createRadialGradient(0, -r * .1, 3, 0, -r * .1, r * .32); pg.addColorStop(0, '#ffb0a0'); pg.addColorStop(1, '#8a0a0a');
      X.fillStyle = pg; X.beginPath(); X.arc(0, -r * .1, r * .32, 0, 6.28); X.fill();
      X.strokeStyle = 'rgba(20,0,0,.8)'; X.lineWidth = 2; X.beginPath(); X.moveTo(-r * .25, -r * .3); X.lineTo(0, -r * .05); X.lineTo(r * .2, -r * .3); X.moveTo(0, -r * .05); X.lineTo(r * .05, r * .15); X.stroke();
      D.glow(b.x, b.y - r * .1, 200, .8);
    },
    wyrm(b, still) {
      const X = D.X, r = b.def.r, up = openAmt(b, still, 2), flash = b.hit > 0;
      const trail = still ? Array.from({ length: 14 }, (_, i) => [-i * r * .55, Math.sin(i * .7) * r * .4]) : b.trail.map(([x, y]) => [x - b.x, y - b.y]);
      X.globalAlpha = .35 + up * .65;
      for (let i = trail.length - 1; i >= 1; i--) {
        const [x, y] = trail[i], rr = r * (.75 - i * .035);
        const g = X.createRadialGradient(x - rr * .3, y - rr * .3, 2, x, y, rr);
        g.addColorStop(0, '#6a2a18'); g.addColorStop(1, '#1a0806');
        X.fillStyle = g; X.beginPath(); X.arc(x, y + (1 - up) * 80, rr, 0, 6.28); X.fill();
        X.strokeStyle = '#ff7a2a'; X.lineWidth = 2; X.beginPath(); X.arc(x, y + (1 - up) * 80, rr * .7, -1, .4); X.stroke();
      }
      X.translate(0, (1 - up) * 80);
      X.scale(b.face, 1);
      X.fillStyle = flash ? '#fff' : '#3a140c';
      X.beginPath(); X.moveTo(-r * .6, -r * .6); X.quadraticCurveTo(r * .8, -r * .8, r * 1.3, -r * .15); X.lineTo(r * .3, 0); X.lineTo(r * 1.3, r * .25); X.quadraticCurveTo(r * .8, r * .7, -r * .6, r * .6); X.closePath(); X.fill();
      X.strokeStyle = '#ff7a2a'; X.lineWidth = 3; X.stroke();
      X.fillStyle = '#f4efe2'; for (let i = 0; i < 5; i++) { X.beginPath(); X.moveTo(r * (.5 + i * .17), -r * .1); X.lineTo(r * (.55 + i * .17), r * .1); X.lineTo(r * (.6 + i * .17), -r * .1); X.fill(); }
      X.fillStyle = '#ffd24a'; X.beginPath(); X.arc(r * .55, -r * .38, 7, 0, 6.28); X.fill();
      X.fillStyle = '#000'; X.fillRect(r * .53, -r * .45, 3, 14);
      X.globalAlpha = 1;
      D.glow(b.x, b.y, 220 * (.4 + up * .6), .7);
    },
    king(b, still) {
      const X = D.X, r = b.def.r, flash = b.hit > 0, sh = still ? 1 : b.shieldMax ? b.shield / b.shieldMax : 0;
      X.fillStyle = '#20302c';
      X.beginPath(); X.moveTo(-r * .9, r); X.lineTo(-r * .55, -r * .2); X.lineTo(r * .55, -r * .2); X.lineTo(r * .9, r); X.closePath(); X.fill();
      X.strokeStyle = '#6a8a7a'; X.lineWidth = 3; X.stroke();
      X.fillStyle = flash ? '#fff' : '#d8d0b8';
      X.beginPath(); X.ellipse(0, -r * .5, r * .38, r * .45, 0, 0, 6.28); X.fill();
      X.fillStyle = '#10100c'; X.beginPath(); X.ellipse(-r * .14, -r * .55, r * .1, r * .13, 0, 0, 6.28); X.ellipse(r * .14, -r * .55, r * .1, r * .13, 0, 0, 6.28); X.fill();
      X.fillStyle = '#3aff9a'; X.beginPath(); X.arc(-r * .14, -r * .55, 3, 0, 6.28); X.arc(r * .14, -r * .55, 3, 0, 6.28); X.fill();
      X.fillStyle = '#10100c'; for (let i = -2; i <= 2; i++) X.fillRect(i * r * .07 - 3, -r * .25, 5, 12);
      X.fillStyle = '#d9a441'; X.beginPath(); X.moveTo(-r * .4, -r * .85); for (let i = 0; i <= 4; i++) { X.lineTo(-r * .4 + i * r * .2, -r * (i % 2 ? 1.05 : 1.3)); } X.lineTo(r * .4, -r * .85); X.closePath(); X.fill();
      X.fillStyle = '#ff3b5c'; X.beginPath(); X.arc(0, -r * 1.05, 6, 0, 6.28); X.fill();
      X.strokeStyle = '#d8d0b8'; X.lineWidth = 10; X.lineCap = 'round';
      X.beginPath(); X.moveTo(-r * .5, -r * .1); X.lineTo(-r * 1.0, r * .3 + Math.sin(b.t) * 10); X.moveTo(r * .5, -r * .1); X.lineTo(r * 1.0, r * .2 + Math.cos(b.t) * 10); X.stroke();
      X.strokeStyle = '#d9a441'; X.lineWidth = 5; X.beginPath(); X.moveTo(r * 1.0, r * .2); X.lineTo(r * 1.1, -r * 1.2); X.stroke();
      if (sh > 0) {
        X.strokeStyle = 'rgba(255,120,110,' + (.4 + sh * .5) + ')'; X.lineWidth = 10 + sh * 8;
        for (let i = 0; i < 16; i++) { const a = i / 16 * 6.28 + b.t * .2; if (i / 16 > sh) continue; X.beginPath(); X.arc(0, 0, r * 1.25, a, a + .32); X.stroke(); }
      }
      D.glow(b.x, b.y - r * .5, 160, .6);
    },
    titan(b, still) {
      const X = D.X, r = b.def.r, refl = still ? 0 : b.def.cycle && !b.open ? 1 - openAmt(b, false, 3) : 0, flash = b.hit > 0;
      const shards = [[0, -r * .7, r * .45, r * .8], [-r * .7, -r * .1, r * .35, r * .7], [r * .7, -r * .1, r * .35, r * .7], [-r * .35, r * .55, r * .3, r * .6], [r * .35, r * .55, r * .3, r * .6], [0, r * .05, r * .5, r * .7]];
      for (const [x, y, w, h] of shards) {
        X.beginPath(); X.moveTo(x, y - h); X.lineTo(x + w, y - h * .2); X.lineTo(x + w * .7, y + h * .6); X.lineTo(x - w * .7, y + h * .6); X.lineTo(x - w, y - h * .2); X.closePath();
        const g = X.createLinearGradient(x - w, y, x + w, y);
        g.addColorStop(0, '#3a2e6a'); g.addColorStop(.5, refl > .3 ? '#ffffff' : '#c8b8ff'); g.addColorStop(1, '#2a2050');
        X.fillStyle = flash ? '#fff' : g; X.fill(); X.strokeStyle = 'rgba(230,220,255,.7)'; X.lineWidth = 2; X.stroke();
      }
      X.fillStyle = refl > .3 ? '#ffffff' : '#ff6aa0'; X.beginPath(); X.arc(0, -r * .75, 9, 0, 6.28); X.fill();
      D.glow(b.x, b.y, 200 + refl * 200, .6 + refl * .3);
    },
    warden(b, still) {
      const X = D.X, r = b.def.r, flash = b.hit > 0;
      X.strokeStyle = '#6a6e74'; X.lineWidth = 5; X.setLineDash([10, 6]);
      for (let i = 0; i < 6; i++) { const a = i / 6 * 6.28 + b.t * .1; X.beginPath(); X.moveTo(0, 0); X.lineTo(Math.cos(a) * r * 2.4, Math.sin(a) * r * 2.4); X.stroke(); }
      X.setLineDash([]);
      X.fillStyle = flash ? '#fff' : '#1a1418';
      X.beginPath(); X.moveTo(0, -r * 1.3); X.lineTo(r * .7, -r * .5); X.lineTo(r * .8, r * 1.1); X.lineTo(-r * .8, r * 1.1); X.lineTo(-r * .7, -r * .5); X.closePath(); X.fill();
      X.strokeStyle = '#8a3a2a'; X.lineWidth = 4; X.stroke();
      X.fillStyle = '#2a2024'; X.fillRect(-r * .35, -r * .3, r * .7, r * .8);
      X.strokeStyle = '#8a8f96'; X.lineWidth = 3; for (let i = 0; i < 4; i++) { X.beginPath(); X.moveTo(-r * .35 + i * r * .23, -r * .3); X.lineTo(-r * .35 + i * r * .23, r * .5); X.stroke(); }
      const fl = .7 + Math.sin(b.t * 9) * .3;
      X.fillStyle = 'rgba(255,120,40,' + fl + ')'; X.beginPath(); X.arc(0, r * .1, r * .18, 0, 6.28); X.fill();
      X.fillStyle = '#ff5a3c'; X.fillRect(-r * .25, -r * .85, r * .5, 6);
      D.glow(b.x, b.y + r * .1, 180, .8 * fl);
    },
    heart(b, still) {
      const X = D.X, r = b.def.r, beat = 1 + Math.max(0, Math.sin(b.t * 4)) * .06, flash = b.hit > 0;
      X.scale(beat, beat);
      X.fillStyle = flash ? '#ffd0d8' : '#5a0a1a';
      X.beginPath();
      for (let i = 0; i <= 32; i++) { const a = i / 32 * 6.283, rr = r * (1 + .12 * Math.sin(a * 6 + b.t * 2) + .05 * Math.sin(a * 13 - b.t * 3)); i ? X.lineTo(Math.cos(a) * rr, Math.sin(a) * rr * .85) : X.moveTo(Math.cos(a) * rr, Math.sin(a) * rr * .85); }
      X.closePath(); X.fill();
      X.strokeStyle = 'rgba(255,80,90,.6)'; X.lineWidth = 3;
      for (let i = 0; i < 10; i++) { const a = i / 10 * 6.283 + .3; X.beginPath(); X.moveTo(Math.cos(a) * r * .2, Math.sin(a) * r * .2); X.quadraticCurveTo(Math.cos(a + .5) * r * .7, Math.sin(a + .5) * r * .6, Math.cos(a) * r * 1.05, Math.sin(a) * r * .9); X.stroke(); }
      const open = openAmt(b, still, 3), n = still ? 5 : b.eyes || 1;
      const spots = [[0, 0, .38], [-.55, -.35, .2], [.55, -.35, .2], [-.5, .4, .18], [.5, .4, .18]];
      spots.slice(0, n).forEach(([x, y, s]) => eyeball(x * r, y * r, r * s, open, flash, still ? null : b, '#fff0a0', '#ff2a3a'));
      D.glow(b.x, b.y, 300, .9);
    },
  };

  function eyeball(x, y, r, open, flash, b, c0, c1) {
    const X = D.X;
    X.save(); X.translate(x, y);
    X.beginPath(); X.ellipse(0, 0, r, r * .78 * Math.max(.03, open), 0, 0, 6.28); X.save(); X.clip();
    const g = X.createRadialGradient(0, 0, 3, 0, 0, r);
    g.addColorStop(0, flash ? '#ffffff' : c0); g.addColorStop(.45, c1); g.addColorStop(1, '#3a0610');
    X.fillStyle = g; X.fillRect(-r, -r, 2 * r, 2 * r);
    const sub = TB.game && TB.game.sub;
    const px = b && sub ? TB.clamp((sub.x - b.x - x) * .12, -r * .35, r * .35) : 0, py = b && sub ? TB.clamp((sub.y - b.y - y) * .12, -r * .25, r * .25) : 0;
    X.fillStyle = '#080103'; X.beginPath(); X.ellipse(px, py, r * .12, r * .55, 0, 0, 6.28); X.fill();
    X.fillStyle = 'rgba(255,255,255,.6)'; X.beginPath(); X.arc(px - r * .25, py - r * .25, Math.max(2, r * .07), 0, 6.28); X.fill();
    X.restore();
    X.strokeStyle = '#3a1119'; X.lineWidth = Math.max(3, r * .07);
    X.beginPath(); X.ellipse(0, 0, r, r * .78 * Math.max(.03, open), 0, 0, 6.28); X.stroke();
    X.restore();
  }

  D.drawBoss = function (b, still) {
    const X = D.X;
    X.save(); X.translate(b.x, b.y);
    BOSS[b.id](b, still);
    X.restore();
  };
  D.drawBossBar = function (b) {
    const X = D.X, bw = 700, bx = 690, by = TB.SH - 58;
    X.textAlign = 'left'; X.font = '30px ' + D.FONT.big; X.fillStyle = '#f4efe2'; X.fillText(b.def.name.toUpperCase(), bx, by - 14);
    X.textAlign = 'right'; X.font = '16px ' + D.FONT.mono;
    let status = 'KEEP THE DRILL ON IT';
    if (b.def.cycle) status = b.open ? (b.def.reflect ? 'DULL · CUT NOW' : b.def.burrow ? 'SURFACED · CUT NOW' : 'OPEN · CUT NOW') : (b.def.reflect ? 'GLOWING · REFLECTS DAMAGE' : b.def.burrow ? 'BURROWED' : 'CLOSED · BLOCKING');
    if (b.shield > 0) status = 'BREAK THE CORAL SHIELD';
    if (b.chained > 0) status = 'CHAINED · MOVE TO BREAK FREE';
    X.fillStyle = b.open && b.def.cycle ? '#ff7a59' : '#8fb3c4'; X.fillText(status, bx + bw, by - 16);
    X.fillStyle = 'rgba(0,0,0,.6)'; X.fillRect(bx, by, bw, 14);
    X.fillStyle = '#ff7a59'; X.fillRect(bx, by, bw * Math.max(0, b.hp) / b.max, 14);
    if (b.shieldMax) { X.fillStyle = '#ff9ab0'; X.fillRect(bx, by - 6, bw * Math.max(0, b.shield) / b.shieldMax, 5); }
    X.strokeStyle = 'rgba(244,239,226,.4)'; X.lineWidth = 1; X.strokeRect(bx, by, bw, 14);
  };
})();
