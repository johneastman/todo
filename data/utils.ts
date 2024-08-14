import AsyncStorage from "@react-native-async-storage/async-storage";
import { baseURL } from "../env.json";
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

/* * * * * * *
 * Cloud/API *
 * * * * * * */
export type CloudResponseType = "message" | "user_data" | "users_data";

export type MessageResponse = {
    message: string;
};

export type DataResponse = {
    listsJSON: ListJSON[];
    settingsJSON: SettingsJSON;
};

export interface Cloud {
    type: CloudResponseType;
}

export class CloudMessage implements Cloud {
    type: CloudResponseType = "message";
    message: string;
    constructor(message: string) {
        this.message = message;
    }
}

export class CloudUserData implements Cloud {
    type: CloudResponseType = "user_data";
    data: DataResponse;
    constructor(data: DataResponse) {
        this.data = data;
    }
}

export class CloudUsersData implements Cloud {
    type: CloudResponseType = "users_data";
    data: string[];
    constructor(data: string[]) {
        this.data = data;
    }
}

export async function cloudGet(username: string): Promise<Cloud> {
    try {
        const response = await fetch(`${baseURL}/users/${username}`, {
            method: "GET",
        });

        const responseData = await response.json();

        if (response.status !== 200) {
            const { message } = responseData as MessageResponse;
            return new CloudMessage(message);
        }

        const userData = responseData as DataResponse;
        return new CloudUserData(userData);
    } catch (error) {
        console.error(error);
        return new CloudMessage("Failed to retrieve data");
    }
}

export async function cloudSave(
    username: string,
    data: DataResponse
): Promise<CloudMessage> {
    try {
        const response = await fetch(`${baseURL}/users/${username}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const responseData = await response.json();

        const { message } = responseData as MessageResponse;
        return new CloudMessage(message);
    } catch (error) {
        console.error(error);
        return new CloudMessage("Failed to save data");
    }
}

export async function cloudDelete(username: string): Promise<CloudMessage> {
    try {
        const response = await fetch(`${baseURL}/users/${username}`, {
            method: "DELETE",
        });

        const responseData = await response.json();

        const { message } = responseData as MessageResponse;
        return new CloudMessage(message);
    } catch (error) {
        console.error(error);
        return new CloudMessage("Failed to delete data");
    }
}

export async function getUsers(): Promise<Cloud> {
    try {
        const response = await fetch(`${baseURL}/users`, {
            method: "GET",
        });
        const responseData = await response.json();

        return new CloudUsersData(responseData as string[]);
    } catch (error) {
        console.error(error);
        return new CloudMessage("Failed to retrieve users data");
    }
}
