import { ReactNode } from "react";
import { View, StyleSheet, ViewStyle, StyleProp } from "react-native";

type CellViewProps = {
    children: ReactNode;
    style?: StyleProp<ViewStyle>;
};

export default function CellView(props: CellViewProps): JSX.Element {
    const { children } = props;
    return <View style={styles.listCellView}>{children}</View>;
}

const styles = StyleSheet.create({
    listCellView: {
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
    },
});
