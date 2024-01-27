import React, { useContext } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Button } from "react-native";
import { useNavigation } from "@react-navigation/core";

import { List } from "../data/data";
import ListModal from "./ListModal";
import CollectionViewHeader from "./CollectionViewHeader";
import {
    RED,
    getCellBeingEdited,
    getSelectedItems,
    isAllSelected,
    cellsCountDisplay,
    selectedListCellsWording,
    areCellsSelected,
} from "../utils";
import CustomList from "./CustomList";
import { ListCRUD, ListPageNavigationProp, MenuOption } from "../types";
import ListCellView from "./ListCellView";
import CollectionPageView from "./CollectionPageView";
import DeleteAllModal from "./DeleteAllModal";
import {
    AddList,
    DeleteLists,
    SelectAllLists,
    SelectList,
    UpdateDeleteModalVisible,
    UpdateList,
    UpdateLists,
    UpdateModalVisible,
} from "../data/reducers/app.reducer";
import { AppContext } from "../contexts/app.context";

export default function ListsPage(): JSX.Element {
    const navigation = useNavigation<ListPageNavigationProp>();

    const appContext = useContext(AppContext);
    const {
        data: {
            lists,
            listsState: {
                isModalVisible,
                currentIndex,
                isDeleteAllModalVisible,
            },
        },
        dispatch,
    } = appContext;

    const setIsListModalVisible = (isVisible: boolean, index?: number) =>
        dispatch(new UpdateModalVisible("List", isVisible, index));

    const setIsDeleteAllListsModalVisible = (isVisible: boolean) =>
        dispatch(new UpdateDeleteModalVisible("List", isVisible));

    const addList = (addListParams: ListCRUD, isAltAction: boolean): void =>
        dispatch(new AddList(addListParams, isAltAction));

    const updateList = (
        updateListParams: ListCRUD,
        isAltAction: boolean
    ): void => dispatch(new UpdateList(updateListParams, isAltAction));

    const deleteAllLists = async (): Promise<void> =>
        dispatch(new DeleteLists());

    const openUpdateListModal = (): void => {
        const itemIndex: number = getCellBeingEdited(lists);
        setIsListModalVisible(true, itemIndex);
    };

    const openDeleteAllListsModal = (): void =>
        setIsDeleteAllListsModalVisible(true);

    const viewListItems = (list: List, index: number) => {
        const { id } = list;
        navigation.navigate("Items", {
            listId: id,
        });
    };

    const selectAll = (isSelected: boolean) =>
        dispatch(new SelectAllLists(isSelected));

    const selectedList = (index: number, isSelected: boolean) =>
        dispatch(new SelectList(index, isSelected));

    /**
     * List View Header
     */
    const menuOptionsData: MenuOption[] = [
        {
            text: `Delete Lists`,
            onPress: openDeleteAllListsModal,
            testId: "lists-page-delete-all-items",
            disabled: lists.length === 0 || !areCellsSelected(lists),
            color: RED,
        },
    ];

    const collectionViewHeaderRight: JSX.Element = (
        <>
            {getSelectedItems(lists).length === 1 ? (
                <Button title="Edit List" onPress={openUpdateListModal} />
            ) : null}

            <Button
                title="Add List"
                onPress={() => setIsListModalVisible(true)}
            />
        </>
    );

    const headerString: string = cellsCountDisplay("List", lists.length);

    return (
        <CollectionPageView
            menuOptions={menuOptionsData}
            items={lists}
            itemsType="List"
        >
            <GestureHandlerRootView style={{ flex: 1 }}>
                <ListModal
                    isVisible={isModalVisible}
                    list={lists[currentIndex]}
                    currentListIndex={currentIndex}
                    positiveAction={currentIndex === -1 ? addList : updateList}
                    negativeAction={() => setIsListModalVisible(false)}
                />

                <DeleteAllModal
                    isVisible={isDeleteAllModalVisible}
                    items={lists}
                    positiveAction={deleteAllLists}
                    negativeAction={() =>
                        setIsDeleteAllListsModalVisible(false)
                    }
                />

                <CollectionViewHeader
                    title={headerString}
                    isAllSelected={isAllSelected(lists)}
                    onSelectAll={selectAll}
                    right={collectionViewHeaderRight}
                />

                <CustomList
                    items={lists}
                    renderItem={(params) => (
                        <ListCellView
                            updateItems={selectedList}
                            renderParams={params}
                            onPress={viewListItems}
                        />
                    )}
                    drag={({ data }) => dispatch(new UpdateLists(data))}
                />
            </GestureHandlerRootView>
        </CollectionPageView>
    );
}
