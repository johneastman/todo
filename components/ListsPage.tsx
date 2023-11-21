import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Text, Button } from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/core";

import { List, MenuData } from "../data/data";
import { deleteListItems, getLists, saveLists } from "../data/utils";
import ListModal from "./ListModal";
import ListViewHeader from "./ListViewHeader";
import {
    areCellsSelected,
    areTestsRunning,
    deleteCollectionMenuStyle,
    handleSelectAll,
    isCellBeingEdited,
    listsCountDisplay,
    selectedListCellsWording,
    updateCellBeingEdited,
    updateCollection,
} from "../utils";
import CustomModal from "./CustomModal";
import CustomList from "./CustomList";
import { ListPageNavigationProp, Position } from "../types";
import ListCellView from "./ListCellView";
import CustomMenu from "./CustomMenu";
import ListCellWrapper from "./ListCellWrapper";
import ListPageView from "./ListPageView";

export default function ListsPage(): JSX.Element {
    const [lists, setLists] = useState<List[]>([]);
    const [isListModalVisible, setIsListModalVisible] =
        useState<boolean>(false);
    const [currentListIndex, setCurrentListIndex] = useState<number>(-1);

    // Editing Lists
    const [listsBeingEdited, setListsBeingEdited] = useState<number[]>([]);
    const [isAllListsSelected, setIsAllListsSelected] =
        useState<boolean>(false);

    // Deletion
    const [isDeleteAllListsModalVisible, setIsDeleteAllListsModalVisible] =
        useState<boolean>(false);

    const isFocused = useIsFocused();
    let navigation = useNavigation<ListPageNavigationProp>();

    const fetchData = async () => {
        setLists(await getLists());
    };

    useEffect(() => {
        // Get Data
        fetchData();
    }, [isFocused]);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <CustomMenu
                    menuData={[
                        new MenuData(
                            `Delete ${selectedListCellsWording(
                                listsBeingEdited
                            )} Lists`,
                            openDeleteAllListsModal,
                            lists.length === 0,
                            deleteCollectionMenuStyle(lists)
                        ),
                        new MenuData("Settings", () =>
                            navigation.navigate("Settings")
                        ),
                    ]}
                />
            ),
        });
    }, [navigation, lists, listsBeingEdited]);

    useEffect(() => {
        const saveData = async () => {
            await saveLists(lists);
        };
        saveData();
    }, [lists]);

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
        setListsBeingEdited([]);
    };

    const deleteAllLists = async (): Promise<void> => {
        // Filter out lists we want to delete
        const listsToRemove: List[] = areCellsSelected(listsBeingEdited)
            ? lists.filter((_, index) => listsBeingEdited.indexOf(index) !== -1)
            : lists;
        for (let list of listsToRemove) {
            await deleteListItems(list.id);
        }

        // Lists we want to keep
        const newLists: List[] = areCellsSelected(listsBeingEdited)
            ? lists.filter((_, index) => listsBeingEdited.indexOf(index) === -1)
            : [];

        setLists(newLists);
        setListsBeingEdited([]);
    };

    const openUpdateListModal = (index: number): void => {
        setIsListModalVisible(true);
        setCurrentListIndex(index);
    };

    const openDeleteAllListsModal = (): void => {
        setIsDeleteAllListsModalVisible(true);
    };

    /**
     * If the user invokes the alternate action while adding a new list, the modal
     * will reset to add another list.
     *
     * If the user invokes the alternate action while editing a list, the modal will
     * reset to the next list, allowing the user to continually update subsequent
     * lists. If the user is on the last list and clicks "next", the modal will
     * dismiss itself.
     */
    const altAction = (): void => {
        if (currentListIndex === -1) {
            setIsListModalVisible(true);
        } else {
            if (currentListIndex + 1 < lists.length) {
                setIsListModalVisible(true);
            }
            setCurrentListIndex(currentListIndex + 1);
        }
    };

    let headerString: string = listsCountDisplay(lists.length);

    return (
        <ListPageView>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <ListModal
                    isVisible={isListModalVisible}
                    title={
                        currentListIndex === -1
                            ? "Add a New List"
                            : "Update List"
                    }
                    list={lists[currentListIndex]}
                    index={currentListIndex}
                    positiveActionText={
                        currentListIndex === -1 ? "Add" : "Update"
                    }
                    positiveAction={
                        currentListIndex === -1 ? addList : updateList
                    }
                    negativeActionText={"Cancel"}
                    negativeAction={() => {
                        setIsListModalVisible(false);
                        setListsBeingEdited([]);
                    }}
                    altActionText="Next"
                    altAction={altAction}
                />

                <CustomModal
                    title={`Are you sure you want to delete ${
                        areCellsSelected(listsBeingEdited)
                            ? "the selected"
                            : "all of your"
                    } lists?`}
                    isVisible={isDeleteAllListsModalVisible}
                    positiveActionText={"Yes"}
                    positiveAction={async () => {
                        // Delete all lists, including items in those lists
                        await deleteAllLists();
                        setIsDeleteAllListsModalVisible(false);
                    }}
                    negativeActionText={"No"}
                    negativeAction={() => {
                        setIsDeleteAllListsModalVisible(false);
                    }}
                />

                <ListViewHeader
                    title={headerString}
                    isAllSelected={isAllListsSelected}
                    onChecked={(checked: boolean) =>
                        handleSelectAll(
                            checked,
                            lists,
                            setListsBeingEdited,
                            setIsAllListsSelected
                        )
                    }
                    right={
                        <>
                            {listsBeingEdited.length === 1 ? (
                                <Button
                                    title="Edit List"
                                    onPress={() => {
                                        openUpdateListModal(
                                            listsBeingEdited[0]
                                        );
                                    }}
                                />
                            ) : null}

                            <Button
                                title="Add List"
                                onPress={() => {
                                    setIsListModalVisible(true);
                                    setCurrentListIndex(-1);
                                }}
                            />
                        </>
                    }
                >
                    {areTestsRunning() ? (
                        /* Due to issues with rendering items in "react-native-popup-menu" (see this issue:
                         * https://github.com/johneastman/todo/issues/50 ), the logic associated with those menu
                         * items is also added here. These views are only rendered during testing.
                         *
                         * It's a hacky solution, but it allows for testing functional workflows in the app.
                         */
                        <>
                            <Button
                                title="Delete All Items"
                                testID="lists-page-delete-all-items"
                                onPress={() => openDeleteAllListsModal()}
                            />
                        </>
                    ) : null}
                </ListViewHeader>

                <CustomList
                    items={lists}
                    renderItem={(params) => (
                        <ListCellWrapper
                            renderParams={params}
                            onPress={() => {
                                navigation.navigate("Items", {
                                    list: params.item,
                                });
                            }}
                        >
                            <ListCellView
                                isFocused={isFocused}
                                lists={lists}
                                isListBeingEdited={(index: number) =>
                                    isCellBeingEdited(listsBeingEdited, index)
                                }
                                updateItemBeingEdited={(
                                    index: number,
                                    addToList: boolean
                                ) => {
                                    updateCellBeingEdited(
                                        listsBeingEdited,
                                        setListsBeingEdited,
                                        index,
                                        addToList
                                    );
                                }}
                            />
                        </ListCellWrapper>
                    )}
                    drag={({ data, from, to }) => {
                        setLists(data);
                    }}
                />
            </GestureHandlerRootView>
        </ListPageView>
    );
}
