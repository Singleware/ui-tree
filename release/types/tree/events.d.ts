/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import { Element } from './element';

/**
 * Custom events.
 */
export namespace Events {
  /**
   * Render node, event detail interface.
   */
  export interface RenderNode<T = any> {
    /**
     * Input data.
     */
    readonly data: T;
    /**
     * Subtree element.
     */
    readonly tree: Element;
    /**
     * Dragger element.
     */
    dragger: HTMLElement | undefined;
    /**
     * Checker element.
     */
    checker: HTMLElement | undefined;
    /**
     * Opener element.
     */
    opener: HTMLElement | undefined;
    /**
     * Content element.
     */
    content: HTMLElement | undefined;
  }
  /**
   * Render mirror, event detail interface.
   */
  export interface RenderMirror<T = any> {
    /**
     * Input data.
     */
    data: T;
    /**
     * Mirror element.
     */
    mirror: HTMLElement | undefined;
  }
  /**
   * Move node, event detail interface.
   */
  export interface MoveNode<T = any> {
    /**
     * Input data.
     */
    data: T;
    /**
     * X coordinates.
     */
    x: number;
    /**
     * Y coordinates.
     */
    y: number;
  }
}
