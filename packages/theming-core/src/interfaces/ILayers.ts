import { IColorSlots } from './IColorSlots';
import { IFontChoice } from './ITypography';
import { ISpace, IOtherProps } from './ISpace';
import { IThemeLayerBase, IThemeLayersBase } from '@uifabric/foundation';

/**
 * The flat set of properties that can be defined for a layer
 *
 * @internal This is experimental and will be changed post design review
 */
export type ILayerContentsFlatProps = IColorSlots & IFontChoice & ISpace & IOtherProps;

/**
 * The bits of a layer that include setting transient state
 *
 * @internal This is an experimental interface and will be changed post design review.
 */
export type ILayerContentsCore = IColorSlots & IFontChoice & ISpace & IOtherProps & {
  transient?: {
    hovered?: ILayerContentsFlatProps;
    pressed?: ILayerContentsFlatProps;
    iconHovered?: ILayerContentsFlatProps;
    iconPressed?: ILayerContentsFlatProps;
  };
};

/**
 * An interface for states and parts can add parent references
 *
 * @internal This is an experimental interface and will be changed post design review.
 */
export type ILayerContentsCoreWithParent = ILayerContentsCore & {
  parent?: string | string[] | undefined;
};

/**
 * The layer contents used by the themeLayers code in foundation
 *
 * @internal This is an experimental interface and will be changed post design review.
 */
export type ILayerContents = ILayerContentsCore & {
  state?: {
    interactive?: ILayerContentsCoreWithParent;
    primary?: ILayerContentsCoreWithParent;
    disabled?: ILayerContentsCoreWithParent;
    expanded?: ILayerContentsCoreWithParent;
    selected?: ILayerContentsCoreWithParent;
  };
  part?: {
    [part: string]: ILayerContentsCoreWithParent;
  }
};

/**
 * Definition for a theme layer.  The wrapper will add a standard parent property
 *
 * @internal This is an experimental interface and will be changed post design review.
 */
export type ILayer = IThemeLayerBase<ILayerContents>;

/**
 * theming-core provides a strongly typed layering system to be used within themes
 *
 * @internal This is an experimental interface and will be changed post desing review.
 */
export type ILayers = IThemeLayersBase<ILayerContents>;
