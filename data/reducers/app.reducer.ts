import {
    AppAction,
    AppActionType,
    AppData,
    CollectionViewCellType,
    ItemsState,
    ListType,
    ListsState,
    MoveItemAction,
    Position,
    Settings,
} from "../../types";
import { areCellsSelected, getList } from "../../utils";
import { Item, List } from "../data";

export class UpdateDeveloperMode implements AppAction {
    type: AppActionType = "UPDATE_DEVELOPER_MODE";
    isDeveloperModeEnabled: boolean;
    constructor(isDeveloperModeEnabled: boolean) {
        this.isDeveloperModeEnabled = isDeveloperModeEnabled;
    }
}

export class UpdateDefaultListPosition implements AppAction {
    type: AppActionType = "UPDATE_DEFAULT_LIST_POSITION";
    defaultListPosition: Position;
    constructor(defaultListPosition: Position) {
        this.defaultListPosition = defaultListPosition;
    }
}

export class UpdateDefaultListType implements AppAction {
    type: AppActionType = "UPDATE_DEFAULT_LIST_TYPE";
    defaultListType: ListType;
    constructor(defaultListType: ListType) {
        this.defaultListType = defaultListType;
    }
}

export class UpdateAll implements AppAction {
    type: AppActionType = "UPDATE_ALL";
    settings: Settings;
    lists: List[];
    constructor(settings: Settings, lists: List[]) {
        this.settings = settings;
        this.lists = lists;
    }
}

export class UpdateLists implements AppAction {
    type: AppActionType = "UPDATE_LISTS";
    lists: List[];
    isAltAction: boolean;
    constructor(lists: List[], isAltAction: boolean) {
        this.lists = lists;
        this.isAltAction = isAltAction;
    }
}

export class UpdateItems implements AppAction {
    type: AppActionType = "UPDATE_ITEMS";
    listId: string;
    items: Item[];
    isAltAction: boolean;
    constructor(listId: string, items: Item[], isAltAction: boolean) {
        this.listId = listId;
        this.items = items;
        this.isAltAction = isAltAction;
    }
}

export class MoveItems implements AppAction {
    action: MoveItemAction;
    currentListId: string;
    type: AppActionType = "MOVE_ITEMS";
    sourceListId: string;
    destinationListId: string;
    constructor(
        action: MoveItemAction,
        currentListId: string,
        sourceListId: string,
        destinationListId: string
    ) {
        this.action = action;
        this.currentListId = currentListId;
        this.sourceListId = sourceListId;
        this.destinationListId = destinationListId;
    }
}

class isModalVisible implements AppAction {
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

export class UpdateModalVisible extends isModalVisible {
    index: number;
    constructor(
        collectionType: CollectionViewCellType,
        isVisible: boolean,
        index?: number
    ) {
        super("UPDATE_MODAL_VISIBLE", collectionType, isVisible);
        this.collectionType = collectionType;
        this.index = index ?? -1;
    }
}

export class UpdateDeleteModalVisible extends isModalVisible {
    constructor(collectionType: CollectionViewCellType, isVisible: boolean) {
        super("DELETE_MODAL_VISIBLE", collectionType, isVisible);
    }
}

export function appReducer(prevState: AppData, action: AppAction): AppData {
    const { settings, lists, listsState, itemsState } = prevState;

    switch (action.type) {
        case "UPDATE_DEVELOPER_MODE": {
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
            };
        }

        case "UPDATE_DEFAULT_LIST_POSITION": {
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
            };
        }

