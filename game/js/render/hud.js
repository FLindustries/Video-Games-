// The dive HUD: depth, oxygen, haul, depth gauge, radio, hints.
(function () {
  const TB = globalThis.TB;
  const D = TB.draw;
  const glitch = (s, amt) => amt <= 0 ? s : s.split('').map(c => c !== ' ' && Math.random() < amt ? '█▓▒░#%$&'[Math.floor(Math.random() * 8)] : c).join('');

  function wrap(text, w) {
    const X = D.X, words = text.split(' '), out = []; let line = '';
    for (const wd of words) { const t = line ? line + ' ' + wd : wd; if (X.measureText(t).width > w && line) { out.push(line); line = wd; } else line = t; }
    if (line) out.push(line);
    return out;
  }
  D.wrap = wrap;

  D.drawHud = function (G) {
    const X = D.X, R = G.run, S = G.S, st = G.st, z = TB.zoneAtL(R.boss || R.ending ? R.L - .01 : R.L), F = D.FONT, SW = TB.SW, SH = TB.SH;
    const gl = z.i >= 7 ? (z.i === 8 ? .08 : .03) : 0;
    X.textAlign = 'left';
    // depth readout
    X.fillStyle = 'rgba(3,8,15,.62)'; X.fillRect(28, 26, 320, 124);
    X.strokeStyle = 'rgba(244,239,226,.18)'; X.lineWidth = 1; X.strokeRect(28, 26, 320, 124);
    X.font = '15px ' + F.mono; X.fillStyle = '#8fb3c4'; X.fillText('DEPTH', 44, 50);
    X.textAlign = 'right'; X.fillText(glitch(z.name.toUpperCase(), gl), 334, 50); X.textAlign = 'left';
    let m = TB.metersAtL(R.L), dtx;
    if (z.i === 8) dtx = Math.random() < .15 ? String(Math.floor(Math.random() * 99999)) : '66,666';
    else dtx = m < 1000 ? m.toFixed(1) : m < 10000 ? (m / 1000).toFixed(2) : (m / 1000).toFixed(1);
    const unit = z.i === 8 ? 'm' : m < 1000 ? 'm' : 'km';
    X.font = '60px ' + F.big; X.fillStyle = '#f4efe2'; X.fillText(glitch(dtx, gl), 42, 116);
    const dw = X.measureText(dtx).width; X.font = '24px ' + F.mono; X.fillStyle = '#8fb3c4'; X.fillText(unit, 50 + dw, 114);
    X.font = '14px ' + F.mono; X.fillStyle = 'rgba(143,179,196,.8)'; X.fillText('DRILL ' + TB.fmt(st.dps) + ' DMG/S', 44, 140);

    // oxygen
    const low = R.air < 3, kAir = TB.clamp(R.air / R.maxAir, 0, 1), ow = 460, ox = SW / 2 - ow / 2;
    X.font = '15px ' + F.mono; X.fillStyle = '#8fb3c4'; X.fillText('O₂' + (z.air > 1 ? '  ·  BURNING ×' + z.air : ''), ox, 44);
    X.textAlign = 'right'; X.fillStyle = low ? '#ff7a59' : '#f4efe2'; X.fillText(R.air.toFixed(1) + ' s', ox + ow, 44); X.textAlign = 'left';
    X.fillStyle = 'rgba(3,8,15,.6)'; X.fillRect(ox, 54, ow, 16);
    X.fillStyle = low && Math.sin(D.T * 18) > 0 ? '#f4efe2' : low ? '#ff7a59' : '#9fe6ff'; X.fillRect(ox, 54, ow * kAir, 16);
    X.strokeStyle = 'rgba(244,239,226,.35)'; X.strokeRect(ox, 54, ow, 16);
    X.fillStyle = 'rgba(3,8,15,.6)'; for (let i = 1; i < 10; i++) X.fillRect(ox + ow * i / 10 - 1, 54, 2, 16);
    if (R.emergencyUsed === 1) { X.font = '14px ' + F.mono; X.fillStyle = '#9fe6ff'; X.fillText('EMERGENCY O₂ USED', ox, 90); }

    // haul
    X.textAlign = 'right'; X.font = '46px ' + F.big; X.fillStyle = '#f6c453';
    const ft = TB.fmt(S.cr + R.cr); X.fillText(ft, SW - 40, 82);
    const fw = X.measureText(ft).width; X.beginPath(); X.arc(SW - 64 - fw, 66, 12, 0, 6.28); X.fill();
    X.font = '15px ' + F.mono; X.fillStyle = '#8fb3c4'; X.fillText('+' + TB.fmt(R.cr) + ' THIS DIVE', SW - 40, 106);
    let yy = 132;
    if (st.specimens || S.sp > 0) { X.fillStyle = '#7be08a'; X.fillText('SPECIMENS ' + TB.fmt(S.sp + R.sp) + (R.sp ? '  +' + R.sp : ''), SW - 40, yy); yy += 22; }
    if (S.pe > 0 || R.pe > 0 || S.beaten.length) { X.fillStyle = '#e8e2ff'; X.fillText('PEARLS ' + TB.fmt(S.pe + R.pe) + (R.pe ? '  +' + R.pe : ''), SW - 40, yy); }

    // depth gauge down the right edge: all nine zones
    const gx = SW - 44, top = 190, bot = 760, n = TB.zones.length, yOf = L => top + (bot - top) * L / (n * TB.ZONE_LEN);
    X.fillStyle = 'rgba(244,239,226,.2)'; X.fillRect(gx - 1, top, 2, bot - top);
    const lim = TB.hullZones(S);
    TB.zones.forEach((zz, i) => {
      const y = yOf(zz.L1), beat = S.beaten.includes(zz.boss);
      X.fillStyle = beat ? '#3fe0c5' : i < lim ? '#ff7a59' : '#4a5560';
      X.beginPath(); X.arc(gx, y, 5, 0, 6.28); X.fill();
    });
    if (lim < n) { const y = yOf(lim * TB.ZONE_LEN); X.fillStyle = '#ff7a59'; X.fillRect(gx - 12, y - 1, 24, 3); X.font = '12px ' + F.mono; X.textAlign = 'right'; X.fillText('HULL', gx - 16, y + 4); }
    const ym = yOf(R.L);
    X.fillStyle = '#f0b429'; X.beginPath(); X.moveTo(gx + 6, ym); X.lineTo(gx + 18, ym - 7); X.lineTo(gx + 18, ym + 7); X.closePath(); X.fill();
    X.textAlign = 'left';

    // radio
    const rc = G.radioCur;
    if (rc) {
      const shown = rc.text.slice(0, Math.floor(rc.t * 45));
      const fade = Math.min(1, (rc.text.length / 45 + 4.5 - rc.t) * 2);
      X.globalAlpha = Math.max(0, fade);
      X.font = '18px ' + F.mono;
      const lines = wrap(rc.text, 560), sl = wrap(shown, 560);
      const h = 44 + lines.length * 24, y0 = SH - 40 - h;
      X.fillStyle = 'rgba(3,8,15,.82)'; X.fillRect(28, y0, 600, h);
      X.fillStyle = rc.who !== 'SURFACE' ? '#f0b429' : z.i >= 7 ? '#ff5a3c' : '#3fe0c5'; X.fillRect(28, y0, 4, h);
      X.font = '14px ' + F.mono; X.fillText(glitch(rc.who === 'SURFACE' ? 'SURFACE · CH 16' : rc.who, rc.who === 'SURFACE' ? gl * 2 : 0), 46, y0 + 24);
      X.font = '18px ' + F.mono; X.fillStyle = '#e4f1f7';
      sl.forEach((l, i) => X.fillText(glitch(l, gl), 46, y0 + 50 + i * 24));
      X.globalAlpha = 1;
    } else if (!R.boss) {
      X.font = '14px ' + F.mono; X.fillStyle = 'rgba(143,179,196,.6)'; X.fillText('ESC · PAUSE', 32, SH - 26);
    }
    // hint line
    if (G.hint && G.hint.t > 0) {
      X.globalAlpha = Math.min(1, G.hint.t); X.textAlign = 'center'; X.font = '20px ' + F.body;
      const w = X.measureText(G.hint.text).width + 36;
      X.fillStyle = 'rgba(3,8,15,.78)'; X.fillRect(SW / 2 - w / 2, SH - 150, w, 38);
      X.fillStyle = '#f0b429'; X.fillText(G.hint.text, SW / 2, SH - 124);
      X.globalAlpha = 1; X.textAlign = 'left';
    }
    if (R.atLimit) {
      X.textAlign = 'center'; X.font = '22px ' + F.big; X.fillStyle = Math.sin(D.T * 5) > 0 ? '#ff7a59' : '#f4efe2';
      X.fillText('HULL LIMIT · BUY A PRESSURE HULL TO GO DEEPER', SW / 2, 120); X.textAlign = 'left';
    }
  };
})();
