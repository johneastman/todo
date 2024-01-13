import React, { useEffect, useReducer, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Button } from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/core";

import { List, MenuOption } from "../data/data";
import { getLists, saveLists } from "../data/utils";
import ListModal from "./ListModal";
import ListViewHeader from "./ListViewHeader";
import {
    RED,
    getItemBeingEdited,
    getSelectedItems,
    isAllSelected,
    listsCountDisplay,
    selectedListCellsWording,
} from "../utils";
import CustomList from "./CustomList";
import { ListCRUD, ListPageNavigationProp } from "../types";
import ListCellView from "./ListCellView";
import ListPageView from "./ListPageView";
import DeleteAllModal from "./DeleteAllModal";
import {
    AddLists,
    DeleteLists,
    SelectAll,
    SelectList,
    UpdateList,
    ReplaceLists,
    listsPageReducer,
    IsDeleteAllListsModalVisible,
} from "../data/reducers/listsPageReducer";

export default function ListsPage(): JSX.Element {
    const [state, listsDispatch] = useReducer(listsPageReducer, {
        lists: [],
        isDeleteAllListsModalVisible: false,
    });
    const { lists, isDeleteAllListsModalVisible } = state;

    const [isListModalVisible, setIsListModalVisible] =
        useState<boolean>(false);
    const [currentListIndex, setCurrentListIndex] = useState<number>(-1);

    const isFocused = useIsFocused();
    let navigation = useNavigation<ListPageNavigationProp>();

    const fetchData = async () => {
        const lists: List[] = await getLists();
        listsDispatch(new ReplaceLists(lists));
    };

    useEffect(() => {
        fetchData();
    }, [isFocused]);

    useEffect(() => {
        const saveData = async () => {
            await saveLists(lists);
        };
        saveData();
    }, [lists]);

    const addList = (addListParams: ListCRUD): void => {
        const { newPos, list } = addListParams;

        if (list.name.trim().length <= 0) {
            setIsListModalVisible(false);
            return;
        }

        listsDispatch(new AddLists(list, newPos));
        setIsListModalVisible(false);
    };

    const updateList = (updateListParams: ListCRUD): void => {
        const { oldPos, newPos, list } = updateListParams;

        if (list.name.trim().length <= 0) {
            setIsListModalVisible(false);
            return;
        }

        listsDispatch(new UpdateList(list, oldPos, newPos));
        setIsListModalVisible(false);
    };
    const openUpdateListModal = (index: number): void => {
        setIsListModalVisible(true);
        setCurrentListIndex(index);
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

    const listModalCancelAction = () => {
        setIsListModalVisible(false);
        listsDispatch(new SelectAll(false));
    };

    /**
     * List View Header
     */
    const menuOptionsData: MenuOption[] = [
        {
            text: `Delete ${selectedListCellsWording(lists)} Lists`,
            onPress: () =>
                listsDispatch(new IsDeleteAllListsModalVisible(true)),
            testId: "lists-page-delete-all-items",
            disabled: lists.length === 0,
            color: RED,
        },
    ];

    const listViewHeaderRight: JSX.Element = (
        <>
            {getSelectedItems(lists).length === 1 && (
                <Button
                    title="Edit List"
                    onPress={() => {
                        const itemIndex: number = getItemBeingEdited(lists);
                        openUpdateListModal(itemIndex);
                    }}
                />
            )}

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
                    list={lists[currentListIndex]}
                    currentListIndex={currentListIndex}
                    positiveAction={
                        currentListIndex === -1 ? addList : updateList
                    }
                    negativeAction={listModalCancelAction}
                    altAction={altAction}
                />

                <DeleteAllModal
                    isVisible={isDeleteAllListsModalVisible}
                    items={lists}
                    positiveAction={() => listsDispatch(new DeleteLists())}
                    negativeAction={() =>
                        listsDispatch(new IsDeleteAllListsModalVisible(false))
                    }
                />

                <ListViewHeader
                    title={headerString}
                    isAllSelected={isAllSelected(lists)}
                    onChecked={(checked: boolean) =>
                        listsDispatch(new SelectAll(checked))
                    }
                    right={listViewHeaderRight}
                />

                <CustomList
                    items={lists}
                    renderItem={(params) => (
                        <ListCellView
                            updateItems={(index: number, isSelected: boolean) =>
                                listsDispatch(new SelectList(index, isSelected))
                            }
                            renderParams={params}
                            onPress={viewListItems}
                        />
                    )}
                    drag={({ data }) => listsDispatch(new ReplaceLists(data))}
                />
            </GestureHandlerRootView>
        </ListPageView>
    );
}
