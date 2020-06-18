/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Node from '../node/element';

/**
 * Tree element interface.
 */
export interface Element extends HTMLDivElement {
  /**
   * Tree name.
   */
  name?: string;
  /**
   * Tree values.
   */
  value?: any;
  /**
   * Default tree value.
   */
  readonly defaultValue: any[];
  /**
   * Tree level length.
   */
  readonly length: number;
  /**
   * Determine whether the tree is empty or not.
   */
  readonly empty: boolean;
  /**
   * Determines whether the tree is required or not.
   */
  required: boolean;
  /**
   * Determines whether the tree is read-only or not.
   */
  readOnly: boolean;
  /**
   * Determines whether the tree is disabled or not.
   */
  disabled: boolean;
  /**
   * Determines whether the tree nodes can be draggable or not.
   */
  draggable: boolean;
  /**
   * Determines whether the tree nodes can be selectable or not.
   */
  selectable: boolean;
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
   * Reset the tree to its initial values.
   */
  reset(): void;
  /**
   * Clear all tree nodes and sub trees.
   */
  clear(): void;
}
