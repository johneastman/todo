export type ItemsState = {
    isDeleteAllModalVisible: boolean;
    isCopyModalVisible: boolean;
    isDrawerVisible: boolean;
    currentIndex: number;
};

export type ItemsStateActionType =
    | "MOVE_COPY_MODAL_VISIBLE"
    | "DELETE_MODAL_VISIBLE"
    | "UPDATE_CURRENT_INDEX"
    | "UPDATE_DRAWER_VISIBILITY";

export interface ItemsStateAction {
    type: ItemsStateActionType;
}

class ModalVisible implements ItemsStateAction {
    type: ItemsStateActionType;
    isVisible: boolean;
    constructor(type: ItemsStateActionType, isVisible: boolean) {
        this.type = type;
        this.isVisible = isVisible;
    }
}

export class MoveCopyModalVisible extends ModalVisible {
    constructor(isVisible: boolean) {
        super("MOVE_COPY_MODAL_VISIBLE", isVisible);
    }
}

export class DeleteAllModalVisible extends ModalVisible {
    constructor(isVisible: boolean) {
        super("DELETE_MODAL_VISIBLE", isVisible);
    }
}

export class UpdateDrawerVisibility extends ModalVisible {
    constructor(isVisible: boolean) {
        super("UPDATE_DRAWER_VISIBILITY", isVisible);
    }
}

export class UpdateCurrentIndex implements ItemsStateAction {
    type: ItemsStateActionType = "UPDATE_CURRENT_INDEX";
    index: number;
    constructor(index: number) {
        this.index = index;
    }
}

export function itemsStateReducer(
    prevState: ItemsState,
    action: ItemsStateAction
): ItemsState {
    switch (action.type) {
        case "MOVE_COPY_MODAL_VISIBLE": {
            const { isVisible } = action as MoveCopyModalVisible;
            return {
                ...prevState,
                isCopyModalVisible: isVisible,
            };
        }

        case "UPDATE_CURRENT_INDEX": {
            const { index } = action as UpdateCurrentIndex;
            return {
                ...prevState,
                currentIndex: index,
            };
        }

        case "DELETE_MODAL_VISIBLE": {
            const { isVisible } = action as DeleteAllModalVisible;
            return {
                ...prevState,
                isDeleteAllModalVisible: isVisible,
            };
        }

        case "UPDATE_DRAWER_VISIBILITY": {
            const { isVisible } = action as UpdateDrawerVisibility;
            return {
                ...prevState,
                isDrawerVisible: isVisible,
            };
        }

        default:
            throw Error(
                `Unknown action for items state reducer: ${action.type}`
            );
    }
}
