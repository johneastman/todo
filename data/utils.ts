import AsyncStorage from "@react-native-async-storage/async-storage";
import { List, Item } from "./data";
import { ListJSON, Settings, SettingsJSON } from "../types";
import { updateAt } from "../utils";
import { defaultSettings } from "../contexts/app.context";
import {
    jsonToLists,
    jsonToSettings,
    listsToJSON,
    settingsToJSON,
} from "./mappers";

// AsyncStorage Keys
const LISTS_KEY = "lists";
const SETTINGS_KEY = "settings";

export async function getLists(): Promise<List[]> {
    let lists: List[] = [];

    let listsJSONData: string | null = await AsyncStorage.getItem(LISTS_KEY);
    if (listsJSONData !== null) {
        let listsJSON: ListJSON[] = JSON.parse(listsJSONData);
        lists = jsonToLists(listsJSON);
    }
    return lists;
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

export async function getSettings(): Promise<Settings> {
    const settingsString: string | null = await AsyncStorage.getItem(
        SETTINGS_KEY
    );
    if (settingsString === null) {
        return defaultSettings;
    }

    const settingsJSON: SettingsJSON = JSON.parse(settingsString);
    return jsonToSettings(settingsJSON);
}

export async function saveSettings(settings: Settings): Promise<void> {
    const settingsJSON: SettingsJSON = settingsToJSON(settings);
    const settingsString: string = JSON.stringify(settingsJSON);
    await AsyncStorage.setItem(SETTINGS_KEY, settingsString);
}

export async function clearData(): Promise<void> {
    await AsyncStorage.clear();
}
