import {
    CollectionViewCellType,
    ItemParams,
    ListParams,
    ListType,
    MoveItemAction,
    Position,
    Settings,
} from "../../types";
import {
    getList,
    getListItems,
    insertAt,
    updateAt,
    updateLists,
} from "../../utils";
import { Item, List } from "../data";

export type AppActionType =
    | "UPDATE_ALL"
    | "UPDATE_USERNAME"
    | "UPDATE_IS_ACCOUNT_CREATION_MODAL_VISIBLE"
    | "UPDATE_ACCOUNT_CREATION_ERROR"
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
    | "ITEMS_SELECT"
    | "ITEMS_SELECT_ALL"
    | "ITEMS_IS_COMPLETE_ALL"
    | "ITEMS_IS_COMPLETE"
    | "ITEMS_UPDATE_ALL"
    | "ITEMS_MOVE"
    | "ITEMS_MOVE_MODAL_VISIBLE"
    | "CELL_MODAL_VISIBLE"
    | "CELL_DELETE_MODAL_VISIBLE";

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
    accountState: AccountState;
    listsState: ListsState;
    itemsState: ItemsState;
};

export interface AppAction {
    type: AppActionType;
}

export type ListsState = {
    isModalVisible: boolean;
    isDeleteAllModalVisible: boolean;
    currentIndex: number;
    visibleFrom: CollectionViewCellType;
};

export type ItemsState = {
    isModalVisible: boolean;
    currentIndex: number;
    isDeleteAllModalVisible: boolean;
    isCopyModalVisible: boolean;
};

export type AccountState = {
    username?: string;
    isAccountCreationModalVisible: boolean;
    error?: string;
};

export class UpdateAll implements AppAction {
    type: AppActionType = "UPDATE_ALL";
    settings: Settings;
    lists: List[];
    username?: string;
    constructor(settings: Settings, lists: List[], username?: string) {
        this.settings = settings;
        this.lists = lists;
        this.username = username;
    }
}

export class UpdateUsername implements AppAction {
    type: AppActionType = "UPDATE_USERNAME";
    newUsername: string;
    constructor(newUsername: string) {
        this.newUsername = newUsername;
    }
}

export class UpdateIsAccountCreationModalVisible implements AppAction {
    type: AppActionType = "UPDATE_IS_ACCOUNT_CREATION_MODAL_VISIBLE";
    isAccountCreationModalVisible: boolean;
    constructor(isAccountCreationModalVisible: boolean) {
        this.isAccountCreationModalVisible = isAccountCreationModalVisible;
    }
}

export class UpdateAccountCreationError implements AppAction {
    type: AppActionType = "UPDATE_ACCOUNT_CREATION_ERROR";
    error: string;
    constructor(error: string) {
        this.error = error;
    }
}

/**
 * Settings
 */
export class UpdateDeveloperMode implements AppAction {
    type: AppActionType = "SETTINGS_UPDATE_DEVELOPER_MODE";
    isDeveloperModeEnabled: boolean;
    constructor(isDeveloperModeEnabled: boolean) {
        this.isDeveloperModeEnabled = isDeveloperModeEnabled;
    }
}

export class UpdateDefaultListPosition implements AppAction {
    type: AppActionType = "SETTINGS_UPDATE_DEFAULT_LIST_POSITION";
    defaultListPosition: Position;
    constructor(defaultListPosition: Position) {
        this.defaultListPosition = defaultListPosition;
    }
}

export class UpdateDefaultListType implements AppAction {
    type: AppActionType = "SETTINGS_UPDATE_DEFAULT_LIST_TYPE";
    defaultListType: ListType;
    constructor(defaultListType: ListType) {
        this.defaultListType = defaultListType;
    }
}

class ModalVisible implements AppAction {
    type: AppActionType;
    collectionType: CollectionViewCellType;
    isVisible: boolean;
    constructor(
        type: AppActionType,
        collectionType: CollectionViewCellType,
        isVisible: boolean
    ) {
        this.type = type;
        this.collectionType = collectionType;
        this.isVisible = isVisible;
    }
}

export class UpdateModalVisible extends ModalVisible {
    index: number;
    visibleFrom: CollectionViewCellType;
    constructor(
        collectionType: CollectionViewCellType,
        isVisible: boolean,
        index?: number,
        visibleFrom?: CollectionViewCellType
    ) {
        super("CELL_MODAL_VISIBLE", collectionType, isVisible);
        this.collectionType = collectionType;
        this.index = index ?? -1;
        this.visibleFrom = visibleFrom ?? "List";
    }
}

