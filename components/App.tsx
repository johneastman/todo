import { StatusBar } from "expo-status-bar";
import React, { useEffect, useReducer, useRef, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ListsPage from "./pages/ListsPage";
import ItemsPage from "./pages/ItemsPage";
import SettingsPage from "./pages/SettingsPage";
import { ListsContextData, AppStackNavigatorParamList } from "../types";
import { getLists, getSettings, saveLists, saveSettings } from "../data/utils";
import { UpdateAll, listsReducer } from "../data/reducers/lists.reducer";
import {
    Settings,
    UpdateAll as UpdateAllSettings,
} from "../data/reducers/settings.reducer";
import { List } from "../data/data";
import { ListsContext, defaultListsData } from "../contexts/lists.context";
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
import { itemsStateReducer } from "../data/reducers/itemsState.reducer";
import {
    defaultItemsStateData,
    ItemsStateContext,
    ItemsStateContextData,
} from "../contexts/itemsState.context";
import LegalPage from "./pages/LegalPage";
import AddUpdateItemPage from "./pages/AddUpdateItemPage";
import AddUpdateListPage from "./pages/AddUpdateListPage";
import ActionsPage from "./pages/ActionsPage";
import { AppState } from "react-native";

export default function App(): JSX.Element {
    const Stack = createNativeStackNavigator<AppStackNavigatorParamList>();

    const [listsData, listsDispatch] = useReducer(
        listsReducer,
        defaultListsData,
    );
    const { lists } = listsData;

    const [settings, settingsDispatch] = useReducer(
        settingsReducer,
        defaultSettingsData,
    );

    const [listsState, listsStateDispatch] = useReducer(
        listsStateReducer,
        defaultListsStateData,
    );

    const [itemsState, itemsStateDispatch] = useReducer(
        itemsStateReducer,
        defaultItemsStateData,
    );

    const [isHydrated, setIsHydrated] = useState(false);
    const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const fetchData = async () => {
        const newSettings: Settings = await getSettings();
        settingsDispatch(new UpdateAllSettings(newSettings));

        const newLists: List[] = await getLists();
        listsDispatch(new UpdateAll(newLists));

        setIsHydrated(true);
    };

    const saveData = async () => {
        await saveSettings(settings);
        await saveLists(lists);
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Save data when user activity stops
    useEffect(() => {
        if (!isHydrated) return;

        if (saveTimer.current !== null) {
            clearTimeout(saveTimer.current);
        }

        saveTimer.current = setTimeout(() => {
            saveData();
        }, 750);

        return () => {
            if (saveTimer.current !== null) {
                clearTimeout(saveTimer.current);
            }
        };
    }, [isHydrated, settings, lists]);

    // Save data when the app goes into the background or becomes inactive
    useEffect(() => {
        if (!isHydrated) {
            return;
        }

        const subscription = AppState.addEventListener(
            "change",
            (nextState) => {
                if (nextState === "background" || nextState === "inactive") {
                    if (saveTimer.current !== null) {
                        clearTimeout(saveTimer.current);
                        saveTimer.current = null;
                    }
                    saveData();
                }
            },
        );

        return () => subscription.remove();
    }, [isHydrated, settings, lists]);

    const listsContextData: ListsContextData = {
        data: listsData,
        listsDispatch: listsDispatch,
    };

    const settingsContext: SettingsContextData = {
        settings: settings,
        settingsDispatch: settingsDispatch,
    };

    const listsStateContext: ListsStateContextData = {
        listsState: listsState,
        listsStateDispatch: listsStateDispatch,
    };

    const itemsStateContext: ItemsStateContextData = {
        itemsState: itemsState,
        itemsStateDispatch: itemsStateDispatch,
    };

    return (
        <ListsStateContext.Provider value={listsStateContext}>
            <ItemsStateContext.Provider value={itemsStateContext}>
                <SettingsContext.Provider value={settingsContext}>
                    <ListsContext.Provider value={listsContextData}>
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
                                <Stack.Screen
                                    name="Legal"
                                    component={LegalPage}
                                />
                                <Stack.Screen
                                    name="AddUpdateItem"
                                    component={AddUpdateItemPage}
                                />
                                <Stack.Screen
                                    name="AddUpdateList"
                                    component={AddUpdateListPage}
                                />
                                <Stack.Screen
                                    name="Actions"
                                    component={ActionsPage}
                                />
                            </Stack.Navigator>
                        </NavigationContainer>
                        <StatusBar style="auto" />
                    </ListsContext.Provider>
                </SettingsContext.Provider>
            </ItemsStateContext.Provider>
        </ListsStateContext.Provider>
    );
}
