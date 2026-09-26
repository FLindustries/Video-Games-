// Sound: effects, the drill motor, and generated music for each zone. Everything is synthesised.
(function () {
  const TB = globalThis.TB = globalThis.TB || {};
  const A = TB.audio = { ctx: null, ready: false };
  let master, musicBus, sfxBus, delay, fb, motor, noise, lastT = {};
  let music = null, zoneMusic = -1, bossOn = false, nextBeat = 0, beat = 0, timer = null;

  A.unlock = function () {
    try {
      if (!A.ctx) {
        const ctx = A.ctx = new (window.AudioContext || window.webkitAudioContext)();
        master = ctx.createGain(); master.connect(ctx.destination);
        musicBus = ctx.createGain(); musicBus.connect(master);
        sfxBus = ctx.createGain(); sfxBus.connect(master);
        // soft echo for the music
        delay = ctx.createDelay(1.5); delay.delayTime.value = .38; fb = ctx.createGain(); fb.gain.value = .38;
        const dl = ctx.createBiquadFilter(); dl.type = 'lowpass'; dl.frequency.value = 1800;
        delay.connect(dl).connect(fb).connect(delay); dl.connect(musicBus);
        // drill motor and grinding
        const o = ctx.createOscillator(), og = ctx.createGain(), f = ctx.createBiquadFilter();
        o.type = 'sawtooth'; o.frequency.value = 55; f.type = 'lowpass'; f.frequency.value = 320; og.gain.value = 0;
        o.connect(f).connect(og).connect(sfxBus); o.start();
        const buf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate), d = buf.getChannelData(0);
        for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
        A.noiseBuf = buf;
        const nz = ctx.createBufferSource(), bp = ctx.createBiquadFilter(), ng = ctx.createGain();
        nz.buffer = buf; nz.loop = true; bp.type = 'bandpass'; bp.frequency.value = 600; bp.Q.value = .9; ng.gain.value = 0;
        nz.connect(bp).connect(ng).connect(sfxBus); nz.start();
        motor = { o, og }; noise = { bp, ng };
        A.ready = true;
        A.applyVolumes();
        timer = setInterval(schedule, 90);
      }
      if (A.ctx.state === 'suspended') A.ctx.resume();
    } catch (e) { A.ready = false; }
  };

  A.applyVolumes = function () {
    if (!A.ready) return;
    const s = TB.settings, t = A.ctx.currentTime;
    master.gain.setTargetAtTime(s.master, t, .05);
    musicBus.gain.setTargetAtTime(s.music, t, .05);
    sfxBus.gain.setTargetAtTime(s.sfx, t, .05);
  };

  // name: [start Hz, end Hz, seconds, wave, volume, noise?]
  const FX = {
    brk: [300, 90, .14, 'square', .05], ore: [620, 240, .16, 'triangle', .07], bubble: [500, 1100, .14, 'sine', .07],
    sting: [220, 70, .3, 'sawtooth', .07], bite: [160, 60, .22, 'sawtooth', .08], buy: [440, 880, .12, 'triangle', .08],
    no: [180, 150, .1, 'square', .03], boss: [55, 110, 1.4, 'sawtooth', .09], block: [140, 120, .06, 'square', .03],
    sonar: [1200, 400, .6, 'sine', .05], win: [220, 880, 1.2, 'triangle', .09], lucky: [880, 1760, .25, 'triangle', .06],
    radio: [1800, 1700, .04, 'square', .012], squish: [180, 60, .2, 'sawtooth', .05], boom: [90, 30, .6, 'sawtooth', .12, 1],
    torpedo: [700, 300, .25, 'sawtooth', .03], zap: [1500, 200, .2, 'square', .04], relic: [523, 1046, .5, 'triangle', .09],
    pearl: [988, 1480, .3, 'sine', .08], crit: [900, 500, .08, 'square', .035], achieve: [660, 1320, .6, 'triangle', .08],
    heartbeat: [60, 40, .25, 'sine', .14],
  };
  A.sfx = function (name, pitch = 1) {
    if (!A.ready) return;
    const t = A.ctx.currentTime;
    if (lastT[name] && t - lastT[name] < .05) return;
    lastT[name] = t;
    const f = FX[name]; if (!f) return;
    try {
      const [f0, f1, dur, type, vol, nz] = f, v = pitch * (.94 + Math.random() * .12);
      const g = A.ctx.createGain();
      g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
      g.connect(sfxBus);
      const o = A.ctx.createOscillator();
      o.type = type; o.frequency.setValueAtTime(f0 * v, t); o.frequency.exponentialRampToValueAtTime(f1 * v, t + dur);
      o.connect(g); o.start(t); o.stop(t + dur + .02);
      if (nz) {
        const s = A.ctx.createBufferSource(), lp = A.ctx.createBiquadFilter();
        s.buffer = A.noiseBuf; lp.type = 'lowpass'; lp.frequency.value = 500;
        s.connect(lp).connect(g); s.start(t); s.stop(t + dur);
      }
    } catch (e) {}
  };

  A.motor = function (on, grind) {
    if (!A.ready) return;
    const t = A.ctx.currentTime;
    motor.og.gain.setTargetAtTime(on ? .014 + grind * .03 : 0, t, .05);
    motor.o.frequency.setTargetAtTime(55 + grind * 35 + (on ? Math.random() * grind * 12 : 0), t, .03);
    noise.ng.gain.setTargetAtTime(on ? grind * .09 : 0, t, .04);
    noise.bp.frequency.setTargetAtTime(420 + grind * 500 + Math.random() * grind * 300, t, .03);
  };

  // ---------- music ----------
  const hz = m => 440 * Math.pow(2, (m - 69) / 12);
  function makePad(z) {
    const ctx = A.ctx, t = ctx.currentTime, M = TB.zones[z].music;
    const out = ctx.createGain(); out.gain.value = 0; out.connect(musicBus);
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 250 + M.bright * 900; lp.Q.value = 2; lp.connect(out);
    const lfo = ctx.createOscillator(), lg = ctx.createGain(); lfo.frequency.value = .07; lg.gain.value = 180 * M.bright + 60; lfo.connect(lg).connect(lp.frequency); lfo.start();
    const oscs = [lfo];
    const chord = [0, M.scale[2] || 7, 12];
    chord.forEach((iv, i) => {
      for (const det of [-7, 7]) {
        const o = ctx.createOscillator(); o.type = M.harsh && i === 1 ? 'square' : 'sawtooth';
        o.frequency.value = hz(M.root - 24 + iv); o.detune.value = det + (M.harsh ? 30 * Math.random() : 0);
        const g = ctx.createGain(); g.gain.value = .045 / (i + 1); o.connect(g).connect(lp); o.start(); oscs.push(o);
      }
    });
    const sub = ctx.createOscillator(); sub.type = 'sine'; sub.frequency.value = hz(M.root - 36);
    const sg = ctx.createGain(); sg.gain.value = .06; sub.connect(sg).connect(out); sub.start(); oscs.push(sub);
    out.gain.setTargetAtTime(1, t, 2.5);
    return { out, oscs, M };
  }
  function note(m, t, dur, vol, type) {
    const ctx = A.ctx, o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type || 'triangle'; o.frequency.value = hz(m);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .02); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    o.connect(g); g.connect(musicBus); g.connect(delay); o.start(t); o.stop(t + dur + .05);
  }
  function kick(t, vol) {
    const ctx = A.ctx, o = ctx.createOscillator(), g = ctx.createGain();
    o.frequency.setValueAtTime(90, t); o.frequency.exponentialRampToValueAtTime(38, t + .25);
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0001, t + .3);
    o.connect(g).connect(musicBus); o.start(t); o.stop(t + .32);
  }
  function schedule() {
    if (!music || !A.ready) return;
    const ctx = A.ctx, M = music.M, spb = .62 / M.tempo * (bossOn ? .75 : 1);
    while (nextBeat < ctx.currentTime + .25) {
      const t = Math.max(nextBeat, ctx.currentTime);
      if (Math.random() < (bossOn ? .8 : .45)) {
        const deg = M.scale[Math.floor(Math.random() * M.scale.length)], oct = Math.random() < .3 ? 24 : 12;
        note(M.root + deg + oct, t, spb * (1.5 + Math.random() * 2), .05 * (.6 + M.bright * .6), M.metal && Math.random() < .3 ? 'square' : 'triangle');
      }
      if (M.harsh && Math.random() < .12) note(M.root + 6 + 12, t, spb * 3, .03, 'sawtooth');
      if (bossOn && beat % 2 === 0) kick(t, .16);
      if (bossOn && beat % 4 === 3) note(M.root - 12, t, spb, .06, 'square');
      nextBeat += spb; beat++;
    }
  }
  A.setZone = function (z) {
    if (!A.ready || z === zoneMusic) return;
    const t = A.ctx.currentTime;
    if (music) { const old = music; old.out.gain.setTargetAtTime(0, t, 1.2); setTimeout(() => old.oscs.forEach(o => { try { o.stop(); } catch (e) {} }), 5000); }
    zoneMusic = z;
    music = z < 0 ? null : makePad(z);
    nextBeat = t + .5;
  };
  A.setBoss = on => { bossOn = on; };
})();
