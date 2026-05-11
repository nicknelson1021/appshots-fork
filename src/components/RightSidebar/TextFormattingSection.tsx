/**
 * TextFormattingSection Component
 *
 * Font sizes, vertical placement on the canvas, and text block widths.
 */

import type { Screenshot, TextBlockAlign } from "../../types";
import { SidebarSection } from "./SidebarSection";
import { RangeSlider } from "./RangeSlider";
import { SLIDER_RANGES, STYLES } from "./constants";

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

  const headlineX = Math.min(
    SLIDER_RANGES.textVertical.max,
    Math.max(SLIDER_RANGES.textVertical.min, screenshot.headlineX),
  );
  const subheadlineX = Math.min(
    SLIDER_RANGES.textVertical.max,
    Math.max(SLIDER_RANGES.textVertical.min, screenshot.subheadlineX),
  );

  const AlignToggle = ({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: TextBlockAlign;
    onChange: (next: TextBlockAlign) => void;
  }) => (
    <div>
      <span className="block text-xs text-gray-400 mb-2">{label}</span>
      <div className="flex gap-1 p-0.5 bg-[#2a2a2a] rounded-lg">
        {(["left", "center", "right"] as const).map((a) => (
          <button
            key={a}
            type="button"
            className={`${STYLES.modeButton} ${value === a ? STYLES.modeButtonActive : STYLES.modeButtonInactive}`}
            onClick={() => onChange(a)}
          >
            {a === "left" ? "Left" : a === "center" ? "Center" : "Right"}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <SidebarSection title="Text formatting">
      <p className="text-[11px] text-gray-500 mb-3 leading-snug">
        Horizontal position is always measured from the screenshot&apos;s{" "}
        <span className="text-gray-400">left edge</span> (0% at the left, 100% at the
        right). With <span className="text-gray-400">Left</span>, the slider moves the
        block&apos;s <span className="text-gray-400">left edge</span>; with{" "}
        <span className="text-gray-400">Center</span>, it moves the{" "}
        <span className="text-gray-400">center</span> (about 50% centers the block on
        the canvas); with <span className="text-gray-400">Right</span>, it moves the{" "}
        <span className="text-gray-400">right edge</span> (about 100% pins text to the
        right). Switching alignment reuses the same number but changes which point is
        anchored—adjust the % if the block jumps. Vertical:{" "}
        <span className="text-gray-400">0%</span> top →{" "}
        <span className="text-gray-400">100%</span> bottom. Letter spacing uses em
        (caps often <span className="text-gray-400">0.12–0.20</span>).
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

        <AlignToggle
          label="Headline alignment"
          value={screenshot.headlineTextAlign}
          onChange={(headlineTextAlign) => onUpdateScreenshot({ headlineTextAlign })}
        />

        <AlignToggle
          label="Subheadline alignment"
          value={screenshot.subheadlineTextAlign}
          onChange={(subheadlineTextAlign) =>
            onUpdateScreenshot({ subheadlineTextAlign })
          }
        />

        <RangeSlider
          label="Headline horizontal"
          value={headlineX}
          min={SLIDER_RANGES.textVertical.min}
          max={SLIDER_RANGES.textVertical.max}
          unit="%"
          onChange={(v) => onUpdateScreenshot({ headlineX: v })}
        />

        <RangeSlider
          label="Subheadline horizontal"
          value={subheadlineX}
          min={SLIDER_RANGES.textVertical.min}
          max={SLIDER_RANGES.textVertical.max}
          unit="%"
          onChange={(v) => onUpdateScreenshot({ subheadlineX: v })}
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
