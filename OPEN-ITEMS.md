# Open items

Everything still missing, to write, or to confirm before launch.
Tick an item (`[x]`) when it's done.

## Content to write
- [ ] About intro paragraph — `content/about.md`
- [ ] Refine the six About timeline one-liners (currently drafts) — `content/about.md`
- [ ] Final wording of the Home intro line — `content/site.yaml`
- [ ] Full text for each case study section (Phase 4)

### Galactic Guardians (`content/case-studies/galactic-guardians.md`, visual-first)
- [ ] One intro line: how classic game theory scenarios inspired the mini-games
- [ ] Mini-game names for all six theories (Cake-Cutting Problem, Public Goods Game — possibly "Galactic Station Build", Volunteer's Dilemma, Prisoner's Dilemma, King's Wise Men Puzzle, Gift-Exchange Game)
- [ ] If the "3 major reasons" graphic is based on published research, add a source line
- [ ] Optional: one headline statistic with its source (goes in "Problem and insight")
- [ ] Permission check: do any Product Trial photos (`play-step-1` … `5`) show children or identifiable people?
- [ ] Check each image's alt text matches the real export once it's in
- [ ] Record `demo-photo-detection.mp4` (+ a poster still), then add its file name in the video block
- [ ] Replace the 23 labeled grey placeholder images in `content/images/galactic-guardians/` with Figma exports (same file names):
  - [ ] `cover.jpg` — cover photo (you playing the board game)
  - [ ] `research-causes.png` — "Sibling rivalry — 3 major reasons" graphic
  - [ ] `minigame-1.png` … `minigame-6.png` — mini-game cards
  - [ ] `board.png` — full board / map
  - [ ] `characters.png` — Nova, Orion, Stella, Cosmo
  - [ ] `event-cards.png` — the four event card types
  - [ ] `play-step-1.jpg` … `play-step-5.jpg` — Product Trial photos
  - [ ] `app-leaderboard.png`, `app-performance.png`, `app-dashboard.png`, `app-insights.png` — app screens
  - [ ] `app-ia.png` — information architecture
  - [ ] `new-game-before.png`, `new-game-after.png` — New Game Record, before/after photo capture

### Buddy's Adventure Island (`content/case-studies/buddys-adventure-island.md`, visual-first)
- [ ] Source(s) for the secondary research: published studies and interviews (replaces `[SOURCE NEEDED]` in "Problem and insight")
- [ ] Island environment source (credits line at the end of the page)
- [ ] Photo rights for `in-action.jpg` — keep the placeholder (or delete the block) until confirmed
- [ ] Testers were a neighbor's children: faces only with their parents' permission; otherwise use photos showing only hands and props (`props-before.jpg`, `necklace-after.jpg`)
- [ ] No photos of real, named children anywhere on the page
- [ ] Check each image's alt text matches the real export once it's in
- [ ] Replace the 18 labeled grey placeholder images in `content/images/buddys-adventure-island/` with Figma exports (same file names):
  - [ ] `cover.jpg` — island scene with the characters
  - [ ] `research-signs.png` — signs & symptoms (Age 3–5 / Age 6+)
  - [ ] `research-interventions.png` — existing interventions (3 approaches)
  - [ ] `scene-map.png` — game scene map
  - [ ] `npcs.png` — Buddy, squirrel, bear, rabbit, dolphin
  - [ ] `play-step-1.png` … `play-step-5.png` — Game Tasks Process screens
  - [ ] `in-action.jpg` — game interactive process (optional, rights to confirm)
  - [ ] `props.png` — game props row
  - [ ] `prop-book.png` — physical prop book spreads
  - [ ] `handcrafting.png` — handcrafting process (the axe, 8 steps)
  - [ ] `necklace.png` — detachable necklace diagram
  - [ ] `arduino-test.jpg` — Arduino testing, one combined image
  - [ ] `props-before.jpg` — user test: sensors attached to props
  - [ ] `necklace-after.jpg` — final magnetic necklace clamped on a prop

## Files to provide
- [ ] Résumé PDF without phone number → replaces the placeholder `public/resume.pdf`
- [ ] Figma exports for each case study (one folder per project)
- [ ] A cover image for each case study (+ `cover` and `coverAlt` in its file) — shown large on Home
- [ ] Choose 8 visual pieces for Home (`home: true` in `content/play.yaml`) — 2 sit beside each case study; add a `title` and `tags` for the hover labels
- [ ] Visual work for Play and Home (images, MP4s, GIFs)
- [ ] Short demo clip of the Galactic Guardians photo-detection proof of concept

## Sources needed
- [ ] Buddy's Adventure Island: island environment source (credits line)
- [ ] Source links for all statistics and published interviews (every case study)

## Permissions and names to confirm
- [ ] Buddy's Adventure Island: OK to keep calling your friend "a close friend"? (not on the page right now — "Why this project" was removed)
- [ ] CTE: names and photos of the two BU athletes (shown by sport only until confirmed)
- [ ] WonderWeave: psychotherapist's name (credited by role only until confirmed)
- [ ] Any photo showing real children or identifiable people needs your OK first

## Design decisions pending
- [x] Font (Phase 2) — Instrument Sans
- [ ] Accent color (once your visuals are in the site)
- [ ] Original mascots for the CTE arena screen (placeholders until designed)

## Setup
- [x] Hosting choice (Phase 1) — GitHub Pages
- [ ] Custom domain (Phase 7)
- [ ] Before launch: let search engines list the site (`hideFromSearchEngines` in `src/layouts/BaseLayout.astro`)
- [ ] Before launch: delete the temporary style guide page (`src/pages/style-guide.astro`)
