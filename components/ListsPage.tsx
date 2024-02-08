import React, { useContext } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/core";

import { List } from "../data/data";
import ListModal from "./ListModal";
import CollectionViewHeader from "./CollectionViewHeader";
import {
    RED,
    getCellBeingEdited,
    cellsCountDisplay,
    areCellsSelected,
} from "../utils";
import CustomList from "./CustomList";
import { ListCRUD, ListPageNavigationProp, MenuOption } from "../types";
import ListCellView from "./ListCellView";
import CollectionPageView from "./CollectionPageView";
import DeleteAllModal from "./DeleteAllModal";
import {
    DeleteLists,
    SelectAllLists,
    SelectList,
    UpdateDeleteModalVisible,
    UpdateLists,
} from "../data/reducers/app.reducer";
import { AppContext } from "../contexts/app.context";

export default function ListsPage(): JSX.Element {
    const navigation = useNavigation<ListPageNavigationProp>();

    const appContext = useContext(AppContext);
    const {
        data: {
            lists,
            listsState: { isDeleteAllModalVisible },
        },
        dispatch,
    } = appContext;

    const setIsDeleteAllListsModalVisible = (isVisible: boolean) =>
        dispatch(new UpdateDeleteModalVisible("List", isVisible));

    const deleteAllLists = async (): Promise<void> =>
        dispatch(new DeleteLists());

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
            disabled: !areCellsSelected(lists),
            color: RED,
        },
    ];

    const headerString: string = cellsCountDisplay("List", lists.length);

    return (
        <CollectionPageView
            menuOptions={menuOptionsData}
            items={lists}
            itemsType="List"
        >
            <GestureHandlerRootView style={{ flex: 1 }}>
                <ListModal />

                <DeleteAllModal
                    isVisible={isDeleteAllModalVisible}
                    collectionType="List"
                    numDeleted={lists.filter((list) => list.isSelected).length}
                    positiveAction={deleteAllLists}
                    negativeAction={() =>
                        setIsDeleteAllListsModalVisible(false)
                    }
                />

                <CollectionViewHeader
                    title={headerString}
                    cells={lists}
                    collectionType="List"
                    onSelectAll={selectAll}
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
