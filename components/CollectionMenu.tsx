import { View, Text, StyleSheet, StatusBar } from "react-native";

interface ItemsMenuProps {
    headerString: string;

    children?: React.ReactNode;
}

export default function CollectionMenu(props: ItemsMenuProps): JSX.Element {
    const { headerString, children } = props;

    return (
        <View style={styles.menu}>
            <Text style={{ fontSize: 20 }}>{headerString}</Text>

            <View
                style={{ flexDirection: "row", gap: 10, alignItems: "center" }}
            >
                {children}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    menu: {
        paddingVertical: StatusBar.currentHeight,
        backgroundColor: "lightblue",
        alignItems: "center",
        gap: 10,
    },
});
