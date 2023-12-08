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

export type ListViewCellItemType = "List" | "Item";

export type MoveItemAction = "copy" | "move";

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
export const ListContext = createContext<List>(
    {
        id: "", name: "", listType: "List", defaultNewItemPosition: "bottom", isSelected: false, type: "List",
        setIsSelected: function (isSelected: boolean): List {
            throw new Error("Function not implemented.");
        }
    }
);

// List Cell
export interface ListCell<T> {
    item: T;
    index: number;
}
export const defaultListCell: ListCell<any> = { item: {}, index: 0 };
export const ListCellContext = createContext(defaultListCell);