import { ILayers } from '../interfaces/index';
import { DefaultButtonLayers } from './DefaultButtonLayers';

export const DefaultLayers: ILayers = {
  base: {
    backgroundColor: 'white',
    color: 'neutralPrimary',
    borderColor: 'neutralLighter',
    selectors: {
      ':hover': {
        backgroundColor: 'neutralLighter',
        color: 'neutralDark',
        borderColor: 'transparent'
      },
      ':hover:active': {
        backgroundColor: 'neutralLight',
        color: 'neutralDark',
        borderColor: 'transparent'
      }
    },
    state: {
      disabled: {
        color: 'neutralTertiary'
      }
    }
  },
  shaded: {
    backgroundColor: 'neutralLighter',
    color: 'neutralPrimary',
    borderColor: 'transparent',
    selectors: {
      ':hover': { backgroundColor: 'neutralLight' },
      ':hover:active': { backgroundColor: 'neutralLight' }
    },
    state: {
      disabled: {
        color: 'neutralTertiary'
      }
    }
  },
  primary: {
    backgroundColor: 'themePrimary',
    color: 'white',
    borderColor: 'transparent',
    selectors: {
      ':hover': { backgroundColor: 'themeDarkAlt' },
      ':hover:active': { backgroundColor: 'themeDark' }
    },
    state: {
      disabled: {
        backgroundColor: 'neutralLighter',
        color: 'neutralQuaternary'
      }
    }
  },
  iconBase: {
    color: 'neutralPrimary',
    fill: 'neutralPrimary',
    fontWeight: 400,
    selectors: {
      ':hover': { color: 'neutralDark' },
      ':hover:active': { color: 'neutralDark' }
    }
  },
  ...DefaultButtonLayers
};
