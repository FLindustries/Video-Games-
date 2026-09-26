// Boot: stage scaling, input, the frame loop.
(function () {
  const TB = globalThis.TB, G = TB.game, D = TB.draw, UI = TB.ui;
  const $ = id => document.getElementById(id);
  const cv = $('cv'), stage = $('stage'), vp = $('viewport');
  D.X = cv.getContext('2d');
  D.shadeCv = document.createElement('canvas'); D.lctx = D.shadeCv.getContext('2d');
  Object.assign(TB.settings, TB.loadSettings());

  function fit() {
    const r = vp.getBoundingClientRect(), pad = 16;
    const k = TB.stageK = Math.max(.2, Math.min((r.width - pad * 2) / TB.SW, (r.height - pad * 2) / TB.SH));
    stage.style.transform = 'scale(' + k + ')';
    stage.style.left = ((r.width - TB.SW * k) / 2) + 'px';
    stage.style.top = ((r.height - TB.SH * k) / 2) + 'px';
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = D.shadeCv.width = Math.round(TB.SW * k * dpr);
    cv.height = D.shadeCv.height = Math.round(TB.SH * k * dpr);
    D.X.setTransform(k * dpr, 0, 0, k * dpr, 0, 0);
    D.lctx.setTransform(k * dpr, 0, 0, k * dpr, 0, 0);
    if (UI.resize) UI.resize();
  }
  try { new ResizeObserver(fit).observe(vp); } catch (e) { addEventListener('resize', fit); }

  cv.addEventListener('pointermove', e => {
    const r = stage.getBoundingClientRect(), k = TB.stageK;
    G.ptr.x = (e.clientX - r.left) / k; G.ptr.y = (e.clientY - r.top) / k; G.ptr.moved = performance.now();
  });
  addEventListener('keydown', e => {
    const key = e.key.toLowerCase();
    if ((key === 'escape' || key === 'p') && G.mode === 'dive') { e.preventDefault(); UI.setPause(!G.paused); return; }
    G.keys[key] = true;
    if (G.mode === 'dive' && e.key.startsWith('Arrow')) e.preventDefault();
  });
  addEventListener('keyup', e => { G.keys[e.key.toLowerCase()] = false; });
  addEventListener('blur', () => { for (const k in G.keys) G.keys[k] = false; });
  document.addEventListener('visibilitychange', () => { if (document.hidden && G.mode === 'dive') UI.setPause(true); });

  let last = performance.now();
  function frame(now) {
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    try {
      G.update(dt);
      if (G.mode === 'title' || G.mode === 'dive') G.draw();
      else if (G.mode === 'dock') UI.tickTree();
    } catch (err) { console.error(err); }
    requestAnimationFrame(frame);
  }

  // keep progress when a new version of the page is published mid-session
  const hot = globalThis.claude && globalThis.claude.hot;
  try { hot && hot.snapshot && hot.snapshot(() => ({ S: G.S })); } catch (e) {}
  function boot(data) {
    G.S = (data && data.S) ? Object.assign(TB.newSave(), data.S) : TB.load();
    G.st = TB.statsFor(G.S);
    fit();
    UI.openTitle();
    requestAnimationFrame(frame);
  }
  if (hot && hot.ready) hot.ready(boot); else boot((hot && hot.data) || {});
})();
