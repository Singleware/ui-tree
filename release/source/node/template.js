"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Template = void 0;
/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
const Class = require("@singleware/class");
const DOM = require("@singleware/jsx");
const Control = require("@singleware/ui-control");
/**
 * Node template class.
 */
let Template = class Template extends Control.Component {
    /**
     * Default constructor.
     * @param properties Node properties.
     * @param children Node children.
     */
    constructor(properties, children) {
        super(properties, children);
        /**
         * Dragger slot element.
         */
        this.draggerSlot = DOM.create("slot", { name: "dragger", class: "dragger" });
        /**
         * Checker slot element.
         */
        this.checkerSlot = DOM.create("slot", { name: "checker", class: "checker" });
        /**
         * Opener slot element.
         */
        this.openerSlot = DOM.create("slot", { name: "opener", class: "opener" });
        /**
         * Content slot element.
         */
        this.contentSlot = DOM.create("slot", { name: "content", class: "content" });
        /**
         * Subtree slot element.
         */
        this.subtreeSlot = DOM.create("slot", { name: "subtree", class: "subtree" });
        /**
         * Entry element.
         */
        this.entry = DOM.create("div", { class: "entry" });
        /**
         * Subtree element.
         */
        this.subtree = this.properties.tree;
        /**
         * Node styles.
         */
        this.styles = (DOM.create("style", null, `:host {
  width: 100%;
}
:host > .entry {
  display: flex;
  flex-direction: row;
  align-items: center;
}
:host > .entry > .dragger,
:host > .entry > .checker,
:host > .entry > .opener {
  flex-shrink: 0;
  flex-grow: 0;
}
:host([data-draggable]:not([data-disabled])) > .entry > .dragger::slotted([draggable]),
:host([data-draggable]:not([data-disabled])) > .entry > .content::slotted([draggable]) {
  cursor: move;
  cursor: grab;
}
:host([data-dragging]) > .entry > .dragger::slotted([draggable]),
:host([data-dragging]) > .entry > .content::slotted([draggable]) {
  cursor: move;
  cursor: grabbing;
}
:host([data-draggable]:not([data-disabled])) > .entry > .checker::slotted(*),
:host(*:not([data-disabled])) > .entry > .opener::slotted(*) {
  cursor: pointer;
}
:host > .entry > .content::slotted(*) {
  width: 100%;
}`));
        /**
         * Node skeleton.
         */
        this.skeleton = DOM.create("div", { slot: "node" }, this.children);
        DOM.append(this.skeleton.attachShadow({ mode: 'closed' }), this.styles, this.entry, this.subtreeSlot);
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
     * Update all activated slots with their respective properties.
     */
    updateActiveProperties() {
        if (this.draggable) {
            const slot = this.draggerSlot.assignedNodes().length ? this.draggerSlot : this.contentSlot;
            Control.setChildProperty(slot, 'draggable', this.draggable);
        }
        this.setPropertyState('leaf', this.subtree.empty);
    }
    /**
     * Updates the node with the current active slots.
     */
    updateActiveSlots() {
        DOM.clear(this.entry);
        if (this.draggable) {
            DOM.append(this.entry, this.draggerSlot);
        }
        if (this.selectable) {
            DOM.append(this.entry, this.checkerSlot);
        }
        if (!this.subtree.empty) {
            DOM.append(this.entry, this.openerSlot);
        }
        DOM.append(this.entry, this.contentSlot);
        this.updateActiveProperties();
    }
    /**
     * Drag start event handler.
     */
    dragStartHandler() {
        if (this.draggable && !this.disabled && !this.readOnly) {
            this.setPropertyState('dragging', true);
        }
    }
    /**
     * Drag end event handler.
     */
    dragEndHandler() {
        this.setPropertyState('dragging', false);
    }
    /**
     * Select event handler.
     */
    selectHandler() {
        if (this.selectable && !this.disabled && !this.readOnly) {
            this.selected = !this.selected;
        }
    }
    /**
     * Expand event handler.
     */
    expandHandler() {
        this.expanded = !this.expanded;
    }
    /**
     * Drag start by content event handler.
     */
    dragStartContentHandler() {
        if (!this.draggerSlot.assignedNodes().length) {
            this.dragStartHandler();
        }
    }
    /**
     * Drag end by content event handler.
     */
    dragEndContentHandler() {
        if (!this.draggerSlot.assignedNodes().length) {
            this.dragEndHandler();
        }
    }
    /**
     * Select by content event handler.
     */
    selectContentHandler() {
        if (!this.checkerSlot.assignedNodes().length) {
            this.selectHandler();
        }
    }
    /**
     * Bind all element handlers.
     */
    bindHandlers() {
        this.draggerSlot.addEventListener('dragstart', this.dragStartHandler.bind(this), true);
        this.draggerSlot.addEventListener('dragend', this.dragEndHandler.bind(this), true);
        this.checkerSlot.addEventListener('click', this.selectHandler.bind(this), true);
        this.openerSlot.addEventListener('click', this.expandHandler.bind(this), true);
        this.contentSlot.addEventListener('dragstart', this.dragStartContentHandler.bind(this), true);
        this.contentSlot.addEventListener('dragend', this.dragEndContentHandler.bind(this), true);
        this.contentSlot.addEventListener('click', this.selectContentHandler.bind(this), true);
    }
    /**
     * Bind exposed properties to the custom element.
     */
    bindProperties() {
        this.bindComponentProperties(this.skeleton, [
            'expanded',
            'selected',
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
            'clear'
        ]);
    }
    /**
     * Assign all elements properties.
     */
    assignProperties() {
        this.assignComponentProperties(this.properties, ['value', 'required', 'readOnly', 'disabled', 'draggable', 'selectable']);
    }
    /**
     * Gets the expanded state.
     */
    get expanded() {
        return this.getPropertyState('expanded');
    }
    /**
     * Sets the expanded state.
     */
    set expanded(state) {
        this.setPropertyState('expanded', state);
        if (state) {
            DOM.append(this.skeleton, this.subtree);
        }
        else {
            this.subtree.remove();
        }
    }
    /**
     * Gets the selected state.
     */
    get selected() {
        return this.getPropertyState('selected');
    }
    /**
     * Sets the selected state.
     */
    set selected(state) {
        this.setPropertyState('selected', state);
        Control.setChildProperty(this.checkerSlot, 'checked', state);
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
        this.subtree.required = state;
        this.setPropertyState('required', state);
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
        this.subtree.readOnly = state;
        this.setPropertyState('readOnly', state);
        Control.setChildProperty(this.checkerSlot, 'readOnly', state);
        Control.setChildProperty(this.contentSlot, 'readOnly', state);
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
        this.subtree.disabled = state;
        this.setPropertyState('disabled', state);
        Control.setChildProperty(this.checkerSlot, 'disabled', state);
        Control.setChildProperty(this.contentSlot, 'disabled', state);
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
        this.subtree.draggable = state;
        this.setPropertyState('draggable', state);
        this.updateActiveSlots();
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
        this.subtree.selectable = state;
        this.setPropertyState('selectable', state);
    }
    /**
     * Gets the node element.
     */
    get element() {
        return this.skeleton;
    }
    /**
     * Adds a new node into the subtree of this node.
     * @param data Node data.
     * @returns Returns the instance of the subtree element.
     */
    addNode(data) {
        const node = this.subtree.addNode(data);
        return this.updateActiveSlots(), node;
    }
    /**
     * Inserts a new node at the specified index into the subtree of this node.
     * @param data Node data.
     * @param index Node index.
     * @returns Returns the instance of the subtree element.
     */
    insertNode(data, index) {
        const node = this.subtree.insertNode(data, index);
        return this.updateActiveSlots(), node;
    }
    /**
     * Removes the node that corresponds to the specified index from the subtree of this node.
     * @param index Node index.
     * @returns Returns true when the node was removed, false otherwise.
     */
    removeNode(index) {
        const state = this.subtree.removeNode(index);
        return this.updateActiveSlots(), state;
    }
    /**
     * Checks the tree node validity.
     * @returns Returns true when the node is valid, false otherwise.
     */
    checkValidity() {
        return Control.getChildByProperty(this.contentSlot, 'checkValidity').checkValidity() && this.subtree.checkValidity();
    }
    /**
     * Reports the tree node validity.
     * @returns Returns true when the node is valid, false otherwise.
     */
    reportValidity() {
        return Control.getChildByProperty(this.contentSlot, 'reportValidity').reportValidity() && this.subtree.reportValidity();
    }
    /**
     * Clear the subtree of this node.
     */
    clear() {
        this.subtree.clear();
    }
};
__decorate([
    Class.Private()
], Template.prototype, "draggerSlot", void 0);
__decorate([
    Class.Private()
], Template.prototype, "checkerSlot", void 0);
__decorate([
    Class.Private()
], Template.prototype, "openerSlot", void 0);
__decorate([
    Class.Private()
], Template.prototype, "contentSlot", void 0);
__decorate([
    Class.Private()
], Template.prototype, "subtreeSlot", void 0);
__decorate([
    Class.Private()
], Template.prototype, "entry", void 0);
__decorate([
    Class.Private()
], Template.prototype, "subtree", void 0);
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
], Template.prototype, "updateActiveProperties", null);
__decorate([
    Class.Private()
], Template.prototype, "updateActiveSlots", null);
__decorate([
    Class.Private()
], Template.prototype, "dragStartHandler", null);
__decorate([
    Class.Private()
], Template.prototype, "dragEndHandler", null);
__decorate([
    Class.Private()
], Template.prototype, "selectHandler", null);
__decorate([
    Class.Private()
], Template.prototype, "expandHandler", null);
__decorate([
    Class.Private()
], Template.prototype, "dragStartContentHandler", null);
__decorate([
    Class.Private()
], Template.prototype, "dragEndContentHandler", null);
__decorate([
    Class.Private()
], Template.prototype, "selectContentHandler", null);
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
], Template.prototype, "expanded", null);
__decorate([
    Class.Public()
], Template.prototype, "selected", null);
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
], Template.prototype, "clear", null);
Template = __decorate([
    Class.Describe()
], Template);
exports.Template = Template;
