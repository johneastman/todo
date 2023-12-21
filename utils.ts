import {StyleProp, StyleSheet, ViewStyle} from "react-native";

import { Item, List, ListViewCellItem } from "./data/data";
import { getItems } from "./data/utils";
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

export const LIGHT_BLUE: string = "#0097fb";


export function getDeveloperModeListCellStyles(isActive: boolean): StyleProp<ViewStyle> {
    return {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#555",
        backgroundColor: isActive ? "lightblue" : "white",
    }
}


/* * * * * * * * * *
 * Utility methods *
 * * * * * * * * * */
export function pluralize(value: number, singular: string, plural: string): string {
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

export async function getNumberOfItemsInList(list: List): Promise<number> {
    let items: Item[] = await getItems(list.id);
    return items.length;
};

export function getItemBeingEdited(items: ListViewCellItem[]): number {
    const itemIndex: {
        item: ListViewCellItem;
        index: number;
    }[] = items
        .map((l, i) => {
            return { item: l, index: i };
        })
        .filter((l) => l.item.isSelected);
    
    return itemIndex[0].index;
}

export function isAllSelected(items: ListViewCellItem[]): boolean {
    return items.length > 0 &&  items.filter((l) => l.isSelected).length == items.length;
}

function insertAt<T>(index: number, value: T, collection: T[]): T[] {
    const start: T[] = collection.slice(0, index);
    const end: T[] = collection.slice(index);
    return start.concat(value).concat(end);
}


function removeAt<T>(index: number, collection: T[]): T[] {
    const start: T[] = collection.slice(0, index);
    const end: T[] = collection.slice(index + 1);
    return start.concat(end);
}

export function updateCollection<T>(item: T, collection: T[], oldPos: number, newPos: Position): T[] {
    // Convert "Position" object to indices (for example, "top" corresponds to index 0 in the list). This makes
    // updating item positions easier.
    let newPosIndex: number;
    switch(newPos) {
        case "top":
            newPosIndex = 0;
            break;

        case "current":
            newPosIndex = oldPos;
            break;

        case "bottom":
            newPosIndex = collection.length
            break;

        default:
            console.log(
                `From updateCollection in utils.ts: Invalid position: ${newPos}. Keeping item in same position`
            );
            newPosIndex = oldPos;
            break;
    }

    // Remove the old item at the old position
    const newCollection = removeAt(oldPos, collection);

    // Insert the new item to the new position
    return insertAt(newPosIndex, item, newCollection);
}

export function removeItemAtIndex<T>(collection: T[], index: number): T[] {
    const beginning: T[] = collection.slice(0, index);
    const end: T[] = collection.slice(index + 1);
    return beginning.concat(end);
}

/**
 * Return the total number of items in a list that are not marked as complete. 
 * 
 * @param listType type of list items are in
 * @param items list of Item objects
 * 
 * @returns total number of items based on filter criteria (parameter values).
 */
export function getNumItemsIncomplete(listType: ListTypeValue, items: Item[]): number {
    // Only shopping lists should use the quantity for the items count. All other types can use
    // the number of items that are not complete.
    return listType === "Shopping"
            ? items
                  .map((item) => (item.isComplete ? 0 : item.quantity))
                  .reduce<number>((prev, curr) => prev + curr, 0)
            : items.filter(item => !item.isComplete).length;
}

export function getNumItemsTotal(listType: ListTypeValue, items: Item[]): number {
    return listType === "Shopping" 
            ? items
                .map((item) => item.quantity)
                .reduce<number>((prev, curr) => prev + curr, 0) 
            : items.length;
}

/* * * * * * * * * * * * * * * * * * * * * *
 * Edit collections (lists of lists/items) *
 * * * * * * * * * * * * * * * * * * * * * */

export function selectedListCellsWording(selectedItems: ListViewCellItem[]): string {
    return areCellsSelected(selectedItems) ? "Selected" : "All";
}

export function areCellsSelected(items: ListViewCellItem[]): boolean {
    const selectedItems: ListViewCellItem[] = getSelectedItems(items);
    return selectedItems.length > 0;
}

export function getSelectedItems(items: ListViewCellItem[]): ListViewCellItem[] {
    return items.filter(item => item.isSelected);
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
    return process.env.NODE_ENV === "test"
}
