import { assign } from '@uifabric/utilities';
import { hsv2rgb, rgb2hex, IColor, hsv2hex, MAX_COLOR_SATURATION, MAX_COLOR_VALUE } from '@uifabric/theming-core';

export {
  MAX_COLOR_SATURATION,
  MAX_COLOR_HUE,
  MAX_COLOR_VALUE,
  MAX_COLOR_RGBA,
  IRGB,
  IHSV,
  IHSL,
  IColor,
  cssColor,
  rgb2hex,
  hsv2hex,
  rgb2hsv,
  hsl2hsv,
  hsv2hsl,
  hsl2rgb,
  hsv2rgb,
  getColorFromString,
  getColorFromRGBA
} from '@uifabric/theming-core';

export function updateSV(color: IColor, s: number, v: number): IColor {
  const { r, g, b } = hsv2rgb(color.h, s, v);
  const hex = rgb2hex(r, g, b);

  return {
    a: color.a,
    b: b,
    g: g,
    h: color.h,
    hex: hex,
    r: r,
    s: s,
    str: color.a === 100 ? `#${hex}` : `rgba(${r}, ${g}, ${b}, ${(color.a as number) / 100})`,
    v: v
  };
}

export function updateH(color: IColor, h: number): IColor {
  const { r, g, b } = hsv2rgb(h, color.s, color.v);
  const hex = rgb2hex(r, g, b);

  return {
    a: color.a,
    b: b,
    g: g,
    h: h,
    hex: hex,
    r: r,
    s: color.s,
    str: color.a === 100 ? `#${hex}` : `rgba(${r}, ${g}, ${b}, ${(color.a as number) / 100})`,
    v: color.v
  };
}

export function updateA(color: IColor, a: number): IColor {
  return assign({}, color, {
    a: a,
    str: a === 100 ? `#${color.hex}` : `rgba(${color.r}, ${color.g}, ${color.b}, ${a / 100})`
  });
}

export function getFullColorString(color: IColor): string {
  return `#${hsv2hex(color.h, MAX_COLOR_SATURATION, MAX_COLOR_VALUE)}`;
}
