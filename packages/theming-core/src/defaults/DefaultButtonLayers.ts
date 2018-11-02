import { ILayers } from '../interfaces/index';

export const DefaultButtonLayers: ILayers = {
  buttonBase: {
    borderRadius: 0,
    borderWidth: 0,
    minWidth: 100,
    minHeight: 32,
    lineHeight: 1,
    contentPadding: '8px 16px',
    fontWeight: 'bold',
    iconSize: 14,
    iconWeight: 400
  },
  circularButtonBase: {
    parent: 'buttonBase',
    width: 32,
    minWidth: 0,
    height: 32,
    borderRadius: '50%',
    contentPadding: ''
  },
  Button: {
    parent: ['shaded', 'buttonBase']
  },
  PrimaryButton: {
    parent: ['primary', 'buttonBase']
  },
  CircularButton: {
    parent: ['shaded', 'circularButtonBase']
  },
  PrimaryCircularButton: {
    parent: ['primary', 'circularButtonBase']
  }
};
