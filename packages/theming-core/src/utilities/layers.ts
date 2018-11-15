import { IThemeCore, ILayer, ILayers } from '../interfaces/index';
import { getLayerBase, mergeLayerCollectionBase, mergeLayerBase, IThemeLayersConfig, addMixinToLayerBase } from '@uifabric/foundation';
import { resolveColors, resolveTextColor } from './resolvers';
import { resolveFontChoice } from './typography';

const layerConfig: IThemeLayersConfig = {
  collections: {
    selectors: true,
    overrides: true,
    slots: true
  },
  overrides: 'overrides'
};

const nonStyleProps = {
  ...layerConfig.collections,
  parent: true
};

function _stripNonStyleProps(target: object): void {
  for (const key in nonStyleProps) {
    if (nonStyleProps[key] && target[key]) {
      delete target[key];
    }
  }
}

function _resolveLayerToStyle(theme: IThemeCore, layer: ILayer, style?: { backgroundColor?: string }): object {
  const result = Object.assign({}, layer, resolveFontChoice(layer, theme.typography), resolveColors(layer, theme.palette));
  resolveTextColor(result, result.backgroundColor || (style && style.backgroundColor) || 'white');
  _stripNonStyleProps(result);
  return result;
}

/**
 * Get a layer from the theme by name, resolving the inheritance chain as appropriate
 * @param theme - theme to extract the layer from
 * @param name - name of the layer
 */
export function getLayer(theme: IThemeCore, name: string): ILayer | undefined {
  if (theme.cache[name]) {
    return theme.cache[name];
  }
  const layer = getLayerBase<ILayer>(theme.layers, layerConfig, name);
  if (layer) {
    theme.cache[name] = layer;
  }
  return layer;
}

/**
 * Merge two layer collections together
 * @param partial - a partial or potentially undefined collection of layers.  This will be added on top of the parent.
 * @param parent - a parent collection of layers, this will be used as the baseline
 */
export function mergeLayerCollections(partial: ILayers | undefined, parent: ILayers): ILayers {
  return mergeLayerCollectionBase<ILayer>(layerConfig.collections, parent, partial);
}

/**
 * Take a number of layers and merge them together from first to last
 * @param layers - one or more layers to merge together into a single layer
 */
export function mergeLayerStack(...layers: ILayer[]): ILayer {
  if (layers.length > 0) {
    if (layers.length === 1) {
      return layers[0];
    } else {
      let mergedLayers = {};
      for (const layer of layers) {
        mergedLayers = mergeLayerBase<ILayer>(layerConfig.collections, mergedLayers, layer);
      }
      return mergedLayers;
    }
  }
  return {};
}

function _mixinStates(theme: IThemeCore, layer: ILayer, states: string[]): ILayer {
  let newLayer = layer;
  for (const state of states) {
    newLayer = addMixinToLayerBase<ILayer>(theme.layers, layerConfig, newLayer, state);
  }
  return newLayer;
}

/**
 * This will merge layers together, then promote states to produce a single resolved layer that can be
 * used by a component.  Note that the result of this should be cached.
 *
 * @param theme - current theme, used to look up parent layers
 * @param states - an optional string containing space delimited states to be applied, in order
 * @param layers - one or more layers to merge together as part of the process
 */
export function getFinalizedLayer(
  theme: IThemeCore,
  states: string | undefined,
  childStates: string | undefined,
  ...layers: ILayer[]
): ILayer {
  let layer = mergeLayerStack(...layers);
  if (states) {
    const stateArray = states.split(' ');
    layer = _mixinStates(theme, layer, stateArray);
  }
  if (layer.slots && childStates) {
    const stateArray = childStates.split(' ');
    const parts = { ...layer.slots };
    for (const key in parts) {
      if (parts[key]) {
        parts[key] = _mixinStates(theme, parts[key], stateArray);
      }
    }
    layer.slots = parts;
  }
  return layer;
}

