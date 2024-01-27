import React, { useContext } from "react";
import { Button, View } from "react-native";

import ItemModal from "./ItemModal";
import { Item } from "../data/data";
import {
    RED,
    areCellsSelected,
    areTestsRunning,
    cellsCountDisplay,
    getCellBeingEdited,
    getNumItemsIncomplete,
    getNumItemsTotal,
    getSelectedCells,
    isAllSelected,
    partitionLists,
} from "../utils";
import CustomList from "./CustomList";
import { ItemPageNavigationScreenProp, ItemCRUD, MenuOption } from "../types";
import ItemCellView from "./ItemCellView";
import CollectionViewHeader from "./CollectionViewHeader";
import CollectionPageView from "./CollectionPageView";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import DeleteAllModal from "./DeleteAllModal";
import MoveItemsModal from "./MoveItemsModal";
import { AppContext } from "../contexts/app.context";
import {
    AddItem,
    DeleteItems,
    ItemsIsComplete,
    SelectAllItems,
    SelectItem,
    UpdateCopyModalVisible,
    UpdateDeleteModalVisible,
    UpdateItem,
    UpdateItems,
    UpdateModalVisible,
} from "../data/reducers/app.reducer";

export default function ItemsPage({
    route,
    navigation,
}: ItemPageNavigationScreenProp): JSX.Element {
    /**
     * Data is passed into navigation views by value, meaning those values will not change
     * if the state they derive from does. To get around this, I'm passing the list id to
     * this view and retrieving the list object dynamically.
     */
    const { listId } = route.params;
    const settingsContext = useContext(AppContext);
    const {
        data: {
            settings: { isDeveloperModeEnabled },
            lists,
            itemsState: {
                isModalVisible,
                currentIndex,
                isCopyModalVisible,
                isDeleteAllModalVisible,
            },
        },
        dispatch,
    } = settingsContext;

    const [currentList, otherLists] = partitionLists(listId, lists);
    if (currentList === undefined)
        throw Error(`No list found with id: ${listId}`);

    const items: Item[] = currentList.items;

    const setItems = (newItems: Item[]) =>
        dispatch(new UpdateItems(currentList.id, newItems));

    const setIsItemModalVisible = (isVisible: boolean, index?: number) =>
        dispatch(new UpdateModalVisible("Item", isVisible, index));

    const setIsDeleteAllItemsModalVisible = (isVisible: boolean) =>
        dispatch(new UpdateDeleteModalVisible("Item", isVisible));

    const setIsCopyItemsVisible = (isVisible: boolean) =>
        dispatch(new UpdateCopyModalVisible(isVisible));

    const setIsCompleteForAll = (isComplete: boolean): void =>
        dispatch(new ItemsIsComplete(listId, isComplete));

    const deleteAllItems = () => dispatch(new DeleteItems(currentList.id));

    const openUpdateItemModal = (index: number): void =>
        setIsItemModalVisible(true, index);

    const closeUpdateItemModal = (): void => setIsItemModalVisible(false);

    const openDeleteAllItemsModal = (): void =>
        setIsDeleteAllItemsModalVisible(true);

    const closeDeleteAllItemsModal = (): void =>
        setIsDeleteAllItemsModalVisible(false);

    const addItem = (addItemParams: ItemCRUD, isAltAction: boolean): void =>
        dispatch(new AddItem(addItemParams, isAltAction));

    const updateItem = async (
        updateItemParams: ItemCRUD,
        isAltAction: boolean
    ): Promise<void> => dispatch(new UpdateItem(updateItemParams, isAltAction));

    const selectItem = (index: number, isSelected: boolean) =>
        dispatch(new SelectItem(listId, index, isSelected));

    const selectAllItems = (isSelected: boolean) =>
        dispatch(new SelectAllItems(listId, isSelected));

    /**
     * List View Header
     */
    const menuOptionsData: MenuOption[] = [
        {
            text: "Delete Items",
            onPress: openDeleteAllItemsModal,
            disabled: !areCellsSelected(items),
            color: RED,
            testId: "items-page-delete-all-items",
        },
        {
            text: "Mark as Complete",
            onPress: () => setIsCompleteForAll(true),
            testId: "items-page-set-all-to-complete",
            disabled: !areCellsSelected(items),
        },
        {
            text: "Mark as Incomplete",
            onPress: () => setIsCompleteForAll(false),
            testId: "items-page-set-all-to-incomplete",
            disabled: !areCellsSelected(items),
        },
        {
            text: "Move Items",
            onPress: () => setIsCopyItemsVisible(true),
            testId: "items-page-copy-items-from",
            disabled: otherLists.every((list) => list.items.length === 0),
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

    const collectionViewHeaderRight: JSX.Element = (
        <>
            {getSelectedCells(items).length === 1 ? (
                <Button
                    title="Edit Item"
                    onPress={() => {
                        const itemIndex: number = getCellBeingEdited(items);
                        openUpdateItemModal(itemIndex);
                    }}
                />
            ) : null}

            <Button
                title="Add Item"
                onPress={() => setIsItemModalVisible(true)}
            />
        </>
    );

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
            menuOptions={menuOptionsData}
            navigationMenuOptions={navigationMenuOptions}
            items={items}
            itemsType="Item"
        >
            <View style={{ flex: 1 }}>
                <ItemModal
                    list={currentList}
                    numLists={otherLists.length}
                    item={items[currentIndex]}
                    index={currentIndex}
                    isVisible={isModalVisible}
                    title={
                        currentIndex === -1 ? "Add a New Item" : "Update Item"
                    }
                    listType={currentList.listType}
                    positiveActionText={currentIndex === -1 ? "Add" : "Update"}
                    positiveAction={currentIndex === -1 ? addItem : updateItem}
                    negativeActionText="Cancel"
                    negativeAction={closeUpdateItemModal}
                />

                <DeleteAllModal
                    isVisible={isDeleteAllModalVisible}
                    items={items}
                    positiveAction={deleteAllItems}
                    negativeAction={closeDeleteAllItemsModal}
                />

                <MoveItemsModal
                    currentList={currentList}
                    otherLists={otherLists}
                    isVisible={isCopyModalVisible}
                    setIsVisible={setIsCopyItemsVisible}
                />

                <CollectionViewHeader
                    title={headerString}
                    isAllSelected={isAllSelected(items)}
                    onSelectAll={selectAllItems}
                    right={collectionViewHeaderRight}
                />

                <CustomList
                    items={items}
                    renderItem={(params) => (
                        <ItemCellView
                            renderParams={params}
                            list={currentList}
                            updateItems={selectItem}
                            openAddItemModal={openUpdateItemModal}
                        />
                    )}
                    drag={({ data }) => setItems(data)}
                />
            </View>
        </CollectionPageView>
    );
}
