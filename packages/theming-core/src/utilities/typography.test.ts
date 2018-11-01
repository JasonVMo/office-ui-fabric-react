import { createTypography, resolveFontChoice } from './typography';

describe('typography resolution', () => {
  const typography = createTypography('en');

  it('font resolution with size override', () => {
    const baseStyle = resolveFontChoice({}, typography);
    const sizeOverriden = resolveFontChoice({ fontSize: 'mega' }, typography);
    expect(sizeOverriden.fontFamily).toEqual(baseStyle.fontFamily);
    expect(sizeOverriden.fontWeight).toEqual(baseStyle.fontWeight);
    expect(sizeOverriden.fontSize).toEqual(typography.sizes.mega);
  });

  it('font variant with override', () => {
    const baseStyle = resolveFontChoice({ fontVariant: 'small' }, typography);
    const sizeOverriden = resolveFontChoice({ fontVariant: 'small', fontSize: 'xLarge' }, typography);
    expect(sizeOverriden.fontFamily).toEqual(baseStyle.fontFamily);
    expect(sizeOverriden.fontWeight).toEqual(baseStyle.fontWeight);
    expect(sizeOverriden.fontSize).toEqual(typography.sizes.xLarge);
  });

  it('font size minimal settings', () => {
    const justSize = resolveFontChoice({ fontSize: 'xxLarge' }, typography, true);
    expect(justSize.fontSize).toEqual(typography.sizes.xxLarge);
    expect(justSize.fontWeight).toBeUndefined();
    expect(justSize.fontFamily).toBeUndefined();
    expect(justSize.WebkitFontSmoothing).toBeUndefined();
    expect(justSize.MozOsxFontSmoothing).toBeUndefined();
  });

  it('font size minimal variant', () => {
    const baseStyle = resolveFontChoice({ fontVariant: 'tiny' }, typography);
    const minimalStyle = resolveFontChoice({ fontVariant: 'tiny' }, typography, true);
    expect(minimalStyle.fontSize).toEqual(baseStyle.fontSize);
    expect(minimalStyle.fontWeight).toEqual(baseStyle.fontWeight);
    expect(minimalStyle.fontFamily).toEqual(baseStyle.fontFamily);
    expect(minimalStyle.WebkitFontSmoothing).toBeUndefined();
    expect(minimalStyle.MozOsxFontSmoothing).toBeUndefined();
  });
});