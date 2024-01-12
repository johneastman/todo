import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Item, List, Settings } from "./data/data";
import { createContext } from "react";

export type ItemCRUD = {
    oldPos: number;
    newPos: Position;
    listId: string;
    item: Item;
    itemType: ItemType;
};

export type ListCRUD = {
    oldPos: number;
    newPos: Position;
    list: List;
};

export type AppStackNavigatorParamList = {
    Lists: undefined;
    Items: {
        list: List;
    };
    Settings: undefined;
    Export: undefined;
    Import: undefined;
    SectionedList: undefined;
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

export type ExportPageNavigationProps = NativeStackNavigationProp<
    AppStackNavigatorParamList,
    "Export"
>;

export type ImportPageNavigationProps = NativeStackNavigationProp<
    AppStackNavigatorParamList,
    "Import"
>;

// For dropdowns, radio buttons, etc.
export type SelectionValue<T> = {
    label: string;
    value: T;
};

export type Position = "top" | "current" | "bottom" | "other";

export type ListTypeValue = "List" | "Shopping" | "To-Do" | "Ordered To-Do";

export type ListViewCellItemType = "List" | "Item";

export type MoveItemAction = "copy" | "move";

export type ItemType = "Section" | "Item";
