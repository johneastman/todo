import { ListType, Position } from "../../types";
import { ModalActionType, Replace, UpdateError } from "./common";

type ListModalActionType =
    | "UPDATE_NAME"
    | "UPDATE_POSITION"
    | "UPDATE_LIST_TYPE"
    | "UPDATE_DEFAULT_NEW_ITEM_POSITION";

interface ListModalAction {
    type: ListModalActionType | ModalActionType;
}

export type ListModalState = {
    name: string;
    position: Position;
    listType: ListType;
    defaultNewItemPosition: Position;
    error?: string;
};

export class UpdateName implements ListModalAction {
    type: ListModalActionType = "UPDATE_NAME";
    newName: string;
    constructor(newName: string) {
        this.newName = newName;
    }
}

export class UpdatePosition implements ListModalAction {
    type: ListModalActionType = "UPDATE_POSITION";
    newPosition: Position;
    constructor(newPosition: Position) {
        this.newPosition = newPosition;
    }
}

export class UpdateListType implements ListModalAction {
    type: ListModalActionType = "UPDATE_LIST_TYPE";
    newListType: ListType;
    constructor(newListType: ListType) {
        this.newListType = newListType;
    }
}

export class UpdateDefaultNewItemPosition implements ListModalAction {
    type: ListModalActionType = "UPDATE_DEFAULT_NEW_ITEM_POSITION";
    newDefaultNewItemPosition: Position;
    constructor(newDefaultNewItemPosition: Position) {
        this.newDefaultNewItemPosition = newDefaultNewItemPosition;
    }
}

export function listModalReducer(
    prevState: ListModalState,
    action: ListModalAction
): ListModalState {
    // Errors should reset when other values are updated.
    const prevStateWithoutError: ListModalState = {
        ...prevState,
        error: undefined,
    };

    switch (action.type) {
        case "REPLACE": {
            const { newState } = action as Replace<ListModalState>;
            return newState;
        }

        case "UPDATE_NAME": {
            const { newName } = action as UpdateName;

            return {
                ...prevStateWithoutError,
                name: newName,
            };
        }

        case "UPDATE_ERROR": {
            const { newError } = action as UpdateError;
            return {
                ...prevStateWithoutError,
                error: newError,
            };
        }

        case "UPDATE_POSITION": {
            const { newPosition } = action as UpdatePosition;
            return {
                ...prevStateWithoutError,
                position: newPosition,
            };
        }

        case "UPDATE_LIST_TYPE": {
            const { newListType } = action as UpdateListType;
            return {
                ...prevStateWithoutError,
                listType: newListType,
            };
        }

        case "UPDATE_DEFAULT_NEW_ITEM_POSITION": {
            const { newDefaultNewItemPosition } =
                action as UpdateDefaultNewItemPosition;
            return {
                ...prevStateWithoutError,
                defaultNewItemPosition: newDefaultNewItemPosition,
            };
        }

        default: {
            throw Error(
                `Unknown action for list modal reducer: ${action.type}`
            );
        }
    }
}
