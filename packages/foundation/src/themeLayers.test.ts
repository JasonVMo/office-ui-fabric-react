import { getLayer, mergeLayers, IThemeLayersBase } from './themeLayers';

const baseKey = 'base';

interface IContent {
  n?: number;
  s?: string;
  o?: {
    n1?: number;
    n2?: number;
  };
}

const BaseLayers: IThemeLayersBase<IContent> = {
  base: { n: 1, o: { n1: 1 } },
  L1a: { n: 2 },
  L1b: { s: 'foo' },
  L1c: { o: { n1: 4 } },
  L1d: { o: { n2: 3 } },
  L2a: { parent: 'L1b', n: 3 },
  L2b: { parent: ['L1a', 'L1b', 'L1c', 'L1d'], s: 'bar' }
};

const ExpectedBase: IThemeLayersBase<IContent> = {
  base: { n: 1, o: { n1: 1 } },
  L1a: { n: 2, o: { n1: 1 } },
  L1b: { n: 1, s: 'foo', o: { n1: 1 } },
  L1c: { n: 1, o: { n1: 4 } },
  L1d: { n: 1, o: { n2: 3 } },
  L2a: { parent: 'L1b', n: 3, s: 'foo', o: { n1: 1 } },
  L2b: { parent: ['L1a', 'L1b', 'L1c', 'L1d'], n: 2, s: 'bar', o: { n2: 3 } }
};

const LayerSet2: IThemeLayersBase<IContent> = {
  base: {
    state: {
      hovered: { s: 'hover' },
      pressed: { s: 'press' },
      disabled: { s: 'disabled' }
    }
  },
  ButtonBase: {
    s: 'button',
    state: {
      disabled: {
        n: -10
      }
    },
    part: {
      icon: {
        o: { n1: 32, n2: 32 },
        state: { disabled: { n: -20 } }
      }
    }
  },
  Button1: {
    parent: 'ButtonBase',
    state: {
      hovered: { n: 5 }
    }
  },
  Button2: {
    parent: 'ButtonBase',
    part: {
      widget: { s: 'foo' }
    }
  }
};

const ExpectedLayer2Merge: IThemeLayersBase<IContent> = {
  base: {
    n: 1,
    o: { n1: 1 },
    state: {
      hovered: { s: 'hover' },
      pressed: { s: 'press' },
      disabled: { s: 'disabled' }
    }
  },
  ButtonBase: {
    n: 1,
    s: 'button',
    o: { n1: 1 },
    state: {
      hovered: { s: 'hover' },
      pressed: { s: 'press' },
      disabled: { s: 'disabled', n: -10 }
    },
    part: {
      icon: {
        o: { n1: 32, n2: 32 },
        state: { disabled: { n: -20 } }
      }
    }
  },
  Button1: {
    parent: 'ButtonBase',
    n: 1,
    s: 'button',
    o: { n1: 1 },
    state: {
      hovered: { s: 'hover', n: 5 },
      pressed: { s: 'press' },
      disabled: { s: 'disabled', n: -10 }
    },
    part: {
      icon: {
        o: { n1: 32, n2: 32 },
        state: { disabled: { n: -20 } }
      }
    }
  },
  Button2: {
    parent: 'ButtonBase',
    n: 1,
    s: 'button',
    o: { n1: 1 },
    state: {
      hovered: { s: 'hover' },
      pressed: { s: 'press' },
      disabled: { s: 'disabled', n: -10 }
    },
    part: {
      icon: {
        o: { n1: 32, n2: 32 },
        state: { disabled: { n: -20 } }
      },
      widget: { s: 'foo' }
    }
  }
};

describe('layer functionality', () => {

  it('getLayer L1a', () => {
    const layer = getLayer<IContent>(BaseLayers, baseKey, 'L1a');
    expect(layer).toMatchObject(ExpectedBase.L1a);
  });

  it('getLayer L2b', () => {
    const layer = getLayer<IContent>(BaseLayers, baseKey, 'L2b');
    expect(layer).toMatchObject(ExpectedBase.L2b);
  });

  it('getLayer logic', () => {
    for (const key in BaseLayers) {
      if (BaseLayers.hasOwnProperty(key)) {
        expect(ExpectedBase.hasOwnProperty(key)).toBeTruthy();
        const layer = getLayer<IContent>(BaseLayers, baseKey, key);
        expect(layer).toMatchObject(ExpectedBase[key]);
      }
    }
  });

  it('test mergeLayers works for complex objects', () => {
    const mergedLayers = mergeLayers<IContent>(BaseLayers, LayerSet2);
    for (const key in LayerSet2) {
      if (mergedLayers.hasOwnProperty(key)) {
        expect(ExpectedLayer2Merge.hasOwnProperty(key)).toBeTruthy();
        const layer = getLayer<IContent>(mergedLayers, baseKey, key);
        expect(layer).toMatchObject(ExpectedLayer2Merge[key]);
      }
    }
  });
});