import React, { useEffect, useState } from "react";
import { Button, StyleSheet, View, Text } from "react-native";

import ItemModal from "./ItemModal";
import { Item } from "../data/data";
import { getDeveloperMode, getItems, saveItems } from "../data/utils";
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
        useState<boolean>(false);

    const isFocused = useIsFocused();

    useEffect(() => {
        // Get list items
        (async () => {
            setItems(await getItems(list.id));
        })();

        // Get Developer Mode
        (async () => {
            setIsDeveloperModeEnabled(await getDeveloperMode());
        })();
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

    const addItem = (_: number, newPos: Position, item: Item): void => {
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

    const updateItem = (oldPos: number, newPos: Position, item: Item): void => {
        // If the user doesn't enter a name, "itemName" will be an empty string
        if (item.value.trim().length <= 0) {
            setIsItemModalVisible(false);
            return;
        }

        let newItems: Item[] = updateCollection(
            item,
            items.concat(),
            oldPos,
            newPos
        );

        setItems(newItems);
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
                            title="Delete All Items"
                            testID="items-page-delete-all-items"
                            onPress={() => openDeleteAllItemsModal()}
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
