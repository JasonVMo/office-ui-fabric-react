export type IThemeLayerBase<IContents> = IContents & {
  state?: {
    pressed?: IContents;
    hovered?: IContents;
    disabled?: IContents;
  };
};

export type IThemeLayer<IContents> = IThemeLayerBase<IContents> & {
  parent?: string | string[];
  part?: {
    [key: string]: IThemeLayerBase<IContents>;
  }
};

export interface IThemeLayers<IContents> {
  [layer: string]: IThemeLayer<IContents>;
}
