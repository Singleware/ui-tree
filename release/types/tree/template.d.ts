import * as Control from '@singleware/ui-control';
import * as Node from '../node';
import { Properties } from './properties';
import { Element } from './element';
import { States } from './states';
/**
 * Tree template class.
 */
export declare class Template<T extends Properties = Properties> extends Control.Component<T> {
    /**
     * Tree states.
     */
    protected states: States;
    /**
     * Dragging node data.
     */
    private draggingData;
    /**
     * Dragging mirror element.
     */
    private draggingMirror;
    /**
     * Dragging mirror callback.
     */
    private draggingMirrorCallback;
    /**
     * Matched nodes.
     */
    private matchedNodes;
    /**
     * Mirror element to hide the default drag and drop image.
     */
    private hiddenMirror;
    /**
     * Tree entries slot.
     */
    private entrySlot;
    /**
     * Tree styles.
     */
    private styles;
    /**
     * Tree skeleton.
     */
    private skeleton;
    /**
     * Gets the specified property state.
     * @param property Property name.
     * @returns Returns the current property state.
     */
    private getPropertyState;
    /**
     * Sets the specified property state.
     * @param property Property name.
     * @param state Property state.
     */
    private setPropertyState;
    /**
     * Updates the mirror node position based on the specified coordinates.
     * @param data Mirror data.
     * @param node Mirror element.
     * @param x X coordinate.
     * @param y Y coordinate.
     */
    private updateMirrorPosition;
    /**
     * Renders a new subtree.
     */
    private renderTree;
    /**
     * Renders a new node for the specified data.
     * @param data Node data.
     * @returns Returns the node element instance.
     */
    private renderNode;
    /**
     * Renders a new mirror node for the specified data.
     * @param data Node data.
     * @returns Returns the mirror element instance.
     */
    private renderMirror;
    /**
     * Select handler.
     * @param data Node data.
     */
    private selectHandler;
    /**
     * Drag start event handler.
     * @param data Node data.
     * @param event Event information.
     */
    private dragStartHandler;
    /**
     * Drag end event handler.
     */
    private dragEndHandler;
    /**
     * Drag enter event handler.
     * @param data Node data.
     * @param event Event information.
     */
    private dragEnterHandler;
    /**
     * Drag over event handler.
     * @param event Event information.
     */
    private dragOverHandler;
    /**
     * Drop event handler.
     * @param event Event information.
     */
    private dropHandler;
    /**
     * Render node event handler.
     * @param event Event information.
     */
    private renderNodeHandler;
    /**
     * Render mirror event handler.
     * @param event Event information.
     */
    private renderMirrorHandler;
    /**
     * Dragging mirror event handler.
     * @param event Event information.
     */
    private draggingMirrorHandler;
    /**
     * Change node event handler.
     */
    private changeNodeHandler;
    /**
     * Bind all element handlers.
     */
    private bindHandlers;
    /**
     * Bind exposed properties to the custom element.
     */
    private bindProperties;
    /**
     * Assign all elements properties.
     */
    private assignProperties;
    /**
     * Default constructor.
     * @param properties Tree properties.
     */
    constructor(properties?: T);
    /**
     * Tree name.
     */
    name: string;
    /**
     * Gets the tree values.
     */
    get value(): any;
    /**
     * Sets the tree values.
     */
    set value(value: any);
    /**
     * Gets the default value.
     */
    get defaultValue(): any[];
    /**
     * Gets the tree level length.
     */
    get length(): number;
    /**
     * Gets the empty state.
     */
    get empty(): boolean;
    /**
     * Gets the required state.
     */
    get required(): boolean;
    /**
     * Sets the required state.
     */
    set required(state: boolean);
    /**
     * Gets the read-only state.
     */
    get readOnly(): boolean;
    /**
     * Sets the read-only state.
     */
    set readOnly(state: boolean);
    /**
     * Gets the disabled state.
     */
    get disabled(): boolean;
    /**
     * Sets the disabled state.
     */
    set disabled(state: boolean);
    /**
     * Gets the draggable state.
     */
    get draggable(): boolean;
    /**
     * Sets the draggable state.
     */
    set draggable(state: boolean);
    /**
     * Gets the selectable state.
     */
    get selectable(): boolean;
    /**
     * Sets the selectable state.
     */
    set selectable(state: boolean);
    /**
     * Gets the tree element.
     */
    get element(): Element;
    /**
     * Adds a new node into the tree.
     * @param data Node data.
     * @returns Returns the node element instance.
     */
    addNode(data: any): Node.Element;
    /**
     * Inserts a new node at the specified index in the tree.
     * @param data Node data.
     * @param index Node index.
     * @returns Returns the node element instance.
     */
    insertNode(data: any, index: number): Node.Element;
    /**
     * Removes the node that corresponds to the specified index from the tree.
     * @param index Node index.
     * @returns Returns true when the node was removed, false otherwise.
     */
    removeNode(index: number): boolean;
    /**
     * Checks the tree validity.
     * @returns Returns true when the tree is valid, false otherwise.
     */
    checkValidity(): boolean;
    /**
     * Reports the tree validity.
     * @returns Returns true when the tree is valid, false otherwise.
     */
    reportValidity(): boolean;
    /**
     * Resets the tree to its initial values.
     */
    reset(): void;
    /**
     * Clear all tree nodes and sub trees.
     */
    clear(): void;
}
