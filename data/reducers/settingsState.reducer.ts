export type SettingsState = {
    isDeleteModalVisible: boolean;
};

export type SettingsStateActionType = "UPDATE_IS_DELETE_MODAL_VISIBLE";

export interface SettingsStateAction {
    type: SettingsStateActionType;
}

export class UpdateIsDeleteModalVisible implements SettingsStateAction {
    type: SettingsStateActionType = "UPDATE_IS_DELETE_MODAL_VISIBLE";
    isDeleteModalVisible: boolean;
    constructor(isDeleteModalVisible: boolean) {
        this.isDeleteModalVisible = isDeleteModalVisible;
    }
}

export function settingsStateReducer(
    prevState: SettingsState,
    action: SettingsStateAction
): SettingsState {
    switch (action.type) {
        case "UPDATE_IS_DELETE_MODAL_VISIBLE": {
            const { isDeleteModalVisible } =
                action as UpdateIsDeleteModalVisible;
            return {
                ...prevState,
                isDeleteModalVisible: isDeleteModalVisible,
            };
        }
        default: {
            throw Error(
                `Unknown action for settings state reducer: ${action.type}`
            );
        }
    }
}
