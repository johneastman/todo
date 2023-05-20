import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StyleSheet, View } from "react-native";
import {
    RenderItemParams,
    ScaleDecorator,
} from "react-native-draggable-flatlist";
import ItemCell from "./ItemCell";
import ItemsMenu from "./ItemsMenu";
import ItemsList from "./ItemsList";
import { AppStackNavigatorParamList } from "./App";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import ItemModal from "./CreateEditItemModal";
import { Item } from "../data/Item";

interface ItemJSON {
    listId: string;
    value: string;
    quantity: number;
    isComplete: boolean;
}

type ListPageNavigationProp = NativeStackScreenProps<
    AppStackNavigatorParamList,
    "Items"
>;

export default function ItemsPage({
    route,
    navigation,
}: ListPageNavigationProp): JSX.Element {
    // Props
    const { listName, listId } = route.params;

    // State
    const [items, setItems] = useState<Item[]>([]);
    const [isAddItemVisible, setIsAddItemVisible] = useState<boolean>(false);
    const [isUpdateItemVisible, setIsUpdateItemVisible] =
        useState<boolean>(false);
    const [updatedItem, setUpdateItem] = useState<Item>();
    const [updateItemIndex, setUpdateItemIndex] = useState<number>(0);

    useEffect(() => {
        const fetchData = async () => {
            let items: Item[] = await getItems();
            setItems(items);
        };

        fetchData();
    }, []);

    useEffect(() => {
        navigation.setOptions({
            title: listName,
        });
    }, [navigation]);

    useEffect(() => {
        (async () => {
            await saveItems();
        })();
    }, [items]);

    // Methods
    const getItems = async (): Promise<Item[]> => {
        let items: Item[] = [];

        let itemsJSONData: string | null = await AsyncStorage.getItem("items");
        if (itemsJSONData !== null) {
            let itemsJSON: ItemJSON[] = JSON.parse(itemsJSONData);
            items = itemsJSON.map((item) => {
                return new Item(
                    item.listId,
                    item.value,
                    item.quantity,
                    item.isComplete
                );
            });
        }
        return items;
    };

    const saveItems = async (): Promise<void> => {
        let itemsJSON: ItemJSON[] = items.map((item) => {
            return {
                listId: item.listId,
                value: item.value,
                quantity: item.quantity,
                isComplete: item.isComplete,
            };
        });

        let itemsJSONData: string = JSON.stringify(itemsJSON);

        await AsyncStorage.setItem("items", itemsJSONData);
    };

    const dismissModal = (): void => {
        setIsAddItemVisible(false);
    };

    const openUpdateItemModal = (index: number, item: Item): void => {
        setIsUpdateItemVisible(true);
        setUpdateItem(item);
        setUpdateItemIndex(index);
    };

    const closeUpdateItemModal = (): void => {
        setIsUpdateItemVisible(false);
        setUpdateItem(undefined);
    };

    const addItem = (_: number, newItem: Item): void => {
        // If the user doesn't enter a name, "itemName" will be an empty string
        if (newItem.value.length <= 0) {
            setIsAddItemVisible(false);
            return;
        }

        let newItems: Item[] = items.concat(newItem);

        setItems(newItems);
        setIsAddItemVisible(false);
    };

    const updateItem = (index: number, newItem: Item): void => {
        let newItems: Item[] = items.concat();
        newItems[index] = newItem;

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
                    index={getIndex() || 0}
                    drag={drag}
                    isActive={isActive}
                    updateItem={updateItem}
                    deleteItem={deleteItem}
                    openUpdateItemModal={openUpdateItemModal}
                />
            </ScaleDecorator>
        );
    };

    // Filter out items not in this list.
    let listItems: Item[] = items.filter((item) => item.listId === listId);

    let itemsCount: number = listItems
        .map((item) => (item.isComplete ? 0 : item.quantity))
        .reduce<number>((prev, curr) => prev + curr, 0);

    return (
        <View style={styles.container}>
            <ItemModal
                item={undefined}
                listId={listId}
                index={updateItemIndex}
                isVisible={isAddItemVisible}
                title="Add a New Item"
                positiveActionText="Add"
                positiveAction={addItem}
                negativeActionText="Cancel"
                negativeAction={dismissModal}
            />

            <ItemModal
                item={updatedItem}
                listId={listId}
                index={updateItemIndex}
                isVisible={isUpdateItemVisible}
                title="Update Item"
                positiveActionText="Update"
                positiveAction={updateItem}
                negativeActionText="Cancel"
                negativeAction={closeUpdateItemModal}
            />

            <ItemsMenu
                quantity={itemsCount}
                displayAddItemModal={() => setIsAddItemVisible(true)}
            />

            <ItemsList
                items={listItems}
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
