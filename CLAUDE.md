# Build my Product/UX portfolio website

You're helping me, Ran Guo, build my personal portfolio website. Act as an experienced web designer and developer working with a complete beginner.

## About me and how to work with me

- I have no coding knowledge. I use a Mac.
- Explain every technical step in simple, plain language before you do it. Tell me what a command does and why it's needed before running it.
- Ask me questions one at a time.
- Build in phases (listed below). At the end of each phase, show me the result (run the site locally and tell me how to open it in my browser), summarize what changed in 2–3 sentences, and **wait for my approval before starting the next phase.**
- Don't install anything, create accounts, or publish anything without telling me first and getting my OK.
- **Never invent content.** Don't make up project details, research findings, metrics, quotes, achievements, or job descriptions. Where content is missing, insert a clearly marked placeholder like `[PLACEHOLDER: About intro paragraph]` and add it to a list of open items.
- I want to update text, images, projects and my résumé myself later **without AI**, so keep content separate from code and keep content files simple and readable.

**First step:** save this whole brief into the project as `CLAUDE.md` so it carries over between sessions. Then start with Phase 1.

---

## 1. Goal and positioning

- **Purpose:** show potential employers my projects, case studies, design process and skills.
- **Positioning:** "A product thinker with a design background and strong brand sense."
- **Target roles:** product manager and AI product manager (main); brand management, marketing, strategy (secondary).
- **How the site should feel:** thoughtful, innovative, calm.
- **Background:** BS in Advertising, Boston University; Master of Integrated Innovation for Products & Services (MIIPS), Carnegie Mellon (in progress).
- **Theme in my work:** children, families and wellbeing. Each project starts from a personal observation.

## 2. Tech approach

- A **static website** with content in simple Markdown/YAML files, separate from the code.
- Suggested stack: **Astro** (content collections for case studies, built-in image optimization, outputs plain static files). Before installing, briefly explain your recommendation and any simpler alternative, and confirm with me.
- Keep dependencies minimal. No CMS, database or login.
- **Version control:** Git + GitHub. I already have a GitHub account.
- **Hosting:** free static hosting that auto-deploys from GitHub. GitHub Pages via GitHub Actions is the default suggestion, but compare it briefly with Netlify and Vercel and let me choose.
- Launch first on the free temporary address from the host. **My custom domain comes later** (Phase 7).
- Check what's already installed on my Mac (Node.js, Git) before suggesting installs, and walk me through each install.

### Proposed content structure

```
content/
  case-studies/
    galactic-guardians.md
    buddys-adventure-island.md
    cte-every-hit-matters.md
    wonderweave.md
  play.yaml      ← list of visual pieces, in display order (file, type, alt text)
  about.md       ← intro text + timeline entries
  site.yaml      ← name, intro line, email, menu labels
public/ (or src/assets/)
  images/<project-slug>/…
  images/play/…
  resume.pdf
```

Adding a case study should mean copying one Markdown file and adding a folder of images. Adding a Play piece should mean uploading a file and adding one line to `play.yaml`. Each content file should have short comments explaining what each field does.

## 3. Site structure

| Page | Purpose |
|---|---|
| Home | Intro line + a gallery mixing 4 highlighted case studies with a selection of visual pieces |
| Case study pages (4) | Full story of each project |
| Play | Grid of all my visual work, just for looking |
| About | Short intro, career timeline, résumé download, email |

**Top menu on every page:** my name (links home) · Work · Play · About · Résumé · email with a copy button.

**Core interaction rule:** only case studies are clickable. Visual pieces on Home and Play do nothing when clicked.

## 4. Design direction

