import { Customizations, merge } from '@uifabric/utilities';
import { IPalette, ISemanticColors, ITheme, IPartialTheme, ISemanticTextColors } from '../interfaces/index';
import { ITypography, IPartialTypography, IFontVariant } from '../interfaces/ITypography';
import { DefaultFontStyles, DefaultTypography } from './DefaultFontStyles';
import { DefaultPalette } from './DefaultPalette';
import { DefaultSpacing } from './DefaultSpacing';
import { loadTheme as legacyLoadTheme } from '@microsoft/load-themed-styles';

// Platform default values to use as a hidden parent theme
const platformDefaultTheme: ITheme = {
  palette: DefaultPalette,
  semanticColors: _makeSemanticColorsFromPalette(DefaultPalette, false, false),
  fonts: DefaultFontStyles,
  isInverted: false,
  typography: DefaultTypography,
  spacing: DefaultSpacing,
  disableGlobalClassNames: false
};
let _theme: ITheme = createTheme({});

let _onThemeChangeCallbacks: Array<(theme: ITheme) => void> = [];

export const ThemeSettingName = 'theme';

if (!Customizations.getSettings([ThemeSettingName]).theme) {
  let win = typeof window !== 'undefined' ? window : undefined;

  // tslint:disable:no-string-literal no-any
  if (win && (win as any)['FabricConfig'] && (win as any)['FabricConfig'].theme) {
    _theme = createTheme((win as any)['FabricConfig'].theme);
  }
  // tslint:enable:no-string-literal no-any

  // Set the default theme.
  Customizations.applySettings({ [ThemeSettingName]: _theme });
}

/**
 * Gets the theme object
 * @param {boolean} depComments - Whether to include deprecated tags as comments for deprecated slots.
 */
export function getTheme(depComments: boolean = false): ITheme {
  if (depComments === true) {
    // this will recreate the theme every time, also it will stomp any customizations applied above
    _theme = createTheme({}, depComments);
  }
  return _theme;
}

/**
 * Registers a callback that gets called whenever the theme changes.
 * This should only be used when the component cannot automatically get theme changes through its state.
 * This will not register duplicate callbacks.
 */
export function registerOnThemeChangeCallback(callback: (theme: ITheme) => void): void {
  if (_onThemeChangeCallbacks.indexOf(callback) === -1) {
    _onThemeChangeCallbacks.push(callback);
  }
}

/**
 * See registerOnThemeChangeCallback().
 * Removes previously registered callbacks.
 */
export function removeOnThemeChangeCallback(callback: (theme: ITheme) => void): void {
  const i = _onThemeChangeCallbacks.indexOf(callback);
  if (i === -1) {
    return;
  }

  _onThemeChangeCallbacks.splice(i, 1);
}

/**
 * Applies the theme, while filling in missing slots.
 * @param {object} theme - Partial theme object.
 * @param {boolean} depComments - Whether to include deprecated tags as comments for deprecated slots.
 */
export function loadTheme(theme: IPartialTheme, depComments: boolean = false): ITheme {
  _theme = createTheme(theme, depComments);

  // Invoke the legacy method of theming the page as well.
  legacyLoadTheme({ ..._theme.palette, ..._theme.semanticColors });

  Customizations.applySettings({ [ThemeSettingName]: _theme });

  _onThemeChangeCallbacks.forEach((callback: (theme: ITheme) => void) => {
    try {
      callback(_theme);
    } catch (e) {
      // don't let a bad callback break everything else
    }
  });

  return _theme;
}

/**
 * Return a fully resolved theme given a parent theme and a partial specificaton
 * @param theme Partial theme specification, properties in here will be applied on top of the parent
 * @param parent Fully specified parent theme, this will be used as the baseline and will not be modified
 * @param depComments Whether to insert comments in deprecated properties
 */
export function createLayeredTheme(theme: IPartialTheme, parent: ITheme, depComments: boolean = false): ITheme {
  // patch the palette and boolean flags
  const palette: IPalette = Object.assign({}, parent.palette, theme.palette);
  if (!theme.palette || !theme.palette.accent) {
    palette.accent = palette.themePrimary;
  }

  const isInverted: boolean = (typeof theme.isInverted !== 'undefined' && theme.isInverted) || parent.isInverted;
  const disableGlobalClassNames: boolean =
    (typeof theme.disableGlobalClassNames !== 'undefined' && theme.disableGlobalClassNames) || parent.disableGlobalClassNames;

  // semantic colors need to be updated if the palette was set or if deprecated comments are being added
  const updateSemantic: boolean = !!theme.palette || depComments;
  const baseSemanticColors: ISemanticColors = updateSemantic
    ? _makeSemanticColorsFromPalette(palette, isInverted, depComments)
    : parent.semanticColors;
  const semanticColors: ISemanticColors = Object.assign({}, baseSemanticColors, theme.semanticColors);

  // build the merged object and return it
  return {
    palette,
    semanticColors,
    isInverted,
    disableGlobalClassNames,
    fonts: Object.assign({}, parent.fonts, theme.fonts),
    typography: merge<ITypography>({}, parent.typography, theme.typography as ITypography),
    spacing: Object.assign({}, parent.spacing, theme.spacing)
  };
}

/**
 * Creates a custom theme definition which can be used with the Customizer.
 * @param {object} theme - Partial theme object.
 * @param {boolean} depComments - Whether to include deprecated tags as comments for deprecated slots.
 */