        case "UPDATE_DEFAULT_LIST_TYPE": {
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
            };
        }

        case "UPDATE_ALL": {
            const { settings: newSettings, lists: newLists } =
                action as UpdateAll;
            return {
                settings: newSettings,
                lists: newLists,
                listsState: listsState,
                itemsState: itemsState,
            };
        }

        case "UPDATE_LISTS": {
            const { lists: newLists, isAltAction } = action as UpdateLists;

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
                    currentIndex === -1
                        ? currentIndex
                        : currentIndex + 1 < lists.length
                        ? currentIndex + 1
                        : -1,
                isModalVisible:
                    currentIndex === -1
                        ? true
                        : currentIndex + 1 < lists.length,
                isDeleteAllModalVisible: false,
            };

            const newListsState: ListsState = isAltAction
                ? altActionListsState
                : {
                      isModalVisible: false,
                      currentIndex: -1,
                      isDeleteAllModalVisible: false,
                  };

            return {
                settings: settings,
                lists: newLists,
                listsState: newListsState,
                itemsState: itemsState,
            };
        }

        case "UPDATE_ITEMS": {
            const { listId, items, isAltAction } = action as UpdateItems;

            const listBeingEdited: List = getList(lists, listId);
            if (listBeingEdited === undefined)
                throw Error(`No list found with id: ${listId}`);

            const newLists: List[] = lists.map((list) =>
                list.id === listId ? listBeingEdited.updateItems(items) : list
            );

            const { currentIndex } = itemsState;

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
                    currentIndex === -1
                        ? currentIndex
                        : currentIndex + 1 < items.length
                        ? currentIndex + 1
                        : -1,
                isModalVisible:
                    currentIndex === -1
                        ? true
                        : currentIndex + 1 < items.length,
            };

            const newItemsState: ItemsState = isAltAction
                ? altActionItemsState
                : { isModalVisible: false, currentIndex: -1 };

            return {
                settings: settings,
                lists: newLists,
                listsState: listsState,
                itemsState: newItemsState,
            };
        }

        case "MOVE_ITEMS": {
            const {
                action: moveAction,
                currentListId,
                sourceListId,
                destinationListId,
            } = action as MoveItems;

            const sourceList: List = getList(lists, sourceListId);
            const sourceListItems: Item[] = sourceList.items;

            const destinationList: List = getList(lists, destinationListId);
            const destinationListItems: Item[] = destinationList.items;

            /**
             * 1. If the source list is the current list AND items in the current list are selected, only copy
             *    selected items into the destination list.
             * 2. Otherwise, copy ALL items into the destination list.
             * 3. De-select all items
             */
            const newItems: Item[] = destinationListItems
                .concat(
                    sourceListId === currentListId &&
                        areCellsSelected(sourceListItems)
                        ? sourceListItems.filter((item) => item.isSelected)
                        : sourceListItems
                )
                .map((item) => item.setIsSelected(false));

            const newItemsState: ItemsState = {
                isModalVisible: false,
                currentIndex: -1,
            };

            if (moveAction === "copy") {
                /**
                 * If the destination is the current list, set the new items to the current list.
                 *
                 * If the destination list is NOT the current list, set the new items to the other list.
                 */
                const newLists: List[] = lists.map((list) => {
                    if (list.id === destinationListId)
                        return destinationList.updateItems(newItems);
                    else if (list.id === sourceListId)
                        return list.selectAllItems(false);
                    return list;
                });

                return {
                    settings: settings,
                    lists: newLists,
                    listsState: listsState,
                    itemsState: newItemsState,
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
                sourceListId === currentListId &&
                areCellsSelected(sourceListItems)
                    ? sourceListItems.filter((item) => !item.isSelected)
                    : [];

            const newLists: List[] = lists.map((list) => {
                if (list.id === destinationListId)
                    return list.updateItems(newItems);
                else if (list.id === sourceListId)
                    return list.updateItems(itemsToKeep);
                return list;
            });

            return {
                settings: settings,
                lists: newLists,
                listsState: listsState,
                itemsState: newItemsState,
            };
        }

        case "UPDATE_MODAL_VISIBLE": {
            const { collectionType, isVisible, index } =
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
                        },
                        itemsState: itemsState,
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
                        },
                    };
                }
            }
        }

        case "DELETE_MODAL_VISIBLE": {
            const { collectionType, isVisible } =
                action as UpdateDeleteModalVisible;

            switch (collectionType) {
                case "Item": {
                    const { currentIndex, isModalVisible } = itemsState;
                    return {
                        settings: settings,
                        lists: lists,
                        itemsState: {
                            currentIndex: currentIndex,
                            isModalVisible: isModalVisible,
                        },
                        listsState: listsState,
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
                        },
                    };
                }
            }
        }

        default:
            throw Error(`Unknown action for settings reducer: ${action.type}`);
    }
}
