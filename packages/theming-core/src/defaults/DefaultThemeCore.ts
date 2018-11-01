import { IThemeCore, ILayers } from '../interfaces/index';
import { DefaultTypography, createTypography } from '../utilities/index';
import { DefaultPalette } from './DefaultColors';
import { getLanguage } from '@uifabric/utilities';

const emptyLayers: ILayers = {};

export const DefaultThemeCore: IThemeCore = {
  palette: DefaultPalette,
  typography: DefaultTypography,
  layers: emptyLayers
};

export function createThemeCore(): IThemeCore {
  return {
    palette: DefaultPalette,
    typography: createTypography(getLanguage()),
    layers: emptyLayers
  };
}
