import { IThemeLayer, IThemeLayerBase, IThemeLayers } from '../interfaces/IThemeLayer';

function _mergeCollection<IContent>(c1: object, c2: object): object {
  // start with an assign which will generate a superset
  const result = Object.assign({}, c1, c2);
  // now merge results for ones where both exist in the original
  for (const key in result) {
    if (result.hasOwnProperty(key) && c1.hasOwnProperty(key) && c2.hasOwnProperty(key)) {
      result[key] = _mergeLayer<IContent>(c1[key], c2[key]);
    }
  }
  return result;
}

function _mergeLayer<IContent>(l1: IThemeLayer<IContent>, l2: IThemeLayer<IContent>): IThemeLayer<IContent> {
  const result = Object.assign({}, l1, l2);
  if (l1.state && l2.state) {
    result.state = _mergeCollection<IContent>(l1.state, l2.state);
  }
  if (l1.part && l2.part) {
    result.part = _mergeCollection<IContent>(l1.part, l2.part) as { [key: string]: IThemeLayerBase<IContent> };
  }
  return result;
}

/**
 * This will take two layer collections and merge them together.  It is designed to be used in theme
 * resolvers with the theme registry.
 * @param l1 - base layer collection to be merged, this will be applied first
 * @param l2 - next layer collection to be merged, this is applied on top of l1
 */
export function mergeLayers<IContent>(
  l1: IThemeLayers<IContent> | undefined,
  l2: IThemeLayers<IContent> | undefined
): IThemeLayers<IContent> {
  if (l1 && l2) {
    return _mergeCollection<IContent>(l1, l2) as IThemeLayers<IContent>;
  }
  return Object.assign({}, l1, l2);
}

function _getNonBaseLayer<IContent>(
  layers: IThemeLayers<IContent>,
  baseName: string,
  name: string
): IThemeLayer<IContent> {
  const layer = layers[name];
  if (!layer) {
    return {} as IThemeLayer<IContent>;
  }
  if (!layer.parent) {
    return layer;
  }
  const parents: string[] = (typeof layer.parent === 'string') ? [layer.parent] : layer.parent;
  let result = {};
  for (const parent of parents) {
    if (parent !== baseName) {
      const parentLayer = _getNonBaseLayer(layers, baseName, parent);
      result = _mergeLayer<IContent>(result as IThemeLayer<IContent>, parentLayer);
    }
  }
  result = _mergeLayer<IContent>(result as IThemeLayer<IContent>, layer);
  return result as IThemeLayer<IContent>;
}

/**
 *
 * @param layers - the set of theme layer definitions, will not be modified
 * @param cache - a cache of layers with parent values already applied.  May be modified by this routine
 * @param baseName - the layer at the root of the parent child chain.  Also the layer to parent layers to by default
 * @param name - name of the layer to query, if undefined or not found will default to base.
 */
export function getLayer<IContent>(
  layers: IThemeLayers<IContent>,
  baseName: string,
  name?: string
): IThemeLayer<IContent> {
  name = name || baseName;
  const baseLayer: IThemeLayer<IContent> = layers[baseName];
  if (name === baseName || !layers[name]) {
    return baseLayer;
  }
  const layer = _getNonBaseLayer(layers, baseName, name);
  return _mergeLayer<IContent>(baseLayer, layer);
}