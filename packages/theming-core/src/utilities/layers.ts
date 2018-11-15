import { IThemeCore, ILayer, ILayers } from '../interfaces/index';
import { getLayerBase, mergeLayerCollectionBase, mergeLayerBase, IThemeLayersConfig, addMixinToLayerBase } from '@uifabric/foundation';
import { resolveLayerToStyle } from './resolvers';

const layerConfig: IThemeLayersConfig = {
  collections: {
    selectors: true,
    state: true,
    part: true
  },
  overrides: 'state'
};

const nonStyleProps = {
  ...layerConfig.collections,
  parent: true
};

export function stripNonStyleProps(target: object): void {
  for (const key in nonStyleProps) {
    if (nonStyleProps[key] && target[key]) {
      delete target[key];
    }
  }
}

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

export function mergeLayers(partial: ILayers | undefined, parent: ILayers): ILayers {
  return mergeLayerCollectionBase<ILayer>(layerConfig.collections, parent, partial);
}

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
  if (layer.part && childStates) {
    const stateArray = childStates.split(' ');
    const parts = { ...layer.part };
    for (const key in parts) {
      if (parts[key]) {
        parts[key] = _mixinStates(theme, parts[key], stateArray);
      }
    }
    layer.part = parts;
  }
  return layer;
}

/**
 * This will take a layer, which optionally may have parts, and return a set of styles grouped in parts
 * @param theme - current theme, used to resolve values in the layer
 * @param layer - finalized layer, should have all parent resolution and state promotion already done
 */
export function resolveLayerToComponentStyle(theme: IThemeCore, layer: ILayer): object {
  const rootStyle = resolveLayerToStyle(theme, layer);
  const result = { root: rootStyle };
  if (layer.part) {
    const parts = layer.part;
    for (const part in parts) {
      if (parts[part]) {
        result[part] = resolveLayerToStyle(theme, parts[part], rootStyle);
      }
    }
  }
  return result;
}
