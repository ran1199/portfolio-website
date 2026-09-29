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
coverAlt: "The Galactic Guardians board game on a round wooden table, with the character standees, event cards and resource tokens, as a player moves the blue character"
tileImage: "tile.jpg"   # 4:3 photo for the Home/Work gallery tile
tileAlt: "The Galactic Guardians board game on a round wooden table, with the character standees, event cards and resource tokens"

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
      - text: "Each mini-game turns a classic game theory scenario into a choice children make together, earning Empathy, Negotiation, Strategy and Collaboration points."
      # Each card: theory title, its illustration, then one line.
      - cards:
          - title: "Cake-Cutting Problem"
            image: "minigame-1.png"
            alt: "Cake-Cutting Problem illustration: two children share a cake, shown in four steps"
            text: "\"You cut, I choose\": divide fairly so no one envies another's share."
          - title: "Public Goods Game"
            image: "minigame-2.png"
            alt: "Public Goods Game illustration: three children add coins to a piggy bank, the total is doubled and shared equally"
            text: "Each player decides how much to give to a shared pool that benefits everyone."
          - title: "Volunteer's Dilemma"
            image: "minigame-3.png"
            alt: "Volunteer's Dilemma illustration: six children, a messy playroom, two tired children and cleaning tools"
            text: "The group succeeds only if at least one person makes a sacrifice."
          - title: "Prisoner's Dilemma"
            image: "minigame-4.png"
            alt: "Prisoner's Dilemma illustration: the sentences for two prisoners depending on whether each confesses or stays silent"
            text: "Two players choose to cooperate or betray without talking to each other."
          - title: "King's Wise Men Puzzle"
            image: "minigame-5.png"
            alt: "King's Wise Men Puzzle illustration: a king, white and blue hats, and three wise men wearing blue hats"
            text: "Players reason from what others can see to figure out their own hat."
          - title: "Gift-Exchange Game"
            image: "minigame-6.png"
            alt: "Gift-Exchange Game illustration: four scenarios where a child does or doesn't eat their vegetables and a parent does or doesn't give a treat"
            text: "A parent and child each choose, and both win only when they cooperate."

  - heading: "The game"
    blocks:
      # Game world: the first image shows large, the rest side by side.
      - gallery:
          - image: "board.png"
            alt: "The full Galactic Guardians game board: four planets in the center, skill panels on all four sides, with the characters, resource tokens and event card decks around it"
          - image: "characters.png"
            alt: "The four characters, Nova, Orion, Stella and Cosmo, drawn as colorful monsters"
            caption: "Four characters, each with a unique skill and starting resources."
          - image: "event-cards.png"
            alt: "The four event card types, each card back shown beside an example card: Mimic, Flare of Despair, Galactic Station Build and Energy Surge"
            caption: "Game Skill, Contingency, Mini-Game and Surprise cards shape each round."

      # How it's played: Product Trial photos, one per step.
      - steps:
          - title: "Pick a character."
            text: "Each character has its own skill and resources."
            image: "play-step-1.jpg"
            alt: "Product trial photo: the four character cards, each with its starting resource tokens"
          - title: "Choose a planet."
            text: "Each planet produces a resource: collect one now, or wait for double."
            image: "play-step-2.jpg"
            alt: "Product trial photo: a player places the purple character on a planet on the board"
          - title: "Reveal the event cards."
            text: "Players go through the round's cards together."
            image: "play-step-3.jpg"
            alt: "Product trial photo: a player draws an Energy Surge event card from the card rack"
          - title: "Make choices."
            text: "Players earn Empathy, Negotiation, Strategy and Collaboration points."
            image: "play-step-4.jpg"
            alt: "Product trial photo: a player holds the Galactic Station Build mini-game card and its outcome card"
          - title: "Next round."
            text: "After 6 rounds, the most points and resources wins."
            image: "play-step-5.jpg"
            alt: "Product trial photo: a player places a skill tile on the board, beside a hand holding resource tokens"
        note: "For 2–4 players."

  - heading: "Companion app"
    blocks:
      - text: "Parents track progress through AI-generated analysis."
      # App screens in two groups of 4. "label" is the small group heading;
      # "title" shows above each screen and "caption" below it.
      - label: "Play and progress"
        screens:
          - image: "app-leaderboard.png"
            alt: "Leaderboard screen ranking Amy, John and Mia with score changes"
            title: "Leaderboard"
            caption: "Ranks players by score and shows changes (+/−) after each game."
          - image: "app-game-history.png"
            alt: "Game history screen with a search bar and a timeline of past games"
            title: "Game history"
            caption: "A searchable timeline of past games, filtered by year and month."
          - image: "app-skill-focus.png"
            alt: "John's skill card showing he needs to work on strategic thinking and decision-making"
            title: "Skill focus"
            caption: "Highlights the skills each child needs to grow, like strategic thinking."
          - image: "app-performance.png"
            alt: "John's performance screen with a radar chart and the player type \"The Connector\""
            title: "Children's performance"
            caption: "A radar chart of Empathy, Strategy, Negotiation and Collaboration, plus a player type."
      - label: "Parent tools"
        screens:
          - image: "app-dashboard.png"
            alt: "Parent dashboard greeting Tiffany, with an upload button and a list of children"
            title: "Parent dashboard"
            caption: "See each child's player type and upload a new game record."
          - image: "app-new-game.png"
            alt: "New game screen with score fields for Empathy, Strategy, Negotiation and Collaboration"
            title: "New game record"
            caption: "Enter each player's Empathy, Strategy, Negotiation and Collaboration scores."
          - image: "app-profile.png"
            alt: "Amy's profile with basic information, personality tags and achievement badges"
            title: "Children's profile"
            caption: "Basic info, personality tags, and achievements like \"First time win.\""
          - image: "app-insights.png"
            alt: "Parent insights screen with article cards on children, conflicts and family dynamics"
            title: "Parent insights"
            caption: "Tips on understanding each child, sibling conflicts, and family dynamics."
      - image: "app-ia.png"
        alt: "Information architecture diagram of the companion app"
        caption: "Information architecture"
        size: small
---
