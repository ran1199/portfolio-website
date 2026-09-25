---
# ═════════════════════════════════════════════════════════════
# CASE STUDY TEMPLATE — not shown on the website
#
# HOW TO ADD A NEW CASE STUDY
#   1. Copy this file into the same folder and rename the copy.
#      Use lowercase and dashes, e.g. "my-new-project.md".
#      The file name becomes the web address: /work/my-new-project/
#   2. Make an image folder with the same name:
#      content/images/my-new-project/
#   3. Fill in the details below. Delete any part you don't need.
#
# WRITING TIPS
#   • Keep the quotes around short text: "like this".
#   • For longer text, write  text: |  and start the text on the next
#     line, indented by two more spaces. A blank line starts a new
#     paragraph.
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
notice: ""                # optional short note shown under the title
                          # (e.g. "Self-initiated concept. Not affiliated with …")

# ── SECTIONS ──────────────────────────────────────────────────
# Each section below is a list of "parts". A part starts with "- " and
# can contain any of these building blocks (use only what you need):
#
#   heading:  a small heading for the part
#   label:    research type — primary, secondary or expert
#             (shown as "Primary research", "Secondary research",
#             "Expert interview"). Use in the research section.
#   text:     paragraphs
#   points:   a bullet list, in square brackets or one "- " per line
#   pairs:    a two-column table (e.g. theory → the game it inspired)
#   steps:    numbered steps, each with an optional photo
#   visuals:  images with short captions
#   video:    a short silent looping video
#   source:   where the facts come from (shown as "Source: …")

why:
  - text: |
      Why you started this project. What did you notice?

research:
  - label: secondary
    heading: "What published studies say"
    points:
      - "A key fact with a number"
      - "Another key fact"
    source: "[SOURCE NEEDED]"

  - label: primary
    heading: "Interviews"
    text: |
      Who you spoke with and what you learned.

insight:
  insight: "The key insight in one or two sentences."
  goal: "The design goal in one or two sentences."

concept:
  - heading: "Idea to design"
    pairs:
      columns: ["Idea", "Became"]
      rows:
        - ["First idea", "What it became"]
        - ["Second idea", "What it became"]

  - heading: "How it works"
    steps:
      - title: "Step one"
        text: "What happens."
        image: ""
        alt: ""
      - title: "Step two"
        text: "What happens."
        image: ""
        alt: ""

  - heading: "Key screens"
    visuals:
      - image: ""
        alt: ""
        caption: "A short caption."

# Keep what you actually BUILT separate from what you only DESIGNED.
prototype:
  built:
    - text: |
        What you physically or technically built.
      video:
        file: ""          # an .mp4 in this project's image folder
        poster: ""        # a still image shown until the video loads
        alt: ""
        caption: "What the video shows."
  designed:
    - text: |
        What you designed (mockups, screens) but didn't build.

testing:
  before:
    text: "What testing showed."
    image: ""
    alt: ""
  after:
    text: "What you changed as a result."
    image: ""
    alt: ""

reflection:
  - text: |
      What you learned.
  - heading: "Next steps"
    points:
      - "What you'd do next"

credits:                  # optional; delete if not needed
  - "3D characters modeled by me in Blender"
---
