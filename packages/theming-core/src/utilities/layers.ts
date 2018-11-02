import { IThemeCore, ILayer, ILayers, ILayerContents } from '../interfaces/index';
import { getLayerBase, mergeLayersBase } from '@uifabric/foundation';

const baseKey = 'base';

export function getLayer(theme: IThemeCore, name?: string): ILayer {
  name = name || baseKey;
  if (theme.cache[name]) {
    return theme.cache[name];
  }
  const layer = getLayerBase<ILayerContents>(theme.layers, baseKey, name);
  theme.cache[name] = layer;
  return layer;
}

export function mergeLayers(partial: ILayers | undefined, parent: ILayers): ILayers {
  return mergeLayersBase<ILayerContents>(parent, partial);
}