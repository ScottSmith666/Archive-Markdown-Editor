import { localize } from '../../../../nls.js';
import { Color, RGBA } from '../../../../base/common/color.js';
import { registerColor, transparent, darken, lighten } from '../colorUtils.js';
import { foreground, contrastBorder, focusBorder, iconForeground } from './baseColors.js';
import { editorWidgetBackground } from './editorColors.js';
import { listHoverBackground } from './listColors.js';

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// ----- input
const inputBackground = registerColor('input.background', { dark: '#3C3C3C', light: Color.white, hcDark: Color.black, hcLight: Color.white }, localize(1916, "Input box background."));
const inputForeground = registerColor('input.foreground', foreground, localize(1917, "Input box foreground."));
const inputBorder = registerColor('input.border', { dark: null, light: null, hcDark: contrastBorder, hcLight: contrastBorder }, localize(1918, "Input box border."));
const inputActiveOptionBorder = registerColor('inputOption.activeBorder', { dark: '#007ACC', light: '#007ACC', hcDark: contrastBorder, hcLight: contrastBorder }, localize(1919, "Border color of activated options in input fields."));
const inputActiveOptionHoverBackground = registerColor('inputOption.hoverBackground', { dark: '#5a5d5e80', light: '#b8b8b850', hcDark: null, hcLight: null }, localize(1920, "Background color of activated options in input fields."));
const inputActiveOptionBackground = registerColor('inputOption.activeBackground', { dark: transparent(focusBorder, 0.4), light: transparent(focusBorder, 0.2), hcDark: Color.transparent, hcLight: Color.transparent }, localize(1921, "Background hover color of options in input fields."));
const inputActiveOptionForeground = registerColor('inputOption.activeForeground', { dark: Color.white, light: Color.black, hcDark: foreground, hcLight: foreground }, localize(1922, "Foreground color of activated options in input fields."));
registerColor('input.placeholderForeground', { light: transparent(foreground, 0.5), dark: transparent(foreground, 0.5), hcDark: transparent(foreground, 0.7), hcLight: transparent(foreground, 0.7) }, localize(1923, "Input box foreground color for placeholder text."));
// ----- input validation
const inputValidationInfoBackground = registerColor('inputValidation.infoBackground', { dark: '#063B49', light: '#D6ECF2', hcDark: Color.black, hcLight: Color.white }, localize(1924, "Input validation background color for information severity."));
const inputValidationInfoForeground = registerColor('inputValidation.infoForeground', { dark: null, light: null, hcDark: null, hcLight: foreground }, localize(1925, "Input validation foreground color for information severity."));
const inputValidationInfoBorder = registerColor('inputValidation.infoBorder', { dark: '#007acc', light: '#007acc', hcDark: contrastBorder, hcLight: contrastBorder }, localize(1926, "Input validation border color for information severity."));
const inputValidationWarningBackground = registerColor('inputValidation.warningBackground', { dark: '#352A05', light: '#F6F5D2', hcDark: Color.black, hcLight: Color.white }, localize(1927, "Input validation background color for warning severity."));
const inputValidationWarningForeground = registerColor('inputValidation.warningForeground', { dark: null, light: null, hcDark: null, hcLight: foreground }, localize(1928, "Input validation foreground color for warning severity."));
const inputValidationWarningBorder = registerColor('inputValidation.warningBorder', { dark: '#B89500', light: '#B89500', hcDark: contrastBorder, hcLight: contrastBorder }, localize(1929, "Input validation border color for warning severity."));
const inputValidationErrorBackground = registerColor('inputValidation.errorBackground', { dark: '#5A1D1D', light: '#F2DEDE', hcDark: Color.black, hcLight: Color.white }, localize(1930, "Input validation background color for error severity."));
const inputValidationErrorForeground = registerColor('inputValidation.errorForeground', { dark: null, light: null, hcDark: null, hcLight: foreground }, localize(1931, "Input validation foreground color for error severity."));
const inputValidationErrorBorder = registerColor('inputValidation.errorBorder', { dark: '#BE1100', light: '#BE1100', hcDark: contrastBorder, hcLight: contrastBorder }, localize(1932, "Input validation border color for error severity."));
// ----- select
const selectBackground = registerColor('dropdown.background', { dark: '#3C3C3C', light: Color.white, hcDark: Color.black, hcLight: Color.white }, localize(1933, "Dropdown background."));
const selectListBackground = registerColor('dropdown.listBackground', { dark: null, light: null, hcDark: Color.black, hcLight: Color.white }, localize(1934, "Dropdown list background."));
const selectForeground = registerColor('dropdown.foreground', { dark: '#F0F0F0', light: foreground, hcDark: Color.white, hcLight: foreground }, localize(1935, "Dropdown foreground."));
const selectBorder = registerColor('dropdown.border', { dark: selectBackground, light: '#CECECE', hcDark: contrastBorder, hcLight: contrastBorder }, localize(1936, "Dropdown border."));
// ------ button
const buttonForeground = registerColor('button.foreground', Color.white, localize(1937, "Button foreground color."));
const buttonSeparator = registerColor('button.separator', transparent(buttonForeground, .4), localize(1938, "Button separator color."));
const buttonBackground = registerColor('button.background', { dark: '#0E639C', light: '#007ACC', hcDark: Color.black, hcLight: '#0F4A85' }, localize(1939, "Button background color."));
const buttonHoverBackground = registerColor('button.hoverBackground', { dark: lighten(buttonBackground, 0.2), light: darken(buttonBackground, 0.2), hcDark: buttonBackground, hcLight: buttonBackground }, localize(1940, "Button background color when hovering."));
const buttonBorder = registerColor('button.border', contrastBorder, localize(1941, "Button border color."));
const buttonSecondaryForeground = registerColor('button.secondaryForeground', { dark: foreground, light: foreground, hcDark: Color.white, hcLight: foreground }, localize(1942, "Secondary button foreground color."));
const buttonSecondaryBackground = registerColor('button.secondaryBackground', { dark: listHoverBackground, light: listHoverBackground, hcDark: null, hcLight: Color.white }, localize(1943, "Secondary button background color."));
registerColor('button.secondaryBorder', contrastBorder, localize(1944, "Secondary button border color."));
const buttonSecondaryHoverBackground = registerColor('button.secondaryHoverBackground', { dark: lighten(listHoverBackground, 0.2), light: lighten(listHoverBackground, 0.2), hcDark: null, hcLight: null }, localize(1945, "Secondary button background color when hovering."));
// ------ radio
const radioActiveForeground = registerColor('radio.activeForeground', inputActiveOptionForeground, localize(1946, "Foreground color of active radio option."));
const radioActiveBackground = registerColor('radio.activeBackground', inputActiveOptionBackground, localize(1947, "Background color of active radio option."));
const radioActiveBorder = registerColor('radio.activeBorder', inputActiveOptionBorder, localize(1948, "Border color of the active radio option."));
const radioInactiveForeground = registerColor('radio.inactiveForeground', null, localize(1949, "Foreground color of inactive radio option."));
const radioInactiveBackground = registerColor('radio.inactiveBackground', null, localize(1950, "Background color of inactive radio option."));
const radioInactiveBorder = registerColor('radio.inactiveBorder', { light: transparent(radioActiveForeground, .2), dark: transparent(radioActiveForeground, .2), hcDark: transparent(radioActiveForeground, .4), hcLight: transparent(radioActiveForeground, .2) }, localize(1951, "Border color of the inactive radio option."));
const radioInactiveHoverBackground = registerColor('radio.inactiveHoverBackground', inputActiveOptionHoverBackground, localize(1952, "Background color of inactive active radio option when hovering."));
// ------ checkbox
const checkboxBackground = registerColor('checkbox.background', selectBackground, localize(1953, "Background color of checkbox widget."));
registerColor('checkbox.selectBackground', editorWidgetBackground, localize(1954, "Background color of checkbox widget when the element it's in is selected."));
const checkboxForeground = registerColor('checkbox.foreground', selectForeground, localize(1955, "Foreground color of checkbox widget."));
const checkboxBorder = registerColor('checkbox.border', selectBorder, localize(1956, "Border color of checkbox widget."));
registerColor('checkbox.selectBorder', iconForeground, localize(1957, "Border color of checkbox widget when the element it's in is selected."));
const checkboxDisabledBackground = registerColor('checkbox.disabled.background', { op: 7 /* ColorTransformType.Mix */, color: checkboxBackground, with: checkboxForeground, ratio: 0.33 }, localize(1958, "Background of a disabled checkbox."));
const checkboxDisabledForeground = registerColor('checkbox.disabled.foreground', { op: 7 /* ColorTransformType.Mix */, color: checkboxForeground, with: checkboxBackground, ratio: 0.33 }, localize(1959, "Foreground of a disabled checkbox."));
// ------ keybinding label
const keybindingLabelBackground = registerColor('keybindingLabel.background', { dark: new Color(new RGBA(128, 128, 128, 0.17)), light: new Color(new RGBA(221, 221, 221, 0.4)), hcDark: Color.transparent, hcLight: Color.transparent }, localize(1960, "Keybinding label background color. The keybinding label is used to represent a keyboard shortcut."));
const keybindingLabelForeground = registerColor('keybindingLabel.foreground', { dark: Color.fromHex('#CCCCCC'), light: Color.fromHex('#555555'), hcDark: Color.white, hcLight: foreground }, localize(1961, "Keybinding label foreground color. The keybinding label is used to represent a keyboard shortcut."));
const keybindingLabelBorder = registerColor('keybindingLabel.border', { dark: new Color(new RGBA(51, 51, 51, 0.6)), light: new Color(new RGBA(204, 204, 204, 0.4)), hcDark: new Color(new RGBA(111, 195, 223)), hcLight: contrastBorder }, localize(1962, "Keybinding label border color. The keybinding label is used to represent a keyboard shortcut."));
const keybindingLabelBottomBorder = registerColor('keybindingLabel.bottomBorder', { dark: new Color(new RGBA(68, 68, 68, 0.6)), light: new Color(new RGBA(187, 187, 187, 0.4)), hcDark: new Color(new RGBA(111, 195, 223)), hcLight: foreground }, localize(1963, "Keybinding label border bottom color. The keybinding label is used to represent a keyboard shortcut."));

export { buttonBackground, buttonBorder, buttonForeground, buttonHoverBackground, buttonSecondaryBackground, buttonSecondaryForeground, buttonSecondaryHoverBackground, buttonSeparator, checkboxBackground, checkboxBorder, checkboxDisabledBackground, checkboxDisabledForeground, checkboxForeground, inputActiveOptionBackground, inputActiveOptionBorder, inputActiveOptionForeground, inputActiveOptionHoverBackground, inputBackground, inputBorder, inputForeground, inputValidationErrorBackground, inputValidationErrorBorder, inputValidationErrorForeground, inputValidationInfoBackground, inputValidationInfoBorder, inputValidationInfoForeground, inputValidationWarningBackground, inputValidationWarningBorder, inputValidationWarningForeground, keybindingLabelBackground, keybindingLabelBorder, keybindingLabelBottomBorder, keybindingLabelForeground, radioActiveBackground, radioActiveBorder, radioActiveForeground, radioInactiveBackground, radioInactiveBorder, radioInactiveForeground, radioInactiveHoverBackground, selectBackground, selectBorder, selectForeground, selectListBackground };
