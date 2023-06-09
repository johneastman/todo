import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MenuProvider } from "react-native-popup-menu";

import ListsPage from "./ListsPage";
import ItemsPage from "./ItemsPage";
import SettingsPage from "./SettingsPage";
import { AppStackNavigatorParamList } from "../types";

export default function App(): JSX.Element {
    const Stack = createNativeStackNavigator<AppStackNavigatorParamList>();

    return (
        <>
            <MenuProvider>
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
                        <Stack.Screen
                            name="Settings"
                            component={SettingsPage}
                        />
                    </Stack.Navigator>
                </NavigationContainer>
            </MenuProvider>
            <ExpoStatusBar style="auto" />
        </>
    );
}
