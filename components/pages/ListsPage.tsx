import React, { useContext } from "react";
import { useNavigation } from "@react-navigation/core";

import ListModal from "../ListModal";
import { cellsCountDisplay } from "../../utils";
import {
    ActionMetadata,
    ListPageNavigationProps,
    MenuOption,
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
    const selectActionsMetadata: ActionMetadata[] = [
        {
            label: "All",
            method: (incides: number[]) => dispatch(new SelectAllLists(true)),
            isTerminating: false,
        },
        {
            label: "Some",
            method: (incides: number[]) => {
                // TODO: add reducer action to select all lists from a list of indices.
                for (const index of incides) {
                    dispatch(new SelectList(index, true));
                }
            },
            isTerminating: false,
        },
    ];
    const selectActions: SelectionValue<ActionMetadata>[] =
        selectActionsMetadata.map((metadata) => ({
            label: metadata.label,
            value: metadata,
        }));

    /**
     * List Actions - actions to perform on selected lists.
     */
    const listsActionsMetadata: ActionMetadata[] = [
        {
            label: "Delete",
            method: (incides: number[]) => openDeleteAllListsModal(),
            isTerminating: true,
        },
    ];
    const listsActions: SelectionValue<ActionMetadata>[] =
        listsActionsMetadata.map((metadata) => ({
            label: metadata.label,
            value: metadata,
        }));

    const actionCells: SelectionValue<number>[] = lists.map((list, index) => ({
        label: list.name,
        value: index,
    }));

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
                actionCells={actionCells}
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
