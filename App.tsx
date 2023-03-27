import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { Component } from 'react';
import { StatusBar, FlatList, StyleSheet, View, Text, Button, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ItemList, Item } from './ItemList';
import AddItemModal from "./AddItemModal";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    text: {
        fontSize: 40
    },
    menu: {
        marginTop: StatusBar.currentHeight,
        padding: 20
    }
});

interface AppState {
    items: Item[];
    isAddItemVisible: boolean;
}

export default class App extends Component<{}, AppState> {

    constructor(props: {}) {
        super(props);
        this.state = {
            items: [],
            isAddItemVisible: false
        }
    }

    async componentDidMount(): Promise<void> {

        let items: Item[] = await this.getItems();
        if (items.length === 0) {
            // Test data to work with if using a new device
            items = [
                new Item("a"),
                new Item("b"),
                new Item("c"),
                new Item("d"),
                new Item("e"),
                new Item("f"),
                new Item("g"),
                new Item("h"),
                new Item("i"),
                new Item("j"),
                new Item("k"),
                new Item("l"),
                new Item("m"),
                new Item("n"),
                new Item("o"),
                new Item("p"),
                new Item("q"),
                new Item("r"),
                new Item("s"),
                new Item("t"),
                new Item("u"),
                new Item("v"),
                new Item("w"),
                new Item("x"),
                new Item("y"),
                new Item("z")
            ];
        }

        this.setState({items: items});
    }

    render(): JSX.Element {
        const items: Item[] = this.state.items;

        return (
            <>
                <AddItemModal isVisible={this.state.isAddItemVisible} addItem={this.addItem.bind(this)}></AddItemModal>

                <View style={styles.menu}>
                    <Button title="Add Item" onPress={() => { this.setState({isAddItemVisible: true}) }}></Button>
                </View>

                <View style={[styles.container, items.length === 0 ? {alignItems: "center", justifyContent: "center"} : {}]}>
                    {items.length === 0
                        ? <Text>No Items</Text>
                        : <FlatList 
                            data={items}
                            renderItem={(item) => ItemList({
                                item: item,
                                updateItem: this.updateItem.bind(this)
                            })}>
                        </FlatList>
                    }
                </View>

                <ExpoStatusBar style="auto" />
            </>
        );
    }

    async getItems(): Promise<Item[]> {
        let items: Item[] = []

        let itemsJSONData: string | null = await AsyncStorage.getItem("items");
        if (itemsJSONData !== null) {
            let itemsJSON: {value: string, isComplete: boolean}[] = JSON.parse(itemsJSONData);
            items = itemsJSON.map(item => {
                return new Item(item.value, item.isComplete);
            });
        }

        return items;
    }

    async saveItems(): Promise<void> {
        let items: Item[] = this.state.items;
        let itemsJSON: {}[] = items.map(item => {
            return {value: item.value, isComplete: item.isComplete}
        });

        let itemsJSONData: string = JSON.stringify(itemsJSON);

        await AsyncStorage.setItem("items", itemsJSONData);
    }

    async updateItem(itemId: number, item: Item): Promise<void> {
        let items: Item[] = this.state.items;
        items[itemId] = item;
        this.setState({items: items});

        await this.saveItems();
    }

    async addItem(): Promise<void> {
        this.setState({isAddItemVisible: false});
    }
}
