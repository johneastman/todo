import AsyncStorage from "@react-native-async-storage/async-storage";
import { List } from "./List";
import { Item } from "./Item";

const LISTS_KEY = "lists";

export interface ListJSON {
    id: string;
    name: string;
}

export interface ItemJSON {
    value: string;
    quantity: number;
    isComplete: boolean;
}

export async function getLists(): Promise<List[]> {
    let lists: List[] = [];

    let listsJSONData: string | null = await AsyncStorage.getItem(LISTS_KEY);
    if (listsJSONData !== null) {
        let listsJSON: ListJSON[] = JSON.parse(listsJSONData);
        lists = listsJSON.map((list) => {
            return new List(list.id, list.name);
        });
    }
    return lists;
}

export async function saveLists(lists: List[]): Promise<void> {
    let listsJSON: ListJSON[] = lists.map((list) => {
        return {
            id: list.id,
            name: list.name
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
            return new Item(item.value, item.quantity, item.isComplete);
        });
    }
    return items;
}

export async function saveItems(listId: string, items: Item[]): Promise<void> {
    let itemsJSON: ItemJSON[] = items.map((item) => {
        return {
            value: item.value,
            quantity: item.quantity,
            isComplete: item.isComplete
        };
    });

    let itemsJSONData: string = JSON.stringify(itemsJSON);

    await AsyncStorage.setItem(listId, itemsJSONData);
}

export async function clearData(): Promise<void> {
    await AsyncStorage.clear();
}