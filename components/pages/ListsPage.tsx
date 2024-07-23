import React, { useContext } from "react";
import { useNavigation } from "@react-navigation/core";

import ListModal from "../ListModal";
import { cellsCountDisplay } from "../../utils";
import {
    CellAction,
    ListPageNavigationProps,
    MenuOption,
    CellSelect,
    SelectionValue,
} from "../../types";
import ListCellView from "./../ListCellView";
import CollectionPageView from "../CollectionPageView";
import DeleteAllModal from "../DeleteAllModal";
import {
    DeleteLists,
    SelectAllLists,
    SelectList,
    UpdateLists,
} from "../../data/reducers/lists.reducer";
import { ListsContext } from "../../contexts/lists.context";
import ActionsModal from "../ActionsModal";
import { ListsStateContext } from "../../contexts/listsState.context";
import {
    ActionsModalVisible,
    DeleteModalVisible,
    AddUpdateModalVisible,
    UpdateCurrentIndex,
} from "../../data/reducers/listsState.reducer";
import { List } from "../../data/data";

export default function ListsPage(): JSX.Element {
    const navigation = useNavigation<ListPageNavigationProps>();

    const listsContextData = useContext(ListsContext);
    const {
        data: { lists },
        listsDispatch: dispatch,
    } = listsContextData;

    const listsStateContext = useContext(ListsStateContext);
    const {
        listsState: {
            isDeleteAllModalVisible,
            isActionsModalVisible,
            currentIndex,
        },
        listsStateDispatch,
    } = listsStateContext;

    const setIsDeleteAllListsModalVisible = (isVisible: boolean) =>
        listsStateDispatch(new DeleteModalVisible(isVisible));

    const setIsActionsModalVisible = (isVisible: boolean) =>
        listsStateDispatch(new ActionsModalVisible(isVisible));

    const setAddUpdateModalVisible = (
        isVisible: boolean,
        cellIndex: number
    ): void =>
        listsStateDispatch(
            new AddUpdateModalVisible(isVisible, "List", cellIndex)
        );

    const openDeleteListModal = (index: number): void => {
        dispatch(new SelectList(index, true));
        listsStateDispatch(new UpdateCurrentIndex(index));
        setIsDeleteAllListsModalVisible(true);
    };

    const closeDeleteListModal = (): void => {
        // De-select the list when the delete modal is closed.
        dispatch(new SelectList(currentIndex, false));
        setIsDeleteAllListsModalVisible(false);
    };

    const openDeleteAllListsModal = (): void =>
        setIsDeleteAllListsModalVisible(true);

    const deleteAllLists = async (): Promise<void> => {
        dispatch(new DeleteLists());
        listsStateDispatch(new DeleteModalVisible(false));
    };

    const editList = (index: number) => setAddUpdateModalVisible(true, index);

    const viewListItems = (index: number) => {
        navigation.navigate("Items", {
            listIndex: index,
        });
    };

    /**
     * Select Actions - what lists are selected in the Actions modal.
     */
    const selectActions: SelectionValue<() => void>[] = [
        { label: "All", value: () => dispatch(new SelectAllLists(true)) },
        { label: "None", value: () => dispatch(new SelectAllLists(false)) },
    ];

    const listsActions: SelectionValue<() => void>[] = [
        { label: "Delete", value: openDeleteAllListsModal },
    ];

    /**
     * List View Header
     */
    const menuOptionsData: MenuOption[] = [];

    const headerString: string = cellsCountDisplay("List", lists.length);

    return (
        <>
            <CollectionPageView
                menuOptions={menuOptionsData}
                cells={lists}
                renderItem={(params) => (
                    <ListCellView
                        renderParams={params}
                        onPress={viewListItems}
                        onEdit={editList}
                        onDelete={openDeleteListModal}
                    />
                )}
                onDragEnd={(data: List[]) => dispatch(new UpdateLists(data))}
                cellType="List"
                setActionsModalVisible={setIsActionsModalVisible}
                setIsAddUpdateModalVisible={setAddUpdateModalVisible}
                headerString={headerString}
                navigation={navigation}
            />

            <ListModal />

            <ActionsModal
                cellsType="List"
                isVisible={isActionsModalVisible}
                cellSelectActions={selectActions}
                cellsActions={listsActions}
                setVisible={setIsActionsModalVisible}
            />

            <DeleteAllModal
                isVisible={isDeleteAllModalVisible}
                collectionType="List"
                numDeleted={lists.filter((list) => list.isSelected).length}
                positiveAction={deleteAllLists}
                negativeAction={closeDeleteListModal}
            />
        </>
    );
}