export class UpdateDeleteModalVisible extends ModalVisible {
    constructor(collectionType: CollectionViewCellType, isVisible: boolean) {
        super("CELL_DELETE_MODAL_VISIBLE", collectionType, isVisible);
    }
}

/**
 * Lists
 */
export class AddList implements AppAction {
    type: AppActionType = "LISTS_ADD";
    addListParams: ListParams;
    isAltAction: boolean;
    constructor(addListParams: ListParams, isAltAction: boolean) {
        this.addListParams = addListParams;
        this.isAltAction = isAltAction;
    }
}

export class UpdateList implements AppAction {
    type: AppActionType = "LISTS_UPDATE";
    updateListParams: ListParams;
    isAltAction: boolean;
    constructor(updateListParams: ListParams, isAltAction: boolean) {
        this.updateListParams = updateListParams;
        this.isAltAction = isAltAction;
    }
}

export class UpdateLists implements AppAction {
    type: AppActionType = "LISTS_UPDATE_ALL";
    lists: List[];
    constructor(lists: List[]) {
        this.lists = lists;
    }
}

export class DeleteLists implements AppAction {
    type: AppActionType = "LISTS_DELETE";
}

export class SelectAllLists implements AppAction {
    type: AppActionType = "LISTS_SELECT_ALL";
    isSelected: boolean;
    constructor(isSelected: boolean) {
        this.isSelected = isSelected;
    }
}

export class SelectList implements AppAction {
    type: AppActionType = "LISTS_SELECT";
    index: number;
    isSelected: boolean;
    constructor(index: number, isSelected: boolean) {
        this.index = index;
        this.isSelected = isSelected;
    }
}

/**
 * Items
 */
class ItemsAction implements AppAction {
    type: AppActionType;
    listIndex: number;
    constructor(type: AppActionType, listIndex: number) {
        this.type = type;
        this.listIndex = listIndex;
    }
}

export class AddItem implements AppAction {
    type: AppActionType = "ITEMS_ADD";
    addItemParams: ItemParams;
    isAltAction: boolean;
    constructor(addItemParams: ItemParams, isAltAction: boolean) {
        this.addItemParams = addItemParams;
        this.isAltAction = isAltAction;
    }
}

export class UpdateItem implements AppAction {
    type: AppActionType = "ITEMS_UPDATE";
    updateItemParams: ItemParams;
    isAltAction: boolean;
    constructor(updateItemParams: ItemParams, isAltAction: boolean) {
        this.updateItemParams = updateItemParams;
        this.isAltAction = isAltAction;
    }
}

export class UpdateItems extends ItemsAction {
    items: Item[];
    constructor(listIndex: number, items: Item[]) {
        super("ITEMS_UPDATE_ALL", listIndex);
        this.items = items;
    }
}

export class DeleteItems extends ItemsAction {
    constructor(listIndex: number) {
        super("ITEMS_DELETE", listIndex);
    }
}

export class SelectItem extends ItemsAction {
    index: number;
    isSelected: boolean;
    constructor(listIndex: number, index: number, isSelected: boolean) {
        super("ITEMS_SELECT", listIndex);
        this.index = index;
        this.isSelected = isSelected;
    }
}

export class SelectAllItems extends ItemsAction {
    isSelected: boolean;
    constructor(listIndex: number, isSelected: boolean) {
        super("ITEMS_SELECT_ALL", listIndex);
        this.isSelected = isSelected;
    }
}

export class ItemsIsComplete extends ItemsAction {
    isComplete: boolean;
    constructor(listIndex: number, isComplete: boolean) {
        super("ITEMS_IS_COMPLETE_ALL", listIndex);
        this.isComplete = isComplete;
    }
}

export class ItemIsComplete extends ItemsAction {
    index: number;
    constructor(listIndex: number, index: number) {
        super("ITEMS_IS_COMPLETE", listIndex);
        this.index = index;
    }
}

export class UpdateCopyModalVisible extends ModalVisible {
    constructor(isVisible: boolean) {
        super("ITEMS_MOVE_MODAL_VISIBLE", "Item", isVisible);
    }
}