- **Background:** crisp white.
- **Typography:** a clean, simple, highly readable sans-serif. I like the clear, simple type on the Alo Yoga and Skims websites. Show me 3 free web font options side by side (for example from Google Fonts or Fontsource) and let me choose.
- **Color:** mostly black/near-black text on white, plus **one accent color** used sparingly for links, hover states and small details. The accent isn't chosen yet. Propose 3 options once my visuals are in the site, and let me choose.
- **Spacing:** generous white space and a consistent spacing scale. Calm, not crowded.
- **Motion:** slow, smooth fades only. Nothing flashy. Respect `prefers-reduced-motion` everywhere.
- **Signature detail:** a custom cursor. Over case studies, the cursor becomes a small circle with the word "View." Everywhere else, it's the normal cursor.
- Define colors, fonts and spacing as CSS variables (design tokens) in one place, so they're easy to change later.

**References**

- Jakub Zeg (zegzulka.com): homepage gallery of visuals, hover reveals a description, click opens the full project, Work/Play split. Borrow the structure and interaction, but make it calmer.
- Emmanuel (emnuel.xyz): the timeline style, used on my About page.
- Don't copy either site's code, text or assets. Create an original design.

## 5. Page specifications

### Home

- **Intro line:** "Ran Guo — a product thinker with a design background and strong brand sense." (Final wording may change, so keep it in `site.yaml`.)
- **Gallery:** a mix of 4 case studies and a small selection of visual pieces. The full visual set lives on Play.
- **Case study order:**
  1. Galactic Guardians
  2. Buddy's Adventure Island
  3. CTE: Every Hit Matters
  4. WonderWeave
- **Case studies stand out through:**
  - **Size:** larger than the visual pieces.
  - **Hover details:** title + one-line description fade in, with "View case study →".
  - **Custom cursor:** the "View" circle, over case studies only.
- **Visual pieces:** not clickable; no pointer or "View" cursor over them.
- **Phones and tablets:** no hover and no custom cursor. Case study titles and short descriptions are always visible, and size carries the emphasis. Only enable the custom cursor with `(hover: hover) and (pointer: fine)`.

### Case study pages

Rebuild the case studies as **real web sections with live text**, not pasted slide images. My Figma slides are dense 2800×1200 layouts that aren't readable on phones. Use a shared template:

1. **Hero:** title, one-line summary, role, dates, tags, cover visual
2. **Why this project:** personal motivation
3. **Research:** clearly labeled as primary research, secondary research or expert interview, with source credits
4. **Insight and design goal**
5. **Concept and design:** key visuals with short captions
6. **Prototype:** clearly separate what was *built* from what was *designed*
7. **Testing → what changed:** a before/after layout
8. **Reflection and next steps**
9. **Next project** link

### Play

- A clean grid of all visual work. Nothing happens on click.
- **Images:** optimized and responsive.
- **Motion pieces:** short, silent, looping videos (`autoplay muted loop playsinline`) with a poster image shown until loaded. Convert GIFs to MP4/WebM (for example with ffmpeg) since GIFs are very heavy. Pause videos when `prefers-reduced-motion` is set.
- Optional: a gentle fade-in as items scroll into view.

### About

- A short intro paragraph: `[PLACEHOLDER]` until I write it.
- A timeline inspired by Emmanuel's site, newest first, with exactly these 6 entries. Keep the one-liners as drafts in `about.md`, since I'll refine them:

| When | Where | Role | Draft one-liner |
|---|---|---|---|
| May–Aug 2026 | FunKidz Brand Inc. | Product Manager Intern | Proposed and got approval for a new slime remover; wrote the Kids Baking Oven PRD |
| Aug 2025 – Dec 2026 | Carnegie Mellon University | MS, Integrated Innovation for Products & Services | In progress |
| Aug 2024 – Aug 2025 | FunKidz Brand Inc. | Toy Designer | Turned consumer feedback into toy and packaging updates; A/B tested Amazon pages |
| May–Aug 2024 | Experience Music Group | Marketing Intern | Planned TikTok and Instagram content for artist branding; weekly insights |
| May–Aug 2024 | Sake High! | Marketing Intern | Analyzed social engagement; designed campaign assets |
| Sep 2021 – Aug 2024 | Boston University | BS, Advertising | Dean's List, four semesters |

- A résumé download button and my email.

### Contact

