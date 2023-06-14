import React, { useEffect, useState } from "react";
import {
    RenderItemParams,
    ScaleDecorator,
} from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View, Text, Button, StyleSheet, Pressable, Image } from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/core";
import { MenuOption } from "react-native-popup-menu";

import { List } from "../data/List";
import { deleteListItems, getLists, saveLists } from "../data/utils";
import ListModal from "./ListModal";
import CollectionMenu from "./CollectionMenu";
import {
    getNumberOfItemsInList,
    itemsCountDisplay,
    listsCountDisplay,
    updateCollection,
} from "../utils";
import CollectionCellActions from "./CollectionCellActions";
import CustomModal from "./CustomModal";
import CustomList from "./CustomList";
import { ListPageNavigationProp, Position } from "../types";
import CustomMenu from "./CustomMenu";

export default function ListsPage(): JSX.Element {
    const [lists, setLists] = useState<List[]>([]);
    const [isListModalVisible, setIsListModalVisible] =
        useState<boolean>(false);
    const [currentListIndex, setCurrentListIndex] = useState<number>(-1);

    // Deletion
    const [numItemsInDeleted, setNumItemsInDeleted] = useState<number>(0);
    const [listIndexToDelete, setListIndexToDelete] = useState<number>(-1);

    const isFocused = useIsFocused();
    let navigation = useNavigation<ListPageNavigationProp>();

    const fetchData = async () => {
        setLists(await getLists());
    };

    useEffect(() => {
        // Get Data
        fetchData();

        // Set Menu
        navigation.setOptions({
            headerRight: () => (
                <CustomMenu>
                    <MenuOption
                        onSelect={() => navigation.navigate("Settings")}
                    >
                        <Text
                            style={{
                                fontSize: 20,
                                padding: 10,
                            }}
                        >
                            Settings
                        </Text>
                    </MenuOption>
                </CustomMenu>
            ),
        });
    }, [isFocused]);

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

    const addList = (_: number, newPos: Position, list: List): void => {
        if (list.name.trim().length <= 0) {
            setIsListModalVisible(false);
            return;
        }

        let newLists: List[] =
            newPos === "top" ? [list].concat(lists) : lists.concat(list);

        setLists(newLists);
        setIsListModalVisible(false);
    };

    const updateList = (oldPos: number, newPos: Position, list: List): void => {
        if (list.name.trim().length <= 0) {
            setIsListModalVisible(false);
            return;
        }

        let newLists: List[] = updateCollection(
            list,
            lists.concat(),
            oldPos,
            newPos
        );

        setLists(newLists);
        setIsListModalVisible(false);
    };

    const deleteList = (index: number): void => {
        let newLists: List[] = lists.concat();
        let listToRemove: List = lists[index];

        newLists.splice(index, 1);
        setLists(newLists);

        // Delete list items
        deleteListItems(listToRemove.id);
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
        const [numItems, setNumItems] = useState<number>(0);

        useEffect(() => {
            (async () => {
                if (isFocused) {
                    let numItems: number = await getNumberOfItemsInList(item);
                    setNumItems(numItems);
                }
            })();

            /* Update items count when:
             *   1. "lists" changes (a list is added or removed)
             *   2. When items are added to/removed from lists (via "isFocused")
             */
        }, [lists, isFocused]);

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
                            <Text
                                testID={`list-cell-name-${index}`}
                                style={{ fontSize: 30 }}
                            >
                                {item.name}
                            </Text>
                            <Text style={{ fontSize: 15 }}>
                                Shopping • {itemsCountDisplay(numItems)}
                            </Text>
                        </View>
                        <Image
                            source={require("../assets/right-arrow.png")}
                            style={{ width: 32, height: 32 }}
                        ></Image>
                        <CollectionCellActions
                            index={index}
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
                {/* <Button
                    title="Settings"
                    onPress={() => {
                        navigation.navigate("Settings");
                    }}
                /> */}
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
