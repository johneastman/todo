import React, { useEffect, useState } from "react";
import { Button, StyleSheet, View, Text } from "react-native";
import {
    RenderItemParams,
    ScaleDecorator,
} from "react-native-draggable-flatlist";
import ItemCell from "./ItemCell";

import ItemModal from "./ItemModal";
import { Item } from "../data/Item";
import { getItems, saveItems } from "../data/utils";
import { itemsCountDisplay, pluralize } from "../utils";
import CustomList from "./CustomList";
import CollectionMenu from "./CollectionMenu";
import CustomModal from "./CustomModal";
import { ItemPageNavigationProp, Position } from "../types";

export default function ItemsPage({
    route,
    navigation,
}: ItemPageNavigationProp): JSX.Element {
    // Props
    const { listName, listId } = route.params;

    // State
    const [items, setItems] = useState<Item[]>([]);
    const [isItemModalVisible, setIsItemModalVisible] =
        useState<boolean>(false);
    const [currentItemIndex, setCurrentItemIndex] = useState<number>(-1);
    const [isDeleteAllItemsModalVisible, setIsDeleteAllItemsModalVisible] =
        useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            let items: Item[] | undefined = await getItems(listId);
            if (items != undefined) {
                setItems(items);
            } else {
                // TODO: raise error
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        navigation.setOptions({
            title: listName,
        });
    }, [navigation]);

    useEffect(() => {
        const saveData = async () => {
            await saveItems(listId, items);
        };
        saveData();
    }, [items]);

    const openUpdateItemModal = (index: number): void => {
        setIsItemModalVisible(true);
        setCurrentItemIndex(index);
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

        let newItems: Item[] = items.concat();

        if (newPos === "top") {
            newItems.splice(oldPos, 1);
            newItems = [item].concat(newItems);
        } else if (newPos === "current") {
            newItems = newItems
                .slice(0, oldPos)
                .concat(item)
                .concat(newItems.slice(oldPos + 1));
        } else {
            // Bottom
            newItems.splice(oldPos, 1);
            newItems = newItems.concat(item);
        }
        setItems(newItems);
        closeUpdateItemModal();
    };

    const deleteItem = (index: number): void => {
        let newItems: Item[] = items.concat();
        newItems.splice(index, 1);
        setItems(newItems);
    };

    // Views
    const renderItem = ({
        item,
        getIndex,
        drag,
        isActive,
    }: RenderItemParams<Item>) => {
        return (
            <ScaleDecorator>
                <ItemCell
                    item={item}
                    index={getIndex() ?? -1}
                    drag={drag}
                    isActive={isActive}
                    updateItem={updateItem}
                    deleteItem={deleteItem}
                    openUpdateItemModal={openUpdateItemModal}
                />
            </ScaleDecorator>
        );
    };

    let itemsCount: number = items
        .map((item) => (item.isComplete ? 0 : item.quantity))
        .reduce<number>((prev, curr) => prev + curr, 0);

    let headerString: string = `${itemsCount} ${pluralize(
        itemsCount,
        "Item",
        "Items"
    )}`;

    return (
        <View style={styles.container}>
            <ItemModal
                item={items[currentItemIndex]}
                index={currentItemIndex}
                isVisible={isItemModalVisible}
                title={
                    currentItemIndex === -1 ? "Add a New Item" : "Update Item"
                }
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
                    title="Settings"
                    onPress={() => {
                        navigation.navigate("Settings");
                    }}
                />
                <Button
                    title="Delete All Items"
                    color="red"
                    onPress={() => {
                        setIsDeleteAllItemsModalVisible(true);
                    }}
                    disabled={items.length === 0}
                />
                <Button
                    title="Add Item"
                    onPress={() => setIsItemModalVisible(true)}
                />
            </CollectionMenu>

            <CustomList
                items={items}
                renderItem={renderItem}
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
