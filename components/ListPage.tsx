import React, { useEffect, useState } from "react";
import DraggableFlatList, {
    RenderItemParams,
    ScaleDecorator,
} from "react-native-draggable-flatlist";
import {
    GestureHandlerRootView,
    TouchableOpacity,
} from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/core";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { List } from "../data/List";
import { AppStackNavigatorParamList } from "./App";

interface ListJSON {
    name: string;
}

type ListPageNavigationProp = NativeStackNavigationProp<
    AppStackNavigatorParamList,
    "Lists"
>;

export default function ListPage(): JSX.Element {
    const [lists, setLists] = useState<List[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            let lists: List[] = await getLists();
            if (lists.length === 0) {
                lists.push(new List("My List"));
            }
            setLists(lists);
        };

        fetchData();
    }, []);

    useEffect(() => {
        (async () => {
            await saveLists();
        })();
    }, [lists]);

    const getLists = async (): Promise<List[]> => {
        let lists: List[] = [];

        let listsJSONData: string | null = await AsyncStorage.getItem("lists");
        if (listsJSONData !== null) {
            let listsJSON: ListJSON[] = JSON.parse(listsJSONData);
            lists = listsJSON.map((list) => {
                return new List(list.name);
            });
        }
        return lists;
    };

    const saveLists = async (): Promise<void> => {
        let listsJSON: ListJSON[] = lists.map((list) => {
            return {
                name: list.name,
            };
        });

        let listsJSONData: string = JSON.stringify(listsJSON);

        await AsyncStorage.setItem("lists", listsJSONData);
    };

    const renderListsItem = ({ item, getIndex }: RenderItemParams<List>) => {
        let navigation = useNavigation<ListPageNavigationProp>();

        return (
            <ScaleDecorator>
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate("Items", {
                            listName: item.name,
                            listIndex: getIndex() || 0,
                        });
                    }}
                >
                    <View style={styles.listCell}>
                        <Text>{item.name}</Text>
                    </View>
                </TouchableOpacity>
            </ScaleDecorator>
        );
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <DraggableFlatList
                data={lists}
                onDragEnd={({ data, from, to }) => {
                    setLists(data);
                }}
                keyExtractor={(_, index) => `key-${index}`}
                renderItem={renderListsItem}
            />
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    listCell: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#555",
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
    },
});
