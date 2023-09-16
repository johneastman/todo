import React, { useEffect, useState } from "react";
import { Button, StyleSheet, View, Text } from "react-native";

import ItemModal from "./ItemModal";
import { Item, List } from "../data/data";
import { getDeveloperMode, getItems, getLists, saveItems } from "../data/utils";
import {
    areTestsRunning,
    getItemsCount,
    itemsCountDisplay,
    pluralize,
    updateCollection,
} from "../utils";
import CustomList from "./CustomList";
import CollectionMenu from "./CollectionMenu";
import CustomModal from "./CustomModal";
import { ItemPageNavigationScreenProp, Position } from "../types";
import { useIsFocused } from "@react-navigation/core";
import ItemsPageCell from "./ItemsPageCell";
import ItemsPageMenu from "./ItemsPageMenu";
import SelectListsDropdown from "./SelectList";
import { useDeveloperMode } from "../data/hooks";

export default function ItemsPage({
    route,
    navigation,
}: ItemPageNavigationScreenProp): JSX.Element {
    // Props
    const { list } = route.params;

    // State
    const [items, setItems] = useState<Item[]>([]);
    const [isItemModalVisible, setIsItemModalVisible] =
        useState<boolean>(false);
    const [currentItemIndex, setCurrentItemIndex] = useState<number>(-1);
    const [isDeleteAllItemsModalVisible, setIsDeleteAllItemsModalVisible] =
        useState<boolean>(false);
    const [isDeveloperModeEnabled, setIsDeveloperModeEnabled] =
        useDeveloperMode();
    const [isCopyItemsVisible, setIsCopyItemsVisible] =
        useState<boolean>(false);
    const [selectedListId, setSelectedListId] = useState<string>("");
    const [lists, setLists] = useState<List[]>([]);

    const isFocused = useIsFocused();

    useEffect(() => {
        // Get list items
        (async () => setItems(await getItems(list.id)))();
    }, [isFocused]);

    useEffect(() => {
        navigation.setOptions({
            title: list.name,
            headerRight: () => (
                <ItemsPageMenu
                    items={items}
                    navigation={navigation}
                    deleteAllItems={openDeleteAllItemsModal}
                    changeIsComplete={setIsCompleteForAll}
                    setIsCopyItemsVisible={setIsCopyItemsVisible}
                />
            ),
        });
    }, [navigation, items]);

    useEffect(() => {
        const saveData = async () => {
            await saveItems(list.id, items);
        };
        saveData();
    }, [items]);

    useEffect(() => {
        (async () =>
            setLists((await getLists()).filter((l) => l.id !== list.id)))();
    }, []);

    const setIsCompleteForAll = (isComplete: boolean): void => {
        let newItems: Item[] = items.map(
            (item) => new Item(item.value, item.quantity, isComplete)
        );
        setItems(newItems);
    };

    const openUpdateItemModal = (index: number): void => {
        setIsItemModalVisible(true);
        setCurrentItemIndex(index);
    };

    const openDeleteAllItemsModal = (): void => {
        setIsDeleteAllItemsModalVisible(true);
    };

    const closeUpdateItemModal = (): void => {
        setIsItemModalVisible(false);
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
        setIsItemModalVisible(false);
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

    let itemsCount: number = getItemsCount(list.type, items);

    let headerString: string = `${itemsCount} ${pluralize(
        itemsCount,
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
        <View style={styles.container}>
            <ItemModal
                item={items[currentItemIndex]}
                index={currentItemIndex}
                isVisible={isItemModalVisible}
                title={
                    currentItemIndex === -1 ? "Add a New Item" : "Update Item"
                }
                listType={list.type}
                listId={list.id}
                positiveActionText={currentItemIndex === -1 ? "Add" : "Update"}
                positiveAction={currentItemIndex === -1 ? addItem : updateItem}
                negativeActionText="Cancel"
                negativeAction={closeUpdateItemModal}
            />

            <CustomModal
                title={
                    "Are you sure you want to delete all the items in this list?"
                }
                isVisible={isDeleteAllItemsModalVisible}
                positiveActionText={"Yes"}
                positiveAction={() => {
                    setItems([]);
                    setIsDeleteAllItemsModalVisible(false);
                }}
                negativeActionText={"No"}
                negativeAction={() => {
                    setIsDeleteAllItemsModalVisible(false);
                }}
            >
                <Text>
                    This list contains {itemsCountDisplay(items.length)}.
                </Text>
            </CustomModal>

            <CustomModal
                title={"Select list to copy items from into this list"}
                isVisible={isCopyItemsVisible}
                positiveActionText={"Copy"}
                positiveAction={async () => {
                    // Get the items from the selected list
                    let newItems: Item[] = await getItems(selectedListId);

                    // Add them to the current list.
                    setItems(items.concat(newItems));

                    // Dismiss the modal
                    setIsCopyItemsVisible(false);
                }}
                negativeActionText={"Cancel"}
                negativeAction={() => {
                    setIsCopyItemsVisible(false);
                }}
            >
                <SelectListsDropdown
                    currentListId={list.id}
                    setSelectedListId={setSelectedListId}
                />
            </CustomModal>

            <CollectionMenu headerString={headerString}>
                <Button
                    title="Add Item"
                    onPress={() => setIsItemModalVisible(true)}
                />

                {areTestsRunning() ? (
                    /* Due to issues with rendering items in "react-native-popup-menu" (see this issue:
                     * https://github.com/johneastman/todo/issues/50 ), the logic associated with those menu
                     * items is also added here. These views are only rendered during testing.
                     *
                     * It's a hacky solution, but it allows for testing functional workflows in the app.
                     */
                    <>
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
                    </>
                ) : null}
            </CollectionMenu>

            <CustomList
                items={items}
                renderItem={(params) => (
                    <ItemsPageCell
                        renderItemParams={params}
                        list={list}
                        isDeveloperModeEnabled={isDeveloperModeEnabled}
                        updateItem={updateItem}
                        deleteItem={deleteItem}
                        openUpdateItemModal={openUpdateItemModal}
                    />
                )}
                drag={({ data, from, to }) => {
                    setItems(data);
                }}
            />
        </View>
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
