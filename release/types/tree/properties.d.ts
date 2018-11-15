/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import { Events } from './events';

/**
 * Tree properties interface.
 */
export interface Properties {
  /**
   * Tree classes.
   */
  class?: string;
  /**
   * Tree slot.
   */
  slot?: string;
  /**
   * Tree name.
   */
  name?: string;
  /**
   * Tree values.
   */
  value?: any[];
  /**
   * Determines whether the tree is required or not.
   */
  required?: boolean;
  /**
   * Determines whether the tree is read-only or not.
   */
  readOnly?: boolean;
  /**
   * Determines whether the tree is disabled or not.
   */
  disabled?: boolean;
  /**
   * Determines whether the tree nodes can be draggable or not.
   */
  draggable?: boolean;
  /**
   * Determines whether the tree nodes can be selectable or not.
   */
  selectable?: boolean;
  /**
   * Tree column children.
   */
  children?: void;
  /**
   * Render node event.
   */
  onRenderNode: (detail: Events.RenderNode) => void;
  /**
   * Render mirror event.
   */
  onRenderMirror?: (detail: Events.RenderMirror) => void;
  /**
   * Change event.
   */
  onChange?: () => void;
}
