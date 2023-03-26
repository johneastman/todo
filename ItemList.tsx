import { ListRenderItemInfo, Text, StyleSheet, TouchableOpacity, } from 'react-native';

const styles = StyleSheet.create({
    text: {
        fontSize: 40,
        textAlign: "center",
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

    let style: {} = {
        backgroundColor: itemValue.isComplete ? "#6e3b6e" : "#f9c2ff",
        padding: 20
    };

    return (
        <TouchableOpacity onPress={() => {
            itemValue.isComplete = !itemValue.isComplete;
            props.updateItem(itemIndex, itemValue);
        }} style={style}>
            <Text style={styles.text}>{itemValue.value}</Text>
        </TouchableOpacity>
    );
}
