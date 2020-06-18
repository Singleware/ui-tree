import * as Control from '@singleware/ui-control';
import { Properties } from './properties';
import { Element } from './element';
/**
 * Node template class.
 */
export declare class Template<T extends Properties = Properties> extends Control.Component<T> {
    /**
     * Dragger slot element.
     */
    private draggerSlot;
    /**
     * Checker slot element.
     */
    private checkerSlot;
    /**
     * Opener slot element.
     */
    private openerSlot;
    /**
     * Content slot element.
     */
    private contentSlot;
    /**
     * Subtree slot element.
     */
    private subtreeSlot;
    /**
     * Entry element.
     */
    private entry;
    /**
     * Subtree element.
     */
    private subtree;
    /**
     * Node styles.
     */
    private styles;
    /**
     * Node skeleton.
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
     * Update all activated slots with their respective properties.
     */
    private updateActiveProperties;
    /**
     * Updates the node with the current active slots.
     */
    private updateActiveSlots;
    /**
     * Drag start event handler.
     */
    private dragStartHandler;
    /**
     * Drag end event handler.
     */
    private dragEndHandler;
    /**
     * Select event handler.
     */
    private selectHandler;
    /**
     * Expand event handler.
     */
    private expandHandler;
    /**
     * Drag start by content event handler.
     */
    private dragStartContentHandler;
    /**
     * Drag end by content event handler.
     */
    private dragEndContentHandler;
    /**
     * Select by content event handler.
     */
    private selectContentHandler;
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
     * @param properties Node properties.
     * @param children Node children.
     */
    constructor(properties?: T, children?: any[]);
    /**
     * Gets the expanded state.
     */
    get expanded(): boolean;
    /**
     * Sets the expanded state.
     */
    set expanded(state: boolean);
    /**
     * Gets the selected state.
     */
    get selected(): boolean;
    /**
     * Sets the selected state.
     */
    set selected(state: boolean);
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
     * Gets the node element.
     */
    get element(): Element;
    /**
     * Adds a new node into the subtree of this node.
     * @param data Node data.
     * @returns Returns the instance of the subtree element.
     */
    addNode(data: any): Element;
    /**
     * Inserts a new node at the specified index into the subtree of this node.
     * @param data Node data.
     * @param index Node index.
     * @returns Returns the instance of the subtree element.
     */
    insertNode(data: any, index: number): Element;
    /**
     * Removes the node that corresponds to the specified index from the subtree of this node.
     * @param index Node index.
     * @returns Returns true when the node was removed, false otherwise.
     */
    removeNode(index: number): boolean;
    /**
     * Checks the tree node validity.
     * @returns Returns true when the node is valid, false otherwise.
     */
    checkValidity(): boolean;
    /**
     * Reports the tree node validity.
     * @returns Returns true when the node is valid, false otherwise.
     */
    reportValidity(): boolean;
    /**
     * Clear the subtree of this node.
     */
    clear(): void;
}
