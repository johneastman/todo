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
};

export default function CustomFlatList<T>(
    props: CustomFlatListProps<T>
): JSX.Element {
    const { data, renderElement, contentContainerStyle } = props;

    const renderItem = (params: ListRenderItemInfo<T>): JSX.Element => {
        const { item, index } = params;
        return renderElement(item, index);
    };

    return (
        <View style={{ width: "100%" }}>
            <FlatList
                data={data}
                renderItem={renderItem}
                contentContainerStyle={contentContainerStyle}
            />
        </View>
    );
}
