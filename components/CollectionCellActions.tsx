import { View, Button, StyleSheet } from "react-native";

interface CollectionCellActionsProps {
    index: number;
    updateAction: () => void;
    deleteAction: () => void;
}

export default function CollectionCellActions(
    props: CollectionCellActionsProps
): JSX.Element {
    const { index, updateAction, deleteAction } = props;

    return (
        <View style={styles.container}>
            <Button
                testID={`list-cell-update-${index}`}
                title="Update"
                onPress={updateAction}
            />
            <Button
                testID={`list-cell-delete-${index}`}
                title="Delete"
                color="red"
                onPress={deleteAction}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingLeft: 20,
        gap: 5,
    },
});
