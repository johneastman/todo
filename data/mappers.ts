import { ItemJSON, ListJSON, Settings, SettingsJSON } from "../types";
import { Item, List } from "./data";

// Lists
export function listToJSON(list: List): ListJSON {
    const { name, listType, defaultNewItemPosition, isSelected, items } = list;
    return {
        name: name,
        listType: listType,
        defaultNewItemPosition: defaultNewItemPosition,
        isSelected: isSelected,
        items: itemsToJSON(items),
    };
}

export function listsToJSON(lists: List[]): ListJSON[] {
    return lists.map((list) => listToJSON(list));
}

export function jsonToList(listJSON: ListJSON): List {
    const { name, listType, defaultNewItemPosition, items, isSelected } =
        listJSON;
    return new List(
        name,
        listType ?? "List",
        defaultNewItemPosition ?? "bottom",
        jsonToItems(items),
        isSelected
    );
}

export function jsonToLists(listsJSON: ListJSON[]): List[] {
    return listsJSON.map((list) => jsonToList(list));
}

// Items
export function itemToJSON(item: Item): ItemJSON {
    const { name, quantity, isComplete, isSelected } = item;
    return {
        name: name,
        quantity: quantity,
        isComplete: isComplete,
        isSelected: isSelected,
    };
}

export function itemsToJSON(items: Item[]): ItemJSON[] {
    return items.map((item) => itemToJSON(item));
}

export function jsonToItem(itemJSON: ItemJSON): Item {
    const { name, quantity, isComplete, isSelected } = itemJSON;
    return new Item(name, quantity, isComplete, isSelected);
}

export function jsonToItems(itemsJSON: ItemJSON[]): Item[] {
    return itemsJSON.map((itemJSON) => jsonToItem(itemJSON));
}

// Settings
export function settingsToJSON(settings: Settings): SettingsJSON {
    const { isDeveloperModeEnabled, defaultListPosition, defaultListType } =
        settings;

    return {
        isDeveloperModeEnabled: isDeveloperModeEnabled,
        defaultListPosition: defaultListPosition,
        defaultListType: defaultListType,
    };
}

export function jsonToSettings(settingsJSON: SettingsJSON): Settings {
    const { isDeveloperModeEnabled, defaultListPosition, defaultListType } =
        settingsJSON;

    return {
        isDeveloperModeEnabled: isDeveloperModeEnabled,
        defaultListPosition: defaultListPosition,
        defaultListType: defaultListType,
    };
}
