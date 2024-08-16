import React, { useContext } from "react";

import { cellsCountDisplay } from "../../utils";
import {
    CellAction,
    CellSelect,
    ListPageNavigationProps,
    MenuOption,
    SelectionValue,
} from "../../types";
import ListCellView from "./../ListCellView";
import CollectionPageView from "../CollectionPageView";
import DeleteAllModal from "../DeleteAllModal";
import {
    DeleteLists,
    SelectList,
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

    /**
     * Select Actions - what lists are selected in the Actions modal.
     */
    const selectActions: [CellSelect, number[]][] = [
        ["All", lists.map((_, index) => index)],
        ["Custom", []],
        ["None", []],
        [
            "Generic List",
            lists
                .map((list, index) => [list, index] as [List, number])
                .filter(([list, _]) => list.listType === "List")
                .map(([_, index]) => index),
        ],
        [
            "Shopping List",
            lists
                .map((list, index) => [list, index] as [List, number])
                .filter(([list, _]) => list.listType === "Shopping")
                .map(([_, index]) => index),
        ],
        [
            "To-Do List",
            lists
                .map((list, index) => [list, index] as [List, number])
                .filter(([list, _]) => list.listType === "To-Do")
                .map(([_, index]) => index),
        ],
        [
            "Ordered To-Do List",
            lists
                .map((list, index) => [list, index] as [List, number])
                .filter(([list, _]) => list.listType === "Ordered To-Do")
                .map(([_, index]) => index),
        ],
    ];

    /**
     * List Actions - actions to perform on selected lists.
     */
    const cellActions: SelectionValue<CellAction>[] = [
        {
            label: "Delete",
            value: "Delete",
        },
    ];

    const setIsActionsModalVisible = (isVisible: boolean) =>
        navigation.navigate("Actions", {
            cellType: "List",
            cells: lists.map((list, index) => ({
                label: list.name,
                value: index,
            })),
            selectActions: selectActions,
            cellActions: cellActions,
        });

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
