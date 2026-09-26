// Saving: one main save, three rotating backups, export and import as text.
(function () {
  const TB = globalThis.TB = globalThis.TB || {};
  const KEY = 'trenchbore.save', SKEY = 'trenchbore.settings', VERSION = 1;

  TB.newSave = () => ({
    v: VERSION, lv: { core: 1 }, cr: 0, sp: 0, pe: 0,
    beaten: [], seen: {}, heard: [], relics: {},
    dives: 0, play: 0, bestL: 0, bestM: 0, broken: 0, bubbles: 0, luckies: 0, jellyDrilled: 0, flawless: 0,
    endings: [], endTime: 0, ng: 0, maxCr: 0, ach: {}, control: 'arm', tut: {}, cam: null, lastBackup: 0,
  });
  TB.defaultSettings = () => ({ master: .8, music: .55, sfx: .8, notation: 'short', shake: 1, particles: 1, flashes: 1 });

  const ls = {
    get: k => { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); return true; } catch (e) { return false; } },
    del: k => { try { localStorage.removeItem(k); } catch (e) {} },
  };

  function migrate(d) {
    const S = Object.assign(TB.newSave(), d);
    S.lv = Object.assign({ core: 1 }, d.lv || {});
    S.v = VERSION;
    return S;
  }
  function parse(raw) {
    if (!raw) return null;
    try { const d = JSON.parse(raw); return d && typeof d === 'object' && d.lv ? migrate(d) : null; } catch (e) { return null; }
  }

  TB.save = function (S) {
    const raw = JSON.stringify(S);
    ls.set(KEY, raw);
    // keep a backup every few minutes of play
    if (S.play - S.lastBackup > 180) {
      S.lastBackup = S.play;
      ls.set(KEY + '.bak3', ls.get(KEY + '.bak2') || '');
      ls.set(KEY + '.bak2', ls.get(KEY + '.bak1') || '');
      ls.set(KEY + '.bak1', raw);
    }
  };
  TB.load = function () {
    return parse(ls.get(KEY)) || parse(ls.get(KEY + '.bak1')) || parse(ls.get(KEY + '.bak2')) || parse(ls.get(KEY + '.bak3')) || TB.newSave();
  };
  TB.wipe = function () { [KEY, KEY + '.bak1', KEY + '.bak2', KEY + '.bak3'].forEach(ls.del); };
  TB.exportSave = S => btoa(unescape(encodeURIComponent(JSON.stringify(S))));
  TB.importSave = str => { try { return parse(decodeURIComponent(escape(atob(str.trim())))); } catch (e) { return null; } };

  TB.loadSettings = () => { try { return Object.assign(TB.defaultSettings(), JSON.parse(ls.get(SKEY) || '{}')); } catch (e) { return TB.defaultSettings(); } };
  TB.saveSettings = s => ls.set(SKEY, JSON.stringify(s));
})();
