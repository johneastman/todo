import { createContext } from "react";
import { Settings, SettingsAction } from "../data/reducers/settings.reducer";

export type SettingsContextData = {
    settings: Settings;
    settingsDispatch: (action: SettingsAction) => void;
};

export const defaultSettingsData: Settings = {
    isDeveloperModeEnabled: false,
    defaultListType: "List",
    defaultListPosition: "bottom",
};

export const defaultSettingsContext: SettingsContextData = {
    settings: defaultSettingsData,
    settingsDispatch: (action: SettingsAction) => {
        throw Error("dispatch in default app data context is not implemented");
    },
};

export const SettingsContext = createContext<SettingsContextData>(
    defaultSettingsContext
);
