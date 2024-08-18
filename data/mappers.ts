import { ItemJSON, ListJSON, SettingsJSON } from "../types";
import { Item, ItemFlags, List } from "./data";
import { Settings } from "./reducers/settings.reducer";

// Lists
export function listToJSON(list: List): ListJSON {
    const {
        name,
        listType,
        defaultNewItemPosition,
        isSelected,
        items,
        isLocked,
    } = list;
    return {
        name: name,
        listType: listType,
        defaultNewItemPosition: defaultNewItemPosition,
        isSelected: isSelected,
        items: itemsToJSON(items),
        isLocked: isLocked,
    };
}

export function listsToJSON(lists: List[]): ListJSON[] {
    return lists.map((list) => listToJSON(list));
}

export function jsonToList(listJSON: ListJSON): List {
    const {
        name,
        listType,
        defaultNewItemPosition,
        items,
        isSelected,
        isLocked,
    } = listJSON;

    return new List(
        name,
        listType ?? "List",
        defaultNewItemPosition ?? "bottom",
        jsonToItems(items),
        isSelected,
        isLocked
    );
}

export function jsonToLists(listsJSON: ListJSON[]): List[] {
    return listsJSON.map((list) => jsonToList(list));
}

// Items
export function itemToJSON(item: Item): ItemJSON {
    const { name, notes, quantity, isComplete, isSelected, isLocked } = item;
    return {
        name: name,
        notes: notes,
        quantity: quantity,
        isComplete: isComplete,
        isSelected: isSelected,
        isLocked: isLocked,
    };
}

export function itemsToJSON(items: Item[]): ItemJSON[] {
    return items.map((item) => itemToJSON(item));
}

export function jsonToItem(itemJSON: ItemJSON): Item {
    const { name, notes, quantity, isComplete, isSelected, isLocked } =
        itemJSON;

    const flags: ItemFlags = {
        isComplete: isComplete,
        isSelected: isSelected,
        isLocked: isLocked,
    };

    return new Item(name, notes ?? "", quantity, flags);
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
