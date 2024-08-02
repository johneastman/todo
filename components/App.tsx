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
import LoginModal from "./LoginModal";
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
    accountReducer,
    UpdateUsername,
} from "../data/reducers/account.reducer";
import {
    AccountContext,
    AccountContextData,
    defaultAccountData,
} from "../contexts/account.context";
import { itemsStateReducer } from "../data/reducers/itemsState.reducer";
import {
    defaultItemsStateData,
    ItemsStateContext,
    ItemsStateContextData,
} from "../contexts/itemsState.context";
import LegalPage from "./pages/LegalPage";
import AddUpdateItemPage from "./pages/AddUpdateItemPage";

export default function App(): JSX.Element {
    const Stack = createNativeStackNavigator<AppStackNavigatorParamList>();

    const [listsData, listsDispatch] = useReducer(
        listsReducer,
        defaultListsData
    );
    const { lists } = listsData;

    const [account, accountDispatch] = useReducer(
        accountReducer,
        defaultAccountData
    );
    const { username } = account;

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
        accountDispatch(new UpdateUsername(newUsername));
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

    const accountContext: AccountContextData = {
        account: account,
        accountDispatch: accountDispatch,
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
        <AccountContext.Provider value={accountContext}>
            <ListsStateContext.Provider value={listsStateContext}>
                <ItemsStateContext.Provider value={itemsStateContext}>
                    <SettingsContext.Provider value={settingsContext}>
                        <ListsContext.Provider value={listsContextData}>
                            <LoginModal />
                            <NavigationContainer>
                                <Stack.Navigator>
                                    <Stack.Screen
                                        name="Lists"
                                        component={ListsPage}
                                        options={{
                                            title: "My Lists",
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
                                </Stack.Navigator>
                            </NavigationContainer>
                            <StatusBar style="auto" />
                        </ListsContext.Provider>
                    </SettingsContext.Provider>
                </ItemsStateContext.Provider>
            </ListsStateContext.Provider>
        </AccountContext.Provider>
    );
}
