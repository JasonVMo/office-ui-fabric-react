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
  slots: {
    icon: {
      parent: 'iconBase',
      display: 'flex'
    },
    stack: {
      height: '100%',
      padding: '8px 16px'
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
      slotStates: states,
      disabled,
      selectors: true,
      slots: {
        icon: iconClass,
        stack: undefined,
        text: undefined
      }
    });
  }
);

export const getButtonStyles: IButtonComponent['styles'] = props => {
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
