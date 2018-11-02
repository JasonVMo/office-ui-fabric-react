import { IThemeCore, ILayers } from '../interfaces/index';
import { createTypography } from '../utilities/index';
import { DefaultPalette } from './DefaultColors';
import { getLanguage } from '@uifabric/utilities';

const emptyLayers: ILayers = { base: {} };

export function createThemeCore(): IThemeCore {
  return {
    palette: DefaultPalette,
    typography: createTypography(getLanguage()),
    layers: emptyLayers,
    cache: {}
  };
}
