import { ListRenderItemInfo, Text, StyleSheet, TouchableOpacity, } from 'react-native';

const styles = StyleSheet.create({
    text: {
        fontSize: 40,
    },
    listCell: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#555',
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
        <TouchableOpacity style={styles.listCell} onPress={() => {
            itemValue.isComplete = !itemValue.isComplete;
            props.updateItem(itemIndex, itemValue);
        }}>
            <Text style={[styles.text, dynamicTextStyles]}>{itemValue.value}</Text>
        </TouchableOpacity>
    );
}
