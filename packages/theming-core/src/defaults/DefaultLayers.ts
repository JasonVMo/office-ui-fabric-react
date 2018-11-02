import { ILayers } from '../interfaces/index';
import { DefaultButtonLayers } from './DefaultButtonLayers';

export const DefaultLayers: ILayers = {
  base: {
    backgroundColor: 'white',
    color: 'neutralPrimary',
    borderColor: 'neutralLighter',
    iconColor: 'neutralPrimary',
    state: {
      interactive: {
        transient: {
          hovered: {
            backgroundColor: 'neutralLighter',
            color: 'neutralDark',
            borderColor: 'transparent',
            iconColor: 'neutralDark'
          },
          pressed: {
            backgroundColor: 'neutralLight',
            color: 'neutralDark',
            borderColor: 'transparent',
            iconColor: 'neutralDark'
          }
        }
      },
      primary: {
        parent: 'primary'
      },
      disabled: {
        color: 'neutralTertiary'
      }
    }
  },
  shaded: {
    backgroundColor: 'neutralLighter',
    borderColor: 'transparent',
    state: {
      interactive: {
        transient: {
          hovered: {
            backgroundColor: 'neutralLight'
          },
          pressed: {
            backgroundColor: 'neutralLight'
          }
        }
      }
    }
  },
  primary: {
    backgroundColor: 'themePrimary',
    color: 'white',
    borderColor: 'transparent',
    state: {
      interactive: {
        transient: {
          hovered: {
            backgroundColor: 'themeDarkAlt'
          },
          pressed: {
            backgroundColor: 'themeDark'
          },
          disabled: {
            backgroundColor: 'neutralLighter',
            color: 'neutralQuaternary'
          }
        }
      }
    }
  },
  ...DefaultButtonLayers
};
