import { ListType, Position } from "../../types";
import { ModalActionType, Replace, UpdateError } from "./common";

type AddUpdateListActionType =
    | "UPDATE_NAME"
    | "UPDATE_POSITION"
    | "UPDATE_LIST_TYPE"
    | "UPDATE_DEFAULT_NEW_ITEM_POSITION"
    | "UPDATE_CURRENT_INDEX";

interface AddUpdateListAction {
    type: AddUpdateListActionType | ModalActionType;
}

export type AddUpdateListState = {
    name: string;
    position: Position;
    listType: ListType;
    defaultNewItemPosition: Position;
    currentIndex: number;
    error?: string;
};

export class UpdateName implements AddUpdateListAction {
    type: AddUpdateListActionType = "UPDATE_NAME";
    newName: string;
    constructor(newName: string) {
        this.newName = newName;
    }
}

export class UpdatePosition implements AddUpdateListAction {
    type: AddUpdateListActionType = "UPDATE_POSITION";
    newPosition: Position;
    constructor(newPosition: Position) {
        this.newPosition = newPosition;
    }
}

export class UpdateListType implements AddUpdateListAction {
    type: AddUpdateListActionType = "UPDATE_LIST_TYPE";
    newListType: ListType;
    constructor(newListType: ListType) {
        this.newListType = newListType;
    }
}

export class UpdateDefaultNewItemPosition implements AddUpdateListAction {
    type: AddUpdateListActionType = "UPDATE_DEFAULT_NEW_ITEM_POSITION";
    newDefaultNewItemPosition: Position;
    constructor(newDefaultNewItemPosition: Position) {
        this.newDefaultNewItemPosition = newDefaultNewItemPosition;
    }
}

export function addUpdateListReducer(
    prevState: AddUpdateListState,
    action: AddUpdateListAction
): AddUpdateListState {
    // Errors should reset when other values are updated.
    const prevStateWithoutError: AddUpdateListState = {
        ...prevState,
        error: undefined,
    };

    switch (action.type) {
        case "REPLACE": {
            const { newState } = action as Replace<AddUpdateListState>;
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
