const importedImages = import.meta.glob(
  "./**/*.{png,jpg,jpeg,webp,svg}",
  {
    eager: true,
    import: "default",
  },
) as Record<string, string>;


/**
 * Normalize paths so Windows paths, absolute-style paths,
 * and relative paths can all be compared safely.
 */
function normalizePath(path: string): string {
  return path
    .replace(/\\/g, "/")
    .replace(/^\.?\//, "")
    .replace(/^frontend\/src\/components\/templates\//i, "")
    .replace(/^src\/components\/templates\//i, "")
    .replace(/^components\/templates\//i, "")
    .replace(/^templates\//i, "")
    .replace(/^assets\//i, "")
    .trim();
}


/**
 * Extract only the file name from a path.
 *
 * Example:
 * wedding/Blue Wedding.png
 * ->
 * Blue Wedding.png
 */
function getFileName(path: string): string {
  const normalized = normalizePath(path);

  return normalized.split("/").pop() ?? normalized;
}


/**
 * Resolve an invitation template image.
 *
 * Supports:
 * - HTTP/HTTPS images
 * - data URLs
 * - blob URLs
 * - exact local paths
 * - category/image paths
 * - image file names only
 */
export function resolveTemplateImage(
  path?: string | null,
): string | undefined {
  if (!path) {
    return undefined;
  }

  // External image URL
  if (/^(https?:|data:|blob:)/i.test(path)) {
    return path;
  }

  const normalizedPath = normalizePath(path);

  // ---------------------------------------------------------
  // 1. Try exact path
  // ---------------------------------------------------------

  const exactCandidates = [
    `./${normalizedPath}`,
    `./wedding/${normalizedPath}`,
    `./birthday/${normalizedPath}`,
    `./office/${normalizedPath}`,
  ];

  for (const candidate of exactCandidates) {
    const image = importedImages[candidate];

    if (image) {
      return image;
    }
  }


  // ---------------------------------------------------------
  // 2. Try matching by complete normalized path
  // ---------------------------------------------------------

  const normalizedLower =
    normalizedPath.toLowerCase();

  const pathMatch = Object.entries(
    importedImages,
  ).find(([imagePath]) => {
    const normalizedImagePath = normalizePath(
      imagePath,
    ).toLowerCase();

    return (
      normalizedImagePath === normalizedLower ||
      normalizedImagePath.endsWith(
        `/${normalizedLower}`,
      )
    );
  });

  if (pathMatch) {
    return pathMatch[1];
  }


  // ---------------------------------------------------------
  // 3. Try matching only by file name
  // ---------------------------------------------------------

  const requestedFileName =
    getFileName(normalizedPath).toLowerCase();

  const fileNameMatch = Object.entries(
    importedImages,
  ).find(([imagePath]) => {
    const importedFileName =
      getFileName(imagePath).toLowerCase();

    return importedFileName === requestedFileName;
  });

  if (fileNameMatch) {
    return fileNameMatch[1];
  }


  // ---------------------------------------------------------
  // No matching image
  // ---------------------------------------------------------

  console.warn(
    `[Template Image] Image not found: ${path}`,
  );

  return undefined;
}