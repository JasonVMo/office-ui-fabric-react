import { getLayerBase, mergeLayerCollectionBase, IThemeLayersBase, IThemeLayersConfig, addMixinToLayerBase } from './themeLayers';

const config: IThemeLayersConfig = {
  baseKey: 'base',
  collections: {
    state: true,
    part: true
  }
};

const configNoBase: IThemeLayersConfig = {
  collections: {
    state: true,
    part: true
  }
};

interface IContent {
  n?: number;
  s?: string;
  o?: {
    n1?: number;
    n2?: number;
  };
  state?: {
    disabled?: IContent;
    pressed?: IContent;
    hovered?: IContent;
  };
  part?: {
    [part: string]: IContent;
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

const ExpectedNoBaseLayer: IThemeLayersBase<IContent> = {
  base: { n: 1, o: { n1: 1 } },
  L1a: { n: 2 },
  L1b: { s: 'foo' },
  L1c: { o: { n1: 4 } },
  L1d: { o: { n2: 3 } },
  L2a: { parent: 'L1b', n: 3, s: 'foo' },
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
    const layer = getLayerBase<IContent>(BaseLayers, config, 'L1a');
    expect(layer).toMatchObject(ExpectedBase.L1a);
  });

  it('getLayer L2b', () => {
    const layer = getLayerBase<IContent>(BaseLayers, config, 'L2b');
    expect(layer).toMatchObject(ExpectedBase.L2b);
  });

  it('getLayer logic', () => {
    for (const key in BaseLayers) {
      if (BaseLayers.hasOwnProperty(key)) {
        expect(ExpectedBase.hasOwnProperty(key)).toBeTruthy();
        const layer = getLayerBase<IContent>(BaseLayers, config, key);
        expect(layer).toMatchObject(ExpectedBase[key]);
      }
    }
  });

  it('getLayer logic with no base layer', () => {
    for (const key in BaseLayers) {
      if (BaseLayers.hasOwnProperty(key)) {
        expect(ExpectedNoBaseLayer.hasOwnProperty(key)).toBeTruthy();
        const layer = getLayerBase<IContent>(BaseLayers, configNoBase, key);
        expect(layer).toMatchObject(ExpectedNoBaseLayer[key]);
      }
    }
  });

  it('test mergeLayers works for complex objects', () => {
    const mergedLayers = mergeLayerCollectionBase<IContent>(config.collections, BaseLayers, LayerSet2);
    for (const key in LayerSet2) {
      if (mergedLayers.hasOwnProperty(key)) {
        expect(ExpectedLayer2Merge.hasOwnProperty(key)).toBeTruthy();
        const layer = getLayerBase<IContent>(mergedLayers, config, key);
        expect(layer).toMatchObject(ExpectedLayer2Merge[key]);
      }
    }
  });
});

const configWithOverride: IThemeLayersConfig = {
  collections: {
    state: true,
    part: true
  },
  overrides: 'state'
};

const OverrideBase: IThemeLayersBase<IContent> = {
  default: {
    n: 1,
    s: 'default'
  },
  disabled: {
    s: 'disabled'
  },
  pressed: {
    s: 'pressed'
  },
  hovered: {
    s: 'hovered'
  },
  buttonBase: {
    parent: 'default',
    state: {
      disabled: {
        n: 0
      },
      pressed: {
        s: 'buttonPress'
      }
    }
  },
  disabledButton: {
    parent: ['buttonBase', 'disabled']
  },
  normalButton: {
    parent: 'buttonBase'
  }
};

const ExpectedOverrideValues: IThemeLayersBase<IContent> = {
  buttonBase: {
    parent: 'buttonBase',
    n: 1,
    s: 'default',
    state: {
      disabled: {
        n: 0
      },
      pressed: {
        s: 'buttonPress'
      }
    }
  },
  disabledButton: {
    parent: ['buttonBase', 'disabled'],
    n: 0,
    s: 'disabled',
    state: {
      disabled: {
        n: 0
      },
      pressed: {
        s: 'buttonPress'
      }
    }
  },
  buttonWithPressedMixin: {
    parent: 'buttonBase',
    n: 1,
    s: 'buttonPress',
    state: {
      disabled: {
        n: 0
      },
      pressed: {
        s: 'buttonPress'
      }
    }
  },
  buttonWithHoveredMixin: {
    parent: 'buttonBase',
    n: 1,
    s: 'hovered',
    state: {
      disabled: {
        n: 0
      },
      pressed: {
        s: 'buttonPress'
      }
    }
  }
};

describe('layer overriding tests', () => {
  it('getLayer button', () => {
    const layer = getLayerBase<IContent>(OverrideBase, configWithOverride, 'normalButton');
    expect(layer).toMatchObject(ExpectedOverrideValues.buttonBase);
  });

  it('getLayer L2b', () => {
    const layer = getLayerBase<IContent>(OverrideBase, configWithOverride, 'disabledButton');
    expect(layer).toMatchObject(ExpectedOverrideValues.disabledButton);
  });

  it('getLayer with pressed mixins', () => {
    const layer = getLayerBase<IContent>(OverrideBase, configWithOverride, 'normalButton');
    const adjLayer = addMixinToLayerBase(OverrideBase, configWithOverride, layer!, 'pressed');
    expect(adjLayer).toMatchObject(ExpectedOverrideValues.buttonWithPressedMixin);
  });

  it('getLayer with hovered mixins', () => {
    const layer = getLayerBase<IContent>(OverrideBase, configWithOverride, 'normalButton');
    const adjLayer = addMixinToLayerBase(OverrideBase, configWithOverride, layer!, 'hovered');
    expect(adjLayer).toMatchObject(ExpectedOverrideValues.buttonWithHoveredMixin);
  });
});
