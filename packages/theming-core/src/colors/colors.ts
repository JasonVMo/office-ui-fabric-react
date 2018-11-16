import { COLOR_VALUES } from './colorValues';

export const MAX_COLOR_SATURATION = 100;
export const MAX_COLOR_HUE = 359;
export const MAX_COLOR_VALUE = 100;
export const MAX_COLOR_RGBA = 255;

export interface IRGB {
  r: number;
  g: number;
  b: number;
  a?: number;
}

export interface IHSV {
  h: number;
  s: number;
  v: number;
}

export interface IHSL {
  h: number;
  s: number;
  l: number;
}

export interface IColor extends IRGB, IHSV {
  hex: string;
  str: string;
}

export function cssColor(color: string): IRGB | undefined {
  return _named(color) || _hex3(color) || _hex6(color) || _rgb(color) || _rgba(color) || _hsl(color) || (_hsla(color) as IRGB);
}

export function rgb2hex(r: number, g: number, b: number): string {
  return [_numberToPaddedHex(r), _numberToPaddedHex(g), _numberToPaddedHex(b)].join('');
}

export function hsv2hex(h: number, s: number, v: number): string {
  const { r, g, b } = hsv2rgb(h, s, v);

  return rgb2hex(r, g, b);
}

export function rgb2hsv(r: number, g: number, b: number): IHSV {
  let h = NaN;
  let s;
  let v;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  // hue
  if (delta === 0) {
    h = 0;
  } else if (r === max) {
    h = ((g - b) / delta) % 6;
  } else if (g === max) {
    h = (b - r) / delta + 2;
  } else if (b === max) {
    h = (r - g) / delta + 4;
  }

  h = Math.round(h * 60);

  if (h < 0) {
    h += 360;
  }

  // saturation
  s = Math.round((max === 0 ? 0 : delta / max) * 100);

  // value
  v = Math.round((max / 255) * 100);

  return { h, s, v };
}

export function rgb2hsl(rgb: IRGB): IHSL {
  const hsv = rgb2hsv(rgb.r, rgb.b, rgb.g);
  const hsl = hsv2hsl(hsv.h, hsv.s, hsv.v);
  hsl.s = hsl.s / 100;
  hsl.l = hsl.l / 100;
  return hsl;
  /*
  The following code has a bug where if b > g but red is dominant the hue goes negative
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  // Calculate hue
  let h: number = 0;
  if (delta === 0) {
    h = 0;
  } else if (r === max) {
    h = ((g - b) / delta) % 6;
  } else if (g === max) {
    h = (b - r) / delta + 2;
  } else if (b === max) {
    h = (r - g) / delta + 4;
  }
  h *= 60;

  // Calculate lightness
  const l: number = (max + min) / 2;

  // Calculate saturation
  let s: number = 0;
  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1));
  }

  return { h: h, s: s, l: l };
  */
}

export function hsl2hsv(h: number, s: number, l: number): IHSV {
  s *= (l < 50 ? l : 100 - l) / 100;

  return {
    h: h,
    s: ((2 * s) / (l + s)) * 100,
    v: l + s
  };
}

export function hsv2hsl(h: number, s: number, v: number): { h: number; s: number; l: number } {
  s /= MAX_COLOR_SATURATION;
  v /= MAX_COLOR_VALUE;

  let l = (2 - s) * v;
  let sl = s * v;
  sl /= l <= 1 ? l : 2 - l;
  sl = sl || 0;
  l /= 2;

  return { h: h, s: sl * 100, l: l * 100 };
}

/**
 * Given an IHSl will generate an IColor with filled in r g and b
 *
 * @param hsl - hsl an IHSL
 */
export function hsl2rgb(hsl: IHSL): IRGB {
  const c: number = (1 - Math.abs(2 * hsl.l - 1)) * hsl.s;
  const x: number = c * (1 - Math.abs(((hsl.h / 60) % 2) - 1));
  const m: number = hsl.l - c / 2;

  let r1,
    g1,
    b1: number = 0;

  // different values of h
  if (hsl.h < 60) {
    r1 = c;
    g1 = x;
    b1 = 0;
  } else if (hsl.h < 120) {
    r1 = x;
    g1 = c;
    b1 = 0;
  } else if (hsl.h < 180) {
    r1 = 0;
    g1 = c;
    b1 = x;
  } else if (hsl.h < 240) {
    r1 = 0;
    g1 = x;
    b1 = c;
  } else if (hsl.h < 300) {
    r1 = x;
    g1 = 0;
    b1 = c;
  } else {
    r1 = c;
    g1 = 0;
    b1 = x;
  }

  return {
    r: Math.round(255 * (r1 + m)),
    g: Math.round(255 * (g1 + m)),
    b: Math.round(255 * (b1 + m))
  };
}

