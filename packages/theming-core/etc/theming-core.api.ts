// @public
export function adjustForContrast(baseline: IRGB, target: IRGB, desiredRatio?: number): IRGB;

// @public
export function calcContrastRatio(c1: IRGB, c2: IRGB): number;

// @public
export function contrastRatio(relLumA: number, relLumB: number): number;

// @public (undocumented)
export function createThemeCore(): IThemeCore;

// @public (undocumented)
export function createTypography(localeCode: string | null): ITypography;

// @public (undocumented)
export function cssColor(color: string): IRGB | undefined;

// @public (undocumented)
export function getColorFromRGBA(rgba: {
    r: number;
    g: number;
    b: number;
    a: number;
}): IColor;

// @public (undocumented)
export function getColorFromString(inputColor: string): IColor | undefined;

// @public (undocumented)
export function getLayer(theme: IThemeCore, name?: string): ILayer;

// @public (undocumented)
export function hsl2hsv(h: number, s: number, l: number): IHSV;

// @public
export function hsl2rgb(hsl: IHSL): IRGB;

// @public (undocumented)
export function hsv2hex(h: number, s: number, v: number): string;

// @public (undocumented)
export function hsv2hsl(h: number, s: number, v: number): {
    h: number;
    s: number;
    l: number;
};

// @public (undocumented)
export function hsv2rgb(h: number, s: number, v: number): IRGB;

// @public (undocumented)
interface IColor extends IRGB, IHSV {
  // (undocumented)
  hex: string;
  // (undocumented)
  str: string;
}

// WARNING: Because this definition is explicitly marked as @internal, an underscore prefix ("_") should be added to its name
// @internal
interface IColorSlots {
  // (undocumented)
  backgroundColor?: keyof IPalette | string;
  // (undocumented)
  borderColor?: keyof IPalette | string;
  // (undocumented)
  color?: keyof IPalette | string;
  // (undocumented)
  iconColor?: keyof IPalette;
  // (undocumented)
  textColor?: keyof IPalette | string;
}

// WARNING: Because this definition is explicitly marked as @internal, an underscore prefix ("_") should be added to its name
// @internal
interface IFontChoice extends Partial<IFontVariant> {
  // (undocumented)
  fontVariant?: keyof IFontVariants;
}

// WARNING: Because this definition is explicitly marked as @internal, an underscore prefix ("_") should be added to its name
// @internal
interface IFontFamilies {
  // (undocumented)
  heading: string;
  // (undocumented)
  monospace: string;
  // (undocumented)
  semilight: string;
  // (undocumented)
  standard: string;
}

// WARNING: Because this definition is explicitly marked as @internal, an underscore prefix ("_") should be added to its name
// @internal
interface IFontSizes {
  // (undocumented)
  large: string;
  // (undocumented)
  medium: string;
  // (undocumented)
  mediumPlus: string;
  // (undocumented)
  mega: string;
  // (undocumented)
  mini: string;
  // (undocumented)
  small: string;
  // (undocumented)
  smallPlus: string;
  // (undocumented)
  superLarge: string;
  // (undocumented)
  xLarge: string;
  // (undocumented)
  xSmall: string;
  // (undocumented)
  xxLarge: string;
}

// WARNING: Because this definition is explicitly marked as @internal, an underscore prefix ("_") should be added to its name
// @internal
interface IFontVariant {
  // (undocumented)
  fontFamily: keyof IFontFamilies | string;
  // (undocumented)
  fontSize: keyof IFontSizes | number | string;
  // (undocumented)
  fontWeight: keyof IFontWeights | IFontWeight;
}

// WARNING: Because this definition is explicitly marked as @internal, an underscore prefix ("_") should be added to its name
// @internal
interface IFontVariants {
  // (undocumented)
  caption: Partial<IFontVariant>;
  // (undocumented)
  large: Partial<IFontVariant>;
  // (undocumented)
  link: Partial<IFontVariant>;
  // (undocumented)
  mega: Partial<IFontVariant>;
  // (undocumented)
  small: Partial<IFontVariant>;
  // (undocumented)
  smallPlus: Partial<IFontVariant>;
  // (undocumented)
  standard: Partial<IFontVariant>;
  // (undocumented)
  standardPlus: Partial<IFontVariant>;
  // (undocumented)
  superLarge: Partial<IFontVariant>;
  // (undocumented)
  tiny: Partial<IFontVariant>;
  // (undocumented)
  xLarge: Partial<IFontVariant>;
  // (undocumented)
  xSmall: Partial<IFontVariant>;
  // (undocumented)
  xxLarge: Partial<IFontVariant>;
}

