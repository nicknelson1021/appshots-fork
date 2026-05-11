/**
 * ContentSection Component
 *
 * Text content editors for headline and subheadline.
 */

import type { Screenshot } from "../../types";
import { SidebarSection } from "./SidebarSection";
import { RichTextEditor } from "../RichTextEditor";

interface ContentSectionProps {
  /** Active screenshot data */
  screenshot: Screenshot;
  /** Update screenshot handler */
  onUpdateScreenshot: (updates: Partial<Screenshot>) => void;
}

/**
 * ContentSection - Text content editors
 *
 * Rich text editors for headline and subheadline.
 *
 * @param props - Component props
 */
export const ContentSection = ({
  screenshot,
  onUpdateScreenshot,
}: ContentSectionProps) => {
  const headlineAlignClass =
    screenshot.headlineTextAlign === "left"
      ? "text-left"
      : screenshot.headlineTextAlign === "right"
        ? "text-right"
        : "text-center";
  const subAlignClass =
    screenshot.subheadlineTextAlign === "left"
      ? "text-left"
      : screenshot.subheadlineTextAlign === "right"
        ? "text-right"
        : "text-center";

  return (
    <SidebarSection title="Content">
      <div className="space-y-4">
        <div>
          <label className="block text-xs text-gray-400 mb-1">Headline</label>
          <RichTextEditor
            value={screenshot.headline}
            onChange={(html) => onUpdateScreenshot({ headline: html })}
            placeholder="Enter headline..."
            editorFontFamily={screenshot.headlineFontFamily}
            className={headlineAlignClass}
          />
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1">Subheadline</label>
          <RichTextEditor
            value={screenshot.subheadline}
            onChange={(html) => onUpdateScreenshot({ subheadline: html })}
            placeholder="Enter subheadline..."
            editorFontFamily={screenshot.subheadlineFontFamily}
            className={subAlignClass}
          />
        </div>
      </div>
    </SidebarSection>
  );
};
