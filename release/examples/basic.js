"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 *
 * The proposal of this example is to show how to use the basic tree template.
 */
const Tree = require("../source");
const DOM = require("@singleware/jsx");
/**
 * Render handler.
 * @param detail Event detail information.
 */
function renderItem(detail) {
    detail.checker = DOM.create("input", { type: "checkbox" });
    detail.dragger = DOM.create("div", null, "#");
    detail.opener = DOM.create("div", null, "@");
    detail.content = DOM.create("div", null, detail.data.name);
}
const tree = DOM.create(Tree.Template, { onRenderNode: renderItem, draggable: true });
const subX = tree.addNode({ name: 'Item A' });
const subY = tree.addNode({ name: 'Item B' });
const subXA = subX.addNode({ name: 'Subitem A' });
const subYA = subY.addNode({ name: 'Subitem B' });