- **Email:** grleah1902@gmail.com. Show it in the menu or footer on every page, with a **"copy email" button** that briefly shows "Copied ✓" (use the Clipboard API, with a `mailto:` fallback).
- **Résumé:** a "Résumé" link in the menu and on About, pointing to `resume.pdf`. I'll provide a version without my phone number, so use a placeholder file until then.

## 6. Case study content

Use **only** the facts below plus the visuals I export from Figma. Where section text is missing, use placeholders. Don't write new claims.

### 1. Galactic Guardians

A board game + companion app that uses game theory to help children in multi-child families build life skills (negotiation, empathy, strategy, collaboration). Individual project, Sep–Nov 2024. Tags: Game Design, UI/UX Design, Educational Design.

- **Motivation:** I grew up in a multi-child family and experienced sibling rivalry firsthand.
- **Research:** statistics on multi-child families, 3 causes of rivalry (perceived unfairness, power struggles, competition), interviews and observation, insights (most solutions are parent-focused; few build kids' conflict-resolution and critical-thinking skills).
- **Shorten:** show the classic game theory examples as a compact mapping of each theory to the mini-game it inspired, not six long explanations.
- **Merge:** show Game Flow and the Product Trial photos as one step-by-step flow, each step with a real photo.
- **App:** information architecture, UI screens (leaderboard, children's performance, parent dashboard, new game record). Parents track progress through AI-generated analysis.
- **Testing → change:** Testers found manual entry slow. With 4 players, counting resources and scores made mistakes easy. I added photo capture to the New Game Record page, so the app detects results automatically.
- **Accurate wording:** "Designed the photo-capture flow in the app prototype and built a working proof of concept of the detection using AI-assisted coding." Leave a slot for a short demo video.
- **Reflection:** I explored integrating a physical board game with a mobile app. Next, I'd research how to make the analysis of players' in-game performance and key skills more reliable, backed by professional studies, so parents can better understand each child and support their growth.

### 2. Buddy's Adventure Island

A motion-based game for children with DCD (dyspraxia) that uses cardboard props and a sensor necklace to practice real-world movements. Individual project, Apr–Aug 2024. Tags: Game Design, UX Design, Educational Design.

- **Motivation:** a close friend had undiagnosed DCD as a child. Refer to her as "a close friend" unless I confirm otherwise.
- **Research (secondary):** DCD facts, signs and symptoms, related conditions (show as a simple list with key numbers, not a 3D pie chart), and existing interventions (a competitive analysis in which the task-oriented approach is most effective). Label the case analysis and published interview insights as **secondary research** with source credits. **Don't include photos of the named children.**
- **Design:** concept and design goal, game flow, storyboard, related movements, game props, NPCs, physical prop book, handcrafting process, game scene map, game tasks process.
- **Built and tested:** cardboard props and Arduino prototypes with an accelerometer (GY521) and a pressure sensor (FSR402).
- **Designed (mockups):** the digital game world and screens. Say "designed," not "built."
- **Testing → change:** Two children tested the props. The sensors weren't always accurate and fell off easily. I redesigned the sensor as a detachable magnetic necklace, so users can choose where to clamp it onto the prop.
- **Credits:** 3D characters modeled by me in Blender; island environment from an existing source `[PLACEHOLDER: source]`.
- **Future plans:** more advanced AI for real-time feedback; partner with child psychologists and occupational therapists.
- **Name:** use "Buddy's Adventure Island" consistently.

### 3. CTE: Every Hit Matters

An interactive advertising campaign to raise awareness of CTE (chronic traumatic encephalopathy) risks in youth contact sports. Individual project, Oct–Dec 2024. Tags: Advertisement Design, Educational Design.

- **Label near the top:** "Self-initiated concept. Not affiliated with or endorsed by the Concussion Legacy Foundation, the NHL or any team."
- **Research:** CTE background, history, symptoms, child risk, current rules; observation of the Boston Bruins vs. St. Louis Blues game on Nov 12, 2024 (use text, not team logos); **primary interviews** with two BU athletes (men's soccer and women's lacrosse). Show them by sport only until I confirm names and photos.
- **Strategy:** ideation, design focus, advertising concept, "Why CLF?" (credibility, reach, mission fit), user journey (awareness → engagement → education → call to action → post-engagement).
- **Execution:** a bus stop billboard with a proximity-triggered reveal ("What looks like play can leave a mark" → "CTE's impact starts in the spark" → QR code), and an interactive sports-arena screen with mascots. Use placeholders instead of real team mascots, since I'll design original ones.
- **Tests:** billboard visual test (transparent PVC over an iPad) and Arduino ultrasonic proximity sensor (HC-SR04).
- **Feedback → change:** My professor suggested thinking about content across channels and the audience groups who'd react. I placed the arena screen's interactive buttons at children's height.
- **Reflection:** explore multi-channel further, including a related social media campaign; consider budget, what it would take to make it real, and what to do with a limited budget; learn from other stakeholders and what they could gain.

### 4. WonderWeave

An interactive exhibition + companion app helping parents navigate the transition when their children leave for college. Individual project, May–Jul 2024. Tags: UI/UX Design, Educational Design.

- **Research (primary):** interviews with two parents (a mother in Shanghai and a father in Beijing). **Use changed names and no photos,** add "Names changed for privacy," and leave out their children's names and universities. Plus a remote expert interview with a psychotherapist specializing in family counseling (credit by role only until I confirm).
- **Content:** separation anxiety symptoms, a day-in-the-life emotional journey, transition troubles (suddenness, identity shift from parent to self), related data (needs sources), psychological therapies (CBT, Solution-Focused, Integrative Family Therapy), ideation, design focus (emotional support, personalized experience, community and connection), exhibition concept, storyboard.
- **Prototype:** Makey Makey touch sensors in a small-scale cardboard model, with the interface in Protopie. Also space design, visitor flow and a five-scene experience process.
- **App:** information architecture, low-fi screens, UI specification, final screens.
- **Testing → change:** The Support feature first asked users only for their location and current feeling. Testing showed it needed to ask what they want to do. Choosing "talk" connects them with people who've had similar experiences. Choosing "calm down" guides them through Solution-Focused Therapy activities and records their reflections to track progress.
- **Reflection:** I learned how a mental health support app can be designed for a specific use case and actually help people, instead of being a generic health tracker with only general features.

### 5th case study

Planned for later. The template should make it easy to add.

## 7. Content and privacy rules (must follow)

- Credit every statistic and published source. Where I haven't provided the source yet, add `[SOURCE NEEDED]`.
- Don't publish photos of real children or identifiable real people unless I confirm permission. Use placeholders.
- Clearly label stock or illustrative images.
- Don't use other organizations' logos or mascots as if they were mine.
- Keep a running `OPEN-ITEMS.md` listing every placeholder, missing source and permission to confirm.

## 8. Quality requirements

- **Responsive:** works well on phone, tablet and laptop. Test at common widths, with no horizontal scrolling.
- **Browsers:** Safari and Chrome.
- **Performance:** optimized, lazy-loaded images; compressed videos; fast first load.
- **Accessibility:** semantic HTML, alt text fields for every image (in the content files), keyboard navigation with visible focus states, readable contrast, reduced-motion support.
- **Sharing:** page titles, meta descriptions and Open Graph preview images, so links look good on LinkedIn.
- **Code:** clean and commented where helpful.

## 9. Build phases (stop for my review after each one)

- **Phase 1: Set up.** Check my Mac's tools, install what's needed (with explanations), create the project and GitHub repository, set up the folder and content structure, and put a simple placeholder page live on the free hosting address to prove publishing works.
- **Phase 2: Design foundation.** Font options → I choose. Set up design tokens, the spacing scale, the menu, the footer and the copy-email button. The accent color can wait until visuals are in.
- **Phase 3: Homepage.** Intro line, mixed gallery, size emphasis, hover details, custom "View" cursor, and phone layout. Use placeholder images until my exports are ready.
- **Phase 4: Case study pages.** Build the template, then Galactic Guardians first as the test case, followed by Buddy's Adventure Island, CTE: Every Hit Matters and WonderWeave, plus next-project links.
- **Phase 5: Play and About.** Play grid with images and looping clips; About intro placeholder, timeline and résumé link.
- **Phase 6: Polish and check.** Device and browser testing, performance, accessibility, link previews, and a review of `OPEN-ITEMS.md` with me.
- **Phase 7: Launch.** Help me choose and connect my own domain, run a final live check, and write `UPDATING.md`, a plain-language guide for editing text, adding Play pieces, adding a case study, replacing the résumé and undoing a mistake on GitHub (including editing directly on github.com). Then have me practice one update on my own.

## 10. Assets I'll provide

- Exported case study visuals from Figma (PNG/JPG, one folder per project). If a Figma connection is available, you may look at frames I link, but exported files are the main source because my Figma plan has usage limits.
- Visual work for Play and Home (images, MP4s, GIFs).
- A general résumé PDF without my phone number.
- A short demo clip of the photo-detection proof of concept.
- Source links for statistics and published interviews.

Ask me for each asset when the phase that needs it begins.

**Start now with Phase 1:** save this brief as `CLAUDE.md`, then explain in simple terms what we'll do in Phase 1 and ask me your first question.

---

## Working notes (kept up to date by Claude)

- **Where the work happens:** Claude works in a temporary cloud computer that has a copy of the GitHub repository `ran1199/portfolio-website`. It cannot see Ran's Mac. Anything not committed and pushed to GitHub is lost when the session ends.
- **Development branch:** `claude/new-session-9jokpx`.
- **Decision (Phase 1):** Cloud only. Nothing is installed on Ran's Mac. Ran reviews each phase on the free hosting test address, and will later edit content on github.com.
- **Decision (Phase 1):** Website builder is Astro (v7). Content lives in `content/`; images go in `content/images/<slug>/` (kept next to the content so Astro can optimize them); the résumé is `public/resume.pdf`.
- **Decision (Phase 1):** Hosting is GitHub Pages, published by `.github/workflows/deploy.yml` whenever the repository's default branch changes. Temporary address: https://ran1199.github.io/portfolio-website/ (so `base` is `/portfolio-website` in `astro.config.mjs`; internal links must use `import.meta.env.BASE_URL`).
- **Checking the live site:** this cloud computer's network can't open github.io, so publishing is checked through the GitHub Actions run result, and Ran checks the page in their browser.
- **Decision (Phase 2):** Font is Instrument Sans, self-hosted via `@fontsource-variable/instrument-sans` (no Google Fonts requests).
- **Where things live:** design tokens in `src/styles/tokens.css`; base styles in `src/styles/global.css`; shared page frame in `src/layouts/BaseLayout.astro`; menu, footer and copy-email button in `src/components/`. Build links with `withBase()` from `src/lib/url.ts`.
- **Screenshots in this cloud computer:** run `npx astro preview` in the background and use the global Playwright with Chromium. For pages that load outside files, launch Chromium with `--proxy-server=$HTTPS_PROXY --proxy-bypass-list=localhost;127.0.0.1`.
- **Images in content files:** content files give only a file name (e.g. `cover: "cover.jpg"`); `src/lib/media.ts` finds it in `content/images/<folder>/` and the build stops with a clear message if the name is wrong. Case study covers live in the case study's folder; Play pieces in `content/images/play/`.
- **Home gallery (Phase 3):** each row pairs one case study (7 of 12 columns) with one visual piece (4 columns), alternating sides; extra Home pieces go in a final row of small tiles. Grey placeholders show until covers and `home: true` pieces exist. The "View" cursor (`src/components/ViewCursor.astro`) appears over anything marked `data-cursor="view"`, only on `(hover: hover) and (pointer: fine)`. Scroll fade-in: add `class="reveal"`.
- **Case study pages:** `/work/<file-name>/`, from `src/pages/work/[slug].astro` (basic details only until Phase 4).
- **Current phase:** Phase 3 (Homepage) built and live. Waiting for Ran's approval before Phase 4 (Case study pages).
