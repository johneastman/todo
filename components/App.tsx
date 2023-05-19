import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import React, { Component } from "react";
import { StatusBar, StyleSheet, View, Text, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ItemCell, Item } from "./ItemCell";
import ItemModal from "./AddItemModal";

import DraggableFlatList, {
    RenderItemParams,
    ScaleDecorator,
    NestableScrollContainer,
} from "react-native-draggable-flatlist";
import {
    GestureHandlerRootView,
    ScrollView,
} from "react-native-gesture-handler";
import ItemsMenu from "./ItemsMenu";

interface ItemJSON {
    value: string;
    quantity: number;
    isComplete: boolean;
}

interface AppState {
    items: Item[];
    isAddItemVisible: boolean;
    isUpdateItemVisible: boolean;
    updateItem: Item | undefined;
    updateItemIndex: number;
}

export default class App extends Component<{}, AppState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            items: [],
            isAddItemVisible: false,
            isUpdateItemVisible: false,
            updateItem: undefined,
            updateItemIndex: 0,
        };

        this.dismissModal = this.dismissModal.bind(this);
        this.openUpdateItemModal = this.openUpdateItemModal.bind(this);
        this.closeUpdateItemModal = this.closeUpdateItemModal.bind(this);
        this.saveItems = this.saveItems.bind(this);
        this.getItems = this.getItems.bind(this);
        this.addItem = this.addItem.bind(this);
        this.updateItem = this.updateItem.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
    }

    async componentDidMount(): Promise<void> {
        let items: Item[] = await this.getItems();
        this.setState({ items: items });
    }

    render(): JSX.Element {
        const items: Item[] = this.state.items;

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
                        updateItem={this.updateItem}
                        deleteItem={this.deleteItem}
                        openUpdateItemModal={this.openUpdateItemModal}
                    />
                </ScaleDecorator>
            );
        };

        let itemsCount: number = this.state.items
            .map((item) => (item.isComplete ? 0 : item.quantity))
            .reduce<number>((prev, curr) => prev + curr, 0);

        return (
            <View style={styles.container}>
                <GestureHandlerRootView style={{ flex: 1 }}>
                    <ItemModal
                        item={undefined}
                        index={this.state.updateItemIndex}
                        isVisible={this.state.isAddItemVisible}
                        title="Add a New Item"
                        positiveActionText="Add"
                        positiveAction={this.addItem}
                        negativeActionText="Cancel"
                        negativeAction={this.dismissModal}
                    />

                    <ItemModal
                        item={this.state.updateItem}
                        index={this.state.updateItemIndex}
                        isVisible={this.state.isUpdateItemVisible}
                        title="Update Item"
                        positiveActionText="Update"
                        positiveAction={this.updateItem}
                        negativeActionText="Cancel"
                        negativeAction={this.closeUpdateItemModal}
                    />

                    <ItemsMenu
                        listName="List Name"
                        quantity={itemsCount}
                        displayAddItemModal={() => {
                            this.setState({ isAddItemVisible: true });
                        }}
                    />

                    {items.length === 0 ? (
                        <View
                            style={{
                                alignItems: "center",
                                justifyContent: "center",
                                flex: 1,
                            }}
                        >
                            <Text style={styles.text}>No Items</Text>
                        </View>
                    ) : (
                        <View style={{ flex: 1 }}>
                            <DraggableFlatList
                                data={items}
                                onDragEnd={({ data, from, to }) => {
                                    this.setState(
                                        { items: data },
                                        async () => await this.saveItems()
                                    );
                                }}
                                keyExtractor={(_, index) => `key-${index}`}
                                renderItem={renderItem}
                            />
                        </View>
                    )}
                </GestureHandlerRootView>
                <ExpoStatusBar style="auto" />
            </View>
        );
    }

    dismissModal(): void {
        this.setState({ isAddItemVisible: false });
    }

    openUpdateItemModal(index: number, item: Item): void {
        this.setState({
            isUpdateItemVisible: true,
            updateItem: item,
            updateItemIndex: index,
        });
    }

    closeUpdateItemModal(): void {
        this.setState({ isUpdateItemVisible: false, updateItem: undefined });
    }

    async getItems(): Promise<Item[]> {
        let items: Item[] = [];

        let itemsJSONData: string | null = await AsyncStorage.getItem("items");
        if (itemsJSONData !== null) {
            let itemsJSON: ItemJSON[] = JSON.parse(itemsJSONData);
            items = itemsJSON.map((item) => {
                return new Item(
                    item.value,
                    item.quantity || 1, // "|| 1" handles items saved without quantity previously present
                    item.isComplete
                );
            });
        }

        return items;
    }

    async saveItems(): Promise<void> {
        let items: Item[] = this.state.items;
        let itemsJSON: {}[] = items.map((item) => {
            return {
                value: item.value,
                quantity: item.quantity,
                isComplete: item.isComplete,
            };
        });

        let itemsJSONData: string = JSON.stringify(itemsJSON);

        await AsyncStorage.setItem("items", itemsJSONData);
    }

    addItem(_: number, newItem: Item): void {
        // If the user doesn't enter a name, "itemName" will be an empty string
        if (newItem.value.length <= 0) {
            this.setState({ isAddItemVisible: false });
            return;
        }

        this.setState(
            {
                isAddItemVisible: false,
                items: this.state.items.concat(newItem),
            },
            async () => {
                await this.saveItems();
            }
        );
    }

    updateItem(index: number, item: Item): void {
        let items: Item[] = this.state.items.concat(); // makes a copy of items in state
        items[index] = item;
        this.setState(
            { items: items, isUpdateItemVisible: false },
            async () => {
                await this.saveItems();
            }
        );
    }

    deleteItem(index: number): void {
        let items: Item[] = this.state.items.concat();
        items.splice(index, 1);
        this.setState({ items: items }, async () => {
            await this.saveItems();
        });
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    text: {
        fontSize: 40,
    },
});
