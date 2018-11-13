import { IThemeCore, ILayer } from '../interfaces/index';
import { resolveLayerToStyle } from './resolvers';
import { getFinalizedLayer, resolveLayerToComponentStyle } from './layers';
import { getLayer } from './layers';

const stateOrder: string[] = ['expanded', 'selected', 'shaded', 'primary', 'disabled'];

/**
 * Take an object, likely with some boolean flags for states to enable, and turn it into a state
 * string in a standard order
 *
 * @param mask some kind of object where any values with keys matching the states in ILayerStates
 * where the values are truthy will cause that state to be added
 *
 * @internal This is an experimental interface and will be changed post design review.
 */
export function getStatesForLayer(mask: object): string | undefined {
  let states: string | undefined;
  for (const stateKey of stateOrder) {
    if (typeof stateKey === 'string' && mask[stateKey]) {
      states = states ? states + ' ' + stateKey : stateKey;
    }
  }
  return states;
}

/**
 * Used to pass additional parts to query for selectors.  If the partName is found in the layer and
 * there is a selector specified, the provided string will be used as the class name.  If the
 * value was { icon: 'ms-Icon' }, the produced selector might be ':hover .ms-Icon': { }
 */

export interface IObjectWithStyleProps {
  backgroundColor?: string;
  selectors?: { [key: string]: IObjectWithStyleProps };
}

export interface IResolveSelectorsProps {
  style: IObjectWithStyleProps;
  parts?: {
    [partName: string]: string;
  };
}

function _addSelectors(
  theme: IThemeCore,
  result: object,
  selectors: ILayer['selectors'],
  bgColor: string | undefined,
  className?: string
): void {
  if (selectors) {
    for (const key in selectors) {
      if (selectors.hasOwnProperty(key)) {
        let backgroundColor = bgColor;
        if (className && result[key] && result[key].backgroundColor) {
          backgroundColor = result[key].backgroundColor;
        }
        const keyName = className ? key + ' .' + className : key;
        result[keyName] = resolveLayerToStyle(theme, selectors[key], { backgroundColor });
      }
    }
  }
}

export function resolveSelectorsForLayer(theme: IThemeCore, layer: ILayer, props: IResolveSelectorsProps): object {
  const { style, parts } = props;
  const bgColorBase = style.backgroundColor;
  const result = {};
  if (layer.selectors) {
    _addSelectors(theme, result, layer.selectors, bgColorBase);
  }
  if (parts && layer.part) {
    for (const part in parts) {
      if (parts.hasOwnProperty(part)) {
        const targetPart = layer.part[part];
        if (targetPart && targetPart.selectors) {
          const className = parts[part];
          _addSelectors(theme, result, targetPart.selectors, bgColorBase, className);
        }
      }
    }
  }
  return result;
}

export interface IGetComponentStyleProps {
  layerName: string;
  constLayer?: ILayer;
  states?: string;
  partStates?: string;
  disabled?: boolean;
  selectors?: boolean;
  partClasses?: {
    [partName: string]: string;
  };
}

export function getComponentStyles(theme: IThemeCore, props: IGetComponentStyleProps): object {
  const { layerName, constLayer, states, partStates, disabled, selectors, partClasses } = props;
  const themeLayer = getLayer(theme, layerName);
  const layer = getFinalizedLayer(theme, states, partStates, constLayer || {}, themeLayer || {});
  const style = resolveLayerToComponentStyle(theme, layer);
  const rootStyleKey = 'root';
  const rootStyle = style[rootStyleKey];
  if (selectors && !disabled) {
    rootStyle.selectors = resolveSelectorsForLayer(theme, layer, { style: rootStyle, parts: partClasses });
  }
  return style;
}
