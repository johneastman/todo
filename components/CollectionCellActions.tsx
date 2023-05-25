import { View, Button, StyleSheet } from "react-native";

interface CollectionCellActionsProps {
    updateAction: () => void;
    deleteAction: () => void;
}

export default function CollectionCellActions(
    props: CollectionCellActionsProps
): JSX.Element {
    const { updateAction, deleteAction } = props;

    return (
        <View style={styles.container}>
            <Button title="Update" onPress={updateAction} />
            <Button title="Delete" color="red" onPress={deleteAction} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingLeft: 20,
        gap: 5,
    },
});
