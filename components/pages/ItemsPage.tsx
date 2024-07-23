import React, { useContext, useEffect } from "react";

import ItemModal from "../ItemModal";
import { Item } from "../../data/data";
import {
    areTestsRunning,
    cellsCountDisplay,
    getNumItemsIncomplete,
    getNumItemsTotal,
    partitionLists,
} from "../../utils";
import {
    CellAction,
    ItemPageNavigationProps,
    MenuOption,
    CellSelect,
    SelectionValue,
} from "../../types";
import ItemCellView from "../ItemCellView";
import CollectionPageView from "../CollectionPageView";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import DeleteAllModal from "../DeleteAllModal";
import MoveItemsModal from "../MoveItemsModal";
import { ListsContext } from "../../contexts/lists.context";
import {
    DeleteItems,
    ItemsIsComplete,
    SelectAllItems,
    SelectItem,
    SelectItemsWhere,
    UpdateItems,
} from "../../data/reducers/lists.reducer";
import ActionsModal from "../ActionsModal";
import { SettingsContext } from "../../contexts/settings.context";
import { ItemsStateContext } from "../../contexts/itemsState.context";
import {
    ActionsModalVisible,
    DeleteAllModalVisible,
    MoveCopyModalVisible,
    AddUpdateModalVisible as AddUpdateModalVisibleItem,
    UpdateCurrentIndex,
} from "../../data/reducers/itemsState.reducer";
import { AddUpdateModalVisible as AddUpdateModalVisibleList } from "../../data/reducers/listsState.reducer";
import { ListsStateContext } from "../../contexts/listsState.context";

