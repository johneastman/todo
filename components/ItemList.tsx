import {
    ListRenderItemInfo,
    Text,
    StyleSheet,
    View,
    Button,
    TouchableWithoutFeedback,
    TouchableOpacity,
} from "react-native";

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

export class Item {
    value: string;
    isComplete: boolean;
    constructor(value: string, isComplete: boolean = false) {
        this.value = value;
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

export function ItemList(props: ItemListProps): JSX.Element {
    let itemValue: Item = props.item;
    let itemIndex: number = props.index;

    // Completed items have their names crossed out
    let dynamicTextStyles: {} = {
        flex: 1, // ensure text doesn't push buttons off screen
        textDecorationLine: itemValue.isComplete ? "line-through" : "none",
        color: itemValue.isComplete ? "#ccc" : "#000",
    };

    return (
        <TouchableOpacity
            onLongPress={props.drag}
            disabled={props.isActive}
            onPress={() => {
                itemValue.isComplete = !itemValue.isComplete;
                props.updateItem(itemIndex, itemValue);
            }}
        >
            <View
                style={[
                    styles.listCell,
                    { backgroundColor: props.isActive ? "red" : "green" },
                ]}
            >
                <Text style={[styles.text, dynamicTextStyles]}>
                    {itemValue.value}
                </Text>

                <View style={{ paddingLeft: 20 }}>
                    <Button
                        title="Update"
                        onPress={() => {
                            props.openUpdateItemModal(itemIndex, itemValue);
                        }}
                    />
                    <View style={{ height: 5 }} />
                    <Button
                        color="red"
                        onPress={() => {
                            props.deleteItem(itemIndex);
                        }}
                        title="Delete"
                    />
                </View>
            </View>
        </TouchableOpacity>
    );
}
