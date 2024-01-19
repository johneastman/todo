import { createContext } from "react";
import { ListType, Position, Settings } from "../../types";

export const defaultSettings: Settings = {
    isDeveloperModeEnabled: false,
    defaultListType: "List",
    defaultListPosition: "bottom",
};

export const defaultSettingsContext = {
    settings: defaultSettings,
    settingsDispatch: (action: SettingsAction): void => {},
};

export const SettingsContext = createContext(defaultSettingsContext);

type SettingsActionType =
    | "UPDATE_DEVELOPER_MODE"
    | "UPDATE_DEFAULT_LIST_POSITION"
    | "UPDATE_DEFAULT_LIST_TYPE"
    | "UPDATE_ALL";

export interface SettingsAction {
    type: SettingsActionType;
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

export class UpdateAll implements SettingsAction {
    type: SettingsActionType = "UPDATE_ALL";
    settings: Settings;
    constructor(settings: Settings) {
        this.settings = settings;
    }
}

export function settingsReducer(
    prevState: Settings,
    action: SettingsAction
): Settings {
    switch (action.type) {
        case "UPDATE_DEVELOPER_MODE":
            const isDeveloperModeEnabled: boolean = (
                action as UpdateDeveloperMode
            ).isDeveloperModeEnabled;

            return {
                isDeveloperModeEnabled: isDeveloperModeEnabled,
                defaultListPosition: prevState.defaultListPosition,
                defaultListType: prevState.defaultListType,
            };

        case "UPDATE_DEFAULT_LIST_POSITION":
            const defaultListPosition: Position = (
                action as UpdateDefaultListPosition
            ).defaultListPosition;

            return {
                isDeveloperModeEnabled: prevState.isDeveloperModeEnabled,
                defaultListPosition: defaultListPosition,
                defaultListType: prevState.defaultListType,
            };

        case "UPDATE_DEFAULT_LIST_TYPE":
            const defaultListType: ListType = (action as UpdateDefaultListType)
                .defaultListType;
            return {
                isDeveloperModeEnabled: prevState.isDeveloperModeEnabled,
                defaultListPosition: prevState.defaultListPosition,
                defaultListType: defaultListType,
            };

        case "UPDATE_ALL":
            const newSettings: Settings = (action as UpdateAll).settings;
            return newSettings;

        default:
            throw Error(`Unknown action for settings reducer: ${action.type}`);
    }
}
