// Helpers for the Home/Work gallery (content/home-gallery.yaml).
// Works out what each tile shows (image, video or placeholder) and its
// shape (width ÷ height), read from the file itself when there is one.
import type { ImageMetadata } from "astro";
import { findImage, findVideo } from "./media";

export type GalleryMedia =
  | { kind: "image"; image: ImageMetadata; ratio: number }
  | { kind: "video"; src: string; poster?: ImageMetadata; ratio: number }
  | { kind: "placeholder"; name: string; ratio: number; ratioText: string };

// A file name that is empty or still says [PLACEHOLDER…] has no file yet.
export const isPlaceholder = (file?: string) =>
  !file || file.trim() === "" || file.trim().startsWith("[PLACEHOLDER");

// "4/5" → 0.8
export function parseRatio(text: string): number {
  const [w, h] = text.split("/").map((n) => parseFloat(n));
  return w > 0 && h > 0 ? w / h : 4 / 3;
}

export function resolveMedia(
  folder: string,
  file: string,
  poster: string,
  fallbackRatio: string,
): GalleryMedia {
  if (isPlaceholder(file)) {
    // "[PLACEHOLDER: gallery-01]" → "gallery-01"
    const name = file.replace(/^\[PLACEHOLDER:?\s*/i, "").replace(/\]$/, "").trim();
    return {
      kind: "placeholder",
      name,
      ratio: parseRatio(fallbackRatio),
      ratioText: fallbackRatio.replace(/\s/g, ""),
    };
  }
  if (/\.(mp4|webm)$/i.test(file)) {
    const posterImage = isPlaceholder(poster) ? undefined : findImage(folder, poster);
    return {
      kind: "video",
      src: findVideo(folder, file),
      poster: posterImage,
      // The poster is a frame of the video, so it has the video's shape.
      ratio: posterImage ? posterImage.width / posterImage.height : parseRatio(fallbackRatio),
    };
  }
  const image = findImage(folder, file);
  return { kind: "image", image, ratio: image.width / image.height };
}
