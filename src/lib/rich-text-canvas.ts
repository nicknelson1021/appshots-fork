/**
 * Rich Text Canvas Renderer
 * Parses HTML formatted text and renders it on a canvas with proper styling
 */

import {
  RICH_TEXT_HIGHLIGHT_HEIGHT_EM,
  RICH_TEXT_HIGHLIGHT_RADIUS_EM,
  RICH_TEXT_HIGHLIGHT_SPREAD_EM,
  RICH_TEXT_HIGHLIGHT_TOP_OFFSET_EM,
} from "./rich-text-highlight";

export interface StyledSegment {
  text: string;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  color: string;
  backgroundColor: string | null;
}

export interface RenderOptions {
  x: number;
  y: number;
  maxWidth: number;
  fontSize: number;
  fontFamily: string;
  defaultColor: string;
  lineHeight: number;
  textAlign: "left" | "center" | "right";
  fontWeight?: number;
  /** Extra spacing between glyphs, in em (same as CSS letter-spacing magnitude × font size) */
  letterSpacingEm?: number;
}

/**
 * Paragraph-level alignment inside exported rich text HTML (often `style="text-align:left"`
 * from contentEditable). Matches how the preview looks when inline CSS overrides the
 * TextElement wrapper. Default when absent is **left** — same as browsers.
 */
export function inferParagraphTextAlign(html: string): "left" | "center" | "right" {
  const trimmed = html.trim();
  if (!trimmed) return "left";

  const parser = new DOMParser();
  const wrapper = parser.parseFromString(`<div>${trimmed}</div>`, "text/html")
    .body.firstElementChild;
  if (!wrapper) return "left";

  const normalize = (
    raw: string,
  ): "left" | "center" | "right" | null => {
    const v = raw.trim().toLowerCase().replace(/;$/, "").split(/\s+/)[0]!;
    if (!v || v === "justify" || v === "start" || v === "left") return "left";
    if (v === "middle" || v === "center") return "center";
    if (v === "right" || v === "end") return "right";
    return null;
  };

  const queue: Element[] = [wrapper];
  for (let i = 0; i < queue.length; i++) {
    const el = queue[i]!;
    for (const c of Array.from(el.children)) {
      queue.push(c);
    }

    const styleAttr = el.getAttribute("style");
    if (styleAttr) {
      const m = styleAttr.match(/text-align\s*:\s*([^;]+)/i);
      if (m?.[1]) {
        const n = normalize(m[1]);
        if (n) return n;
      }
    }

    const alignAttr = el.getAttribute("align");
    if (alignAttr) {
      const n = normalize(alignAttr);
      if (n) return n;
    }
  }

  return "left";
}

/**
 * Parse HTML string into styled segments
 */
export function parseRichText(html: string, defaultColor: string): StyledSegment[] {
  const segments: StyledSegment[] = [];
  
  // Create a temporary DOM element to parse HTML
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div>${html}</div>`, "text/html");
  const root = doc.body.firstChild;
  
  if (!root) {
    return [
      {
        text: html,
        bold: false,
        italic: false,
        underline: false,
        color: defaultColor,
        backgroundColor: null,
      },
    ];
  }

  interface StyleState {
    bold: boolean;
    italic: boolean;
    underline: boolean;
    color: string;
    backgroundColor: string | null;
  }

  // Recursively walk the DOM tree
  function walkNode(node: Node, state: StyleState) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || "";
      if (text) {
        segments.push({
          text,
          bold: state.bold,
          italic: state.italic,
          underline: state.underline,
          color: state.color,
          backgroundColor: state.backgroundColor,
        });
      }
      return;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;
      const tagName = element.tagName.toLowerCase();
      
      // Clone state for children
      const childState: StyleState = { ...state };

      // Update state based on tag
      switch (tagName) {
        case "b":
        case "strong":
          childState.bold = true;
          break;
        case "i":
        case "em":
          childState.italic = true;
          break;
        case "u":
          childState.underline = true;
          break;
        case "font":
          const fontColor = element.getAttribute("color");
          if (fontColor) {
            childState.color = fontColor;
          }
          if (element.style.backgroundColor) {
            childState.backgroundColor = element.style.backgroundColor;
          }
          break;
        case "mark":
          childState.backgroundColor = element.style.backgroundColor || "yellow";
          break;
        case "span":
          // Check inline styles
          const style = element.style;
          if (style.fontWeight === "bold" || parseInt(style.fontWeight) >= 700) {
            childState.bold = true;
          }
          if (style.fontStyle === "italic") {
            childState.italic = true;
          }
          if (style.textDecoration?.includes("underline")) {
            childState.underline = true;
          }
          if (style.color) {
            childState.color = style.color;
          }
          if (style.backgroundColor) {
            childState.backgroundColor = style.backgroundColor;
          }
          break;
        case "br":
          segments.push({
            text: "\n",
            bold: state.bold,
            italic: state.italic,
            underline: state.underline,
            color: state.color,
            backgroundColor: state.backgroundColor,
          });
          return;
      }

      // Process children
      for (const child of Array.from(node.childNodes)) {
        walkNode(child, childState);
      }
    }
  }

  walkNode(root, {
    bold: false,
    italic: false,
    underline: false,
    color: defaultColor,
    backgroundColor: null,
  });

  return segments;
}

/**
 * Get plain text from HTML (for measurement purposes)
 */
export function getPlainText(html: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div>${html}</div>`, "text/html");
  return doc.body.textContent || html;
}

