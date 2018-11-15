/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 *
 * The proposal of this example is to show how to use the basic tree template.
 */
import * as Tree from '../source';
import * as DOM from '@singleware/jsx';

/**
 * Render handler.
 * @param detail Event detail information.
 */
function renderItem(detail: Tree.Events.RenderNode): void {
  detail.checker = <input type="checkbox" /> as HTMLInputElement;
  detail.dragger = <div>#</div> as HTMLDivElement;
  detail.opener = <div>@</div> as HTMLDivElement;
  detail.content = <div>{detail.data.name}</div> as HTMLDivElement;
}

const tree = <Tree.Template onRenderNode={renderItem} draggable /> as Tree.Element;

const subX = tree.addNode({ name: 'Item A' });
const subY = tree.addNode({ name: 'Item B' });

const subXA = subX.addNode({ name: 'Subitem A' });
const subYA = subY.addNode({ name: 'Subitem B' });
