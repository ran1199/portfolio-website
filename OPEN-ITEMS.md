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

## Files to provide
- [ ] Résumé PDF without phone number → replaces the placeholder `public/resume.pdf`
- [ ] Figma exports for each case study (one folder per project)
- [ ] A cover image for each case study (+ `cover` and `coverAlt` in its file) — shown large on Home
- [ ] Choose 8 visual pieces for Home (`home: true` in `content/play.yaml`) — 2 sit beside each case study; add a `title` and `tags` for the hover labels
- [ ] Visual work for Play and Home (images, MP4s, GIFs)
- [ ] Short demo clip of the Galactic Guardians photo-detection proof of concept

## Sources needed
- [ ] Buddy's Adventure Island: island environment source
- [ ] Source links for all statistics and published interviews (every case study)

## Permissions and names to confirm
- [ ] Buddy's Adventure Island: OK to keep calling your friend "a close friend"?
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
