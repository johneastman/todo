import AsyncStorage from "@react-native-async-storage/async-storage";
import { Base64 } from "js-base64";

import { List, Item, Settings, Section } from "./data";
import { ListTypeValue, Position } from "../types";
import { updateAt } from "../utils";
import {
    jsonListsToObject,
    jsonSettingsToObject,
    listsToJSON,
    settingsToJSON,
} from "./mappers";
import { defaultSettings } from "./reducers/settingsReducer";

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
    sections: SectionJSON[];
}

export interface SectionJSON {
    name: string;
    items: ItemJSON[];
}

export interface ItemJSON {
    value: string;
    quantity: number;
    isComplete: boolean;
    isSelected: boolean;
}

export interface SettingsJSON {
    isDeveloperModeEnabled: boolean;
    defaultListType: ListTypeValue;
    defaultListPosition: Position;
}

export async function getLists(): Promise<List[]> {
    let listsJSONData: string | null = await AsyncStorage.getItem(LISTS_KEY);
    if (listsJSONData !== null) {
        let listsJSON: ListJSON[] = JSON.parse(listsJSONData);
        return jsonListsToObject(listsJSON);
    }
    return [];
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

// export async function getItems(listId: string): Promise<Item[]> {
//     const lists: List[] = await getLists();
//     const list: List | undefined = lists.find((l) => l.id === listId);
//     if (list === undefined) {
//         console.log(`No items found for id: ${listId}`);
//         return [];
//     }
//     return list.items();
// }

export function getListIndex(lists: List[], listId: string): number {
    const matchingListIndex: number = lists.findIndex((l) => l.id === listId);

    if (matchingListIndex === -1) {
        throw Error(`No list found with id: ${listId}`);
    }

    return matchingListIndex;
}

export async function saveList(
    listId: string,
    newSections: Section[]
): Promise<void> {
    const lists: List[] = await getLists();

    const matchingListIndex: number = getListIndex(lists, listId);
    const matchingList: List = lists[matchingListIndex];

    const newList: List = matchingList.replaceSections(newSections);
    const newLists: List[] = updateAt(matchingListIndex, newList, lists);

    const newListsJSON: ListJSON[] = listsToJSON(newLists);
    await saveListsData(newListsJSON);
}

export async function saveItems(
    listId: string,
    sectionIndex: number,
    items: Item[]
): Promise<void> {
    const lists: List[] = await getLists();
    const matchingListIndex: number = getListIndex(lists, listId);
    const matchingList = lists[matchingListIndex];
    const newList: List = matchingList.updateSectionItems(sectionIndex, items);

    const newLists: List[] = updateAt(matchingListIndex, newList, lists);

    const newListsJSON: ListJSON[] = listsToJSON(newLists);
    await saveListsData(newListsJSON);
}

export async function addItemToList(
    listId: string,
    sectionIndex: number,
    newItem: Item
): Promise<void> {
    const lists: List[] = await getLists();
    const matchingListIndex: number = getListIndex(lists, listId);

    const matchingList: List = lists[matchingListIndex];
    const items: Item[] = matchingList.sectionItems(sectionIndex);

    await saveItems(listId, sectionIndex, items.concat(newItem));
}

export async function getSettings(): Promise<Settings> {
    const settingsString: string | null = await AsyncStorage.getItem(
        SETTINGS_KEY
    );
    if (settingsString === null) {
        return defaultSettings;
    }

    const settingsJSON: SettingsJSON = JSON.parse(settingsString);

    return jsonSettingsToObject(settingsJSON);
}

export async function saveSettings(settings: Settings): Promise<void> {
    const settingsJSON: SettingsJSON = settingsToJSON(settings);
    const settingsString: string = JSON.stringify(settingsJSON);
    await AsyncStorage.setItem(SETTINGS_KEY, settingsString);
}

export async function clearData(): Promise<void> {
    await AsyncStorage.clear();
}

export function encode(data: string): string {
    return Base64.encode(data);
}

export function decode(data: string): string {
    return Base64.decode(data);
}
