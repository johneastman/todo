export type ItemsState = {
    isModalVisible: boolean;
    isActionsModalVisible: boolean;
    isDeleteAllModalVisible: boolean;
    isCopyModalVisible: boolean;
    currentIndex: number;
};

export type ItemsStateActionType =
    | "ADD_UPDATE_MODAL_VISIBLE"
    | "MOVE_COPY_MODAL_VISIBLE"
    | "ACTION_MODAL_VISIBLE"
    | "DELETE_MODAL_VISIBLE"
    | "UPDATE_CURRENT_INDEX";

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

export class AddUpdateModalVisible extends ModalVisible {
    constructor(isVisible: boolean) {
        super("ADD_UPDATE_MODAL_VISIBLE", isVisible);
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

export class ActionsModalVisible extends ModalVisible {
    constructor(isVisible: boolean) {
        super("ACTION_MODAL_VISIBLE", isVisible);
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
        case "ADD_UPDATE_MODAL_VISIBLE": {
            const { isVisible } = action as AddUpdateModalVisible;
            return {
                ...prevState,
                isModalVisible: isVisible,
            };
        }

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

        case "ACTION_MODAL_VISIBLE": {
            const { isVisible } = action as ActionsModalVisible;
            return {
                ...prevState,
                isActionsModalVisible: isVisible,
            };
        }

        default:
            throw Error(
                `Unknown action for items state reducer: ${action.type}`
            );
    }
}
