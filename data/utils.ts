import AsyncStorage from "@react-native-async-storage/async-storage";
import { List } from "./List";
import { Item } from "./Item";

const DATA_KEY = "lists";

export interface ListJSON {
    id: string;
    name: string;
    items: ItemJSON[];
}

export interface ItemJSON {
    value: string;
    quantity: number;
    isComplete: boolean;
}

export async function getLists(): Promise<List[]> {
    let lists: List[] = [];

    let listsJSONData: string | null = await AsyncStorage.getItem(DATA_KEY);
    if (listsJSONData !== null) {
        let listsJSON: ListJSON[] = JSON.parse(listsJSONData);
        lists = listsJSON.map((list) => {
            let items: Item[] = list.items.map(item => {
                return {
                    value: item.value,
                    quantity: item.quantity,
                    isComplete: item.isComplete,
                }
            });
            return new List(list.id, list.name, items);
        });
    }
    return lists;
}

export async function getList(listId: string): Promise<List | undefined> {
    let lists: List[] = await getLists();
    lists = lists.filter((list) => list.id === listId);
    return lists.length === 1 ? lists[0] : undefined;
}

export async function saveLists(lists: List[]): Promise<void> {
    let listsJSON: ListJSON[] = lists.map((list) => {
        return {
            id: list.id,
            name: list.name,
            items: list.items.map(item => {
                return {
                    value: item.value,
                    quantity: item.quantity,
                    isComplete: item.isComplete,
                }
            })
        };
    });

    let listsJSONData: string = JSON.stringify(listsJSON);

    await AsyncStorage.setItem(DATA_KEY, listsJSONData);
};

export async function saveItems(listId: string, items: Item[]): Promise<void> {
    let lists: List[] = await getLists();
    for (let i = 0; i < lists.length; i++) {
        let currentList: List = lists[i];
        if (currentList.id === listId) {
            lists[i].items = items;
            break;
        }
    }
    await saveLists(lists);
}