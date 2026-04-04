import { setVisibility, clearNode, getWindow, isHTMLElement } from '../../../base/browser/dom.js';
import { ActionBar } from '../../../base/browser/ui/actionbar/actionbar.js';
import { KeybindingLabel } from '../../../base/browser/ui/keybindingLabel/keybindingLabel.js';
import { List } from '../../../base/browser/ui/list/listWidget.js';
import { CancellationTokenSource } from '../../../base/common/cancellation.js';
import { Codicon } from '../../../base/common/codicons.js';
import { DisposableStore, Disposable, MutableDisposable } from '../../../base/common/lifecycle.js';
import { OS } from '../../../base/common/platform.js';
import { ThemeIcon } from '../../../base/common/themables.js';
import './actionWidget.css';
import { localize } from '../../../nls.js';
import { IContextViewService } from '../../contextview/browser/contextView.js';
import { IKeybindingService } from '../../keybinding/common/keybinding.js';
import { defaultListStyles } from '../../theme/browser/defaultStyles.js';
import { asCssVariable } from '../../theme/common/colorUtils.js';
import '../../theme/common/colors/baseColors.js';
import '../../theme/common/colors/chartsColors.js';
import '../../theme/common/colors/editorColors.js';
import '../../theme/common/colors/inputColors.js';
import '../../theme/common/colors/listColors.js';
import '../../theme/common/colors/menuColors.js';
import '../../theme/common/colors/minimapColors.js';
import '../../theme/common/colors/miscColors.js';
import '../../theme/common/colors/quickpickColors.js';
import '../../theme/common/colors/searchColors.js';
import { ILayoutService } from '../../layout/browser/layoutService.js';
import { IHoverService } from '../../hover/browser/hover.js';
import { MarkdownString } from '../../../base/common/htmlContent.js';

