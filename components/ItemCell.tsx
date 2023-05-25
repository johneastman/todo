import { Text, StyleSheet, View, Pressable } from "react-native";
import { Item } from "../data/Item";
import CollectionCellActions from "./CollectionCellActions";

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
        <Pressable
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

                <CollectionCellActions
                    updateAction={() => {
                        openUpdateItemModal(index, item);
                    }}
                    deleteAction={() => {
                        deleteItem(index);
                    }}
                />
            </View>
        </Pressable>
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
