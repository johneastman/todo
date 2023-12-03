import React, { useContext, useEffect, useState } from "react";
import { Button, StyleSheet, View } from "react-native";

import ItemModal from "./ItemModal";
import { Item, List, MenuOption } from "../data/data";
import { getItems, saveItems } from "../data/utils";
import {
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
import ListViewHeader from "./ListViewHeader";
import ListCellWrapper from "./ListCellWrapper";
import ListPageView from "./ListPageView";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import DeleteAllModal from "./DeleteAllModal";

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

    const isFocused = useIsFocused();

    useEffect(() => {
        // Get list items
        (async () => setItems(await getItems(list.id)))();
    }, [isFocused]);

    useEffect(() => {
        const saveData = async () => {
            await saveItems(list.id, items);
        };
        saveData();
    }, [items]);

    const setIsCompleteForAll = (isComplete: boolean): void => {
        let newItems: Item[] = items.map((item, index) => {
            if (areCellsSelected(items)) {
                // Only apply the changes to items that are currently selected.
                const newIsComplete: boolean = item.isSelected
                    ? isComplete
                    : item.isComplete;
                return new Item(item.name, item.quantity, newIsComplete);
            }

            // When no items are selected, apply changes to all items.
            return new Item(item.name, item.quantity, isComplete);
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
        // setItemsBeingEdited([]); // Remove all items being edited so no checkboxes are selected after deletion.
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
        if (item.name.trim().length <= 0) {
            setIsItemModalVisible(false);
            return;
        }

        setItems(newPos === "top" ? [item].concat(items) : items.concat(item));

        // Close add-items modal. For some reason, calling "closeUpdateItemModal", which originally had
        // logic to de-select every item, resulted in new items not being added.
        setCurrentItemIndex(-1);
        setIsItemModalVisible(false);
    };

    const updateItem = async (
        oldPos: number,
        newPos: Position,
        listId: string,
        item: Item
    ): Promise<void> => {
        // If the user doesn't enter a name, "itemName" will be an empty string
        if (item.name.trim().length <= 0) {
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

    const setItemCompleteStatus = (item: Item, index: number) => {
        let newItem: Item = new Item(
            item.name,
            item.quantity,
            !item.isComplete
        );
        updateItem(index, "current", list.id, newItem);
    };

    const setSelectedItems = (index: number, isSelected: boolean) => {
        const newItems: Item[] = items.map(
            (i, idx) =>
                new Item(
                    i.name,
                    i.quantity,
                    i.isComplete,
                    idx === index ? isSelected : i.isSelected
                )
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
            color: "red",
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
            text: "Copy Items From",
            onPress: () => setIsCopyItemsVisible(true),
            testId: "items-page-copy-items-from",
        },
        { text: "Settings", onPress: () => navigation.navigate("Settings") },
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
        title: list.name,
    };

    const listViewHeaderRight: JSX.Element = (
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
                    setCurrentItemIndex(-1);
                }}
            />
        </>
    );

    // Header text
    const selectecCount: number = getNumItemsIncomplete(list.listType, items);
    const totalItems: number = getNumItemsTotal(list.listType, items);

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
        <ListPageView
            optionsText="Item Options"
            menuOptions={menuOptionsData}
            navigationMenuOptions={navigationMenuOptions}
            items={items}
        >
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
                        listType={list.listType}
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

                    <DeleteAllModal
                        isVisible={isDeleteAllItemsModalVisible}
                        items={items}
                        positiveAction={deleteAllItems}
                        negativeAction={() => {
                            setIsDeleteAllItemsModalVisible(false);
                        }}
                    />

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
                        isAllSelected={isAllSelected(items)}
                        onChecked={(checked: boolean) =>
                            setItems(items.map((i) => i.setIsSelected(checked)))
                        }
                        right={listViewHeaderRight}
                    />

                    <CustomList
                        items={items}
                        renderItem={(params) => (
                            <ListCellWrapper
                                renderParams={params}
                                onPress={setItemCompleteStatus}
                            >
                                <ItemCellView
                                    list={list}
                                    updateItems={setSelectedItems}
                                />
                            </ListCellWrapper>
                        )}
                        drag={({ data }) => {
                            setItems(data);
                        }}
                    />
                </View>
            </ListContext.Provider>
        </ListPageView>
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
