import { ITypography, IFontSizes, IFontWeights, IFontVariants, IFontFamilies } from '../interfaces';

/**
 * fonts.ts in the styling package may have a nicer approach that uses locales to pull the correct font families
 * font utilities may end up being worthwhile
 *
 * TODO: find better defaults
 */
export const DefaultFontFamilies: IFontFamilies = {
  standard: 'segoe ui',
  heading: 'segoe ui',
  semilight: 'segoe ui',
  monospace: 'Menlo, Monaco, "Courier New", monospace'
};

// Standard font sizes.
export const DefaultFontSizes: IFontSizes = {
  mini: '10',
  xSmall: '11',
  small: '12',
  smallPlus: '13',
  medium: '14',
  mediumPlus: '15',
  large: '17',
  xLarge: '21',
  xxLarge: '28',
  superLarge: '42',
  mega: '72'
};

export const DefaultFontWeights: IFontWeights = {
  light: '100',
  semilight: '300',
  medium: '400',
  semibold: '600',
  bold: '700'
};

export const DefaultFontVariants: IFontVariants = {
  // size based variants
  tiny: {
    fontSize: 'mini',
    fontWeight: 'semibold'
  },
  xSmall: {
    fontSize: 'xSmall'
  },
  small: {
    fontSize: 'small'
  },
  smallPlus: {
    fontSize: 'smallPlus'
  },
  standard: {
    fontFamily: 'standard',
    fontSize: 'medium',
    fontWeight: 'medium'
  },
  standardPlus: {
    fontSize: 'mediumPlus'
  },
  large: {
    fontFamily: 'semilight',
    fontSize: 'large',
    fontWeight: 'semilight'
  },
  xLarge: {
    fontSize: 'xLarge',
    fontWeight: 'light'
  },
  xxLarge: {
    fontSize: 'xxLarge',
    fontWeight: 'light'
  },
  superLarge: {
    fontSize: 'superLarge',
    fontWeight: 'light'
  },
  mega: {
    fontSize: 'mega',
    fontWeight: 'light'
  },

  // role based variants
  caption: {
    fontSize: 'xSmall'
  },
  link: {}
};

export const DefaultTypography: ITypography = {
  families: DefaultFontFamilies,
  sizes: DefaultFontSizes,
  weights: DefaultFontWeights,
  variants: DefaultFontVariants
};
