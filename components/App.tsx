import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import React from "react";
import ListsPage from "./ListsPage";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ItemsPage from "./ItemsPage";
import Settings from "./Settings";

export type AppStackNavigatorParamList = {
    Lists: undefined;
    Items: {
        listName: string;
        listId: string;
    };
    Settings: undefined;
};

export default function App(): JSX.Element {
    const Stack = createNativeStackNavigator<AppStackNavigatorParamList>();

    return (
        <>
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen
                        name="Lists"
                        component={ListsPage}
                        options={{ title: "My Lists" }}
                    />
                    <Stack.Screen name="Items" component={ItemsPage} />
                    <Stack.Screen name="Settings" component={Settings} />
                </Stack.Navigator>
            </NavigationContainer>
            <ExpoStatusBar style="auto" />
        </>
    );
}
