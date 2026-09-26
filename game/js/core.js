// Trenchbore: shared helpers. Every other file hangs its pieces off the TB namespace.
// Works in the browser and in Node (the balance simulator loads the data files too).
(function () {
  const TB = globalThis.TB = globalThis.TB || {};

  TB.SW = 1600; TB.SH = 900;          // fixed stage, scaled to the window
  TB.ZONE_LEN = 50;                   // balance units ("L") per zone
  TB.settings = TB.settings || { notation: 'short' };

  TB.clamp = (v, a, b) => v < a ? a : v > b ? b : v;
  TB.lerp = (a, b, t) => a + (b - a) * t;
  TB.rand = (a, b) => a + Math.random() * (b - a);
  TB.pick = arr => arr[Math.floor(Math.random() * arr.length)];
  TB.angDiff = (a, b) => ((a - b + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI;
  TB.weighted = (table) => {
    let total = 0;
    for (const k in table) total += table[k];
    let r = Math.random() * total;
    for (const k in table) { r -= table[k]; if (r <= 0) return k; }
    return Object.keys(table)[0];
  };

  const SUF = ['', 'k', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'];
  TB.fmt = (n) => {
    if (!isFinite(n)) return '∞';
    const neg = n < 0; n = Math.abs(n);
    let out;
    if (n < 1e4) out = String(Math.floor(n));
    else if (TB.settings.notation === 'sci') out = n.toExponential(2).replace('+', '');
    else {
      const e = Math.min(SUF.length - 1, Math.floor(Math.log10(n) / 3));
      const v = n / Math.pow(10, 3 * e);
      out = (v < 10 ? v.toFixed(2) : v < 100 ? v.toFixed(1) : v.toFixed(0)) + SUF[e];
    }
    return (neg ? '−' : '') + out;
  };
  TB.fmtDepth = (m) => m < 1000 ? m.toFixed(1) + ' m' : (m / 1000).toFixed(m < 10000 ? 2 : 1) + ' km';
  TB.fmtTime = (s) => {
    s = Math.floor(s);
    const h = Math.floor(s / 3600), m = Math.floor(s / 60) % 60, sec = s % 60;
    return (h ? h + ':' + String(m).padStart(2, '0') : m) + ':' + String(sec).padStart(2, '0');
  };

  // colours as [r, g, b] arrays
  TB.hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  TB.mixA = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
  TB.css = (a, al) => al == null ? 'rgb(' + a.map(Math.round).join(',') + ')' : 'rgba(' + a.map(Math.round).join(',') + ',' + al + ')';
  TB.shade = (a, f) => f >= 0 ? a.map(v => v + (255 - v) * f) : a.map(v => v * (1 + f));

  if (typeof module !== 'undefined' && module.exports) module.exports = TB;
})();
