import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Item, List } from "./data/data";
import { ListsAction, ListsData } from "./data/reducers/lists.reducer";

/**
 * Navigation
 */
export type AppStackNavigatorParamList = {
    Lists: undefined;
    Items: {
        listIndex: number;
    };
    Settings: undefined;
    Legal: undefined;
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

export type LegalPageNavigationProp = NativeStackNavigationProp<
    AppStackNavigatorParamList,
    "Legal"
>;

export type ItemParams = {
    oldPos: number;
    newPos: number;
    listIndex: number;
    item: Item;
};

export type ListParams = {
    oldPos: number;
    newPos: number;
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
    ignoreSelectAll: boolean;
    setIsSelected: (isSelected: boolean) => CollectionViewCell;
}

export type ListJSON = {
    name: string;
    listType: ListType;
    defaultNewItemPosition: Position;
    items: ItemJSON[];
    isSelected: boolean;
    ignoreSelectAll: boolean;
};

export type ItemJSON = {
    name: string;
    quantity: number;
    isComplete: boolean;
    isSelected: boolean;
    ignoreSelectAll: boolean;
};

export type SettingsJSON = {
    isDeveloperModeEnabled: boolean;
    defaultListType: ListType;
    defaultListPosition: Position;
};

export type ListsContextData = {
    data: ListsData;
    listsDispatch: (action: ListsAction) => void;
};

// For selection components (dropdowns, radio buttons, etc.)
export type SelectionValue<T> = {
    label: string;
    value: T;
};

export type ExportedData = {
    listsJSON: ListJSON[];
    settingsJSON: SettingsJSON;
};

export type Position = "top" | "current" | "bottom";

export type ListType = "List" | "Shopping" | "To-Do" | "Ordered To-Do";

export type CollectionViewCellType = "List" | "Item";

export type MoveItemAction = "Copy" | "Move";

export type CellSelect =
    | "All"
    | "None"
    | "Complete"
    | "Incomplete"
    | "Locked"
    | "Unlocked";

export type CellAction =
    | "Delete"
    | "Complete"
    | "Incomplete"
    | "Lock"
    | "Unlock"
    | "Move";

/**
 * Legao
 */
export type Hyperlink = {
    text: string;
    url: string;
};

export type ImageAttribution = {
    hyperlink: Hyperlink;
    image: any;
};
