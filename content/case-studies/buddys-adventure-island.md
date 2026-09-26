---
# ─────────────────────────────────────────────────────────────
# CASE STUDY: Buddy's Adventure Island  (visual-first layout)
# Every option is explained in _TEMPLATE.md in this folder.
# Images go in content/images/buddys-adventure-island/
# To swap a placeholder image, upload your export with the SAME file name.
# Keep text short: at most 2 short sentences per text, captions ≤ 12 words.
# Privacy: no photos of real, named children; testers' faces only with
# their parents' permission.
# ─────────────────────────────────────────────────────────────

# ── HERO ─────────────────────────────────────────────────────
title: "Buddy's Adventure Island"
order: 2
summary: "A motion-based game that helps children with DCD build motor and social skills through real-world movements."
role: "Individual project"
dates: "Apr–Aug 2024"
tags: ["Game Design", "UX Design", "Educational Design"]
cover: "cover.jpg"
coverAlt: "Island scene with the characters of Buddy's Adventure Island"

# ── SECTIONS (numbered 01, 02… in this order) ────────────────
sections:
  - heading: "Problem and insight"
    blocks:
      - text: "DCD (dyspraxia) affects physical coordination, so children struggle with everyday movements expected for their age."
      - sideBySide: true
        gallery:
          - image: "research-signs.png"
            alt: "Signs and symptoms of DCD by age: 3 to 5, and 6 and older"
          - image: "research-interventions.png"
            alt: "Comparison of three existing interventions for DCD"
            caption: "Compared three interventions; the task-oriented approach is most effective."
      - insight:
          - "Fun physical activities can be both enjoyable and effective in building motor skills."
          - "Repeating specific motor actions helps children develop motor memory."
        goal: "Help children with DCD improve cognitive, motor and social skills through an engaging, interactive game."
        note: "Based on secondary research: published studies and interviews. [SOURCE NEEDED]"

  - heading: "The game"
    blocks:
      # Game world: the scene map large, the characters below it.
      - gallery:
          - image: "scene-map.png"
            alt: "Game scene map of the island"
            caption: "Five scenes: the player's island, forest, grassland, mountain and ocean."
          - image: "npcs.png"
            alt: "Character cards: Buddy, squirrel, bear, rabbit and dolphin"
            caption: "Buddy guides the player; each animal friend needs help with a task."

      # How it's played: one game screen per step.
      - steps:
          - title: "Pick a level."
            text: "Open the Magic Map and choose where to go."
            image: "play-step-1.png"
            alt: "Game screen: the Magic Map for choosing a level"
          - title: "Meet a friend."
            text: "An animal explains the problem they need help with."
            image: "play-step-2.png"
            alt: "Game screen: an animal friend explains their problem"
          - title: "Learn the move."
            text: "Buddy shows how to use the tool that matches the prop."
            image: "play-step-3.png"
            alt: "Game screen: Buddy demonstrates how to use the tool"
          - title: "Do it for real."
            text: "Repeat the movement with the cardboard prop to finish."
            image: "play-step-4.png"
            alt: "Game screen: repeating the movement with the cardboard prop"
          - title: "Earn and build."
            text: "Earn Moving Funds and invite animals to your island."
            image: "play-step-5.png"
            alt: "Game screen: earning Moving Funds and inviting animals to the island"
        note: "Game screens are designed mockups."

      # In action (optional). Only replace the placeholder once you've
      # confirmed you have the rights to the photo. Delete these 2 lines
      # to remove it.
      - image: "in-action.jpg"
        alt: "The game being played with a cardboard prop"

  - heading: "Props and sensor necklace"
    blocks:
      - image: "props.png"
        alt: "The six cardboard game props in a row"
        caption: "Axe, scissors, shovel, net, rake and paddle, one for each task."
      - sideBySide: true
        gallery:
          - image: "prop-book.png"
            alt: "Spreads from the physical prop book"
          - image: "handcrafting.png"
            alt: "Handcrafting process for the axe prop in 8 steps"
        caption: "Kids build each prop from cardboard using step-by-step templates."
      - image: "necklace.png"
        alt: "Labeled diagram of the detachable sensor necklace"
        caption: "Accelerometer, pressure sensor, speaker and magnets in one wearable piece."
      - image: "arduino-test.jpg"
        alt: "Arduino testing of the motion and pressure sensors"
        caption: "Tested motion and pressure sensing with Arduino (GY521, FSR402)."

  - heading: "Testing → what changed"
    blocks:
      # Testers were a neighbor's children: hands and props only, no faces,
      # unless their parents give permission.
      - before:
          text: "Two children tested the props. The sensors weren't always accurate and fell off easily."
          image: "props-before.jpg"
          alt: "User test: sensors attached to the cardboard props"
        after:
          text: "I redesigned the sensor as a detachable magnetic necklace, so users choose where to clamp it onto the prop."
          image: "necklace-after.jpg"
          alt: "The final magnetic sensor necklace clamped onto a prop"

# Shown in small text at the end of the page.
credits:
  - "3D characters modeled by me in Blender. Island environment: [PLACEHOLDER: source]."
---
