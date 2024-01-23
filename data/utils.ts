import AsyncStorage from "@react-native-async-storage/async-storage";
import { List, Item } from "./data";
import { ItemJSON, ListJSON, Settings, SettingsJSON } from "../types";
import { updateAt } from "../utils";
import { defaultSettings } from "../contexts/app.context";

// AsyncStorage Keys
const LISTS_KEY = "lists";
const SETTINGS_KEY = "settings";

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
    return listsJSON.map(
        (list) =>
            new List(
                list.id,
                list.name,
                list.listType ?? "List",
                list.defaultNewItemPosition ?? "bottom",
                jsonItemsToObject(list.items),
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
}

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
        listType: list.listType,
        defaultNewItemPosition: list.defaultNewItemPosition,
        isSelected: list.isSelected,
        items: itemsToJSON(list.items),
    };
}

export async function getItems(listId: string): Promise<Item[]> {
    const lists: List[] = await getLists();
    const list: List | undefined = lists.find((l) => l.id === listId);
    if (list === undefined) {
        throw Error(`No items found for id: ${listId}`);
    }
    return list.items;
}

export async function saveItems(
    listId: string,
    newItems: Item[]
): Promise<void> {
    const lists: List[] = await getLists();
    const matchingListIndex: number | undefined = lists.findIndex(
        (l) => l.id === listId
    );
    if (matchingListIndex === -1) {
        throw Error(`No list found with id: ${listId}`);
    }

    const matchingList = lists[matchingListIndex];
    const newList: List = matchingList.updateItems(newItems);

    const newLists: List[] = updateAt(newList, lists, matchingListIndex);

    const newListsJSON: ListJSON[] = listsToJSON(newLists);
    await saveListsData(newListsJSON);
}

export function jsonItemsToObject(itemsJSON: ItemJSON[]): Item[] {
    return itemsJSON.map(
        (item) =>
            new Item(
                item.name,
                item.quantity,
                item.itemType ?? "Item",
                item.isComplete,
                item.isSelected
            )
    );
}

export function itemsToJSON(items: Item[]): ItemJSON[] {
    return items.map((item) => itemToJSON(item));
}

function itemToJSON(item: Item): ItemJSON {
    return {
        name: item.name,
        quantity: item.quantity,
        isComplete: item.isComplete,
        isSelected: item.isSelected,
        itemType: item.itemType,
    };
}

export async function getSettings(): Promise<Settings> {
    const settingsString: string | null = await AsyncStorage.getItem(
        SETTINGS_KEY
    );
    if (settingsString === null) {
        return defaultSettings;
    }

    const settingsJSON: SettingsJSON = JSON.parse(settingsString);

    const settings: Settings = {
        isDeveloperModeEnabled: settingsJSON.isDeveloperModeEnabled,
        defaultListPosition: settingsJSON.defaultListPosition,
        defaultListType: settingsJSON.defaultListType,
    };

    return settings;
}

export async function saveSettings(settings: Settings): Promise<void> {
    const settingsJSON: SettingsJSON = {
        isDeveloperModeEnabled: settings.isDeveloperModeEnabled,
        defaultListPosition: settings.defaultListPosition,
        defaultListType: settings.defaultListType,
    };

    const settingsString: string = JSON.stringify(settingsJSON);
    await AsyncStorage.setItem(SETTINGS_KEY, settingsString);
}

export async function clearData(): Promise<void> {
    await AsyncStorage.clear();
}
