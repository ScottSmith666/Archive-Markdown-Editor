import { isMacintosh, isLinux, isWindows, isWeb, isIOS, isMobile } from '../../../base/common/platform.js';
import { localize } from '../../../nls.js';
import { RawContextKey } from './contextkey.js';

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
new RawContextKey('isMac', isMacintosh, localize(1703, "Whether the operating system is macOS"));
new RawContextKey('isLinux', isLinux, localize(1704, "Whether the operating system is Linux"));
const IsWindowsContext = new RawContextKey('isWindows', isWindows, localize(1705, "Whether the operating system is Windows"));
const IsWebContext = new RawContextKey('isWeb', isWeb, localize(1706, "Whether the platform is a web browser"));
new RawContextKey('isMacNative', isMacintosh && !isWeb, localize(1707, "Whether the operating system is macOS on a non-browser platform"));
new RawContextKey('isIOS', isIOS, localize(1708, "Whether the operating system is iOS"));
new RawContextKey('isMobile', isMobile, localize(1709, "Whether the platform is a mobile web browser"));
new RawContextKey('isDevelopment', false, true);
new RawContextKey('productQualityType', '', localize(1710, "Quality type of VS Code"));
const InputFocusedContextKey = 'inputFocus';
const InputFocusedContext = new RawContextKey(InputFocusedContextKey, false, localize(1711, "Whether keyboard focus is inside an input box"));

export { InputFocusedContext, InputFocusedContextKey, IsWebContext, IsWindowsContext };
