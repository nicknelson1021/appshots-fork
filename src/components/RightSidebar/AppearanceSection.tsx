/**
 * AppearanceSection Component
 *
 * Visual appearance controls including background, text color, font, and screenshot image.
 */

import { ChevronDown } from "lucide-react";
import type { Screenshot, GradientPreset } from "../../types";
import { SidebarSection } from "./SidebarSection";
import { BackgroundPicker } from "./BackgroundPicker";
import { STYLES } from "./constants";

interface AppearanceSectionProps {
  /** Active screenshot data */
  screenshot: Screenshot;
  /** Available gradient presets */
  gradientPresets: GradientPreset[];
  /** Update screenshot handler */
  onUpdateScreenshot: (updates: Partial<Screenshot>) => void;
  /** Open font picker for headline or subheadline */
  onOpenFontPicker: (target: "headline" | "subheadline") => void;
}

/**
 * AppearanceSection - Visual appearance controls
 *
 * Background, text color, headline/subheadline fonts, and screenshot image settings.
 *
 * @param props - Component props
 */
export const AppearanceSection = ({
  screenshot,
  gradientPresets,
  onUpdateScreenshot,
  onOpenFontPicker,
}: AppearanceSectionProps) => (
  <SidebarSection title="Appearance">
    <div className="space-y-4">
      {/* Background */}
      <BackgroundPicker
        screenshot={screenshot}
        gradientPresets={gradientPresets}
        onUpdateScreenshot={onUpdateScreenshot}
      />

      {/* Text Color */}
      <div>
        <label className="block text-xs text-gray-400 mb-1">Text Color</label>
        <input
          type="color"
          value={screenshot.textColor}
          onChange={(e) => onUpdateScreenshot({ textColor: e.target.value })}
          className={STYLES.colorInput}
        />
      </div>

      {/* Fonts */}
      <div>
        <label className="block text-xs text-gray-400 mb-1">Headline font</label>
        <button
          type="button"
          onClick={() => onOpenFontPicker("headline")}
          className={STYLES.dropdownButton}
        >
          <span
            style={{
              fontFamily: `'${screenshot.headlineFontFamily}', sans-serif`,
            }}
          >
            {screenshot.headlineFontFamily}
          </span>
          <ChevronDown size={16} className="text-gray-400" />
        </button>
      </div>
      <div>
        <label className="block text-xs text-gray-400 mb-1">
          Subheadline font
        </label>
        <button
          type="button"
          onClick={() => onOpenFontPicker("subheadline")}
          className={STYLES.dropdownButton}
        >
          <span
            style={{
              fontFamily: `'${screenshot.subheadlineFontFamily}', sans-serif`,
            }}
          >
            {screenshot.subheadlineFontFamily}
          </span>
          <ChevronDown size={16} className="text-gray-400" />
        </button>
      </div>
    </div>
  </SidebarSection>
);
