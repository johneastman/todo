import { Position } from "../../types";

type ItemModalReducerActionType =
    | "REPLACE"
    | "UPDATE_NAME"
    | "UPDATE_POSITION"
    | "UPDATE_QUANTITY"
    | "UPDATE_ERROR";

interface ItemModalReducerAction {
    type: ItemModalReducerActionType;
}

export class UpdateName implements ItemModalReducerAction {
    type: ItemModalReducerActionType = "UPDATE_NAME";
    newName: string;
    constructor(newName: string) {
        this.newName = newName;
    }
}

export class UpdatePosition implements ItemModalReducerAction {
    type: ItemModalReducerActionType = "UPDATE_POSITION";
    newPosition: Position;
    constructor(newPosition: Position) {
        this.newPosition = newPosition;
    }
}

export class UpdateQuantity implements ItemModalReducerAction {
    type: ItemModalReducerActionType = "UPDATE_QUANTITY";
    newQuantity: number;
    constructor(newQuantity: number) {
        this.newQuantity = newQuantity;
    }
}

export class UpdateError implements ItemModalReducerAction {
    type: ItemModalReducerActionType = "UPDATE_ERROR";
    newError?: string;
    constructor(newError?: string) {
        this.newError = newError;
    }
}

export class Replace implements ItemModalReducerAction {
    type: ItemModalReducerActionType = "REPLACE";
    newState: ItemModalState;
    constructor(newState: ItemModalState) {
        this.newState = newState;
    }
}

export type ItemModalState = {
    name: string;
    position: Position;
    quantity: number;
    error?: string;
};

export function itemModalReducer(
    prevState: ItemModalState,
    action: ItemModalReducerAction
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
            const { newState } = action as Replace;
            return newState;
        }
        default: {
            throw Error(
                `Unknown action for item modal reducer: ${action.type}`
            );
        }
    }
}
