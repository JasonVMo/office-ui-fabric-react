import { IPartialThemeCore, IThemeCore, ITypography, IColorSlots, IPalette } from '../interfaces/index';
import { merge } from './merge';
import { mergeLayerCollections } from './layers';
import { getContrastingColor } from '../colors/index';

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
    layers: mergeLayerCollections(definition.layers, parent.layers),
    cache: {}
  };
}

const bogusValue = 'black';
const slotsToResolve: IColorSlots = {
  backgroundColor: bogusValue,
  color: bogusValue,
  textColor: bogusValue,
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

/**
 * Take a style object and if it has a textColor set it into color with potential color adjustments
 * along the way
 *
 * @param style - style where if a textColor is set, the color should be set to either the specified
 * color if it meets contrast requirements, or a shaded version of the color which does contrast
 * @param backgroundColor - the background color to use for contrast adjustment purposes
 */
export function resolveTextColor(style: { color?: string; textColor?: string }, backgroundColor: string): void {
  if (style.textColor) {
    style.color = getContrastingColor(style.textColor, backgroundColor);
  }
}
