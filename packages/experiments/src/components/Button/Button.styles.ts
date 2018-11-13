import { IButtonComponent, IButtonStyles, IButtonStyleVariablesTypes, IButtonStates } from './Button.types';
import { getFocusStyle, getGlobalClassNames, concatStyleSets } from '../../Styling';
import { memoizeFunction, merge } from '../../Utilities';
import { getComponentStyles, ILayer, IThemeCore, getStatesForLayer } from '@uifabric/theming-core';

const GlobalClassNames = {
  icon: 'ms-Icon'
};

const constButtonStyles: ILayer = {
  fontVariant: 'standard',
  padding: 0,
  display: 'inline-block',
  justifyContent: 'center',
  boxSizing: 'border-box',
  borderStyle: 'solid',
  userSelect: 'none',
  textDecoration: 'none',
  textAlign: 'center',
  verticalAlign: 'baseline',
  overflow: 'hidden',
  lineHeight: '1',
  part: {
    icon: {
      parent: 'iconBase',
      display: 'flex'
    },
    stack: {
      height: '100%',
      contentPadding: '8px 16px'
    },
    text: {
      overflow: 'visible'
    }
  }
};

const getBaseStyles = memoizeFunction(
  (theme: IThemeCore, states: string | undefined, layerName: string, disabled: boolean, iconClass: string): object => {
    return getComponentStyles(theme, {
      layerName,
      constLayer: constButtonStyles,
      states,
      partStates: states,
      disabled,
      selectors: true,
      partClasses: {
        icon: iconClass
      }
    });
  }
);

