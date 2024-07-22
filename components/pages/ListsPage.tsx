import React, { useContext } from "react";
import { useNavigation } from "@react-navigation/core";

import ListModal from "../ListModal";
import { cellsCountDisplay, areCellsSelected, Color } from "../../utils";
import {
    CellAction,
    ListPageNavigationProps,
    MenuOption,
    CellSelect,
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
    ): void =>
        listsStateDispatch(
            new AddUpdateModalVisible(isVisible, "List", cellIndex)
        );

    const deleteList = (index: number): void => {
        dispatch(new SelectList(index, true));
        setIsDeleteAllListsModalVisible(true);
    };

    const deleteAllLists = async (): Promise<void> => {
        dispatch(new DeleteLists());
        listsStateDispatch(new DeleteModalVisible(false));
    };

    const editList = (index: number) => setAddUpdateModalVisible(true, index);

    const openDeleteAllListsModal = (): void =>
        setIsDeleteAllListsModalVisible(true);

    const viewListItems = (index: number) => {
        navigation.navigate("Items", {
            listIndex: index,
        });
    };

    /**
     * Select Actions - what lists are selected in the Actions modal.
     */
    const selectActions: Map<CellSelect, () => void> = new Map([
        ["All", () => dispatch(new SelectAllLists(true))],
        ["None", () => dispatch(new SelectAllLists(false))],
    ]);

    const listsActions: Map<CellAction, () => void> = new Map([
        ["Delete", openDeleteAllListsModal],
    ]);

    /**
     * List View Header
     */
    const menuOptionsData: MenuOption[] = [
        {
            text: "Delete Lists",
            onPress: openDeleteAllListsModal,
            testId: "lists-page-delete-all-items",
            disabled: !areCellsSelected(lists),
            color: Color.Red,
        },
    ];

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
                        onDelete={deleteList}
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
                negativeAction={() => setIsDeleteAllListsModalVisible(false)}
            />
        </>
    );
}
