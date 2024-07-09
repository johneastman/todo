import { ListType, Position } from "../../types";

export type Settings = {
    isDeveloperModeEnabled: boolean;
    defaultListType: ListType;
    defaultListPosition: Position;
};

export type SettingsActionType =
    | "UPDATE_ALL"
    | "UPDATE_DEVELOPER_MODE"
    | "UPDATE_DEFAULT_LIST_POSITION"
    | "UPDATE_DEFAULT_LIST_TYPE";

export interface SettingsAction {
    type: SettingsActionType;
}

export class UpdateAll implements SettingsAction {
    type: SettingsActionType = "UPDATE_ALL";
    newSettings: Settings;
    constructor(newSettings: Settings) {
        this.newSettings = newSettings;
    }
}

export class UpdateDeveloperMode implements SettingsAction {
    type: SettingsActionType = "UPDATE_DEVELOPER_MODE";
    isDeveloperModeEnabled: boolean;
    constructor(isDeveloperModeEnabled: boolean) {
        this.isDeveloperModeEnabled = isDeveloperModeEnabled;
    }
}

export class UpdateDefaultListPosition implements SettingsAction {
    type: SettingsActionType = "UPDATE_DEFAULT_LIST_POSITION";
    defaultListPosition: Position;
    constructor(defaultListPosition: Position) {
        this.defaultListPosition = defaultListPosition;
    }
}

export class UpdateDefaultListType implements SettingsAction {
    type: SettingsActionType = "UPDATE_DEFAULT_LIST_TYPE";
    defaultListType: ListType;
    constructor(defaultListType: ListType) {
        this.defaultListType = defaultListType;
    }
}

export function settingsReducer(
    prevState: Settings,
    action: SettingsAction
): Settings {
    switch (action.type) {
        case "UPDATE_ALL": {
            const { newSettings } = action as UpdateAll;
            return newSettings;
        }

        case "UPDATE_DEVELOPER_MODE": {
            const { isDeveloperModeEnabled } = action as UpdateDeveloperMode;
            return {
                ...prevState,
                isDeveloperModeEnabled: isDeveloperModeEnabled,
            };
        }

        case "UPDATE_DEFAULT_LIST_POSITION": {
            const { defaultListPosition } = action as UpdateDefaultListPosition;
            return {
                ...prevState,
                defaultListPosition: defaultListPosition,
            };
        }

        case "UPDATE_DEFAULT_LIST_TYPE": {
            const { defaultListType } = action as UpdateDefaultListType;
            return {
                ...prevState,
                defaultListType: defaultListType,
            };
        }

        default:
            throw Error(`Unknown action for settings reducer: ${action.type}`);
    }
}
