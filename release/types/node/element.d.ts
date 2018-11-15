/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Tree from '../tree/element';

/**
 * Node element interface.
 */
export interface Element extends HTMLDivElement {
  /**
   * Determines whether the node is expanded or not.
   */
  expanded: boolean;
  /**
   * Determines whether the node is selected or not.
   */
  selected: boolean;
  /**
   * Determines whether the node is required or not.
   */
  required: boolean;
  /**
   * Determines whether the node is read-only or not.
   */
  readOnly: boolean;
  /**
   * Determines whether the node is disabled or not.
   */
  disabled: boolean;
  /**
   * Determines whether the node is draggable or not.
   */
  draggable: boolean;
  /**
   * Determines whether the node is selectable or not.
   */
  selectable: boolean;
  /**
   * Adds a new node into the subtree of this node.
   * @param data Node data.
   * @returns Returns the instance of the sub tree element.
   */
  addNode(data: any): Element;
  /**
   * Inserts a new node at the specified index into the subtree of this node.
   * @param data Node data.
   * @param index Node index.
   * @returns Returns the instance of the sub tree element.
   */
  insertNode(data: any, index: number): Element;
  /**
   * Removes the node that corresponds to the specified index from the subtree of this node.
   * @param index Node index.
   * @returns Returns true when the node was removed, false otherwise.
   */
  removeNode(index: number): boolean;
  /**
   * Checks the node validity.
   * @returns Returns true when the node is valid, false otherwise.
   */
  checkValidity(): boolean;
  /**
   * Reports the node validity.
   * @returns Returns true when the node is valid, false otherwise.
   */
  reportValidity(): boolean;
  /**
   * Clear the subtree of this node.
   */
  clear(): void;
}
