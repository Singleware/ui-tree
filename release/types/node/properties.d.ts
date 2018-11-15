/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Tree from '../tree/element';

/**
 * Node properties interface.
 */
export interface Properties {
  /**
   * Tree element.
   */
  tree: Tree.Element;
  /**
   * Determines whether the node is required or not.
   */
  required?: boolean;
  /**
   * Determines whether the node is read-only or not.
   */
  readOnly?: boolean;
  /**
   * Determines whether the node is disabled or not.
   */
  disabled?: boolean;
  /**
   * Determines whether the node can be draggable or not.
   */
  draggable?: boolean;
  /**
   * Determines whether the node can be selectable or not.
   */
  selectable?: boolean;
  /**
   * Node children.
   */
  children?: {};
}
