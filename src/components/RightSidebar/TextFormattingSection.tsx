/**
 * TextFormattingSection Component
 *
 * Font sizes, vertical placement on the canvas, and text block widths.
 */

import type { Screenshot } from "../../types";
import { SidebarSection } from "./SidebarSection";
import { RangeSlider } from "./RangeSlider";
import { SLIDER_RANGES } from "./constants";

interface TextFormattingSectionProps {
  screenshot: Screenshot;
  headlineFontSize: number;
  subheadlineFontSize: number;
  onUpdateScreenshot: (updates: Partial<Screenshot>) => void;
  onHeadlineSizeChange: (size: number) => void;
  onSubheadlineSizeChange: (size: number) => void;
}

export const TextFormattingSection = ({
  screenshot,
  headlineFontSize,
  subheadlineFontSize,
  onUpdateScreenshot,
  onHeadlineSizeChange,
  onSubheadlineSizeChange,
}: TextFormattingSectionProps) => {
  const headlineY = Math.min(
    SLIDER_RANGES.textVertical.max,
    Math.max(SLIDER_RANGES.textVertical.min, screenshot.headlineY),
  );
  const subheadlineY = Math.min(
    SLIDER_RANGES.textVertical.max,
    Math.max(SLIDER_RANGES.textVertical.min, screenshot.subheadlineY),
  );

  const headlineLs = Math.min(
    SLIDER_RANGES.letterSpacingEm.max,
    Math.max(
      SLIDER_RANGES.letterSpacingEm.min,
      screenshot.headlineLetterSpacingEm,
    ),
  );
  const subheadlineLs = Math.min(
    SLIDER_RANGES.letterSpacingEm.max,
    Math.max(
      SLIDER_RANGES.letterSpacingEm.min,
      screenshot.subheadlineLetterSpacingEm,
    ),
  );

  return (
    <SidebarSection title="Text formatting">
      <p className="text-[11px] text-gray-500 mb-3 leading-snug">
        Vertical position is measured on the full screenshot canvas:{" "}
        <span className="text-gray-400">0%</span> at the top edge,{" "}
        <span className="text-gray-400">100%</span> at the bottom edge.
        Letter spacing uses em (typical tight caps:{" "}
        <span className="text-gray-400">0.05–0.12</span>).
      </p>
      <div className="space-y-3">
        <RangeSlider
          label="Headline size"
          value={headlineFontSize}
          min={SLIDER_RANGES.headlineSize.min}
          max={SLIDER_RANGES.headlineSize.max}
          unit="px"
          onChange={onHeadlineSizeChange}
        />

        <RangeSlider
          label="Subheadline size"
          value={subheadlineFontSize}
          min={SLIDER_RANGES.subheadlineSize.min}
          max={SLIDER_RANGES.subheadlineSize.max}
          unit="px"
          onChange={onSubheadlineSizeChange}
        />

        <RangeSlider
          label="Headline vertical"
          value={headlineY}
          min={SLIDER_RANGES.textVertical.min}
          max={SLIDER_RANGES.textVertical.max}
          unit="%"
          onChange={(v) => onUpdateScreenshot({ headlineY: v })}
        />

        <RangeSlider
          label="Subheadline vertical"
          value={subheadlineY}
          min={SLIDER_RANGES.textVertical.min}
          max={SLIDER_RANGES.textVertical.max}
          unit="%"
          onChange={(v) => onUpdateScreenshot({ subheadlineY: v })}
        />

        <RangeSlider
          label="Headline letter spacing"
          value={headlineLs}
          min={SLIDER_RANGES.letterSpacingEm.min}
          max={SLIDER_RANGES.letterSpacingEm.max}
          step={SLIDER_RANGES.letterSpacingEm.step}
          unit=" em"
          onChange={(v) => onUpdateScreenshot({ headlineLetterSpacingEm: v })}
        />

        <RangeSlider
          label="Subheadline letter spacing"
          value={subheadlineLs}
          min={SLIDER_RANGES.letterSpacingEm.min}
          max={SLIDER_RANGES.letterSpacingEm.max}
          step={SLIDER_RANGES.letterSpacingEm.step}
          unit=" em"
          onChange={(v) => onUpdateScreenshot({ subheadlineLetterSpacingEm: v })}
        />

        <RangeSlider
          label="Headline width"
          value={screenshot.headlineWidth}
          min={SLIDER_RANGES.textWidth.min}
          max={SLIDER_RANGES.textWidth.max}
          step={SLIDER_RANGES.textWidth.step}
          unit="%"
          onChange={(v) => onUpdateScreenshot({ headlineWidth: v })}
        />

        <RangeSlider
          label="Subheadline width"
          value={screenshot.subheadlineWidth}
          min={SLIDER_RANGES.textWidth.min}
          max={SLIDER_RANGES.textWidth.max}
          step={SLIDER_RANGES.textWidth.step}
          unit="%"
          onChange={(v) => onUpdateScreenshot({ subheadlineWidth: v })}
        />
      </div>
    </SidebarSection>
  );
};
