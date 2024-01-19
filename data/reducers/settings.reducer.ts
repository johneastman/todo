import { ListType, Position, Settings } from "../../types";
import { List } from "../data";

export interface AppData {
    settings: Settings;
    lists: List[];
}

type AppActionType =
    | "UPDATE_DEVELOPER_MODE"
    | "UPDATE_DEFAULT_LIST_POSITION"
    | "UPDATE_DEFAULT_LIST_TYPE"
    | "UPDATE_ALL"
    | "UPDATE_LISTS";

export interface AppAction {
    type: AppActionType;
}

export class UpdateDeveloperMode implements AppAction {
    type: AppActionType = "UPDATE_DEVELOPER_MODE";
    isDeveloperModeEnabled: boolean;
    constructor(isDeveloperModeEnabled: boolean) {
        this.isDeveloperModeEnabled = isDeveloperModeEnabled;
    }
}

export class UpdateDefaultListPosition implements AppAction {
    type: AppActionType = "UPDATE_DEFAULT_LIST_POSITION";
    defaultListPosition: Position;
    constructor(defaultListPosition: Position) {
        this.defaultListPosition = defaultListPosition;
    }
}

export class UpdateDefaultListType implements AppAction {
    type: AppActionType = "UPDATE_DEFAULT_LIST_TYPE";
    defaultListType: ListType;
    constructor(defaultListType: ListType) {
        this.defaultListType = defaultListType;
    }
}

export class UpdateAll implements AppAction {
    type: AppActionType = "UPDATE_ALL";
    settings: Settings;
    lists: List[];
    constructor(settings: Settings, lists: List[]) {
        this.settings = settings;
        this.lists = lists;
    }
}

export class UpdateLists implements AppAction {
    type: AppActionType = "UPDATE_LISTS";
    lists: List[];
    constructor(lists: List[]) {
        this.lists = lists;
    }
}

export function appReducer(prevState: AppData, action: AppAction): AppData {
    const { settings, lists } = prevState;

    switch (action.type) {
        case "UPDATE_DEVELOPER_MODE": {
            const isDeveloperModeEnabled: boolean = (
                action as UpdateDeveloperMode
            ).isDeveloperModeEnabled;

            const newSettings: Settings = {
                isDeveloperModeEnabled: isDeveloperModeEnabled,
                defaultListPosition: settings.defaultListPosition,
                defaultListType: settings.defaultListType,
            };

            return { settings: newSettings, lists: lists };
        }

        case "UPDATE_DEFAULT_LIST_POSITION": {
            const defaultListPosition: Position = (
                action as UpdateDefaultListPosition
            ).defaultListPosition;

            const newSettings: Settings = {
                isDeveloperModeEnabled: settings.isDeveloperModeEnabled,
                defaultListPosition: defaultListPosition,
                defaultListType: settings.defaultListType,
            };

            return { settings: newSettings, lists: lists };
        }

        case "UPDATE_DEFAULT_LIST_TYPE": {
            const defaultListType: ListType = (action as UpdateDefaultListType)
                .defaultListType;

            const newSettings: Settings = {
                isDeveloperModeEnabled: settings.isDeveloperModeEnabled,
                defaultListPosition: settings.defaultListPosition,
                defaultListType: defaultListType,
            };

            return { settings: newSettings, lists: lists };
        }

        case "UPDATE_ALL": {
            const { settings: newSettings, lists: newLists } =
                action as UpdateAll;
            return { settings: newSettings, lists: newLists };
        }

        case "UPDATE_LISTS": {
            const { lists: newLists } = action as UpdateLists;
            return { settings: settings, lists: newLists };
        }

        default:
            throw Error(`Unknown action for settings reducer: ${action.type}`);
    }
}
