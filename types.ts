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

// For dropdowns, radio buttons, etc.
export type SelectionValue<T> = {
    label: string;
    value: T
}

export type Position = "top" | "current" | "bottom" | "other";

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

// List
export const ListContext = createContext<List>({id: "", name: "", type: "List", defaultNewItemPosition: "bottom"});
