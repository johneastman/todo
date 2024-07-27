import {
    FlatList,
    ListRenderItemInfo,
    StyleProp,
    View,
    ViewStyle,
} from "react-native";

type CustomFlatListProps<T> = {
    data: T[];
    renderElement: (item: T, index: number) => JSX.Element;
    contentContainerStyle?: StyleProp<ViewStyle>;
    scrollEnabled?: boolean;
};

export default function CustomFlatList<T>(
    props: CustomFlatListProps<T>
): JSX.Element {
    const { data, renderElement, contentContainerStyle, scrollEnabled } = props;

    const renderItem = (params: ListRenderItemInfo<T>): JSX.Element => {
        const { item, index } = params;
        return renderElement(item, index);
    };

    /**
     * The following error occur when FlatList is used in a ScrollView:
     *     VirtualizedLists should never be nested inside plain ScrollViews with the same orientation
     *     because it can break windowing and other functionality - use another VirtualizedList-backed
     *     container instead.
     *
     * To resolve this error, I added a flag to disable scrolling. When the flag is not provided (i.e.
     * undefined or null), the FlatList will not be scrollable.
     */
    return (
        <View style={{ width: "100%" }}>
            <FlatList
                data={data}
                renderItem={renderItem}
                contentContainerStyle={contentContainerStyle}
                scrollEnabled={scrollEnabled ?? false}
            />
        </View>
    );
}
