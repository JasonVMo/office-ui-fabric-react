import { IThemeCore } from '../interfaces/index';
import { createTypography } from '../utilities/index';
import { DefaultPalette } from './DefaultColors';
import { DefaultLayers } from './DefaultLayers';

export function createThemeCore(): IThemeCore {
  return {
    palette: DefaultPalette,
    typography: createTypography(null),
    layers: DefaultLayers,
    cache: {}
  };
}
