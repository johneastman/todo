import AsyncStorage from "@react-native-async-storage/async-storage";
import { List, Item } from "./data";
import { ListJSON, SettingsJSON } from "../types";
import { getList, getListItems, updateAt } from "../utils";
import { defaultSettingsData } from "../contexts/settings.context";
import {
    jsonToLists,
    jsonToSettings,
    listsToJSON,
    settingsToJSON,
} from "./mappers";
import { Settings } from "./reducers/settings.reducer";

// AsyncStorage Keys
const LISTS_KEY = "lists";
const SETTINGS_KEY = "settings";
const USERNAME_KEY = "username";

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

export async function getItems(listIndex: number): Promise<Item[]> {
    const lists: List[] = await getLists();
    return getListItems(lists, listIndex);
}

export async function saveItems(
    listIndex: number,
    newItems: Item[]
): Promise<void> {
    const lists: List[] = await getLists();
    const matchingList: List = getList(lists, listIndex);
    const newList: List = matchingList.updateItems(newItems);

    const newLists: List[] = updateAt(newList, lists, listIndex);

    const newListsJSON: ListJSON[] = listsToJSON(newLists);
    await saveListsData(newListsJSON);
}

export async function getSettings(): Promise<Settings> {
    const settingsString: string | null = await AsyncStorage.getItem(
        SETTINGS_KEY
    );
    if (settingsString === null) {
        return defaultSettingsData;
    }

    const settingsJSON: SettingsJSON = JSON.parse(settingsString);
    return jsonToSettings(settingsJSON);
}

export async function saveSettings(settings: Settings): Promise<void> {
    const settingsJSON: SettingsJSON = settingsToJSON(settings);
    const settingsString: string = JSON.stringify(settingsJSON);
    await AsyncStorage.setItem(SETTINGS_KEY, settingsString);
}

export async function getUsername(): Promise<string | undefined> {
    const username: string | null = await AsyncStorage.getItem(USERNAME_KEY);
    return username === "NULL" || username === null ? undefined : username;
}

export async function saveUsername(username?: string): Promise<void> {
    await AsyncStorage.setItem(USERNAME_KEY, username ?? "NULL");
}
