import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import React from "react";
import ListPage from "./ListPage";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ItemsPage from "./ItemsPage";
import { Item } from "../data/Item";

export type AppStackNavigatorParamList = {
    Lists: undefined;
    Items: {
        listName: string;
        listId: string;
    };
};

export default function App(): JSX.Element {
    const Stack = createNativeStackNavigator<AppStackNavigatorParamList>();

    return (
        <>
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen
                        name="Lists"
                        component={ListPage}
                        options={{ title: "My Lists" }}
                    />
                    <Stack.Screen name="Items" component={ItemsPage} />
                </Stack.Navigator>
            </NavigationContainer>
            <ExpoStatusBar style="auto" />
        </>
    );
}
