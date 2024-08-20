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
    AddUpdateItem: {
        listIndex: number;
        itemIndex: number;
        currentItem?: Item;
    };
    AddUpdateList: {
        listIndex: number;
        currentList?: List;
        visibleFrom: CollectionViewCellType;
    };
    Actions: {
        cellType: CollectionViewCellType;
        cells: SelectionValue<number>[];
        selectActions: [CellSelect, number[]][];
        cellActions: [CellAction, ListsAction][];
        listIndex?: number;
    };
};

export type ListPageNavigationProps = NativeStackScreenProps<
    AppStackNavigatorParamList,
    "Lists"
>;

export type ItemPageNavigationProps = NativeStackScreenProps<
    AppStackNavigatorParamList,
    "Items"
>;

export type SettingsPageNavigationProps = NativeStackScreenProps<
    AppStackNavigatorParamList,
    "Settings"
>;

export type LegalPageNavigationProps = NativeStackScreenProps<
    AppStackNavigatorParamList,
    "Legal"
>;

export type AddUpdateItemPageNavigationProps = NativeStackScreenProps<
    AppStackNavigatorParamList,
    "AddUpdateItem"
>;

export type AddUpdateListPageNavigationProps = NativeStackScreenProps<
    AppStackNavigatorParamList,
    "AddUpdateList"
>;

export type ActionsPageNavigationProps = NativeStackScreenProps<
    AppStackNavigatorParamList,
    "Actions"
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

export type DividedMenuOption = {
    primary: MenuOption;
    secondary?: MenuOption;
};

export interface CollectionViewCell {
    name: string;
    type: CollectionViewCellType;

    isSelected: boolean;
    isLocked: boolean;
    setIsSelected: (isSelected: boolean) => CollectionViewCell;
}

export type ListJSON = {
    name: string;
    listType: ListType;
    defaultNewItemPosition: Position;
    items: ItemJSON[];
    isSelected: boolean;
    isLocked: boolean;
};

export type ItemJSON = {
    name: string;
    notes: string;
    quantity: number;
    isComplete: boolean;
    isSelected: boolean;
    isLocked: boolean;
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

export type ModalButton = {
    text: string;
    onPress: () => void;
    disabled?: boolean;
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
    | "Unlocked"
    | "Generic List"
    | "Shopping List"
    | "To-Do List"
    | "Ordered To-Do List"
    | "Custom";

export type CellAction =
    | "Delete"
    | "Complete"
    | "Incomplete"
    | "Lock"
    | "Unlock";

export type ActionMetadata = {
    label: CellSelect | CellAction;
    method: (indices: number[]) => void;
    isTerminating: boolean;
};

/**
 * Legal
 */
export type Hyperlink = {
    text: string;
    url: string;
};

export type ImageAttribution = {
    hyperlink: Hyperlink;
    image: any;
};
