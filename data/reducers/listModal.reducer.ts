import { ListType, Position } from "../../types";
import { ModalReducerActionType, Replace, UpdateError } from "./common";

type ListModalReducerActionType =
    | "UPDATE_NAME"
    | "UPDATE_POSITION"
    | "UPDATE_LIST_TYPE"
    | "UPDATE_DEFAULT_NEW_ITEM_POSITION";

interface ListModalReducerAction {
    type: ListModalReducerActionType | ModalReducerActionType;
}

export type ListModalState = {
    name: string;
    position: Position;
    listType: ListType;
    defaultNewItemPosition: Position;
    error?: string;
};

export class UpdateName implements ListModalReducerAction {
    type: ListModalReducerActionType = "UPDATE_NAME";
    newName: string;
    constructor(newName: string) {
        this.newName = newName;
    }
}

export class UpdatePosition implements ListModalReducerAction {
    type: ListModalReducerActionType = "UPDATE_POSITION";
    newPosition: Position;
    constructor(newPosition: Position) {
        this.newPosition = newPosition;
    }
}

export class UpdateListType implements ListModalReducerAction {
    type: ListModalReducerActionType = "UPDATE_LIST_TYPE";
    newListType: ListType;
    constructor(newListType: ListType) {
        this.newListType = newListType;
    }
}

export class UpdateDefaultNewItemPosition implements ListModalReducerAction {
    type: ListModalReducerActionType = "UPDATE_DEFAULT_NEW_ITEM_POSITION";
    newDefaultNewItemPosition: Position;
    constructor(newDefaultNewItemPosition: Position) {
        this.newDefaultNewItemPosition = newDefaultNewItemPosition;
    }
}

export function listModalReducer(
    prevState: ListModalState,
    action: ListModalReducerAction
): ListModalState {
    const { name, position, listType, defaultNewItemPosition } = prevState;

    // I want the error message to disappear once something changes on the modal, so we do not
    // set the error when other values are updated.
    switch (action.type) {
        case "REPLACE": {
            const { newState } = action as Replace<ListModalState>;
            return newState;
        }
        case "UPDATE_NAME": {
            const { newName } = action as UpdateName;

            return {
                name: newName,
                position: position,
                listType: listType,
                defaultNewItemPosition: defaultNewItemPosition,
            };
        }

        case "UPDATE_ERROR": {
            const { newError } = action as UpdateError;
            return {
                name: name,
                position: position,
                listType: listType,
                defaultNewItemPosition: defaultNewItemPosition,
                error: newError,
            };
        }

        case "UPDATE_POSITION": {
            const { newPosition } = action as UpdatePosition;
            return {
                name: name,
                position: newPosition,
                listType: listType,
                defaultNewItemPosition: defaultNewItemPosition,
            };
        }

        case "UPDATE_LIST_TYPE": {
            const { newListType } = action as UpdateListType;
            return {
                name: name,
                position: position,
                listType: newListType,
                defaultNewItemPosition: defaultNewItemPosition,
            };
        }

        case "UPDATE_DEFAULT_NEW_ITEM_POSITION": {
            const { newDefaultNewItemPosition } =
                action as UpdateDefaultNewItemPosition;
            return {
                name: name,
                position: position,
                listType: listType,
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
