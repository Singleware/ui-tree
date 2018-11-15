/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Class from '@singleware/class';
import * as DOM from '@singleware/jsx';
import * as Control from '@singleware/ui-control';

import { Properties } from './properties';
import { Element } from './element';

/**
 * Node template class.
 */
@Class.Describe()
export class Template<T extends Properties = Properties> extends Control.Component<T> {
  /**
   * Dragger slot element.
   */
  @Class.Private()
  private draggerSlot = <slot name="dragger" class="dragger" /> as HTMLSlotElement;

  /**
   * Checker slot element.
   */
  @Class.Private()
  private checkerSlot = <slot name="checker" class="checker" /> as HTMLSlotElement;

  /**
   * Opener slot element.
   */
  @Class.Private()
  private openerSlot = <slot name="opener" class="opener" /> as HTMLSlotElement;

  /**
   * Content slot element.
   */
  @Class.Private()
  private contentSlot = <slot name="content" class="content" /> as HTMLSlotElement;

  /**
   * Subtree slot element.
   */
  @Class.Private()
  private subtreeSlot = <slot name="subtree" class="subtree" /> as HTMLSlotElement;

  /**
   * Entry element.
   */
  @Class.Private()
  private entry = <div class="entry" /> as HTMLDivElement;

  /**
   * Subtree element.
   */
  @Class.Private()
  private subtree = this.properties.tree;

  /**
   * Node styles.
   */
  @Class.Private()
  private styles = (
    <style>
      {`:host {
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
}`}
    </style>
  ) as HTMLStyleElement;

  /**
   * Node skeleton.
   */
  @Class.Private()
  private skeleton = <div slot="node">{this.children}</div> as Element;

  /**
   * Gets the specified property state.
   * @param property Property name.
   * @returns Returns the current property state.
   */
  @Class.Private()
  private getPropertyState(property: string): boolean {
    return this.skeleton.dataset[property] !== void 0;
  }

  /**
   * Sets the specified property state.
   * @param property Property name.
   * @param state Property state.
   */
  @Class.Private()
  private setPropertyState(property: string, state: boolean): void {
    if (state) {
      this.skeleton.dataset[property] = 'on';
    } else {
      delete this.skeleton.dataset[property];
    }
  }

  /**
   * Update all activated slots with their respective properties.
   */
  @Class.Private()
  private updateActiveProperties(): void {
    if (this.draggable) {
      const slot = this.draggerSlot.assignedNodes().length ? this.draggerSlot : this.contentSlot;
      Control.setChildProperty(slot, 'draggable', this.draggable);
    }
    this.setPropertyState('leaf', this.subtree.empty);
  }

