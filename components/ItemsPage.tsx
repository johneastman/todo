import React, { useContext, useEffect, useState } from "react";
import { Button, StyleSheet, View, Text } from "react-native";

import ItemModal from "./ItemModal";
import { Item, List, MenuData } from "../data/data";
import { getItems, saveItems } from "../data/utils";
import {
    areCellsSelected,
    areTestsRunning,
    deleteCollectionMenuStyle,
    getItemsCount,
    handleSelectAll,
    isCellBeingEdited,
    itemsCountDisplay,
    pluralize,
    selectedListCellsWording,
    updateCellBeingEdited,
    updateCollection,
} from "../utils";
import CustomList from "./CustomList";
import CustomModal from "./CustomModal";
import {
    ItemPageNavigationScreenProp,
    Position,
    SettingsContext,
    ListContext,
} from "../types";
import { useIsFocused } from "@react-navigation/core";
import ItemCellView from "./ItemCellView";
import SelectListsDropdown from "./SelectList";
import CustomMenu from "./CustomMenu";
import ListViewHeader from "./ListViewHeader";
import ListCellWrapper from "./ListCellWrapper";

export default function ItemsPage({
    route,
    navigation,
}: ItemPageNavigationScreenProp): JSX.Element {
    // Props
    const { list } = route.params;
    const settingsContext = useContext(SettingsContext);

    // State
    const [items, setItems] = useState<Item[]>([]);
    const [isItemModalVisible, setIsItemModalVisible] =
        useState<boolean>(false);
    const [currentItemIndex, setCurrentItemIndex] = useState<number>(-1);
    const [isDeleteAllItemsModalVisible, setIsDeleteAllItemsModalVisible] =
        useState<boolean>(false);
    const [isCopyItemsVisible, setIsCopyItemsVisible] =
        useState<boolean>(false);
    const [selectedList, setSelectedList] = useState<List | undefined>();

    // Editing Items
    const [itemsBeingEdited, setItemsBeingEdited] = useState<number[]>([]);
    const [isAllItemsSelected, setIsAllItemsSelected] =
        useState<boolean>(false);

    const isFocused = useIsFocused();

    useEffect(() => {
        // Get list items
        (async () => setItems(await getItems(list.id)))();
    }, [isFocused]);

    useEffect(() => {
        navigation.setOptions({
            title: list.name,
            headerRight: () => (
                <CustomMenu
                    menuData={[
                        new MenuData(
                            `Delete ${selectedListCellsWording(
                                itemsBeingEdited
                            )} Items`,
                            openDeleteAllItemsModal,
                            items.length === 0,
                            deleteCollectionMenuStyle(items)
                        ),
                        new MenuData(
                            `Set ${selectedListCellsWording(
                                itemsBeingEdited
                            )} to Complete`,
                            () => setIsCompleteForAll(true)
                        ),
                        new MenuData(
                            `Set ${selectedListCellsWording(
                                itemsBeingEdited
                            )} to Incomplete`,
                            () => setIsCompleteForAll(false)
                        ),
                        new MenuData("Copy Items From", () =>
                            setIsCopyItemsVisible(true)
                        ),
                        new MenuData("Settings", () =>
                            navigation.navigate("Settings")
                        ),
                    ]}
                />
            ),
        });
    }, [navigation, items, itemsBeingEdited]);

    useEffect(() => {
        const saveData = async () => {
            await saveItems(list.id, items);
        };
        saveData();
    }, [items]);

    const setIsCompleteForAll = (isComplete: boolean): void => {
        let newItems: Item[] = items.map((item, index) => {
            if (areCellsSelected(itemsBeingEdited)) {
                // Only apply the changes to items that are currently selected.
                const newIsComplete: boolean =
                    itemsBeingEdited.indexOf(index) !== -1
                        ? isComplete
                        : item.isComplete;
                return new Item(item.value, item.quantity, newIsComplete);
            }

            // When no items are selected, apply changes to all items.
            return new Item(item.value, item.quantity, isComplete);
        });
        setItems(newItems);
    };

    const deleteAllItems = () => {
        // When items are selected, filter out items NOT being edited because these are the items we want to keep.
        const newItems: Item[] = areCellsSelected(itemsBeingEdited)
            ? items.filter((_, index) => itemsBeingEdited.indexOf(index) === -1)
            : [];

        setItems(newItems);
        setIsDeleteAllItemsModalVisible(false);
        setItemsBeingEdited([]); // Remove all items being edited so no checkboxes are selected after deletion.
    };

    const openUpdateItemModal = (index: number): void => {
        setIsItemModalVisible(true);
        setCurrentItemIndex(index);
    };

    const openDeleteAllItemsModal = (): void => {
        setIsDeleteAllItemsModalVisible(true);
    };

    const closeUpdateItemModal = (): void => {
        if (isItemModalVisible) {
            // Ensure selected items are only cleared when an update operation that requires the item modal happens.
            setIsItemModalVisible(false);
            setItemsBeingEdited([]);
        }
        setCurrentItemIndex(-1);
    };

    const addItem = (
        index: number,
        newPos: Position,
        listId: string,
        item: Item
    ): void => {
        // If the user doesn't enter a name, "itemName" will be an empty string
        if (item.value.trim().length <= 0) {
            setIsItemModalVisible(false);
            return;
        }

        let newItems: Item[] =
            newPos === "top" ? [item].concat(items) : items.concat(item);

        setItems(newItems);
        closeUpdateItemModal();
    };

    const updateItem = async (
        oldPos: number,
        newPos: Position,
        listId: string,
        item: Item
    ): Promise<void> => {
        // If the user doesn't enter a name, "itemName" will be an empty string
        if (item.value.trim().length <= 0) {
            setIsItemModalVisible(false);
            return;
        }

        if (listId === list.id) {
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
        if (currentItemIndex === -1) {
            setIsItemModalVisible(true);
        } else {
            if (currentItemIndex + 1 < items.length) {
                setIsItemModalVisible(true);
            }
            setCurrentItemIndex(currentItemIndex + 1);
        }
    };

    const selectecCount: number = getItemsCount(list.type, items);
    const totalItems: number = getItemsCount(list.type, items, false);

    let headerString: string = `${selectecCount} / ${totalItems} ${pluralize(
        selectecCount,
        "Item",
        "Items"
    )}`;

    /* If developer mode is enabled, also display the number of items in the "items" list (length of
     * list, not sum of quantities).
     */
    if (settingsContext.isDeveloperModeEnabled) {
        headerString += ` (${items.length} Cells)`;
    }

    return (
        <ListContext.Provider value={list}>
            <View style={styles.container}>
                <ItemModal
                    item={items[currentItemIndex]}
                    index={currentItemIndex}
                    isVisible={isItemModalVisible}
                    title={
                        currentItemIndex === -1
                            ? "Add a New Item"
                            : "Update Item"
                    }
                    listType={list.type}
                    positiveActionText={
                        currentItemIndex === -1 ? "Add" : "Update"
                    }
                    positiveAction={
                        currentItemIndex === -1 ? addItem : updateItem
                    }
                    negativeActionText="Cancel"
                    negativeAction={closeUpdateItemModal}
                    altActionText="Next"
                    altAction={altAction}
                />

                <CustomModal
                    title={`Are you sure you want to delete ${
                        areCellsSelected(itemsBeingEdited)
                            ? "the selected"
                            : "all the"
                    } items in this list?`}
                    isVisible={isDeleteAllItemsModalVisible}
                    positiveActionText={"Yes"}
                    positiveAction={deleteAllItems}
                    negativeActionText={"No"}
                    negativeAction={() => {
                        setIsDeleteAllItemsModalVisible(false);
                    }}
                >
                    <Text>
                        {itemsCountDisplay(
                            areCellsSelected(itemsBeingEdited)
                                ? itemsBeingEdited.length
                                : items.length
                        )}{" "}
                        will be deleted.
                    </Text>
                </CustomModal>

                <CustomModal
                    title={"Select list to copy items from into this list"}
                    isVisible={isCopyItemsVisible}
                    positiveActionText={"Copy"}
                    positiveAction={async () => {
                        if (selectedList !== undefined) {
                            // Get the items from the selected list
                            let newItems: Item[] = await getItems(
                                selectedList.id
                            );

                            // Add them to the current list.
                            setItems(items.concat(newItems));
                        }

                        // Dismiss the modal
                        setIsCopyItemsVisible(false);
                    }}
                    negativeActionText={"Cancel"}
                    negativeAction={() => {
                        setIsCopyItemsVisible(false);
                    }}
                >
                    <SelectListsDropdown
                        currentList={list}
                        selectedList={selectedList}
                        setSelectedList={setSelectedList}
                    />
                </CustomModal>

                <ListViewHeader
                    title={headerString}
                    isAllSelected={isAllItemsSelected}
                    onChecked={(checked: boolean) =>
                        handleSelectAll(
                            checked,
                            items,
                            setItemsBeingEdited,
                            setIsAllItemsSelected
                        )
                    }
                    right={
                        <>
                            {itemsBeingEdited.length === 1 ? (
                                <Button
                                    title="Edit Item"
                                    onPress={() => {
                                        openUpdateItemModal(
                                            itemsBeingEdited[0]
                                        );
                                    }}
                                />
                            ) : null}

                            <Button
                                title="Add Item"
                                onPress={() => {
                                    setIsItemModalVisible(true);
                                    setCurrentItemIndex(-1);
                                }}
                            />
                        </>
                    }
                >
                    {areTestsRunning() ? (
                        /* Due to issues with rendering items in "react-native-popup-menu" (see this issue:
                         * https://github.com/johneastman/todo/issues/50 ), the logic associated with those menu
                         * items is also added here. These views are only rendered during testing.
                         *
                         * It's a hacky solution, but it allows for testing functional workflows in the app.
                         */
                        <View style={{ flexDirection: "column" }}>
                            <Button
                                title="Back"
                                testID="items-page-back-button"
                                onPress={() => navigation.goBack()}
                            />
                            <Button
                                title="Delete All Items"
                                testID="items-page-delete-all-items"
                                onPress={() => openDeleteAllItemsModal()}
                            />
                            <Button
                                title="Set All to Complete"
                                testID="items-page-set-all-to-complete"
                                onPress={() => setIsCompleteForAll(true)}
                            />
                            <Button
                                title="Copy Items From"
                                testID="items-page-copy-items-from"
                                onPress={() => setIsCopyItemsVisible(true)}
                            />
                            <Button
                                title="Set All to Incomplete"
                                testID="items-page-set-all-to-incomplete"
                                onPress={() => setIsCompleteForAll(false)}
                            />
                        </View>
                    ) : null}
                </ListViewHeader>

                <CustomList
                    items={items}
                    renderItem={(params) => (
                        <ListCellWrapper
                            renderParams={params}
                            onPress={() => {
                                const item: Item = params.item;
                                const index: number = params.getIndex() ?? -1;

                                let newItem: Item = new Item(
                                    item.value,
                                    item.quantity,
                                    !item.isComplete
                                );
                                updateItem(index, "current", list.id, newItem);
                            }}
                        >
                            <ItemCellView
                                list={list}
                                updateItemBeingEdited={(
                                    index: number,
                                    addToList: boolean
                                ) =>
                                    updateCellBeingEdited(
                                        itemsBeingEdited,
                                        setItemsBeingEdited,
                                        index,
                                        addToList
                                    )
                                }
                                isItemBeingEdited={(index: number) =>
                                    isCellBeingEdited(itemsBeingEdited, index)
                                }
                            />
                        </ListCellWrapper>
                    )}
                    drag={({ data, from, to }) => {
                        setItems(data);
                    }}
                />
            </View>
        </ListContext.Provider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    text: {
        fontSize: 40,
    },
});
