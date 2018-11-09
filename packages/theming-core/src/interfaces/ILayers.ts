import { IColorSlots } from './IColorSlots';
import { IFontChoice } from './ITypography';
import { ISpace, IOtherProps } from './ISpace';
import { IThemeLayerBase, IThemeLayersBase } from '@uifabric/foundation';

/**
 * Things to do tonight
 *  layers have mixins or overrides for states
 *    apply base state/style (if existing) then apply overrides on top
 *  do them in order
 *
 *  make an icon base class which overrides styles for various look and feel states
 *
 *  parts are done separately one by one
 *    states/mixins get applied to parts as well
 *    selectors support class injection when being built
 *
 * clean up actual interfaces in the button
 * try to make it run
 */

/**
 * The flat set of properties that can be defined for a layer
 *
 * @internal This is experimental and will be changed post design review
 */
export type ILayerContentsFlatProps = IColorSlots & IFontChoice & ISpace & IOtherProps;

/**
 * The layer contents used by the themeLayers code in foundation
 *
 * @internal This is an experimental interface and will be changed post design review.
 */
export type ILayerContents = ILayerContentsFlatProps & {
  selectors?: {
    ':hover'?: ILayerContentsFlatProps;
    ':hover:active'?: ILayerContentsFlatProps;
  }
  state?: {
    [state: string]: ILayer;
  };
  part?: {
    [part: string]: ILayer;
  };
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
