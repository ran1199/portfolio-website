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
  }),
});

// content/case-studies/*.md — one file per case study.
const caseStudies = defineCollection({
  loader: glob({ pattern: "*.md", base: "./content/case-studies" }),
  schema: z.object({
    title: z.string(),
    order: z.number(),
    summary: z.string(),
    role: z.string(),
    dates: z.string(),
    tags: z.array(z.string()),
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
    alt: z.string(),
    home: z.boolean().default(false),
  }),
});

export const collections = { site, caseStudies, about, play };
