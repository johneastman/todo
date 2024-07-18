import { Position } from "../../types";
import {
    ModalActionType,
    Replace,
    UpdateError,
    UpdateIsLocked,
} from "./common";

type ItemModalActionType =
    | "UPDATE_NAME"
    | "UPDATE_POSITION"
    | "UPDATE_QUANTITY"
    | "UPDATE_SELECT_ALL";

interface ItemModalAction {
    type: ItemModalActionType | ModalActionType;
}

export type ItemModalState = {
    name: string;
    position: Position;
    quantity: number;
    isLocked: boolean;
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
    // Errors should reset when other values are updated.
    const prevStateWithoutError: ItemModalState = {
        ...prevState,
        error: undefined,
    };

    switch (action.type) {
        case "REPLACE": {
            const { newState } = action as Replace<ItemModalState>;
            return newState;
        }

        case "UPDATE_NAME": {
            const { newName } = action as UpdateName;
            return {
                ...prevStateWithoutError,
                name: newName,
            };
        }

        case "UPDATE_POSITION": {
            const { newPosition } = action as UpdatePosition;
            return {
                ...prevStateWithoutError,
                position: newPosition,
            };
        }

        case "UPDATE_ERROR": {
            const { newError } = action as UpdateError;
            return {
                ...prevStateWithoutError,
                error: newError,
            };
        }

        case "UPDATE_QUANTITY": {
            const { newQuantity } = action as UpdateQuantity;
            return {
                ...prevStateWithoutError,
                quantity: newQuantity,
            };
        }

        case "UPDATE_IS_LOCKED": {
            const { isLocked } = action as UpdateIsLocked;
            return {
                ...prevStateWithoutError,
                isLocked: isLocked,
            };
        }

        default: {
            throw Error(
                `Unknown action for item modal reducer: ${action.type}`
            );
        }
    }
}
