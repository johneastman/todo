import DraggableFlatList, {
    DragEndParams,
    RenderItemParams,
} from "react-native-draggable-flatlist";
import { View, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

interface CustomListProps<T> {
    items: T[];
    renderItem: (params: RenderItemParams<T>) => JSX.Element;
    drag: (params: DragEndParams<T>) => void;
}

export default function CustomList<T>(props: CustomListProps<T>): JSX.Element {
    const { items, renderItem, drag } = props;

    return (
        <View style={{ flex: 1 }}>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <DraggableFlatList
                    data={items}
                    onDragEnd={drag}
                    keyExtractor={(_, index) => `item-${index}`}
                    renderItem={renderItem}
                />
            </GestureHandlerRootView>
        </View>
    );
}
