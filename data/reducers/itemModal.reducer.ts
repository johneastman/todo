import { Position } from "../../types";
import { ModalActionType, Replace, UpdateError } from "./common";

type ItemModalActionType =
    | "UPDATE_NAME"
    | "UPDATE_POSITION"
    | "UPDATE_QUANTITY";

interface ItemModalAction {
    type: ItemModalActionType | ModalActionType;
}

export type ItemModalState = {
    name: string;
    position: Position;
    quantity: number;
    error?: string;
};

export class UpdateName implements ItemModalAction {
    type: ItemModalActionType = "UPDATE_NAME";
    newName: string;
    constructor(newName: string) {
        this.newName = newName;
    }
}

export class UpdatePosition implements ItemModalAction {
    type: ItemModalActionType = "UPDATE_POSITION";
    newPosition: Position;
    constructor(newPosition: Position) {
        this.newPosition = newPosition;
    }
}

export class UpdateQuantity implements ItemModalAction {
    type: ItemModalActionType = "UPDATE_QUANTITY";
    newQuantity: number;
    constructor(newQuantity: number) {
        this.newQuantity = newQuantity;
    }
}

export function itemModalReducer(
    prevState: ItemModalState,
    action: ItemModalAction
): ItemModalState {
    const { name, quantity, position } = prevState;

    switch (action.type) {
        case "UPDATE_NAME": {
            const { newName } = action as UpdateName;
            return {
                name: newName,
                position: position,
                quantity: quantity,
            };
        }

        case "UPDATE_POSITION": {
            const { newPosition } = action as UpdatePosition;
            return {
                name: name,
                position: newPosition,
                quantity: quantity,
            };
        }

        case "UPDATE_ERROR": {
            const { newError } = action as UpdateError;
            return {
                name: name,
                position: position,
                quantity: quantity,
                error: newError,
            };
        }

        case "UPDATE_QUANTITY": {
            const { newQuantity } = action as UpdateQuantity;
            return {
                name: name,
                position: position,
                quantity: newQuantity,
            };
        }

        case "REPLACE": {
            const { newState } = action as Replace<ItemModalState>;
            return newState;
        }

        default: {
            throw Error(
                `Unknown action for item modal reducer: ${action.type}`
            );
        }
    }
}
