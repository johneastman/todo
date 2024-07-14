import { CollectionViewCellType } from "../../types";

export type ListsState = {
    isModalVisible: boolean;
    isActionsModalVisible: boolean;
    isDeleteAllModalVisible: boolean;
    currentIndex: number;
    visibleFrom: CollectionViewCellType;
};

export type ListsStateActionType =
    | "ADD_UPDATE_MODAL_VISIBLE"
    | "ACTION_MODAL_VISIBLE"
    | "DELETE_ALL_MODAL_VISIBLE"
    | "CURRENT_INDEX"
    | "VISIBLE_FROM";

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

export class AddUpdateModalVisible extends ModalVisible {
    visibleFrom: CollectionViewCellType;
    listIndex: number;
    constructor(
        isVisible: boolean,
        visibleFrom: CollectionViewCellType,
        listIndex?: number
    ) {
        super("ADD_UPDATE_MODAL_VISIBLE", isVisible);
        this.visibleFrom = visibleFrom;
        this.listIndex = listIndex ?? -1;
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
        case "ADD_UPDATE_MODAL_VISIBLE": {
            const { isVisible, visibleFrom, listIndex } =
                action as AddUpdateModalVisible;

            return {
                ...prevState,
                isModalVisible: isVisible,
                visibleFrom: visibleFrom,
                currentIndex: listIndex,
            };
        }

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
