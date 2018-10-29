import { IPalette } from './IPalette';
import { ITypography, IPartialTypography } from './ITypography';

export interface IThemeCore {
  palette: IPalette;

  /**
   * @internal
   * The typography property is still in an experimental phase. The intent is to have it
   * eventually replace IFontStyles in a future release, but it is still undergoing review.
   * Avoid using it until it is finalized.
   */
  typography: ITypography;
}

export type IPartialThemeCore = { [P in keyof Pick<IThemeCore, 'palette'>]?: Partial<IThemeCore[P]> } &
  { [P in keyof Pick<IThemeCore, 'typography'>]?: IPartialTypography };
