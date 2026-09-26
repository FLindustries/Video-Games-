// Everything the game says: radio lines, the Heron's logs, endings, credits.
(function () {
  const TB = globalThis.TB = globalThis.TB || {};

  TB.radio = {
    // per zone: on entering, near the floor, and after its boss
    zone: [
      { enter: 'Minnow, you are in the water. Meridian wants ore from this trench. The survey sub Heron went down here last year and never came up. Grind ore, watch your oxygen, come back up.',
        near: 'Sonar has something big at the bottom of the shelf. Something with a shell.',
        down: 'The clam is done. Meridian says keep going. So do you.' },
      { enter: 'Twilight zone. Past here the fish have teeth.',
        near: 'There is a light moving down there. Fish do not carry lights. Mostly.',
        down: 'Nice work. The buyers want to know what that lure was made of.' },
      { enter: 'Midnight Trench. Your lamp is all you have now. Keep it on the rock.',
        near: 'Minnow, the return below you is the size of the ship. Stop. It is looking up.',
        down: 'It closed its eye and sank. Meridian is sending down a pressure hull. They seem very keen.' },
      { enter: 'Wreck Graveyard. Ships from four different centuries. And the Heron’s transponder, pinging, faint.',
        near: 'That is the Heron. Minnow... her hull is moving.',
        down: 'The Heron is quiet. Her log pages are scattered in the wrecks. Bring them up.' },
      { enter: 'The vents. The water out there is two hundred degrees. Stay out of the plumes.',
        near: 'Something is swimming through the vents. Swimming. Through the vents.',
        down: 'Wyrm down. The heat readings did not drop. They went up.' },
      { enter: 'Minnow, that is a city. Streets. Doors. Nobody told us about a city.',
        near: 'The walls all say the same thing. I cannot read it. The Heron’s pilot could.',
        down: 'The king is dead. Meridian says the floor under the city is hollow. They want you to go through it. They are paying triple.' },
      { enter: 'You are under the trench floor. No water out there, just rock and pressure. Your oxygen will burn faster.',
        near: 'The crystal is singing. The mic picks it up on every channel.',
        down: 'Titan down. Minnow, when you get up, there is something about this contract I need to tell yo— [static]' },
      { enter: '[static] ...nnow... it is red down there... do not trust the... [static]',
        near: 'Minnow. This is the captain. Everything is fine. Keep drilling. Keep. Drilling.',
        down: '[The captain laughs. It is not the captain’s laugh.]' },
      { enter: 'The depth gauge reads 66,666 metres. That is not a real depth. Nothing down here is real.',
        near: 'IT HAS BEEN WAITING FOR A DRILL.',
        down: '' },
    ],
    first: {
      bubble: 'Air pockets. Bump them with the hull or the drill, they top up your tank.',
      copper: 'That orange glint is copper. Worth four boulders. Grind it.',
      jelly: 'Jellyfish. Keep them off the hull. Their sting cracks the seals.',
      hermit: 'A hermit crab. Meridian buys those too. Do not ask what for.',
      iron: 'Iron nodules. Heavy, slow to cut, and the buyers love them.',
      viper: 'Viperfish. Fast. Do not chase it. Let it swim into the drill.',
      lantern: 'A school of lanternfish. Sweep through them.',
      moray: 'Eels in the kelp. They bite the hull. Watch the walls.',
      oyster: 'A pearl oyster. Crack it. Pearls buy the good parts.',
      isopod: 'Isopods. Armour like a tank. Grind slow.',
      vsquid: 'Vampire squid. Cut it and it inks. You will be blind for a few seconds.',
      frilled: 'Frilled shark, and it is coming for the hull. Meet it with the drill.',
      scrap: 'Scrap steel. Salvage is salvage.',
      mine: 'Minnow, those are mines. Old ones. Do not touch them with anything you like.',
      diver: 'That is a diver. In an old suit. Check the pockets. I am sorry.',
      cache: 'A strongbox. Cut it open. Relics in those, sometimes logs.',
      geyser: 'Geyser. Boiling water. Stay clear or get shielding.',
      tubeworm: 'Tube worms. The whole vent wall is alive.',
      sentinel: 'Did that statue just move?',
      carved: 'Carved stone. The same symbol on every block.',
      pocket: 'Pressure pocket. If that goes off near you, you will feel it.',
      soul: 'Minnow, what is that. What is that light.',
      wraith: 'Those chains. Minnow, those are the Heron’s winch chains.',
    },
    hullLimit: 'Hull limit. The Minnow will not go deeper without a pressure hull. Check the workshop.',
    firstBoss: 'Every zone floor has something guarding it. Beat it and the winch drops you deeper next time.',
  };

  TB.heronLogs = {
    heron1: 'HERON LOG, DAY 1. Meridian hired me to survey the trench for ore. The captain keeps asking how deep the sonar reaches. Odd question for a mining company.',
    heron2: 'DAY 9. Found wrecks older than the company. Every one was a salvage sub. Every one had a Meridian contract in the cockpit.',
    heron3: 'DAY 14. The vents are too hot for rock this shallow. Something below is warming the whole trench. The captain told me to keep going. She has never sounded this keen.',
    heron4: 'DAY 20. The city walls repeat one sentence. It took me a week to read. "Do not wake the one below. It waits for a drill." Meridian has been sending drills for a hundred years.',
    heron5: 'DAY 23. Under the floor. The captain’s voice is wrong now. I do not think the ship has had a captain for a long time. I think the thing below talks through the radio.',
    heron6: 'LAST ENTRY. If you are reading this in a yellow sub: it wants you to break it open. That is how it gets out. There is another way. The seal is written on the city walls. Say it back to the Heart. Do not break it. Seal it.',
  };

  TB.endings = {
    break: { title: 'The Heart is broken',
      lines: ['You break the Heart.', 'For one second there is silence on every channel.', 'Then the trench closes over the Minnow like a hand.', 'Far above, a ship with no captain lowers its winch again.'] },
    seal: { title: 'The Heart is sealed',
      lines: ['You read the words from the Heron’s log into the radio.', 'The Heart stops beating. The red light goes out, one crack at a time.', 'The winch cable goes tight. Something is pulling you up.', 'For the first time, the radio is just static.'] },
  };

  TB.credits = [
    ['Trenchbore', ''],
    ['Design and direction', 'FL Industries'],
    ['Code, art and sound', 'Generated with Claude, all drawn and synthesised in code'],
    ['Thanks', 'Everyone who played the demo'],
  ];

  if (typeof module !== 'undefined' && module.exports) module.exports = { radio: TB.radio };
})();
