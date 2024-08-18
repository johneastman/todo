export type ListsState = {
    currentIndex: number;
    isDeleteAllModalVisible: boolean;
    isDrawerVisible: boolean;
    selectMode: boolean;
};

export type ListsStateActionType =
    | "CURRENT_INDEX"
    | "DELETE_ALL_MODAL_VISIBLE"
    | "UPDATE_DRAWER_VISIBILITY"
    | "UPDATE_SELECT_MODE";

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

export class DeleteModalVisible extends ModalVisible {
    constructor(isVisible: boolean) {
        super("DELETE_ALL_MODAL_VISIBLE", isVisible);
    }
}

export class UpdateDrawerVisibility extends ModalVisible {
    constructor(isVisible: boolean) {
        super("UPDATE_DRAWER_VISIBILITY", isVisible);
    }
}

export class UpdateSelectMode extends ModalVisible {
    constructor(isVisible: boolean) {
        super("UPDATE_SELECT_MODE", isVisible);
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

        case "UPDATE_DRAWER_VISIBILITY": {
            const { isVisible } = action as UpdateDrawerVisibility;
            return {
                ...prevState,
                isDrawerVisible: isVisible,
            };
        }

        case "UPDATE_SELECT_MODE": {
            const { isVisible } = action as UpdateSelectMode;
            return {
                ...prevState,
                selectMode: isVisible,
            };
        }

        default:
            throw Error(
                `Unknown action for lists state reducer: ${action.type}`
            );
    }
}
