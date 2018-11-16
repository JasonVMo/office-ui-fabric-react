export interface IThemeLayersConfig {
  /**
   * Set this to have the layer set have an implicit parent layer if no direct parent is
   * specified.  This would often be a key called default or base.
   */
  baseKey?: string;

  /**
   * Use this child layer collection as a set of overrides.  When a layer is looked up, if the
   * current layer has a child layer that matches that will also be applied on top.
   */
  overrides?: string;

  /**
   * A list of children of a given layer to be treated as subcollections.  While the contents of a layer
   * are normally assigned, the sub-collections will be recursively merged.
   */
  collections: { [subCollection: string]: boolean };
}

export type IThemeLayerBase<IContents> = IContents & {
  parent?: string | string[];
};

export interface IThemeLayersBase<IContents> {
  [layer: string]: IThemeLayerBase<IContents>;
}

function _mergeCollection<IContent>(collections: IThemeLayersConfig['collections'], c1: object, c2: object): object {
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
  collections: IThemeLayersConfig['collections'],
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
  return l1 || l2 || ({} as IThemeLayerBase<IContent>);
}

/**
 * This will take two layer collections and merge them together.  It is designed to be used in theme
 * resolvers with the theme registry.
 * @param collections - a set of keys that should be treated as subcollections in a given layer
 * @param l1 - base layer collection to be merged, this will be applied first
 * @param l2 - next layer collection to be merged, this is applied on top of l1
 */
export function mergeLayerCollectionBase<IContent>(
  collections: IThemeLayersConfig['collections'],
  l1: IThemeLayersBase<IContent> | undefined,
  l2: IThemeLayersBase<IContent> | undefined
): IThemeLayersBase<IContent> {
  if (l1 && l2) {
    return _mergeCollection<IContent>(collections, l1, l2) as IThemeLayersBase<IContent>;
  }
  return Object.assign({}, l1, l2);
}

function _mixinOverride<IContent>(
  layers: IThemeLayersBase<IContent>,
  config: IThemeLayersConfig,
  layer: IThemeLayerBase<IContent>,
  mixin: string
): IThemeLayerBase<IContent> {
  if (config.overrides && layer[config.overrides]) {
    const override = (layer[config.overrides] as IThemeLayerBase<IContent>)[mixin];
    if (override) {
      const resolvedMixin = getLayerBase<IContent>(layers, config, override);
      if (resolvedMixin) {
        return mergeLayerBase<IContent>(config.collections, layer, resolvedMixin);
      }
    }
  }
  return layer;
}

export function addMixinToLayerBase<IContent>(
  layers: IThemeLayersBase<IContent>,
  config: IThemeLayersConfig,
  layer: IThemeLayerBase<IContent>,
  mixin: string,
  excludeBase?: boolean,
): IThemeLayerBase<IContent> {
  let result = layer;

  if (!excludeBase) {
    // look up the mixin by name from the base layer collection
    const mixinFromBase = getLayerBase<IContent>(layers, config, mixin);
    if (mixinFromBase) {
      result = mergeLayerBase<IContent>(config.collections, result, mixinFromBase);
    }
  }

  // if we are using overrides then try to look it up from the override collection as well
  if (config.overrides) {
    result = _mixinOverride<IContent>(layers, config, result, mixin);
  }
  return result;
}

function _parentsToArray(parents?: string | string[]): string[] {
  if (parents) {
    return (typeof parents === 'string' && [parents]) || (parents as string[]);
  }
  return [];
}

function _getLayerWorker<IContent>(
  layers: IThemeLayersBase<IContent>,
  config: IThemeLayersConfig,
  layer: string | IThemeLayerBase<IContent>,
  baseKey?: string
): IThemeLayerBase<IContent> | undefined {
  // attempt to resolve a string based specifier into a layer
  if (typeof layer === 'string') {
    layer = layers[layer as string];
  }
  // if we failed to look up a layer, or it has no parent we're done
  if (!layer || (!layer.parent && !baseKey)) {
    return layer;
  }

  // start with either a base layer or an empty object
  let result = baseKey ? Object.assign({}, layers[baseKey]) : {};
  const { collections } = config;

  // resolve parent chains
  const parents = _parentsToArray(layer.parent);

  for (const parent of parents) {
    const parentLayer = _getLayerWorker<IContent>(layers, config, parent);
    if (parentLayer) {
      result = mergeLayerBase<IContent>(collections, result as IThemeLayerBase<IContent>, parentLayer);
    }
  }

  // merge in the current layer
  result = mergeLayerBase<IContent>(collections, result as IThemeLayerBase<IContent>, layer);

  // apply overrides for parents if there is an override collection
  if (config.overrides && result[config.overrides]) {
    for (const parent of parents) {
      result = _mixinOverride(layers, config, result as IThemeLayerBase<IContent>, parent);
    }
  }

  // resolve child entries that have parent dependencies
  if (collections) {
    for (const subCollection in collections) {
      if (collections.hasOwnProperty(subCollection) && result[subCollection]) {
        const childLayers = { ...result[subCollection] } as IThemeLayersBase<IContent>;
        result[subCollection] = childLayers;
        for (const child in childLayers) {
          if (childLayers[child] && childLayers[child].parent) {
            childLayers[child] = _getLayerWorker(layers, config, childLayers[child]) as IThemeLayerBase<IContent>;
          }
        }
      }
    }
  }

  return result as IThemeLayerBase<IContent>;
}

/**
 * Get a layer, including resolving the chain of dependencies for that layer
 *
 * @param layers - the set of theme layer definitions, will not be modified
 * @param config - configuration object denoting structure of the layers
 * @param layer - name of the layer to query or an existing layer to start with
 */
export function getLayerBase<IContent>(
  layers: IThemeLayersBase<IContent>,
  config: IThemeLayersConfig,
  layer: string | IThemeLayerBase<IContent>
): IThemeLayerBase<IContent> | undefined {
  return _getLayerWorker(layers, config, layer, config.baseKey);
}
