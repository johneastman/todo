import React, { useContext } from "react";
import { useNavigation } from "@react-navigation/core";

import { cellsCountDisplay, listTypePredicateFactory } from "../../utils";
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
    SelectListsWhere,
    SelectMultipleLists,
    UpdateLists,
} from "../../data/reducers/lists.reducer";
import { ListsContext } from "../../contexts/lists.context";
import ActionsModal from "../ActionsModal";
import { ListsStateContext } from "../../contexts/listsState.context";
import {
    ActionsModalVisible,
    DeleteModalVisible,
    UpdateCurrentIndex,
} from "../../data/reducers/listsState.reducer";
import { List } from "../../data/data";

export default function ListsPage({
    navigation,
    route,
}: ListPageNavigationProps): JSX.Element {
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
        navigation.navigate("AddUpdateList", {
            listIndex: cellIndex,
            currentList: lists[cellIndex],
            visibleFrom: "List",
        });

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
            method: (indices: number[]) => dispatch(new SelectAllLists(true)),
            isTerminating: false,
        },
        {
            label: "Some",
            method: (indices: number[]) =>
                dispatch(new SelectMultipleLists(indices, true)),
            isTerminating: false,
        },
        {
            label: "Generic List",
            method: (indices: number[]) =>
                dispatch(
                    new SelectListsWhere(listTypePredicateFactory("List"))
                ),
            isTerminating: false,
        },
        {
            label: "Shopping List",
            method: (indices: number[]) =>
                dispatch(
                    new SelectListsWhere(listTypePredicateFactory("Shopping"))
                ),
            isTerminating: false,
        },
        {
            label: "To-Do List",
            method: (indices: number[]) =>
                dispatch(
                    new SelectListsWhere(listTypePredicateFactory("To-Do"))
                ),
            isTerminating: false,
        },
        {
            label: "Ordered To-Do List",
            method: (indices: number[]) =>
                dispatch(
                    new SelectListsWhere(
                        listTypePredicateFactory("Ordered To-Do")
                    )
                ),
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
            method: (indices: number[]) => openDeleteAllListsModal(),
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