/**
 * Render rich text segments onto a canvas
 */
export function renderRichText(
  ctx: CanvasRenderingContext2D,
  segments: StyledSegment[],
  options: RenderOptions
): number {
  const {
    x,
    y,
    maxWidth,
    fontSize,
    fontFamily,
    lineHeight,
    textAlign,
    fontWeight = 400,
    letterSpacingEm = 0,
  } = options;

  const spacingPx = letterSpacingEm * fontSize;

  // Build font string for a segment
  const buildFont = (segment: StyledSegment): string => {
    const weight = segment.bold ? 700 : fontWeight;
    const style = segment.italic ? "italic" : "normal";
    return `${style} ${weight} ${fontSize}px ${fontFamily}`;
  };

  // Split segments into words while preserving styling
  interface Word {
    segments: StyledSegment[];
    width: number;
    isNewline: boolean;
  }

  const flattenWordChars = (
    word: Word,
  ): { segment: StyledSegment; ch: string }[] => {
    const chars: { segment: StyledSegment; ch: string }[] = [];
    for (const segment of word.segments) {
      for (let i = 0; i < segment.text.length; i++) {
        chars.push({ segment, ch: segment.text[i]! });
      }
    }
    return chars;
  };

  const measureFlattenedWord = (word: Word): number => {
    const chars = flattenWordChars(word);
    if (chars.length === 0) return 0;
    let total = 0;
    for (let i = 0; i < chars.length; i++) {
      ctx.font = buildFont(chars[i]!.segment);
      total += ctx.measureText(chars[i]!.ch).width;
      if (i < chars.length - 1) total += spacingPx;
    }
    return total;
  };

  // Measure text width for a segment
  const measureSegment = (segment: StyledSegment): number => {
    ctx.font = buildFont(segment);
    const t = segment.text;
    if (!spacingPx || t.length <= 1) {
      return ctx.measureText(t).width;
    }
    let w = 0;
    for (let i = 0; i < t.length; i++) {
      w += ctx.measureText(t[i]!).width;
      if (i < t.length - 1) w += spacingPx;
    }
    return w;
  };

  const drawRoundedHighlight = (
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
    color: string,
  ) => {
    const clampedRadius = Math.min(radius, width / 2, height / 2);

    ctx.beginPath();
    ctx.roundRect(x, y, width, height, clampedRadius);
    ctx.fillStyle = color;
    ctx.fill();
  };

  const words: Word[] = [];
  let currentWord: StyledSegment[] = [];
  let currentWordWidth = 0;

  for (const segment of segments) {
    if (segment.text === "\n") {
      // Push current word if any
      if (currentWord.length > 0) {
        words.push({ segments: currentWord, width: currentWordWidth, isNewline: false });
        currentWord = [];
        currentWordWidth = 0;
      }
      // Add newline marker
      words.push({ segments: [], width: 0, isNewline: true });
      continue;
    }

    // Split segment text by spaces
    const parts = segment.text.split(/( )/);
    
    for (const part of parts) {
      if (part === " ") {
        // Space ends a word
        if (currentWord.length > 0) {
          words.push({ segments: currentWord, width: currentWordWidth, isNewline: false });
          currentWord = [];
          currentWordWidth = 0;
        }
        // Add space as its own word
        const spaceSegment = { ...segment, text: " " };
        const spaceWidth = measureSegment(spaceSegment);
        words.push({ segments: [spaceSegment], width: spaceWidth, isNewline: false });
      } else if (part) {
        // Add to current word
        const partSegment = { ...segment, text: part };
        const partWidth = measureSegment(partSegment);
        currentWord.push(partSegment);
        currentWordWidth += partWidth;
      }
    }
  }

  // Don't forget the last word
  if (currentWord.length > 0) {
    words.push({ segments: currentWord, width: currentWordWidth, isNewline: false });
  }

  if (spacingPx) {
    for (const w of words) {
      if (!w.isNewline) {
        w.width = measureFlattenedWord(w);
      }
    }
  }

  // Group words into lines
  interface Line {
    words: Word[];
    width: number;
  }

  const lines: Line[] = [];
  let currentLine: Word[] = [];
  let currentLineWidth = 0;

  for (const word of words) {
    if (word.isNewline) {
      lines.push({ words: currentLine, width: currentLineWidth });
      currentLine = [];
      currentLineWidth = 0;
      continue;
    }

    const wordWidth = word.width;
    
    // Check if word fits on current line
    if (currentLineWidth + wordWidth <= maxWidth || currentLine.length === 0) {
      currentLine.push(word);
      currentLineWidth += wordWidth;
    } else {
      // Start new line
      lines.push({ words: currentLine, width: currentLineWidth });
      currentLine = [word];
      currentLineWidth = wordWidth;
    }
  }

  // Don't forget the last line
  if (currentLine.length > 0) {
    lines.push({ words: currentLine, width: currentLineWidth });
  }

  // Render lines
  let currentY = y;
  ctx.textBaseline = "top";

  for (const line of lines) {
    // Calculate starting X based on alignment
    let lineX: number;
    
    // Trim trailing spaces from line width calculation
    let trimmedWidth = line.width;
    const lastWord = line.words[line.words.length - 1];
    if (lastWord && lastWord.segments.length === 1 && lastWord.segments[0].text === " ") {
      trimmedWidth -= lastWord.width;
    }

    switch (textAlign) {
      case "left":
        // x = left edge of the text column (canvas px)
        lineX = x;
        break;
      case "center":
        // x = horizontal center of the text block
        lineX = x - trimmedWidth / 2;
        break;
      case "right":
        // x = right edge of the text column
        lineX = x - trimmedWidth;
        break;
      default:
        lineX = x - trimmedWidth / 2;
    }

    // Resolve line segments before drawing so highlight backgrounds can span
    // multiple words and spaces on the same line.
    interface PositionedSegment {
      segment: StyledSegment;
      x: number;
      width: number;
    }

    const positionedSegments: PositionedSegment[] = [];
    let currentX = lineX;

    for (const word of line.words) {
      if (spacingPx) {
        const chars = flattenWordChars(word);
        for (let i = 0; i < chars.length; i++) {
          const { segment, ch } = chars[i]!;
          ctx.font = buildFont(segment);
          const charSegment: StyledSegment = { ...segment, text: ch };
          const width = ctx.measureText(ch).width;
          positionedSegments.push({
            segment: charSegment,
            x: currentX,
            width,
          });
          currentX += width + (i < chars.length - 1 ? spacingPx : 0);
        }
      } else {
        for (const segment of word.segments) {
          ctx.font = buildFont(segment);
          const width = ctx.measureText(segment.text).width;
          positionedSegments.push({ segment, x: currentX, width });
          currentX += width;
        }
      }
    }

    const highlightSpread = fontSize * RICH_TEXT_HIGHLIGHT_SPREAD_EM;
    const highlightRadius = fontSize * RICH_TEXT_HIGHLIGHT_RADIUS_EM;
    const highlightY =
      currentY + fontSize * RICH_TEXT_HIGHLIGHT_TOP_OFFSET_EM - highlightSpread;
    const highlightHeight =
      fontSize * RICH_TEXT_HIGHLIGHT_HEIGHT_EM + highlightSpread * 2;

    interface HighlightRun {
      x: number;
      width: number;
      color: string;
    }

    const highlightRuns: HighlightRun[] = [];
    let currentRun: HighlightRun | null = null;

    for (const positionedSegment of positionedSegments) {
      const { segment, x, width } = positionedSegment;

      if (!segment.backgroundColor || width <= 0) {
        if (currentRun) {
          highlightRuns.push(currentRun);
          currentRun = null;
        }
        continue;
      }

      if (
        currentRun &&
        currentRun.color === segment.backgroundColor &&
        Math.abs(currentRun.x + currentRun.width - x) < 0.01
      ) {
        currentRun.width += width;
        continue;
      }

      if (currentRun) {
        highlightRuns.push(currentRun);
      }

      currentRun = {
        x,
        width,
        color: segment.backgroundColor,
      };
    }

    if (currentRun) {
      highlightRuns.push(currentRun);
    }

    for (const highlightRun of highlightRuns) {
      drawRoundedHighlight(
        highlightRun.x - highlightSpread,
        highlightY,
        highlightRun.width + highlightSpread * 2,
        highlightHeight,
        highlightRadius,
        highlightRun.color,
      );
    }

    for (const positionedSegment of positionedSegments) {
      const { segment, x, width } = positionedSegment;

      ctx.fillStyle = segment.color;
      ctx.fillText(segment.text, x, currentY);

      // Draw underline if needed
      if (segment.underline) {
        const underlineY = currentY + fontSize * 0.9;
        ctx.strokeStyle = segment.color;
        ctx.lineWidth = Math.max(1, fontSize / 15);
        ctx.beginPath();
        ctx.moveTo(x, underlineY);
        ctx.lineTo(x + width, underlineY);
        ctx.stroke();
      }
    }

    currentY += fontSize * lineHeight;
  }

  // Return the total height used
  return lines.length * fontSize * lineHeight;
}

/**
 * Convenience function to parse and render in one call
 */
export function drawRichText(
  ctx: CanvasRenderingContext2D,
  html: string,
  options: RenderOptions
): number {
  const segments = parseRichText(html, options.defaultColor);
  return renderRichText(ctx, segments, options);
}
