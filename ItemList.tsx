import { ListRenderItemInfo, Text, StyleSheet, TouchableOpacity, } from 'react-native';

const styles = StyleSheet.create({
    text: {
        fontSize: 40,
        textAlign: "center",
    }
});

export class Item {
    value: string;
    constructor(value: string) {
        this.value = value;
    }
}

interface ItemListProps {
    item: ListRenderItemInfo<Item>;
    selectedItem: number;
    setSelectedItem: (item: number) => void;
}

export function ItemList(props: ItemListProps): JSX.Element {

    let itemValue: Item = props.item.item;
    let itemIndex: number = props.item.index;

    let style: {} = {backgroundColor: props.selectedItem === itemIndex ? "#6e3b6e" : "#f9c2ff", padding: 20};

    return (
        <TouchableOpacity onPress={() => props.setSelectedItem(itemIndex)} style={style}>
            <Text style={styles.text}>{itemValue.value}</Text>
        </TouchableOpacity>
    );
}
