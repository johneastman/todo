import { StatusBar } from "expo-status-bar";
import React, { useEffect, useReducer } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ListsPage from "./ListsPage";
import ItemsPage from "./ItemsPage";
import SettingsPage from "./SettingsPage";
import { AppDataContext, AppStackNavigatorParamList, Settings } from "../types";
import {
    getLists,
    getSettings,
    getUsername,
    saveLists,
    saveSettings,
    saveUsername,
} from "../data/utils";
import { UpdateAll, appReducer } from "../data/reducers/app.reducer";
import { List } from "../data/data";
import { AppContext, defaultAppData } from "../contexts/app.context";
import LoginModal from "./LoginModal";

export default function App(): JSX.Element {
    const Stack = createNativeStackNavigator<AppStackNavigatorParamList>();

    const [appData, appDispatch] = useReducer(appReducer, defaultAppData);
    const {
        settings,
        lists,
        accountState: { username },
    } = appData;

    const fetchData = async () => {
        const newSettings: Settings = await getSettings();
        const newLists: List[] = await getLists();

        const newUsername: string | undefined = await getUsername();

        appDispatch(new UpdateAll(newSettings, newLists, newUsername));
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

    return (
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
                    <Stack.Screen name="Items" component={ItemsPage} />
                    <Stack.Screen name="Settings" component={SettingsPage} />
                </Stack.Navigator>
            </NavigationContainer>
            <StatusBar style="auto" />
        </AppContext.Provider>
    );
}
