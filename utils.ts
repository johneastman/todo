import { List } from "./data/List";

export function pluralize(value: number, singular: string, plural: string): string {
    return value === 1 ? singular : plural;
}

export function numListItemsMessage(list: List): string {
    let numItems: number = list.items.length;
    return `${numItems} ${pluralize(numItems, "item", "items")}`;
}