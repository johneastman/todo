import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Item, List } from "./data/data";
import { AppAction, AppData } from "./data/reducers/app.reducer";

export type AppStackNavigatorParamList = {
    Lists: undefined;
    Items: {
        list: List;
    };
    Settings: undefined;
    Export: undefined;
    Import: undefined;
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

export type ItemCRUD = {
    oldPos: number;
    newPos: Position;
    listId: string;
    item: Item;
};

export type ListCRUD = {
    oldPos: number;
    newPos: Position;
    list: List;
};

export interface MenuOption {
    text: string;
    onPress: () => void;

    disabled?: boolean;
    color?: string;
    testId?: string;
}

export interface CollectionViewCell {
    name: string;
    type: CollectionViewCellType;

    isSelected: boolean;
    setIsSelected: (isSelected: boolean) => CollectionViewCell;
}

export interface ListJSON {
    id: string;
    name: string;
    listType: ListType;
    defaultNewItemPosition: Position;
    isSelected: boolean;
    items: ItemJSON[];
}

export interface ItemJSON {
    name: string;
    quantity: number;
    itemType: ItemType;
    isComplete: boolean;
    isSelected: boolean;
}

export interface SettingsJSON {
    isDeveloperModeEnabled: boolean;
    defaultListType: ListType;
    defaultListPosition: Position;
}

export interface Settings {
    isDeveloperModeEnabled: boolean;
    defaultListType: ListType;
    defaultListPosition: Position;
}

export interface AppDataContext {
    data: AppData;
    dispatch: (action: AppAction) => void;
}

// For dropdowns, radio buttons, etc.
export type SelectionValue<T> = {
    label: string;
    value: T;
};

export type Position = "top" | "current" | "bottom" | "other";

export type ListType = "List" | "Shopping" | "To-Do" | "Ordered To-Do";

export type CollectionViewCellType = "List" | "Item";

export type MoveItemAction = "copy" | "move";

export type ItemType = "Section" | "Item";
