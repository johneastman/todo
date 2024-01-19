import { StatusBar } from "expo-status-bar";
import React, { useEffect, useReducer } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ListsPage from "./ListsPage";
import ItemsPage from "./ItemsPage";
import SettingsPage from "./SettingsPage";
import { AppStackNavigatorParamList, Settings } from "../types";
import { getSettings, saveSettings } from "../data/utils";
import ExportPage from "./ExportPage";
import ImportPage from "./ImportPage";
import {
    SettingsContext,
    UpdateAll,
    settingsReducer,
} from "../data/reducers/settings.reducer";

export default function App(): JSX.Element {
    const Stack = createNativeStackNavigator<AppStackNavigatorParamList>();

    const [settings, settingsDispatch] = useReducer(settingsReducer, {
        isDeveloperModeEnabled: false,
        defaultListType: "List",
        defaultListPosition: "bottom",
    });

    const fetchData = async () => {
        const settings: Settings = await getSettings();
        settingsDispatch(new UpdateAll(settings));
    };

    const saveData = async () => await saveSettings(settings);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        saveData();
    }, [settings]);

    return (
        <SettingsContext.Provider
            value={{ settings: settings, settingsDispatch: settingsDispatch }}
        >
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
        </SettingsContext.Provider>
    );
}
