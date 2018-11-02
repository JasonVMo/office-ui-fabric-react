import { IColorSlots } from './IColorSlots';
import { IFontChoice } from './ITypography';
import { IThemeLayerBase, IThemeLayersBase } from '@uifabric/foundation';

/**
 * Any layer within a theme is allowed to make changes to the properties within ILayerContents
 * This allows for inheritance and cascading.
 *
 * @internal This is an experimental interface and will be changed post design review.
 */
export type ILayerContents = IColorSlots & IFontChoice;

/**
 * Definition for a theme layer
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
