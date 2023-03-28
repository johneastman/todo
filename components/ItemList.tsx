import { ListRenderItemInfo, Text, StyleSheet, View, Button, TouchableWithoutFeedback } from 'react-native';

const styles = StyleSheet.create({
    text: {
        fontSize: 40,
        alignItems: "center"
    },
    listCell: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#555',
        justifyContent: "space-between",
        flexDirection: "row"
    }
});

export class Item {
    value: string;
    isComplete: boolean;
    constructor(value: string, isComplete: boolean = false) {
        this.value = value;
        this.isComplete = isComplete;
    }
}

interface ItemListProps {
    item: ListRenderItemInfo<Item>;
    updateItem: (itemId: number, item: Item) => void;
    deleteItem: (itemId: number) => void;
}

export function ItemList(props: ItemListProps): JSX.Element {

    let itemValue: Item = props.item.item;
    let itemIndex: number = props.item.index;

    // Completed items have their names crossed out
    let dynamicTextStyles: {} = {
        textDecorationLine: itemValue.isComplete ? "line-through" : "none",
        color: itemValue.isComplete ? "#ccc" : "#000"
    };

    return (
        <TouchableWithoutFeedback
            onPress={() => {
                itemValue.isComplete = !itemValue.isComplete;
                props.updateItem(itemIndex, itemValue);
            }}>
            <View style={styles.listCell}>
                <Text numberOfLines={1} style={[styles.text, dynamicTextStyles, {flex: 1}]}>{itemValue.value}</Text>

                <View style={{flexDirection: "row", alignItems: "center", paddingLeft: 20}}>
                    <Button title="Update"/>
                    <View style={{width: 10}}/>
                    <Button onPress={() => { props.deleteItem(itemIndex) }} title="Delete"/>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}
