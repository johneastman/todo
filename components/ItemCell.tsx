import { Text, StyleSheet, View, Button, TouchableOpacity } from "react-native";

export class Item {
    value: string;
    quantity: number;
    isComplete: boolean;
    constructor(value: string, quantity: number, isComplete: boolean = false) {
        this.value = value;
        this.quantity = quantity;
        this.isComplete = isComplete;
    }
}

interface ItemListProps {
    item: Item;
    index: number;
    drag: () => void;
    isActive: boolean;
    updateItem: (itemId: number, item: Item) => void;
    deleteItem: (itemId: number) => void;
    openUpdateItemModal: (index: number, item: Item) => void;
}

export function ItemCell(props: ItemListProps): JSX.Element {
    const { item, index } = props;

    // Completed items have their names crossed out
    let dynamicTextStyles: {} = {
        flex: 1, // ensure text doesn't push buttons off screen
        textDecorationLine: item.isComplete ? "line-through" : "none",
        color: item.isComplete ? "#ccc" : "#000",
    };

    return (
        <TouchableOpacity
            onLongPress={props.drag}
            disabled={props.isActive}
            onPress={() => {
                item.isComplete = !item.isComplete;
                props.updateItem(index, item);
            }}
        >
            <View
                style={[
                    styles.listCell,
                    { backgroundColor: props.isActive ? "lightblue" : "white" },
                ]}
            >
                <View style={{ flexDirection: "column" }}>
                    <Text style={[styles.text, dynamicTextStyles]}>
                        {item.value}
                    </Text>
                    <Text style={{ fontSize: 15 }}>
                        Quantity: {item.quantity}
                    </Text>
                </View>

                <View style={{ paddingLeft: 20 }}>
                    <Button
                        title="Update"
                        onPress={() => {
                            props.openUpdateItemModal(index, item);
                        }}
                    />
                    <View style={{ height: 5 }} />
                    <Button
                        color="red"
                        onPress={() => {
                            props.deleteItem(index);
                        }}
                        title="Delete"
                    />
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    text: {
        fontSize: 30,
        alignItems: "center",
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