/**
 * This will take a layer, which optionally may have parts, and return a set of styles grouped in parts
 * @param theme - current theme, used to resolve values in the layer
 * @param layer - finalized layer, should have all parent resolution and state promotion already done
 * @param slots - list of slots to add to the component style.  Existence in the list, even as an undefined string,
 * will cause the slot to be emitted
 */
export function resolveLayerToComponentStyle(theme: IThemeCore, layer: ILayer, slots?: IGetComponentStyleProps['slots']): object {
  const rootStyle = _resolveLayerToStyle(theme, layer);
  const result = { root: rootStyle };
  if (slots && layer.slots) {
    const layerSlots = layer.slots;
    for (const slot in slots) {
      if (slots.hasOwnProperty(slot) && layerSlots[slot]) {
        result[slot] = _resolveLayerToStyle(theme, layerSlots[slot], rootStyle);
      }
    }
  }
  return result;
}

/**
 * This is the order in which state mixins should be applied
 */
const stateOrder: string[] = ['expanded', 'selected', 'shaded', 'primary', 'disabled'];

/**
 * Take an object, likely with some boolean flags for states to enable, and turn it into a state
 * string in a standard order
 *
 * @param mask - some kind of object where any values with keys matching the states in ILayerStates
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
 * value was \{ icon: 'ms-Icon' \}, the produced selector might be ':hover .ms-Icon': \{ \}
 */

export interface IObjectWithStyleProps {
  backgroundColor?: string;
  selectors?: { [key: string]: IObjectWithStyleProps };
}

export interface IResolveSelectorsProps {
  style: IObjectWithStyleProps;
  slots?: {
    [slotName: string]: string | undefined;
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
        result[keyName] = _resolveLayerToStyle(theme, selectors[key], { backgroundColor });
      }
    }
  }
}

export function resolveSelectorsForLayer(theme: IThemeCore, layer: ILayer, props: IResolveSelectorsProps): object {
  const { style, slots } = props;
  const bgColorBase = style.backgroundColor;
  const result = {};
  if (layer.selectors) {
    _addSelectors(theme, result, layer.selectors, bgColorBase);
  }
  if (slots && layer.slots) {
    for (const part in slots) {
      if (slots.hasOwnProperty(part)) {
        const targetPart = layer.slots[part];
        if (targetPart && targetPart.selectors) {
          const className = slots[part];
          _addSelectors(theme, result, targetPart.selectors, bgColorBase, className);
        }
      }
    }
  }
  return result;
}

export interface IGetComponentStyleProps {
  /**
   * Name of the layer to query from the theme
   */
  layerName: string;

  /**
   * A constant layer to use as a baseline
   */
  constLayer?: ILayer;

  /**
   * A set of states or overrides to apply to the layer.  Typically these are things like disabled or primary
   * though any layer name is valid.  Stored in a space delimited string
   */
  states?: string;

  /**
   * States or overrides to apply to slots for the layer.  This can be the same list as for the base layer.
   */
  slotStates?: string;

  /**
   * Is this layer in a disabled state.
   */
  disabled?: boolean;

  /**
   * Should selectors be applied to the resulting style, ignored if disabled is set
   */
  selectors?: boolean;

  /**
   * A list of slots to include in the resulting style.  The key values are the actual slot names, if a
   * string is set it should be the class name for that slot
   */
  slots?: {
    [slot: string]: string | undefined;
  };
}

export function getComponentStyles(theme: IThemeCore, props: IGetComponentStyleProps): object {
  const { layerName, constLayer, states, slotStates, disabled, selectors, slots } = props;
  const themeLayer = getLayer(theme, layerName);
  const layer = getFinalizedLayer(theme, states, slotStates, constLayer || {}, themeLayer || {});
  const style = resolveLayerToComponentStyle(theme, layer, slots);
  const rootStyleKey = 'root';
  const rootStyle = style[rootStyleKey];
  if (selectors && !disabled) {
    rootStyle.selectors = resolveSelectorsForLayer(theme, layer, { style: rootStyle, slots: slots });
  }
  return style;
}
