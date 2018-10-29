export interface IThemeEntry<ITheme, IPartialTheme> {
  parent?: string;
  definition?: IPartialTheme;
  resolved?: ITheme;
}

export interface IThemeGraphCore<ITheme, IPartialTheme> {
  _platform: IThemeEntry<ITheme, IPartialTheme>;
  default: IThemeEntry<ITheme, IPartialTheme>;
}

const _platformKey: keyof IThemeGraphCore<object, object> = '_platform';
const _defaultKey: keyof IThemeGraphCore<object, object> = 'default';

export interface IThemeGraph<ITheme, IPartialTheme> extends IThemeGraphCore<ITheme, IPartialTheme> {
  [key: string]: IThemeEntry<ITheme, IPartialTheme>;
}

export type IRegisterTheme<IPartialTheme> = (definition: IPartialTheme, name?: string, parent?: string) => void;
export type IGetTheme<ITheme> = (name?: string) => ITheme;
export type IUpdatePlatformDefaults<ITheme> = (platformDefaults: ITheme) => void;
export type IThemeResolver<ITheme, IPartialTheme> = (definition: IPartialTheme | undefined, parentTheme: ITheme) => ITheme;

/**
 * The theme registry is an object which tracks themes and their dependencies and updates them as
 * dependencies get updated.  The public interface are set as functions to encapsulate the type
 * information a single time when it is created.
 */
export interface IThemeRegistry<ITheme, IPartialTheme> {
  /**
   * registerTheme will create or update a theme, associated with the given name,
   * optionally parented to parent.  If name is undefined this will update the default
   * theme definition.  The default theme is automatically parented to the platform
   * defaults.  If parent is omitted the theme will be parented to the default theme
   */
  registerTheme: IRegisterTheme<IPartialTheme>;

  /**
   * get a theme by name, this will force the theme to be created and resolved if it is
   * the first time it is being called or a dependency has been updated.  If name is
   * not specified the default theme will be returned
   */
  getTheme: IGetTheme<ITheme>;

  /**
   * update the platform defaults.  This is less likely to happen on web but on native
   * the system settings might change requiring all dependent themes to be updated.
   */
  updatePlatformDefaults: IUpdatePlatformDefaults<ITheme>;

  /**
   * The actual graph of named themes
   */
  graph: IThemeGraph<ITheme, IPartialTheme>;
}

/**
 * Creates a theme registry object which caches theme information and provides typed functions
 * for working with themes in the registry.
 * @param platformDefaults A fully defined theme with default values for the given platform
 * @param resolver A function which takes a partial theme, a fully defined parent theme, and
 * produces a fully resolved theme.
 */
export function createThemeRegistry<ITheme, IPartialTheme>(
  platformDefaults: ITheme,
  resolver: IThemeResolver<ITheme, IPartialTheme>
): IThemeRegistry<ITheme, IPartialTheme> {
  const graph: IThemeGraph<ITheme, IPartialTheme> = {
    _platform: { resolved: platformDefaults },
    default: { parent: _platformKey }
  };
  return {
    graph,
    registerTheme: (definition: IPartialTheme, name?: string, parent?: string): void => {
      _registerTheme<ITheme, IPartialTheme>(graph, definition, name, parent);
    },
    getTheme: (name?: string): ITheme => {
      return _getTheme<ITheme, IPartialTheme>(graph, resolver, name);
    },
    updatePlatformDefaults: (newDefaults: ITheme): void => {
      _updatePlatformDefaults<ITheme, IPartialTheme>(graph, newDefaults);
    }
  };
}

function _registerTheme<ITheme, IPartialTheme>(
  graph: IThemeGraph<ITheme, IPartialTheme>,
  definition: IPartialTheme,
  name?: string,
  parent?: string
): void {
  name = name || _defaultKey;
  parent = (name === _defaultKey && _platformKey) || parent || _defaultKey;
  if (_wouldCauseCycle(graph, name, parent)) {
    throw new Error('Attempt to register a dependent theme that would cause a cycle');
  } else if (!graph[parent]) {
    throw new Error('Attempting to parent to an unknown theme');
  } else if (name === _platformKey) {
    throw new Error('A platform theme cannot be registered, call updatePlatformDefaults instead');
  }
  if (!graph[name]) {
    graph[name] = {};
  }
  const entry = graph[name];
  entry.parent = parent;
  entry.definition = definition;
  entry.resolved = undefined;
  _clearDependentThemes(graph, name);
}

function _getTheme<ITheme, IPartialTheme>(
  graph: IThemeGraph<ITheme, IPartialTheme>,
  resolver: IThemeResolver<ITheme, IPartialTheme>,
  name?: string
): ITheme {
  name = name || _defaultKey;
  const entry = graph[name] || graph.default;
  if (!entry.resolved) {
    const parent = _getTheme(graph, resolver, entry.parent);
    entry.resolved = resolver(entry.definition, parent);
  }
  return entry.resolved;
}

function _updatePlatformDefaults<ITheme, IPartialTheme>(
  graph: IThemeGraph<ITheme, IPartialTheme>,
  platformDefaults: ITheme
): void {
  graph._platform.resolved = platformDefaults;
  _clearDependentThemes(graph, _platformKey);
}

function _wouldCauseCycle<ITheme, IPartialTheme>(
  graph: IThemeGraph<ITheme, IPartialTheme>,
  name: string,
  parent: string
): boolean {
  let par: string | undefined = parent;
  while (par) {
    // if we ever find a self-referencing parent there would be a cycle, this includes
    // parent === name on a single entry
    if (par === name) {
      return true;
    }
    const parentEntry: IThemeEntry<ITheme, IPartialTheme> | undefined = graph[par];
    par = (parentEntry && parentEntry.parent) || undefined;
  }
  return false;
}

function _clearDependentThemes<ITheme, IPartialTheme>(graph: IThemeGraph<ITheme, IPartialTheme>, parent: string): void {
  for (const key in graph) {
    if (graph.hasOwnProperty(key)) {
      const entry = graph[key];
      if (entry.parent === parent && entry.resolved) {
        entry.resolved = undefined;
        _clearDependentThemes(graph, key);
      }
    }
  }
}