// WARNING: Because this definition is explicitly marked as @internal, an underscore prefix ("_") should be added to its name
// @internal
interface IFontWeights {
  // (undocumented)
  bold: IFontWeight;
  // (undocumented)
  light: IFontWeight;
  // (undocumented)
  medium: IFontWeight;
  // (undocumented)
  semibold: IFontWeight;
  // (undocumented)
  semilight: IFontWeight;
}

// @public (undocumented)
interface IHSL {
  // (undocumented)
  h: number;
  // (undocumented)
  l: number;
  // (undocumented)
  s: number;
}

// @public (undocumented)
interface IHSV {
  // (undocumented)
  h: number;
  // (undocumented)
  s: number;
  // (undocumented)
  v: number;
}

// @public
interface IOtherProps {
  // (undocumented)
  borderRadius?: number | string;
  // (undocumented)
  borderWidth?: number | string;
  // (undocumented)
  contentPadding?: number | string;
  // (undocumented)
  height?: number | string;
  // (undocumented)
  iconSize?: number | string;
  // (undocumented)
  iconWeight?: number;
  // (undocumented)
  lineHeight?: number | string;
  // (undocumented)
  minHeight?: number | string;
  // (undocumented)
  minWidth?: number | string;
  // (undocumented)
  width?: number | string;
}

// @public
interface IPalette {
  accent: string;
  black: string;
  blackTranslucent40: string;
  blue: string;
  blueDark: string;
  blueLight: string;
  blueMid: string;
  green: string;
  greenDark: string;
  greenLight: string;
  magenta: string;
  magentaDark: string;
  magentaLight: string;
  neutralDark: string;
  neutralLight: string;
  neutralLighter: string;
  neutralLighterAlt: string;
  neutralPrimary: string;
  neutralPrimaryAlt: string;
  neutralQuaternary: string;
  neutralQuaternaryAlt: string;
  neutralSecondary: string;
  neutralSecondaryAlt: string;
  neutralTertiary: string;
  neutralTertiaryAlt: string;
  orange: string;
  orangeLight: string;
  orangeLighter: string;
  purple: string;
  purpleDark: string;
  purpleLight: string;
  red: string;
  redDark: string;
  teal: string;
  tealDark: string;
  tealLight: string;
  themeDark: string;
  themeDarkAlt: string;
  themeDarker: string;
  themeLight: string;
  themeLighter: string;
  themeLighterAlt: string;
  themePrimary: string;
  themeSecondary: string;
  themeTertiary: string;
  white: string;
  whiteTranslucent40: string;
  yellow: string;
  yellowLight: string;
}

// @public (undocumented)
interface IRGB {
  // (undocumented)
  a?: number;
  // (undocumented)
  b: number;
  // (undocumented)
  g: number;
  // (undocumented)
  r: number;
}

// @public (undocumented)
interface ISpace {
  // (undocumented)
  margin?: number;
  // (undocumented)
  padding?: number;
}

// @public (undocumented)
interface IThemeCore {
  // (undocumented)
  cache: IThemeLayersBase<ILayerContents>;
  // (undocumented)
  layers: ILayers;
  // (undocumented)
  palette: IPalette;
  // (undocumented)
  typography: ITypography;
}

// WARNING: Because this definition is explicitly marked as @internal, an underscore prefix ("_") should be added to its name
// @internal
interface ITypography {
  // (undocumented)
  families: IFontFamilies;
  // (undocumented)
  sizes: IFontSizes;
  // (undocumented)
  variants: IFontVariants;
  // (undocumented)
  weights: IFontWeights;
}