export class MoveItems implements AppAction {
    type: AppActionType = "ITEMS_MOVE";
    action: MoveItemAction;
    currentListIndex: number;
    sourceListIndex: number;
    destinationListIndex: number;
    constructor(
        action: MoveItemAction,
        currentListIndex: number,
        sourceListIndex: number,
        destinationListIndex: number
    ) {
        this.action = action;
        this.currentListIndex = currentListIndex;
        this.sourceListIndex = sourceListIndex;
        this.destinationListIndex = destinationListIndex;
    }
}

/**
 * Reducer
 */
export function appReducer(prevState: AppData, action: AppAction): AppData {
    const { settings, lists, listsState, itemsState, accountState } = prevState;

    switch (action.type) {
        case "UPDATE_ALL": {
            const {
                settings: newSettings,
                lists: newLists,
                username: newUsername,
            } = action as UpdateAll;
            return {
                settings: newSettings,
                lists: newLists,
                listsState: listsState,
                itemsState: itemsState,
                accountState: {
                    username: newUsername,
                    isAccountCreationModalVisible: newUsername === undefined,
                },
            };
        }

        case "UPDATE_USERNAME": {
            const { newUsername } = action as UpdateUsername;
            const { isAccountCreationModalVisible } = accountState;
            return {
                settings: settings,
                lists: lists,
                listsState: listsState,
                itemsState: itemsState,
                accountState: {
                    username: newUsername,
                    isAccountCreationModalVisible:
                        isAccountCreationModalVisible,
                },
            };
        }

        case "UPDATE_IS_ACCOUNT_CREATION_MODAL_VISIBLE": {
            const { isAccountCreationModalVisible } =
                action as UpdateIsAccountCreationModalVisible;
            return {
                settings: settings,
                lists: lists,
                listsState: listsState,
                itemsState: itemsState,
                accountState: {
                    ...accountState,
                    isAccountCreationModalVisible,
                },
            };
        }

        case "UPDATE_ACCOUNT_CREATION_ERROR": {
            const { error } = action as UpdateAccountCreationError;
            return {
                settings: settings,
                lists: lists,
                listsState: listsState,
                itemsState: itemsState,
                accountState: {
                    ...accountState,
                    error,
                },
            };
        }

        case "SETTINGS_UPDATE_DEVELOPER_MODE": {
            const isDeveloperModeEnabled: boolean = (
                action as UpdateDeveloperMode
            ).isDeveloperModeEnabled;

            const newSettings: Settings = {
                isDeveloperModeEnabled: isDeveloperModeEnabled,
                defaultListPosition: settings.defaultListPosition,
                defaultListType: settings.defaultListType,
            };

            return {
                settings: newSettings,
                lists: lists,
                listsState: listsState,
                itemsState: itemsState,
                accountState: accountState,
            };
        }

        case "SETTINGS_UPDATE_DEFAULT_LIST_POSITION": {
            const defaultListPosition: Position = (
                action as UpdateDefaultListPosition
            ).defaultListPosition;

            const newSettings: Settings = {
                isDeveloperModeEnabled: settings.isDeveloperModeEnabled,
                defaultListPosition: defaultListPosition,
                defaultListType: settings.defaultListType,
            };

            return {
                settings: newSettings,
                lists: lists,
                listsState: listsState,
                itemsState: itemsState,
                accountState: accountState,
            };
        }

        case "SETTINGS_UPDATE_DEFAULT_LIST_TYPE": {
            const defaultListType: ListType = (action as UpdateDefaultListType)
                .defaultListType;

            const newSettings: Settings = {
                isDeveloperModeEnabled: settings.isDeveloperModeEnabled,
                defaultListPosition: settings.defaultListPosition,
                defaultListType: defaultListType,
            };

            return {
                settings: newSettings,
                lists: lists,
                listsState: listsState,
                itemsState: itemsState,
                accountState: accountState,
            };
        }

        case "LISTS_ADD": {
            const {
                addListParams: { newPos, list },
                isAltAction,
            } = action as AddList;

            const newLists: List[] = insertAt(newPos, list, lists);

            return {
                settings: settings,
                lists: newLists,
                itemsState: itemsState,
                listsState: {
                    isDeleteAllModalVisible: false,
                    isModalVisible: isAltAction,
                    currentIndex: -1,
                    visibleFrom: "List",
                },
                accountState: accountState,
            };
        }

        case "LISTS_UPDATE": {
            const {
                updateListParams: { oldPos, newPos, list },
                isAltAction,
            } = action as UpdateList;

            const newLists: List[] = updateAt(list, lists, oldPos, newPos);

            const { currentIndex } = listsState;

            /**
             * If the user invokes the alternate action while adding a new list, the modal
             * will reset to add another list.
             *
             * If the user invokes the alternate action while editing a list, the modal will
             * reset to the next list, allowing the user to continually update subsequent
             * lists. If the user is on the last list and clicks "next", the modal will
             * dismiss itself.
             *
             * When updating, the index is reset to -1 after going beyond the end of the list.
             */
            const altActionListsState: ListsState = {
                currentIndex:
                    currentIndex + 1 < lists.length ? currentIndex + 1 : -1,
                isModalVisible: currentIndex + 1 < lists.length,
                isDeleteAllModalVisible: false,
                visibleFrom: "List",
            };

            const newListsState: ListsState = isAltAction
                ? altActionListsState
                : {
                      isModalVisible: false,
                      currentIndex: -1,
                      isDeleteAllModalVisible: false,
                      visibleFrom: "List",
                  };

            return {
                settings: settings,
                lists: newLists,
                listsState: newListsState,
                itemsState: itemsState,
                accountState: accountState,
            };
        }

        case "LISTS_UPDATE_ALL": {
            const { lists: newLists } = action as UpdateLists;

            return {
                settings: settings,
                lists: newLists,
                listsState: listsState,
                itemsState: itemsState,
                accountState: accountState,
            };
        }

        case "LISTS_DELETE": {
            // Filter out lists that are not selected because those are the lists we want to keep.
            const newLists: List[] = lists.filter((list) => !list.isSelected);

            return {
                settings: settings,
                lists: newLists,
                listsState: {
                    isDeleteAllModalVisible: false,
                    currentIndex: -1,
                    isModalVisible: false,
                    visibleFrom: "List",
                },
                itemsState: itemsState,
                accountState: accountState,
            };
        }

        case "LISTS_SELECT": {
            const { index, isSelected } = action as SelectList;

            const newLists: List[] = lists.map((l, i) =>
                l.setIsSelected(i === index ? isSelected : l.isSelected)
            );

            return {
                settings: settings,
                lists: newLists,
                listsState: listsState,
                itemsState: itemsState,
                accountState: accountState,
            };
        }

        case "LISTS_SELECT_ALL": {
            const { isSelected } = action as SelectAllLists;
            return {
                settings: settings,
                lists: lists.map((list) => list.setIsSelected(isSelected)),
                listsState: listsState,
                itemsState: itemsState,
                accountState: accountState,
            };
        }

        case "ITEMS_ADD": {
            const {
                addItemParams: { listIndex, item, newPos },
                isAltAction,
            } = action as AddItem;

            const items: Item[] = getListItems(lists, listIndex);
            const newItems: Item[] = insertAt(newPos, item, items);
            const newLists: List[] = updateLists(lists, listIndex, newItems);

            return {
                settings: settings,
                lists: newLists,
                listsState: listsState,
                itemsState: {
                    isCopyModalVisible: false,
                    isDeleteAllModalVisible: false,
                    isModalVisible: isAltAction,
                    currentIndex: -1,
                },
                accountState: accountState,
            };
        }

        case "ITEMS_UPDATE": {
            const {
                updateItemParams: { oldPos, newPos, listIndex, item },
                isAltAction,
            } = action as UpdateItem;
            const { currentIndex } = itemsState;

            const items: Item[] = getListItems(lists, listIndex);
            const newItems: Item[] = updateAt(item, items, oldPos, newPos);
            const newLists: List[] = updateLists(lists, listIndex, newItems);

            /**
             * If the user invokes the alternate action while adding a new item, the modal
             * will reset to allow them to add another item.
             *
             * If the user invokes the alternate action while editing an item, the modal will
             * reset to the next item, allowing the user to continually update subsequent
             * items. If the user is on the last list and clicks "next", the modal will
             * dismiss itself.
             */
            const altActionItemsState: ItemsState = {
                currentIndex:
                    currentIndex + 1 < items.length ? currentIndex + 1 : -1,
                isModalVisible: currentIndex + 1 < items.length,
                isCopyModalVisible: false,
                isDeleteAllModalVisible: false,
            };

            const newItemsState: ItemsState = isAltAction
                ? altActionItemsState
                : {
                      isModalVisible: false,
                      currentIndex: -1,
                      isCopyModalVisible: false,
                      isDeleteAllModalVisible: false,
                  };

            return {
                settings: settings,
                lists: newLists,
                listsState: listsState,
                itemsState: newItemsState,
                accountState: accountState,
            };
        }

        case "ITEMS_UPDATE_ALL": {
            const { listIndex, items } = action as UpdateItems;

            const newLists: List[] = updateLists(lists, listIndex, items);

            return {
                settings: settings,
                lists: newLists,
                listsState: listsState,
                itemsState: itemsState,
                accountState: accountState,
            };
        }

        case "ITEMS_DELETE": {
            const { listIndex } = action as DeleteItems;

            const items: Item[] = getListItems(lists, listIndex);

            // Filter items that are not selected because those are the items we want to keep.
            const newItems: Item[] = items.filter((item) => !item.isSelected);

            const newLists: List[] = updateLists(lists, listIndex, newItems);

            return {
                settings: settings,
                lists: newLists,
                listsState: listsState,
                itemsState: {
                    isDeleteAllModalVisible: false,
                    currentIndex: -1,
                    isModalVisible: false,
                    isCopyModalVisible: false,
                },
                accountState: accountState,
            };
        }

        case "ITEMS_SELECT": {
            const { listIndex, index, isSelected } = action as SelectItem;

            const items: Item[] = getListItems(lists, listIndex);

            const newItems: Item[] = items.map((item, idx) =>
                item.setIsSelected(idx === index ? isSelected : item.isSelected)
            );

            const newLists: List[] = updateLists(lists, listIndex, newItems);

            return {
                settings: settings,
                lists: newLists,
                listsState: listsState,
                itemsState: itemsState,
                accountState: accountState,
            };
        }

        case "ITEMS_SELECT_ALL": {
            const { listIndex, isSelected } = action as SelectAllItems;
            const items: Item[] = getListItems(lists, listIndex);
            const newItems: Item[] = items.map((i) =>
                i.setIsSelected(isSelected && !i.ignoreSelectAll)
            );
            const newLists: List[] = updateLists(lists, listIndex, newItems);

            return {
                settings: settings,
                lists: newLists,
                listsState: listsState,
                itemsState: itemsState,
                accountState: accountState,
            };
        }

        case "ITEMS_IS_COMPLETE_ALL": {
            const { listIndex, isComplete } = action as ItemsIsComplete;

            const items: Item[] = getListItems(lists, listIndex);

            const newItems: Item[] = items.map((item) => {
                // Only apply the changes to items that are selected.
                const newIsComplete: boolean = item.isSelected
                    ? isComplete
                    : item.isComplete;
                return item.setIsComplete(newIsComplete);
            });

            const newLists: List[] = updateLists(lists, listIndex, newItems);

            return {
                settings: settings,
                lists: newLists,
                listsState: listsState,
                itemsState: itemsState,
                accountState: accountState,
            };
        }

        case "ITEMS_IS_COMPLETE": {
            const { listIndex, index } = action as ItemIsComplete;

            const items: Item[] = getListItems(lists, listIndex);
            const newItems: Item[] = items.map((item, i) =>
                i === index ? item.setIsComplete(!item.isComplete) : item
            );

            const newLists: List[] = updateLists(lists, listIndex, newItems);

            return {
                settings: settings,
                lists: newLists,
                listsState: listsState,
                itemsState: itemsState,
                accountState: accountState,
            };
        }

        case "ITEMS_MOVE": {
            const {
                action: moveAction,
                currentListIndex,
                sourceListIndex,
                destinationListIndex,
            } = action as MoveItems;

            const sourceList: List = getList(lists, sourceListIndex);
            const sourceListItems: Item[] = sourceList.items;

            const destinationList: List = getList(lists, destinationListIndex);
            const destinationListItems: Item[] = destinationList.items;

            /**
             * 1. If the source list is the current list AND items in the current list are selected, only copy
             *    selected items into the destination list.
             * 2. Otherwise, copy ALL items into the destination list.
             * 3. De-select all items
             */
            const newItems: Item[] = destinationListItems
                .concat(
                    sourceListIndex === currentListIndex
                        ? sourceListItems.filter((item) => item.isSelected)
                        : sourceListItems
                )
                .map((item) => item.setIsSelected(false));

            const newItemsState: ItemsState = {
                isModalVisible: false,
                currentIndex: -1,
                isCopyModalVisible: false,
                isDeleteAllModalVisible: false,
            };

            if (moveAction === "Copy") {
                /**
                 * If the destination is the current list, set the new items to the current list.
                 *
                 * If the destination list is NOT the current list, set the new items to the other list.
                 */
                const newLists: List[] = lists.map((list, index) => {
                    if (index === destinationListIndex)
                        return destinationList.updateItems(newItems);
                    else if (index === sourceListIndex)
                        return list.selectAllItems(false);
                    return list;
                });

                return {
                    settings: settings,
                    lists: newLists,
                    listsState: listsState,
                    itemsState: newItemsState,
                    accountState: accountState,
                };
            }

            /**
             * action === "move"
             *
             * If the destination is the current list:
             *   1. Set the new items to the current list
             *   2. Empty source list
             * If the destination list is NOT the current list:
             *   1. Set the new items to the other list
             *   2. Empty current list OR set it to all non-selected items (based on whether items are
             *      selected or not).
             */
            const itemsToKeep: Item[] =
                sourceListIndex === currentListIndex
                    ? sourceListItems.filter((item) => !item.isSelected)
                    : [];

            const newLists: List[] = lists.map((list, index) => {
                if (index === destinationListIndex)
                    return list.updateItems(newItems);
                else if (index === sourceListIndex)
                    return list.updateItems(itemsToKeep);
                return list;
            });

            return {
                settings: settings,
                lists: newLists,
                listsState: listsState,
                itemsState: newItemsState,
                accountState: accountState,
            };
        }

        case "ITEMS_MOVE_MODAL_VISIBLE": {
            // Items are the only view that have move/copy functionality, so we do not
            // need to handle multiple cell types.
            const { isVisible } = action as UpdateCopyModalVisible;
            const { isDeleteAllModalVisible, isModalVisible, currentIndex } =
                itemsState;

            return {
                settings: settings,
                lists: lists,
                itemsState: {
                    isDeleteAllModalVisible: isDeleteAllModalVisible,
                    isModalVisible: isModalVisible,
                    currentIndex: currentIndex,
                    isCopyModalVisible: isVisible,
                },
                listsState: listsState,
                accountState: accountState,
            };
        }

        case "CELL_MODAL_VISIBLE": {
            const { collectionType, isVisible, index, visibleFrom } =
                action as UpdateModalVisible;

            switch (collectionType) {
                case "List": {
                    return {
                        settings: settings,
                        lists: lists,
                        listsState: {
                            isModalVisible: isVisible,
                            currentIndex: index,
                            isDeleteAllModalVisible: false,
                            visibleFrom: visibleFrom,
                        },
                        itemsState: itemsState,
                        accountState: accountState,
                    };
                }
                case "Item": {
                    return {
                        settings: settings,
                        lists: lists,
                        listsState: listsState,
                        itemsState: {
                            isModalVisible: isVisible,
                            currentIndex: index,
                            isCopyModalVisible: false,
                            isDeleteAllModalVisible: false,
                        },
                        accountState: accountState,
                    };
                }
            }
        }

        case "CELL_DELETE_MODAL_VISIBLE": {
            const { collectionType, isVisible } =
                action as UpdateDeleteModalVisible;

            switch (collectionType) {
                case "Item": {
                    const { currentIndex, isModalVisible, isCopyModalVisible } =
                        itemsState;
                    return {
                        settings: settings,
                        lists: lists,
                        itemsState: {
                            currentIndex: currentIndex,
                            isModalVisible: isModalVisible,
                            isCopyModalVisible: isCopyModalVisible,
                            isDeleteAllModalVisible: isVisible,
                        },
                        listsState: listsState,
                        accountState: accountState,
                    };
                }

                case "List": {
                    const { currentIndex, isModalVisible } = listsState;
                    return {
                        settings: settings,
                        lists: lists,
                        itemsState: itemsState,
                        listsState: {
                            currentIndex: currentIndex,
                            isModalVisible: isModalVisible,
                            isDeleteAllModalVisible: isVisible,
                            visibleFrom: "List",
                        },
                        accountState: accountState,
                    };
                }
            }
        }

        default:
            throw Error(`Unknown action for settings reducer: ${action.type}`);
    }
}
