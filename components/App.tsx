import { StatusBar } from "expo-status-bar";
import React, { useEffect, useReducer } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ListsPage from "./pages/ListsPage";
import ItemsPage from "./pages/ItemsPage";
import SettingsPage from "./pages/SettingsPage";
import { ListsContextData, AppStackNavigatorParamList } from "../types";
import {
    getLists,
    getSettings,
    getUsername,
    saveLists,
    saveSettings,
    saveUsername,
} from "../data/utils";
import { UpdateAll, listsReducer } from "../data/reducers/lists.reducer";
import {
    Settings,
    UpdateAll as UpdateAllSettings,
} from "../data/reducers/settings.reducer";
import { List } from "../data/data";
import { ListsContext, defaultListsData } from "../contexts/lists.context";
import {
    defaultSettingsData,
    SettingsContext,
    SettingsContextData,
} from "../contexts/settings.context";
import { settingsReducer } from "../data/reducers/settings.reducer";
import {
    defaultListsStateData,
    ListsStateContext,
    ListsStateContextData,
} from "../contexts/listsState.context";
import { listsStateReducer } from "../data/reducers/listsState.reducer";
import {
    loginStateReducer,
    UpdateUsername,
} from "../data/reducers/loginState.reducer";
import {
    LoginContext,
    LoginContextData,
    defaultLoginData,
} from "../contexts/loginState.context";
import { itemsStateReducer } from "../data/reducers/itemsState.reducer";
import {
    defaultItemsStateData,
    ItemsStateContext,
    ItemsStateContextData,
} from "../contexts/itemsState.context";
import LegalPage from "./pages/LegalPage";
import AddUpdateItemPage from "./pages/AddUpdateItemPage";
import AddUpdateListPage from "./pages/AddUpdateListPage";
import { settingsStateReducer } from "../data/reducers/settingsState.reducer";
import LoginPage from "./pages/LoginPage";

export default function App(): JSX.Element {
    const Stack = createNativeStackNavigator<AppStackNavigatorParamList>();

    const [listsData, listsDispatch] = useReducer(
        listsReducer,
        defaultListsData
    );
    const { lists } = listsData;

    const [loginState, loginStateDispatch] = useReducer(
        loginStateReducer,
        defaultLoginData
    );
    const { username } = loginState;

    const [settings, settingsDispatch] = useReducer(
        settingsReducer,
        defaultSettingsData
    );

    const [listsState, listsStateDispatch] = useReducer(
        listsStateReducer,
        defaultListsStateData
    );

    const [itemsState, itemsStateDispatch] = useReducer(
        itemsStateReducer,
        defaultItemsStateData
    );

    const fetchData = async () => {
        const newSettings: Settings = await getSettings();
        settingsDispatch(new UpdateAllSettings(newSettings));

        const newLists: List[] = await getLists();
        listsDispatch(new UpdateAll(newLists));

        const newUsername: string | undefined = await getUsername();
        loginStateDispatch(new UpdateUsername(newUsername));
    };

    const saveData = async () => {
        await saveSettings(settings);
        await saveLists(lists);
        await saveUsername(username);
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        saveData();
    }, [settings, lists, username]);

    const listsContextData: ListsContextData = {
        data: listsData,
        listsDispatch: listsDispatch,
    };

    const loginContext: LoginContextData = {
        loginState: loginState,
        loginStateDispatch: loginStateDispatch,
    };

    const settingsContext: SettingsContextData = {
        settings: settings,
        settingsDispatch: settingsDispatch,
    };

    const listsStateContext: ListsStateContextData = {
        listsState: listsState,
        listsStateDispatch: listsStateDispatch,
    };

    const itemsStateContext: ItemsStateContextData = {
        itemsState: itemsState,
        itemsStateDispatch: itemsStateDispatch,
    };

    return (
        <LoginContext.Provider value={loginContext}>
            <ListsStateContext.Provider value={listsStateContext}>
                <ItemsStateContext.Provider value={itemsStateContext}>
                    <SettingsContext.Provider value={settingsContext}>
                        <ListsContext.Provider value={listsContextData}>
                            <NavigationContainer>
                                <Stack.Navigator>
                                    <Stack.Screen
                                        name="Login"
                                        component={LoginPage}
                                    />
                                    <Stack.Screen
                                        name="Lists"
                                        component={ListsPage}
                                        options={{
                                            title: "My Lists",

                                            // The user should not be allowed to go back to the login page.
                                            headerBackVisible: false,
                                        }}
                                    />
                                    <Stack.Screen
                                        name="Items"
                                        component={ItemsPage}
                                    />
                                    <Stack.Screen
                                        name="Settings"
                                        component={SettingsPage}
                                    />
                                    <Stack.Screen
                                        name="Legal"
                                        component={LegalPage}
                                    />
                                    <Stack.Screen
                                        name="AddUpdateItem"
                                        component={AddUpdateItemPage}
                                    />
                                    <Stack.Screen
                                        name="AddUpdateList"
                                        component={AddUpdateListPage}
                                    />
                                </Stack.Navigator>
                            </NavigationContainer>
                            <StatusBar style="auto" />
                        </ListsContext.Provider>
                    </SettingsContext.Provider>
                </ItemsStateContext.Provider>
            </ListsStateContext.Provider>
        </LoginContext.Provider>
    );
}
