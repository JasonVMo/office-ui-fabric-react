import { IRawStyle, IFontWeight } from '@uifabric/merge-styles';
import { ITypography } from '@uifabric/theming-core';
import { IFontStyles } from '../index';

// Standard font sizes.
export namespace FontSizes {
  export const mini: string = '10px';
  export const xSmall: string = '11px';
  export const small: string = '12px';
  export const smallPlus: string = '13px';
  export const medium: string = '14px';
  export const mediumPlus: string = '15px';
  export const icon: string = '16px';
  export const large: string = '17px';
  export const xLarge: string = '21px';
  export const xxLarge: string = '28px';
  export const superLarge: string = '42px';
  export const mega: string = '72px';
}

// Standard font weights.
export namespace FontWeights {
  export const light: IFontWeight = 100;
  export const semilight: IFontWeight = 300;
  export const regular: IFontWeight = 400;
  export const semibold: IFontWeight = 600;
  export const bold: IFontWeight = 700;
}

// Standard Icon Sizes.
export namespace IconFontSizes {
  export const xSmall: string = '10px';
  export const small: string = '12px';
  export const medium: string = '16px';
  export const large: string = '20px';
}

export function createFontStyles(typography: ITypography): IFontStyles {
  const families = typography.families;

  const fontStyles = {
    tiny: _createFont(FontSizes.mini, FontWeights.semibold, families.standard),
    xSmall: _createFont(FontSizes.xSmall, FontWeights.regular, families.standard),
    small: _createFont(FontSizes.small, FontWeights.regular, families.standard),
    smallPlus: _createFont(FontSizes.smallPlus, FontWeights.regular, families.standard),
    medium: _createFont(FontSizes.medium, FontWeights.regular, families.standard),
    mediumPlus: _createFont(FontSizes.mediumPlus, FontWeights.regular, families.standard),
    large: _createFont(FontSizes.large, FontWeights.semilight, families.semilight),
    xLarge: _createFont(FontSizes.xLarge, FontWeights.light, families.standard),
    xxLarge: _createFont(FontSizes.xxLarge, FontWeights.light, families.standard),
    superLarge: _createFont(FontSizes.superLarge, FontWeights.light, families.standard),
    mega: _createFont(FontSizes.mega, FontWeights.light, families.standard)
  };

  return fontStyles;
}

function _createFont(size: string, weight: IFontWeight, fontFamily: string): IRawStyle {
  return {
    fontFamily: fontFamily,
    MozOsxFontSmoothing: 'grayscale',
    WebkitFontSmoothing: 'antialiased',
    fontSize: size,
    fontWeight: weight
  };
}
