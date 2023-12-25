import AsyncStorage from "@react-native-async-storage/async-storage";
import { List, Item } from "./data";
import { ItemType, ListTypeValue, Position, Settings, defaultSettings } from "../types";

// AsyncStorage Keys
const LISTS_KEY = "lists";
const SETTINGS_KEY = "settings";

// NOTE: property names in the *JSON objects are from legacy verions of the app and are not
// necessarily the same as the corresponding non-JSON objects. This is to ensure data currently
// saved in the database can still be accessed.
interface ListJSON {
    id: string;
    name: string;
    type: ListTypeValue;
    defaultNewItemPosition: Position;
    isSelected: boolean;
}

interface ItemJSON {
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
        // "list.type" is a legacy property. DO NOT CHANGE!
        lists = listsJSON.map((list) =>
            new List(
                list.id,
                list.name,
                list.type || "List",
                list.defaultNewItemPosition || "bottom",
                list.isSelected
            )
        );
    }
    return lists;
}

export async function getNumLists(): Promise<number> {
    let lists: List[] = await getLists();
    return lists.length;
}

export async function saveLists(lists: List[]): Promise<void> {
    let listsJSON: ListJSON[] = lists.map((list) => {
        return {
            id: list.id,
            name: list.name,
            type: list.listType,
            defaultNewItemPosition: list.defaultNewItemPosition,
            isSelected: list.isSelected,
        };
    });

    let listsJSONData: string = JSON.stringify(listsJSON);

    await AsyncStorage.setItem(LISTS_KEY, listsJSONData);
};

export async function deleteListItems(listId: string): Promise<void> {
    await AsyncStorage.removeItem(listId);
}

export async function getItems(listId: string): Promise<Item[]> {
    let items: Item[] = [];

    let itemsJSONData: string | null = await AsyncStorage.getItem(listId);
    if (itemsJSONData !== null) {
        let itemsJSON: ItemJSON[] = JSON.parse(itemsJSONData);
        items = itemsJSON.map((item) => {
            // "item.value" is a legacy property. DO NOT CHANGE!
            return new Item(item.value, item.quantity, item.itemType ?? "Item", item.isComplete, item.isSelected);
        });
    }
    return items;
}

export async function saveItems(listId: string, items: Item[]): Promise<void> {
    let itemsJSON: ItemJSON[] = items.map((item) => {
        return {
            value: item.name,
            quantity: item.quantity,
            isComplete: item.isComplete,
            isSelected: item.isSelected,
            itemType: item.itemType
        };
    });

    let itemsJSONData: string = JSON.stringify(itemsJSON);

    await AsyncStorage.setItem(listId, itemsJSONData);
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