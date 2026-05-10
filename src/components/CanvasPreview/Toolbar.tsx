/**
 * Toolbar Component
 *
 * Top toolbar for the canvas preview area with screenshot management controls.
 */

import {
  AlignHorizontalJustifyCenter,
  CopyPlus,
  Plus,
  Smartphone,
} from "lucide-react";

interface ToolbarProps {
  /** Callback to add a new screenshot */
  onAddScreenshot: () => void;
  /** Duplicate the active screenshot (inserted after it) */
  onDuplicateScreenshot: () => void;
  /** Center headline and subheadline horizontally on the canvas */
  onCenterTextHorizontally: () => void;
  /** Center the selected device horizontally on the canvas */
  onCenterDeviceHorizontally: () => void;
  /** Total number of screenshots */
  screenshotCount: number;
}

/**
 * Toolbar - Canvas top toolbar with controls
 *
 * Displays the "Add Screenshot" button and screenshot count.
 *
 * @param props - Component props
 * @param props.onAddScreenshot - Handler for adding new screenshot
 * @param props.onDuplicateScreenshot - Handler for duplicating active screenshot
 * @param props.onCenterTextHorizontally - Handler to center text on the canvas
 * @param props.onCenterDeviceHorizontally - Handler to center the active device horizontally
 * @param props.screenshotCount - Current number of screenshots
 *
 * @example
 * <Toolbar onAddScreenshot={addScreenshot} onDuplicateScreenshot={duplicateScreenshot} onCenterTextHorizontally={centerText} screenshotCount={3} />
 */
export const Toolbar = ({
  onAddScreenshot,
  onDuplicateScreenshot,
  onCenterTextHorizontally,
  onCenterDeviceHorizontally,
  screenshotCount,
}: ToolbarProps) => (
  <div className="h-14 border-b border-white/10 bg-[#141414] flex items-center px-4 gap-4">
    <div className="flex items-center gap-2 flex-wrap">
      <button
        type="button"
        onClick={onAddScreenshot}
        className="flex items-center gap-1.5 bg-white hover:bg-neutral-200 text-black text-sm font-medium px-3 py-1.5 rounded-md transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add Screenshot
      </button>
      <button
        type="button"
        onClick={onDuplicateScreenshot}
        title="Duplicate the selected screenshot"
        className="flex items-center gap-1.5 border border-white/20 hover:bg-white/10 text-white text-sm font-medium px-3 py-1.5 rounded-md transition-colors"
      >
        <CopyPlus className="w-4 h-4" />
        Duplicate
      </button>
      <button
        type="button"
        onClick={onCenterTextHorizontally}
        title="Center headline and subheadline horizontally"
        className="flex items-center gap-1.5 border border-white/20 hover:bg-white/10 text-white text-sm font-medium px-3 py-1.5 rounded-md transition-colors"
      >
        <AlignHorizontalJustifyCenter className="w-4 h-4" />
        Center text
      </button>
      <button
        type="button"
        onClick={onCenterDeviceHorizontally}
        title="Center the selected device horizontally"
        className="flex items-center gap-1.5 border border-white/20 hover:bg-white/10 text-white text-sm font-medium px-3 py-1.5 rounded-md transition-colors"
      >
        <Smartphone className="w-4 h-4" />
        Center device
      </button>
    </div>
    <div className="flex-1" />
    <span className="text-xs text-gray-400">
      {screenshotCount} screenshot{screenshotCount !== 1 ? "s" : ""}
    </span>
  </div>
);
