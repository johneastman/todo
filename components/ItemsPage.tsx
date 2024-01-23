import React, { useContext, useState } from "react";
import { Button, View } from "react-native";

import ItemModal from "./ItemModal";
import { Item, List } from "../data/data";
import { getItems, saveItems } from "../data/utils";
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
import { UpdateItems, UpdateModalVisible } from "../data/reducers/app.reducer";

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
            itemsState: { isModalVisible, currentIndex },
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

    const [isDeleteAllItemsModalVisible, setIsDeleteAllItemsModalVisible] =
        useState<boolean>(false);
    const [isCopyItemsVisible, setIsCopyItemsVisible] =
        useState<boolean>(false);

    const setIsCompleteForAll = (isComplete: boolean): void => {
        let newItems: Item[] = items.map((item) => {
            if (areCellsSelected(items)) {
                // Only apply the changes to items that are currently selected.
                const newIsComplete: boolean = item.isSelected
                    ? isComplete
                    : item.isComplete;
                return new Item(
                    item.name,
                    item.quantity,
                    item.itemType,
                    newIsComplete
                );
            }

            // When no items are selected, apply changes to all items.
            return new Item(
                item.name,
                item.quantity,
                item.itemType,
                isComplete
            );
        });
        setItems(newItems);
    };

    const deleteAllItems = () => {
        // When items are selected, filter out items NOT being edited because these are the items we want to keep.
        const newItems: Item[] = areCellsSelected(items)
            ? items.filter((item) => !item.isSelected)
            : [];

        setItems(newItems);
        setIsDeleteAllItemsModalVisible(false);
    };

    const openUpdateItemModal = (index: number): void =>
        setIsItemModalVisible(true, index);

    const openDeleteAllItemsModal = (): void => {
        setIsDeleteAllItemsModalVisible(true);
    };

    const closeUpdateItemModal = (): void => setIsItemModalVisible(false);

    const addItem = (addItemParams: ItemCRUD): void => {
        const { newPos, item } = addItemParams;

        // If the user doesn't enter a name, "itemName" will be an empty string
        if (item.name.trim().length <= 0) {
            setIsItemModalVisible(false);
            return;
        }

        setItems(newPos === "top" ? [item].concat(items) : items.concat(item));
        closeUpdateItemModal();
    };

    const updateItem = async (updateItemParams: ItemCRUD): Promise<void> => {
        const { oldPos, newPos, listId, item } = updateItemParams;

        // If the user doesn't enter a name, "itemName" will be an empty string
        if (item.name.trim().length <= 0) {
            setIsItemModalVisible(false);
            return;
        }

        if (listId === currentList.id) {
            // Updating item in current list
            let newItems: Item[] = updateCollection(
                item,
                items.concat(),
                oldPos,
                newPos
            );
            setItems(newItems);
        } else {
            // Update and move item to selected list
            let newItems: Item[] = (await getItems(listId)).concat(item);
            await saveItems(listId, newItems);
            deleteItem(oldPos);
        }

        closeUpdateItemModal();
    };

    const deleteItem = (index: number): void => {
        let newItems: Item[] = items.concat();
        newItems.splice(index, 1);
        setItems(newItems);
    };

    /**
     * If the user invokes the alternate action while adding a new list, the modal
     * will reset to add another list.
     *
     * If the user invokes the alternate action while editing a list, the modal will
     * reset to the next list, allowing the user to continually update subsequent
     * lists. If the user is on the last list and clicks "next", the modal will
     * dismiss itself.
     */
    const altAction = (): void => {
        if (currentIndex === -1) {
            setIsItemModalVisible(true);
        } else {
            if (currentIndex + 1 < items.length) {
                setIsItemModalVisible(true, currentIndex + 1);
            }
        }
    };

    const setItemCompleteStatus = (item: Item, index: number) => {
        let newItem: Item = new Item(
            item.name,
            item.quantity,
            item.itemType,
            !item.isComplete
        );

        updateItem({
            oldPos: index,
            newPos: "current",
            listId: currentList.id,
            item: newItem,
        });
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
                    altActionText="Next"
                    altAction={altAction}
                />

                <DeleteAllModal
                    isVisible={isDeleteAllItemsModalVisible}
                    items={items}
                    positiveAction={deleteAllItems}
                    negativeAction={() =>
                        setIsDeleteAllItemsModalVisible(false)
                    }
                />

                <MoveItemsModal
                    currentList={currentList}
                    otherLists={otherLists}
                    isVisible={isCopyItemsVisible}
                    setIsVisible={setIsCopyItemsVisible}
                    setItems={setItems}
                />

                <CollectionViewHeader
                    title={headerString}
                    isAllSelected={isAllSelected(items)}
                    onChecked={(checked: boolean) =>
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
