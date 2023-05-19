import DraggableFlatList, {
    DragEndParams,
    RenderItemParams,
} from "react-native-draggable-flatlist";
import { View, Text, StyleSheet } from "react-native";
import { Item } from "./ItemCell";

interface ItemsList {
    items: Item[];
    renderItem: (params: RenderItemParams<Item>) => JSX.Element;
    drag: (params: DragEndParams<Item>) => void;
}

export default function ItemsList(props: ItemsList): JSX.Element {
    const { items, renderItem, drag } = props;

    return (
        <>
            {items.length === 0 ? (
                <View
                    style={{
                        alignItems: "center",
                        justifyContent: "center",
                        flex: 1,
                    }}
                >
                    <Text style={styles.text}>No Items</Text>
                </View>
            ) : (
                <View style={{ flex: 1 }}>
                    <DraggableFlatList
                        data={items}
                        onDragEnd={drag}
                        keyExtractor={(_, index) => `key-${index}`}
                        renderItem={renderItem}
                    />
                </View>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    text: {
        fontSize: 40,
    },
});
