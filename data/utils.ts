import AsyncStorage from "@react-native-async-storage/async-storage";
import { List, Item } from "./data";
import { ItemType, ListTypeValue, Position, Settings, defaultSettings } from "../types";

// AsyncStorage Keys
const LISTS_KEY = "lists";
const SETTINGS_KEY = "settings";

// NOTE: property names in the *JSON objects are from legacy verions of the app and are not
// necessarily the same as the corresponding non-JSON objects. This is to ensure data currently
// saved in the database can still be accessed.
export interface ListJSON {
    id: string;
    name: string;
    type: ListTypeValue;
    defaultNewItemPosition: Position;
    isSelected: boolean;
}

export interface ItemJSON {
    value: string;
    quantity: number;
    itemType: ItemType;
    isComplete: boolean;
    isSelected: boolean;
}

interface SettingsJSON {
    isDeveloperModeEnabled: boolean;
    defaultListType: ListTypeValue;
    defaultListPosition: Position;
}

export async function getLists(): Promise<List[]> {
    let lists: List[] = [];

    let listsJSONData: string | null = await AsyncStorage.getItem(LISTS_KEY);
    if (listsJSONData !== null) {
        let listsJSON: ListJSON[] = JSON.parse(listsJSONData);
        lists = jsonListsToObject(listsJSON);
    }
    return lists;
}

export function jsonListsToObject(listsJSON: ListJSON[]): List[] {
    // "list.type" is a legacy property. DO NOT CHANGE!
    return listsJSON.map((list) =>
        new List(
            list.id,
            list.name,
            list.type || "List",
            list.defaultNewItemPosition || "bottom",
            list.isSelected
        )
    );
}

export async function getNumLists(): Promise<number> {
    const lists: List[] = await getLists();
    return lists.length;
}

export async function saveLists(lists: List[]): Promise<void> {
    const listsJSONData: ListJSON[] = listsToJSON(lists);
    await saveListsData(listsJSONData);
};

export async function saveListsData(listsJSON: ListJSON[]): Promise<void> {
    const rawListsData: string = JSON.stringify(listsJSON);
    await AsyncStorage.setItem(LISTS_KEY, rawListsData);
}

export function listsToJSON(lists: List[]): ListJSON[] {
    return lists.map((list) => listToJSON(list));
}

function listToJSON(list: List): ListJSON {
    return {
        id: list.id,
        name: list.name,
        type: list.listType,
        defaultNewItemPosition: list.defaultNewItemPosition,
        isSelected: list.isSelected,
    };
}

export async function deleteListItems(listId: string): Promise<void> {
    await AsyncStorage.removeItem(listId);
}

export async function getItems(listId: string): Promise<Item[]> {
    let items: Item[] = [];

    let itemsJSONData: string | null = await AsyncStorage.getItem(listId);
    if (itemsJSONData !== null) {
        let itemsJSON: ItemJSON[] = JSON.parse(itemsJSONData);

        // "item.value" is a legacy property. DO NOT CHANGE!
        items = jsonItemsToObject(itemsJSON);
    }
    return items;
}

export function jsonItemsToObject(itemsJSON: ItemJSON[]): Item[] {
    return itemsJSON.map((item) =>
        new Item(item.value, item.quantity, item.itemType ?? "Item", item.isComplete, item.isSelected)
    );
}

export async function saveItems(listId: string, items: Item[]): Promise<void> {
    const itemsJSONData: ItemJSON[] = itemsToJSON(items);
    await saveItemsData(listId, itemsJSONData);
}

export async function saveItemsData(listId: string, itemsJSON: ItemJSON[]): Promise<void> {
    const rawItemsData: string = JSON.stringify(itemsJSON);
    await AsyncStorage.setItem(listId, rawItemsData);
}

export function itemsToJSON(items: Item[]): ItemJSON[] {
    return items.map((item) => itemToJSON(item));
}

function itemToJSON(item: Item): ItemJSON {
    // "value" is a legacy property. DO NOT CHANGE!
    return {
        value: item.name,
        quantity: item.quantity,
        isComplete: item.isComplete,
        isSelected: item.isSelected,
        itemType: item.itemType
    };
}

export async function getSettings(updateSettings: (settings: Settings) => void): Promise<Settings> {
    const settingsString: string | null = await AsyncStorage.getItem(SETTINGS_KEY);
    if (settingsString === null) {
        return defaultSettings;
    }

    const settingsJSON: SettingsJSON = JSON.parse(settingsString);

    const settings: Settings = {
        isDeveloperModeEnabled: settingsJSON.isDeveloperModeEnabled,
        defaultListPosition: settingsJSON.defaultListPosition,
        defaultListType: settingsJSON.defaultListType,
        updateSettings: updateSettings
    }

    return settings;
}

export async function saveSettings(settings: Settings): Promise<void> {

    const settingsJSON: SettingsJSON = {
        isDeveloperModeEnabled: settings.isDeveloperModeEnabled,
        defaultListPosition: settings.defaultListPosition,
        defaultListType: settings.defaultListType
    }

    const settingsString: string = JSON.stringify(settingsJSON);
    await AsyncStorage.setItem(SETTINGS_KEY, settingsString);
}

export async function clearData(): Promise<void> {
    await AsyncStorage.clear();
}