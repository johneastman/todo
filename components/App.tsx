import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { Component } from 'react';
import { StatusBar, FlatList, StyleSheet, View, Text, Button } from 'react-native';
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
        this.setState({items: items});
    }

    render(): JSX.Element {
        const items: Item[] = this.state.items;

        return (
            <>
                <AddItemModal 
                    isVisible={this.state.isAddItemVisible}
                    addItem={this.addItem.bind(this)}
                    dismiss={this.dismissModal.bind(this)}/>

                <View style={styles.menu}>
                    <Button title="Add Item" onPress={() => { this.setState({isAddItemVisible: true}) }}></Button>
                </View>

                <View style={[styles.container, items.length === 0 ? {alignItems: "center", justifyContent: "center"} : {}]}>
                    {items.length === 0
                        ? <Text style={styles.text}>No Items</Text>
                        : <FlatList 
                            data={items}
                            renderItem={(item) => <ItemList 
                                item={item}
                                updateItem={this.updateItem.bind(this)}
                                deleteItem={this.deleteItem.bind(this)}/>
                            }/>
                    }
                </View>

                <ExpoStatusBar style="auto" />
            </>
        );
    }

    dismissModal(): void {
        this.setState({isAddItemVisible: false});
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

    async addItem(itemName: string): Promise<void> {
        // If the user doesn't enter a name, "itemName" will be an empty string
        if (itemName.length > 0) {
            let items: Item[] = this.state.items;
            let newItem: Item = new Item(itemName);
            items.push(newItem);

            this.setState({isAddItemVisible: false, items: items});
            await this.saveItems();
        }
    }

    async updateItem(itemId: number, item: Item): Promise<void> {
        let items: Item[] = this.state.items;
        items[itemId] = item;
        this.setState({items: items});

        await this.saveItems();
    }

    async deleteItem(itemId: number): Promise<void> {
        let items: Item[] = this.state.items;
        items.splice(itemId, 1);
        this.setState({items: items});

        await this.saveItems();
    }
}
