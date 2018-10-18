import { IPalette } from 'office-ui-fabric-react';
import { IStyleCollection } from '@uifabric/experiments/lib/components/Button/StyleCollection';

export function createBaseStyle(p: IPalette): IStyleCollection {
  return {
    base: {
      root: {
        backgroundColor: p.white,
        color: p.neutralPrimary,
        borderColor: p.neutralLighter,
        iconColor: p.neutralPrimary
      },
      hovered: {
        backgroundColor: p.neutralLighter,
        color: p.neutralDark,
        borderColor: 'transparent',
        iconColor: p.neutralDark
      },
      pressed: {
        backgroundColor: p.neutralLight,
        color: p.neutralDark,
        borderColor: 'transparent',
        iconColor: p.neutralDark
      },
      disabled: {
        color: p.neutralTertiary
      }
    },
    shadedStyleControl: {
      root: {
        backgroundColor: p.neutralLighter,
        borderColor: 'transparent'
      },
      hovered: {
        backgroundColor: p.neutralLight
      },
      pressed: {
        backgroundColor: p.neutralLight
      }
    },
    primaryStyleControl: {
      root: {
        backgroundColor: p.themePrimary,
        color: p.white,
        borderColor: 'transparent'
      },
      hovered: {
        backgroundColor: p.themeDarkAlt
      },
      pressed: {
        backgroundColor: p.themeDark
      },
      disabled: {
        backgroundColor: p.neutralLighter,
        color: p.neutralQuaternary
      }
    },
    buttonBaseProps: {
      root: {
        borderRadius: 0,
        borderWidth: 0,
        minWidth: 100,
        minHeight: 32,
        lineHeight: 1,
        contentPadding: '8px 16px',
        textFamily: 'default',
        textSize: 14,
        textWeight: 700,
        iconSize: 14,
        iconWeight: 400
      }
    },
    circularButtonBaseProps: {
      parent: 'buttonBaseProps',
      root: {
        width: 32,
        minWidth: 0,
        height: 32,
        borderRadius: '50%',
        contentPadding: ''
      }
    },
    button: { parent: ['shadedStyleControl', 'buttonBaseProps'] },
    buttonPrimary: { parent: ['primaryStyleControl', 'buttonBaseProps'] },
    circularButton: { parent: ['shadedStyleControl', 'circularButtonBaseProps'] },
    circularButtonPrimary: { parent: ['primaryStyleControl', 'circularButtonBaseProps'] }
  };
}

export function createWordStyle(p: IPalette): IStyleCollection {
  return {
    base: {},
    buttonBaseProps: {
      root: {
        minHeight: 26,
        textSize: 13.5,
        lineHeight: 13.5,
        textWeight: 600,
        iconSize: 12,
        contentPadding: '0px 6px'
      }
    },
    button: {
      parent: 'buttonBaseProps',
      root: {
        color: 'rgb(43, 87, 154',
        borderWidth: 1
      }
    }
  };
}

export function createTeamsStyle(p: IPalette): IStyleCollection {
  return {
    base: {
      root: {
        borderColor: '#bdbdbd',
        iconColor: '#252424'
      },
      hovered: {
        backgroundColor: '#bdbdbd'
      },
      pressed: {
        backgroundColor: '#a7a7a7'
      }
    },
    primaryStyleControl: {
      root: {
        iconColor: 'white'
      }
    },
    buttonBaseProps: {
      root: {
        borderRadius: 3,
        borderWidth: 2,
        iconSize: 16,
        iconWeight: 700,
        textWeight: 400,
        contentPadding: '4px 32px'
      }
    },
    circularButtonBaseProps: {
      root: {
        borderWidth: 1
      }
    },
    button: {
      parent: ['buttonBaseProps']
    },
    buttonPrimary: {
      root: {
        borderWidth: 0
      }
    },
    circularButton: {
      parent: ['circularButtonBaseProps'],
      hovered: {
        backgroundColor: '#464775',
        color: '#fff',
        iconColor: '#fff'
      },
      pressed: {
        backgroundColor: '#464775',
        color: '#fff',
        iconColor: '#fff'
      }
    },
    circularButtonPrimary: {
      root: {
        borderWidth: 0
      }
    }
  };
}