  /**
   * Updates the node with the current active slots.
   */
  @Class.Private()
  private updateActiveSlots(): void {
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
  @Class.Private()
  private dragStartHandler(): void {
    if (this.draggable && !this.disabled && !this.readOnly) {
      this.setPropertyState('dragging', true);
    }
  }

  /**
   * Drag end event handler.
   */
  @Class.Private()
  private dragEndHandler(): void {
    this.setPropertyState('dragging', false);
  }

  /**
   * Select event handler.
   */
  @Class.Private()
  private selectHandler(): void {
    if (this.selectable && !this.disabled && !this.readOnly) {
      this.selected = !this.selected;
    }
  }

  /**
   * Expand event handler.
   */
  @Class.Private()
  private expandHandler(): void {
    this.expanded = !this.expanded;
  }

  /**
   * Drag start by content event handler.
   */
  @Class.Private()
  private dragStartContentHandler(): void {
    if (!this.draggerSlot.assignedNodes().length) {
      this.dragStartHandler();
    }
  }

  /**
   * Drag end by content event handler.
   */
  @Class.Private()
  private dragEndContentHandler(): void {
    if (!this.draggerSlot.assignedNodes().length) {
      this.dragEndHandler();
    }
  }

  /**
   * Select by content event handler.
   */
  @Class.Private()
  private selectContentHandler(): void {
    if (!this.checkerSlot.assignedNodes().length) {
      this.selectHandler();
    }
  }

  /**
   * Bind all element handlers.
   */
  @Class.Private()
  private bindHandlers(): void {
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
  @Class.Private()
  private bindProperties(): void {
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
  @Class.Private()
  private assignProperties(): void {
    this.assignComponentProperties(this.properties, ['value', 'required', 'readOnly', 'disabled', 'draggable', 'selectable']);
  }

  /**
   * Default constructor.
   * @param properties Node properties.
   * @param children Node children.
   */
  constructor(properties?: T, children?: any[]) {
    super(properties, children);
    DOM.append((this.skeleton as HTMLDivElement).attachShadow({ mode: 'closed' }), this.styles, this.entry, this.subtreeSlot);
    this.bindHandlers();
    this.bindProperties();
    this.assignProperties();
  }

  /**
   * Gets the expanded state.
   */
  @Class.Public()
  public get expanded(): boolean {
    return this.getPropertyState('expanded');
  }

  /**
   * Sets the expanded state.
   */
  public set expanded(state: boolean) {
    this.setPropertyState('expanded', state);
    if (state) {
      DOM.append(this.skeleton, this.subtree);
    } else {
      this.subtree.remove();
    }
  }

  /**
   * Gets the selected state.
   */
  @Class.Public()
  public get selected(): boolean {
    return this.getPropertyState('selected');
  }

  /**
   * Sets the selected state.
   */
  public set selected(state: boolean) {
    this.setPropertyState('selected', state);
    Control.setChildProperty(this.checkerSlot, 'checked', state);
  }

  /**
   * Gets the required state.
   */
  @Class.Public()
  public get required(): boolean {
    return this.getPropertyState('required');
  }

  /**
   * Sets the required state.
   */
  public set required(state: boolean) {
    this.subtree.required = state;
    this.setPropertyState('required', state);
  }

  /**
   * Gets the read-only state.
   */
  @Class.Public()
  public get readOnly(): boolean {
    return this.getPropertyState('readOnly');
  }

  /**
   * Sets the read-only state.
   */
  public set readOnly(state: boolean) {
    this.subtree.readOnly = state;
    this.setPropertyState('readOnly', state);
    Control.setChildProperty(this.checkerSlot, 'readOnly', state);
    Control.setChildProperty(this.contentSlot, 'readOnly', state);
  }

  /**
   * Gets the disabled state.
   */
  @Class.Public()
  public get disabled(): boolean {
    return this.getPropertyState('disabled');
  }

  /**
   * Sets the disabled state.
   */
  public set disabled(state: boolean) {
    this.subtree.disabled = state;
    this.setPropertyState('disabled', state);
    Control.setChildProperty(this.checkerSlot, 'disabled', state);
    Control.setChildProperty(this.contentSlot, 'disabled', state);
  }

  /**
   * Gets the draggable state.
   */
  @Class.Public()
  public get draggable(): boolean {
    return this.getPropertyState('draggable');
  }

  /**
   * Sets the draggable state.
   */
  public set draggable(state: boolean) {
    this.subtree.draggable = state;
    this.setPropertyState('draggable', state);
    this.updateActiveSlots();
  }

  /**
   * Gets the selectable state.
   */
  @Class.Public()
  public get selectable(): boolean {
    return this.getPropertyState('selectable');
  }

  /**
   * Sets the selectable state.
   */
  public set selectable(state: boolean) {
    this.subtree.selectable = state;
    this.setPropertyState('selectable', state);
  }

  /**
   * Gets the node element.
   */
  @Class.Public()
  public get element(): Element {
    return this.skeleton;
  }

  /**
   * Adds a new node into the subtree of this node.
   * @param data Node data.
   * @returns Returns the instance of the subtree element.
   */
  @Class.Public()
  public addNode(data: any): Element {
    const node = this.subtree.addNode(data);
    return this.updateActiveSlots(), node;
  }

  /**
   * Inserts a new node at the specified index into the subtree of this node.
   * @param data Node data.
   * @param index Node index.
   * @returns Returns the instance of the subtree element.
   */
  @Class.Public()
  public insertNode(data: any, index: number): Element {
    const node = this.subtree.insertNode(data, index);
    return this.updateActiveSlots(), node;
  }

  /**
   * Removes the node that corresponds to the specified index from the subtree of this node.
   * @param index Node index.
   * @returns Returns true when the node was removed, false otherwise.
   */
  @Class.Public()
  public removeNode(index: number): boolean {
    const state = this.subtree.removeNode(index);
    return this.updateActiveSlots(), state;
  }

  /**
   * Checks the tree node validity.
   * @returns Returns true when the node is valid, false otherwise.
   */
  @Class.Public()
  public checkValidity(): boolean {
    return (Control.getChildByProperty(this.contentSlot, 'checkValidity') as any).checkValidity() && this.subtree.checkValidity();
  }

  /**
   * Reports the tree node validity.
   * @returns Returns true when the node is valid, false otherwise.
   */
  @Class.Public()
  public reportValidity(): boolean {
    return (Control.getChildByProperty(this.contentSlot, 'reportValidity') as any).reportValidity() && this.subtree.reportValidity();
  }

  /**
   * Clear the subtree of this node.
   */
  @Class.Public()
  public clear(): void {
    this.subtree.clear();
  }
}
