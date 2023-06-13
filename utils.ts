import { Item } from "./data/Item";
import { List } from "./data/List";
import { getItems } from "./data/utils";
import { Position } from "./types";

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
