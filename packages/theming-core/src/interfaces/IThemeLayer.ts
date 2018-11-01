export type IThemeLayerBaseStates<IContents> = IContents & {
  state?: {
    pressed?: IContents;
    hovered?: IContents;
    disabled?: IContents;
  };
};

export type IThemeLayerBase<IContents> = IThemeLayerBaseStates<IContents> & {
  parent?: string | string[];
  part?: {
    [key: string]: IThemeLayerBaseStates<IContents>;
  }
};

export interface IThemeLayersBase<IContents> {
  [layer: string]: IThemeLayerBase<IContents>;
}
