# Design and UI Patterns in Top Small / Active / Mining Incrementals (for "Trenchbore")

Scope note: these notes cover Nodebuster, Row Divers, Void Scrappers, Ball x Pit, Holedown, Idle Slayer, Mr. Mine, A Game About Digging A Hole, Super Motherload, Dome Keeper, Vampire Survivors, Balatro and Dave the Diver. Several pages were unreachable during research (the Idle Slayer Fandom wiki returned HTTP 402; game-vault.net, bytetavern.com and namu.wiki returned 403). Many fine-grained UI details, such as exact tooltip placement and reveal animations in Nodebuster, could not be confirmed in text sources. Those are listed under Gaps rather than guessed. I could not find a Steam game called "Loot Blasters". Searches returned Loot Loop, BORE BLASTERS and Loot Frog instead ([search results](https://www.topincrementalgames.com/tag/skill-tree/steam)).

Baseline facts on the reference games:
- Nodebuster (Goblobin, released 13 Aug 2024) is "Overwhelmingly Positive", with 97% of 10,641 reviews positive. It has 13 Steam achievements. The store blurb reads: "Nodes are plentiful and ready to be extracted for resources. Harvest them to buy upgrades and become god." — [Steam](https://store.steampowered.com/app/3107330/Nodebuster/)
- Row Divers (hermurx, released 16 May 2025) is "Very Positive", with 84% of 190 reviews positive. It has 18 Steam achievements. The store page says "an incremental, linear progression game. Not a roguelike", and its goal line is "Master every skill to become the god of the row!" — [Steam](https://store.steampowered.com/app/2572300/Row_Divers/); [release news](https://store.steampowered.com/news/app/2572300/view/535476278554263936)
- Both games have a short total length. Nodebuster takes about 4 hours to 100% ([incrementaldb review](https://www.incrementaldb.com/community/review/5808); [Mancunion](https://mancunion.com/2025/05/08/nodebuster-review-a-short-and-sweet-incremental-game/)) and Row Divers about 2–3 hours ([Steam reviews](https://steamcommunity.com/app/2572300/reviews/?browsefilter=toprated)).

## 1. Missions / quests / achievements: concrete rewards and naming

### Takeaway
The best-loved games in this genre tie goals to real in-game payouts. Nodebuster's "Milestones" tab pays out currency. In Vampire Survivors, every achievement is an "Unlock" that gives content. Idle Slayer's "Quests" unlock systems and pay out materials. Mr. Mine pairs quests with depth milestones that open new systems. Players describe Steam achievements with no in-game payoff as "useless" and "functionally worthless". Common in-game names are Milestones, Quests (Main, Daily or Weekly), Unlocks, Blueprints and Relics. None of the sources call them "contracts".

### Cited Findings
- **Nodebuster, "Milestones" tab:** a dedicated milestones tab rewards players "with bits or nodes for reaching a certain threshold of enemies defeated." The rewards are currencies, not badges. — [Mancunion review](https://mancunion.com/2025/05/08/nodebuster-review-a-short-and-sweet-incremental-game/)
- **The Milestones tab is itself unlocked** through a node ("Milestones: Unlock the milestones tab"). The tab appears progressively and is not visible from minute one. — [Nodebuster Bible guide](https://www.mejoress.com/the-nodebuster-bible-complete-walkthrough-skill-tree-and-prestige-strategy/)
- **Nodebuster criticism:** "the 'Milestones' aren't calibrated to the content length -- I finished the game with three still incomplete despite the entire upgrade tree being long since finished." Goals that outlast the content feel pointless. — [incrementaldb review](https://www.incrementaldb.com/community/review/5808)
- **Vampire Survivors:** achievements are called "Unlocks" in-game. They "unlock new gameplay content when completed, including items, characters, stages, gameplay features, or gold coins." Examples:
  - Reach Level 5 unlocks the Wings passive item.
  - Survive 20 minutes unlocks the Pentagram weapon.
  - Opening the Mad Forest coffin unlocks the character Pugnala Provola.
  - Defeating Giant Blue Venus unlocks the Hyper Mad Forest stage mode.
  - Evolving the Whip unlocks 500 gold.

  Some Unlocks are hidden or secret, and some appear only after a prerequisite, such as Arcana Unlocks after finding Randomazzo. — [Vampire Survivors Wiki](https://vampire.survivors.wiki/w/Achievements)
- **Achievements as the unlock system:** "achievements ARE the unlock system — every character, weapon, passive item, stage, and gameplay mode is gated behind a specific achievement." — [search summary of Rogue Ranker / Fandom](https://rogueranker.com/vampire-survivors-achievements/)
- **Idle Slayer, "Quests" tab:** the tab "is unlocked by purchasing the Training Quests Upgrade, and further quests are unlocked by purchasing them as bundles with Coins." — [Idle Slayer Wiki (via search snippet)](https://idleslayer.fandom.com/wiki/Quests)
- **Idle Slayer Daily and Weekly Quests:** these are unlocked by crafting items (the Diary and the Itinerary). Each Daily Quest pays one Dragon Egg and each Weekly Quest pays one Simurgh Egg; both eggs are crafting materials. Weekly examples include "Open 160/180/200 Chests" and "Go through 45/55/60 Portals". — [Daily Quests wiki](https://idleslayer.fandom.com/wiki/Daily_Quests); [Weekly Quests wiki](https://idleslayer.fandom.com/wiki/Weekly_Quests)
- **Idle Slayer claim step:** main quests are "claimed", and Steam achievements are layered on top ("Claim 4 Quests", "Claim 8 Quests"…). The in-game quest is the thing that pays out; the Steam achievement mirrors it. — [Idle Slayer Steam Achievements Guide](https://steamcommunity.com/sharedfiles/filedetails/?id=2981185240)
- **Mr. Mine:** the game has "90+ quests to complete and achievements to unlock… complete them to earn valuable rewards." Reaching the Underground City at 300km "automatically unlock[s] another 15 quests." — [Mr. Mine blog / search summary](https://blog.mrmine.com/mr-mine-idle-underground-city-the-complete-guide/)
- **Mr. Mine depth milestones:** each milestone opens a system:

  | Depth | What opens |
  |---|---|
  | 10km | Super Miners |
  | 15km | Trading Post |
  | 45km | Cave Building (drones) |
  | 100km | Chest Collector |
  | 300–303km | Underground City (oil pumps, gem forges, weapons, monsters) |
  | 501km | The Core (sacrifice relics and materials for rewards) |
  | 1000–1032km | The Moon (second world) |

  — [Mr. Mine Milestones blog](https://blog.mrmine.com/mr-mine-idle-milestones/)
- **Ball x Pit, "Blueprints":** after bosses, a blueprint may drop on the ground. You grab it to permanently unlock a building. The level-select tile shows "how many undiscovered blueprints there are remaining there." This is a concrete, located, countable goal. — [search summary of Ball x Pit wiki / guides](https://ballxpit.wiki.gg/wiki/Blueprints)
- **Player sentiment on empty achievements:** Steam forum threads call achievements "just a small colored picture". Some players call them "useless" or "functionally worthless and not worth the time and effort". They say achievements "should be more rewarding or count to something bigger." — [Steam forum threads (search summary)](https://steamcommunity.com/discussions/forum/10/3004424478068764745); [thread 2](https://steamcommunity.com/discussions/forum/10/3722818378189073388)

### Inferences
- The strongest pattern is Vampire Survivors': the goal and the reward are the same object. Every goal names its payout, and Steam achievements merely mirror the in-game goal. For Trenchbore, each goal should pay something tangible, such as currency, a new module, a relic slot, a zone shortcut or a logbook page. A goal that pays nothing should not be shown.
- For names that fit a submarine theme and avoid "contracts", the genre precedents are "Milestones", "Quests" and "Unlocks". Theme-flavoured options include "Orders", "Dispatches", "Survey Tasks" or "Salvage Requests". These themed names are my suggestion, not taken from a source.
- The goal list must end before the content does. Nodebuster's uncompletable milestones are a known criticism.
- Idle Slayer's claim step, where the player clicks to collect, is a deliberate reward moment. This is inferred from its "Claim N Quests" wording; I did not see a video confirming the animation.

### Gaps
- The exact contents and reward amounts of Nodebuster's milestones (which thresholds, how many bits or nodes) could not be verified. The guide sites were blocked.
- I found no source saying whether Row Divers has an in-game quest or milestone system. Its store page lists only 18 Steam achievements and a skill tree.
- I did not find r/incremental_games threads specifically on this topic. Reddit was not reachable through search results.

## 2. Health bars vs visual damage

### Takeaway
Small or numerous targets in this genre usually show no persistent health bar. Instead they use a hit-count number (Holedown), multiple hits to break (Dome Keeper) or simply die fast (Vampire Survivors). Damage numbers are commonly toggleable because they add clutter. Bosses get an explicit health bar or threshold, and upgrades often reference boss health percentages.

### Cited Findings
- **Holedown:** each block "wears a number indicating the number of hits needed to take it out, which can easily be in the hundreds." Blocks marked with an X take down unsupported blocks when destroyed. The number is both the health bar and the strategy information. — [TapSmart / review summaries](https://www.tapsmart.com/games/review-holedown-ball-bouncing-block-breaking-blast/); [Pocket Gamer](https://www.pocketgamer.com/holedown/review/)
- **Dome Keeper:** "it takes several hits for your drill to break apart rock when starting a run." The upgrade feedback is simply faster digging, which "feels great and builds up with each upgrade purchased." — [search summary of Josh Anthony Design Dive](https://joshanthony.info/2023/05/24/design-dive-dome-keeper/)
- **Dome Keeper readability:** "The pixel art is crisp, and easy to read, so it doesn't take much effort to read the information I need." The juice is described as "wavy effects of the beam", "small particles" and a "satisfying _shoom_ sound". — [Josh Anthony, Design Dive: Dome Keeper](https://joshanthony.info/2023/05/24/design-dive-dome-keeper/)
- **Vampire Survivors damage numbers** can be disabled in options. Players say "enemies die so quickly that damage numbers are meaningless, and the screen is already busy." There is also a thread asking for damage numbers and flashing VFX to be mapped to toggles. — [Steam discussion](https://steamcommunity.com/app/1794680/discussions/0/3470612993483101082/); [toggle request](https://steamcommunity.com/app/1794680/discussions/0/663863457493310106/)
- **Vampire Survivors enemy health bars** (per a modding page) "disappear if you don't deal damage to them for at least three seconds". Bars show only on recently hit enemies rather than permanently. — [search summary referencing HealthBarViewer mod](https://github.com/6thmoon/HealthBarViewer)
- **A Game About Digging A Hole:** early on, "each punch of the shovel hardly leav[es] a dent in the ground", and "the speed quickly picks up as you gain upgrades." The visible dent or hole size is the damage feedback. — [search summary of reviews](https://www.thexboxhub.com/a-game-about-digging-a-hole-review/)
- **Void Scrappers boss upgrades** are phrased in terms of boss health, for example "automatically killing a boss when it comes to x%" and "decreasing the timer of when a boss spawns". Boss health must therefore be legible. — [Missi the Achievement Huntress review (search summary)](https://www.missitheachievementhuntress.com/void-scrappers-review/)
- **Nodebuster player health:** the player's health is the central bar. "A virus infecting your system… drains your health faster and faster the longer you stay in a wave." This "is your biggest blocker to progression." — [Higher Plain Games review](https://higherplaingames.com/pc/nodebuster-review/)
- **Nodebuster bosses** are purple, appear after surviving long enough, drop a "core" and advance prestige. One criticism: "killing the boss instantly ends the level but does not pick up any uncollected resources." — [Mancunion](https://mancunion.com/2025/05/08/nodebuster-review-a-short-and-sweet-incremental-game/); [incrementaldb review](https://www.incrementaldb.com/community/review/5808)
- **Clarity vs clutter, "Juice It or Lose It":** Jonasson and Purho's GDC Europe 2012 talk made the case for juice (shake, particles, sound) with the "Juicy Breakout" demo. — [GDC Vault](https://www.gdcvault.com/play/1016487/juice-it-or-lose); [YouTube](https://www.youtube.com/watch?v=Fy0aCDmgnxg)
- **Clarity vs clutter, counterpoint:** Folmer Kelly argued at GDC Europe's Independent Games Summit that "There has been such a tremendous focus on putting eye candy in our games… that the context doesn't get enough consideration." — [Game Developer](https://www.gamedeveloper.com/design/video-indies-resist-the-urge-to-juice-it-or-lose-it-)

### Inferences
- For Trenchbore's small rocks and fish, three options are recommended:
  - Crack stages on the sprite. About three stages would be my suggestion; it is not sourced.
  - A brief white hit-flash.
  - A tiny health bar that appears only after the first hit and fades after about 3 seconds, which is the Vampire Survivors behaviour.
- Use a Holedown-style number only for special tough blocks where hits-to-break is strategic.
- Bosses should get a large explicit bar with phase ticks, since upgrades and players reason in boss-HP percentages.
- Damage numbers should be optional, or shown only for crits and big hits.
- If a boss kill ends the dive, auto-collect loose loot on the kill. This avoids Nodebuster's most-cited annoyance.

### Gaps
- I found no developer commentary specifically on cracks vs health bars from Dome Keeper, Super Motherload or Mr. Mine. The Dome Keeper design article does not describe crack stages.
- I could not verify whether Nodebuster or Row Divers show health bars on regular enemies. No text source described it.

## 3. Upgrade tree presentation

### Takeaway
Nodebuster's and Row Divers' trees are large, pannable node graphs that "unfold" as you buy. Players specifically praise the Row Divers tree's look ("I stayed for the beautiful skill tree"). The main documented complaints are about navigation, since panning is right-click drag, and about samey node content. Dome Keeper is praised because "it's obvious what you're getting and what it leads to."

### Cited Findings
- **Nodebuster's tree unfolds:** "The skill tree in Nodebuster unfolds to help foster the feeling of progression." — [search summary of Steam guide "Nodebuster Full Skill Tree"](https://steamcommunity.com/sharedfiles/filedetails/?id=3414691532)
- **Nodebuster size and currencies:** the tree is "a giant node skill tree" using "6 different currencies". Each node has multiple levels with rising cost. — [Higher Plain Games](https://higherplaingames.com/pc/nodebuster-review/)
- **Nodebuster gating varies:** "Some nodes require you to invest just one point into a prerequisite node to unlock them, however, others demand that you maximize the current node." The tree is "flexible… allows you to spread resources without significant penalties." — [search summary of reviews / guides](https://www.incrementaldb.com/game/nodebuster)
- **Nodebuster branch structure:** the late game requires unlocking 9 named branches ("to infinity", "going nowhere", "void", "no return"…) to reach the Lab or godvirus. — [search summary of Steam guides](https://steamcommunity.com/app/3107330/guides/)
- **Nodebuster navigation complaint:** "the only way i can get to deeper branches is to zoom in and out until it finally decides to move". The answer was that panning is "holding in Right-Click and dragging." — [Steam discussion](https://steamcommunity.com/app/3107330/discussions/0/4845401462970658556/)
- **Nodebuster positive framing:** the tree does "a great job of making every upgrade feel rewarding" and is "intuitive and well streamlined". — [Mancunion](https://mancunion.com/2025/05/08/nodebuster-review-a-short-and-sweet-incremental-game/)
- **Nodebuster cost criticism:** "auto-pickup costs scale absurdly high (the last level… was literally the final upgrade I bought in the entire tree)". — [incrementaldb review](https://www.incrementaldb.com/community/review/5808)
- **Row Divers praise:** "I stayed for the beautiful skill tree." — [Steam reviews](https://steamcommunity.com/app/2572300/reviews/?browsefilter=toprated)
- **Row Divers criticism:** "most of the talents… are the same iterations of 'gain x health for y money' or 'gain x damage for y gems'." — [Steam reviews](https://steamcommunity.com/app/2572300/reviews/?browsefilter=toprated)
- **Dome Keeper:** "The upgrade UI is nice and clean, so it's obvious what you're getting and what it leads to in the progression tree." — [Josh Anthony](https://joshanthony.info/2023/05/24/design-dive-dome-keeper/)
- **Hidden-node convention in other tree incrementals:** "active nodes are golden, nodes that you can learn next are green and inactive and hidden nodes are dark greyish." Egg Tree Incremental has "Hidden Upgrades" visible only after reaching certain points. — [search summary, Incremental Skill Tree itch page](https://kingironfist101.itch.io/incremental-skill-tree); [Egg Tree Incremental wiki](https://egg-tree-incremental.fandom.com/wiki/Hidden_Upgrades)
- **Balatro's "?" convention is for a collection, not a tree:** undiscovered items show "a placeholder item with a question mark in the middle". Hovering shows "Not Discovered" plus "an instruction on how to discover the item." — [Balatro Wiki: Discoverability](https://balatrowiki.org/w/Discoverability)

### Inferences
- For Trenchbore's radial tree, the documented good pattern is a tree that unfolds from a centre as you buy. Show only purchased nodes plus the immediate next ring, dimmed and with real names, costs and effects.
- Do not show a field of "?" nodes. Balatro uses "?" in a collection, where a hover hint says how to discover the item; that is a different context from an upgrade tree.
- Support drag-to-pan with the left mouse button and touchpad plus scroll-zoom, and add a "recenter" button. Nodebuster's right-click-only panning confused laptop players.
- Show "current → next" values in the hover card. This is my recommendation, not verified for Nodebuster or Row Divers; Dome Keeper's praise for "obvious what you're getting" supports it.
- Avoid a tree made mostly of "+x% damage for y" nodes. Row Divers' critics call this out, so seed each branch with a few behaviour-changing nodes.
- A dark, clean background with glowing lines is consistent with Nodebuster's "minimalist, sci-fi vibe" ([Mancunion](https://mancunion.com/2025/05/08/nodebuster-review-a-short-and-sweet-incremental-game/)). A blueprint grid is not required by any reference game.

### Gaps
- **Not verified in any text source:**
  - whether Nodebuster or Row Divers hide unbought neighbours entirely or show them dimmed
  - where their tooltips appear (next to the cursor or in a fixed panel)
  - whether they show before/after values
  - their exact buy animation or sound

  From memory, Nodebuster uses a dark background, a tree that grows outward from a central node, and hover tooltips near the node. This is unverified, and a developer should check gameplay footage.
- I found no concrete sources on Void Scrappers' permanent-upgrade screen layout beyond "purchase permanent upgrades such as better attack and a more robust shield" ([GameGrin](https://www.gamegrin.com/reviews/void-scrappers-review/)).

## 4. Notifications, "new" badges and progressive disclosure

### Takeaway
The reference games consistently hide systems until they are relevant:
- Nodebuster's Milestones tab is bought from the tree.
- Idle Slayer's Quests tab is bought via an upgrade, and Daily or Weekly Quests are crafted.
- Mr. Mine's systems appear at depth milestones.
- Vampire Survivors' Arcana unlocks appear only after finding Randomazzo.

UX literature warns that badges shown constantly become "wallpaper".

### Cited Findings
- **Nodebuster:** a tree node unlocks the Milestones tab. — [Nodebuster Bible](https://www.mejoress.com/the-nodebuster-bible-complete-walkthrough-skill-tree-and-prestige-strategy/)
- **Idle Slayer:** "The Quests tab is unlocked by purchasing the Training Quests Upgrade." Daily Quests unlock by crafting the Diary and Weekly Quests by crafting the Itinerary. — [Idle Slayer wiki (search snippet)](https://idleslayer.fandom.com/wiki/Quests); [Daily Quests](https://idleslayer.fandom.com/wiki/Daily_Quests)
- **Mr. Mine:** features appear at depth milestones (Trading Post at 15km, Underground City at 300km, Core at 501km, Moon at 1000km). — [Mr. Mine blog](https://blog.mrmine.com/mr-mine-idle-milestones/)
- **Vampire Survivors:** some unlock entries stay hidden until a prerequisite is met (Arcana after Randomazzo). — [Vampire Survivors Wiki](https://vampire.survivors.wiki/w/Achievements)
- **Other tree incrementals:** community feedback on these games discusses "hiding parts of the UI that aren't usable yet and gradually showing more content as players progress". — [search summary, itch.io feedback threads](https://itch.io/t/6102574/feedback)
- **Progressive disclosure principle:** "not about hiding things indefinitely. It is about timing… readiness is determined by what the user has already done." — [UX sources summary](https://ixdf.org/literature/topics/progressive-disclosure)
- **Badge fatigue:** "If the badge is present most of the time, it stops being a signal and becomes wallpaper." Also: "a dot-only badge should be used when the fact that something changed matters more than the count." — [Braze: Red Dot Blindness](https://www.braze.com/resources/articles/beware-red-dot-badging); [Setproduct badge patterns](https://www.setproduct.com/blog/badge-ui-design)
- **Red dots in games:** they are standard in live-service games for "unread mail", "claimable quest" and "new shop rotation". — [ui-reddot-system GitHub](https://github.com/kaan1altay/ui-reddot-system)

### Inferences
- **Trenchbore recommendations:**
  - Show the Relics screen or tab only when the first relic is found, and the Logbook tab on the first new entry. The Map could appear after the first zone boss, or after the first dive, so the player can see the depth reached.
  - Use a small dot for "new, unseen" items and a dot with a count only for claimable rewards.
  - Clear the dot as soon as the item is seen, so dots never linger.
  - Give the moment a tab first appears a one-time pulse or slide-in.
- Reserve red or pulsing for claimable rewards and use a calmer accent colour for "new entry". This follows the badge-fatigue guidance; it is my inference.

### Gaps
- I could not verify how Nodebuster, Row Divers or Idle Slayer visually badge new things (red dots, "!" marks or pulsing). No text source described this.

## 5. Meta screens: relics, bestiary/logbook, maps

### Takeaway
Collections that work well show undiscovered entries as placeholders with a hint on how to find them (Balatro) or a count of what remains per location (Ball x Pit blueprints). Depth-based games organise their catalogues by depth band (Dave the Diver, Mr. Mine). Relics in mining games are dug up and carried home (Dome Keeper) or sacrificed at a depth landmark (Mr. Mine's Core).

### Cited Findings
- **Balatro Collection:** undiscovered items are "a placeholder item with a question mark in the middle". Hovering gives "'Not Discovered' and… an instruction on how to discover the item." — [Balatro Wiki: Discoverability](https://balatrowiki.org/w/Discoverability)
- **Balatro, unlocked but not yet bought:** such a joker "will show a silhouette and say undiscovered". — [search summary, Balatro wiki / Steam threads](https://balatrowiki.org/w/Collection)
- **Ball x Pit level select:** tiles show a count of "undiscovered blueprints… remaining there". A player complaint is that "Buildings don't appear in the Encyclopedia… making it hard to keep track of them." — [search summary, Ball x Pit guides](https://ballxpit.wiki.gg/wiki/Blueprints)
- **Ball x Pit base building** is described as "extremely clunky" with no convenient way to rearrange. One reviewer suggests "a holding pen where structures could be dropped temporarily." — [search summary of reviews](https://screenrant.com/ball-x-pit-base-layout-harvest-tips/); [Steam thread "Using harvest to build makes no sense"](https://steamcommunity.com/app/2062430/discussions/0/624436409752623747/)
- **Dave the Diver** organises fish by depth band: Shallows 0–50m, Medium 50–100m (sharks, caves, wrecks) and Depths beyond 100m, "where light struggles to come through". Fish locations are "best treated as a depth band and time window". — [search summary, Dave the Diver guides](https://progameguides.com/dave-the-diver/dave-the-diver-map-all-underwater-locations/); [fish locations](https://davethediver.blog/en/fish-locations/)
- **Dome Keeper Relic Hunt mode:** the relic is dug out and carried back to the base. — [Josh Anthony](https://joshanthony.info/2023/05/24/design-dive-dome-keeper/)
- **Mr. Mine:** relics are sacrificed at The Core (501km). The game includes "quests, relics, bosses, hidden areas, and milestone unlocks". — [Mr. Mine blog](https://blog.mrmine.com/mr-mine-idle-milestones/); [Mr. Mine blog index](https://blog.mrmine.com/)
- **Motherload** has depth-banded density: randomized resources and dangers "became more dense on both ends as you descended". — [search summary of Super Motherload reviews](https://www.destructoid.com/reviews/review-super-motherload/)
- **Super Motherload** added underground bases as checkpoints. A criticism is that "depths between outposts get longer, until by the end you're spending many minutes just to reach the site of the final boss." — [Destructoid / Game Informer summary](https://gameinformer.com/games/super_motherload/b/playstation4/archive/2013/11/22/digging-deep-shallow-play.aspx)

### Inferences
- A vertical cross-section map suits a descending sub game, because depth is the progress axis in every reference title (Mr. Mine's km milestones, Dave the Diver's depth bands, Motherload's density gradient). On that map:
  - Label zones with depth ranges.
  - Mark bosses and relic sites on the section.
  - Show per-zone counters such as "relics 2/4" or "log entries 5/9", the Ball x Pit blueprint-count pattern.
  - Use it as the zone-select or warp screen.
- For the logbook, use Balatro's approach: undiscovered creatures appear as silhouettes with a "found in Zone 3, below 400m" hint, rather than a bare "?".
- Offer shortcuts or checkpoints to deeper zones. Super Motherload's long commutes are a documented criticism.

### Gaps
- I did not find sources on how Dave the Diver's in-game map screen or Dome Keeper's relic UI are laid out visually, beyond the depth bands.
- There is no direct comparative commentary on "drawn cross-section vs list" map screens.

## 6. Between-run screen layout and run results

### Takeaway
In Nodebuster and Row Divers, the between-run hub is essentially the upgrade tree. Nodebuster's round ends on health 0, a boss kill or manual termination, and the player returns to "the main screen" to buy upgrades. Ball x Pit adds one free harvest round at the base. I found no source documenting a detailed stats or results screen in Nodebuster or Row Divers.

### Cited Findings
- **Nodebuster round end:** "The round concludes if your health hits zero, if you defeat the boss, or if you choose to terminate the run manually." You then "take these Bits to the main screen and buy basic upgrades in the tech tree." — [Nodebuster Bible](https://www.mejoress.com/the-nodebuster-bible-complete-walkthrough-skill-tree-and-prestige-strategy/)
- **Nodebuster prestige:** prestige "increases enemy stats but also allows for more resources to be gathered and a new boss to fight." — [Mancunion](https://mancunion.com/2025/05/08/nodebuster-review-a-short-and-sweet-incremental-game/)
- **Ball x Pit:** "After each run, you'll return to the top of the pit and have one free round of harvesting." — [search summary of Ball x Pit reviews](https://www.maxi-geek.com/con/ball-x-pit-review)
- **Void Scrappers:** "after a run can purchase permanent upgrades such as better attack and a more robust shield." — [GameGrin (search summary)](https://www.gamegrin.com/reviews/void-scrappers-review/)
- **A Game About Digging A Hole** has no run screen. The loop returns to a garage terminal where ores are sold and the money buys upgrades or recharges the battery. — [search summary of reviews](https://www.gamegrin.com/reviews/a-game-about-digging-a-hole-review/)
- **Row Divers repetition criticism:** "go[ing] through the start of the level over and over" is "painful". — [Steam reviews](https://steamcommunity.com/app/2572300/reviews/?browsefilter=toprated)

### Inferences
- Keep Trenchbore's between-dive screen centred on the tree. Before the tree, show a short results strip or toast: depth reached, loot by type, new log entries, any relic found.
- Make the results skippable, with a single "Dive again" button always visible, rather than a persistent stats side panel.
- Consider letting players start deeper once zones are cleared. The Row Divers and Super Motherload criticisms of replaying the start both point to this.

### Gaps
- I could not verify whether Nodebuster or Row Divers show any run-summary screen (loot totals, time survived) before returning to the tree. No source described one.

## 7. Early speed upgrades and the first 1–3 minutes

### Takeaway
The genre deliberately opens weak and slow so that the first purchases are felt immediately:
- In A Game About Digging A Hole, the first shovel hits "hardly leave a dent".
- Dome Keeper's rock takes "several hits" at first.
- In Nodebuster you start as "a single pixel" whose health drains.

First upgrades target damage, health or dig power, and the speed-up is the reward. Sources do not show whether movement speed specifically is gated behind a first purchase.

### Cited Findings
- **A Game About Digging A Hole:** "Though it may seem slow at first, with each punch of the shovel hardly leaving a dent in the ground, the speed quickly picks up as you gain upgrades." Its upgrade categories are Shovel (dig diameter), Battery (dig duration), Inventory (ore capacity) and Jetpack (power). — [search summary of reviews](https://www.thexboxhub.com/a-game-about-digging-a-hole-review/); [TheGamer](https://www.thegamer.com/a-game-about-digging-a-hole-best-upgrades/)
- **Dome Keeper:** "it takes several hits for your drill to break apart rock when starting a run, and mining enough iron to increase drill power provides visible feedback in the form of faster digging." — [search summary of Josh Anthony](https://joshanthony.info/2023/05/24/design-dive-dome-keeper/)
- **Nodebuster opening:** "You begin as a single pixel in a sea of hostile geometry… You simply hover your cursor to destroy nodes, but every attack strikes back and drains your health." The guide advises investing heavily in "damage and health" during initial runs. — [Nodebuster Bible](https://www.mejoress.com/the-nodebuster-bible-complete-walkthrough-skill-tree-and-prestige-strategy/)
- **Nodebuster pacing** later becomes "incredibly lopsided". The reviewer reached wave 8 at the 3-hour mark, then sped through the rest. — [Higher Plain Games](https://higherplaingames.com/pc/nodebuster-review/)
- **Super Motherload** early upgrades: "speeding up your drill, and increasing the size of your fuel tank" is cited as "the best part". The game also gates some soils by story-given drills, not money. — [search summary of Super Motherload reviews](https://gameinformer.com/games/super_motherload/b/playstation4/archive/2013/11/22/digging-deep-shallow-play.aspx)
- **Row Divers early game** is criticised as "painfully boring". — [Steam reviews](https://steamcommunity.com/app/2572300/reviews/?browsefilter=toprated)

### Inferences
- Start Trenchbore slow in drill power and cargo, not in basic movement. Documented first upgrades are power, health and capacity. Gating movement speed itself makes the opening feel sluggish, which is the Row Divers "painfully boring" criticism.
- Make the first purchase affordable after one short first dive, under a minute, and make its effect visually obvious: fewer hits per rock, or a visibly bigger dig radius.

### Gaps
- There is no source-verified data on exact first-dive length, first-upgrade cost, or whether any reference game locks movement speed behind a purchase.
- Kongregate / Anthony Pecorella's "Math of Idle Games" was not fetched in this pass, so no cost-curve figures are included here.

## 8. Suspense and pacing of reveals

### Takeaway
The memorable incrementals keep suspense by withholding the goal and the shape of the game, not only the numbers. Each game starts from almost nothing: one button in A Dark Room, a candy counter in Candy Box, a single paperclip click in Universal Paperclips. It then keeps changing what kind of game it is, a "paradigm shift" or "unfolding", so the player is always asking "what will this become?" Teases work best when they are partial and sensory: a sound before a sight, a single-colour silhouette, a placeholder with a hint, a visible-but-unreachable place. Spelling things out, or "oversharing", kills the mystery. Rewards stay exciting through layered payouts (in-run gold plus permanent unlocks), near-misses and first-time events. A dense list of fixed-value upgrades does not do this.

### Cited Findings

**How reveals are staged (mechanics, screens, zones, genre)**
- **Candy Box!** "starts with only a save button and a candy counter… options appear as the player performs actions." Candies accrue at 1 per second and unlock "progressively complex mechanics, eventually evolving into a full role-playing adventure" with inventory, quests and combat. — [search summary of Candy Box! Wikipedia / Grokipedia](https://en.wikipedia.org/wiki/Candy_Box!)
- **Candy Box! inspired A Dark Room:** "Another incremental game, called _Candy Box_, inspired _A Dark Room's_ creation." — [PocketGamer.biz, "Shedding light: The making of A Dark Room"](https://www.pocketgamer.biz/shedding-light-the-making-of-a-dark-room/)
- **A Dark Room's opening sequence:**
  1. You light a fire, turning "a dark room" into a "firelit room".
  2. After stoking it several times, a stranger stumbles in and becomes a builder.
  3. Later, a shopkeeper sells a compass.
  4. The game then "take[s] on a decidedly RPG-like tone where you explore a map, enter mini-dungeons, fight battles."

  — [search summary of TouchArcade review](https://toucharcade.com/2014/06/03/a-dark-room-review/); [Jay is Games](https://jayisgames.com/review/a-dark-room.php)
- **A Dark Room withholds the goal:** it "withholds the one piece of information that is traditionally the very first thing that is established… the object of the game." Its systems are "slow and initially incrementally revealed… (which then grow exponentially larger, just as a room becomes a village and then becomes a region)." — [PopMatters, "A Dark Room Is the Most Fun You'll Ever Have with a Spreadsheet"](https://www.popmatters.com/183319-a-dark-room-the-most-fun-youll-ever-have-with-a-spreadsheet-2495645232.html)
- **Curiosity in A Dark Room:** the game "relies on the curiosity of the player in first exploring the systems of play… and then on an even greater curiosity… about why and what significance those systems are supposed to have." Also: "the central mystery of the game is what drives the player's desire to persist in what otherwise seems like simple spreadsheet management." — [PopMatters](https://www.popmatters.com/183319-a-dark-room-the-most-fun-youll-ever-have-with-a-spreadsheet-2495645232.html)
- **Universal Paperclips (Frank Lantz, 9 Oct 2017)** moves through distinct phases:
  1. Hand-clicking clips.
  2. Automation and marketing.
  3. AI "computational" upgrades.
  4. Stock market and market monopoly.
  5. Drones converting Earth.
  6. Self-replicating space probes with "value drift".
  7. An endgame choice.

  — [Wikipedia](https://en.wikipedia.org/wiki/Universal_Paperclips)
- **Universal Paperclips interface:** it starts as clicks and pricing, then expands to manufacturing, marketing and computation. By the end it shows "trillions of self-replicating drones spreading throughout the cosmos", with octillion-scale metrics and a battle with "drifters". — [Aaron A. Reed, 50 Years of Text Games: "2017: Universal Paperclips"](https://if50.substack.com/p/2017-universal-paperclips)
- **Paperclips' second stage** "is more akin to a power management simulator": you balance power production against drone consumption. The game changes genre, not just scale. — [search summary of Universal Paperclips Wiki](https://universalpaperclips.fandom.com/wiki/Stages)
- **Lantz on Paperclips:** players gain "direct, first-hand experience of what it means to be fully compelled by an arbitrary goal." Also: "it's fun to make this number go up." — [Wikipedia](https://en.wikipedia.org/wiki/Universal_Paperclips); [IF50](https://if50.substack.com/p/2017-universal-paperclips)
- **Reception of Paperclips:** "Like all the best clicker games, there's a sinister and funny underbelly" (Rock, Paper, Shotgun), and "Taking a denigrated game genre and making it more than it is" (Wired). — [Wikipedia](https://en.wikipedia.org/wiki/Universal_Paperclips)
- **Genre terminology:** incrementals "often involve several phases of completely distinct gameplay that fully replace the previous, called 'paradigm shifts'", with examples such as Crank and A Dark Room. — [search summary citing Wikipedia "Incremental game"](https://en.wikipedia.org/wiki/Incremental_game)
- **Unfolding as the top design factor:** the Paper Pilot guide calls "unfolding" (prestige layers plus paradigm shifts) the highest-value design factor. It creates "a sense of mystery, with the player anticipating what will happen next" and is "shaking up the gameplay before it gets too stale." — [The Paper Pilot, Guide to Incrementals: Defining the Genre](https://paperpilot.dev/garden/guide-to-incrementals/defining-the-genre)
- **Kittens Game:** progress "feels like peeling back layers of an onion": survival, then arcane tech, religion, trade and finally space. "There's always a progression of things to do, none of which are instant, allowing players to see forward through a chain of unlocks." Across resets, early progress speeds up while later materials "slow you down in turn." — [search summary of malvasia bianca blog](https://malvasiabianca.org/archives/2018/08/kittens-game/); [Jay is Games review](https://jayisgames.com/review/kittens-game.php)
- **Cookie Clicker's hidden narrative:** "around the time players unlock their 10th grandma, the game's language begins to change". Upgrade flavour text turns ominous (e.g. "They are not your grandmas. They never were. They are conduits"), and the Grandmapocalypse then changes the background and the game window in 3 escalating stages. — [search summary of Cookie Clicker wikis](https://cookieclicker.wiki.gg/wiki/Grandmapocalypse); [Upgrades trivia](https://cookieclicker.wiki.gg/wiki/Upgrades/Trivia)
- **Inscryption (Daniel Mullins)** shifts genre between acts. Mullins: "If players' prior expectations are no longer a guide, they have to take things as they come." He liked "the vibe of a creepypasta and the idea that you're seeing things that you weren't meant to see." — [Game Developer](https://www.gamedeveloper.com/marketing/-i-inscryption-s-i-journey-from-game-jam-joint-to-cult-classic); [search summary of Game Rant interview](https://gamerant.com/inscryption-interview-developer-daniel-mullins-3d-retro-horror-games/)
- **Pacing cadence in Subnautica:** "for the first half of the game, new SOS beacons appear every hour or so, to gently push the player to explore different areas". Robert Yang notes this structure then collapses midway, leaving players without direction. — [Robert Yang, Radiator Blog, "Mapping the sea floors of Subnautica"](https://www.blog.radiator.debacle.us/2018/02/mapping-sea-floors-of-subnautica.html)
- **Pacing in Dave the Diver:** director Jaeho Hwang spent "a lot of time testing progression pacing and introducing unexpected events". Because players "would eventually get tired seeing the same villagers every day," the team added surprise outside visitors. — [search summary of Dave the Diver director interviews](https://automaton-media.com/en/interviews/dave-the-divers-in-the-jungle-expansion-is-basically-dave-the-diver-1-7-says-director-even-players-who-usually-skip-dlc-should-give-it-a/) (full article text not retrieved; treat the wording as a paraphrase)

**What is hidden vs teased, and what creates or spoils curiosity**
- **Dome Keeper director René Habermann on enemy design:** "The single color shapes are best for this. It seems true that the best things happen in your mind… not visually 'overshare' the nature of the monsters, leaving more room to player imagination." — [Game Developer, "How Dome Keeper focuses on systems that feed into one another"](https://www.gamedeveloper.com/business/how-dome-keeper-focuses-on-systems-that-feed-into-one-another)
- **Dome Keeper sound designer Martin Kvale:** "When you hear an ambience that you haven't heard before, you know there is something unknown on its way and that you may be in trouble." Sound is used as a new-threat tease. — [Game Developer](https://www.gamedeveloper.com/business/how-dome-keeper-focuses-on-systems-that-feed-into-one-another)
- **Dome Keeper gadgets:** "little helpers you can find underground which open up the gameplay to new possibilities." Discovery happens inside the dig, not in a menu. — [Game Developer](https://www.gamedeveloper.com/business/how-dome-keeper-focuses-on-systems-that-feed-into-one-another)
- **Dome Keeper Relic Hunt:** the relic chamber is "usually located in the deepest layer of the map" and must be opened by activating multiple connected nodes. — [search summary of Dome Keeper Wiki: Relic Hunt](https://domekeeper.wiki.gg/wiki/Relic_Hunt)
- **Subnautica, sound before sight:** players "often hear creatures long before they see them for the first time." The Reaper Leviathan's roar carries far, so hearing it "could mean the Reaper is a mile away, or right behind you." — [search summary of The Geekwave, "Subnautica and Sound"](https://thegeekwave.com/2020/06/subnautica-and-sound/)
- **Monica Evans (Game Studies, 2024)** on forced descent: dread comes from forced descent ("you have to go down there, you can't tell if you're prepared, and there's no guarantee you'll make it back"). Players get "just enough information to know that they should be cautious, but not enough to claim mastery." The player starts with 45 seconds of oxygen, so the environment itself is the threat. — [Game Studies, "Too Afraid to Go Deeper"](https://gamestudies.org/2404/articles/evans)
- **Subnautica has no in-game map or mapping mechanism at all.** Players navigate by landmarks ("ok there's that pointy reef and the round hill so I should turn left…"). Yang notes the downside: "it's easy to get lost and miss important landmarks." — [Radiator Blog](https://www.blog.radiator.debacle.us/2018/02/mapping-sea-floors-of-subnautica.html)
- **Balatro's undiscovered items:** they show "a placeholder item with a question mark in the middle". Hovering says "Not Discovered" and gives "an instruction on how to discover the item". Unlocked-but-unbought jokers show a silhouette. A bare "?" is paired with a concrete clue. — [Balatro Wiki: Discoverability](https://balatrowiki.org/w/Discoverability); [search summary](https://balatrowiki.org/w/Collection)
- **Vampire Survivors' hidden unlocks:** some are secret until a prerequisite (e.g. Arcana after Randomazzo). Secret codes typed on the title screen unlock hidden characters and stages as "intentional developer Easter eggs". — [Vampire Survivors Wiki](https://vampire.survivors.wiki/w/Achievements); [search summary of Android Police](https://www.androidpolice.com/vampire-survivors-best-secrets-unlocks/)
- **Metroidvania-style teasing:** "you can see platforms and doors off in the distance or up above, but you can't necessarily reach them until you get the necessary upgrade. This keeps the sense of wonder and curiosity alive." This is a secondary, blog-level source. — [search summary of DualShockers / Medium](https://www.dualshockers.com/metroidvania-game-maps/)
- **Loewenstein's information-gap theory:** curiosity is the drive to close a perceived gap. "When the knowledge gap is too large or too small, motivation to seek information declines". Players' tolerance for a gap "is directly related to their confidence in their ability to close it." — [search summaries of Psychology Fanatic / Decision Lab](https://psychologyfanatic.com/information-gap-theory/); [Taylor & Francis curiosity framework study (2024)](https://www.tandfonline.com/doi/full/10.1080/10447318.2024.2325171)
- **To, Ali, Kaufman & Hammer (DiGRA 2016):** designers "can thus induce curiosity by creating or increasing the salience of information gaps". The paper describes five curiosity types: perceptual, manipulatory, complex/ambiguous, conceptual and adjustive-reactive. — [DiGRA Digital Library abstract](https://dl.digra.org/index.php/dl/article/view/793)

**Reward schedules: variable rewards, near-misses, first-time surprises**
- **Peter Howell (University of Portsmouth) on Vampire Survivors:**
  - It uses "multilayered rewards" (in-run gold spent between runs), so "no run ever feels wasted."
  - Falling short of the 30-minute mark creates a gambling-style near-miss that prompts "another run."
  - Achievements "ticked off from a lengthy list" drive replay with new characters.
  - Designer Luca Galante "applied his previous experience in the gambling industry."

  — [The Conversation](https://theconversation.com/vampire-survivors-how-developers-used-gambling-psychology-to-create-a-bafta-winning-game-203613)
- **Pacing inside a run (Vampire Survivors):** comfortable domination alternates with spikes of tension as bigger enemy groups arrive, which keeps players in "flow". — [The Conversation](https://theconversation.com/vampire-survivors-how-developers-used-gambling-psychology-to-create-a-bafta-winning-game-203613)
- **Anthony Pecorella (Kongregate)** gave the GDC talks "Idle Games: The Mechanics and Monetization of Self-Playing Games" (2015) and "Quest for Progress: The Math and Design of Idle Games" (GDC Europe 2016). They cover generators, prestige, and players' feelings about growth and complexity. Prestige gives "a rush of progress". Layered prestige (e.g. Realm Grinder's abdicate / reincarnate / ascend) unlocks "entirely new content, meta-currencies, or gameplay modes". — [GDC Vault 2016](https://www.gdcvault.com/play/1023876/Quest-for-Progress-The-Math); [GDC Vault 2015](https://www.gdcvault.com/play/1022065); [search summary of slides](https://www.slideshare.net/slideshow/quest-for-progress-gdc-europe-2016/65405507). The slide PDF could not be text-extracted, so no direct slide quotes are included.
- **Idle developer feedback on pacing:** "showing the next unlock's condition and subtle progress bars provide incentive to keep playing in the early game." Players dislike a long wait for the first upgrade followed by an even longer wait for the next. This comes from itch.io jam comments and is anecdotal. — [search summary of itch.io threads](https://itch.io/post/15330988)

### Inferences
- **Why "the game keeps changing" gets raves:** a shift resets the player's knowledge, which reopens the Loewenstein gap every time. Players are no longer only optimising numbers; they are wondering what the numbers are for. PopMatters' and Mullins' comments both support this. The Paper Pilot names it explicitly as the source of "a sense of mystery".
- **Where the suspense comes from:** these games do not show things slowly for its own sake. Their suspense comes from three things together:
  - withholding the goal and the next genre;
  - small, answerable questions every few minutes (a new button or a stranger arriving);
  - one big unanswerable question that runs the whole game ("what is this world?", "what are the grandmas?", "what happens when Earth runs out?").
- **What spoils curiosity:**
  - showing a full grid of "?" nodes, which is a gap too large and unanswerable, so curiosity drops;
  - a bestiary or map that lists everything up front;
  - rendering monsters in full detail before they are met (Habermann's "overshare");
  - text that explains the twist.
- **What builds curiosity:**
  - a placeholder plus a specific clue (Balatro);
  - a sound before a sight (Subnautica, Dome Keeper);
  - a flat silhouette (Dome Keeper);
  - a visible but unreachable place;
  - flavour text that slowly turns wrong (Cookie Clicker).

**Trenchbore takeaways (all my inference, not sourced):**
- **Change the game with depth.** Treat the 9 zones as rhythm changes, not just harder rock. Examples:
  - one zone where light matters, so the headlamp becomes a resource;
  - one where you are hunted, so noise from the drill attracts things;
  - one where currents push the sub;
  - one where the zone below "answers back" with signals.

  At least one mid-game shift should change the main screen (as Paperclips' drone phase did). For example, the sub could anchor and deploy drones, or the logbook could start decoding transmissions.
- **Keep one big mystery the whole game.** Why is there a trench, who dug it, and what is at the bottom? Deliver it through logbook fragments with redacted words that fill in as you go deeper. This adapts Cookie Clicker's upgrade text that slowly turns ominous, applied to a submarine logbook.
- **Tease each zone with its sound first.** On the dive before a new zone opens, play its ambience or a distant creature call faintly at the current floor (Kvale's rule). Show the next boss only as a silhouette on the depth gauge, or a shadow passing the viewport, until the first encounter.
- **Draw the map as a darkening cross-section.** Explored zones are drawn in; the next zone is a dark band with one landmark hint ("a warm glow at 1,200m"); zones beyond that are black. Do not use a grid of "?".
- **Pace the reveals.** Aim for a small new thing every few minutes early on (new ore, new node ring, new sound) and a structural surprise per zone: a new tab, a new tool found in the rock, a genre twist. Subnautica's "every hour or so" beacon cadence is the long-form version. Avoid its mid-game collapse by always keeping one visible next lead.
- **Put finds in the dig, not the shop.** Following Dome Keeper's gadgets, the most exciting unlocks should be found in the rock: a relic, a derelict module. Buying them from the tree is less exciting. The first find of each kind should get a one-time freeze-frame and sound.
- **Build near-misses and rare surprises into the reward schedule.** Show "you were 40m from the next zone" on death. Add rare ore veins with a distinct sparkle sound. Relics should be rare and unannounced, while milestones stay predictable, so both a variable layer and a reliable layer exist.
- **Aim for memorability over length.** Nodebuster sold as a ~4-hour game and Paperclips is remembered for its turn. A tight 4–6 hour paid game with 2–3 genuine surprises, plus an ending that reframes the dive, is likely more memorable than a long grind.

### Gaps
- **Reveal cadence:** I found no rigorous source giving a measured reveal cadence (e.g. "a new mechanic every 2 minutes") for Candy Box, A Dark Room, Paperclips or Nodebuster. The "every few minutes" advice above is inferred. The only measured cadence found was Subnautica's beacons "every hour or so".
- **Unfetched talks:**
  - Pecorella's slide text could not be extracted, and no summary with direct quotes on unlock pacing was found.
  - I did not locate a GDC talk specifically on A Dark Room. Michael Townsend quotes on its reveal design were not found; the PocketGamer piece quotes Amir Rajan, the iOS port developer, instead.
  - Charlie Cleveland's GDC 2019 "The Design of Subnautica" was not fetched ([GDC Vault](https://gdcvault.com/play/1025745/The-Design-of-Subnautica)), so his own rationale for having no map is unverified.
- **Paraphrases:** the Dave the Diver director quotes are search-snippet paraphrases; the full interview text was not retrieved.
- **Missing player data:** no source directly compares silhouettes vs "?" vs fully hidden nodes in upgrade trees with player data. The spoil-vs-tease conclusions are drawn from design commentary and curiosity theory.
