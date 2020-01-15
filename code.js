// This plugin creates 5 rectangles on the screen.
// const numberOfRectangles = 5;
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs such as the network by creating a UI which contains
// a full browser environment (see documentation).
function countSelected() {
    return figma.currentPage.selection.length;
}
function getTopLevelNodes() {
    return figma.currentPage.children.map(child => {
        return {
            id: child.id,
            name: child.name
        };
    });
}
function postSelected() {
    figma.ui.postMessage({
        type: "selectedCount",
        payload: countSelected()
    });
}
function handleGo(payload) {
    const newPage = figma.createPage();
    const newNodes = [];
    const backgroundNode = figma.getNodeById(payload.background);
    const background = backgroundNode;
    for (const [index, selected] of figma.currentPage.selection.entries()) {
        const clonedBackground = background.clone();
        clonedBackground.x += (clonedBackground.width + 16) * index;
        clonedBackground.y += 250;
        const clonedSelected = selected.clone();
        clonedSelected.x = clonedBackground.x + payload.positionLeft;
        clonedSelected.y = clonedBackground.y + payload.positionTop;
        newPage.appendChild(clonedBackground);
        newPage.appendChild(clonedSelected);
        newNodes.push(clonedBackground);
        newNodes.push(clonedSelected);
    }
    figma.currentPage = newPage;
    figma.viewport.scrollAndZoomIntoView(newNodes);
}
function handleSendSelected() {
    const { selection } = figma.currentPage;
    if (selection.length === 1) {
        const [node] = selection;
        figma.ui.postMessage({
            type: "single-selected",
            payload: node.id
        });
    }
    else {
        figma.ui.postMessage({
            type: "single-selected",
            error: "Must select a single node to use as background"
        });
    }
}
figma.showUI(__html__);
figma.ui.resize(280, 250);
figma.ui.postMessage({
    type: "topLevelNodes",
    payload: getTopLevelNodes()
});
postSelected();
figma.on("selectionchange", () => {
    postSelected();
});
figma.ui.onmessage = (message) => __awaiter(this, void 0, void 0, function* () {
    if (typeof message !== "object") {
        console.warn("[CODE] Invalid message", message);
    }
    switch (message.type) {
        case "go": {
            handleGo(message.payload);
            break;
        }
        case "send-single-selected": {
            handleSendSelected();
            break;
        }
    }
});
// Make sure to close the plugin when you're done. Otherwise the plugin will
// keep running, which shows the cancel button at the bottom of the screen.
// figma.closePlugin();
