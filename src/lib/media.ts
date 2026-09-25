// Finds images and videos in content/images/ by folder and file name,
// so content files only need to say e.g. cover: "cover.jpg".
import type { ImageMetadata } from "astro";

const images = import.meta.glob<{ default: ImageMetadata }>(
  "/content/images/**/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}",
  { eager: true },
);

const videos = import.meta.glob<string>("/content/images/**/*.{mp4,webm,MP4,WEBM}", {
  eager: true,
  query: "?url",
  import: "default",
});

function notFound(folder: string, file: string): never {
  // Stops the build with a clear message instead of showing a broken image.
  throw new Error(
    `File not found: content/images/${folder}/${file} — check the file name ` +
      `(it must match exactly, including capital letters).`,
  );
}

export function findImage(folder: string, file: string): ImageMetadata {
  return images[`/content/images/${folder}/${file}`]?.default ?? notFound(folder, file);
}

export function findVideo(folder: string, file: string): string {
  return videos[`/content/images/${folder}/${file}`] ?? notFound(folder, file);
}
