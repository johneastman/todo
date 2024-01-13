import React, { useEffect, useReducer } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Button } from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/core";

import { List, MenuOption } from "../data/data";
import { getLists, saveLists } from "../data/utils";
import ListModal from "./ListModal";
import ListViewHeader from "./ListViewHeader";
import {
    RED,
    getIndexOfItemBeingEdited,
    getSelectedItems,
    isAllSelected,
    listsCountDisplay,
    selectedListCellsWording,
} from "../utils";
import CustomList from "./CustomList";
import { ListCRUD, ListPageNavigationProp } from "../types";
import ListCellView from "./ListCellView";
import CollectionPageView from "./CollectionPageView";
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
    OpenListModal,
    CloseListModal,
    AltAction,
} from "../data/reducers/listsPageReducer";

export default function ListsPage(): JSX.Element {
    const [state, listsDispatch] = useReducer(listsPageReducer, {
        lists: [],
        isDeleteAllListsModalVisible: false,
        isListModalVisible: false,
        currentListIndex: -1,
    });

    const {
        lists,
        isDeleteAllListsModalVisible,
        isListModalVisible,
        currentListIndex,
    } = state;

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
        listsDispatch(new AddLists(list, newPos));
    };

    const updateList = (updateListParams: ListCRUD): void => {
        const { oldPos, newPos, list } = updateListParams;
        listsDispatch(new UpdateList(list, oldPos, newPos));
    };

    const openListModal = (): void => {
        // If no items are selected, the index will be -1, which means a new
        // list is being added.
        const itemIndex: number = getIndexOfItemBeingEdited(lists);
        listsDispatch(new OpenListModal(itemIndex));
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
        listsDispatch(new AltAction());
    };

    const viewListItems = (item: List, index: number) => {
        navigation.navigate("Items", {
            list: item,
        });
    };

    const listModalCancelAction = () => {
        listsDispatch(new CloseListModal());
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
                <Button title="Edit List" onPress={openListModal} />
            )}

            <Button title="Add List" onPress={openListModal} />
        </>
    );

    // Header text
    let headerString: string = listsCountDisplay(lists.length);

    return (
        <CollectionPageView
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
        </CollectionPageView>
    );
}
