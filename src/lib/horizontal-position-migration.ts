import type { Project, Screenshot } from "../types";

/**
 * v2 stored right-aligned headline/subheadline X as **inset from the right** (%).
 * v3 stores X as **distance from the left edge of the canvas** to the alignment anchor
 * (left edge / center / right edge depending on textAlign).
 */
export function migrateScreenshotHorizontalV2ToV3(s: Screenshot): Screenshot {
  return {
    ...s,
    headlineX:
      s.headlineTextAlign === "right" ? 100 - s.headlineX : s.headlineX,
    subheadlineX:
      s.subheadlineTextAlign === "right"
        ? 100 - s.subheadlineX
        : s.subheadlineX,
  };
}

export function migrateProjectsHorizontalV2ToV3(projects: Project[]): Project[] {
  return projects.map((p) => ({
    ...p,
    screenshots: p.screenshots.map(migrateScreenshotHorizontalV2ToV3),
  }));
}
