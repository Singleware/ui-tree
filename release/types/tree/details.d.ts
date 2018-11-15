/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Node from '../tree';
import { Element } from './element';

/**
 * Custom events details.
 */
export namespace Details {
  /**
   * Node details interface.
   */
  export interface Node {
    /**
     * Subtree.
     */
    tree: Element;
    /**
     * Entry element.
     */
    entry: Node.Element;
  }
}
