import React, { useContext, useEffect } from "react";

import { Item } from "../../data/data";
import {
    areTestsRunning,
    cellsCountDisplay,
    getNumItemsIncomplete,
    getNumItemsTotal,
    navigationTitleOptions,
    partitionLists,
} from "../../utils";
import {
    ItemPageNavigationProps,
    MenuOption,
    SelectionValue,
    ActionMetadata,
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
    SelectMultipleItems,
    UpdateItems,
} from "../../data/reducers/lists.reducer";
import ActionsModal from "../ActionsModal";
import { SettingsContext } from "../../contexts/settings.context";
import { ItemsStateContext } from "../../contexts/itemsState.context";
import {
    ActionsModalVisible,
    DeleteAllModalVisible,
    MoveCopyModalVisible,
    UpdateCurrentIndex,
} from "../../data/reducers/itemsState.reducer";
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
        navigation.setOptions(navigationTitleOptions(currentList.name));
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

    const editItem = (index: number) => showAddUpdateModalView(true, index);

    const showAddUpdateModalView = (
        isVisible: boolean,
        cellIndex: number
    ): void =>
        navigation.navigate("AddUpdateItem", {
            listIndex,
            itemIndex: cellIndex,
            currentItem: items[cellIndex],
        });

    /**
     * Select Actions - what items are selected in the Actions modal.
     */
    const selectActionsMetadata: ActionMetadata[] = [
        {
            label: "All",
            method: (indices: number[]) =>
                dispatch(new SelectAllItems(listIndex, true)),
            isTerminating: false,
        },
        {
            label: "Some",
            method: (indices: number[]) =>
                dispatch(new SelectMultipleItems(listIndex, indices, true)),
            isTerminating: false,
        },
        {
            label: "Complete",
            method: (indices: number[]) =>
                dispatch(
                    new SelectItemsWhere(
                        listIndex,
                        (item: Item) => item.isComplete
                    )
                ),
            isTerminating: false,
        },
        {
            label: "Incomplete",
            method: (indices: number[]) =>
                dispatch(
                    new SelectItemsWhere(
                        listIndex,
                        (item: Item) => !item.isComplete
                    )
                ),
            isTerminating: false,
        },
        {
            label: "Locked",
            method: (indices: number[]) =>
                dispatch(
                    new SelectItemsWhere(
                        listIndex,
                        (item: Item) => item.isLocked
                    )
                ),
            isTerminating: false,
        },
        {
            label: "Unlocked",
            method: (indices: number[]) =>
                dispatch(
                    new SelectItemsWhere(
                        listIndex,
                        (item: Item) => !item.isLocked
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
     * Items Actions - actions performed on selected items.
     */
    const itemsActionsMetadata: ActionMetadata[] = [
        {
            label: "Delete",
            method: (indices: number[]) => openDeleteAllItemsModal(),
            isTerminating: true,
        },
        {
            label: "Complete",
            method: (indices: number[]) => setIsCompleteForAll(true),
            isTerminating: false,
        },
        {
            label: "Incomplete",
            method: (indices: number[]) => setIsCompleteForAll(false),
            isTerminating: false,
        },
    ];
    const itemsActions: SelectionValue<ActionMetadata>[] =
        itemsActionsMetadata.map((menuOptionsData) => ({
            label: menuOptionsData.label,
            value: menuOptionsData,
        }));

    const actionCells: SelectionValue<number>[] = items.map((list, index) => ({
        label: list.name,
        value: index,
    }));

    /** * * * * * * * * *
     * List View Header *
     * * * * * * * * * **/

    /**
     * The "Move Items" button is enabled when the current list contains items
     *
     * @returns true if the "Move Items" button is disabled; false otherwise.
     */
    const isMoveItemButtonEnabled = (): boolean => currentList.items.length > 0;

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
                navigation.navigate("AddUpdateList", {
                    listIndex: listIndex,
                    currentList: currentList,
                    visibleFrom: "Item",
                }),
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
                setIsAddUpdateModalVisible={showAddUpdateModalView}
                headerString={headerString}
                navigation={navigation}
            />

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
                currentListIndex={listIndex}
                isVisible={isCopyModalVisible}
                setIsVisible={setIsCopyItemsVisible}
            />
        </>
    );
}
