import { IFontFamilies } from '@uifabric/theming-core';
import { ITypography, IFontChoice } from '../interfaces/ITypography';
import { DefaultFontSizes, DefaultFontWeights, DefaultFontVariants } from '../defaults/index';
import { getLanguage } from '@uifabric/utilities';
import { IRawStyle } from '@uifabric/merge-styles';

// Fallback fonts, if specified system or web fonts are unavailable.
const FontFamilyFallbacks = `'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto', 'Helvetica Neue', sans-serif`;

// Font face names to be registered.
export namespace LocalizedFontNames {
  export const Arabic = 'Segoe UI Web (Arabic)';
  export const Cyrillic = 'Segoe UI Web (Cyrillic)';
  export const EastEuropean = 'Segoe UI Web (East European)';
  export const Greek = 'Segoe UI Web (Greek)';
  export const Hebrew = 'Segoe UI Web (Hebrew)';
  export const Thai = 'Leelawadee UI Web';
  export const Vietnamese = 'Segoe UI Web (Vietnamese)';
  export const WestEuropean = 'Segoe UI Web (West European)';
  export const Selawik = 'Selawik Web';
}

// Font families with fallbacks, for the general regions.
export namespace LocalizedFontFamilies {
  export const Arabic = `'${LocalizedFontNames.Arabic}'`;
  export const ChineseSimplified = `'Microsoft Yahei UI', Verdana, Simsun`;
  export const ChineseTraditional = `'Microsoft Jhenghei UI', Pmingliu`;
  export const Cyrillic = `'${LocalizedFontNames.Cyrillic}'`;
  export const EastEuropean = `'${LocalizedFontNames.EastEuropean}'`;
  export const Greek = `'${LocalizedFontNames.Greek}'`;
  export const Hebrew = `'${LocalizedFontNames.Hebrew}'`;
  export const Hindi = `'Nirmala UI'`;
  export const Japanese = `'Yu Gothic UI', 'Meiryo UI', Meiryo, 'MS Pgothic', Osaka`;
  export const Korean = `'Malgun Gothic', Gulim`;
  export const Selawik = `'${LocalizedFontNames.Selawik}'`;
  export const Thai = `'Leelawadee UI Web', 'Kmer UI'`;
  export const Vietnamese = `'${LocalizedFontNames.Vietnamese}'`;
  export const WestEuropean = `'${LocalizedFontNames.WestEuropean}'`;
}

// By default, we favor system fonts for the default.
// All localized fonts use a web font and never use the system font.
const defaultFontFamily = `'Segoe UI', '${LocalizedFontNames.WestEuropean}'`;

// Mapping of language prefix to to font family.
const LanguageToFontMap = {
  ar: LocalizedFontFamilies.Arabic,
  bg: LocalizedFontFamilies.Cyrillic,
  cs: LocalizedFontFamilies.EastEuropean,
  el: LocalizedFontFamilies.Greek,
  et: LocalizedFontFamilies.EastEuropean,
  he: LocalizedFontFamilies.Hebrew,
  hi: LocalizedFontFamilies.Hindi,
  hr: LocalizedFontFamilies.EastEuropean,
  hu: LocalizedFontFamilies.EastEuropean,
  ja: LocalizedFontFamilies.Japanese,
  kk: LocalizedFontFamilies.EastEuropean,
  ko: LocalizedFontFamilies.Korean,
  lt: LocalizedFontFamilies.EastEuropean,
  lv: LocalizedFontFamilies.EastEuropean,
  pl: LocalizedFontFamilies.EastEuropean,
  ru: LocalizedFontFamilies.Cyrillic,
  sk: LocalizedFontFamilies.EastEuropean,
  'sr-latn': LocalizedFontFamilies.EastEuropean,
  th: LocalizedFontFamilies.Thai,
  tr: LocalizedFontFamilies.EastEuropean,
  uk: LocalizedFontFamilies.Cyrillic,
  vi: LocalizedFontFamilies.Vietnamese,
  'zh-hans': LocalizedFontFamilies.ChineseSimplified,
  'zh-hant': LocalizedFontFamilies.ChineseTraditional
};

function _getFontFamilies(localeCode: string | null): IFontFamilies {
  const localizedFont = _getLocalizedFontFamily(localeCode);
  const fontFamilyWithFallback = _fontFamilyWithFallbacks(localizedFont);
  let semilightFontFamilyWithFallback = fontFamilyWithFallback;

  // Chrome has a bug where it does not render Segoe UI Semilight correctly, so we force the webfont to be used in that case
  if (localizedFont === defaultFontFamily) {
    semilightFontFamilyWithFallback = _fontFamilyWithFallbacks(LocalizedFontFamilies.WestEuropean);
  }

  return {
    standard: fontFamilyWithFallback,
    heading: fontFamilyWithFallback,
    semilight: semilightFontFamilyWithFallback,
    monospace: 'Menlo, Monaco, "Courier New", monospace'
  };
}

function _fontFamilyWithFallbacks(fontFamily: string): string {
  return `${fontFamily}, ${FontFamilyFallbacks}`;
}

/**
 * If there is a localized font for this language, return that. Returns undefined if there is no localized font for that language.
 */
function _getLocalizedFontFamily(language: string | null): string {
  for (const lang in LanguageToFontMap) {
    if (LanguageToFontMap.hasOwnProperty(lang) && language && lang.indexOf(language) === 0) {
      // tslint:disable-next-line:no-any
      return (LanguageToFontMap as any)[lang];
    }
  }

  return defaultFontFamily;
}

export function createTypography(localeCode: string | null): ITypography {
  return {
    families: _getFontFamilies(localeCode),
    sizes: DefaultFontSizes,
    weights: DefaultFontWeights,
    variants: DefaultFontVariants
  };
}

export const DefaultTypography: ITypography = createTypography(getLanguage());

function _sanitizeObject(src: object): object {
  const result = {};
  for (const key in src) {
    if (src.hasOwnProperty(key) && src[key] !== undefined && src[key] !== null) {
      result[key] = src[key];
    }
  }
  return result;
}

/**
 * This can be used in two ways.  The default behavior is onlySpecified being falsy.  In this mode
 * a full font definition will be provided falling back to the standard font variant, patched with
 * any overriden font variants, then patched with specified properties such as family.
 *
 * If onlySpecified is true this will exclude the font smoothing settings and only provide result
 * values for things that are set in the fontChoice.  This is designed to produce the minimum set
 * of properties to apply on top of a base definition.
 *
 * @param font - specified font settings, variant, family, etc
 * @param typography - current typography settings for the current theme/scheme
 * @param onlySpecified - if specified and true, this will not assume a baseline font variant and will
 * only return values for things specified in the font choice.  If font is empty, it will return an
 * empty IRawStyle
 */
export function resolveFontChoice(fontChoice: IFontChoice, typography: ITypography, onlySpecified?: boolean): IRawStyle {
  const input: IFontChoice = _sanitizeObject(fontChoice);
  const variants = typography.variants;
  const variant = input.fontVariant;
  const font = Object.assign({}, (variant || !onlySpecified) && variants.standard, variant && variants[variant], input);
  return {
    ...(!onlySpecified && { MozOsxFontSmoothing: 'grayscale', WebkitFontSmoothing: 'antialiased' }),
    ...(font.fontFamily && { fontFamily: typography.families[font.fontFamily] || font.fontFamily }),
    ...(font.fontSize && { fontSize: typography.sizes[font.fontSize] || font.fontSize }),
    ...(font.fontWeight && { fontWeight: typography.weights[font.fontWeight] || font.fontWeight })
  };
}
