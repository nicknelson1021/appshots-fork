/**
 * TextElement Component
 *
 * Renders a draggable text element (headline or subheadline) with selection state.
 */

import type React from "react";
import { getTextSelectionStyles } from "./utils";
import { Z_INDEX } from "./constants";
import { normalizeRichTextHighlights } from "../../lib/rich-text-highlight";
import type { TextBlockAlign } from "../../types";

interface TextElementProps {
  /** Type of text element */
  type: "headline" | "subheadline";
  /** HTML content to display */
  content: string;
  /** Horizontal position as percentage */
  x: number;
  /** Vertical position as percentage */
  y: number;
  /** Width as percentage */
  width: number;
  /** Font size in pixels */
  fontSize: number;
  /** Text color */
  color: string;
  /** Font family name */
  fontFamily: string;
  /** Extra letter-spacing in em (matches canvas export) */
  letterSpacingEm?: number;
  /** Block alignment (sets how horizontal % maps and text justification) */
  textAlign: TextBlockAlign;
  /** Whether this element is selected */
  isSelected: boolean;
  /** Whether mouse interactions are enabled */
  isInteractive: boolean;
  /** Handler for mouse down event */
  onMouseDown: (e: React.MouseEvent) => void;
}

/**
 * TextElement - Draggable text component for headlines and subheadlines
 *
 * Renders styled text that can be dragged to reposition.
 * Supports HTML content for rich text formatting.
 *
 * @param props - Component props
 *
 * @example
 * <TextElement
 *   type="headline"
 *   content="<b>Welcome</b>"
 *   x={50}
 *   y={10}
 *   width={80}
 *   fontSize={24}
 *   color="#ffffff"
 *   fontFamily="Inter"
 *   isSelected={true}
 *   isInteractive={true}
 *   onMouseDown={handleMouseDown}
 * />
 */
export const TextElement = ({
  type,
  content,
  x,
  y,
  width,
  fontSize,
  color,
  fontFamily,
  letterSpacingEm = 0,
  textAlign,
  isSelected,
  isInteractive,
  onMouseDown,
}: TextElementProps) => {
  const isHeadline = type === "headline";
  const normalizedContent = normalizeRichTextHighlights(content);

  const alignClass =
    textAlign === "left"
      ? "text-left"
      : textAlign === "right"
        ? "text-right"
        : "text-center";

  /**
   * Horizontal % is always distance from the canvas **left** edge to the block anchor:
   * left edge (left), center (center), or right edge (right).
   */
  const xTransform =
    textAlign === "center"
      ? "translateX(-50%)"
      : textAlign === "left"
        ? "translateX(0)"
        : "translateX(-100%)";

  return (
    <div
      data-draggable-element={type}
      className={`absolute cursor-move select-none whitespace-pre-wrap overflow-hidden ${alignClass} ${
        isHeadline ? "font-bold" : "font-semibold"
      }`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: xTransform,
        width: `${width}%`,
        maxWidth: `${width}%`,
        fontSize: `${fontSize}px`,
        lineHeight: 1.1,
        color,
        fontFamily: `'${fontFamily}', sans-serif`,
        letterSpacing: `${letterSpacingEm}em`,
        wordWrap: "break-word",
        overflowWrap: "break-word",
        zIndex: Z_INDEX.text,
        padding: "4px",
        borderRadius: "4px",
        ...getTextSelectionStyles(isSelected),
      }}
      onMouseDown={isInteractive ? onMouseDown : undefined}
      onClick={(e) => e.stopPropagation()}
      dangerouslySetInnerHTML={{ __html: normalizedContent }}
    />
  );
};
