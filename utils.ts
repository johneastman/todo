import { StyleProp, ViewStyle } from "react-native";

import { Item, List } from "./data/data";
import { ListType, CollectionViewCell, CollectionViewCellType } from "./types";
import { areTestsRunningOverride } from "./env.json";

// Colors
export enum Color {
    LightBlue = "lightblue",
    LightBlueButton = "#0097fb",
    White = "white",
    LightGray = "lightgray",
    Gray = "gray",
    Black = "black",
    Red = "red",
}

export function getDeveloperModeListCellStyles(
    isActive: boolean
): StyleProp<ViewStyle> {
    return {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: Color.Gray,
        backgroundColor: isActive ? Color.LightBlue : Color.White,
    };
}

/* * * * * * * * * *
 * Utility methods *
 * * * * * * * * * */
export function pluralize(
    value: number,
    singular: string,
    plural: string
): string {
    return value === 1 ? singular : plural;
}

export function insertAt<T>(index: number, value: T, collection: T[]): T[] {
    // To add an item to the end of a list, use the length of the list as the index
    return [...collection.slice(0, index), value, ...collection.slice(index)];
}

export function removeAt<T>(index: number, collection: T[]): T[] {
    return [...collection.slice(0, index), ...collection.slice(index + 1)];
}

export function updateAt<T>(
    value: T,
    collection: T[],
    currentIndex: number,
    newIndex?: number
): T[] {
    const listWithValueRemoved: T[] = removeAt(currentIndex, collection);
    return insertAt(newIndex ?? currentIndex, value, listWithValueRemoved);
}

/**
 * Return the total number of items in a list that are not marked as complete.
 *
 * @param listType type of list items are in
 * @param items list of Item objects
 *
 * @returns total number of items based on filter criteria (parameter values).
 */
export function getNumItemsIncomplete(
    listType: ListType,
    items: Item[]
): number {
    // Only shopping lists should use the quantity for the items count. All other types can use
    // the number of items that are not complete.
    return listType === "Shopping"
        ? items
              .map((item) => (item.isComplete ? 0 : item.quantity))
              .reduce<number>((prev, curr) => prev + curr, 0)
        : items.filter((item) => !item.isComplete).length;
}

export function getNumItemsTotal(listType: ListType, items: Item[]): number {
    return listType === "Shopping"
        ? items
              .map((item) => item.quantity)
              .reduce<number>((prev, curr) => prev + curr, 0)
        : items.length;
}

/* * * * * * * * * * * * * * * * * * * * * *
 * Edit collections (lists of lists/items) *
 * * * * * * * * * * * * * * * * * * * * * */

export function getSelectedCells(
    items: CollectionViewCell[]
): CollectionViewCell[] {
    return items.filter((item) => item.isSelected);
}

export function getNumberOfSelectedCells(cells: CollectionViewCell[]): number {
    return getSelectedCells(cells).length;
}

export function areCellsSelected(cells: CollectionViewCell[]): boolean {
    return getNumberOfSelectedCells(cells) > 0;
}

/**
 * Get the index of the first cell being edited.
 *
 * @param items list of cells (lists or items)
 * @returns the index of the first cell being edited.
 */
export function getCellBeingEdited(cells: CollectionViewCell[]): number {
    return cells.findIndex((cell) => cell.isSelected);
}

export function isAllSelected(items: CollectionViewCell[]): boolean {
    return (
        items.length > 0 &&
        items.filter((l) => l.isSelected).length == items.length
    );
}

export function cellsCountDisplay(
    cellsType: CollectionViewCellType,
    count: number
): string {
    switch (cellsType) {
        case "Item": {
            const label: string = pluralize(count, "item", "items");
            return `${count} ${label}`;
        }

        case "List": {
            const label: string = pluralize(count, "list", "lists");
            return `${count} ${label}`;
        }
    }
}

export function getList(lists: List[], listIndex: number): List {
    const list: List | undefined = lists[listIndex];
    if (list === undefined) throw Error(`Index out of range: ${listIndex}`);
    return list;
}

export function getListItems(lists: List[], listIndex: number): Item[] {
    return getList(lists, listIndex).items;
}

export function updateLists(
    lists: List[],
    listIndex: number,
    items: Item[]
): List[] {
    const listBeingEdited: List = getList(lists, listIndex);

    return lists.map((list, index) =>
        index === listIndex ? listBeingEdited.updateItems(items) : list
    );
}

/**
 * Split lists into two sections: the current list and all other lists.
 *
 * @param currentListIndex index of the current list
 * @param lists all lists
 * @returns a tuple where the first element is the current list and the second element
 * is all other lists.
 */
export function partitionLists(
    currentListIndex: number,
    lists: List[]
): [List, List[]] {
    const currentList: List = getList(lists, currentListIndex);
    const otherLists: List[] = [
        ...lists.slice(0, currentListIndex),
        ...lists.slice(currentListIndex + 1),
    ];
    return [currentList, otherLists];
}

/**
 * Checks if the app is being run by the tests.
 *
 * Solution for detecting when tests are running was found here: https://stackoverflow.com/a/52231746. Another
 * way to check if the tests are running is with `process.env.JEST_WORKER_ID === 1`
 *
 * @returns `true` if the tests are running the app; `false` otherwise.
 */
export function areTestsRunning(): boolean {
    return areTestsRunningOverride || process.env.NODE_ENV === "test";
}

/**
 * If the user invokes the primary action (non-alternate) while adding a new
 * list or item, the modal will close.
 *
 * If the user invokes the alternate action while adding a new list or item, the modal
 * will remain visible, and the form values will reset so they can add another list.
 *
 * If the user invokes the primary action (not alternate) while editing a list or item,
 * the modal will close.
 *
 * If the user invokes the alternate action while editing a list or item, the modal will
 * reset to the next list or item, allowing the user to continually update subsequent
 * lists or items. If the user is on the last list or item and invokes the alternate action, the
 * modal will close.
 *
 * When updating, the index is reset to -1 after going beyond the end of the list.
 */
export function getCellModalVisibleAndNextIndex(
    currentIndex: number,
    numLists: number,
    isAddingList: boolean,
    isAltAction: boolean
): [boolean, number] {
    const isModalVisible: boolean = isAddingList
        ? isAltAction
        : isAltAction
        ? currentIndex + 1 < numLists
        : false;

    const nextIndex: number = isAddingList
        ? -1
        : isAltAction
        ? currentIndex + 1 < numLists
            ? currentIndex + 1
            : -1
        : -1;

    return [isModalVisible, nextIndex];
}

export function listTypePredicateFactory(
    listType: ListType
): (list: List) => boolean {
    return (list: List) => list.listType === listType;
}
