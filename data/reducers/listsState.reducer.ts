import { CollectionViewCellType } from "../../types";

export type ListsState = {
    isActionsModalVisible: boolean;
    isDeleteAllModalVisible: boolean;
    currentIndex: number;
};

export type ListsStateActionType =
    | "ACTION_MODAL_VISIBLE"
    | "DELETE_ALL_MODAL_VISIBLE"
    | "CURRENT_INDEX";

export interface ListsStateAction {
    type: ListsStateActionType;
}

class ModalVisible implements ListsStateAction {
    type: ListsStateActionType;
    isVisible: boolean;
    constructor(type: ListsStateActionType, isVisible: boolean) {
        this.type = type;
        this.isVisible = isVisible;
    }
}

export class ActionsModalVisible extends ModalVisible {
    constructor(isVisible: boolean) {
        super("ACTION_MODAL_VISIBLE", isVisible);
    }
}

export class DeleteModalVisible extends ModalVisible {
    constructor(isVisible: boolean) {
        super("DELETE_ALL_MODAL_VISIBLE", isVisible);
    }
}

export class UpdateCurrentIndex implements ListsStateAction {
    type: ListsStateActionType = "CURRENT_INDEX";
    index: number;
    constructor(index: number) {
        this.index = index;
    }
}

export function listsStateReducer(
    prevState: ListsState,
    action: ListsStateAction
): ListsState {
    switch (action.type) {
        case "ACTION_MODAL_VISIBLE": {
            const { isVisible } = action as ActionsModalVisible;
            return {
                ...prevState,
                isActionsModalVisible: isVisible,
            };
        }

        case "DELETE_ALL_MODAL_VISIBLE": {
            const { isVisible } = action as DeleteModalVisible;
            return {
                ...prevState,
                isDeleteAllModalVisible: isVisible,
            };
        }

        case "CURRENT_INDEX": {
            const { index } = action as UpdateCurrentIndex;
            return {
                ...prevState,
                currentIndex: index,
            };
        }

        default:
            throw Error(
                `Unknown action for lists state reducer: ${action.type}`
            );
    }
}
