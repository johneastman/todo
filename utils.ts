import {StyleProp, StyleSheet, ViewStyle} from "react-native";

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
    settingsHeader: {
        fontWeight: "bold",
        paddingBottom: 10,
        fontSize: 20,
        textAlign: "center",
    },
    settingsView: {
        padding: 10,
        gap: 10
    },
    customCheckBox: {
        width: 24,
        height: 24,
        borderRadius: 6,
    }
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

export function getItemsCount(listType: string, items: Item[]): number {
    // Only shopping lists should use the quantity for the items count. All other types can use
    // the length of the items list.
    return listType === "Shopping"
            ? items
                  .map((item) => (item.isComplete ? 0 : item.quantity))
                  .reduce<number>((prev, curr) => prev + curr, 0)
            : items.length;
}
