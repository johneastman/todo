import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { Component } from 'react';
import { StatusBar, FlatList, StyleSheet, View } from 'react-native';
import { ItemList, Item } from './ItemList';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "stretch",
        marginTop: StatusBar.currentHeight
    },
    text: {
        fontSize: 40
    },
});

interface AppState {
    items: Item[];
    selectedItem: number;
}

export default class App extends Component<{}, AppState> {

    constructor(props: {}) {
        super(props);
        this.state = {
            items: this.getItems(),
            selectedItem: 0
        }
    }

    getItems(): Item[] {
        return [
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

    render(): JSX.Element {
        const items: Item[] = this.state.items;

        return (
        <View style={styles.container}>
            <FlatList 
                data={items}
                renderItem={(item) => ItemList({
                    item: item,
                    selectedItem: this.state.selectedItem,
                    setSelectedItem: (item) => { this.setState({selectedItem: item}) }
                })}>

            </FlatList>
            <ExpoStatusBar style="auto" />
        </View>
        );
    }
}
