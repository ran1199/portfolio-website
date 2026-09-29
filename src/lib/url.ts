// Builds links from the site root (the site used to live under
// /portfolio-website/ on GitHub Pages; now it is at the domain root).
export function withBase(path = ""): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return `${base}/${path.replace(/^\//, "")}`;
}
