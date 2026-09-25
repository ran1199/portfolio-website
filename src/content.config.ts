// Tells Astro where the content files live and which fields each one has.
// If a content file is missing a required field, the build stops and
// names the file, so mistakes are caught before anything goes live.
import { defineCollection } from "astro:content";
import { file, glob } from "astro/loaders";
import { z } from "astro/zod";
import yaml from "js-yaml";

// content/site.yaml — one set of site-wide settings.
const site = defineCollection({
  loader: file("content/site.yaml", {
    parser: (text) => [{ id: "site", ...(yaml.load(text) as object) }],
  }),
  schema: z.object({
    name: z.string(),
    introLine: z.string(),
    description: z.string(),
    email: z.string().email(),
    menu: z.object({
      work: z.string(),
      play: z.string(),
      about: z.string(),
      resume: z.string(),
    }),
    caseStudy: z.record(z.string(), z.string()),
  }),
});

// Building blocks used inside case study sections (see _TEMPLATE.md).
const needsAlt = (d: { image?: string; alt?: string }) => !d.image || Boolean(d.alt);
const altMessage = { message: "Add an alt description for this image.", path: ["alt"] };

const visual = z
  .object({
    image: z.string().default(""),
    alt: z.string().default(""),
    title: z.string().optional(),
    caption: z.string().optional(),
  })
  .refine(needsAlt, altMessage);

const step = z
  .object({
    title: z.string(),
    text: z.string().optional(),
    image: z.string().default(""),
    alt: z.string().default(""),
  })
  .refine(needsAlt, altMessage);

const video = z.object({
  file: z.string().default(""),
  poster: z.string().default(""),
  alt: z.string().default(""),
  caption: z.string().optional(),
});

const part = z.object({
  heading: z.string().optional(),
  label: z.enum(["primary", "secondary", "expert"]).optional(),
  text: z.string().optional(),
  points: z.array(z.string()).optional(),
  pairs: z
    .object({
      columns: z.tuple([z.string(), z.string()]),
      rows: z.array(z.tuple([z.string(), z.string()])),
    })
    .optional(),
  steps: z.array(step).optional(),
  visuals: z.array(visual).optional(),
  video: video.optional(),
  source: z.string().optional(),
});

const beforeAfter = z
  .object({
    text: z.string(),
    image: z.string().default(""),
    alt: z.string().default(""),
  })
  .refine(needsAlt, altMessage);

// ── Visual-first layout ──────────────────────────────────────
// A case study can instead list its own sections, each made of
// "blocks" (see _TEMPLATE.md). Used when the file has "sections:".
const card = z
  .object({
    from: z.string(),
    to: z.string(),
    image: z.string().default(""),
    alt: z.string().default(""),
  })
  .refine(needsAlt, altMessage);

const block = z
  .object({
    text: z.string().optional(),
    source: z.string().optional(),
    insight: z.string().optional(),
    goal: z.string().optional(),
    image: z.string().optional(),
    alt: z.string().optional(),
    caption: z.string().optional(),
    size: z.enum(["wide", "small"]).optional(),
    cards: z.array(card).optional(),
    gallery: z.array(visual).optional(),
    steps: z.array(step).optional(),
    screens: z.array(visual).optional(),
    before: beforeAfter.optional(),
    after: beforeAfter.optional(),
    video: video.optional(),
    note: z.string().optional(),
  })
  .refine(needsAlt, altMessage);

const visualSection = z.object({
  heading: z.string(),
  blocks: z.array(block),
});

// content/case-studies/*.md — one file per case study.
// Files starting with "_" (like _TEMPLATE.md) are ignored.
const caseStudies = defineCollection({
  loader: glob({ pattern: "[!_]*.md", base: "./content/case-studies" }),
  schema: z
    .object({
      title: z.string(),
      order: z.number(),
      summary: z.string(),
      role: z.string(),
      dates: z.string(),
      tags: z.array(z.string()),
      cover: z.string().default(""),
      coverAlt: z.string().default(""),
      notice: z.string().optional(),
      why: z.array(part).optional(),
      research: z.array(part).optional(),
      insight: z.object({ insight: z.string(), goal: z.string() }).optional(),
      concept: z.array(part).optional(),
      prototype: z
        .object({
          built: z.array(part).optional(),
          designed: z.array(part).optional(),
        })
        .optional(),
      testing: z.object({ before: beforeAfter, after: beforeAfter }).optional(),
      reflection: z.array(part).optional(),
      credits: z.array(z.string()).optional(),
      sections: z.array(visualSection).optional(),
    })
    .refine((d) => !d.cover || d.coverAlt, {
      message: "Add a coverAlt description for the cover image.",
      path: ["coverAlt"],
    }),
});

// content/about.md — intro paragraph + timeline.
const about = defineCollection({
  loader: glob({ pattern: "about.md", base: "./content" }),
  schema: z.object({
    title: z.string(),
    timeline: z.array(
      z.object({
        when: z.string(),
        where: z.string(),
        role: z.string(),
        note: z.string(),
      }),
    ),
  }),
});

// content/play.yaml — list of visual pieces. Each piece gets a number
// as its id, so the file itself stays simple.
const play = defineCollection({
  loader: file("content/play.yaml", {
    parser: (text) =>
      ((yaml.load(text) as object[] | null) ?? []).map((piece, i) => ({
        id: String(i + 1),
        ...piece,
      })),
  }),
  schema: z.object({
    file: z.string(),
    type: z.enum(["image", "video"]),
    poster: z.string().optional(),
    alt: z.string(),
    title: z.string().optional(),
    tags: z.array(z.string()).optional(),
    home: z.boolean().default(false),
  }).refine((d) => d.type === "image" || d.poster, {
    message: "Videos need a poster image.",
    path: ["poster"],
  }),
});

export const collections = { site, caseStudies, about, play };
