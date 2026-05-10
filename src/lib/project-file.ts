/**
 * Single-project JSON export/import (.json files).
 * Version aligns with {@link CURRENT_VERSION} in useLocalStorage.
 */

import type { Project } from "../types";
import { CURRENT_VERSION } from "./useLocalStorage";

export const PROJECT_FILE_KIND = "appshots-project" as const;

export type AppshotsProjectFile = {
  version: number;
  kind: typeof PROJECT_FILE_KIND;
  exportedAt: number;
  project: Project;
};

export function serializeAppshotsProjectFile(project: Project): string {
  const payload: AppshotsProjectFile = {
    version: CURRENT_VERSION,
    kind: PROJECT_FILE_KIND,
    exportedAt: Date.now(),
    project,
  };
  return JSON.stringify(payload, null, 2);
}

/**
 * Validates and returns the embedded project from an exported file or compatible JSON.
 */
export function parseAppshotsProjectFile(json: unknown): Project {
  if (!json || typeof json !== "object") {
    throw new Error("Invalid file: expected a JSON object.");
  }

  const root = json as Record<string, unknown>;

  if (root.version !== CURRENT_VERSION) {
    throw new Error(
      `This file was saved with a different format (version ${String(root.version)}). Expected version ${CURRENT_VERSION}.`,
    );
  }

  if (root.kind !== PROJECT_FILE_KIND) {
    throw new Error("This file is not an appshots project export.");
  }

  const project = root.project;
  if (!project || typeof project !== "object") {
    throw new Error("Invalid file: missing project data.");
  }

  const p = project as Record<string, unknown>;
  if (typeof p.name !== "string" || !Array.isArray(p.screenshots)) {
    throw new Error("Invalid file: project is missing a name or screenshots.");
  }

  return project as Project;
}