// WARNING: Export "ChineseSimplified" must specify a type
// WARNING: Export "ChineseTraditional" must specify a type
// WARNING: Export "Hindi" must specify a type
// WARNING: Export "Japanese" must specify a type
// WARNING: Export "Korean" must specify a type
// WARNING: Export "Thai" must specify a type
// @public (undocumented)
module LocalizedFontFamilies {
  // (undocumented)
  Arabic: string;

  // (undocumented)
  Cyrillic: string;

  // (undocumented)
  EastEuropean: string;

  // (undocumented)
  Greek: string;

  // (undocumented)
  Hebrew: string;

  // (undocumented)
  Selawik: string;

  // (undocumented)
  Vietnamese: string;

  // (undocumented)
  WestEuropean: string;

}

// WARNING: Export "Arabic" must specify a type
// WARNING: Export "Cyrillic" must specify a type
// WARNING: Export "EastEuropean" must specify a type
// WARNING: Export "Greek" must specify a type
// WARNING: Export "Hebrew" must specify a type
// WARNING: Export "Thai" must specify a type
// WARNING: Export "Vietnamese" must specify a type
// WARNING: Export "WestEuropean" must specify a type
// WARNING: Export "Selawik" must specify a type
// @public (undocumented)
module LocalizedFontNames {
}

// @public (undocumented)
export function mergeLayers(partial: ILayers | undefined, parent: ILayers): ILayers;

// @public (undocumented)
export function mergeLayerStack(...layers: ILayer[]): ILayer;

// @public
export function relativeLuminance(r: number, g: number, b: number): number;

// @public (undocumented)
export function resolveColors(colors: IColorSlots, palette: IPalette): object;

// @public
export function resolveFontChoice(fontChoice: IFontChoice, typography: ITypography, onlySpecified?: boolean): IRawStyle;

// @public (undocumented)
export function resolveLayersToComponentStyle(theme: IThemeCore, states: string[] | undefined, ...layers: ILayer[]): object;

// @public (undocumented)
export function resolveLayersToStyle(theme: IThemeCore, states: string[] | undefined, ...layers: ILayer[]): object;

// @public (undocumented)
export function resolveLayerToStyle(theme: IThemeCore, layer: ILayer, style?: object): object;

// @public (undocumented)
export function resolvePropsToStyle(theme: IThemeCore, style: object, props: ILayer): object;

// WARNING: Because this definition is explicitly marked as @internal, an underscore prefix ("_") should be added to its name
// @internal
export function resolveThemeCore(definition: IPartialThemeCore | undefined, parent: IThemeCore): IThemeCore;

// @public (undocumented)
export function rgb2hex(r: number, g: number, b: number): string;

// @public (undocumented)
export function rgb2hsl(rgb: IRGB): IHSL;

// @public (undocumented)
export function rgb2hsv(r: number, g: number, b: number): IHSV;

// @public (undocumented)
export function stripNonStyleProps(target: object): void;

// WARNING: Unsupported export: ILayerContentsFlatProps
// WARNING: Unsupported export: ILayerContentsCore
// WARNING: Unsupported export: ILayerContentsCoreWithParent
// WARNING: Unsupported export: ILayerContents
// WARNING: Unsupported export: ILayer
// WARNING: Unsupported export: ILayers
// WARNING: Unsupported export: IPartialThemeCore
// WARNING: Unsupported export: IFontWeight
// WARNING: Unsupported export: IPartialTypography
// WARNING: Unsupported export: MAX_COLOR_SATURATION
// WARNING: Unsupported export: MAX_COLOR_HUE
// WARNING: Unsupported export: MAX_COLOR_VALUE
// WARNING: Unsupported export: MAX_COLOR_RGBA
// WARNING: Unsupported export: COLOR_VALUES
// WARNING: Unsupported export: DefaultTypography
// WARNING: Unsupported export: DefaultPalette
// WARNING: Unsupported export: DefaultColorSlots
// WARNING: Unsupported export: DefaultFontSizes
// WARNING: Unsupported export: DefaultFontWeights
// WARNING: Unsupported export: DefaultFontVariants
// (No @packagedocumentation comment for this package)
