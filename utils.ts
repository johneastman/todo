import { StyleProp, StyleSheet, ViewStyle } from "react-native";

import { Item, ListViewCellItem, Section } from "./data/data";
import { ListTypeValue, Position } from "./types";

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

export function itemsCountDisplay(count: number): string {
    let label: string = pluralize(count, "item", "items");
    return `${count} ${label}`;
}

export function listsCountDisplay(count: number): string {
    let label: string = pluralize(count, "list", "lists");
    return `${count} ${label}`;
}

export function displayBoolean(bool: boolean): string {
    return bool ? "True" : "False";
}

/**
 * Return the index of a selected item in a list of {@link ListViewCellItem} objects. Return -1
 * if an item isn't selected, which indicates a new item is being added.
 *
 * @param items list of objects that implementing the {@link ListViewCellItem} interface.
 * @returns index of selected item or -1 if no items are selected.
 */
export function getIndexOfItemBeingEdited(items: ListViewCellItem[]): number {
    return items.findIndex((item) => item.isSelected);
}

export function getLocationOfItemBeingEdited(sections: Section[]): {
    sectionIndex: number;
    itemIndex: number;
} {
    const sectionIndex: number = sections.findIndex((section) =>
        section.items.some((item) => item.isSelected)
    );

    // Set the section index to 0 if no items are selected. Each new list will always
    // have at least one section, so an index-out-of-range error will not happen.
    const itemIndex: number = sections[
        sectionIndex === -1 ? 0 : sectionIndex
    ].items.findIndex((item) => item.isSelected);

    return { sectionIndex: sectionIndex, itemIndex: itemIndex };
}

export function isItemEditable(cells: ListViewCellItem[]): boolean {
    const { cells: selectedCells, areAnySelected } = getSelectedCells(cells);
    return areAnySelected && selectedCells.length === 1;
}

export function isAllSelected(cells: ListViewCellItem[]): boolean {
    const { cells: selectedItems } = getSelectedCells(cells);
    return (
        selectedItems.length > 0 &&
        cells.filter((c) => c.isSelected).length == cells.length
    );
}

/**
 * Insert an item into a list at the specified index. To add an item to the end of a list,
 * the index needs to be the length of the list.
 *
 * @param index position in the list the new item is being inserted.
 * @param value value being inserted into the list
 * @param collection list of values.
 * @returns a new list with the given value inserted into the list at the given position.
 */
export function insertAt<T>(index: number, value: T, collection: T[]): T[] {
    const start: T[] = collection.slice(0, index);
    const end: T[] = collection.slice(index);
    return start.concat(value).concat(end);
}

/**
 * Update an element in a list without changing its position.
 *
 * @param index position of element in list
 * @param value new value
 * @param collection list of elements
 * @returns a new list with a new value set at the given index
 */
export function updateAt<T>(index: number, value: T, collection: T[]): T[] {
    const listWithValueRemoved: T[] = removeAt(index, collection);
    return insertAt(index, value, listWithValueRemoved);
}

export function removeAt<T>(index: number, collection: T[]): T[] {
    const start: T[] = collection.slice(0, index);
    const end: T[] = collection.slice(index + 1);
    return start.concat(end);
}

export function updateCollection<T>(
    item: T,
    collection: T[],
    oldPos: number,
    newPos: Position
): T[] {
    // Convert "Position" object to indices (for example, "top" corresponds to index 0 in the list). This makes
    // updating item positions easier.
    let newPosIndex: number;
    switch (newPos) {
        case "top":
            newPosIndex = 0;
            break;

        case "current":
            newPosIndex = oldPos;
            break;

        case "bottom":
            newPosIndex = collection.length;
            break;

        default:
            throw Error(
                `From updateCollection in utils.ts: Invalid position: ${newPos}`
            );
    }

    // Remove the old item at the old position
    const newCollection = removeAt(oldPos, collection);

    // Insert the new item to the new position
    return insertAt(newPosIndex, item, newCollection);
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
    listType: ListTypeValue,
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

export function getNumItemsTotal(
    listType: ListTypeValue,
    items: Item[]
): number {
    return listType === "Shopping"
        ? items
              .map((item) => item.quantity)
              .reduce<number>((prev, curr) => prev + curr, 0)
        : items.length;
}

/* * * * * * * * * * * * * * * * * * * * * *
 * Edit collections (lists of lists/items) *
 * * * * * * * * * * * * * * * * * * * * * */

export function selectedListCellsWording(
    selectedItems: ListViewCellItem[]
): string {
    const { areAnySelected } = getSelectedCells(selectedItems);
    return areAnySelected ? "Selected" : "All";
}

/**
 * Check if any cells (lists of {@link List} or {@link @Item}) are selected.
 *
 * if {@link isSelected} is true:
 * - Return all cells when no cells are selected
 * - Return only selected cells when any cells are selected
 *
 * if {@link isSelected} is false:
 * - Return no cells (i.e., an empty list) when no cells are selected
 * - Return only deselected cells if any cells are selected
 *
 * @param cells list of {@link List} or {@link @Item} objects.
 * @param isSelected value of selected cell on which to filter.
 * @returns boolean value for whether any cells are selected or not, and the
 * selected (or unselected) cells.
 */
export function getSelectedCells(
    cells: ListViewCellItem[],
    isSelected: boolean = true
): {
    areAnySelected: boolean;
    cells: ListViewCellItem[];
} {
    const areAnySelected: boolean = cells.some((cell) => cell.isSelected);

    const selectedItems = cells.filter(
        (cell) => cell.isSelected === isSelected
    );

    return {
        areAnySelected: areAnySelected,
        cells: areAnySelected ? selectedItems : isSelected ? cells : [],
    };
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
