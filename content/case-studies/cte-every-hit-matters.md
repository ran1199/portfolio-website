---
# ─────────────────────────────────────────────────────────────
# CASE STUDY: CTE: Every Hit Matters  (visual-first layout)
# Every option is explained in _TEMPLATE.md in this folder.
# Images go in content/images/cte-every-hit-matters/
# To swap a placeholder image, upload your export with the SAME file name.
# Keep text short: at most 2 short sentences per text, captions ≤ 12 words.
# Brand safety: no NHL or team logos and no real team mascots anywhere.
# Athletes are credited by sport only (no names or photos) until confirmed.
# ─────────────────────────────────────────────────────────────

# ── HERO ─────────────────────────────────────────────────────
title: "CTE: Every Hit Matters"
order: 2
summary: "An interactive awareness campaign about CTE risks in youth contact sports."
role: "Individual project"
dates: "Dec 2024 – Feb 2025"
tags: ["Advertisement Campaign", "Educational Design"]
cover: "cover.jpg"
coverAlt: "Mockup of the campaign poster at a city bus stop: two young football players colliding under the lines What looks like play can leave a mark and CTE's impact starts in the spark, with a passer-by looking at it"
notice: "Self-initiated concept. Not affiliated with or endorsed by the Concussion Legacy Foundation, the NHL or any team."

# ── SECTIONS (numbered 01, 02… in this order) ────────────────
sections:
  - heading: "Problem and insight"
    blocks:
      - text: "CTE is a brain condition linked to repeated head impacts, yet public awareness remains limited, even in youth contact sports."
      - image: "research-sports.png"
        alt: "Contact sports: football, hockey, lacrosse, boxing and soccer"
        note: "Sources: [SOURCE NEEDED]"
      # Athlete interviews: credited by sport only, no names or photos.
      - quotes:
          - text: "The body contact is definitely there. We get knocked around a lot, especially during corner kicks and tackles."
            credit: "Men's soccer player, Boston University"
          - text: "We've been told about concussions, but CTE is rarely discussed. I think it's something all athletes should learn about, especially if it's a risk even in sports like ours."
            credit: "Women's lacrosse player, Boston University"
      - insight: "Raising awareness of CTE and frequent head impacts could lead to advocacy for rule changes that protect athletes."
        goal: "Raise awareness of CTE risks and empower audiences to advocate for rule changes that protect young athletes."

  - heading: "Campaign strategy"
    blocks:
      # The key message, shown big on its own.
      - statement: "What looks like play can leave a mark."
      - text: "The campaign is imagined under the Concussion Legacy Foundation."
        tiles:
          - title: "Credibility and trust"
            text: "An expert voice in concussion research"
          - title: "Amplified reach"
            text: "An established network of experts, athletes and policymakers"
          - title: "Mission alignment"
            text: "A shared goal of protecting young athletes"
      - image: "user-journey.png"
        alt: "User journey diagram for the campaign"
        caption: "Awareness → engagement → education → call to action → post-engagement."
      # Two channels, side by side.
      - tiles:
          - title: "Bus stop billboards"
            text: "Broad visibility in everyday settings."
          - title: "Sports arena screens"
            text: "Direct engagement where families watch and play sports."

  - heading: "The campaign in action"
    blocks:
      # a. Bus stop billboard
      - steps:
          - title: "Attract."
            text: "\"What looks like play can leave a mark.\" invites people closer."
            image: "billboard-1.png"
            alt: "Bus stop billboard, step 1: the poster invites people closer"
          - title: "Reveal."
            text: "Sensors detect approach; a red halo reveals the hidden impact."
            image: "billboard-2.png"
            alt: "Bus stop billboard, step 2: a red halo reveals the hidden impact"
          - title: "Act."
            text: "\"Scan to learn more\" leads to a petition or donation."
            image: "billboard-3.png"
            alt: "Bus stop billboard, step 3: a QR code to scan and learn more"
          - title: "Reset."
            text: "The poster returns to its original image for the next viewer."
            image: "billboard-4.png"
            alt: "Bus stop billboard, step 4: the poster returns to its original image"

      # b. Sports arena interactive screen
      - steps:
          - title: "Invite."
            text: "Three mascots: \"They play to win — touch to learn what's at stake.\""
            image: "screen-1.png"
            alt: "Arena screen, step 1: three mascots invite people to touch the screen"
          - title: "Choose."
            text: "Touching a mascot brings it to life."
            image: "screen-2.png"
            alt: "Arena screen, step 2: a touched mascot comes to life"
          - title: "Learn."
            text: "The mascot shares a short message about CTE in its sport."
            image: "screen-3.png"
            alt: "Arena screen, step 3: the mascot shares a message about CTE"
          - title: "Act."
            text: "A QR code call to action, then the screen resets."
            image: "screen-4.png"
            alt: "Arena screen, step 4: a QR code call to action"
        note: "Mascots shown are placeholders for original designs."

      # c. Scenario: keep the placeholder until the mascots are replaced.
      - image: "scenarios.png"
        alt: "Both executions in context: the bus stop billboard and the arena screen"

  - heading: "Prototyping and testing"
    blocks:
      - sideBySide: true
        gallery:
          - image: "test-pvc.jpg"
            alt: "Billboard visual test: a transparent PVC board over an iPad"
            caption: "Tested the reveal with a transparent PVC board over an iPad."
          - image: "test-arduino.jpg"
            alt: "Arduino test with an ultrasonic proximity sensor"
            caption: "An ultrasonic sensor (HC-SR04) triggers the change as people approach."
---
