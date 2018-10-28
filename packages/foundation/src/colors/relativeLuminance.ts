/**
 * Calculate the relative luminance which is how bright the color is from the perspective of
 * a human eye.  Blue is much darker than green for instance so (0, 0, 255) is perceived to be
 * significantly darker than (0, 255, 0).  This is used to calculate contrast ratios between
 * two colors to ensure text is readable.
 * @param r - red value 0 to 255
 * @param g - green value 0 to 255
 * @param b - blue value 0 to 255
 */
export function relativeLuminance(r: number, g: number, b: number): number {
  // Formula defined by: http://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-contrast.html#contrast-ratiodef
  // relative luminance: http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef

  /* calculate the intermediate value needed to calculating relative luminance */
  function _getThing(x: number): number {
    if (x <= 0.03928) {
      return x / 12.92;
    } else {
      return Math.pow((x + 0.055) / 1.055, 2.4);
    }
  }

  // get the effective radius for each color
  const r1 = _getThing(r / 255);
  const g1 = _getThing(g / 255);
  const b1 = _getThing(b / 255);

  // relative luminance adjusts the R/G/B values by modifiers for their perceived brightness
  // to produce lightness result for how the eye perceives the color
  return 0.2126 * r1 + 0.7152 * g1 + 0.0722 * b1;
}
