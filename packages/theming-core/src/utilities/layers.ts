import { IThemeCore, ILayer, ILayers, ILayerContents } from '../interfaces/index';
import { getLayerBase, mergeLayersBase, mergeLayerBase, IThemeLayersConfig } from '@uifabric/foundation';

const layerConfig: IThemeLayersConfig = {
  baseKey: 'base',
  collections: {
    transient: true,
    state: true,
    part: true
  }
};

export function getLayer(theme: IThemeCore, name?: string): ILayer {
  name = name || layerConfig.baseKey;
  if (theme.cache[name]) {
    return theme.cache[name];
  }
  const layer = getLayerBase<ILayerContents>(theme.layers, layerConfig, name);
  theme.cache[name] = layer;
  return layer;
}

export function mergeLayers(partial: ILayers | undefined, parent: ILayers): ILayers {
  return mergeLayersBase<ILayerContents>(layerConfig.collections, parent, partial);
}

export function mergeLayerStack(...layers: ILayer[]): ILayer {
  if (layers.length > 0) {
    if (layers.length === 1) {
      return layers[0];
    } else {
      let mergedLayers = {};
      for (const layer of layers) {
        mergedLayers = mergeLayerBase<ILayerContents>(layerConfig.collections, mergedLayers, layer);
      }
      return mergedLayers;
    }
  }
  return {};
}