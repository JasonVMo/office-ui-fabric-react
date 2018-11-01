import { IThemeCore } from '../interfaces/index';
import { DefaultTypography, createTypography } from '../utilities/index';
import { DefaultPalette } from './DefaultColors';
import { getLanguage } from '@uifabric/utilities';

export const DefaultThemeCore: IThemeCore = {
  palette: DefaultPalette,
  typography: DefaultTypography
};

export function createThemeCore(): IThemeCore {
  return {
    palette: DefaultPalette,
    typography: createTypography(getLanguage())
  };
}