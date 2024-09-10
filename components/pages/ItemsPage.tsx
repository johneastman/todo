import React, { useContext, useEffect } from "react";

import { Item } from "../../data/data";
import {
    areTestsRunning,
    cellsCountDisplay,
    Color,
    getNumItemsIncomplete,
    getNumItemsTotal,
    itemFilterIndices,
    navigationTitleOptions,
    partitionLists,
} from "../../utils";
import { ItemPageNavigationProps, CellSelect, CellAction } from "../../types";
import ItemCellView from "../ItemCellView";
import DeleteAllModal from "../DeleteAllModal";
import MoveItemsModal from "../MoveItemsModal";
import { ListsContext } from "../../contexts/lists.context";
import {
    DeleteItems,
    ItemsIsComplete,
    ListsAction,
    LockItems,
    SelectItem,
    UpdateItems,
} from "../../data/reducers/lists.reducer";
import { SettingsContext } from "../../contexts/settings.context";
import { ItemsStateContext } from "../../contexts/itemsState.context";
import {
    DeleteAllModalVisible,
    MoveCopyModalVisible,
    UpdateCurrentIndex,
    UpdateDrawerVisibility,
    UpdateSelectMode,
} from "../../data/reducers/itemsState.reducer";
import CollectionPageDrawer from "../CollectionPageDrawer";
import CollectionViewHeader from "../CollectionViewHeader";
import CustomList from "../core/CustomList";
import CustomButton from "../core/CustomButton";
import { Switch, View } from "react-native";
import CollectionPageNavigationHeader from "../CollectionPageNavigationHeader";
import {
    DrawerMenu,
    DrawerMenuButton,
    DrawerMenuDividedButton,
} from "../../data/drawerMenu";

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

    const [currentList, otherLists] = partitionLists(listIndex, lists);

    const items: Item[] = currentList.items;

    const itemsStateContext = useContext(ItemsStateContext);
    const {
        itemsState: {
            currentIndex,
            isCopyModalVisible,
            isDeleteAllModalVisible,
            isDrawerVisible,
            selectMode,
        },
        itemsStateDispatch,
    } = itemsStateContext;

    const settingsContext = useContext(SettingsContext);
    const {
        settings: { isDeveloperModeEnabled },
    } = settingsContext;

    const setIsOptionsDrawerVisible = (newIsDrawerVisible: boolean) =>
        itemsStateDispatch(new UpdateDrawerVisibility(newIsDrawerVisible));

    const setIsDeleteAllItemsModalVisible = (isVisible: boolean) =>
        itemsStateDispatch(new DeleteAllModalVisible(isVisible));

    const setIsCopyItemsVisible = (isVisible: boolean) =>
        itemsStateDispatch(new MoveCopyModalVisible(isVisible));

    const updateSelectMode = (isVisible: boolean) =>
        itemsStateDispatch(new UpdateSelectMode(isVisible));

    useEffect(() => {
        navigation.setOptions({
            title: currentList.name,
            headerRight: () => (
                <CollectionPageNavigationHeader
                    cellType="Item"
                    selectMode={selectMode}
                    updateSelectMode={updateSelectMode}
                    updateDrawerVisibility={setIsOptionsDrawerVisible}
                />
            ),
        });
    }, [navigation, items, selectMode]);

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
        ["Lock", new LockItems(listIndex, true)],
        ["Unlock", new LockItems(listIndex, false)],
    ];

    const navigateToActionsPage = () =>
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

    const navigateToAddUpdateItemPage = (cellIndex: number): void =>
        navigation.navigate("AddUpdateItem", {
            listIndex,
            itemIndex: cellIndex,
            currentItem: items[cellIndex],
        });

    const editItem = (index: number) => navigateToAddUpdateItemPage(index);

    const setIsCompleteForAll = (isComplete: boolean): void =>
        dispatch(new ItemsIsComplete(listIndex, isComplete));

    const setIsLockedForAll = (isLocked: boolean): void =>
        dispatch(new LockItems(listIndex, isLocked));

    const deleteAllItems = () => {
        // Delete items
        dispatch(new DeleteItems(listIndex));

        // Close the modal
        setIsDeleteAllItemsModalVisible(false);
    };

    const selectItem = (index: number, isSelected: boolean) =>
        dispatch(new SelectItem(listIndex, index, isSelected));

    const deleteItem = (index: number) => {
        selectItem(index, true);
        itemsStateDispatch(new UpdateCurrentIndex(index));
        setIsDeleteAllItemsModalVisible(true);
    };

    const closeDeleteAllItemsModal = (): void => {
        // De-select the item when the modal is closed.
        selectItem(currentIndex, false);
        setIsDeleteAllItemsModalVisible(false);
    };

    const openDeleteAllItemsModal = (): void =>
        setIsDeleteAllItemsModalVisible(true);

    /** * * * * * * * * *
     * List View Header *
     * * * * * * * * * **/

    /**
     * The "Move Items" button is enabled when the current list contains items
     *
     * @returns true if the "Move Items" button is disabled; false otherwise.
     */
    const isMoveItemButtonEnabled = (): boolean => currentList.items.length > 0;

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

    const topMenuOptions: DrawerMenu[] = [
        new DrawerMenuButton({
            // Despite being a common menu option, this button should be the first option
            // in the top menu for ease of access.
            text: "Actions",
            onPress: () => navigateToActionsPage(),
            disabled: true,
        }),

        new DrawerMenuButton({
            text: "Delete Items",
            onPress: openDeleteAllItemsModal,
            color: Color.Red,
            disabled: items.filter((item) => item.isSelected).length === 0,
        }),

        new DrawerMenuDividedButton(
            {
                text: "Complete",
                onPress: () => setIsCompleteForAll(true),
            },
            {
                text: "Incomplete",
                onPress: () => setIsCompleteForAll(false),
            }
        ),

        new DrawerMenuDividedButton(
            {
                text: "Lock",
                onPress: () => setIsLockedForAll(true),
            },
            {
                text: "Unlock",
                onPress: () => setIsLockedForAll(false),
            }
        ),

        new DrawerMenuButton({
            text: "Move Items",
            onPress: () => setIsCopyItemsVisible(true),
            testId: "items-page-copy-items-from",
            disabled: !isMoveItemButtonEnabled(),
        }),

        new DrawerMenuButton({
            text: "Edit List",
            onPress: () =>
                navigation.navigate("AddUpdateList", {
                    listIndex: listIndex,
                    currentList: currentList,
                    visibleFrom: "Item",
                }),
        }),

        // Add an option for a back button if the tests are running
        ...(areTestsRunning()
            ? [
                  new DrawerMenuButton({
                      text: "Back",
                      testId: "items-page-back-button",
                      onPress: () => navigation.goBack(),
                  }),
              ]
            : []),
    ];

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
                collectionType="Item"
                setAddUpdateModalVisible={navigateToAddUpdateItemPage}
            />

            <CustomList
                items={items}
                renderItem={(params) => (
                    <ItemCellView
                        renderParams={params}
                        listIndex={listIndex}
                        list={currentList}
                        onEdit={editItem}
                        onDelete={deleteItem}
                        onSelect={selectItem}
                    />
                )}
                drag={({ data }) => setItems(data)}
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
