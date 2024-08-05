import { createContext } from "react";
import {
    SettingsState,
    SettingsStateAction,
    settingsStateReducer,
} from "../data/reducers/settingsState.reducer";

export type SettingsStateContextData = {
    settingsState: SettingsState;
    settingsStateDispatch: (action: SettingsStateAction) => void;
};

export const defaultSettingsStateData: SettingsState = {
    isDeleteModalVisible: false,
};

export const defaultSettingsContext: SettingsStateContextData = {
    settingsState: defaultSettingsStateData,
    settingsStateDispatch: (action: SettingsStateAction) => {
        throw Error(
            "dispatch for default settings state data context is not implemented"
        );
    },
};

export const SettingsStateContext = createContext<SettingsStateContextData>(
    defaultSettingsContext
);
