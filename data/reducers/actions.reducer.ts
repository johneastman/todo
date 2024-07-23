import { ActionMetadata } from "../../types";
import { removeAt, updateAt } from "../../utils";

export type ActionsState = {
    cellsToSelect: ActionMetadata | undefined;
    actions: (ActionMetadata | undefined)[];
    error?: string;
    selectedIndices: number[];
};

export function defaultActionsState(): ActionsState {
    // At least one action is required, so the first action is undefined.
    return {
        cellsToSelect: undefined,
        actions: [undefined],
        selectedIndices: [],
    };
}

export type ActionsStateActionType =
    | "UPDATE_ALL"
    | "UPDATE_CELLS_TO_SELECT"
    | "ADD_ACTION"
    | "UPDATE_ACTION"
    | "DELETE_ACTION"
    | "UPDATE_ERROR"
    | "UPDATE_SELECTED_INDEX";

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
    newCellsToSelect: ActionMetadata;
    constructor(newCellsToSelect: ActionMetadata) {
        this.newCellsToSelect = newCellsToSelect;
    }
}

export class AddAction implements ActionsStateAction {
    type: ActionsStateActionType = "ADD_ACTION";
    newAction: ActionMetadata | undefined;
    constructor(newAction: ActionMetadata | undefined) {
        this.newAction = newAction;
    }
}

export class UpdateAction implements ActionsStateAction {
    type: ActionsStateActionType = "UPDATE_ACTION";
    actionIndex: number;
    newAction: ActionMetadata | undefined;
    constructor(actionIndex: number, newAction: ActionMetadata | undefined) {
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

export class UpdateSelectedIndex implements ActionsStateAction {
    type: ActionsStateActionType = "UPDATE_SELECTED_INDEX";
    onChecked: boolean;
    newIndex: number;
    constructor(onChecked: boolean, newIndex: number) {
        this.onChecked = onChecked;
        this.newIndex = newIndex;
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

        case "UPDATE_SELECTED_INDEX": {
            const { onChecked, newIndex } = action as UpdateSelectedIndex;
            const { selectedIndices } = prevStateWithoutError;
            return {
                ...prevStateWithoutError,
                selectedIndices: onChecked
                    ? [...selectedIndices, newIndex]
                    : selectedIndices.filter((index) => index !== newIndex),
            };
        }

        default:
            throw Error(
                `Unknown action for actions state reducer: ${action.type}`
            );
    }
}
