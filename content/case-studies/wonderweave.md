---
# ─────────────────────────────────────────────────────────────
# CASE STUDY: WonderWeave  (visual-first layout)
# Every option is explained in _TEMPLATE.md in this folder.
# Images go in content/images/wonderweave/
# To swap a placeholder image, upload your export with the SAME file name.
# Keep text short: at most 2 short sentences per text, captions ≤ 12 words.
# Privacy: no names, photos or ages of the parents you interviewed, and no
# names or universities of their children. "Names changed for privacy"
# wherever interview quotes appear. The psychotherapist is credited by role.
# If an image shows stock or illustrative people, say so in its caption
# (for the cover, add it as a "notice" line, e.g. notice: "Illustrative render.").
# ─────────────────────────────────────────────────────────────

# ── HERO ─────────────────────────────────────────────────────
title: "WonderWeave"
order: 4
published: false            # true = live on the website; false = kept here but not published yet
summary: "An interactive exhibition and companion app helping parents navigate a life transition."
role: "Individual project"
dates: "May–Jul 2024"
tags: ["UI/UX Design", "Educational Design"]
cover: "cover.jpg"
coverAlt: "Illustrative render of the WonderWeave exhibition: a gallery wall with line drawings of children at milestones such as First Step Towards Independence and First Night Away, touch and phone icons, and two visitors"
notice: "Illustrative render."

# ── SECTIONS (numbered 01, 02… in this order) ────────────────
sections:
  - heading: "Problem and insight"
    blocks:
      - text: "When children leave home, many parents face loneliness, identity confusion, and anxiety during this significant transition."
      # Crop out the parent's photo and name before exporting this image.
      - image: "research-journey.png"
        alt: "A parent's day-in-the-life timeline and emotional curve: sad, peace, lonely, nostalgic, empty, happy"
      # Two themes from the interviews.
      - tiles:
          - title: "The suddenness."
            text: "Parents were never prepared for this strong shift."
          - title: "Identity transition (parent → self)."
            text: "Parenting was a core part of their identity."
      - quotes:
          - text: "At the beginning, I didn't feel so bad, but later when I went to play golf alone without my son, I felt empty. So, I joined a Go club, hoping to overcome that feeling by being interested in a new hobby."
            credit: "A father in Beijing (parent interview; names changed for privacy)"
          - text: "Reflection is key. Encouraging parents to revisit meaningful milestones in their child's life can help them see their efforts and successes more clearly."
            credit: "Psychotherapist specializing in family counseling (remote interview)"
      - insight: "Parents might redefine their role from caretakers to mentors, staying emotionally connected with their children."
        goal: "Help parents facing loss, loneliness, and identity shifts as their children leave for college."
      - label: "Design focus"
        tiles:
          - title: "Emotional support"
            text: "Reflection on past parenting successes"
          - title: "Personalized experience"
            text: "Personalized feedback and long-term support beyond the exhibition"
          - title: "Community and connection"
            text: "Sharing similar experiences with others"

  - heading: "The exhibition"
    blocks:
      - image: "scenes.png"
        alt: "Five exhibition scenes, each showing a parenting milestone"
        caption: "Five parenting milestones, from a crying baby to a big change."
        note: "Soothing a Crying Baby · First Step Towards Independence · First Night Away · Sharing a Joyful Moment · Managing a Big Change"

      # How a visit works.
      - steps:
          - title: "Enter."
            text: "Visitors learn the purpose and open the WonderWeave app."
            image: "visit-step-1.png"
            alt: "Visitors entering the exhibition and opening the app"
          - title: "Touch a scene."
            text: "A video plays on the wall, and a reflection prompt appears on their phone."
            image: "visit-step-2.png"
            alt: "Touching a scene plays a video and shows a prompt on the phone"
          - title: "Take a card."
            text: "Support cards offer reflection prompts or calming exercises."
            image: "visit-step-3.png"
            alt: "Taking a support card"
          - title: "Leave with a report."
            text: "The app summarizes their reflections and keeps supporting them."
            image: "visit-step-4.png"
            alt: "The app's summary report of the visitor's reflections"

      # Touchpoints, side by side.
      - sideBySide: true
        gallery:
          - image: "touch-video.png"
            alt: "Video activation touchpoint"
            caption: "Video activation: a unique video for each scene."
          - image: "touch-prompt.png"
            alt: "App reflection prompt touchpoint"
            caption: "App reflection prompt, tailored to the scene."
          - image: "support-cards.png"
            alt: "Support cards touchpoint"
            caption: "Support cards for reflection and emotional relief."

  - heading: "Prototype"
    blocks:
      - sideBySide: true
        gallery:
          - image: "prototype-model.jpg"
            alt: "Cardboard model of the exhibition with pencil-drawn touch sensors"
            caption: "Pencil-drawn touch sensors in a cardboard model, built with Makey Makey."
          - image: "prototype-videos.png"
            alt: "Scene videos prototyped in Protopie"
            caption: "Touching each sensor plays that scene's video, prototyped in Protopie."
      - image: "space.png"
        alt: "Space layout and visitor flow through the five scenes"
        caption: "Visitor flow through the five scenes."
        size: small

  - heading: "Companion app"
    blocks:
      - text: "The app records each response and generates personalized encouragement and strategies for continued reflection."
      - screens:
          - image: "app-weekly.png"
            alt: "Weekly check-in screen"
            title: "Weekly check-in"
            caption: "Weekly questions inspired by Solution-Focused Therapy suggest personal goals."
          - image: "app-grow.png"
            alt: "Grow screen with a virtual plant"
            title: "Grow"
            caption: "Care for a virtual plant that grows with your progress."
          - image: "app-exhibition.png"
            alt: "Exhibition screen with scene prompts"
            title: "Exhibition"
            caption: "Scene prompts during the visit, then a personal summary."
      - image: "app-ia.png"
        alt: "Information architecture diagram of the WonderWeave app"
        caption: "Information architecture"
        size: small
---
