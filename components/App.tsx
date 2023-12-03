import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ListsPage from "./ListsPage";
import ItemsPage from "./ItemsPage";
import SettingsPage from "./SettingsPage";
import {
    AppStackNavigatorParamList,
    SettingsContext,
    defaultSettings,
    Settings,
    ListTypeValue,
} from "../types";
import {
    getDefaultListType,
    getDeveloperMode,
    saveDefaultListType,
    saveDeveloperMode,
} from "../data/utils";

export default function App(): JSX.Element {
    const Stack = createNativeStackNavigator<AppStackNavigatorParamList>();

    const [settings, setSettings] = useState<Settings>(defaultSettings);

    useEffect(() => {
        (async () => {
            let devMode: boolean = await getDeveloperMode();
            let listType: ListTypeValue = await getDefaultListType();

            setSettings({
                isDeveloperModeEnabled: devMode,
                defaultListType: listType,
                updateSettings: setSettings,
            });
        })();
    }, []);

    useEffect(() => {
        (async () => {
            await saveDeveloperMode(settings.isDeveloperModeEnabled);
            await saveDefaultListType(settings.defaultListType);
        })();
    }, [settings]);

    return (
        <SettingsContext.Provider value={settings}>
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
        </SettingsContext.Provider>
    );
}
