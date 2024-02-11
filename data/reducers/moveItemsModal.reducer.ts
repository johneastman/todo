import { MoveItemAction } from "../../types";

type MoveItemsModalActionType =
    | "REPLACE"
    | "UPDATE_ACTION"
    | "UPDATE_SOURCE"
    | "UPDATE_ERROR"
    | "UPDATE_DESTINATION";

interface MoveItemsModalAction {
    type: MoveItemsModalActionType;
}

export type MoveItemsModalState = {
    action: MoveItemAction;
    source?: number;
    destination?: number;
    error?: string;
};

export class Replace implements MoveItemsModalAction {
    type: MoveItemsModalActionType = "REPLACE";
    newState: MoveItemsModalState;
    constructor(newState: MoveItemsModalState) {
        this.newState = newState;
    }
}

export class UpdateSource implements MoveItemsModalAction {
    type: MoveItemsModalActionType = "UPDATE_SOURCE";
    newSource: number;
    constructor(newSource: number) {
        this.newSource = newSource;
    }
}

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

export class UpdateError implements MoveItemsModalAction {
    type: MoveItemsModalActionType = "UPDATE_ERROR";
    newError: string;
    constructor(newError: string) {
        this.newError = newError;
    }
}

export function moveItemsModalReducer(
    prevState: MoveItemsModalState,
    action: MoveItemsModalAction
): MoveItemsModalState {
    const { action: moveItemAction, source, destination } = prevState;

    switch (action.type) {
        case "UPDATE_ERROR": {
            const { newError } = action as UpdateError;
            return {
                action: moveItemAction,
                source: source,
                destination: destination,
                error: newError,
            };
        }

        case "UPDATE_ACTION": {
            const { newAction } = action as UpdateAction;
            return {
                action: newAction,
                source: source,
                destination: destination,
            };
        }

        case "UPDATE_SOURCE": {
            const { newSource } = action as UpdateSource;
            return {
                action: moveItemAction,
                source: newSource,
                destination: destination,
            };
        }

        case "UPDATE_DESTINATION": {
            const { newDestination } = action as UpdateDestination;
            return {
                action: moveItemAction,
                source: source,
                destination: newDestination,
            };
        }

        case "REPLACE": {
            const { newState } = action as Replace;
            return newState;
        }

        default: {
            throw Error(
                `Unknown action for move items modal reducer: ${action.type}`
            );
        }
    }
}
