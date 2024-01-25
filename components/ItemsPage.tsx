import React, { useContext } from "react";
import { Button, View } from "react-native";

import ItemModal from "./ItemModal";
import { Item, List } from "../data/data";
import {
    RED,
    areCellsSelected,
    areTestsRunning,
    getItemBeingEdited,
    getNumItemsIncomplete,
    getNumItemsTotal,
    getSelectedItems,
    isAllSelected,
    pluralize,
    selectedListCellsWording,
    updateCollection,
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
    DeleteItems,
    ItemsIsComplete,
    MoveItems,
    UpdateCopyModalVisible,
    UpdateDeleteModalVisible,
    UpdateItems,
    UpdateModalVisible,
} from "../data/reducers/app.reducer";

function partitionLists(
    currentListId: string,
    lists: List[]
): [List | undefined, List[]] {
    return lists.reduce<[List | undefined, List[]]>(
        ([current, other], list) =>
            list.id === currentListId
                ? [list, other]
                : [current, [...other, list]],
        [undefined, []]
    );
}

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

    const setItems = (newItems: Item[], isAltAction: boolean = false) =>
        dispatch(new UpdateItems(currentList.id, newItems, isAltAction));
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

    const openDeleteAllItemsModal = (): void =>
        setIsDeleteAllItemsModalVisible(true);

    const closeUpdateItemModal = (): void => setIsItemModalVisible(false);

    const addItem = (addItemParams: ItemCRUD, isAltAction: boolean): void => {
        const { newPos, item } = addItemParams;

        // If the user doesn't enter a name, "itemName" will be an empty string
        if (item.name.trim().length <= 0) {
            setIsItemModalVisible(false);
            return;
        }

        setItems(
            newPos === "top" ? [item].concat(items) : items.concat(item),
            isAltAction
        );
    };

    const updateItem = async (
        updateItemParams: ItemCRUD,
        isAltAction: boolean
    ): Promise<void> => {
        const { oldPos, newPos, listId, item } = updateItemParams;

        // If the user doesn't enter a name, "itemName" will be an empty string
        if (item.name.trim().length <= 0) {
            setIsItemModalVisible(false);
            return;
        }

        // Update the item in the current position if the new position is "other". The item will be moved later.
        let newItems: Item[] = updateCollection(
            item,
            items.concat(),
            oldPos,
            newPos === "other" ? "current" : newPos
        );

        setItems(newItems, isAltAction);

        // After the item has been updated, move it to the other list if the new position is "other".
        if (newPos === "other") {
            dispatch(
                new MoveItems("Move", currentList.id, currentList.id, listId)
            );
        }
    };

    const setItemCompleteStatus = (item: Item, index: number) => {
        let newItem: Item = new Item(
            item.name,
            item.quantity,
            item.itemType,
            !item.isComplete
        );

        updateItem(
            {
                oldPos: index,
                newPos: "current",
                listId: currentList.id,
                item: newItem,
            },
            false
        );
    };

    const setSelectedItems = (index: number, isSelected: boolean) => {
        const newItems: Item[] = items.map((i, idx) =>
            i.setIsSelected(idx === index ? isSelected : i.isSelected)
        );
        setItems(newItems);
    };

    /**
     * List View Header
     */
    const menuOptionsData: MenuOption[] = [
        {
            text: `Delete ${selectedListCellsWording(items)} Items`,
            onPress: openDeleteAllItemsModal,
            disabled: items.length === 0,
            color: RED,
            testId: "items-page-delete-all-items",
        },
        {
            text: `Set ${selectedListCellsWording(items)} to Complete`,
            onPress: () => setIsCompleteForAll(true),
            testId: "items-page-set-all-to-complete",
        },
        {
            text: `Set ${selectedListCellsWording(items)} to Incomplete`,
            onPress: () => setIsCompleteForAll(false),
            testId: "items-page-set-all-to-incomplete",
        },
        {
            text: `Move/Copy ${
                areCellsSelected(items) ? "Selected " : ""
            }Items From`,
            onPress: () => setIsCopyItemsVisible(true),
            testId: "items-page-copy-items-from",
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
            {getSelectedItems(items).length === 1 ? (
                <Button
                    title="Edit Item"
                    onPress={() => {
                        const itemIndex: number = getItemBeingEdited(items);
                        openUpdateItemModal(itemIndex);
                    }}
                />
            ) : null}

            <Button
                title="Add Item"
                onPress={() => {
                    setIsItemModalVisible(true);
                }}
            />
        </>
    );

    // Header text
    const selectecCount: number = getNumItemsIncomplete(
        currentList.listType,
        items
    );

    const totalItems: number = getNumItemsTotal(currentList.listType, items);

    let headerString: string = `${selectecCount} / ${totalItems} ${pluralize(
        selectecCount,
        "Item",
        "Items"
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
                    negativeAction={() =>
                        setIsDeleteAllItemsModalVisible(false)
                    }
                />

                <MoveItemsModal
                    currentList={currentList}
                    otherLists={otherLists}
                    isVisible={isCopyModalVisible}
                    setIsVisible={setIsCopyItemsVisible}
                    setItems={setItems}
                />

                <CollectionViewHeader
                    title={headerString}
                    isAllSelected={isAllSelected(items)}
                    onSelectAll={(checked: boolean) =>
                        setItems(items.map((i) => i.setIsSelected(checked)))
                    }
                    right={collectionViewHeaderRight}
                />

                <CustomList
                    items={items}
                    renderItem={(params) => (
                        <ItemCellView
                            renderParams={params}
                            onPress={setItemCompleteStatus}
                            list={currentList}
                            updateItems={setSelectedItems}
                            openAddItemModal={openUpdateItemModal}
                        />
                    )}
                    drag={({ data }) => {
                        setItems(data);
                    }}
                />
            </View>
        </CollectionPageView>
    );
}
