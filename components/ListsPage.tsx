import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Text, Button } from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/core";

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
import CustomModal from "./CustomModal";
import CustomList from "./CustomList";
import { ListPageNavigationProp, Position } from "../types";
import ListPageCell from "./ListsPageCell";
import ListsPageMenu from "./ListsPageMenu";

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
            headerRight: () => <ListsPageMenu navigation={navigation} />,
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
                renderItem={(params) => (
                    <ListPageCell
                        renderItemParams={params}
                        isFocused={isFocused}
                        lists={lists}
                        navigation={navigation}
                        openUpdateListModal={openUpdateListModal}
                        setListIndexToDelete={setListIndexToDelete}
                    />
                )}
                drag={async ({ data, from, to }) => {
                    setLists(data);
                }}
            />
        </GestureHandlerRootView>
    );
}
