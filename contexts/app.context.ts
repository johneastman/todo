import { createContext } from "react";
import {
    AppAction,
    AppData,
    appReducer,
} from "../data/reducers/settings.reducer";
import { Settings } from "../types";

export interface AppDataContext {
    data: AppData;
    dispatch: (action: AppAction) => void;
}

export const defaultSettings: Settings = {
    isDeveloperModeEnabled: false,
    defaultListType: "List",
    defaultListPosition: "bottom",
};

export const defaultAppData: AppData = {
    settings: defaultSettings,
    lists: [],
};

export const AppContext = createContext<AppDataContext>({
    data: defaultAppData,
    dispatch: (action: AppAction) => appReducer(defaultAppData, action),
});
