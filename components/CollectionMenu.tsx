import { View, Text, StyleSheet } from "react-native";

interface ItemsMenuProps {
    headerString: string;

    left?: React.ReactNode;
    right?: React.ReactNode;

    children?: React.ReactNode;
}

export default function CollectionMenu(props: ItemsMenuProps): JSX.Element {
    const { headerString, left, right, children } = props;

    return (
        <View style={styles.menu}>
            <Text style={{ fontSize: 20 }}>{headerString}</Text>

            <View
                style={{ flexDirection: "row", gap: 10, alignItems: "center" }}
            >
                <View
                    style={{
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <View>{left}</View>
                    <View
                        style={{
                            flex: 1,
                            flexDirection: "row",
                            gap: 10,
                            justifyContent: "flex-end",
                        }}
                    >
                        {right}
                    </View>
                </View>
            </View>
            <View>{children}</View>
        </View>
    );
}

const styles = StyleSheet.create({
    menu: {
        paddingVertical: 24,
        paddingHorizontal: 20,
        backgroundColor: "lightblue",
        alignItems: "center",
        gap: 10,
    },
});
