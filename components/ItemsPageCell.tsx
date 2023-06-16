import {
    RenderItemParams,
    ScaleDecorator,
} from "react-native-draggable-flatlist";
import { Pressable, StyleSheet, View, Text } from "react-native";

import { Position } from "../types";
import CollectionCellActions from "./CollectionCellActions";
import { Item } from "../data/Item";

interface ItemsPageCellProps {
    renderItemParams: RenderItemParams<Item>;
    updateItem: (oldPos: number, newPos: Position, item: Item) => void;
    deleteItem: (index: number) => void;
    openUpdateItemModal: (index: number, item: Item) => void;
}

export default function ItemsPageCell(props: ItemsPageCellProps): JSX.Element {
    const { renderItemParams, updateItem, deleteItem, openUpdateItemModal } =
        props;

    const { item, getIndex, drag, isActive } = renderItemParams;

    let index: number = getIndex() ?? -1;

    // Completed items have their names crossed out
    let dynamicTextStyles: {} = {
        flex: 1, // ensure text doesn't push buttons off screen
        textDecorationLine: item.isComplete ? "line-through" : "none",
        color: item.isComplete ? "#ccc" : "#000",
    };

    return (
        <ScaleDecorator>
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
                    updateItem(index, "current", newItem);
                }}
            >
                <View
                    style={[
                        styles.listCell,
                        {
                            backgroundColor: isActive ? "lightblue" : "white",
                        },
                    ]}
                >
                    <View style={styles.listCellDisplay}>
                        <Text
                            testID={`item-cell-name-${index}`}
                            style={[styles.text, dynamicTextStyles]}
                        >
                            {item.value}
                        </Text>
                        <Text style={[{ fontSize: 15 }, dynamicTextStyles]}>
                            Quantity: {item.quantity}
                        </Text>
                    </View>

                    <CollectionCellActions
                        index={index}
                        updateAction={() => {
                            openUpdateItemModal(index, item);
                        }}
                        deleteAction={() => {
                            deleteItem(index);
                        }}
                    />
                </View>
            </Pressable>
        </ScaleDecorator>
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
    listCellDisplay: {
        flex: 1,
        flexDirection: "column",
    },
});
