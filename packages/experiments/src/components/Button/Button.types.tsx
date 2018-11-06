import { IComponent, IStyleableComponentProps } from '../../Foundation';
import { IStyle } from '../../Styling';
import { IIconProps, IContextualMenuProps } from 'office-ui-fabric-react';
import { IFontChoice } from '@uifabric/theming-core';

export type IButtonComponent = IComponent<IButtonProps, IButtonViewProps, IButtonStyles>;

// States should only be javascript evluated states. (Not css states.)
export type IButtonStates = 'baseState' | 'enabled' | 'disabled' | 'expanded';

export type IButtonVariants = 'baseVariant' | 'primary' | 'circular';

export type IButtonSlots = 'root' | 'stack' | 'text' | 'icon' | 'menuIcon';

export interface IButtonProps extends IStyleableComponentProps<IButtonProps, IButtonStyles> {
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  href?: string;
  text?: string;

  primary?: boolean;
  circular?: boolean;
  disabled?: boolean;
  expanded?: boolean;
  defaultExpanded?: boolean;

  variant?: IButtonVariants;

  onClick?: (ev: React.MouseEvent<HTMLElement>) => void;
  menu?: React.ReactType<IContextualMenuProps>;
  icon?: string | IIconProps | JSX.Element;
  styleVariables?: IButtonStyleVariables;
}

export type IButtonStyleVariablesTypes = IFontChoice & {
  width?: number | string;
  height?: number | string;
  iconSize?: number | string;
  lineHeight?: number | string;
  minWidth?: number | string;
  minHeight?: number | string;
};

export type IButtonStyleVariables = { [PVariant in IButtonVariants]?: { [PState in IButtonStates]?: IButtonStyleVariablesTypes } };

export type IButtonStyles = { [key in IButtonSlots]: IStyle };

export type IButtonViewProps = IButtonProps & {
  onMenuDismiss: () => void;
  menuTarget: HTMLElement | undefined;
};
