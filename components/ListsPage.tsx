import React, { useEffect, useState } from "react";
import {
    RenderItemParams,
    ScaleDecorator,
} from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View, Text, Button, StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/core";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { List } from "../data/List";
import { AppStackNavigatorParamList } from "./App";
import { getLists, saveLists } from "../data/utils";
import ListModal from "./CreateEditListModal";
import CollectionMenu from "./CollectionMenu";
import { pluralize } from "../utils";
import CollectionCellActions from "./CollectionCellActions";
import CustomModal from "./CustomModal";
import CustomList from "./CustomList";

type ListPageNavigationProp = NativeStackNavigationProp<
    AppStackNavigatorParamList,
    "Lists"
>;

export default function ListsPage(): JSX.Element {
    const [lists, setLists] = useState<List[]>([]);
    const [isListModalVisible, setIsListModalVisible] =
        useState<boolean>(false);
    const [currentListIndex, setCurrentListIndex] = useState<number>(-1);
    const [listToDelete, setListToDelete] = useState<number>(); // Needed because of delete confirmation for lists

    useEffect(() => {
        const fetchData = async () => {
            let lists: List[] = await getLists();
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

    const addList = (_: number, list: List): void => {
        setLists(lists.concat(list));
        setIsListModalVisible(false);
    };

    const updateList = async (index: number, list: List): Promise<void> => {
        if (list.name.length <= 0) {
            setIsListModalVisible(false);
            return;
        }

        let newLists: List[] = lists
            .slice(0, index)
            .concat(list)
            .concat(lists.slice(index + 1));

        setLists(newLists);
        setIsListModalVisible(false);
    };

    const deleteItem = (index: number): void => {
        let newLists: List[] = lists.concat();
        newLists.splice(index, 1);
        setLists(newLists);
    };

    const openUpdateListModal = (index: number): void => {
        setIsListModalVisible(true);
        setCurrentListIndex(index);
    };

    const renderListsItem = ({
        item,
        getIndex,
        drag,
        isActive,
    }: RenderItemParams<List>) => {
        let navigation = useNavigation<ListPageNavigationProp>();

        let index: number = getIndex() ?? -1;

        return (
            <ScaleDecorator>
                <Pressable
                    disabled={isActive}
                    onLongPress={drag}
                    onPress={() => {
                        navigation.navigate("Items", {
                            listName: item.name,
                            listId: item.id,
                        });
                    }}
                >
                    <View
                        style={[
                            styles.listCell,
                            {
                                backgroundColor: isActive
                                    ? "lightblue"
                                    : "white",
                            },
                        ]}
                    >
                        <Text style={{ fontSize: 20 }}>{item.name}</Text>
                        <CollectionCellActions
                            updateAction={() => {
                                openUpdateListModal(index);
                            }}
                            deleteAction={() => {
                                setListToDelete(index);
                            }}
                        />
                    </View>
                </Pressable>
            </ScaleDecorator>
        );
    };

    let listsLength: number = lists.length;
    let headerString: string = `${listsLength} ${pluralize(
        listsLength,
        "List",
        "Lists"
    )}`;

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <ListModal
                isVisible={isListModalVisible}
                title={
                    currentListIndex === -1 ? "Add a New List" : "Update List"
                }
                list={lists[currentListIndex]}
                index={currentListIndex}
                positiveActionText={currentListIndex === -1 ? "Add" : "Update"}
                positiveAction={currentListIndex === -1 ? addList : updateList}
                negativeActionText={"Cancel"}
                negativeAction={() => setIsListModalVisible(false)}
            />

            <CustomModal
                title={"Confirm List Deletion"}
                isVisible={listToDelete !== undefined}
                positiveActionText={"Yes"}
                positiveAction={() => {
                    if (listToDelete === undefined) return;

                    deleteItem(listToDelete);
                    setListToDelete(undefined);
                }}
                negativeActionText={"No"}
                negativeAction={() => {
                    setListToDelete(undefined);
                }}
            >
                {listToDelete !== undefined ? (
                    <>
                        <Text>Are you sure you want to delete this list?</Text>
                    </>
                ) : (
                    <Text>Error: Cannot find list to delete</Text>
                )}
            </CustomModal>

            <CollectionMenu headerString={headerString}>
                <Button
                    title="Add List"
                    onPress={() => {
                        setIsListModalVisible(true);
                        setCurrentListIndex(-1);
                    }}
                />
            </CollectionMenu>

            <CustomList
                items={lists}
                renderItem={renderListsItem}
                drag={async ({ data, from, to }) => {
                    setLists(data);
                }}
            />
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    listCell: {
        flex: 1,
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#555",
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
    },
});
