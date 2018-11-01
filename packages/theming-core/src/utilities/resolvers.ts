import { IPartialThemeCore, IThemeCore, ITypography } from '../interfaces/index';
import { merge } from '@uifabric/utilities';

/**
 * @internal
 *
 * Take a partial theme definition and a parent definition and produce a new theme
 * @param definition - new theme definition, this contains a partial set of properties to map on top
 * of the parent values.
 * @param parent - theme to base the newly created theme off of
 */
export function resolveThemeCore(definition: IPartialThemeCore | undefined, parent: IThemeCore): IThemeCore {
  if (!definition) {
    definition = {};
  }

  return {
    palette: Object.assign({}, parent.palette, definition.palette),
    typography: merge<ITypography>({}, parent.typography, definition.typography as ITypography),
    layers: Object.assign({}, parent.layers, definition.layers) // TODO: use a proper resolver
  };
}
