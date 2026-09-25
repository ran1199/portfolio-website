// Builds links that work both on the temporary GitHub Pages address
// (which lives under /portfolio-website/) and on the custom domain later.
export function withBase(path = ""): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return `${base}/${path.replace(/^\//, "")}`;
}
