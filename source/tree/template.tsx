/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Class from '@singleware/class';
import * as DOM from '@singleware/jsx';
import * as Control from '@singleware/ui-control';

import * as Node from '../node';

import { Properties } from './properties';
import { Element } from './element';
import { Events } from './events';
import { States } from './states';

/**
 * Tree template class.
 */
@Class.Describe()
export class Template<T extends Properties = Properties> extends Control.Component<T> {
  /**
   * Tree states.
   */
  @Class.Protected()
  protected states = {
    nodes: [],
    selected: {}
  } as States;

  /**
   * Dragging node data.
   */
  @Class.Private()
  private draggingData!: any;

  /**
   * Dragging mirror element.
   */
  @Class.Private()
  private draggingMirror!: any;

  /**
   * Dragging mirror callback.
   */
  @Class.Private()
  private draggingMirrorCallback = this.draggingMirrorHandler.bind(this);

  /**
   * Matched nodes.
   */
  @Class.Private()
  private matchedNodes = new WeakMap<any, Node.Element>();

  /**
   * Mirror element to hide the default drag and drop image.
   */
  @Class.Private()
  private hiddenMirror = <div style="position: absolute; height: 0px; width: 0px; left: 0px; top: 0px;" /> as HTMLDivElement;

  /**
   * Tree entries slot.
   */
  @Class.Private()
  private entrySlot = <slot name="node" class="node" /> as HTMLSlotElement;

  /**
   * Tree styles.
   */
  @Class.Private()
  private styles = (
    <style>
      {`:host {
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
}`}
    </style>
  ) as HTMLStyleElement;