export function createTheme(theme: IPartialTheme, depComments: boolean = false): ITheme {
  return createLayeredTheme(theme, platformDefaultTheme, depComments);
}

/**
 * Helper to pull a given property name from a given set of sources, in order, if available. Otherwise returns the property name.
 */
function _expandFrom<TRetVal, TMapType>(propertyName: string | TRetVal | undefined, ...maps: TMapType[]): TRetVal {
  if (propertyName) {
    for (const map of maps) {
      if (map[propertyName as string]) {
        return map[propertyName as string];
      }
    }
  }

  return propertyName as TRetVal;
}

// Generates all the semantic slot colors based on the Fabric palette.
// We'll use these as fallbacks for semantic slots that the passed in theme did not define.
function _makeSemanticColorsFromPalette(p: IPalette, isInverted: boolean, depComments: boolean): ISemanticColors {
  let toReturn: ISemanticColors = {
    bodyBackground: p.white,
    bodyStandoutBackground: p.neutralLighterAlt,
    bodyFrameBackground: p.white,
    bodyFrameDivider: p.neutralLight,
    bodyText: p.neutralPrimary,
    bodyTextChecked: p.black,
    bodySubtext: p.neutralSecondary,
    bodyDivider: p.neutralLight,

    disabledBackground: p.neutralLighter,
    disabledText: p.neutralTertiary,
    disabledBodyText: p.neutralTertiaryAlt,
    disabledSubtext: p.neutralQuaternary,

    focusBorder: p.neutralSecondary,
    variantBorder: p.neutralLight,
    variantBorderHovered: p.neutralTertiary,
    defaultStateBackground: p.neutralLight,

    errorText: !isInverted ? p.redDark : '#ff5f5f',
    warningText: !isInverted ? '#333333' : '#ffffff',
    errorBackground: !isInverted ? 'rgba(232, 17, 35, .2)' : 'rgba(232, 17, 35, .5)',
    blockingBackground: !isInverted ? 'rgba(234, 67, 0, .2)' : 'rgba(234, 67, 0, .5)',
    warningBackground: !isInverted ? 'rgba(255, 185, 0, .2)' : 'rgba(255, 251, 0, .6)',
    warningHighlight: !isInverted ? '#ffb900' : '#fff100',
    successBackground: !isInverted ? 'rgba(186, 216, 10, .2)' : 'rgba(186, 216, 10, .4)',

    inputBorder: p.neutralTertiary,
    inputBorderHovered: p.neutralDark,
    inputBackground: p.white,
    inputBackgroundChecked: p.themePrimary,
    inputBackgroundCheckedHovered: p.themeDarkAlt,
    inputForegroundChecked: p.white,
    inputFocusBorderAlt: p.themePrimary,
    smallInputBorder: p.neutralSecondary,
    inputPlaceholderText: p.neutralSecondary,

    buttonBackground: p.neutralLighter,
    buttonBackgroundChecked: p.neutralTertiaryAlt,
    buttonBackgroundHovered: p.neutralLight,
    buttonBackgroundCheckedHovered: p.neutralLight,
    buttonBackgroundPressed: p.neutralLight,
    buttonBackgroundDisabled: p.neutralLighter,
    buttonBorder: 'transparent',
    buttonText: p.neutralPrimary,
    buttonTextHovered: p.neutralDark,
    buttonTextChecked: p.neutralDark,
    buttonTextCheckedHovered: p.black,
    buttonTextPressed: p.neutralDark,
    buttonTextDisabled: p.neutralTertiary,
    buttonBorderDisabled: 'transparent',

    primaryButtonBackground: p.themePrimary,
    primaryButtonBackgroundHovered: p.themeDarkAlt,
    primaryButtonBackgroundPressed: p.themeDark,
    primaryButtonBackgroundDisabled: p.neutralLighter,
    primaryButtonBorder: 'transparent',

    primaryButtonText: p.white,
    primaryButtonTextHovered: p.white,
    primaryButtonTextPressed: p.white,
    primaryButtonTextDisabled: p.neutralQuaternary,

    menuBackground: p.white,
    menuDivider: p.neutralTertiaryAlt,
    menuIcon: p.themePrimary,
    menuHeader: p.themePrimary,
    menuItemBackgroundHovered: p.neutralLighter,
    menuItemBackgroundPressed: p.neutralLight,
    menuItemText: p.neutralPrimary,
    menuItemTextHovered: p.neutralDark,

    listBackground: p.white,
    listText: p.neutralPrimary,
    listItemBackgroundHovered: p.neutralLighter,
    listItemBackgroundChecked: p.neutralLight,
    listItemBackgroundCheckedHovered: p.neutralQuaternaryAlt,

    listHeaderBackgroundHovered: p.neutralLighter,
    listHeaderBackgroundPressed: p.neutralLight,

    actionLink: p.neutralPrimary,
    actionLinkHovered: p.neutralDark,
    link: p.themePrimary,
    linkHovered: p.themeDarker,

    // Deprecated slots, second pass by _fixDeprecatedSlots() later for self-referential slots
    listTextColor: '',
    menuItemBackgroundChecked: p.neutralLight
  };

  return _fixDeprecatedSlots(toReturn, depComments!);
}

function _fixDeprecatedSlots(s: ISemanticColors, depComments: boolean): ISemanticColors {
  // Add @deprecated tag as comment if enabled
  let dep = '';
  if (depComments === true) {
    dep = ' /* @deprecated */';
  }

  s.listTextColor = s.listText + dep;
  s.menuItemBackgroundChecked += dep;
  return s;
}
