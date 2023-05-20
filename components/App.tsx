import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import React, { Component } from "react";
import { View, StyleSheet, Button, Text, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ItemCell from "./ItemCell";
import ItemModal from "./CreateEditItemModal";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import ItemsMenu from "./ItemsMenu";
import ItemsList from "./ItemsList";
import DraggableFlatList, {
    RenderItemParams,
    ScaleDecorator,
} from "react-native-draggable-flatlist";
import { NavigationContainer, ParamListBase } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

export class List {
    name: string;
    constructor(name: string) {
        this.name = name;
    }
}

export class Item {
    listId: number;
    value: string;
    quantity: number;
    isComplete: boolean;
    constructor(
        listId: number,
        value: string,
        quantity: number,
        isComplete: boolean = false
    ) {
        this.listId = listId;
        this.value = value;
        this.quantity = quantity;
        this.isComplete = isComplete;
    }
}

interface ListJSON {
    name: string;
}

interface ItemJSON {
    listId: number;
    value: string;
    quantity: number;
    isComplete: boolean;
}

interface AppState {
    items: Item[];
    lists: List[];
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
            lists: [],
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
        let lists: List[] = await this.getLists();
        if (lists.length === 0) {
            lists.push(new List("My List"));
        }

        this.setState({ items: items, lists: lists });
    }

    render(): JSX.Element {
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

        const renderListsItem = (
            { item, getIndex, drag, isActive }: RenderItemParams<List>,
            navigation: any
        ) => {
            return (
                <ScaleDecorator>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate("List Items", {
                                name: item.name,
                                index: getIndex() || 0,
                            });
                        }}
                    >
                        <View style={styles.listCell}>
                            <Text>{item.name}</Text>
                        </View>
                    </TouchableOpacity>
                </ScaleDecorator>
            );
        };

        const Stack = createNativeStackNavigator();

        const Lists = ({ navigation }: any) => {
            let lists: List[] = this.state.lists;

            return (
                <GestureHandlerRootView style={{ flex: 1 }}>
                    <DraggableFlatList
                        data={lists}
                        onDragEnd={({ data, from, to }) => {}}
                        keyExtractor={(_, index) => `key-${index}`}
                        renderItem={(params: RenderItemParams<List>) => {
                            return renderListsItem(params, navigation);
                        }}
                    />
                </GestureHandlerRootView>
            );
        };

        const ListItems = ({ route }: any) => {
            const { name, index } = route.params;

            let itemsCount: number = (this.state.items as Item[])
                .map((item) => (item.isComplete ? 0 : item.quantity))
                .reduce<number>((prev, curr) => prev + curr, 0);

            return (
                <View style={styles.container}>
                    <ItemModal
                        item={undefined}
                        listId={index}
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
                        listId={index}
                        index={this.state.updateItemIndex}
                        isVisible={this.state.isUpdateItemVisible}
                        title="Update Item"
                        positiveActionText="Update"
                        positiveAction={this.updateItem}
                        negativeActionText="Cancel"
                        negativeAction={this.closeUpdateItemModal}
                    />

                    <ItemsMenu
                        listName={name}
                        quantity={itemsCount}
                        displayAddItemModal={() => {
                            this.setState({ isAddItemVisible: true });
                        }}
                    />
                    <ItemsList
                        items={this.state.items}
                        renderItem={renderItem}
                        drag={({ data, from, to }) => {
                            this.setState(
                                { items: data },
                                async () => await this.saveItems()
                            );
                        }}
                    />
                    <ExpoStatusBar style="auto" />
                </View>
            );
        };

        return (
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen
                        name="Lists"
                        component={Lists}
                        options={{ title: "Your Lists" }}
                    />
                    <Stack.Screen name="List Items" component={ListItems} />
                </Stack.Navigator>
            </NavigationContainer>
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
                    item.listId,
                    item.value,
                    item.quantity,
                    item.isComplete
                );
            });
        }

        return items;
    }

    async getLists(): Promise<List[]> {
        let lists: List[] = [];

        let listsJSONData: string | null = await AsyncStorage.getItem("lists");
        if (listsJSONData !== null) {
            let listsJSON: ListJSON[] = JSON.parse(listsJSONData);
            lists = listsJSON.map((list) => {
                return new List(list.name);
            });
        }
        return lists;
    }

    async saveItems(): Promise<void> {
        let items: Item[] = this.state.items;
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
    }

    async saveLists(): Promise<void> {
        let lists: List[] = this.state.lists;
        let listsJSON: ListJSON[] = lists.map((list) => {
            return {
                name: list.name,
            };
        });

        let listsJSONData: string = JSON.stringify(listsJSON);

        await AsyncStorage.setItem("lists", listsJSONData);
    }

    addItem(_: number, newItem: Item): void {
        // If the user doesn't enter a name, "itemName" will be an empty string
        if (newItem.value.length <= 0) {
            this.setState({ isAddItemVisible: false });
            return;
        }

        console.log(this.state.items.length);
        let items: Item[] = this.state.items.concat(newItem);
        console.log(items.length);

        this.setState(
            {
                isAddItemVisible: false,
                items: items,
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
    listCell: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#555",
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
    },
});
