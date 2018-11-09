import { IPartialThemeCore, IThemeCore, ITypography, ILayer, IColorSlots, IPalette } from '../interfaces/index';
import { merge } from '@uifabric/utilities';
import { mergeLayers, stripNonStyleProps } from './layers';
import { resolveFontChoice } from './typography';

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
    layers: mergeLayers(definition.layers, parent.layers),
    cache: {}
  };
}

const bogusValue = 'black';
const slotsToResolve: IColorSlots = {
  backgroundColor: bogusValue,
  color: bogusValue,
  borderColor: bogusValue,
  iconColor: bogusValue
};

export function resolveColors(colors: IColorSlots, palette: IPalette): object {
  const result = {};
  for (const key in slotsToResolve) {
    if (colors[key]) {
      const val = palette[colors[key]];
      if (val) {
        result[key] = val;
      }
    }
  }
  return result;
}

export function resolveLayerToStyle(theme: IThemeCore, layer: ILayer, style?: object): object {
  const result = Object.assign({},
    layer,
    resolveFontChoice(layer, theme.typography),
    resolveColors(layer, theme.palette)
  );
  stripNonStyleProps(result);
  return result;
}
