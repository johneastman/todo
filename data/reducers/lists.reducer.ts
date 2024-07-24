import { ItemParams, ListParams, MoveItemAction } from "../../types";
import {
    getList,
    getListItems,
    insertAt,
    updateAt,
    updateLists,
} from "../../utils";
import { Item, List } from "../data";

export type ListsData = {
    lists: List[];
};

export type ListsActionType =
    | "UPDATE_ALL"
    | "LISTS_SELECT_ALL"
    | "LISTS_SELECT_MULTIPLE"
    | "LISTS_SELECT"
    | "LISTS_DELETE"
    | "LISTS_UPDATE"
    | "LISTS_ADD"
    | "LISTS_UPDATE_ALL"
    | "ITEMS_ADD"
    | "ITEMS_UPDATE"
    | "ITEMS_DELETE"
    | "ITEMS_SELECT"
    | "ITEMS_SELECT_MULTIPLE"
    | "ITEMS_SELECT_ALL"
    | "ITEMS_SELECT_WHERE"
    | "ITEMS_IS_COMPLETE_ALL"
    | "ITEMS_IS_COMPLETE"
    | "ITEMS_UPDATE_ALL"
    | "ITEMS_MOVE";

/**
 * I originally wanted to add "isCellModalVisible" and "currentCellIndex"
 * properties to the state, but that caused the list modal to be visible
 * at the same time as the item modal. Creating separate substates for
 * items and lists will avoid that, as well as allow for handling data
 * unique to each state.
 */
export interface ListsAction {
    type: ListsActionType;
}

export class UpdateAll implements ListsAction {
    type: ListsActionType = "UPDATE_ALL";
    lists: List[];
    constructor(lists: List[]) {
        this.lists = lists;
    }
}

/**
 * Lists
 */
export class AddList implements ListsAction {
    type: ListsActionType = "LISTS_ADD";
    addListParams: ListParams;
    constructor(addListParams: ListParams) {
        this.addListParams = addListParams;
    }
}

export class UpdateList implements ListsAction {
    type: ListsActionType = "LISTS_UPDATE";
    updateListParams: ListParams;
    constructor(updateListParams: ListParams) {
        this.updateListParams = updateListParams;
    }
}

export class UpdateLists implements ListsAction {
    type: ListsActionType = "LISTS_UPDATE_ALL";
    lists: List[];
    constructor(lists: List[]) {
        this.lists = lists;
    }
}

export class DeleteLists implements ListsAction {
    type: ListsActionType = "LISTS_DELETE";
}

export class SelectAllLists implements ListsAction {
    type: ListsActionType = "LISTS_SELECT_ALL";
    isSelected: boolean;
    constructor(isSelected: boolean) {
        this.isSelected = isSelected;
    }
}

export class SelectMultipleLists implements ListsAction {
    type: ListsActionType = "LISTS_SELECT_MULTIPLE";
    indices: number[];
    isSelected: boolean;
    constructor(indices: number[], isSelected: boolean) {
        this.indices = indices;
        this.isSelected = isSelected;
    }
}

