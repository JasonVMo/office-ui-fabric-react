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
    overrides: {
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
      ':hover': { backgroundColor: 'neutralLight', color: 'neutralDark' },
      ':hover:active': { backgroundColor: 'neutralLight', color: 'neutralDark' }
    },
    overrides: {
      disabled: {
        color: 'neutralTertiary'
      },
      expanded: {
        backgroundColor: 'neutralTertiaryAlt',
        color: 'neutralDark',
        selectors: {
          ':hover': { backgroundColor: 'neutralLight', color: 'black' },
          ':hover:active': { backgroundColor: 'neutralLight', color: 'black' }
        }
      }
    }
  },
  primary: {
    backgroundColor: 'themePrimary',
    color: 'white',
    borderColor: 'transparent',
    selectors: {
      ':hover': { backgroundColor: 'themeDarkAlt', color: 'white' },
      ':hover:active': { backgroundColor: 'themeDark', color: 'white' }
    },
    overrides: {
      disabled: {
        backgroundColor: 'neutralLighter',
        color: 'neutralQuaternary'
      },
      expanded: {
        backgroundColor: 'themeDarkAlt',
        selectors: {
          ':hover': { backgroundColor: 'themeDark' },
          ':hover:active': { backgroundColor: 'themePrimary' }
        }
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
    },
    overrides: {
      primary: {
        color: 'white',
        fill: 'white',
        selectors: {
          ':hover': { color: 'white' },
          ':hover:active': { color: 'white' }
        }
      }
    }
  },
  ...DefaultButtonLayers
};
