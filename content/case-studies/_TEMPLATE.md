---
# ═════════════════════════════════════════════════════════════
# CASE STUDY TEMPLATE (visual-first) — not shown on the website
#
# HOW TO ADD A NEW CASE STUDY
#   1. Copy this file into the same folder and rename the copy.
#      Use lowercase and dashes, e.g. "my-new-project.md".
#      The file name becomes the web address: /work/my-new-project/
#   2. Make an image folder with the same name:
#      content/images/my-new-project/
#   3. Fill in the details below. Delete any section or block you
#      don't need, and add sections in any order you like.
#   Galactic Guardians (galactic-guardians.md) is a full example.
#
# WRITING TIPS
#   • Images first, text second: at most 2 short sentences per text,
#     captions of 12 words or fewer.
#   • Keep the quotes around text: "like this".
#   • Indentation (the spaces at the start of lines) matters. Line
#     things up exactly like the examples.
#   • Anything written as [PLACEHOLDER: …] or [SOURCE NEEDED] is
#     highlighted on the page so it's easy to spot before launch.
#   • Images: write just the file name, e.g. image: "sketch.jpg".
#     The file goes in this project's image folder. Every image needs
#     an alt: a short description for people who can't see it.
#     Leave image: "" to show a grey placeholder box.
# ═════════════════════════════════════════════════════════════

# ── HERO (top of the page) ────────────────────────────────────
title: "Project name"
order: 5                  # position on Home and for "Next project"
summary: "One line describing the project."
role: "Individual project"
dates: "Jan–Mar 2026"
tags: ["UX Design", "Research"]
cover: ""                 # main image, e.g. "cover.jpg"
coverAlt: ""              # description of the cover image
notice: ""                # optional short note under the title
                          # (e.g. "Self-initiated concept. Not affiliated with …")

# ── SECTIONS ──────────────────────────────────────────────────
# Sections are numbered 01, 02… in the order you list them.
# Each section has a heading and a list of blocks. A block starts
# with "- " and usually holds ONE of the kinds shown below.
sections:
  # Optional sections you can include if you want them:
  - heading: "Why this project"
    blocks:
      - text: "What you noticed that made you start. One or two sentences."

  - heading: "Problem and insight"
    blocks:
      # IMAGE + TEXT BESIDE IT: the image takes the wider column.
      - image: "research.png"
        alt: "Description of the image"
        insight: "The key insight in one line."
        goal: "The design goal in one line."
      # One line of text with where it comes from:
      - text: "A key statistic in one line."
        source: "[SOURCE NEEDED]"
      # INSIGHT + GOAL on their own (no image). The insight can also be
      # two short lines — write each on its own "- " line:
      - insight:
          - "First short insight line."
          - "Second short insight line."
        goal: "The design goal in one line."
        note: "A small note, e.g. where the research comes from."

  - heading: "Ideas"
    blocks:
      # CARDS: a grid of images, each with "from → to" labels.
      - cards:
          - from: "Where the idea came from"
            to: "What it became"
            image: ""
            alt: ""

  - heading: "The design"
    blocks:
      # LARGE IMAGE (full width). Add  size: small  for a smaller one.
      - image: ""
        alt: ""
        caption: "A short caption."
      # GALLERY: the first image large, the rest side by side.
      - gallery:
          - image: ""
            alt: ""
            caption: "A short caption."
          - image: ""
            alt: ""
            caption: "A short caption."
          - image: ""
            alt: ""
            caption: "A short caption."
      # IMAGES SIDE BY SIDE: all the same size in one row, with one
      # shared caption underneath (optional).
      - sideBySide: true
        gallery:
          - image: ""
            alt: ""
          - image: ""
            alt: ""
        caption: "One caption for the whole row."
      # STEPS: numbered photos in a row (stacked on phones).
      - steps:
          - title: "Step one."
            text: "What happens."
            image: ""
            alt: ""
          - title: "Step two."
            text: "What happens."
            image: ""
            alt: ""
        note: "A small note under the steps."
      # SCREENS: app screenshots in a row (swipe sideways on phones).
      - screens:
          - image: ""
            alt: ""
            title: "Screen name"
            caption: "What this screen does."

  - heading: "Testing → what changed"
    blocks:
      # BEFORE / AFTER: two images side by side (stacked on phones).
      - before:
          text: "What testing showed."
          image: ""
          alt: ""
        after:
          text: "What you changed as a result."
          image: ""
          alt: ""
      # VIDEO: short, silent and looping. Put the .mp4 in the image folder.
      - video:
          file: ""          # e.g. "demo.mp4"
          poster: ""        # a still image shown until the video loads
          alt: ""
          caption: "What the video shows."
        note: "A small note, e.g. what was built vs. what was designed."

  - heading: "Reflection and next steps"
    blocks:
      - text: "What you learned, in one or two sentences."

# CREDITS (optional): small text at the end of the page.
credits:
  - "3D characters modeled by me in Blender."
---
