import { StyleProp, StyleSheet, ViewStyle } from "react-native";

import { Item, List } from "./data/data";
import { ListType, CollectionViewCell, CollectionViewCellType } from "./types";

/* * * * * *
 *  Styles *
 * * * * * */
export const STYLES = StyleSheet.create({
    listCellTextDisplay: {
        flex: 1,
        flexDirection: "column",
    },
    listCellNameText: {
        fontSize: 30,
    },
    listCellView: {
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
    },
    quantityValueChangeButton: {
        width: 30,
    },
    dropdown: {
        width: "100%",
    },
    input: {
        height: 40,
        borderWidth: 1,
        padding: 10,
        width: "100%",
    },
});

// Colors
export const LIGHT_BLUE: string = "lightblue";
export const LIGHT_BLUE_BUTTON: string = "#0097fb";
export const WHITE: string = "white";
export const LIGHT_GREY: string = "lightgrey";
export const GREY: string = "grey";
export const BLACK: string = "black";
export const RED: string = "red";

export function getDeveloperModeListCellStyles(
    isActive: boolean
): StyleProp<ViewStyle> {
    return {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: GREY,
        backgroundColor: isActive ? LIGHT_BLUE : WHITE,
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

export function areCellsSelected(items: CollectionViewCell[]): boolean {
    const selectedItems: CollectionViewCell[] = getSelectedCells(items);
    return selectedItems.length > 0;
}

export function getSelectedCells(
    items: CollectionViewCell[]
): CollectionViewCell[] {
    return items.filter((item) => item.isSelected);
}

export function getCellBeingEdited(items: CollectionViewCell[]): number {
    return items.findIndex((item) => item.isSelected);
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
    return process.env.NODE_ENV === "test";
}
