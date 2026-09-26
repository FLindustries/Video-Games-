// 40 achievements, checked after dives, purchases and key moments.
(function () {
  const TB = globalThis.TB = globalThis.TB || {};
  const beat = id => S => S.beaten.includes(id);
  const lv = (S, id) => S.lv[id] || 0;
  const owned = S => Object.keys(S.lv).filter(k => S.lv[k] > 0).length;
  const relicCount = S => Object.keys(S.relics).length;
  const A = (id, name, desc, test) => ({ id, name, desc, test });
  TB.achievements = [
    A('dive1', 'Wet Paint', 'Finish your first dive.', S => S.dives >= 1),
    A('dive25', 'Regular', 'Finish 25 dives.', S => S.dives >= 25),
    A('dive100', 'Company Pilot', 'Finish 100 dives.', S => S.dives >= 100),
    A('clam', 'Shucked', 'Beat the Giant Clam.', beat('clam')),
    A('angler', 'Lights Out', 'Beat the Anglerfish.', beat('angler')),
    A('eye', 'Blind Spot', 'Beat the Leviathan.', beat('eye')),
    A('hollow', 'Survey Complete', 'Beat the Hollow Survey.', beat('hollow')),
    A('wyrm', 'Out of the Vents', 'Beat the Vent Wyrm.', beat('wyrm')),
    A('king', 'Regicide', 'Beat the Drowned King.', beat('king')),
    A('titan', 'Shattered', 'Beat the Crystal Titan.', beat('titan')),
    A('warden', 'Unchained', 'Beat the Warden.', beat('warden')),
    A('heart', 'The Bottom', 'Face the Thing That Waits.', S => S.endings.length > 0),
    A('km1', 'One Kilometre', 'Reach 1 km.', S => S.bestM >= 1000),
    A('km10', 'Ten Kilometres', 'Reach 10 km.', S => S.bestM >= 10000),
    A('km50', 'Fifty Kilometres', 'Reach 50 km.', S => S.bestM >= 50000),
    A('steel', 'Upgrade', 'Fit the Steel Head.', S => lv(S, 'head1') > 0),
    A('diamond', 'Forever', 'Fit the Diamond Head.', S => lv(S, 'head4') > 0),
    A('heartstone', 'Heart of Stone', 'Fit the Heartstone Head.', S => lv(S, 'head7') > 0),
    A('parts10', 'Tinkerer', 'Own 10 different parts.', S => owned(S) >= 10),
    A('parts40', 'Engineer', 'Own 40 different parts.', S => owned(S) >= 40),
    A('parts81', 'Every Bolt', 'Own all 81 parts.', S => owned(S) >= 81),
    A('maxdrill', 'Full Torque', 'Max out the Drill Motor.', S => lv(S, 'drill1') >= 10),
    A('relic1', 'Finders Keepers', 'Find your first relic.', S => relicCount(S) >= 1),
    A('relic12', 'Curator', 'Own 12 relics.', S => relicCount(S) >= 12),
    A('relic24', 'The Whole Case', 'Own all 24 relics.', S => relicCount(S) >= 24),
    A('rank3', 'Polished', 'Rank a relic up to III.', S => Object.values(S.relics).some(r => r >= 3)),
    A('logs', 'Last Entry', 'Find all six Heron logs.', S => [1, 2, 3, 4, 5, 6].every(i => S.relics['heron' + i])),
    A('seal', 'Sealed', 'Seal the Heart.', S => S.endings.includes('seal')),
    A('break', 'Broken', 'Break the Heart.', S => S.endings.includes('break')),
    A('logbook', 'Marine Biologist', 'See every kind of creature and ore.', S => Object.keys(TB.kinds).every(k => S.seen[k])),
    A('broken1k', 'Thousand Cuts', 'Break 1,000 targets.', S => S.broken >= 1000),
    A('broken10k', 'Strip Miner', 'Break 10,000 targets.', S => S.broken >= 10000),
    A('lucky', 'Lucky Strike', 'Get a ×5 lucky find.', S => S.luckies >= 1),
    A('bubbles', 'Deep Breath', 'Pop 500 air pockets.', S => S.bubbles >= 500),
    A('jelly', 'Brave', 'Drill a jellyfish.', S => S.jellyDrilled >= 1),
    A('flawless', 'Untouched', 'Beat a boss without getting stung or bitten.', S => S.flawless >= 1),
    A('arms', 'Octopus', 'Fit the Third Arm.', S => lv(S, 'drill13') > 0),
    A('drones', 'Swarm', 'Run three drones.', S => lv(S, 'sys6') > 0),
    A('rich', 'Company Money', 'Hold one billion credits.', S => S.maxCr >= 1e9),
    A('speed', 'Record Descent', 'Reach an ending in under 3 hours of play.', S => S.endings.length > 0 && S.endTime > 0 && S.endTime < 3 * 3600),
  ];
  if (typeof module !== 'undefined' && module.exports) module.exports = TB.achievements;
})();
