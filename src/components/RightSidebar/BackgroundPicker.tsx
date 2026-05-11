/**
 * BackgroundPicker Component
 *
 * Background mode and color/gradient/image selection.
 */

import { useRef } from "react";
import type {
  Screenshot,
  GradientPreset,
  BackgroundImageFit,
} from "../../types";
import { STYLES } from "./constants";

interface BackgroundPickerProps {
  /** Active screenshot data */
  screenshot: Screenshot;
  /** Available gradient presets */
  gradientPresets: GradientPreset[];
  /** Update screenshot handler */
  onUpdateScreenshot: (updates: Partial<Screenshot>) => void;
}

const FIT_OPTIONS: { id: BackgroundImageFit; label: string }[] = [
  { id: "cover", label: "Cover" },
  { id: "contain", label: "Contain" },
  { id: "fill", label: "Fill" },
];

/**
 * BackgroundPicker - Background style selector
 *
 * Solid color, gradient presets, or uploaded background image (local file → data URL).
 *
 * @param props - Component props
 */
export const BackgroundPicker = ({
  screenshot,
  gradientPresets,
  onUpdateScreenshot,
}: BackgroundPickerProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        onUpdateScreenshot({
          backgroundMode: "image",
          backgroundImageSrc: result,
        });
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const clearBackgroundImage = () => {
    onUpdateScreenshot({ backgroundImageSrc: null });
  };

  return (
    <div>
      <label className="block text-xs text-gray-400 mb-1">Background</label>
      <div className="space-y-2">
        {/* Mode toggle */}
        <div className="grid grid-cols-3 gap-1">
          <button
            type="button"
            onClick={() => onUpdateScreenshot({ backgroundMode: "solid" })}
            className={`${STYLES.modeButton} ${
              screenshot.backgroundMode === "solid"
                ? STYLES.modeButtonActive
                : STYLES.modeButtonInactive
            }`}
          >
            Solid
          </button>
          <button
            type="button"
            onClick={() => onUpdateScreenshot({ backgroundMode: "gradient" })}
            className={`${STYLES.modeButton} ${
              screenshot.backgroundMode === "gradient"
                ? STYLES.modeButtonActive
                : STYLES.modeButtonInactive
            }`}
          >
            Gradient
          </button>
          <button
            type="button"
            onClick={() => onUpdateScreenshot({ backgroundMode: "image" })}
            className={`${STYLES.modeButton} ${
              screenshot.backgroundMode === "image"
                ? STYLES.modeButtonActive
                : STYLES.modeButtonInactive
            }`}
          >
            Image
          </button>
        </div>

        {screenshot.backgroundMode === "solid" ? (
          <input
            type="color"
            value={screenshot.backgroundColor}
            onChange={(e) =>
              onUpdateScreenshot({ backgroundColor: e.target.value })
            }
            className={STYLES.colorInput}
          />
        ) : screenshot.backgroundMode === "gradient" ? (
          <div className="grid grid-cols-3 gap-1">
            {gradientPresets.map((preset) => (
              <button
                type="button"
                key={preset.id}
                onClick={() =>
                  onUpdateScreenshot({ gradientPresetId: preset.id })
                }
                className={`${STYLES.gradientButton} ${
                  screenshot.gradientPresetId === preset.id
                    ? STYLES.gradientButtonActive
                    : ""
                }`}
                style={{
                  background: `linear-gradient(135deg, ${preset.from}, ${preset.to})`,
                }}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageFile}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={STYLES.uploadButton}
            >
              {screenshot.backgroundImageSrc ? "Change image" : "Upload image"}
            </button>
            {screenshot.backgroundImageSrc ? (
              <>
                <div
                  className="h-16 w-full rounded-md border border-white/10 bg-[#2a2a2a] bg-center bg-no-repeat"
                  style={{
                    backgroundColor: screenshot.backgroundColor,
                    backgroundImage: `url(${JSON.stringify(screenshot.backgroundImageSrc)})`,
                    backgroundSize:
                      screenshot.backgroundImageFit === "fill"
                        ? "100% 100%"
                        : screenshot.backgroundImageFit,
                  }}
                  aria-hidden
                />
                <button
                  type="button"
                  onClick={clearBackgroundImage}
                  className="w-full text-xs py-1.5 rounded-md bg-[#2a2a2a] hover:bg-[#333] text-gray-400 hover:text-gray-200 transition-colors"
                >
                  Remove image
                </button>
              </>
            ) : (
              <p className="text-xs text-gray-500">
                Choose a file from your computer. The image is stored in this
                project only (not loaded from a URL).
              </p>
            )}
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Fallback color
              </label>
              <p className="text-xs text-gray-500 mb-1">
                Letterboxing for Contain, or behind transparent pixels.
              </p>
              <input
                type="color"
                value={screenshot.backgroundColor}
                onChange={(e) =>
                  onUpdateScreenshot({ backgroundColor: e.target.value })
                }
                className={STYLES.colorInput}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Image fit
              </label>
              <div className="grid grid-cols-3 gap-1">
                {FIT_OPTIONS.map(({ id, label }) => (
                  <button
                    type="button"
                    key={id}
                    onClick={() => onUpdateScreenshot({ backgroundImageFit: id })}
                    className={`${STYLES.modeButton} ${
                      screenshot.backgroundImageFit === id
                        ? STYLES.modeButtonActive
                        : STYLES.modeButtonInactive
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
