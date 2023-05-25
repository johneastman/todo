import React, { useEffect, useState } from "react";
import DraggableFlatList, {
    RenderItemParams,
    ScaleDecorator,
} from "react-native-draggable-flatlist";
import {
    GestureHandlerRootView,
    TouchableOpacity,
} from "react-native-gesture-handler";
import { View, Text, Button, StyleSheet, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/core";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import uuid from "react-native-uuid";

import { List } from "../data/List";
import { AppStackNavigatorParamList } from "./App";
import { getLists, saveLists } from "../data/utils";
import ListModal from "./CreateEditListModal";

type ListPageNavigationProp = NativeStackNavigationProp<
    AppStackNavigatorParamList,
    "Lists"
>;

export default function ListPage(): JSX.Element {
    const [lists, setLists] = useState<List[]>([]);
    const [isAddListVisible, setIsAddListVisible] = useState<boolean>(false);
    const [currentList, setCurrentList] = useState<List>();

    useEffect(() => {
        const fetchData = async () => {
            let lists: List[] = await getLists();
            if (lists.length === 0) {
                lists.push(new List(uuid.v4().toString(), "First List", []));
                lists.push(new List(uuid.v4().toString(), "Second List", []));
            }
            setLists(lists);
        };

        fetchData();
    }, []);

    useEffect(() => {
        const saveData = async () => {
            await saveLists(lists);
        };
        saveData();
    }, [lists]);

    const addList = (newList: List): void => {
        setLists(lists.concat(newList));
        setIsAddListVisible(false);
    };

    const renderListsItem = ({ item, drag }: RenderItemParams<List>) => {
        let navigation = useNavigation<ListPageNavigationProp>();

        return (
            <ScaleDecorator>
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate("Items", {
                            listName: item.name,
                            listId: item.id,
                        });
                    }}
                    onLongPress={drag}
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
            <ListModal
                isVisible={isAddListVisible}
                title="Add a New List"
                list={currentList}
                positiveActionText={"Add"}
                positiveAction={addList}
                negativeActionText={"Cancel"}
                negativeAction={() => setIsAddListVisible(false)}
            />

            {/* TODO: Break out into component */}
            <View style={styles.menu}>
                <View
                    style={{
                        flexDirection: "row",
                        gap: 10,
                        alignItems: "center",
                    }}
                >
                    <Button
                        title="Add List"
                        onPress={() => setIsAddListVisible(true)}
                    />
                </View>
            </View>
            <DraggableFlatList
                data={lists}
                onDragEnd={async ({ data, from, to }) => {
                    /* "data" is in the correct order, but it contains outdated values (for example, if a user deletes an item
                     * from a list, "data" will still contain the removed item), so retrieve the current data and reorder
                     * the values manually
                     */
                    let lists: List[] = await getLists();

                    let tmp: List = lists[from];
                    lists[from] = lists[to];
                    lists[to] = tmp;

                    setLists(lists);
                }}
                keyExtractor={(list, _) => list.id}
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
    menu: {
        paddingVertical: StatusBar.currentHeight,
        backgroundColor: "lightblue",
        alignItems: "center",
        gap: 10,
    },
});
