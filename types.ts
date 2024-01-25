import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Item, List } from "./data/data";

/**
 * Navigation
 */
export type AppStackNavigatorParamList = {
    Lists: undefined;
    Items: {
        listId: string;
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

/**
 * App State
 *
 * State action types start with their domain. For example, all list actions start with "LISTS".
 * Actions for both lists and items start with "CELL". The only exception is "UPDATE_ALL",
 * which sets saved data loaded when the app starts.
 */
export type AppActionType =
    | "UPDATE_ALL"
    | "SETTINGS_UPDATE_DEVELOPER_MODE"
    | "SETTINGS_UPDATE_DEFAULT_LIST_POSITION"
    | "SETTINGS_UPDATE_DEFAULT_LIST_TYPE"
    | "LISTS_SELECT_ALL"
    | "LISTS_SELECT"
    | "LISTS_DELETE"
    | "LISTS_UPDATE"
    | "LISTS_ADD"
    | "LISTS_UPDATE_ALL"
    | "ITEMS_ADD"
    | "ITEMS_UPDATE"
    | "ITEMS_DELETE"
    | "ITEMS_ALL_IS_COMPLETE"
    | "ITEMS_UPDATE_ALL"
    | "ITEMS_MOVE"
    | "ITEMS_MOVE_MODAL_VISIBLE"
    | "CELL_MODAL_VISIBLE"
    | "CELL_DELETE_MODAL_VISIBLE";

export type ListsState = {
    isModalVisible: boolean;
    isDeleteAllModalVisible: boolean;
    currentIndex: number;
};

export type ItemsState = {
    isModalVisible: boolean;
    currentIndex: number;
    isDeleteAllModalVisible: boolean;
    isCopyModalVisible: boolean;
};

/**
 * I originally wanted to add "isCellModalVisible" and "currentCellIndex"
 * properties to the state, but that caused the list modal to be visible
 * at the same time as the item modal. Creating separate substates for
 * items and lists will avoid that, as well as allow for handling data
 * unique to each state.
 */
export type AppData = {
    settings: Settings;
    lists: List[];
    listsState: ListsState;
    itemsState: ItemsState;
};

export interface AppAction {
    type: AppActionType;
}

/**
 * Misc
 */
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

export type MenuOption = {
    text: string;
    onPress: () => void;

    disabled?: boolean;
    color?: string;
    testId?: string;
};

export interface CollectionViewCell {
    name: string;
    type: CollectionViewCellType;

    isSelected: boolean;
    setIsSelected: (isSelected: boolean) => CollectionViewCell;
}

export type ListJSON = {
    id: string;
    name: string;
    listType: ListType;
    defaultNewItemPosition: Position;
    isSelected: boolean;
    items: ItemJSON[];
};

export type ItemJSON = {
    name: string;
    quantity: number;
    itemType: ItemType;
    isComplete: boolean;
    isSelected: boolean;
};

export type SettingsJSON = {
    isDeveloperModeEnabled: boolean;
    defaultListType: ListType;
    defaultListPosition: Position;
};

export type Settings = {
    isDeveloperModeEnabled: boolean;
    defaultListType: ListType;
    defaultListPosition: Position;
};

export type AppDataContext = {
    data: AppData;
    dispatch: (action: AppAction) => void;
};

// For dropdowns, radio buttons, etc.
export type SelectionValue<T> = {
    label: string;
    value: T;
};

export type Position = "top" | "current" | "bottom";

export type ListType = "List" | "Shopping" | "To-Do" | "Ordered To-Do";

export type CollectionViewCellType = "List" | "Item";

export type MoveItemAction = "Copy" | "Move";

export type ItemType = "Section" | "Item";
