import { ReactNode } from "react";
import { View, Text, StyleSheet, TextStyle, StyleProp } from "react-native";

type CellViewProps = {
    primaryText: string;
    primaryTextStyle?: StyleProp<TextStyle>;

    secondaryText?: string;
    secondaryTextStyle?: StyleProp<TextStyle>;

    testId?: string;
    children?: ReactNode;
};

export default function CellView(props: CellViewProps): JSX.Element {
    const {
        primaryText,
        primaryTextStyle,
        secondaryText,
        secondaryTextStyle,
        testId,
        children,
    } = props;

    return (
        <View style={styles.listCellView}>
            <View style={styles.listCellTextDisplay}>
                <Text
                    testID={testId}
                    style={[styles.listCellNameText, primaryTextStyle]}
                >
                    {primaryText}
                </Text>
                {secondaryText && (
                    <Text style={[{ fontSize: 15 }, secondaryTextStyle]}>
                        {secondaryText}
                    </Text>
                )}
            </View>
            <View style={styles.childrenWrapper}>{children}</View>
        </View>
    );
}

const styles = StyleSheet.create({
    listCellTextDisplay: {
        flex: 1,
        flexDirection: "column",
    },
    listCellNameText: {
        fontSize: 30,
    },
    listCellView: {
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
    },
    childrenWrapper: {
        gap: 10,
        flexDirection: "row",
        alignItems: "center",
    },
});
