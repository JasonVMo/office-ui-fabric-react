import { IFontWeight } from 'office-ui-fabric-react';

export interface IControlStyle<IFullStyle, IStateStyle> {
  parent?: string | string[];
  root?: IFullStyle;
  hovered?: Partial<IStateStyle>;
  pressed?: Partial<IStateStyle>;
  disabled?: Partial<IStateStyle>;
}

export interface IButtonStyleStateSettings {
  backgroundColor?: string;
  color?: string;
  borderColor?: string;
  iconColor?: string;
  textWeight?: IFontWeight;
  iconWeight?: number;
}

export interface IButtonStyleSettings extends IButtonStyleStateSettings {
  borderRadius?: number | string;
  borderWidth?: number | string;
  contentPadding?: number | string;
  textFamily?: string;
  textSize?: number | string;
  width?: number | string;
  height?: number | string;
  iconSize?: number | string;
  lineHeight?: number | string;
  minWidth?: number | string;
  minHeight?: number | string;
}

export type IButtonStyle = IControlStyle<IButtonStyleSettings, IButtonStyleStateSettings>;

export interface IStyleCollection {
  base: IButtonStyle;
  [key: string]: IButtonStyle;
}

function resolveStyleParents(dest: IStyleCollection, source: IStyleCollection, key: string): IButtonStyle {
  if (!dest[key] && source[key]) {
    const ancestors: IButtonStyle = Object.assign({}, source.base);
    let parents = source[key].parent;
    if (parents) {
      if (typeof parents === 'string') {
        parents = [parents];
      }
      for (const parent of parents) {
        mergeStyleDefs(ancestors, resolveStyleParents(dest, source, parent));
      }
    }
    dest[key] = mergeStyleDefs({}, ancestors, source[key]);
  }
  return dest[key];
}

export function createStyleCollection(target: IStyleCollection, base?: IStyleCollection): IStyleCollection {
  const source = base ? mergeStyleCollection(base, target) : Object.assign({}, target);
  const dest: IStyleCollection = { base: source.base };
  for (const key in source) {
    if (source.hasOwnProperty(key) && !dest[key]) {
      resolveStyleParents(dest, source, key);
    }
  }
  return dest;
}

/**
 * Merge 2+ style objects together
 * @param styles variable length array where the first object in the list will have the following
 * object merged into it.  This follows the pattern of Object.assign, returning a reference to
 * the modified first argument
 */
// tslint:disable:no-any
function mergeStyleDefsCore(...styles: any[]): any {
  // tslint:disable:no-any
  let result: any;
  if (styles && styles.length > 0 && typeof styles[0] === 'object') {
    for (const style of styles) {
      if (!result) {
        result = style;
      } else {
        for (const key in style) {
          if (style.hasOwnProperty(key) && style[key]) {
            if (typeof style[key] === 'object') {
              result[key] = Object.assign({}, result[key], style[key]);
            } else {
              result[key] = style[key];
            }
          }
        }
      }
    }
  }
  return result;
}

export function mergeStyleDefs(...styles: IButtonStyle[]): IButtonStyle {
  const result = mergeStyleDefsCore(styles);
  return result;
}

export function mergeStyleCollection(a: IStyleCollection, b: IStyleCollection): IStyleCollection {
  const result = Object.assign({}, a);
  for (const key in b) {
    if (b.hasOwnProperty(key)) {
      result[key] = mergeStyleDefs({}, result[key], b[key]);
    }
  }
  return result;
}