export default function ItemsPage({
    route,
    navigation,
}: ItemPageNavigationProps): JSX.Element {
    /**
     * Data is passed into navigation views by value, meaning those values will not change
     * if the state they derive from does. To get around this, I'm passing the list id to
     * this view and retrieving the list object dynamically.
     */
    const { listIndex } = route.params;
    const listsContextData = useContext(ListsContext);
    const {
        data: { lists },
        listsDispatch: dispatch,
    } = listsContextData;

    const listsStateContext = useContext(ListsStateContext);
    const { listsStateDispatch } = listsStateContext;

    const itemsStateContext = useContext(ItemsStateContext);
    const {
        itemsState: {
            isCopyModalVisible,
            isDeleteAllModalVisible,
            isActionsModalVisible,
            currentIndex,
        },
        itemsStateDispatch,
    } = itemsStateContext;

    const settingsContext = useContext(SettingsContext);
    const {
        settings: { isDeveloperModeEnabled },
    } = settingsContext;

    const [currentList, otherLists] = partitionLists(listIndex, lists);

    const items: Item[] = currentList.items;

    useEffect(() => {
        navigation.setOptions({
            title: currentList.name,
        });
    }, [currentList]);

    const setItems = (newItems: Item[]) =>
        dispatch(new UpdateItems(listIndex, newItems));

    const setIsActionsModalVisible = (isVisible: boolean) =>
        itemsStateDispatch(new ActionsModalVisible(isVisible));

    const setIsDeleteAllItemsModalVisible = (isVisible: boolean) =>
        itemsStateDispatch(new DeleteAllModalVisible(isVisible));

    const setIsCopyItemsVisible = (isVisible: boolean) =>
        itemsStateDispatch(new MoveCopyModalVisible(isVisible));

    const setIsCompleteForAll = (isComplete: boolean): void =>
        dispatch(new ItemsIsComplete(listIndex, isComplete));

    const deleteAllItems = () => {
        // Delete items
        dispatch(new DeleteItems(listIndex));

        // Close the modal
        setIsDeleteAllItemsModalVisible(false);
    };

    const deleteItem = (index: number) => {
        dispatch(new SelectItem(listIndex, index, true));
        itemsStateDispatch(new UpdateCurrentIndex(index));
        setIsDeleteAllItemsModalVisible(true);
    };

    const openDeleteAllItemsModal = (): void =>
        setIsDeleteAllItemsModalVisible(true);

    const closeDeleteAllItemsModal = (): void => {
        // De-select the item when the modal is closed.
        dispatch(new SelectItem(listIndex, currentIndex, false));

        setIsDeleteAllItemsModalVisible(false);
    };

    const editItem = (index: number) => setIsAddUpdateModalVisible(true, index);

    const setIsAddUpdateModalVisible = (
        isVisible: boolean,
        cellIndex: number
    ): void =>
        itemsStateDispatch(new AddUpdateModalVisibleItem(isVisible, cellIndex));

    /**
     * The "Move Items" button is enabled when:
     *   1. there is more than 1 list; and
     *   2. at least 1 list contains items OR the current
     *      list contains at least 1 selected item.
     *
     * @returns true if the "Move Items" button is disabled; false otherwise.
     */
    const isMoveItemButtonEnabled = (): boolean =>
        lists.length > 1 &&
        lists.some((list, index) =>
            index === listIndex ? list.areAnyItemsSelected() : list.hasItems()
        );

    /**
     * Select Actions - what items are selected in the Actions modal.
     */
    const selectActions: SelectionValue<(indices: number[]) => void>[] = [
        {
            label: "All",
            value: (indices: number[]) =>
                dispatch(new SelectAllItems(listIndex, true)),
        },
        {
            label: "Some",
            value: (indices: number[]) => {
                for (const index of indices) {
                    dispatch(new SelectItem(listIndex, index, true));
                }
            },
        },
        {
            label: "None",
            value: (indices: number[]) =>
                dispatch(new SelectAllItems(listIndex, false)),
        },
        {
            label: "Complete",
            value: (indices: number[]) =>
                dispatch(
                    new SelectItemsWhere(
                        listIndex,
                        (item: Item) => item.isComplete
                    )
                ),
        },
        {
            label: "Incomplete",
            value: (indices: number[]) =>
                dispatch(
                    new SelectItemsWhere(
                        listIndex,
                        (item: Item) => !item.isComplete
                    )
                ),
        },
        {
            label: "Locked",
            value: (indices: number[]) =>
                dispatch(
                    new SelectItemsWhere(
                        listIndex,
                        (item: Item) => item.isLocked
                    )
                ),
        },
        {
            label: "Unlocked",
            value: (indices: number[]) =>
                dispatch(
                    new SelectItemsWhere(
                        listIndex,
                        (item: Item) => !item.isLocked
                    )
                ),
        },
    ];

    const itemsActions: SelectionValue<(indices: number[]) => void>[] = [
        {
            label: "Delete",
            value: (indices: number[]) => openDeleteAllItemsModal,
        },
        {
            label: "Complete",
            value: (indices: number[]) => setIsCompleteForAll(true),
        },
        {
            label: "Incomplete",
            value: (indices: number[]) => setIsCompleteForAll(false),
        },
    ];

    const actionCells: SelectionValue<number>[] = items.map((list, index) => ({
        label: list.name,
        value: index,
    }));

    /**
     * List View Header
     */
    const menuOptionsData: MenuOption[] = [
        {
            text: "Move Items",
            onPress: () => setIsCopyItemsVisible(true),
            testId: "items-page-copy-items-from",
            disabled: !isMoveItemButtonEnabled(),
        },
        {
            text: "Edit List",
            onPress: () =>
                listsStateDispatch(
                    new AddUpdateModalVisibleList(true, "Item", listIndex)
                ),
        },
    ];

    // Add an option for a back button if the tests are running
    if (areTestsRunning()) {
        menuOptionsData.push({
            text: "Back",
            testId: "items-page-back-button",
            onPress: () => navigation.goBack(),
        });
    }

    const navigationMenuOptions: Partial<NativeStackNavigationOptions> = {
        title: currentList.name,
    };

    // Header text
    const selectecCount: number = getNumItemsIncomplete(
        currentList.listType,
        items
    );

    const totalItems: number = getNumItemsTotal(currentList.listType, items);

    let headerString: string = `${selectecCount} / ${cellsCountDisplay(
        "Item",
        totalItems
    )}`;

    /* If developer mode is enabled, also display the number of items in the "items" list (length of
     * list, not sum of quantities).
     */
    if (isDeveloperModeEnabled) {
        headerString += ` (${items.length} Cells)`;
    }

    return (
        <>
            <CollectionPageView
                cells={items}
                renderItem={(params) => (
                    <ItemCellView
                        renderParams={params}
                        listIndex={listIndex}
                        list={currentList}
                        onEdit={editItem}
                        onDelete={deleteItem}
                    />
                )}
                onDragEnd={(items: Item[]) => setItems(items)}
                menuOptions={menuOptionsData}
                navigationOptions={navigationMenuOptions}
                cellType="Item"
                setActionsModalVisible={setIsActionsModalVisible}
                setIsAddUpdateModalVisible={setIsAddUpdateModalVisible}
                headerString={headerString}
                navigation={navigation}
            />

            <ItemModal listIndex={listIndex} list={currentList} />

            <ActionsModal
                cellsType="Item"
                isVisible={isActionsModalVisible}
                cellSelectActions={selectActions}
                cellsActions={itemsActions}
                setVisible={setIsActionsModalVisible}
                actionCells={actionCells}
            />

            <DeleteAllModal
                isVisible={isDeleteAllModalVisible}
                collectionType="Item"
                numDeleted={items.filter((item) => item.isSelected).length}
                positiveAction={deleteAllItems}
                negativeAction={closeDeleteAllItemsModal}
            />

            <MoveItemsModal
                listIndex={listIndex}
                isVisible={isCopyModalVisible}
                setIsVisible={setIsCopyItemsVisible}
            />
        </>
    );
}
