import { StatusBar } from "expo-status-bar";
import React, { useEffect, useReducer, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ListsPage from "./ListsPage";
import ItemsPage from "./ItemsPage";
import SettingsPage from "./SettingsPage";
import { AppStackNavigatorParamList } from "../types";
import { getSettings, saveSettings } from "../data/utils";
import ExportPage from "./ExportPage";
import ImportPage from "./ImportPage";
import { Settings } from "../data/data";
import {
    SettingsContext,
    UpdateAll,
    defaultSettings,
    settingsReducer,
} from "../data/reducers/settingsReducer";

export default function App(): JSX.Element {
    const Stack = createNativeStackNavigator<AppStackNavigatorParamList>();

    const [isLoaded, setIsLoaded] = useState<boolean>(false);

    const [settings, settingsDispatch] = useReducer(
        settingsReducer,
        defaultSettings
    );

    useEffect(() => {
        (async () => {
            // Load settings
            const settings: Settings = await getSettings();
            settingsDispatch(new UpdateAll(settings));

            setIsLoaded(true);
        })();
    }, []);

    useEffect(() => {
        (async () => {
            if (isLoaded) await saveSettings(settings);
        })();
    }, [settings]);

    const settingsContextValue = {
        settings: settings,
        settingsDispatch: settingsDispatch,
    };

    return (
        <SettingsContext.Provider value={settingsContextValue}>
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
