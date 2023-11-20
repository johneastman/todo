import {StyleProp, StyleSheet, TextStyle, ViewStyle} from "react-native";

import { Item, List } from "./data/data";
import { getItems } from "./data/utils";
import { Position } from "./types";

/* * * * * *
 *  Styles *
 * * * * * */
export const STYLES = StyleSheet.create({
    popupMenuText: {
        fontSize: 18,
        padding: 8,
    },
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

export function deleteCollectionMenuStyle<T>(collection: T[]): StyleProp<TextStyle> {
    return {
        color: "red",
        opacity: collection.length === 0 ? 0.3 : 1,
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

export function updateCollection<T>(item: T, collection: T[], oldPos: number, newPos: Position): T[] {
    let newItems: T[] = collection.concat();

    switch(newPos) {
        case "top":
            // Move new item to top of list
            newItems.splice(oldPos, 1);
            newItems = [item].concat(newItems);
            break;
        
        case "bottom":
            // Move new item to bottom of list
            newItems.splice(oldPos, 1);
            newItems = newItems.concat(item);
            break;
        
        case "current":
            // Keep the new item at it's original position in the list
            newItems = newItems
                .slice(0, oldPos)
                .concat(item)
                .concat(newItems.slice(oldPos + 1));
            break;
        
        default:
            // The only positions are "top", "current", and "bottom", so this is just here to placate
            // the type checker.
            break;
    }

    return newItems;
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
 * @param onlyIncludeComplete if true, only incomplete items will be considered in the count. If false, all items will be
 * considered in the count.
 * @returns total number of items based on filter criteria (parameter values).
 */
export function getItemsCount(listType: string, items: Item[], onlyIncludeComplete: boolean = true): number {
    // Only shopping lists should use the quantity for the items count. All other types can use
    // the number of items that are not complete.
    return listType === "Shopping"
            ? items
                  .map((item) => (item.isComplete && onlyIncludeComplete ? 0 : item.quantity))
                  .reduce<number>((prev, curr) => prev + curr, 0)
            : items.filter(item => !item.isComplete && onlyIncludeComplete).length;
}

/* * * * * * * * * * * * * * * * * * * * * *
 * Edit collections (lists of lists/items) *
 * * * * * * * * * * * * * * * * * * * * * */

export function selectedListCellsWording(selectedCells: number[]): string {
    return areCellsSelected(selectedCells) ? "Selected" : "All";
}

export function areCellsSelected(selectedCells: number[]): boolean {
    return selectedCells.length > 0;
}

export function isCellBeingEdited(cellIndices: number[], index: number): boolean {
    return cellIndices.indexOf(index) !== -1;
};

export function updateCellBeingEdited(cellsBeingEdited: number[], setCellsBeingEdited: (cells: number[]) => void, index: number, addToList: boolean): void {
    if (addToList) {
        // Adding item to list
        setCellsBeingEdited(cellsBeingEdited.concat(index));
    } else {
        // Removing item from list
        const itemIndex: number = cellsBeingEdited.indexOf(index);
        const listWithRemovedIndex: number[] = removeItemAtIndex(
            cellsBeingEdited,
            itemIndex
        );
        setCellsBeingEdited(listWithRemovedIndex);
    }
}

export function handleSelectAll<T>(isChecked: boolean, cells: T[], setCellsBeingEdited: (cells: number[]) => void, setIsAllCellsSelected: (checked: boolean) => void): void {
    setIsAllCellsSelected(isChecked);

    if (isChecked) {
        // Select all items
        setCellsBeingEdited(cells.map((_, index) => index));
    } else {
        // De-select all items
        setCellsBeingEdited([]);
    }
};

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