export class SelectList implements ListsAction {
    type: ListsActionType = "LISTS_SELECT";
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
class ItemsAction implements ListsAction {
    type: ListsActionType;
    listIndex: number;
    constructor(type: ListsActionType, listIndex: number) {
        this.type = type;
        this.listIndex = listIndex;
    }
}

export class AddItem implements ListsAction {
    type: ListsActionType = "ITEMS_ADD";
    addItemParams: ItemParams;
    isAltAction: boolean;
    constructor(addItemParams: ItemParams, isAltAction: boolean) {
        this.addItemParams = addItemParams;
        this.isAltAction = isAltAction;
    }
}

export class UpdateItem implements ListsAction {
    type: ListsActionType = "ITEMS_UPDATE";
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

export class SelectMultipleItems extends ItemsAction {
    indices: number[];
    isSelected: boolean;
    constructor(listIndex: number, indices: number[], isSelected: boolean) {
        super("ITEMS_SELECT_MULTIPLE", listIndex);
        this.indices = indices;
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

export class SelectItemsWhere extends ItemsAction {
    predicate: (item: Item) => boolean;
    constructor(listIndex: number, predicate: (item: Item) => boolean) {
        super("ITEMS_SELECT_WHERE", listIndex);
        this.predicate = predicate;
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

export class MoveItems implements ListsAction {
    type: ListsActionType = "ITEMS_MOVE";
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
export function listsReducer(
    prevState: ListsData,
    action: ListsAction
): ListsData {
    const { lists } = prevState;

    switch (action.type) {
        case "UPDATE_ALL": {
            const { lists: newLists } = action as UpdateAll;
            return {
                lists: newLists,
            };
        }

        case "LISTS_ADD": {
            const {
                addListParams: { newPos, list },
            } = action as AddList;

            const newLists: List[] = insertAt(newPos, list, lists);

            return {
                lists: newLists,
            };
        }

        case "LISTS_UPDATE": {
            const {
                updateListParams: { oldPos, newPos, list },
            } = action as UpdateList;

            const newLists: List[] = updateAt(list, lists, oldPos, newPos);

            return {
                lists: newLists,
            };
        }

        case "LISTS_UPDATE_ALL": {
            const { lists: newLists } = action as UpdateLists;

            return {
                lists: newLists,
            };
        }

        case "LISTS_DELETE": {
            // Filter out lists that are not selected because those are the lists we want to keep.
            const newLists: List[] = lists.filter((list) => !list.isSelected);

            return {
                lists: newLists,
            };
        }

        case "LISTS_SELECT": {
            const { index, isSelected } = action as SelectList;

            const newLists: List[] = lists.map((l, i) =>
                l.setIsSelected(i === index ? isSelected : l.isSelected)
            );

            return {
                lists: newLists,
            };
        }

        case "LISTS_SELECT_MULTIPLE": {
            const { indices, isSelected } = action as SelectMultipleLists;

            const newLists: List[] = lists.map((l, i) =>
                l.setIsSelected(indices.includes(i) ? isSelected : l.isSelected)
            );

            return {
                lists: newLists,
            };
        }

        case "LISTS_SELECT_ALL": {
            const { isSelected } = action as SelectAllLists;
            return {
                lists: lists.map((list) => list.setIsSelected(isSelected)),
            };
        }

        case "ITEMS_ADD": {
            const {
                addItemParams: { listIndex, item, newPos },
            } = action as AddItem;

            const items: Item[] = getListItems(lists, listIndex);
            const newItems: Item[] = insertAt(newPos, item, items);
            const newLists: List[] = updateLists(lists, listIndex, newItems);

            return {
                lists: newLists,
            };
        }

        case "ITEMS_UPDATE": {
            const {
                updateItemParams: { oldPos, newPos, listIndex, item },
            } = action as UpdateItem;

            const items: Item[] = getListItems(lists, listIndex);
            const newItems: Item[] = updateAt(item, items, oldPos, newPos);
            const newLists: List[] = updateLists(lists, listIndex, newItems);

            return {
                lists: newLists,
            };
        }

        case "ITEMS_UPDATE_ALL": {
            const { listIndex, items } = action as UpdateItems;

            const newLists: List[] = updateLists(lists, listIndex, items);

            return {
                lists: newLists,
            };
        }

        case "ITEMS_DELETE": {
            const { listIndex } = action as DeleteItems;

            const items: Item[] = getListItems(lists, listIndex);

            // Filter items that are not selected because those are the items we want to keep.
            const newItems: Item[] = items.filter((item) => !item.isSelected);

            const newLists: List[] = updateLists(lists, listIndex, newItems);

            return {
                lists: newLists,
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
                lists: newLists,
            };
        }

        case "ITEMS_SELECT_MULTIPLE": {
            const { listIndex, indices, isSelected } =
                action as SelectMultipleItems;
            const items: Item[] = getListItems(lists, listIndex);
            const newItems: Item[] = items.map((item, idx) =>
                item.setIsSelected(
                    indices.includes(idx) ? isSelected : item.isSelected
                )
            );
            const newLists: List[] = updateLists(lists, listIndex, newItems);

            return {
                lists: newLists,
            };
        }

        case "ITEMS_SELECT_ALL": {
            const { listIndex, isSelected } = action as SelectAllItems;
            const items: Item[] = getListItems(lists, listIndex);
            const newItems: Item[] = items.map((i) =>
                i.setIsSelected(isSelected)
            );
            const newLists: List[] = updateLists(lists, listIndex, newItems);

            return {
                lists: newLists,
            };
        }

        case "ITEMS_SELECT_WHERE": {
            const { listIndex, predicate } = action as SelectItemsWhere;
            const items: Item[] = getListItems(lists, listIndex);
            const newItems: Item[] = items.map((item: Item) =>
                item.setIsSelected(predicate(item))
            );
            const newLists: List[] = updateLists(lists, listIndex, newItems);

            return {
                lists: newLists,
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
                lists: newLists,
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
                lists: newLists,
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
                    lists: newLists,
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
                lists: newLists,
            };
        }

        default:
            throw Error(`Unknown action for lists reducer: ${action.type}`);
    }
}
