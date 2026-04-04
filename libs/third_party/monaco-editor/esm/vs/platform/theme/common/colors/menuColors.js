import { localize } from '../../../../nls.js';
import { registerColor } from '../colorUtils.js';
import { contrastBorder, activeContrastBorder } from './baseColors.js';
import { selectForeground, selectBackground } from './inputColors.js';
import { listActiveSelectionForeground, listActiveSelectionBackground } from './listColors.js';

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
const menuBorder = registerColor('menu.border', { dark: null, light: null, hcDark: contrastBorder, hcLight: contrastBorder }, localize(2000, "Border color of menus."));
const menuForeground = registerColor('menu.foreground', selectForeground, localize(2001, "Foreground color of menu items."));
const menuBackground = registerColor('menu.background', selectBackground, localize(2002, "Background color of menu items."));
const menuSelectionForeground = registerColor('menu.selectionForeground', listActiveSelectionForeground, localize(2003, "Foreground color of the selected menu item in menus."));
const menuSelectionBackground = registerColor('menu.selectionBackground', listActiveSelectionBackground, localize(2004, "Background color of the selected menu item in menus."));
const menuSelectionBorder = registerColor('menu.selectionBorder', { dark: null, light: null, hcDark: activeContrastBorder, hcLight: activeContrastBorder }, localize(2005, "Border color of the selected menu item in menus."));
const menuSeparatorBackground = registerColor('menu.separatorBackground', { dark: '#606060', light: '#D4D4D4', hcDark: contrastBorder, hcLight: contrastBorder }, localize(2006, "Color of a separator menu item in menus."));

export { menuBackground, menuBorder, menuForeground, menuSelectionBackground, menuSelectionBorder, menuSelectionForeground, menuSeparatorBackground };
