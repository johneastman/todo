import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { List } from "./data/data";
import { createContext } from "react";

export type AppStackNavigatorParamList = {
    Lists: undefined;
    Items: {
        list: List;
    };
    Settings: undefined;
};

export type ListPageNavigationProp = NativeStackNavigationProp<
    AppStackNavigatorParamList,
    "Lists"
>;

export type ItemPageNavigationScreenProp = NativeStackScreenProps<
    AppStackNavigatorParamList,
    "Items"
>;

export type SettingsPageNavigationProp = NativeStackNavigationProp<
    AppStackNavigatorParamList,
    "Settings"
>;

// Radio Buttons
export type Position = "top" | "current" | "bottom" | "other";

export type RadioButton<T> = {
    displayValue: string;
    position: T;
}

// List types
export type ListType = {
    label: string;
    value: ListTypeValue;
}

export type ListTypeValue = "List" | "Shopping" | "To-Do";

/* * * * * * 
 * Contexts *
 * * * * * */

// Settings
export interface Settings {
    isDeveloperModeEnabled: boolean;
    defaultListType: ListTypeValue;
    updateSettings: (settings: Settings) => void;
}

export const defaultSettings: Settings = {
    isDeveloperModeEnabled: false,
    defaultListType: "List",
    updateSettings: () => {}
};
export const SettingsContext = createContext(defaultSettings);