export const getOriginalButtonStyles: IButtonComponent['styles'] = props => {
  const { theme, disabled, expanded, className, circular, primary, styleVariables } = props;
  const { semanticColors } = theme;

  const globalClassNames = getGlobalClassNames(GlobalClassNames, theme, true);

  const buttonVariables = _processVariables(
    {
      baseVariant: {
        baseState: {
          borderRadius: 0, // root
          borderWidth: 0, // root

          // sizing
          minWidth: 100,
          minHeight: 32,
          lineHeight: 1,
          contentPadding: '8px 16px', // root

          // subcomponent "text"
          textFamily: 'default',
          textSize: 14,
          // tslint:disable-next-line:no-any
          textWeight: 700 as any,

          // subcomponent "icon"
          iconSize: 14,
          iconWeight: 400
        },

        enabled: {
          backgroundColor: semanticColors.buttonBackground,
          backgroundColorHovered: semanticColors.buttonBackgroundHovered,
          backgroundColorPressed: semanticColors.buttonBackgroundPressed,

          iconColor: semanticColors.buttonText,
          iconColorHovered: semanticColors.buttonTextHovered,
          iconColorPressed: semanticColors.buttonTextPressed,

          color: semanticColors.buttonText,
          colorHovered: semanticColors.buttonTextHovered,
          colorPressed: semanticColors.buttonTextPressed,

          borderColor: semanticColors.buttonBorder, // root
          borderColorHovered: semanticColors.buttonBorder,
          borderColorPressed: semanticColors.buttonBorder
        },

        disabled: {
          backgroundColor: semanticColors.buttonBackgroundDisabled,
          backgroundColorHovered: semanticColors.buttonBackgroundDisabled,
          backgroundColorPressed: semanticColors.buttonBackgroundDisabled,

          colorHovered: semanticColors.buttonTextDisabled,
          colorPressed: semanticColors.buttonTextDisabled,
          color: semanticColors.buttonTextDisabled,

          borderColor: semanticColors.buttonBorderDisabled,
          borderColorHovered: semanticColors.buttonBorderDisabled, // root:hover
          borderColorPressed: semanticColors.buttonBorderDisabled // root:active
        },

        expanded: {
          backgroundColor: semanticColors.buttonBackgroundPressed,
          backgroundColorHovered: semanticColors.buttonBackgroundPressed,
          backgroundColorPressed: semanticColors.buttonBackgroundPressed,

          color: semanticColors.buttonTextPressed,
          colorHovered: semanticColors.buttonTextPressed,
          colorPressed: semanticColors.buttonTextPressed
        }
      },

      primary: {
        enabled: {
          backgroundColor: semanticColors.primaryButtonBackground,
          backgroundColorHovered: semanticColors.primaryButtonBackgroundHovered,
          backgroundColorPressed: semanticColors.primaryButtonBackgroundPressed,

          color: semanticColors.primaryButtonText,
          colorHovered: semanticColors.primaryButtonTextHovered,
          colorPressed: semanticColors.primaryButtonTextPressed,

          iconColor: semanticColors.primaryButtonText,
          iconColorHovered: semanticColors.primaryButtonTextHovered,
          iconColorPressed: semanticColors.primaryButtonTextPressed,

          borderColor: semanticColors.primaryButtonBorder
        },
        expanded: {
          backgroundColor: semanticColors.primaryButtonBackgroundPressed,
          backgroundColorHovered: semanticColors.primaryButtonBackgroundPressed,
          backgroundColorPressed: semanticColors.primaryButtonBackgroundPressed,

          color: semanticColors.primaryButtonTextPressed,
          colorHovered: semanticColors.primaryButtonTextPressed,
          colorPressed: semanticColors.primaryButtonTextPressed
        }
      },

      circular: {
        baseState: {
          width: 32,
          minWidth: 0,
          height: 32,
          borderRadius: '50%',
          contentPadding: ''
        }
      }
    },
    styleVariables
  );

  function getButtonStylesFromState(state: IButtonStyleVariablesTypes): Partial<IButtonStyles> {
    if (state) {
      return {
        root: [
          {
            padding: 0,
            backgroundColor: state.backgroundColor,
            color: state.color,
            borderColor: state.borderColor,
            display: 'inline-block',
            justifyContent: 'center',
            boxSizing: 'border-box',
            borderStyle: 'solid',
            borderWidth: state.borderWidth,
            borderRadius: state.borderRadius,
            userSelect: 'none',
            textDecoration: 'none',
            textAlign: 'center',
            verticalAlign: 'baseline',
            overflow: 'hidden',
            lineHeight: '1',
            width: state.width,
            height: state.height,
            minWidth: state.minWidth,
            minHeight: state.minHeight,

            fontSize: state.textSize,
            fontFamily: state.textFamily,
            // tslint:disable-next-line:no-any
            fontWeight: state.textWeight as any,

            selectors: {
              ':hover': {
                backgroundColor: state.backgroundColorHovered,
                color: state.colorHovered,
                borderColor: state.borderColorHovered
              },

              ':hover:active': {
                backgroundColor: state.backgroundColorPressed,
                color: state.colorPressed,
                borderColor: state.borderColorPressed
              },
              [`:hover .${globalClassNames.icon}`]: {
                color: state.iconColorHovered
              },
              [`:hover:active .${globalClassNames.icon}`]: {
                color: state.iconColorPressed
              }
            }
          }
        ],
        icon: [
          {
            display: 'flex',
            fontSize: state.iconSize,
            color: state.iconColor,
            fill: state.iconColor,
            // tslint:disable-next-line:no-any
            fontWeight: state.iconWeight as any
          },
          globalClassNames.icon
        ],
        stack: {
          padding: state.contentPadding,
          height: '100%'
        },
        text: {
          overflow: 'visible'
        }
      };
    }

    // no state
    return {};
  }

  function getButtonStylesFromVariant(variantVariables: { [PState in IButtonStates]: IButtonStyleVariablesTypes }): Partial<IButtonStyles> {
    if (variantVariables) {
      return concatStyleSets(
        getButtonStylesFromState(variantVariables.baseState),
        !disabled && getButtonStylesFromState(variantVariables.enabled),
        !disabled && expanded && getButtonStylesFromState(variantVariables.expanded),
        disabled && getButtonStylesFromState(variantVariables.disabled)
      );
    }
    return {};
  }

  // Styles!
  return concatStyleSets(
    { root: getFocusStyle(theme) },
    getButtonStylesFromVariant(buttonVariables.baseVariant),
    primary && getButtonStylesFromVariant(buttonVariables.primary),
    circular && getButtonStylesFromVariant(buttonVariables.circular),
    {
      root: className
    }
  );
};

type IProcessedVariables<T> = { [P in keyof T]-?: IProcessedVariables<T[P]> };

function _processVariables<T>(partialVariables: T, customVariables?: T): IProcessedVariables<T> {
  // tslint:disable-next-line:no-any
  const result = customVariables ? merge({}, partialVariables, customVariables) : partialVariables;

  return result as IProcessedVariables<T>;
}

export const getButtonStylesNew: IButtonComponent['styles'] = props => {
  const { theme, className, circular, disabled } = props;

  const layerName = circular ? 'CircularButton' : 'Button';
  const states = getStatesForLayer(props);
  const globalClassNames = getGlobalClassNames(GlobalClassNames, theme, true);

  // now get the memoized styles
  const baseStyle = getBaseStyles(theme, states, layerName, !!disabled, globalClassNames.icon || '');

  // Styles!
  return concatStyleSets(
    {
      root: getFocusStyle(theme)
    },
    baseStyle,
    {
      root: className,
      icon: globalClassNames.icon
    }
  );
};

export const getButtonStyles: IButtonComponent['styles'] = props => {
  const newStyles = getButtonStylesNew(props);
  const origStyles = getOriginalButtonStyles(props);
  if (newStyles) {
    return newStyles;
  }
  return origStyles;
};
