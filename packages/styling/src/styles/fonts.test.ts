import { createFontStyles } from './fonts';
import { createTypography } from '@uifabric/theming-core';

describe('fonts tests', () => {
  it('creates the correct font styles for en', () => {
    const typography = createTypography('en');
    expect(createFontStyles(typography)).toMatchSnapshot();
  });

  it('creates the correct font styles for ar', () => {
    const typography = createTypography('ar');
    expect(createFontStyles(typography)).toMatchSnapshot();
  });

  it('creates the correct font styles for ja', () => {
    const typography = createTypography('ja');
    expect(createFontStyles(typography)).toMatchSnapshot();
  });
});
