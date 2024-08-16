import React, { useContext, useEffect } from "react";

import { Item } from "../../data/data";
import {
    areTestsRunning,
    cellsCountDisplay,
    getNumItemsIncomplete,
    getNumItemsTotal,
    itemFilterIndices,
    navigationTitleOptions,
    partitionLists,
} from "../../utils";
import {
    ItemPageNavigationProps,
    MenuOption,
    SelectionValue,
    ActionMetadata,
    CellSelect,
    CellAction,
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
    ListsAction,
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

    /**
     * Select Actions - what items are selected in the Actions modal.
     */
    const selectActions: [CellSelect, number[]][] = [
        ["All", items.map((_, index) => index)],
        ["None", []],
        ["Complete", itemFilterIndices(items, (item: Item) => item.isComplete)],
        [
            "Incomplete",
            itemFilterIndices(items, (item: Item) => !item.isComplete),
        ],
        ["Locked", itemFilterIndices(items, (item: Item) => item.isLocked)],
        ["Unlocked", itemFilterIndices(items, (item: Item) => !item.isLocked)],
    ];

    /**
     * Items Actions - actions performed on selected items.
     */
    const cellActions: [CellAction, ListsAction][] = [
        ["Delete", new DeleteItems(listIndex)],
        ["Complete", new ItemsIsComplete(listIndex, true)],
        ["Incomplete", new ItemsIsComplete(listIndex, false)],
    ];

    const setIsActionsModalVisible = (isVisible: boolean) =>
        navigation.navigate("Actions", {
            cellType: "Item",
            listIndex: listIndex,
            selectActions: selectActions,
            cellActions: cellActions,
            cells: items.map((list, index) => ({
                label: list.name,
                value: index,
            })),
        });

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
