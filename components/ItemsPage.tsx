import React, { useEffect, useState } from "react";
import { Button, StyleSheet, View } from "react-native";
import {
    RenderItemParams,
    ScaleDecorator,
} from "react-native-draggable-flatlist";
import ItemCell from "./ItemCell";
import { AppStackNavigatorParamList } from "./App";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import ItemModal from "./CreateEditItemModal";
import { Item } from "../data/Item";
import { getList, saveItems } from "../data/utils";
import { List } from "../data/List";
import { pluralize } from "../utils";
import CustomList from "./CustomList";
import CollectionMenu from "./CollectionMenu";

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
            let list: List | undefined = await getList(listId);
            if (list != undefined) {
                setItems(list.items);
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

    const addItem = (_: number, item: Item): void => {
        // If the user doesn't enter a name, "itemName" will be an empty string
        if (item.value.length <= 0) {
            setIsAddItemVisible(false);
            return;
        }

        let newItems: Item[] = items.concat(item);

        setItems(newItems);
        setIsAddItemVisible(false);
    };

    const updateItem = (index: number, item: Item): void => {
        // If the user doesn't enter a name, "itemName" will be an empty string
        if (item.value.length <= 0) {
            setIsAddItemVisible(false);
            return;
        }

        let newItems: Item[] = items
            .slice(0, index)
            .concat(item)
            .concat(items.slice(index + 1));

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
                item={undefined}
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
                index={updateItemIndex}
                isVisible={isUpdateItemVisible}
                title="Update Item"
                positiveActionText="Update"
                positiveAction={updateItem}
                negativeActionText="Cancel"
                negativeAction={closeUpdateItemModal}
            />

            <CollectionMenu headerString={headerString}>
                <Button
                    title="Add Item"
                    onPress={() => setIsAddItemVisible(true)}
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
