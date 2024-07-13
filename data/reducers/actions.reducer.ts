import { insertAt, removeAt, updateAt } from "../../utils";

export type ActionsState = {
    cellsToSelect: string;
    actions: string[];
    error?: string;
};

export function defaultActionsState(): ActionsState {
    return {
        cellsToSelect: "",
        actions: [],
    };
}

export type ActionsStateActionType =
    | "UPDATE_ALL"
    | "UPDATE_CELLS_TO_SELECT"
    | "ADD_ACTION"
    | "UPDATE_ACTION"
    | "DELETE_ACTION"
    | "UPDATE_ERROR";

export interface ActionsStateAction {
    type: ActionsStateActionType;
}

export class UpdateAll implements ActionsStateAction {
    type: ActionsStateActionType = "UPDATE_ALL";
    newState: ActionsState;
    constructor(newState: ActionsState) {
        this.newState = newState;
    }
}

export class UpdateCellsToSelect implements ActionsStateAction {
    type: ActionsStateActionType = "UPDATE_CELLS_TO_SELECT";
    newCellsToSelect: string;
    constructor(newCellsToSelect: string) {
        this.newCellsToSelect = newCellsToSelect;
    }
}

export class AddAction implements ActionsStateAction {
    type: ActionsStateActionType = "ADD_ACTION";
    newAction: string;
    constructor(newAction: string) {
        this.newAction = newAction;
    }
}

export class UpdateAction implements ActionsStateAction {
    type: ActionsStateActionType = "UPDATE_ACTION";
    actionIndex: number;
    newAction: string;
    constructor(actionIndex: number, newAction: string) {
        this.actionIndex = actionIndex;
        this.newAction = newAction;
    }
}

export class DeleteAction implements ActionsStateAction {
    type: ActionsStateActionType = "DELETE_ACTION";
    actionIndex: number;
    constructor(actionIndex: number) {
        this.actionIndex = actionIndex;
    }
}

export class UpdateError implements ActionsStateAction {
    type: ActionsStateActionType = "UPDATE_ERROR";
    newError?: string;
    constructor(newError?: string) {
        this.newError = newError;
    }
}

export function actionsStateReducer(
    prevState: ActionsState,
    action: ActionsStateAction
): ActionsState {
    const prevStateWithoutError: ActionsState = {
        ...prevState,
        error: undefined,
    };

    switch (action.type) {
        case "UPDATE_ALL": {
            const { newState } = action as UpdateAll;
            return newState;
        }

        case "UPDATE_CELLS_TO_SELECT": {
            const { newCellsToSelect } = action as UpdateCellsToSelect;
            return {
                ...prevStateWithoutError,
                cellsToSelect: newCellsToSelect,
            };
        }

        case "ADD_ACTION": {
            const { newAction } = action as AddAction;
            const { actions } = prevStateWithoutError;
            return {
                ...prevStateWithoutError,
                actions: [...actions, newAction],
            };
        }

        case "UPDATE_ACTION": {
            const { actionIndex, newAction } = action as UpdateAction;
            const { actions } = prevStateWithoutError;
            return {
                ...prevStateWithoutError,
                actions: updateAt(newAction, actions, actionIndex),
            };
        }

        case "UPDATE_ERROR": {
            const { newError } = action as UpdateError;
            return {
                ...prevStateWithoutError,
                error: newError,
            };
        }

        case "DELETE_ACTION": {
            const { actionIndex } = action as DeleteAction;
            const { actions } = prevStateWithoutError;
            return {
                ...prevStateWithoutError,
                actions: removeAt(actionIndex, actions),
            };
        }

        default:
            throw Error(
                `Unknown action for actions state reducer: ${action.type}`
            );
    }
}