import { StatusBar } from "expo-status-bar";
import React, { useEffect, useReducer } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ListsPage from "./ListsPage";
import ItemsPage from "./ItemsPage";
import SettingsPage from "./SettingsPage";
import { AppDataContext, AppStackNavigatorParamList } from "../types";
import {
    getLists,
    getSettings,
    getUsername,
    saveLists,
    saveSettings,
    saveUsername,
} from "../data/utils";
import { UpdateAll, appReducer } from "../data/reducers/app.reducer";
import {
    Settings,
    UpdateAll as UpdateAllSettings,
} from "../data/reducers/settings.reducer";
import { List } from "../data/data";
import { AppContext, defaultAppData } from "../contexts/app.context";
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

export default function App(): JSX.Element {
    const Stack = createNativeStackNavigator<AppStackNavigatorParamList>();

    const [appData, appDispatch] = useReducer(appReducer, defaultAppData);
    const { lists } = appData;

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

    const fetchData = async () => {
        const newSettings: Settings = await getSettings();
        settingsDispatch(new UpdateAllSettings(newSettings));

        const newLists: List[] = await getLists();
        appDispatch(new UpdateAll(newLists));

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
    }, [appData]);

    const appContext: AppDataContext = { data: appData, dispatch: appDispatch };
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

    return (
        <AccountContext.Provider value={accountContext}>
            <ListsStateContext.Provider value={listsStateContext}>
                <SettingsContext.Provider value={settingsContext}>
                    <AppContext.Provider value={appContext}>
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
                            </Stack.Navigator>
                        </NavigationContainer>
                        <StatusBar style="auto" />
                    </AppContext.Provider>
                </SettingsContext.Provider>
            </ListsStateContext.Provider>
        </AccountContext.Provider>
    );
}
