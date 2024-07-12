import React, { useContext } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/core";

import ListModal from "./ListModal";
import CollectionViewHeader from "./CollectionViewHeader";
import { RED, cellsCountDisplay, areCellsSelected } from "../utils";
import CustomList from "./core/CustomList";
import { ListPageNavigationProp, MenuOption } from "../types";
import ListCellView from "./ListCellView";
import CollectionPageView from "./CollectionPageView";
import DeleteAllModal from "./DeleteAllModal";
import {
    DeleteLists,
    SelectAllLists,
    SelectList,
    UpdateLists,
} from "../data/reducers/lists.reducer";
import { ListsContext } from "../contexts/lists.context";
import ActionsModal from "./ActionsModal";
import { ListsStateContext } from "../contexts/listsState.context";
import {
    ActionsModalVisible,
    DeleteModalVisible,
    UpdateCurrentIndex,
    AddUpdateModalVisible,
} from "../data/reducers/listsState.reducer";

export default function ListsPage(): JSX.Element {
    const navigation = useNavigation<ListPageNavigationProp>();

    const listsContextData = useContext(ListsContext);
    const {
        data: { lists },
        listsDispatch: dispatch,
    } = listsContextData;

    const listsStateContext = useContext(ListsStateContext);
    const {
        listsState: { isDeleteAllModalVisible, isActionsModalVisible },
        listsStateDispatch,
    } = listsStateContext;

    const setIsDeleteAllListsModalVisible = (isVisible: boolean) =>
        listsStateDispatch(new DeleteModalVisible(isVisible));

    const setIsActionsModalVisible = (isVisible: boolean) =>
        listsStateDispatch(new ActionsModalVisible(isVisible));

    const setAddUpdateModalVisible = (
        isVisible: boolean,
        cellIndex: number
    ): void => {
        listsStateDispatch(new AddUpdateModalVisible(isVisible, "List"));
        listsStateDispatch(new UpdateCurrentIndex(cellIndex));
    };

    const deleteAllLists = async (): Promise<void> => {
        dispatch(new DeleteLists());
        listsStateDispatch(new DeleteModalVisible(false));
    };
    const selectAllLists = (isSelected: boolean) =>
        dispatch(new SelectAllLists(isSelected));

    const selectedList = (index: number, isSelected: boolean) => {
        dispatch(new SelectList(index, isSelected));

        listsStateDispatch(new UpdateCurrentIndex(index));
    };

    const openDeleteAllListsModal = (): void =>
        setIsDeleteAllListsModalVisible(true);

    const selectAll = () => selectAllLists(true);

    const deselectAll = () => selectAllLists(false);

    const viewListItems = (index: number) => {
        navigation.navigate("Items", {
            listIndex: index,
        });
    };

    /**
     * Select Actions - what lists are selected in the Actions modal.
     */
    const selectActions: Map<string, () => void> = new Map([
        ["All", () => dispatch(new SelectAllLists(true))],
        ["None", () => dispatch(new SelectAllLists(false))],
    ]);

    /**
     * List View Header
     */
    const menuOptionsData: MenuOption[] = [
        {
            text: "Select All",
            onPress: selectAll,
            testId: "lists-page-select-all",
        },
        {
            text: "Deselect All",
            onPress: deselectAll,
            testId: "lists-page-deselect-all",
        },
        {
            text: "Delete Lists",
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
            cellType="List"
            setActionsModalVisible={setIsActionsModalVisible}
        >
            <GestureHandlerRootView style={{ flex: 1 }}>
                <ListModal />

                <ActionsModal
                    cellsType="List"
                    isVisible={isActionsModalVisible}
                    cellSelectActions={selectActions}
                    setVisible={setIsActionsModalVisible}
                />

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
                    setAddUpdateModalVisible={setAddUpdateModalVisible}
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
