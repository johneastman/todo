import { MoveItemAction } from "../../types";
import { ModalActionType, Replace, UpdateError } from "./common";

type MoveItemsModalActionType = "UPDATE_ACTION" | "UPDATE_DESTINATION";

interface MoveItemsModalAction {
    type: MoveItemsModalActionType | ModalActionType;
}

export type MoveItemsModalState = {
    action: MoveItemAction;
    destinationListIndex?: number;
    error?: string;
};

export class UpdateDestination implements MoveItemsModalAction {
    type: MoveItemsModalActionType = "UPDATE_DESTINATION";
    newDestination: number;
    constructor(newDestination: number) {
        this.newDestination = newDestination;
    }
}

export class UpdateAction implements MoveItemsModalAction {
    type: MoveItemsModalActionType = "UPDATE_ACTION";
    newAction: MoveItemAction;
    constructor(newAction: MoveItemAction) {
        this.newAction = newAction;
    }
}

export function moveItemsModalReducer(
    prevState: MoveItemsModalState,
    action: MoveItemsModalAction
): MoveItemsModalState {
    // Errors should reset when other values are updated.
    const prevStateWithoutError: MoveItemsModalState = {
        ...prevState,
        error: undefined,
    };

    switch (action.type) {
        case "REPLACE": {
            const { newState } = action as Replace<MoveItemsModalState>;
            return newState;
        }

        case "UPDATE_ERROR": {
            const { newError } = action as UpdateError;
            return {
                ...prevStateWithoutError,
                error: newError,
            };
        }

        case "UPDATE_ACTION": {
            const { newAction } = action as UpdateAction;
            return {
                ...prevStateWithoutError,
                action: newAction,
            };
        }

        case "UPDATE_DESTINATION": {
            const { newDestination } = action as UpdateDestination;
            return {
                ...prevStateWithoutError,
                destinationListIndex: newDestination,
            };
        }

        default: {
            throw Error(
                `Unknown action for move items modal reducer: ${action.type}`
            );
        }
    }
}
