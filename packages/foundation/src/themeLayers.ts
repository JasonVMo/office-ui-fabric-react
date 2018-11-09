export interface ILayerContentCollections {
  [subcollection: string]: boolean;
}

export interface IThemeLayersConfig {
  baseKey?: string;
  collections: ILayerContentCollections;
}

export type IThemeLayerBase<IContents> = IContents & {
  parent?: string | string[];
};

export interface IThemeLayersBase<IContents> {
  [layer: string]: IThemeLayerBase<IContents>;
}

function _mergeCollection<IContent>(collections: ILayerContentCollections, c1: object, c2: object): object {
  // start with an assign which will generate a superset
  const result = Object.assign({}, c1, c2);
  // now merge results for ones where both exist in the original
  for (const key in result) {
    if (result.hasOwnProperty(key) && c1.hasOwnProperty(key) && c2.hasOwnProperty(key)) {
      result[key] = mergeLayerBase<IContent>(collections, c1[key], c2[key]);
    }
  }
  return result;
}

export function mergeLayerBase<IContent>(
  collections: ILayerContentCollections,
  l1: IThemeLayerBase<IContent>,
  l2: IThemeLayerBase<IContent>
): IThemeLayerBase<IContent> {
  if (l1 && l2) {
    const result = Object.assign({}, l1, l2);
    for (const key in collections) {
      if (collections[key] && l1[key] && l2[key]) {
        result[key] = _mergeCollection<IContent>(collections, l1[key], l2[key]);
      }
    }
    return result;
  }
  return l1 || l2 || {} as IThemeLayerBase<IContent>;
}

/**
 * This will take two layer collections and merge them together.  It is designed to be used in theme
 * resolvers with the theme registry.
 * @param collections - a set of keys that should be treated as subcollections in a given layer
 * @param l1 - base layer collection to be merged, this will be applied first
 * @param l2 - next layer collection to be merged, this is applied on top of l1
 */
export function mergeLayersBase<IContent>(
  collections: ILayerContentCollections,
  l1: IThemeLayersBase<IContent> | undefined,
  l2: IThemeLayersBase<IContent> | undefined
): IThemeLayersBase<IContent> {
  if (l1 && l2) {
    return _mergeCollection<IContent>(collections, l1, l2) as IThemeLayersBase<IContent>;
  }
  return Object.assign({}, l1, l2);
}

export function getMergedNonBaseLayer<IContent>(
  layers: IThemeLayersBase<IContent>,
  config: IThemeLayersConfig,
  layer: IThemeLayerBase<IContent>
): IThemeLayerBase<IContent> {
  if (!layer.parent) {
    return layer;
  }
  const { baseKey, collections } = config;
  const parents: string[] = (typeof layer.parent === 'string') ? [layer.parent] : layer.parent;
  let result = {};
  for (const parent of parents) {
    if (parent !== baseKey) {
      const parentLayer = _getNonBaseLayer(layers, config, parent);
      result = mergeLayerBase<IContent>(collections, result as IThemeLayerBase<IContent>, parentLayer);
    }
  }
  result = mergeLayerBase<IContent>(collections, result as IThemeLayerBase<IContent>, layer);
  return result as IThemeLayerBase<IContent>;
}

function _getNonBaseLayer<IContent>(
  layers: IThemeLayersBase<IContent>,
  config: IThemeLayersConfig,
  name: string
): IThemeLayerBase<IContent> {
  const layer = layers[name];
  if (!layer) {
    return {} as IThemeLayerBase<IContent>;
  }
  return getMergedNonBaseLayer<IContent>(layers, config, layer);
}

/**
 * Get a layer, including resolving the chain of dependencies for that layer
 *
 * @param layers - the set of theme layer definitions, will not be modified
 * @param config - configuration object denoting structure of the layers
 * @param name - name of the layer to query
 * @param skipBase - if there is a base layer this allows it to be skipped, otherwise ignored
 */
export function getLayerBase<IContent>(
  layers: IThemeLayersBase<IContent>,
  config: IThemeLayersConfig,
  name: string,
  skipBase?: boolean
): IThemeLayerBase<IContent> | undefined {
  if (layers[name]) {
    const layer = _getNonBaseLayer(layers, config, name);
    if (config.baseKey && !skipBase) {
      const baseLayer = layers[config.baseKey];
      return mergeLayerBase<IContent>(config.collections, baseLayer, layer);
    }
    return layer;
  }
}