var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
const acceptSelectedActionCommand = 'acceptSelectedCodeAction';
const previewSelectedActionCommand = 'previewSelectedCodeAction';
class HeaderRenderer {
    get templateId() { return "header" /* ActionListItemKind.Header */; }
    renderTemplate(container) {
        container.classList.add('group-header');
        const text = document.createElement('span');
        container.append(text);
        return { container, text };
    }
    renderElement(element, _index, templateData) {
        templateData.text.textContent = element.group?.title ?? element.label ?? '';
    }
    disposeTemplate(_templateData) {
        // noop
    }
}
class SeparatorRenderer {
    get templateId() { return "separator" /* ActionListItemKind.Separator */; }
    renderTemplate(container) {
        container.classList.add('separator');
        const text = document.createElement('span');
        container.append(text);
        return { container, text };
    }
    renderElement(element, _index, templateData) {
        templateData.text.textContent = element.label ?? '';
    }
    disposeTemplate(_templateData) {
        // noop
    }
}
let ActionItemRenderer = class ActionItemRenderer {
    get templateId() { return "action" /* ActionListItemKind.Action */; }
    constructor(_supportsPreview, _keybindingService) {
        this._supportsPreview = _supportsPreview;
        this._keybindingService = _keybindingService;
    }
    renderTemplate(container) {
        container.classList.add(this.templateId);
        const icon = document.createElement('div');
        icon.className = 'icon';
        container.append(icon);
        const text = document.createElement('span');
        text.className = 'title';
        container.append(text);
        const description = document.createElement('span');
        description.className = 'description';
        container.append(description);
        const keybinding = new KeybindingLabel(container, OS);
        const toolbar = document.createElement('div');
        toolbar.className = 'action-list-item-toolbar';
        container.append(toolbar);
        const elementDisposables = new DisposableStore();
        return { container, icon, text, description, keybinding, toolbar, elementDisposables };
    }
    renderElement(element, _index, data) {
        // Clear previous element disposables
        data.elementDisposables.clear();
        if (element.group?.icon) {
            data.icon.className = ThemeIcon.asClassName(element.group.icon);
            if (element.group.icon.color) {
                data.icon.style.color = asCssVariable(element.group.icon.color.id);
            }
        }
        else {
            data.icon.className = ThemeIcon.asClassName(Codicon.lightBulb);
            data.icon.style.color = 'var(--vscode-editorLightBulb-foreground)';
        }
        if (!element.item || !element.label) {
            return;
        }
        setVisibility(!element.hideIcon, data.icon);
        data.text.textContent = stripNewlines(element.label);
        // if there is a keybinding, prioritize over description for now
        if (element.keybinding) {
            data.description.textContent = element.keybinding.getLabel();
            data.description.style.display = 'inline';
            data.description.style.letterSpacing = '0.5px';
        }
        else if (element.description) {
            data.description.textContent = stripNewlines(element.description);
            data.description.style.display = 'inline';
        }
        else {
            data.description.textContent = '';
            data.description.style.display = 'none';
        }
        const actionTitle = this._keybindingService.lookupKeybinding(acceptSelectedActionCommand)?.getLabel();
        const previewTitle = this._keybindingService.lookupKeybinding(previewSelectedActionCommand)?.getLabel();
        data.container.classList.toggle('option-disabled', element.disabled);
        if (element.hover !== undefined) {
            // Don't show tooltip when hover content is configured - the rich hover will show instead
            data.container.title = '';
        }
        else if (element.tooltip) {
            data.container.title = element.tooltip;
        }
        else if (element.disabled) {
            data.container.title = element.label;
        }
        else if (actionTitle && previewTitle) {
            if (this._supportsPreview && element.canPreview) {
                data.container.title = localize(1672, "{0} to Apply, {1} to Preview", actionTitle, previewTitle);
            }
            else {
                data.container.title = localize(1673, "{0} to Apply", actionTitle);
            }
        }
        else {
            data.container.title = '';
        }
        // Clear and render toolbar actions
        clearNode(data.toolbar);
        data.container.classList.toggle('has-toolbar', !!element.toolbarActions?.length);
        if (element.toolbarActions?.length) {
            const actionBar = new ActionBar(data.toolbar);
            data.elementDisposables.add(actionBar);
            actionBar.push(element.toolbarActions, { icon: true, label: false });
        }
    }
    disposeTemplate(templateData) {
        templateData.keybinding.dispose();
        templateData.elementDisposables.dispose();
    }
};
ActionItemRenderer = __decorate([
    __param(1, IKeybindingService)
], ActionItemRenderer);
class AcceptSelectedEvent extends UIEvent {
    constructor() { super('acceptSelectedAction'); }
}
class PreviewSelectedEvent extends UIEvent {
    constructor() { super('previewSelectedAction'); }
}
function getKeyboardNavigationLabel(item) {
    // Filter out header vs. action vs. separator
    if (item.kind === 'action') {
        return item.label;
    }
    return undefined;
}
let ActionList = class ActionList extends Disposable {
    constructor(user, preview, items, _delegate, accessibilityProvider, _contextViewService, _keybindingService, _layoutService, _hoverService) {
        super();
        this._delegate = _delegate;
        this._contextViewService = _contextViewService;
        this._keybindingService = _keybindingService;
        this._layoutService = _layoutService;
        this._hoverService = _hoverService;
        this._actionLineHeight = 28;
        this._headerLineHeight = 28;
        this._separatorLineHeight = 8;
        this.cts = this._register(new CancellationTokenSource());
        this._hover = this._register(new MutableDisposable());
        this.domNode = document.createElement('div');
        this.domNode.classList.add('actionList');
        const virtualDelegate = {
            getHeight: element => {
                switch (element.kind) {
                    case "header" /* ActionListItemKind.Header */:
                        return this._headerLineHeight;
                    case "separator" /* ActionListItemKind.Separator */:
                        return this._separatorLineHeight;
                    default:
                        return this._actionLineHeight;
                }
            },
            getTemplateId: element => element.kind
        };
        this._list = this._register(new List(user, this.domNode, virtualDelegate, [
            new ActionItemRenderer(preview, this._keybindingService),
            new HeaderRenderer(),
            new SeparatorRenderer(),
        ], {
            keyboardSupport: false,
            typeNavigationEnabled: true,
            keyboardNavigationLabelProvider: { getKeyboardNavigationLabel },
            accessibilityProvider: {
                getAriaLabel: element => {
                    if (element.kind === "action" /* ActionListItemKind.Action */) {
                        let label = element.label ? stripNewlines(element?.label) : '';
                        if (element.description) {
                            label = label + ', ' + stripNewlines(element.description);
                        }
                        if (element.disabled) {
                            label = localize(1674, "{0}, Disabled Reason: {1}", label, element.disabled);
                        }
                        return label;
                    }
                    return null;
                },
                getWidgetAriaLabel: () => localize(1675, "Action Widget"),
                getRole: (e) => {
                    switch (e.kind) {
                        case "action" /* ActionListItemKind.Action */:
                            return 'option';
                        case "separator" /* ActionListItemKind.Separator */:
                            return 'separator';
                        default:
                            return 'separator';
                    }
                },
                getWidgetRole: () => 'listbox',
                ...accessibilityProvider
            },
        }));
        this._list.style(defaultListStyles);
        this._register(this._list.onMouseClick(e => this.onListClick(e)));
        this._register(this._list.onMouseOver(e => this.onListHover(e)));
        this._register(this._list.onDidChangeFocus(() => this.onFocus()));
        this._register(this._list.onDidChangeSelection(e => this.onListSelection(e)));
        this._allMenuItems = items;
        this._list.splice(0, this._list.length, this._allMenuItems);
        if (this._list.length) {
            this.focusNext();
        }
    }
    focusCondition(element) {
        return !element.disabled && element.kind === "action" /* ActionListItemKind.Action */;
    }
    hide(didCancel) {
        this._delegate.onHide(didCancel);
        this.cts.cancel();
        this._hover.clear();
        this._contextViewService.hideContextView();
    }
    layout(minWidth) {
        // Updating list height, depending on how many separators and headers there are.
        const numHeaders = this._allMenuItems.filter(item => item.kind === 'header').length;
        const numSeparators = this._allMenuItems.filter(item => item.kind === 'separator').length;
        const itemsHeight = this._allMenuItems.length * this._actionLineHeight;
        const heightWithHeaders = itemsHeight + numHeaders * this._headerLineHeight - numHeaders * this._actionLineHeight;
        const heightWithSeparators = heightWithHeaders + numSeparators * this._separatorLineHeight - numSeparators * this._actionLineHeight;
        this._list.layout(heightWithSeparators);
        let maxWidth = minWidth;
        if (this._allMenuItems.length >= 50) {
            maxWidth = 380;
        }
        else {
            // For finding width dynamically (not using resize observer)
            const itemWidths = this._allMenuItems.map((_, index) => {
                const element = this._getRowElement(index);
                if (element) {
                    element.style.width = 'auto';
                    const width = element.getBoundingClientRect().width;
                    element.style.width = '';
                    return width;
                }
                return 0;
            });
            // resize observer - can be used in the future since list widget supports dynamic height but not width
            maxWidth = Math.max(...itemWidths, minWidth);
        }
        const maxVhPrecentage = 0.7;
        const height = Math.min(heightWithSeparators, this._layoutService.getContainer(getWindow(this.domNode)).clientHeight * maxVhPrecentage);
        this._list.layout(height, maxWidth);
        this.domNode.style.height = `${height}px`;
        this._list.domFocus();
        return maxWidth;
    }
    focusPrevious() {
        this._list.focusPrevious(1, true, undefined, this.focusCondition);
    }
    focusNext() {
        this._list.focusNext(1, true, undefined, this.focusCondition);
    }
    acceptSelected(preview) {
        const focused = this._list.getFocus();
        if (focused.length === 0) {
            return;
        }
        const focusIndex = focused[0];
        const element = this._list.element(focusIndex);
        if (!this.focusCondition(element)) {
            return;
        }
        const event = preview ? new PreviewSelectedEvent() : new AcceptSelectedEvent();
        this._list.setSelection([focusIndex], event);
    }
    onListSelection(e) {
        if (!e.elements.length) {
            return;
        }
        const element = e.elements[0];
        if (element.item && this.focusCondition(element)) {
            this._delegate.onSelect(element.item, e.browserEvent instanceof PreviewSelectedEvent);
        }
        else {
            this._list.setSelection([]);
        }
    }
    onFocus() {
        const focused = this._list.getFocus();
        if (focused.length === 0) {
            return;
        }
        const focusIndex = focused[0];
        const element = this._list.element(focusIndex);
        this._delegate.onFocus?.(element.item);
        // Show hover on focus change
        this._showHoverForElement(element, focusIndex);
    }
    _getRowElement(index) {
        // eslint-disable-next-line no-restricted-syntax
        return this.domNode.ownerDocument.getElementById(this._list.getElementID(index));
    }
    _showHoverForElement(element, index) {
        let newHover;
        // Show hover if the element has hover content
        if (element.hover?.content && this.focusCondition(element)) {
            // The List widget separates data models from DOM elements, so we need to
            // look up the actual DOM node to use as the hover target.
            const rowElement = this._getRowElement(index);
            if (rowElement) {
                const markdown = element.hover.content ? new MarkdownString(element.hover.content) : undefined;
                newHover = this._hoverService.showDelayedHover({
                    content: markdown ?? '',
                    target: rowElement,
                    additionalClasses: ['action-widget-hover'],
                    position: {
                        hoverPosition: 0 /* HoverPosition.LEFT */,
                        forcePosition: false,
                        ...element.hover.position,
                    },
                    appearance: {
                        showPointer: true,
                    },
                }, { groupId: `actionListHover` });
            }
        }
        this._hover.value = newHover;
    }
    async onListHover(e) {
        const element = e.element;
        if (element && element.item && this.focusCondition(element)) {
            // Check if the hover target is inside a toolbar - if so, skip the splice
            // to avoid re-rendering which would destroy the toolbar mid-hover
            const isHoveringToolbar = isHTMLElement(e.browserEvent.target) && e.browserEvent.target.closest('.action-list-item-toolbar') !== null;
            if (isHoveringToolbar) {
                this._list.setFocus([]);
                return;
            }
            if (this._delegate.onHover && !element.disabled && element.kind === "action" /* ActionListItemKind.Action */) {
                const result = await this._delegate.onHover(element.item, this.cts.token);
                element.canPreview = result ? result.canPreview : undefined;
            }
            if (e.index) {
                this._list.splice(e.index, 1, [element]);
            }
            this._list.setFocus(typeof e.index === 'number' ? [e.index] : []);
        }
    }
    onListClick(e) {
        if (e.element && this.focusCondition(e.element)) {
            this._list.setFocus([]);
        }
    }
};
ActionList = __decorate([
    __param(5, IContextViewService),
    __param(6, IKeybindingService),
    __param(7, ILayoutService),
    __param(8, IHoverService)
], ActionList);
function stripNewlines(str) {
    return str.replace(/\r\n|\r|\n/g, ' ');
}

export { ActionList, acceptSelectedActionCommand, previewSelectedActionCommand };
