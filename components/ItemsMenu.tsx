import { View, Button, Text, StyleSheet, StatusBar } from "react-native";

interface ItemsMenuProps {
    listName: string;
    quantity: number;
    displayAddItemModal: () => void;
}

export default function ItemsMenu(props: ItemsMenuProps): JSX.Element {
    const { listName, quantity, displayAddItemModal } = props;

    let quantityString: string = `${quantity} ${
        quantity === 1 ? "Item" : "Items"
    }`;

    return (
        <View style={styles.menu}>
            <Text style={styles.text}>{listName}</Text>
            <Text style={{ fontSize: 20 }}>{quantityString}</Text>

            <View
                style={{ flexDirection: "row", gap: 10, alignItems: "center" }}
            >
                <Button title="Add Item" onPress={displayAddItemModal} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    text: {
        fontSize: 30,
    },
    menu: {
        marginTop: StatusBar.currentHeight,
        paddingVertical: StatusBar.currentHeight,
        backgroundColor: "lightblue",
        alignItems: "center",
        gap: 10,
    },
});
