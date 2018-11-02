import { IThemeCore, ILayer, ILayers } from '../interfaces/index';
import { getLayerBase, mergeLayersBase, mergeLayerBase, IThemeLayersConfig, getMergedNonBaseLayer } from '@uifabric/foundation';
import { resolveLayerToStyle } from './resolvers';

const layerConfig: IThemeLayersConfig = {
  baseKey: 'base',
  collections: {
    transient: true,
    state: true,
    part: true
  }
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

export function getLayer(theme: IThemeCore, name?: string): ILayer {
  name = name || layerConfig.baseKey;
  if (theme.cache[name]) {
    return theme.cache[name];
  }
  const layer = getLayerBase<ILayer>(theme.layers, layerConfig, name);
  theme.cache[name] = layer;
  return layer;
}

export function mergeLayers(partial: ILayers | undefined, parent: ILayers): ILayers {
  return mergeLayersBase<ILayer>(layerConfig.collections, parent, partial);
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

function _promoteStates(theme: IThemeCore, layer: ILayer, states: string[]): ILayer {
  if (typeof states === 'string') {
    states = [states];
  }
  let newLayer = layer;
  if (layer.state) {
    for (const state of states) {
      if (layer.state[state]) {
        const stateLayer = getMergedNonBaseLayer<ILayer>(theme.layers, layerConfig, layer.state[state]);
        newLayer = mergeLayerBase<ILayer>(layerConfig.collections, newLayer, stateLayer);
      }
    }
  }
  return newLayer;
}

export function resolveLayersToStyle(theme: IThemeCore, states: string[] | undefined, ...layers: ILayer[]): object {
  // compress the incoming layers
  let layer = mergeLayerStack(...layers);

  // promote any states specified
  if (states) {
    layer = _promoteStates(theme, layer, states);
  }

  // now do the flattening
  return resolveLayerToStyle(theme, layer);
}