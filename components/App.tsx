import { StatusBar } from "expo-status-bar";
import React, { createContext, useEffect, useReducer } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ListsPage from "./ListsPage";
import ItemsPage from "./ItemsPage";
import SettingsPage from "./SettingsPage";
import { AppDataContext, AppStackNavigatorParamList, Settings } from "../types";
import { getLists, getSettings, saveLists, saveSettings } from "../data/utils";
import ExportPage from "./ExportPage";
import ImportPage from "./ImportPage";
import { UpdateAll, appReducer } from "../data/reducers/app.reducer";
import { List } from "../data/data";
import { AppContext, defaultAppData } from "../contexts/app.context";

export default function App(): JSX.Element {
    const Stack = createNativeStackNavigator<AppStackNavigatorParamList>();

    const [appData, appDispatch] = useReducer(appReducer, defaultAppData);
    const { settings, lists } = appData;

    const fetchData = async () => {
        const newSettings: Settings = await getSettings();
        const newLists: List[] = await getLists();

        appDispatch(new UpdateAll(newSettings, newLists));
    };

    const saveData = async () => {
        await saveSettings(settings);
        await saveLists(lists);
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
                    <Stack.Screen name="Export" component={ExportPage} />
                    <Stack.Screen name="Import" component={ImportPage} />
                </Stack.Navigator>
            </NavigationContainer>
            <StatusBar style="auto" />
        </AppContext.Provider>
    );
}
