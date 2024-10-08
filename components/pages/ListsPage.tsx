import React, { useContext, useEffect } from "react";

import {
    cellsCountDisplay,
    Color,
    listFilterIndices,
    listTypePredicateFactory,
} from "../../utils";
import { CellAction, CellSelect, ListPageNavigationProps } from "../../types";
import ListCellView from "./../ListCellView";
import DeleteAllModal from "../DeleteAllModal";
import {
    DeleteLists,
    ListsAction,
    SelectList,
    SelectMultipleLists,
    UpdateLists,
} from "../../data/reducers/lists.reducer";
import { ListsContext } from "../../contexts/lists.context";
import { ListsStateContext } from "../../contexts/listsState.context";
import {
    DeleteModalVisible,
    UpdateCurrentIndex,
    UpdateDrawerVisibility,
    UpdateSelectMode,
} from "../../data/reducers/listsState.reducer";
import CollectionPageDrawer from "../CollectionPageDrawer";
import CollectionViewHeader from "../CollectionViewHeader";
import CustomList from "../core/CustomList";
import CollectionPageNavigationHeader from "../CollectionPageNavigationHeader";
import {
    DrawerMenu,
    DrawerMenuButton,
    DrawerMenuPicker,
} from "../../data/drawerMenu";

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
            currentIndex,
            isDeleteAllModalVisible,
            isDrawerVisible,
            selectMode,
        },
        listsStateDispatch,
    } = listsStateContext;

    const setIsOptionsDrawerVisible = (newIsDrawerVisible: boolean) =>
        listsStateDispatch(new UpdateDrawerVisibility(newIsDrawerVisible));

    const setIsDeleteAllListsModalVisible = (isVisible: boolean) =>
        listsStateDispatch(new DeleteModalVisible(isVisible));

    const updateSelectMode = (isVisible: boolean) =>
        listsStateDispatch(new UpdateSelectMode(isVisible));

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <CollectionPageNavigationHeader
                    cellType="List"
                    selectMode={selectMode}
                    updateSelectMode={updateSelectMode}
                    updateDrawerVisibility={setIsOptionsDrawerVisible}
                />
            ),
        });
    }, [navigation, lists, selectMode]);

    /**
     * Select Actions - what lists are selected in the Actions modal.
     */
    const selectActions: [CellSelect, number[]][] = [
        ["All", lists.map((_, index) => index)],
        ["None", []],
        [
            "Generic List",
            listFilterIndices(lists, listTypePredicateFactory("List")),
        ],
        [
            "Shopping List",
            listFilterIndices(lists, listTypePredicateFactory("Shopping")),
        ],
        [
            "To-Do List",
            listFilterIndices(lists, listTypePredicateFactory("To-Do")),
        ],
        [
            "Ordered To-Do List",
            listFilterIndices(lists, listTypePredicateFactory("Ordered To-Do")),
        ],
    ];

    /**
     * List Actions - actions to perform on selected lists.
     */
    const cellActions: [CellAction, ListsAction][] = [
        ["Delete", new DeleteLists()],
    ];

    const navigateToActionsPage = () =>
        navigation.navigate("Actions", {
            cellType: "List",
            cells: lists.map((list, index) => ({
                label: list.name,
                value: index,
            })),
            selectActions: selectActions,
            cellActions: cellActions,
        });

    const navigateToAddUpdateListPage = (cellIndex: number): void =>
        navigation.navigate("AddUpdateList", {
            listIndex: cellIndex,
            currentList: lists[cellIndex],
            visibleFrom: "List",
        });

    const selectList = (listIndex: number, isSelected: boolean): void =>
        dispatch(new SelectList(listIndex, isSelected));

    const openDeleteListModal = (listIndex: number): void => {
        selectList(listIndex, true);
        listsStateDispatch(new UpdateCurrentIndex(listIndex));
        setIsDeleteAllListsModalVisible(true);
    };

    const closeDeleteListModal = (): void => {
        // De-select the list when the delete modal is closed.
        selectList(currentIndex, false);
        setIsDeleteAllListsModalVisible(false);
    };

    const deleteAllLists = async (): Promise<void> => {
        dispatch(new DeleteLists());
        listsStateDispatch(new DeleteModalVisible(false));
    };

    const editList = (index: number) => navigateToAddUpdateListPage(index);

    const viewListItems = (index: number) => {
        navigation.navigate("Items", {
            listIndex: index,
        });
    };

    const topMenuOptions: DrawerMenu[] = [
        new DrawerMenuButton({
            // Despite being a common menu option, this button should be the first option
            // in the top menu for ease of access.
            text: "Actions",
            onPress: () => navigateToActionsPage(),
            disabled: true,
        }),
        new DrawerMenuButton({
            text: "Delete Lists",
            onPress: () => openDeleteListModal(currentIndex),
            color: Color.Red,
            disabled: lists.filter((list) => list.isSelected).length === 0,
        }),
        ...(selectMode
            ? [
                  new DrawerMenuPicker(
                      "Select Lists",
                      selectActions,
                      (indices: number[]) =>
                          dispatch(new SelectMultipleLists(indices))
                  ),
              ]
            : []),
    ];

    const headerString: string = cellsCountDisplay("List", lists.length);

    return (
        <>
            <CollectionPageDrawer
                isVisible={isDrawerVisible}
                setIsVisible={setIsOptionsDrawerVisible}
                topMenuOptions={topMenuOptions}
                navigation={navigation}
            />

            <CollectionViewHeader
                title={headerString}
                collectionType="List"
                setAddUpdateModalVisible={navigateToAddUpdateListPage}
            />

            <CustomList
                items={lists}
                renderItem={(params) => (
                    <ListCellView
                        renderParams={params}
                        onPress={viewListItems}
                        onEdit={editList}
                        onDelete={openDeleteListModal}
                        onSelect={selectList}
                    />
                )}
                drag={({ data }) => dispatch(new UpdateLists(data))}
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
