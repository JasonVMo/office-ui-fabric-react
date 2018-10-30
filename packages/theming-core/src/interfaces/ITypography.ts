export type IFontWeight = '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | 'normal' | 'bold';

/**
 * @internal This is an experimental interface and will be changed post design review.
 */
export interface IFontFamilies {
  standard: string;
  heading: string;
  semilight: string;
  monospace: string;
}

/**
 * @internal This is an experimental interface and will be changed post design review.
 */
export interface IFontSizes {
  mini: string;
  xSmall: string;
  small: string;
  smallPlus: string;
  medium: string;
  mediumPlus: string;
  large: string;
  xLarge: string;
  xxLarge: string;
  superLarge: string;
  mega: string;
}

/**
 * @internal This is an experimental interface and will be changed post design review.
 */
export interface IFontWeights {
  light: IFontWeight;
  semilight: IFontWeight;
  medium: IFontWeight;
  semibold: IFontWeight;
  bold: IFontWeight;
}

/**
 * @internal This is an experimental interface and will be changed post design review.
 */
export interface IFontVariant {
  fontFamily: keyof IFontFamilies | string;
  fontSize: keyof IFontSizes | number | string;
  fontWeight: keyof IFontWeights | number;
}

/**
 * @internal This is an experimental interface and will be changed post design review.
 */
export interface IFontChoice extends Partial<IFontVariant> {
  fontVariant?: keyof IFontVariants;
}

/**
 * @internal This is an experimental interface and will be changed post design review.
 */
export interface IFontVariants {
  // size based variants
  tiny: Partial<IFontVariant>;
  xSmall: Partial<IFontVariant>;
  small: Partial<IFontVariant>;
  smallPlus: Partial<IFontVariant>;
  standard: Partial<IFontVariant>;
  standardPlus: Partial<IFontVariant>;
  large: Partial<IFontVariant>;
  xLarge: Partial<IFontVariant>;
  xxLarge: Partial<IFontVariant>;
  superLarge: Partial<IFontVariant>;
  mega: Partial<IFontVariant>;

  // role based variants
  caption: Partial<IFontVariant>;
  link: Partial<IFontVariant>;
}

/**
 * @internal This is an experimental interface and will be changed post design review.
 */
export interface ITypography {
  families: IFontFamilies;
  sizes: IFontSizes;
  weights: IFontWeights;
  variants: IFontVariants;
}

/**
 * Used in IPartialTheme so that user-defined themes can override selected typography properties
 */
export type IPartialTypography = { [P in keyof ITypography]?: Partial<ITypography[P]> };
