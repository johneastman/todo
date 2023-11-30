import AsyncStorage from "@react-native-async-storage/async-storage";
import { List, Item } from "./data";
import { ListTypeValue } from "../types";

// AsyncStorage Keys
const LISTS_KEY = "lists";
const DEV_MODE = "dev_mode";
const DEFAULT_LIST_TYPE = "default_list_type";

// Developer Mode Strings
const DEV_MODE_ACTIVE = "1";
const DEV_MODE_INACTIVE = "0";

export async function getLists(): Promise<List[]> {
    let lists: List[] = [];

    let listsJSONData: string | null = await AsyncStorage.getItem(LISTS_KEY);
    if (listsJSONData !== null) {
        lists = JSON.parse(listsJSONData);
    }
    return lists;
}

export async function getNumLists(): Promise<number> {
    let lists: List[] = await getLists();
    return lists.length;
}

export async function saveLists(lists: List[]): Promise<void> {
    let listsJSONData: string = JSON.stringify(lists);
    await AsyncStorage.setItem(LISTS_KEY, listsJSONData);
};

export async function deleteListItems(listId: string): Promise<void> {
    await AsyncStorage.removeItem(listId);
}

export async function getItems(listId: string): Promise<Item[]> {
    let items: Item[] = [];

    let itemsJSONData: string | null = await AsyncStorage.getItem(listId);
    if (itemsJSONData !== null) {
        items = JSON.parse(itemsJSONData);
    }
    return items;
}

export async function saveItems(listId: string, items: Item[]): Promise<void> {
    let itemsJSONData: string = JSON.stringify(items);

    await AsyncStorage.setItem(listId, itemsJSONData);
}

export async function saveDeveloperMode(isDeveloperModeEnabled: boolean): Promise<void> {
    await AsyncStorage.setItem(DEV_MODE, isDeveloperModeEnabled ? DEV_MODE_ACTIVE : DEV_MODE_INACTIVE);
}

export async function getDeveloperMode(): Promise<boolean> {
    let developerMode: string | null = await AsyncStorage.getItem(DEV_MODE);
    if (developerMode !== null) {
        return developerMode === DEV_MODE_ACTIVE;
    }
    return false;
}

export async function saveDefaultListType(listType: ListTypeValue): Promise<void> {
    await AsyncStorage.setItem(DEFAULT_LIST_TYPE, listType);
}

export async function getDefaultListType(): Promise<ListTypeValue> {
    let listType: string | null = await AsyncStorage.getItem(DEFAULT_LIST_TYPE);
    if (listType !== null) {
        return listType as ListTypeValue;
    }
    return "List";
}

export async function clearData(): Promise<void> {
    await AsyncStorage.clear();
}