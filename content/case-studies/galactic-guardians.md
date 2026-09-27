---
# ─────────────────────────────────────────────────────────────
# CASE STUDY: Galactic Guardians  (visual-first layout)
# Every option is explained in _TEMPLATE.md in this folder.
# Images go in content/images/galactic-guardians/
# To swap a placeholder image, upload your export with the SAME file name.
# Keep text short: at most 2 short sentences per text, captions ≤ 12 words.
# ─────────────────────────────────────────────────────────────

# ── HERO ─────────────────────────────────────────────────────
title: "Galactic Guardians"
order: 1
summary: "A board game + companion app that uses game theory to help children in multi-child families build life skills."
role: "Individual project"
dates: "Sep–Nov 2024"
tags: ["Game Design", "UI/UX Design", "Educational Design"]
cover: "cover.jpg"
coverAlt: "The Galactic Guardians board game set up on a round table, with a player thinking about their next move"
tileImage: "tile.jpg"   # 4:3 photo for the Home/Work gallery tile
tileAlt: "The Galactic Guardians board game set up on a round table"

# ── SECTIONS (numbered 01, 02… in this order) ────────────────
sections:
  - heading: "Problem and insight"
    blocks:
      - image: "research-causes.png"
        alt: "Pie chart of the 3 major reasons for sibling rivalry: perceived unfairness, power struggles and competition, each illustrated with a photo of children"
        caption: "Illustrative stock photos."
        insight: "Most solutions are parent-focused; few build kids' conflict-resolution and critical-thinking skills."
        goal: "A board game for children, especially those growing up with siblings, that fosters crucial life skills."
        # To add one headline statistic later, add these two lines here:
        # text: "The statistic, in one line."
        # source: "Where it comes from"

  - heading: "From game theory to mini-games"
    blocks:
      - text: "[PLACEHOLDER: one line on how classic game theory scenarios inspired the mini-games]"
      - cards:
          - from: "Cake-Cutting Problem"
            to: "[PLACEHOLDER: mini-game]"
            image: "minigame-1.png"
            alt: "Cake-Cutting Problem illustration: two children share a cake, shown in four steps"
          - from: "Public Goods Game"
            to: "[PLACEHOLDER: mini-game — possibly \"Galactic Station Build\", to confirm]"
            image: "minigame-2.png"
            alt: "Public Goods Game illustration: three children add coins to a piggy bank, the total is doubled and shared equally"
          - from: "Volunteer's Dilemma"
            to: "[PLACEHOLDER: mini-game]"
            image: "minigame-3.png"
            alt: "Volunteer's Dilemma illustration: six children, a messy playroom, two tired children and cleaning tools"
          - from: "Prisoner's Dilemma"
            to: "[PLACEHOLDER: mini-game]"
            image: "minigame-4.png"
            alt: "Prisoner's Dilemma illustration: the sentences for two prisoners depending on whether each confesses or stays silent"
          - from: "King's Wise Men Puzzle"
            to: "[PLACEHOLDER: mini-game]"
            image: "minigame-5.png"
            alt: "King's Wise Men Puzzle illustration: a king, white and blue hats, and three wise men wearing blue hats"
          - from: "Gift-Exchange Game"
            to: "[PLACEHOLDER: mini-game]"
            image: "minigame-6.png"
            alt: "Gift-Exchange Game illustration: four scenarios where a child does or doesn't eat their vegetables and a parent does or doesn't give a treat"

  - heading: "The game"
    blocks:
      # Game world: the first image shows large, the rest side by side.
      - gallery:
          - image: "board.png"
            alt: "The full Galactic Guardians game board"
          - image: "characters.png"
            alt: "The four characters: Nova, Orion, Stella and Cosmo"
            caption: "Four characters, each with a unique skill and starting resources."
          - image: "event-cards.png"
            alt: "The four event card types"
            caption: "Game Skill, Contingency, Mini-Game and Surprise cards shape each round."

      # How it's played: Product Trial photos, one per step.
      - steps:
          - title: "Pick a character."
            text: "Each character has its own skill and resources."
            image: "play-step-1.jpg"
            alt: "Product trial photo: picking a character"
          - title: "Choose a planet."
            text: "Each planet produces a resource: collect one now, or wait for double."
            image: "play-step-2.jpg"
            alt: "Product trial photo: choosing a planet"
          - title: "Reveal the event cards."
            text: "Players go through the round's cards together."
            image: "play-step-3.jpg"
            alt: "Product trial photo: revealing the event cards"
          - title: "Make choices."
            text: "Players earn Empathy, Negotiation, Strategy and Collaboration points."
            image: "play-step-4.jpg"
            alt: "Product trial photo: players making choices"
          - title: "Next round."
            text: "After 6 rounds, the most points and resources wins."
            image: "play-step-5.jpg"
            alt: "Product trial photo: moving to the next round"
        note: "For 2–4 players."

  - heading: "Companion app"
    blocks:
      - text: "Parents track progress through AI-generated analysis."
      - screens:
          - image: "app-leaderboard.png"
            alt: "Leaderboard screen"
            title: "Leaderboard"
            caption: "Ranks players and shows score changes after each game."
          - image: "app-performance.png"
            alt: "Children's performance screen"
            title: "Children's performance"
            caption: "Each child's strengths, areas to improve, and skill progress."
          - image: "app-dashboard.png"
            alt: "Parent dashboard screen"
            title: "Parent dashboard"
            caption: "Set up game records and manage children's profiles."
          - image: "app-insights.png"
            alt: "Parent insights screen"
            title: "Parent insights"
            caption: "Parenting tips and resources."
      - image: "app-ia.png"
        alt: "Information architecture diagram of the companion app"
        caption: "Information architecture"
        size: small

  - heading: "Testing → what changed"
    blocks:
      - before:
          text: "Testers found manual entry slow. With 4 players, counting resources and scores made mistakes easy."
          image: "new-game-before.png"
          alt: "New Game Record screen before photo capture, with manual entry"
        after:
          text: "I added photo capture to the New Game Record page, so the app detects results automatically."
          image: "new-game-after.png"
          alt: "New Game Record screen after adding photo capture"
      - video:
          file: ""   # add "demo-photo-detection.mp4" here once it's uploaded
          poster: ""
          alt: "Screen recording of the photo-detection proof of concept"
          caption: "Working proof of concept of the detection, built with AI-assisted coding."
        note: "The photo-capture flow in the app prototype is designed; the detection itself was tested as a separate proof of concept."
---
