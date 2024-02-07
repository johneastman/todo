import {
    AppAction,
    AppActionType,
    AppData,
    CollectionViewCellType,
    ItemCRUD,
    ItemsState,
    ListCRUD,
    ListType,
    ListsState,
    MoveItemAction,
    Position,
    Settings,
} from "../../types";
import {
    getList,
    getListItems,
    insertAt,
    updateAt,
    updateCollection,
    updateLists,
} from "../../utils";
import { Item, List } from "../data";

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

/**
 * All
 */
export class UpdateAll implements AppAction {
    type: AppActionType = "UPDATE_ALL";
    settings: Settings;
    lists: List[];
    constructor(settings: Settings, lists: List[]) {
        this.settings = settings;
        this.lists = lists;
    }
}

export class AddItemModalVisible implements AppAction {
    type: AppActionType = "ITEMS_ADD_MODAL_VISIBLE";
    isVisible: boolean;
    topIndex: number;
    constructor(isVisible: boolean, topIndex: number) {
        this.isVisible = isVisible;
        this.topIndex = topIndex;
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
    constructor(
        collectionType: CollectionViewCellType,
        isVisible: boolean,
        index?: number
    ) {
        super("CELL_MODAL_VISIBLE", collectionType, isVisible);
        this.collectionType = collectionType;
        this.index = index ?? -1;
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
    addListParams: ListCRUD;
    isAltAction: boolean;
    constructor(addListParams: ListCRUD, isAltAction: boolean) {
        this.addListParams = addListParams;
        this.isAltAction = isAltAction;
    }
}

export class UpdateList implements AppAction {
    type: AppActionType = "LISTS_UPDATE";
    updateListParams: ListCRUD;
    isAltAction: boolean;
    constructor(updateListParams: ListCRUD, isAltAction: boolean) {
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
    listId: string;
    constructor(type: AppActionType, listId: string) {
        this.type = type;
        this.listId = listId;
    }
}

export class AddItem implements AppAction {
    type: AppActionType = "ITEMS_ADD";
    addItemParams: ItemCRUD;
    isAltAction: boolean;
    constructor(addItemParams: ItemCRUD, isAltAction: boolean) {
        this.addItemParams = addItemParams;
        this.isAltAction = isAltAction;
    }
}

export class UpdateItem implements AppAction {
    type: AppActionType = "ITEMS_UPDATE";
    updateItemParams: ItemCRUD;
    isAltAction: boolean;
    constructor(updateItemParams: ItemCRUD, isAltAction: boolean) {
        this.updateItemParams = updateItemParams;
        this.isAltAction = isAltAction;
    }
}

export class UpdateItems extends ItemsAction {
    items: Item[];
    constructor(listId: string, items: Item[]) {
        super("ITEMS_UPDATE_ALL", listId);
        this.listId = listId;
        this.items = items;
    }
}

export class DeleteItems extends ItemsAction {
    constructor(listId: string) {
        super("ITEMS_DELETE", listId);
    }
}

export class SelectItem extends ItemsAction {
    index: number;
    isSelected: boolean;
    constructor(listId: string, index: number, isSelected: boolean) {
        super("ITEMS_SELECT", listId);
        this.index = index;
        this.isSelected = isSelected;
    }
}

export class SelectAllItems extends ItemsAction {
    isSelected: boolean;
    constructor(listId: string, isSelected: boolean) {
        super("ITEMS_SELECT_ALL", listId);
        this.isSelected = isSelected;
    }
}

export class ItemsIsComplete extends ItemsAction {
    isComplete: boolean;
    constructor(listId: string, isComplete: boolean) {
        super("ITEMS_IS_COMPLETE_ALL", listId);
        this.isComplete = isComplete;
    }
}

export class ItemIsComplete extends ItemsAction {
    index: number;
    constructor(listId: string, index: number) {
        super("ITEMS_IS_COMPLETE", listId);
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
    currentListId: string;
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

/**
 * Reducer
 */
export function appReducer(prevState: AppData, action: AppAction): AppData {
    const { settings, lists, listsState, itemsState } = prevState;

    switch (action.type) {
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
            };
        }

        case "LISTS_ADD": {
            const {
                addListParams: { newPos, list },
                isAltAction,
            } = action as AddList;

            let newLists: List[] =
                newPos === "top" ? [list].concat(lists) : lists.concat(list);

            return {
                settings: settings,
                lists: newLists,
                itemsState: itemsState,
                listsState: {
                    isDeleteAllModalVisible: false,
                    isModalVisible: isAltAction,
                    currentIndex: -1,
                },
            };
        }

        case "LISTS_UPDATE": {
            const {
                updateListParams: { oldPos, newPos, list },
                isAltAction,
            } = action as UpdateList;

            let newLists: List[] = updateCollection(
                list,
                lists.concat(),
                oldPos,
                newPos
            );

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

        case "LISTS_UPDATE_ALL": {
            const { lists: newLists } = action as UpdateLists;

            return {
                settings: settings,
                lists: newLists,
                listsState: listsState,
                itemsState: itemsState,
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
                },
                itemsState: itemsState,
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
            };
        }

        case "LISTS_SELECT_ALL": {
            const { isSelected } = action as SelectAllLists;
            return {
                settings: settings,
                lists: lists.map((list) => list.setIsSelected(isSelected)),
                listsState: listsState,
                itemsState: itemsState,
            };
        }

        case "ITEMS_ADD": {
            const {
                addItemParams: { listId, item, newPos },
                isAltAction,
            } = action as AddItem;
            const { topIndex } = itemsState;

            const items: Item[] = getListItems(lists, listId);
            const newItems: Item[] = insertAt(newPos, item, items);
            const newLists: List[] = updateLists(lists, listId, newItems);

            return {
                settings: settings,
                lists: newLists,
                listsState: listsState,
                itemsState: {
                    isCopyModalVisible: false,
                    isDeleteAllModalVisible: false,
                    isModalVisible: isAltAction,
                    currentIndex: -1,
                    topIndex: isAltAction ? topIndex : -1,
                },
            };
        }

        case "ITEMS_UPDATE": {
            const {
                updateItemParams: { oldPos, newPos, listId, item },
                isAltAction,
            } = action as UpdateItem;
            const { currentIndex, topIndex } = itemsState;

            const items: Item[] = getListItems(lists, listId);
            const newItems: Item[] = updateAt(item, items, oldPos, newPos);
            const newLists: List[] = updateLists(lists, listId, newItems);

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
                topIndex: topIndex,
            };

            const newItemsState: ItemsState = isAltAction
                ? altActionItemsState
                : {
                      isModalVisible: false,
                      currentIndex: -1,
                      isCopyModalVisible: false,
                      isDeleteAllModalVisible: false,
                      topIndex: -1,
                  };

            return {
                settings: settings,
                lists: newLists,
                listsState: listsState,
                itemsState: newItemsState,
            };
        }

        case "ITEMS_UPDATE_ALL": {
            const { listId, items } = action as UpdateItems;

            const newLists: List[] = updateLists(lists, listId, items);

            return {
                settings: settings,
                lists: newLists,
                listsState: listsState,
                itemsState: itemsState,
            };
        }

        case "ITEMS_DELETE": {
            const { listId } = action as DeleteItems;

            const items: Item[] = getListItems(lists, listId);

            // Filter items that are not selected because those are the items we want to keep.
            const newItems: Item[] = items.filter((item) => !item.isSelected);

            const newLists: List[] = updateLists(lists, listId, newItems);

            return {
                settings: settings,
                lists: newLists,
                listsState: listsState,
                itemsState: {
                    isDeleteAllModalVisible: false,
                    currentIndex: -1,
                    isModalVisible: false,
                    isCopyModalVisible: false,
                    topIndex: -1,
                },
            };
        }

        case "ITEMS_SELECT": {
            const { listId, index, isSelected } = action as SelectItem;

            const items: Item[] = getListItems(lists, listId);

            const newItems: Item[] = items.map((item, idx) =>
                item.setIsSelected(idx === index ? isSelected : item.isSelected)
            );

            const newLists: List[] = updateLists(lists, listId, newItems);

            return {
                settings: settings,
                lists: newLists,
                listsState: listsState,
                itemsState: itemsState,
            };
        }

        case "ITEMS_SELECT_ALL": {
            const { listId, isSelected } = action as SelectAllItems;
            const items: Item[] = getListItems(lists, listId);
            const newItems: Item[] = items.map((i) =>
                i.setIsSelected(isSelected)
            );
            const newLists: List[] = updateLists(lists, listId, newItems);

            return {
                settings: settings,
                lists: newLists,
                listsState: listsState,
                itemsState: itemsState,
            };
        }

        case "ITEMS_IS_COMPLETE_ALL": {
            const { listId, isComplete } = action as ItemsIsComplete;

            const items: Item[] = getListItems(lists, listId);

            const newItems: Item[] = items.map((item) => {
                // Only apply the changes to items that are selected.
                const newIsComplete: boolean = item.isSelected
                    ? isComplete
                    : item.isComplete;
                return item.setIsComplete(newIsComplete);
            });

            const newLists: List[] = updateLists(lists, listId, newItems);

            return {
                settings: settings,
                lists: newLists,
                listsState: listsState,
                itemsState: itemsState,
            };
        }

        case "ITEMS_IS_COMPLETE": {
            const { listId, index } = action as ItemIsComplete;

            const items: Item[] = getListItems(lists, listId);
            const newItems: Item[] = items.map((item, i) =>
                i === index ? item.setIsComplete(!item.isComplete) : item
            );

            const newLists: List[] = updateLists(lists, listId, newItems);

            return {
                settings: settings,
                lists: newLists,
                listsState: listsState,
                itemsState: itemsState,
            };
        }

        case "ITEMS_MOVE": {
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
                    sourceListId === currentListId
                        ? sourceListItems.filter((item) => item.isSelected)
                        : sourceListItems
                )
                .map((item) => item.setIsSelected(false));

            const newItemsState: ItemsState = {
                isModalVisible: false,
                currentIndex: -1,
                isCopyModalVisible: false,
                isDeleteAllModalVisible: false,
                topIndex: -1,
            };

            if (moveAction === "Copy") {
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
                sourceListId === currentListId
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
                    topIndex: -1,
                },
                listsState: listsState,
            };
        }

        case "ITEMS_ADD_MODAL_VISIBLE": {
            const { isVisible, topIndex } = action as AddItemModalVisible;
            return {
                settings: settings,
                lists: lists,
                itemsState: {
                    isCopyModalVisible: false,
                    isDeleteAllModalVisible: false,
                    isModalVisible: isVisible,
                    currentIndex: -1,
                    topIndex: topIndex,
                },
                listsState: listsState,
            };
        }

        case "CELL_MODAL_VISIBLE": {
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
                            isCopyModalVisible: false,
                            isDeleteAllModalVisible: false,

                            // TODO: will need to change for "update item" functionality (top + bottom of list, top + bottom of section)
                            topIndex: 0,
                        },
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
                            topIndex: -1,
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
