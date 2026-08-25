const importedImages = import.meta.glob(
  "./**/*.{png,jpg,jpeg,webp,svg}",
  { eager: true, import: "default" },
) as Record<string, string>;

export function resolveTemplateImage(path?: string | null): string | undefined {
  if (!path) return undefined;
  if (/^(https?:|data:|blob:)/i.test(path)) return path;

  const normalizedPath = path
    .replace(/\\/g, "/")
    .replace(/^\.\//, "")
    .replace(/^\//, "");

  return importedImages[`./${normalizedPath}`];
}