  /**
   * Tree skeleton.
   */
  @Class.Private()
  private skeleton = (
    <div slot={this.properties.slot} class={this.properties.class}>
      {this.children}
    </div>
  ) as Element;

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
   * Updates the mirror node position based on the specified coordinates.
   * @param data Mirror data.
   * @param node Mirror element.
   * @param x X coordinate.
   * @param y Y coordinate.
   */
  @Class.Private()
  private updateMirrorPosition(data: any, node: HTMLElement, x: number, y: number): void {
    const detail = { data: data, x: x, y: y } as Events.MoveNode;
    const event = new CustomEvent<Events.MoveNode>('movenode', { bubbles: true, cancelable: false, detail: detail });
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
  @Class.Private()
  private renderTree(): Element {
    const tree = new Template({ ...(this.properties as any), slot: 'subtree' });
    tree.states.selected = this.states.selected;
    return tree.element;
  }

  /**
   * Renders a new node for the specified data.
   * @param data Node data.
   * @returns Returns the node element instance.
   */
  @Class.Private()
  private renderNode(data: any): Node.Element {
    const tree = this.renderTree();
    const detail = { data: data, tree: tree } as Events.RenderNode;
    const event = new CustomEvent<Events.RenderNode>('rendernode', { bubbles: true, cancelable: true, detail: detail });
    let dragger, checker;
    if (!this.skeleton.dispatchEvent(event) || !detail.content) {
      detail.content = <div>{data.toLocaleString()}</div> as HTMLDivElement;
    }
    detail.content.slot = 'content';
    if ((dragger = detail.dragger)) {
      dragger.slot = 'dragger';
    } else {
      dragger = detail.content;
    }
    if ((checker = detail.checker)) {
      checker.slot = 'checker';
    } else {
      checker = detail.content;
    }
    if (detail.opener) {
      detail.opener.slot = 'opener';
    }
    const node = (
      <Node.Template tree={detail.tree} readOnly={this.readOnly} draggable={this.draggable} disabled={this.disabled}>
        {detail.dragger}
        {detail.checker}
        {detail.opener}
        {detail.content}
      </Node.Template>
    ) as Node.Element;
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
  @Class.Private()
  private renderMirror(data: any): HTMLElement {
    const detail = { data: data } as Events.RenderMirror;
    const event = new CustomEvent<Events.RenderMirror>('rendermirror', { bubbles: true, cancelable: true, detail: detail });
    if (!this.skeleton.dispatchEvent(event) || !detail.mirror) {
      detail.mirror = <div>{data.toLocaleString()}</div> as HTMLDivElement;
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
  @Class.Private()
  private selectHandler(data: any): void {
    if (this.selectable && !this.disabled && !this.readOnly) {
      const selection = this.states.selected;
      const different = selection.data !== data;
      if (selection.node) {
        selection.node.selected = false;
        selection.node = void 0;
        selection.data = void 0;
      }
      if (different) {
        selection.node = this.matchedNodes.get(data) as Node.Element;
        selection.node.selected = true;
        selection.data = data;
      }
    }
  }

  /**
   * Drag start event handler.
   * @param data Node data.
   * @param event Event information.
   */
  @Class.Private()
  private dragStartHandler(data: any, event: DragEvent): void {
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
  @Class.Private()
  private dragEndHandler(): void {
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
  @Class.Private()
  private dragEnterHandler(data: any, event: DragEvent): void {
    const newer = this.matchedNodes.get(data) as Node.Element;
    if (this.draggingData && this.draggingData !== data) {
      const list = this.states.nodes;
      const source = list.splice(list.indexOf(this.draggingData), 1)[0];
      const current = this.matchedNodes.get(this.draggingData) as Node.Element;
      if (newer.offsetTop + newer.offsetHeight / 2 <= event.pageY) {
        if (newer.previousSibling) {
          list.splice(list.indexOf(data), 0, source);
        } else {
          list.unshift(source);
        }
        this.skeleton.insertBefore(current, newer);
      } else {
        if (newer.nextSibling) {
          list.splice(list.indexOf(data) + 1, 0, source);
        } else {
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
  @Class.Private()
  private dragOverHandler(event: DragEvent): void {
    if (this.draggable && !this.disabled && !this.readOnly) {
      event.preventDefault();
    }
  }

  /**
   * Drop event handler.
   * @param event Event information.
   */
  @Class.Private()
  private dropHandler(event: DragEvent): void {
    if (this.draggable && !this.disabled && !this.readOnly) {
      this.skeleton.dispatchEvent(new Event('change', { bubbles: true, cancelable: false }));
      event.preventDefault();
    }
  }

  /**
   * Render node event handler.
   * @param event Event information.
   */
  @Class.Private()
  private renderNodeHandler(event: CustomEvent<Events.RenderNode>): void {
    this.properties.onRenderNode(event.detail);
  }

  /**
   * Render mirror event handler.
   * @param event Event information.
   */
  @Class.Private()
  private renderMirrorHandler(event: CustomEvent<Events.RenderMirror>): void {
    if (this.properties.onRenderMirror) {
      this.properties.onRenderMirror(event.detail);
    }
  }

  /**
   * Dragging mirror event handler.
   * @param event Event information.
   */
  @Class.Private()
  private draggingMirrorHandler(event: MouseEvent): void {
    if (this.draggingMirror) {
      this.updateMirrorPosition(this.draggingData, this.draggingMirror, event.pageX, event.pageY);
    }
  }

  /**
   * Change node event handler.
   */
  @Class.Private()
  private changeNodeHandler(): void {
    if (this.properties.onChange) {
      this.properties.onChange();
    }
  }

  /**
   * Bind all element handlers.
   */
  @Class.Private()
  private bindHandlers(): void {
    this.skeleton.addEventListener('rendernode', this.renderNodeHandler.bind(this));
    this.skeleton.addEventListener('rendermirror', this.renderMirrorHandler.bind(this));
    this.skeleton.addEventListener('change', this.changeNodeHandler.bind(this));
  }

  /**
   * Bind exposed properties to the custom element.
   */
  @Class.Private()
  private bindProperties(): void {
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
  @Class.Private()
  private assignProperties(): void {
    this.assignComponentProperties(this.properties, ['name', 'value', 'required', 'readOnly', 'disabled', 'draggable', 'selectable']);
  }

  /**
   * Default constructor.
   * @param properties Tree properties.
   */
  constructor(properties?: T) {
    super(properties);
    DOM.append((this.skeleton as HTMLDivElement).attachShadow({ mode: 'closed' }), this.styles, this.entrySlot);
    this.bindHandlers();
    this.bindProperties();
    this.assignProperties();
  }

  /**
   * Tree name.
   */
  @Class.Public()
  public name!: string;

  /**
   * Gets the tree values.
   */
  @Class.Public()
  public get value(): any {
    return this.selectable ? this.states.selected.data : this.states.nodes.slice();
  }

  /**
   * Sets the tree values.
   */
  public set value(value: any) {
    if (this.selectable) {
      const node = this.matchedNodes.get(value) as Node.Element;
      if (node) {
        this.selectHandler(value);
      }
    } else {
      this.clear();
      for (const node of value) {
        this.addNode(node);
      }
    }
  }

  /**
   * Gets the default value.
   */
  @Class.Public()
  public get defaultValue(): any[] {
    return this.properties.value || [];
  }

  /**
   * Gets the tree level length.
   */
  @Class.Public()
  public get length(): number {
    return this.states.nodes.length;
  }

  /**
   * Gets the empty state.
   */
  @Class.Public()
  public get empty(): boolean {
    return this.length === 0;
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
    this.setPropertyState('required', state);
    Control.setChildrenProperty(this.entrySlot, 'required', state);
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
    this.setPropertyState('readOnly', state);
    Control.setChildrenProperty(this.entrySlot, 'readOnly', state);
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
    this.setPropertyState('disabled', state);
    Control.setChildrenProperty(this.entrySlot, 'disabled', state);
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
    this.setPropertyState('draggable', state);
    Control.setChildrenProperty(this.entrySlot, 'draggable', state);
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
    this.setPropertyState('selectable', state);
    Control.setChildrenProperty(this.entrySlot, 'selectable', state);
  }

  /**
   * Gets the tree element.
   */
  @Class.Public()
  public get element(): Element {
    return this.skeleton;
  }

  /**
   * Adds a new node into the tree.
   * @param data Node data.
   * @returns Returns the node element instance.
   */
  @Class.Public()
  public addNode(data: any): Node.Element {
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
  @Class.Public()
  public insertNode(data: any, index: number): Node.Element {
    const previous = this.states.nodes[index];
    if (!previous) {
      throw new Error(`There is no none at the specified index.`);
    }
    const node = this.renderNode(data);
    this.states.nodes.splice(index + 1, 0, data);
    this.skeleton.insertBefore(node, (this.matchedNodes.get(previous) as Node.Element).nextSibling);
    return node;
  }

  /**
   * Removes the node that corresponds to the specified index from the tree.
   * @param index Node index.
   * @returns Returns true when the node was removed, false otherwise.
   */
  @Class.Public()
  public removeNode(index: number): boolean {
    const node = this.matchedNodes.get(this.states.nodes[index]) as Node.Element;
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
  @Class.Public()
  public checkValidity(): boolean {
    return (
      (!this.required || !this.empty) &&
      Control.listChildrenByProperty(this.entrySlot, 'checkValidity', (node: any) => {
        return node.checkValidity() ? void 0 : false;
      })
    );
  }

  /**
   * Reports the tree validity.
   * @returns Returns true when the tree is valid, false otherwise.
   */
  @Class.Public()
  public reportValidity(): boolean {
    return (
      (!this.required || !this.empty) &&
      Control.listChildrenByProperty(this.entrySlot, 'reportValidity', (node: any) => {
        return node.reportValidity() ? void 0 : false;
      })
    );
  }

  /**
   * Resets the tree to its initial values.
   */
  @Class.Public()
  public reset(): void {
    if (this.properties.value) {
      this.value = this.properties.value;
    } else {
      this.clear();
    }
  }

  /**
   * Clear all tree nodes and sub trees.
   */
  @Class.Public()
  public clear(): void {
    this.states.nodes = [];
    this.states.selected.node = void 0;
    this.states.selected.data = void 0;
    DOM.clear(this.skeleton);
  }
}
