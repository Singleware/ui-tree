"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var Template_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Template = void 0;
/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
const Class = require("@singleware/class");
const DOM = require("@singleware/jsx");
const Control = require("@singleware/ui-control");
const Node = require("../node");
/**
 * Tree template class.
 */
let Template = Template_1 = class Template extends Control.Component {
    /**
     * Default constructor.
     * @param properties Tree properties.
     */
    constructor(properties) {
        super(properties);
        /**
         * Tree states.
         */
        this.states = {
            nodes: [],
            selected: {}
        };
        /**
         * Dragging mirror callback.
         */
        this.draggingMirrorCallback = this.draggingMirrorHandler.bind(this);
        /**
         * Matched nodes.
         */
        this.matchedNodes = new WeakMap();
        /**
         * Mirror element to hide the default drag and drop image.
         */
        this.hiddenMirror = (DOM.create("div", { style: "position: absolute; height: 0px; width: 0px; left: 0px; top: 0px;" }));
        /**
         * Tree entries slot.
         */
        this.entrySlot = (DOM.create("slot", { name: "node", class: "node" }));
        /**
         * Tree styles.
         */
        this.styles = (DOM.create("style", null, `:host {
  display: flex;
  flex-direction: column;
  overflow: auto;
  width: 100%;
  height: 100%;
}
:host > .node::slotted(*) {
  display: flex;
  flex-direction: column;
  width: 100%;
}
:host > .node::slotted([data-mirror]) {
  position: absolute;
  pointer-events: none;
  opacity: 1;
}`));
        /**
         * Tree skeleton.
         */
        this.skeleton = (DOM.create("div", { slot: this.properties.slot, class: this.properties.class }, this.children));
        DOM.append(this.skeleton.attachShadow({ mode: 'closed' }), this.styles, this.entrySlot);
        this.bindHandlers();
        this.bindProperties();
        this.assignProperties();
    }
    /**
     * Gets the specified property state.
     * @param property Property name.
     * @returns Returns the current property state.
     */
    getPropertyState(property) {
        return this.skeleton.dataset[property] !== void 0;
    }
    /**
     * Sets the specified property state.
     * @param property Property name.
     * @param state Property state.
     */
    setPropertyState(property, state) {
        if (state) {
            this.skeleton.dataset[property] = 'on';
        }
        else {
            delete this.skeleton.dataset[property];
        }
    }
    /**
     * Updates the mirror node position based on the specified coordinates.
     * @param data Mirror data.
     * @param node Mirror element.
     * @param x X coordinate.
     * @param y Y coordinate.
     */
    updateMirrorPosition(data, node, x, y) {
        const detail = { data: data, x: x, y: y };
        const event = new CustomEvent('movenode', { bubbles: true, cancelable: false, detail: detail });
        if (this.skeleton.dispatchEvent(event)) {
            if (!isNaN(detail.x)) {
                node.style.left = `${detail.x}px`;
            }
            if (!isNaN(detail.y)) {
                node.style.top = `${detail.y}px`;
            }
        }
    }
    /**
     * Renders a new subtree.
     */
    renderTree() {
        const tree = new Template_1({ ...this.properties, slot: 'subtree' });
        tree.states.selected = this.states.selected;
        return tree.element;
    }
    /**
     * Renders a new node for the specified data.
     * @param data Node data.
     * @returns Returns the node element instance.
     */
    renderNode(data) {
        const tree = this.renderTree();
        const detail = { data: data, tree: tree };
        const event = new CustomEvent('rendernode', { bubbles: true, cancelable: true, detail: detail });
        let dragger, checker;
        if (!this.skeleton.dispatchEvent(event) || !detail.content) {
            detail.content = (DOM.create("div", null, data.toLocaleString()));
        }
        detail.content.slot = 'content';
        if ((dragger = detail.dragger)) {
            dragger.slot = 'dragger';
        }
        else {
            dragger = detail.content;
        }
        if ((checker = detail.checker)) {
            checker.slot = 'checker';
        }
        else {
            checker = detail.content;
        }
        if (detail.opener) {
            detail.opener.slot = 'opener';
        }
        const node = (DOM.create(Node.Template, { tree: detail.tree, readOnly: this.readOnly, draggable: this.draggable, disabled: this.disabled },
            detail.dragger,
            detail.checker,
            detail.opener,
            detail.content));
        dragger.addEventListener('dragstart', this.dragStartHandler.bind(this, data), true);
        dragger.addEventListener('dragend', this.dragEndHandler.bind(this), true);
        checker.addEventListener('click', this.selectHandler.bind(this, data), true);
        node.addEventListener('dragenter', this.dragEnterHandler.bind(this, data), true);
        node.addEventListener('dragover', this.dragOverHandler.bind(this), true);
        node.addEventListener('drop', this.dropHandler.bind(this), true);
        this.matchedNodes.set(data, node);
        return node;
    }
    /**
     * Renders a new mirror node for the specified data.
     * @param data Node data.
     * @returns Returns the mirror element instance.
     */
    renderMirror(data) {
        const detail = { data: data };
        const event = new CustomEvent('rendermirror', { bubbles: true, cancelable: true, detail: detail });
        if (!this.skeleton.dispatchEvent(event) || !detail.mirror) {
            detail.mirror = (DOM.create("div", null, data.toLocaleString()));
        }
        detail.mirror.slot = 'node';
        detail.mirror.draggable = false;
        detail.mirror.dataset.mirror = 'on';
        return detail.mirror;
    }
    /**
     * Select handler.
     * @param data Node data.
     */
    selectHandler(data) {
        if (this.selectable && !this.disabled && !this.readOnly) {
            const selection = this.states.selected;
            const different = selection.data !== data;
            if (selection.node) {
                selection.node.selected = false;
                selection.node = void 0;
                selection.data = void 0;
            }
            if (different) {
                selection.node = this.matchedNodes.get(data);
                selection.node.selected = true;
                selection.data = data;
            }
            if (this.properties.onSelect) {
                this.properties.onSelect();
            }
        }
    }
    /**
     * Drag start event handler.
     * @param data Node data.
     * @param event Event information.
     */
    dragStartHandler(data, event) {
        if (this.draggable && !this.disabled && !this.readOnly) {
            const mirror = this.renderMirror(data);
            if (event.dataTransfer) {
                DOM.append(this.skeleton, this.hiddenMirror);
                event.dataTransfer.setDragImage(this.hiddenMirror, 0, 0);
                event.dataTransfer.effectAllowed = 'move';
            }
            DOM.append(this.skeleton, (this.draggingMirror = mirror));
            document.addEventListener('dragover', this.draggingMirrorCallback, true);
            this.updateMirrorPosition(data, mirror, event.pageX, event.pageY);
            this.draggingData = data;
        }
    }
    /**
     * Drag end event handler.
     */
    dragEndHandler() {
        if (this.draggable && !this.disabled && !this.readOnly) {
            document.removeEventListener('dragover', this.draggingMirrorCallback, true);
            this.hiddenMirror.remove();
            this.draggingMirror.remove();
            this.draggingMirror = void 0;
            this.draggingData = void 0;
        }
    }
    /**
     * Drag enter event handler.
     * @param data Node data.
     * @param event Event information.
     */
    dragEnterHandler(data, event) {
        const newer = this.matchedNodes.get(data);
        if (this.draggingData && this.draggingData !== data) {
            const list = this.states.nodes;
            const source = list.splice(list.indexOf(this.draggingData), 1)[0];
            const current = this.matchedNodes.get(this.draggingData);
            if (newer.offsetTop + newer.offsetHeight / 2 <= event.pageY) {
                if (newer.previousSibling) {
                    list.splice(list.indexOf(data), 0, source);
                }
                else {
                    list.unshift(source);
                }
                this.skeleton.insertBefore(current, newer);
            }
            else {
                if (newer.nextSibling) {
                    list.splice(list.indexOf(data) + 1, 0, source);
                }
                else {
                    list.push(source);
                }
                this.skeleton.insertBefore(current, newer.nextSibling);
            }
        }
    }
    /**
     * Drag over event handler.
     * @param event Event information.
     */
    dragOverHandler(event) {
        if (this.draggable && !this.disabled && !this.readOnly) {
            event.preventDefault();
        }
    }
    /**
     * Drop event handler.
     * @param event Event information.
     */
    dropHandler(event) {
        if (this.draggable && !this.disabled && !this.readOnly) {
            this.skeleton.dispatchEvent(new Event('change', { bubbles: true, cancelable: false }));
            event.preventDefault();
        }
    }
    /**
     * Render node event handler.
     * @param event Event information.
     */
    renderNodeHandler(event) {
        this.properties.onRenderNode(event.detail);
    }
    /**
     * Render mirror event handler.
     * @param event Event information.
     */
    renderMirrorHandler(event) {
        if (this.properties.onRenderMirror) {
            this.properties.onRenderMirror(event.detail);
        }
    }
    /**
     * Dragging mirror event handler.
     * @param event Event information.
     */
    draggingMirrorHandler(event) {
        if (this.draggingMirror) {
            this.updateMirrorPosition(this.draggingData, this.draggingMirror, event.pageX, event.pageY);
        }
    }
    /**
     * Change node event handler.
     */
    changeNodeHandler() {
        if (this.properties.onChange) {
            this.properties.onChange();
        }
    }
    /**
     * Bind all element handlers.
     */
    bindHandlers() {
        this.skeleton.addEventListener('rendernode', this.renderNodeHandler.bind(this));
        this.skeleton.addEventListener('rendermirror', this.renderMirrorHandler.bind(this));
        this.skeleton.addEventListener('change', this.changeNodeHandler.bind(this));
    }
    /**
     * Bind exposed properties to the custom element.
     */
    bindProperties() {
        this.bindComponentProperties(this.skeleton, [
            'name',
            'value',
            'defaultValue',
            'length',
            'empty',
            'required',
            'readOnly',
            'disabled',
            'draggable',
            'selectable',
            'addNode',
            'insertNode',
            'removeNode',
            'checkValidity',
            'reportValidity',
            'reset',
            'clear'
        ]);
    }
    /**
     * Assign all elements properties.
     */
    assignProperties() {
        this.assignComponentProperties(this.properties, [
            'name',
            'value',
            'required',
            'readOnly',
            'disabled',
            'draggable',
            'selectable'
        ]);
    }
    /**
     * Gets the tree values.
     */
    get value() {
        return this.selectable ? this.states.selected.data : this.states.nodes.slice();
    }
    /**
     * Sets the tree values.
     */
    set value(value) {
        if (this.selectable) {
            const node = this.matchedNodes.get(value);
            if (node) {
                this.selectHandler(value);
            }
        }
        else {
            this.clear();
            for (const node of value) {
                this.addNode(node);
            }
        }
    }
    /**
     * Gets the default value.
     */
    get defaultValue() {
        return this.properties.value || [];
    }
    /**
     * Gets the tree level length.
     */
    get length() {
        return this.states.nodes.length;
    }
    /**
     * Gets the empty state.
     */
    get empty() {
        return this.length === 0;
    }
    /**
     * Gets the required state.
     */
    get required() {
        return this.getPropertyState('required');
    }
    /**
     * Sets the required state.
     */
    set required(state) {
        this.setPropertyState('required', state);
        Control.setChildrenProperty(this.entrySlot, 'required', state);
    }
    /**
     * Gets the read-only state.
     */
    get readOnly() {
        return this.getPropertyState('readOnly');
    }
    /**
     * Sets the read-only state.
     */
    set readOnly(state) {
        this.setPropertyState('readOnly', state);
        Control.setChildrenProperty(this.entrySlot, 'readOnly', state);
    }
    /**
     * Gets the disabled state.
     */
    get disabled() {
        return this.getPropertyState('disabled');
    }
    /**
     * Sets the disabled state.
     */
    set disabled(state) {
        this.setPropertyState('disabled', state);
        Control.setChildrenProperty(this.entrySlot, 'disabled', state);
    }
    /**
     * Gets the draggable state.
     */
    get draggable() {
        return this.getPropertyState('draggable');
    }
    /**
     * Sets the draggable state.
     */
    set draggable(state) {
        this.setPropertyState('draggable', state);
        Control.setChildrenProperty(this.entrySlot, 'draggable', state);
    }
    /**
     * Gets the selectable state.
     */
    get selectable() {
        return this.getPropertyState('selectable');
    }
    /**
     * Sets the selectable state.
     */
    set selectable(state) {
        this.setPropertyState('selectable', state);
        Control.setChildrenProperty(this.entrySlot, 'selectable', state);
    }
    /**
     * Gets the tree element.
     */
    get element() {
        return this.skeleton;
    }
    /**
     * Adds a new node into the tree.
     * @param data Node data.
     * @returns Returns the node element instance.
     */
    addNode(data) {
        const node = this.renderNode(data);
        this.states.nodes.push(data);
        DOM.append(this.skeleton, node);
        return node;
    }
    /**
     * Inserts a new node at the specified index in the tree.
     * @param data Node data.
     * @param index Node index.
     * @returns Returns the node element instance.
     */
    insertNode(data, index) {
        const previous = this.states.nodes[index];
        if (!previous) {
            throw new Error(`There is no none at the specified index.`);
        }
        const node = this.renderNode(data);
        this.states.nodes.splice(index + 1, 0, data);
        this.skeleton.insertBefore(node, this.matchedNodes.get(previous).nextSibling);
        return node;
    }
    /**
     * Removes the node that corresponds to the specified index from the tree.
     * @param index Node index.
     * @returns Returns true when the node was removed, false otherwise.
     */
    removeNode(index) {
        const node = this.matchedNodes.get(this.states.nodes[index]);
        if (node) {
            this.states.nodes.splice(index, 1);
            return node.remove(), true;
        }
        return false;
    }
    /**
     * Checks the tree validity.
     * @returns Returns true when the tree is valid, false otherwise.
     */
    checkValidity() {
        return ((!this.required || !this.empty) &&
            Control.listChildrenByProperty(this.entrySlot, 'checkValidity', (node) => {
                return node.checkValidity() ? void 0 : false;
            }));
    }
    /**
     * Reports the tree validity.
     * @returns Returns true when the tree is valid, false otherwise.
     */
    reportValidity() {
        return ((!this.required || !this.empty) &&
            Control.listChildrenByProperty(this.entrySlot, 'reportValidity', (node) => {
                return node.reportValidity() ? void 0 : false;
            }));
    }
    /**
     * Resets the tree to its initial values.
     */
    reset() {
        if (this.properties.value) {
            this.value = this.properties.value;
        }
        else {
            this.clear();
        }
    }
    /**
     * Clear all tree nodes and sub trees.
     */
    clear() {
        this.states.nodes = [];
        this.states.selected.node = void 0;
        this.states.selected.data = void 0;
        DOM.clear(this.skeleton);
    }
};
__decorate([
    Class.Protected()
], Template.prototype, "states", void 0);
__decorate([
    Class.Private()
], Template.prototype, "draggingData", void 0);
__decorate([
    Class.Private()
], Template.prototype, "draggingMirror", void 0);
__decorate([
    Class.Private()
], Template.prototype, "draggingMirrorCallback", void 0);
__decorate([
    Class.Private()
], Template.prototype, "matchedNodes", void 0);
__decorate([
    Class.Private()
], Template.prototype, "hiddenMirror", void 0);
__decorate([
    Class.Private()
], Template.prototype, "entrySlot", void 0);
__decorate([
    Class.Private()
], Template.prototype, "styles", void 0);
__decorate([
    Class.Private()
], Template.prototype, "skeleton", void 0);
__decorate([
    Class.Private()
], Template.prototype, "getPropertyState", null);
__decorate([
    Class.Private()
], Template.prototype, "setPropertyState", null);
__decorate([
    Class.Private()
], Template.prototype, "updateMirrorPosition", null);
__decorate([
    Class.Private()
], Template.prototype, "renderTree", null);
__decorate([
    Class.Private()
], Template.prototype, "renderNode", null);
__decorate([
    Class.Private()
], Template.prototype, "renderMirror", null);
__decorate([
    Class.Private()
], Template.prototype, "selectHandler", null);
__decorate([
    Class.Private()
], Template.prototype, "dragStartHandler", null);
__decorate([
    Class.Private()
], Template.prototype, "dragEndHandler", null);
__decorate([
    Class.Private()
], Template.prototype, "dragEnterHandler", null);
__decorate([
    Class.Private()
], Template.prototype, "dragOverHandler", null);
__decorate([
    Class.Private()
], Template.prototype, "dropHandler", null);
__decorate([
    Class.Private()
], Template.prototype, "renderNodeHandler", null);
__decorate([
    Class.Private()
], Template.prototype, "renderMirrorHandler", null);
__decorate([
    Class.Private()
], Template.prototype, "draggingMirrorHandler", null);
__decorate([
    Class.Private()
], Template.prototype, "changeNodeHandler", null);
__decorate([
    Class.Private()
], Template.prototype, "bindHandlers", null);
__decorate([
    Class.Private()
], Template.prototype, "bindProperties", null);
__decorate([
    Class.Private()
], Template.prototype, "assignProperties", null);
__decorate([
    Class.Public()
], Template.prototype, "name", void 0);
__decorate([
    Class.Public()
], Template.prototype, "value", null);
__decorate([
    Class.Public()
], Template.prototype, "defaultValue", null);
__decorate([
    Class.Public()
], Template.prototype, "length", null);
__decorate([
    Class.Public()
], Template.prototype, "empty", null);
__decorate([
    Class.Public()
], Template.prototype, "required", null);
__decorate([
    Class.Public()
], Template.prototype, "readOnly", null);
__decorate([
    Class.Public()
], Template.prototype, "disabled", null);
__decorate([
    Class.Public()
], Template.prototype, "draggable", null);
__decorate([
    Class.Public()
], Template.prototype, "selectable", null);
__decorate([
    Class.Public()
], Template.prototype, "element", null);
__decorate([
    Class.Public()
], Template.prototype, "addNode", null);
__decorate([
    Class.Public()
], Template.prototype, "insertNode", null);
__decorate([
    Class.Public()
], Template.prototype, "removeNode", null);
__decorate([
    Class.Public()
], Template.prototype, "checkValidity", null);
__decorate([
    Class.Public()
], Template.prototype, "reportValidity", null);
__decorate([
    Class.Public()
], Template.prototype, "reset", null);
__decorate([
    Class.Public()
], Template.prototype, "clear", null);
Template = Template_1 = __decorate([
    Class.Describe()
], Template);
exports.Template = Template;
