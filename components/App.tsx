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
} from "../types";
import { getSettings, saveSettings } from "../data/utils";
import ExportPage from "./ExportPage";
import ImportPage from "./ImportPage";
import SectionedList from "./SectionedList";

export default function App(): JSX.Element {
    const Stack = createNativeStackNavigator<AppStackNavigatorParamList>();

    const [settings, setSettings] = useState<Settings>(defaultSettings);

    useEffect(() => {
        (async () => {
            const settings: Settings = await getSettings(setSettings);

            setSettings(settings);
        })();
    }, []);

    useEffect(() => {
        (async () => {
            await saveSettings(settings);
        })();
    }, [settings]);

    return (
        <SettingsContext.Provider value={settings}>
            <NavigationContainer>
                <Stack.Navigator>
                    {/* <Stack.Screen
                        name="SectionedList"
                        component={SectionedList}
                        options={{
                            title: "Sectioned List",
                        }}
                    /> */}
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
