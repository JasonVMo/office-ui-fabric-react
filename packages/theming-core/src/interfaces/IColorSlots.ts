import { IPalette } from './';

/**
 * It is not quite clear how desirable such an interface is.
 *
 * The semantic color slots that currently exist inside fabric can be distilled down to these color categories.
 * With foundations being as agnostic as possible, this set of color slots in combination with layers
 * allow for the same amount of expressiveness in themes
 * @internal This is an experimental interface and will be changed post design review.
 */
export interface IColorSlots {
  bgColor: keyof IPalette;
  fgColor: keyof IPalette;
  altColor: keyof IPalette;
  iconColor?: keyof IPalette; // TODO: Should this exist here
  textColor?: keyof IPalette; // TODO: Should this exist here
}
