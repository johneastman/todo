import React, { useContext, useEffect } from "react";
import { View } from "react-native";

import ItemModal from "../ItemModal";
import { Item } from "../../data/data";
import {
    RED,
    areCellsSelected,
    areTestsRunning,
    cellsCountDisplay,
    getNumItemsIncomplete,
    getNumItemsTotal,
    partitionLists,
} from "../../utils";
import {
    CellAction,
    ItemPageNavigationScreenProp,
    MenuOption,
    CellSelect,
} from "../../types";
import ItemCellView from "../ItemCellView";
import CollectionViewHeader from "../CollectionViewHeader";
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
} from "../../data/reducers/itemsState.reducer";
import { AddUpdateModalVisible as AddUpdateModalVisibleList } from "../../data/reducers/listsState.reducer";
import { ListsStateContext } from "../../contexts/listsState.context";

export default function ItemsPage({
    route,
    navigation,
}: ItemPageNavigationScreenProp): JSX.Element {
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

    const openDeleteAllItemsModal = (): void =>
        setIsDeleteAllItemsModalVisible(true);

    const closeDeleteAllItemsModal = (): void =>
        setIsDeleteAllItemsModalVisible(false);

    const selectItem = (index: number, isSelected: boolean) =>
        dispatch(new SelectItem(listIndex, index, isSelected));

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
    const selectActions: Map<CellSelect, () => void> = new Map([
        ["All", () => dispatch(new SelectAllItems(listIndex, true))],
        ["None", () => dispatch(new SelectAllItems(listIndex, false))],
        [
            "Complete",
            () =>
                dispatch(
                    new SelectItemsWhere(
                        listIndex,
                        (item: Item) => item.isComplete
                    )
                ),
        ],
        [
            "Incomplete",
            () =>
                dispatch(
                    new SelectItemsWhere(
                        listIndex,
                        (item: Item) => !item.isComplete
                    )
                ),
        ],
        [
            "Locked",
            () =>
                dispatch(
                    new SelectItemsWhere(
                        listIndex,
                        (item: Item) => item.isLocked
                    )
                ),
        ],
        [
            "Unlocked",
            () =>
                dispatch(
                    new SelectItemsWhere(
                        listIndex,
                        (item: Item) => !item.isLocked
                    )
                ),
        ],
    ]);

    const itemsActions: Map<CellAction, () => void> = new Map([
        ["Delete", openDeleteAllItemsModal],
        ["Complete", () => setIsCompleteForAll(true)],
        ["Incomplete", () => setIsCompleteForAll(false)],
    ]);

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
        {
            text: "Delete Items",
            onPress: openDeleteAllItemsModal,
            disabled: !areCellsSelected(items),
            color: RED,
            testId: "items-page-delete-all-items",
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
        <CollectionPageView
            cells={items}
            renderItem={(params) => (
                <ItemCellView
                    renderParams={params}
                    listIndex={listIndex}
                    list={currentList}
                    updateItems={selectItem}
                />
            )}
            onDragEnd={(items: Item[]) => setItems(items)}
            menuOptions={menuOptionsData}
            navigationMenuOptions={navigationMenuOptions}
            cellType="Item"
            setActionsModalVisible={setIsActionsModalVisible}
        >
            <View>
                <ItemModal listIndex={listIndex} list={currentList} />

                <ActionsModal
                    cellsType="Item"
                    isVisible={isActionsModalVisible}
                    cellSelectActions={selectActions}
                    cellsActions={itemsActions}
                    setVisible={setIsActionsModalVisible}
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

                <CollectionViewHeader
                    title={headerString}
                    cells={items}
                    collectionType="Item"
                    setAddUpdateModalVisible={setIsAddUpdateModalVisible}
                />
            </View>
        </CollectionPageView>
    );
}
