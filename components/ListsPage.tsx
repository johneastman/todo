import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Button } from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/core";

import { List, MenuOption } from "../data/data";
import { deleteListItems, getLists, saveLists } from "../data/utils";
import ListModal from "./ListModal";
import ListViewHeader from "./ListViewHeader";
import {
    areCellsSelected,
    getItemBeingEdited,
    getSelectedItems,
    isAllSelected,
    listsCountDisplay,
    selectedListCellsWording,
    updateCollection,
} from "../utils";
import CustomList from "./CustomList";
import { ListPageNavigationProp, Position } from "../types";
import ListCellView from "./ListCellView";
import ListCellWrapper from "./ListCellWrapper";
import ListPageView from "./ListPageView";
import DeleteAllModal from "./DeleteAllModal";

export default function ListsPage(): JSX.Element {
    const [lists, setLists] = useState<List[]>([]);
    const [isListModalVisible, setIsListModalVisible] =
        useState<boolean>(false);
    const [currentListIndex, setCurrentListIndex] = useState<number>(-1);

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
    };

    const deleteAllLists = async (): Promise<void> => {
        // Filter out lists we want to delete
        const listsToRemove: List[] = areCellsSelected(lists)
            ? lists.filter((list) => list.isSelected)
            : lists;
        for (let list of listsToRemove) {
            await deleteListItems(list.id);
        }

        // Lists we want to keep
        const newLists: List[] = areCellsSelected(lists)
            ? lists.filter((list) => !list.isSelected)
            : [];

        setLists(newLists);
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

    const viewListItems = (item: List, index: number) => {
        navigation.navigate("Items", {
            list: item,
        });
    };

    const setSelectedLists = (index: number, isSelected: boolean) => {
        const newLists: List[] = lists.map((l, i) =>
            l.setIsSelected(i === index ? isSelected : l.isSelected)
        );
        setLists(newLists);
    };

    const listModalCancelAction = () => {
        setIsListModalVisible(false);
        setLists(
            lists.map(
                (l) =>
                    new List(l.id, l.name, l.listType, l.defaultNewItemPosition)
            )
        );
    };

    /**
     * List View Header
     */
    const menuOptionsData: MenuOption[] = [
        {
            text: `Delete ${selectedListCellsWording(lists)} Lists`,
            onPress: openDeleteAllListsModal,
            testId: "lists-page-delete-all-items",
            disabled: lists.length === 0,
            color: "red",
        },
        { text: "Settings", onPress: () => navigation.navigate("Settings") },
    ];

    const listViewHeaderRight: JSX.Element = (
        <>
            {getSelectedItems(lists).length === 1 ? (
                <Button
                    title="Edit List"
                    onPress={() => {
                        const itemIndex: number = getItemBeingEdited(lists);
                        openUpdateListModal(itemIndex);
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
    );

    // Header text
    let headerString: string = listsCountDisplay(lists.length);

    return (
        <ListPageView
            menuOptions={menuOptionsData}
            items={lists}
            itemsType="List"
        >
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
                    negativeAction={listModalCancelAction}
                    altActionText="Next"
                    altAction={altAction}
                />

                <DeleteAllModal
                    isVisible={isDeleteAllListsModalVisible}
                    items={lists}
                    positiveAction={async () => {
                        // Delete all lists, including items in those lists
                        await deleteAllLists();
                        setIsDeleteAllListsModalVisible(false);
                    }}
                    negativeAction={() =>
                        setIsDeleteAllListsModalVisible(false)
                    }
                />

                <ListViewHeader
                    title={headerString}
                    isAllSelected={isAllSelected(lists)}
                    onChecked={(checked: boolean) =>
                        setLists(lists.map((l) => l.setIsSelected(checked)))
                    }
                    right={listViewHeaderRight}
                />

                <CustomList
                    items={lists}
                    renderItem={(params) => (
                        <ListCellWrapper
                            renderParams={params}
                            onPress={viewListItems}
                        >
                            <ListCellView updateItems={setSelectedLists} />
                        </ListCellWrapper>
                    )}
                    drag={({ data }) => {
                        setLists(data);
                    }}
                />
            </GestureHandlerRootView>
        </ListPageView>
    );
}