export function hsv2rgb(h: number, s: number, v: number): IRGB {
  s = s / 100;
  v = v / 100;

  let rgb: number[] = [];

  const c = v * s;
  const hh = h / 60;
  const x = c * (1 - Math.abs((hh % 2) - 1));
  const m = v - c;

  switch (Math.floor(hh)) {
    case 0:
      rgb = [c, x, 0];
      break;

    case 1:
      rgb = [x, c, 0];
      break;

    case 2:
      rgb = [0, c, x];
      break;

    case 3:
      rgb = [0, x, c];
      break;

    case 4:
      rgb = [x, 0, c];
      break;

    case 5:
      rgb = [c, 0, x];
      break;
  }

  return {
    r: Math.round(MAX_COLOR_RGBA * (rgb[0] + m)),
    g: Math.round(MAX_COLOR_RGBA * (rgb[1] + m)),
    b: Math.round(MAX_COLOR_RGBA * (rgb[2] + m))
  };
}

export function getColorFromString(inputColor: string): IColor | undefined {
  const color = cssColor(inputColor);

  if (!color) {
    return;
  }

  const { a, b, g, r } = color;
  const { h, s, v } = rgb2hsv(r, g, b);

  return {
    a: a,
    b: b,
    g: g,
    h: h,
    hex: rgb2hex(r, g, b),
    r: r,
    s: s,
    str: inputColor,
    v: v
  };
}

export function rgbToString(r: number, g: number, b: number, a: number = 100): string {
  if (a !== 100) {
    return `rgba(${r}, ${g}, ${b}, ${a / 100})`;
  }
  return `#${rgb2hex(r, g, b)}`;
}

export function getColorFromRGBA(rgba: { r: number; g: number; b: number; a: number }): IColor {
  const { a, b, g, r } = rgba;
  const { h, s, v } = rgb2hsv(r, g, b);

  const hex = rgb2hex(r, g, b);
  return {
    a: a,
    b: b,
    g: g,
    h: h,
    hex: hex,
    r: r,
    s: s,
    str: a === 100 ? `#${hex}` : `rgba(${r}, ${g}, ${b}, ${a / 100})`,
    v: v
  };
}

function _numberToPaddedHex(num: number): string {
  const hex = num.toString(16);

  return hex.length === 1 ? '0' + hex : hex;
}

function _named(str: string): IRGB | undefined {
  // TODO: fix type and remove tslint rule?
  const c = (COLOR_VALUES as any)[str.toLowerCase()];

  if (c) {
    return {
      r: c[0],
      g: c[1],
      b: c[2],
      a: 100
    };
  }
}

function _rgb(str: string): IRGB | undefined {
  if (0 === str.indexOf('rgb(')) {
    str = str.match(/rgb\(([^)]+)\)/)![1];

    const parts = str.split(/ *, */).map(Number);

    return {
      r: parts[0],
      g: parts[1],
      b: parts[2],
      a: 100
    };
  }
}

function _rgba(str: string): IRGB | undefined {
  if (str.indexOf('rgba(') === 0) {
    str = str.match(/rgba\(([^)]+)\)/)![1];

    const parts = str.split(/ *, */).map(Number);

    return {
      r: parts[0],
      g: parts[1],
      b: parts[2],
      a: parts[3] * 100
    };
  }
}

function _hex6(str: string): IRGB | undefined {
  if ('#' === str[0] && 7 === str.length) {
    return {
      r: parseInt(str.slice(1, 3), 16),
      g: parseInt(str.slice(3, 5), 16),
      b: parseInt(str.slice(5, 7), 16),
      a: 100
    };
  }
}

function _hex3(str: string): IRGB | undefined {
  if ('#' === str[0] && 4 === str.length) {
    return {
      r: parseInt(str[1] + str[1], 16),
      g: parseInt(str[2] + str[2], 16),
      b: parseInt(str[3] + str[3], 16),
      a: 100
    };
  }
}

function _hsl(str: string): IRGB | undefined {
  if (str.indexOf('hsl(') === 0) {
    str = str.match(/hsl\(([^)]+)\)/)![1];
    const parts = str.split(/ *, */);

    const h = parseInt(parts[0], 10);
    const s = parseInt(parts[1], 10);
    const l = parseInt(parts[2], 10);

    const rgba = hsl2rgb({ h: h, s: s, l: l });
    rgba.a = 100;

    return rgba;
  }
}

function _hsla(str: string): IRGB | undefined {
  if (str.indexOf('hsla(') === 0) {
    str = str.match(/hsla\(([^)]+)\)/)![1];

    const parts = str.split(/ *, */);
    const h = parseInt(parts[0], 10);
    const s = parseInt(parts[1], 10);
    const l = parseInt(parts[2], 10);
    const a = parseInt(parts[3], 10) * 100;
    const rgba = hsl2rgb({ h: h, s: s, l: l });

    rgba.a = a;

    return rgba;
  }
}
