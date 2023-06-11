import React, { useEffect, useState } from "react";
import {
    RenderItemParams,
    ScaleDecorator,
} from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View, Text, Button, StyleSheet, Pressable } from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/core";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { List } from "../data/List";
import { AppStackNavigatorParamList } from "./App";
import { deleteListItems, getLists, saveLists } from "../data/utils";
import ListModal from "./CreateEditListModal";
import CollectionMenu from "./CollectionMenu";
import {
    getNumberOfItemsInList,
    itemsCountDisplay,
    listsCountDisplay,
    pluralize,
} from "../utils";
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

    // Deletion
    const [numItemsInDeleted, setNumItemsInDeleted] = useState<number>(0);
    const [listIndexToDelete, setListIndexToDelete] = useState<number>(-1);

    const isFocused = useIsFocused();

    const fetchData = async () => {
        let lists: List[] = await getLists();
        setLists(lists);
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const saveData = async () => {
            await saveLists(lists);
        };
        saveData();
    }, [lists]);

    useEffect(() => {
        const fetchNumItems = async () => {
            if (listIndexToDelete > -1) {
                let list: List = lists[listIndexToDelete];
                let numItems: number = await getNumberOfItemsInList(list);
                setNumItemsInDeleted(numItems);
            } else {
                setNumItemsInDeleted(0);
            }
        };
        fetchNumItems();
    }, [listIndexToDelete]);

    const addList = (_: number, list: List): void => {
        if (list.name.trim().length <= 0) {
            setIsListModalVisible(false);
            return;
        }

        setLists(lists.concat(list));
        setIsListModalVisible(false);
    };

    const updateList = async (index: number, list: List): Promise<void> => {
        if (list.name.trim().length <= 0) {
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

    const deleteList = (index: number): void => {
        let newLists: List[] = lists.concat();
        let listToRemove: List = lists[index];

        newLists.splice(index, 1);
        setLists(newLists);

        // Delete list items
        const deleteItems = async () => {
            await deleteListItems(listToRemove.id);
        };
        deleteItems();
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
        const [numItems, setNumItems] = useState<number>(0);

        useEffect(() => {
            (async () => {
                if (isFocused) {
                    let numItems: number = await getNumberOfItemsInList(item);
                    setNumItems(numItems);
                }
            })();
        }, [isFocused]);

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
                        <View style={styles.listCellText}>
                            <Text style={{ fontSize: 30 }}>{item.name}</Text>
                            <Text style={{ fontSize: 15 }}>
                                {itemsCountDisplay(numItems)}
                            </Text>
                        </View>
                        <CollectionCellActions
                            updateAction={() => {
                                openUpdateListModal(index);
                            }}
                            deleteAction={() => {
                                setListIndexToDelete(index);
                            }}
                        />
                    </View>
                </Pressable>
            </ScaleDecorator>
        );
    };

    let headerString: string = listsCountDisplay(lists.length);

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
                isVisible={listIndexToDelete !== -1}
                positiveActionText={"Yes"}
                positiveAction={() => {
                    deleteList(listIndexToDelete);
                    setListIndexToDelete(-1);
                }}
                negativeActionText={"No"}
                negativeAction={() => {
                    setListIndexToDelete(-1);
                }}
            >
                <Text>
                    This list contains
                    {` ${itemsCountDisplay(numItemsInDeleted)}`}. Are you sure
                    you want to delete it?
                </Text>
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
    listCellText: {
        flex: 1,
        flexDirection: "column",
    },
});
