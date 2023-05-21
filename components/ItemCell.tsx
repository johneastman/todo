import { Text, StyleSheet, View, Button, TouchableOpacity } from "react-native";
import { Item } from "../data/Item";

interface ItemListProps {
    item: Item;
    index: number;
    drag: () => void;
    isActive: boolean;
    updateItem: (itemId: number, item: Item) => void;
    deleteItem: (itemId: number) => void;
    openUpdateItemModal: (index: number, item: Item) => void;
}

export default function ItemCell(props: ItemListProps): JSX.Element {
    const {
        item,
        index,
        drag,
        isActive,
        updateItem,
        deleteItem,
        openUpdateItemModal,
    } = props;

    // Completed items have their names crossed out
    let dynamicTextStyles: {} = {
        flex: 1, // ensure text doesn't push buttons off screen
        textDecorationLine: item.isComplete ? "line-through" : "none",
        color: item.isComplete ? "#ccc" : "#000",
    };

    return (
        <TouchableOpacity
            testID="itemCell-complete-toggle"
            onLongPress={drag}
            disabled={isActive}
            onPress={() => {
                let newItem: Item = new Item(
                    item.value,
                    item.quantity,
                    !item.isComplete
                );
                updateItem(index, newItem);
            }}
        >
            <View
                style={[
                    styles.listCell,
                    { backgroundColor: props.isActive ? "lightblue" : "white" },
                ]}
            >
                <View style={styles.listCellActions}>
                    <Text style={[styles.text, dynamicTextStyles]}>
                        {item.value}
                    </Text>
                    <Text style={[{ fontSize: 15 }, dynamicTextStyles]}>
                        Quantity: {item.quantity}
                    </Text>
                </View>

                <View style={{ paddingLeft: 20 }}>
                    <Button
                        title="Update"
                        onPress={() => {
                            openUpdateItemModal(index, item);
                        }}
                    />
                    <View style={{ height: 5 }} />
                    <Button
                        color="red"
                        onPress={() => {
                            deleteItem(index);
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
    listCellActions: {
        flex: 1,
        flexDirection: "column",
    },
});
