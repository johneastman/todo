import { StyleProp, View, ViewStyle } from "react-native";

type CustomFlatListProps<T> = {
    data: T[];
    renderElement: (item: T, index: number) => JSX.Element;
    contentContainerStyle?: StyleProp<ViewStyle>;
};

export default function CustomFlatList<T>(
    props: CustomFlatListProps<T>
): JSX.Element {
    const { data, renderElement, contentContainerStyle } = props;

    /**
     * I changed to `map` because FlatList has issues when displayed in a ScrollView. The following
     * error occurs when FlatList is used in a ScrollView:
     *     VirtualizedLists should never be nested inside plain ScrollViews with the same orientation
     *     because it can break windowing and other functionality - use another VirtualizedList-backed
     *     container instead.
     */
    return (
        <View style={contentContainerStyle}>
            {data.map((item, index) => (
                <View key={index}>{renderElement(item, index)}</View>
            ))}
        </View>
    );
}
