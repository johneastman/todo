import { Position } from "../../types";
import {
    ModalActionType,
    Replace,
    UpdateError,
    UpdateIsLocked,
} from "./common";

type AddUpdateItemActionType =
    | "UPDATE_NAME"
    | "UPDATE_POSITION"
    | "UPDATE_QUANTITY"
    | "UPDATE_SELECT_ALL";

interface AddUpdateItemAction {
    type: AddUpdateItemActionType | ModalActionType;
}

export type AddUpdateItemState = {
    name: string;
    position: Position;
    quantity: number;
    isLocked: boolean;
    error?: string;
    currentIndex: number;
};

export class UpdateName implements AddUpdateItemAction {
    type: AddUpdateItemActionType = "UPDATE_NAME";
    newName: string;
    constructor(newName: string) {
        this.newName = newName;
    }
}

export class UpdatePosition implements AddUpdateItemAction {
    type: AddUpdateItemActionType = "UPDATE_POSITION";
    newPosition: Position;
    constructor(newPosition: Position) {
        this.newPosition = newPosition;
    }
}

export class UpdateQuantity implements AddUpdateItemAction {
    type: AddUpdateItemActionType = "UPDATE_QUANTITY";
    newQuantity: number;
    constructor(newQuantity: number) {
        this.newQuantity = newQuantity;
    }
}

export function itemModalReducer(
    prevState: AddUpdateItemState,
    action: AddUpdateItemAction
): AddUpdateItemState {
    // Errors should reset when other values are updated.
    const prevStateWithoutError: AddUpdateItemState = {
        ...prevState,
        error: undefined,
    };

    switch (action.type) {
        case "REPLACE": {
            const { newState } = action as Replace<AddUpdateItemState>;
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
