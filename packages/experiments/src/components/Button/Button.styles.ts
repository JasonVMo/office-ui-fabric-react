import { IButtonComponent } from './Button.types';
import { getFocusStyle, getGlobalClassNames, concatStyleSets } from '../../Styling';
import { memoizeFunction } from '../../Utilities';
import { resolveLayersToComponentStyle, getLayer, ILayer, IThemeCore } from '@uifabric/theming-core';

interface IStateMask {
  interactive?: boolean;
  expanded?: boolean;
  disabled?: boolean;
  primary?: boolean;
}

interface IButtonBooleanProps extends IStateMask {
  circular?: boolean;
}

interface IComponentOptions {
  layerName: string;
  states: string[] | undefined;
}

const stateOrder: Array<keyof IStateMask> = [
  'interactive',
  'primary',
  'expanded',
  'disabled'
];

function _getStatesFromMask(mask: IStateMask): string[] | undefined {
  const states = new Array<string>();
  if (mask.disabled) {
    mask.interactive = false;
  }
  for (const stateKey of stateOrder) {
    if (mask[stateKey]) {
      states.push(stateKey);
    }
  }
  return states.length > 0 ? states : undefined;
}

function _getComponentOptions(boolProps: IButtonBooleanProps): IComponentOptions {
  return {
    layerName: boolProps.circular ? 'CircularButton' : 'Button',
    states: _getStatesFromMask(boolProps)
  };
}

const getBaseStyles = memoizeFunction((theme: IThemeCore, states: string[] | undefined, layerName: string, constLayer: ILayer): object => {
  const layerFromTheme = getLayer(theme, layerName);
  return resolveLayersToComponentStyle(theme, states, constLayer, layerFromTheme);
});

export const getButtonStyles: IButtonComponent['styles'] = props => {
  const { theme, disabled, expanded, className, circular, primary, styleVariables } = props;

  const boolProps: IButtonBooleanProps = { interactive: true, disabled, expanded, circular, primary };
  const { layerName, states } = _getComponentOptions(boolProps);

  const globalClassNames = getGlobalClassNames(
    {
      icon: 'ms-Icon'
    },
    theme,
    true
  );

  // resolverLayersToComponentStyle(theme: IThemeCore, states: string[] | undefined, ...layers: ILayer[]): object {

  const baseStyle = getBaseStyles(theme, states, layerName, {
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
        display: 'flex',
        className: globalClassNames.icon,
      },
      stack: {
        height: '100%'
      },
      text: {
        overflow: 'visible'
      }
    }
  });

  /*
    Things to capture
      width: state.width,
      height: state.height,
      minWidth: state.minWidth,
      minHeight: state.minHeight,
      selectors: {
        [`:hover .${globalClassNames.icon}`]: {
          color: state.iconColorHovered
        },
        [`:hover:active .${globalClassNames.icon}`]: {
          color: state.iconColorPressed
        }
      }
      icon: [
      {
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
    }
  */

  // Styles!
  return concatStyleSets(
    { root: getFocusStyle(theme) },
    baseStyle,
    { root: className }
  );
};
