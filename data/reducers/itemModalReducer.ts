import { ItemCRUD, ItemType, Position } from "../../types";

type ItemModalStateActionType =
    | "TEXT"
    | "QUANTITY"
    | "POSITION"
    | "TYPE"
    | "SECTION";

interface ItemModalStateAction {
    type: ItemModalStateActionType;
}

export class UpdateText implements ItemModalStateAction {
    type: ItemModalStateActionType = "TEXT";
    text: string;
    constructor(text: string) {
        this.text = text;
    }
}

export class UpdateQuantity implements ItemModalStateAction {
    type: ItemModalStateActionType = "QUANTITY";
    quantity: number;
    constructor(quantity: number) {
        this.quantity = quantity;
    }
}

export class UpdatePosition implements ItemModalStateAction {
    type: ItemModalStateActionType = "POSITION";
    position: Position;
    constructor(position: Position) {
        this.position = position;
    }
}

export class UpdateType implements ItemModalStateAction {
    type: ItemModalStateActionType = "TYPE";
    itemType: ItemType;
    constructor(itemType: ItemType) {
        this.itemType = itemType;
    }
}

export class UpdateSectionIndex implements ItemModalStateAction {
    type: ItemModalStateActionType = "SECTION";
    index: number;
    constructor(index: number) {
        this.index = index;
    }
}

export function itemModalReducer(
    prevState: ItemCRUD,
    action: ItemModalStateAction
): ItemCRUD {
    const {
        name,
        quantity,
        isComplete,
        oldPosition,
        newPosition,
        type,
        sectionIndex,
    } = prevState;

    switch (action.type) {
        case "TEXT": {
            const { text } = action as UpdateText;

            return {
                name: text,
                quantity: quantity,
                isComplete: isComplete,
                oldPosition: oldPosition,
                newPosition: newPosition,
                type: type,
                sectionIndex: sectionIndex,
            };
        }

        case "QUANTITY": {
            const { quantity: newQuantity } = action as UpdateQuantity;

            return {
                name: name,
                quantity: newQuantity,
                isComplete: isComplete,
                oldPosition: oldPosition,
                newPosition: newPosition,
                type: type,
                sectionIndex: sectionIndex,
            };
        }

        case "POSITION": {
            const { position } = action as UpdatePosition;

            return {
                name: name,
                quantity: quantity,
                isComplete: isComplete,
                oldPosition: oldPosition,
                newPosition: position,
                type: type,
                sectionIndex: sectionIndex,
            };
        }

        case "TYPE": {
            const { itemType } = action as UpdateType;

            return {
                name: name,
                quantity: quantity,
                isComplete: isComplete,
                oldPosition: oldPosition,
                newPosition: newPosition,
                type: itemType,
                sectionIndex: sectionIndex,
            };
        }

        case "SECTION": {
            const { index } = action as UpdateSectionIndex;
            return {
                name: name,
                quantity: quantity,
                isComplete: isComplete,
                oldPosition: oldPosition,
                newPosition: newPosition,
                type: type,
                sectionIndex: index,
            };
        }

        default: {
            throw Error(
                `Unknown action for item modal reducer: ${action.type}`
            );
        }
    }
}
