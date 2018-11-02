import { IPalette } from './IPalette';
import { ITypography, IPartialTypography } from './ITypography';
import { ILayers, ILayerContents } from './ILayers';
import { IThemeLayersBase } from '@uifabric/foundation';

export interface IThemeCore {
  palette: IPalette;
  typography: ITypography;
  layers: ILayers;
  cache: IThemeLayersBase<ILayerContents>;
}

// We can switch back to this, although with the contents of IThemeCore being so little, the new definition
// makes it more clear what an IPartialThemeCore is allowed to be.
// export type IPartialThemeCore = { [P in keyof Pick<IThemeCore, 'palette'>]?: Partial<IThemeCore[P]> } &
//   { [P in keyof Pick<IThemeCore, 'typography'>]?: IPartialTypography };

export type IPartialThemeCore = {
  palette?: Partial<IPalette>;
  typography?: IPartialTypography;
  layers?: ILayers;
};
