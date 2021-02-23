/**
 * Released under MIT License
 * Copyright (c) 2021 cell.ts
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. 
 */

import { IBufferCell } from 'xterm'
export const INVERTED_DEFAULT_COLOR = 257
export const NULL_CELL_CODE = 0
export const WHITESPACE_CELL_CHAR = ' '
export const enum Attributes {
  /**
   * bit 1..8     blue in RGB, color in P256 and P16
   */
  BLUE_MASK = 0xff,
  BLUE_SHIFT = 0,
  PCOLOR_MASK = 0xff,
  PCOLOR_SHIFT = 0,

  /**
   * bit 9..16    green in RGB
   */
  GREEN_MASK = 0xff00,
  GREEN_SHIFT = 8,

  /**
   * bit 17..24   red in RGB
   */
  RED_MASK = 0xff0000,
  RED_SHIFT = 16,

  /**
   * bit 25..26   color mode: DEFAULT (0) | P16 (1) | P256 (2) | RGB (3)
   */
  CM_MASK = 0x3000000,
  CM_DEFAULT = 0,
  CM_P16 = 0x1000000,
  CM_P256 = 0x2000000,
  CM_RGB = 0x3000000,

  /**
   * bit 1..24  RGB room
   */
  RGB_MASK = 0xffffff
}

export const BOLD_CLASS = 'xterm-bold'
export const DIM_CLASS = 'xterm-dim'
export const ITALIC_CLASS = 'xterm-italic'
export const UNDERLINE_CLASS = 'xterm-underline'
export const CURSOR_CLASS = 'xterm-cursor'
export const CURSOR_BLINK_CLASS = 'xterm-cursor-blink'
export const CURSOR_STYLE_BLOCK_CLASS = 'xterm-cursor-block'
export const CURSOR_STYLE_BAR_CLASS = 'xterm-cursor-bar'
export const CURSOR_STYLE_UNDERLINE_CLASS = 'xterm-cursor-underline'

function padStart(text: string, padChar: string, length: number): string {
  while (text.length < length) {
    text = padChar + text
  }
  return text
}

/**
 * Storing the styling from `_workCell` for Dom Renderer
 *
 * Attribution: from DomRenderRofFactory.createRow xterm v4.4.0
 *
 */
export default function prepareCellForDomRenderer(_workCell: IBufferCell) {
  const classList = []
  const style = {}
  let textContent

  if (_workCell.isBold()) {
    classList.push(BOLD_CLASS)
  }

  if (_workCell.isItalic()) {
    classList.push(ITALIC_CLASS)
  }

  if (_workCell.isDim()) {
    classList.push(DIM_CLASS)
  }

  if (_workCell.isUnderline()) {
    classList.push(UNDERLINE_CLASS)
  }

  if (_workCell.isInvisible()) {
    textContent = WHITESPACE_CELL_CHAR
  } else {
    textContent = _workCell.getChars() || WHITESPACE_CELL_CHAR
  }

  let fg = _workCell.getFgColor()
  let fgColorMode = _workCell.getFgColorMode()
  let bg = _workCell.getBgColor()
  let bgColorMode = _workCell.getBgColorMode()
  const isInverse = !!_workCell.isInverse()
  if (isInverse) {
    const temp = fg
    fg = bg
    bg = temp
    const temp2 = fgColorMode
    fgColorMode = bgColorMode
    bgColorMode = temp2
  }

  // Foreground
  switch (fgColorMode) {
    case Attributes.CM_P16:
    case Attributes.CM_P256:
      classList.push(`xterm-fg-${fg}`)
      break
    case Attributes.CM_RGB:
      style['color'] = `#${padStart(fg.toString(16), '0', 6)}`
      break
    case Attributes.CM_DEFAULT:
    default:
      if (isInverse) {
        classList.push(`xterm-fg-${INVERTED_DEFAULT_COLOR}`)
      }
  }

  // Background
  switch (bgColorMode) {
    case Attributes.CM_P16:
    case Attributes.CM_P256:
      classList.push(`xterm-bg-${bg}`)
      break
    case Attributes.CM_RGB:
      style['background-color'] = `#${padStart(bg.toString(16), '0', 6)}`
      break
    case Attributes.CM_DEFAULT:
    default:
      if (isInverse) {
        classList.push(`xterm-bg-${INVERTED_DEFAULT_COLOR}`)
      }
  }

  return {
    classList,
    textContent,
    style
  }
}
