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
