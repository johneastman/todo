import { View, StyleSheet, Button } from "react-native";
import Header from "./Header";
import {
    LIGHT_BLUE,
    getCellBeingEdited,
    getNumberOfSelectedCells,
} from "../utils";
import { CollectionViewCell, CollectionViewCellType } from "../types";
import { useContext } from "react";
import { AppContext } from "../contexts/app.context";
import { UpdateModalVisible } from "../data/reducers/app.reducer";

type CollectionViewHeaderProps = {
    title: string;
    cells: CollectionViewCell[];
    collectionType: CollectionViewCellType;
};

export default function CollectionViewHeader(
    props: CollectionViewHeaderProps
): JSX.Element {
    const { title, cells, collectionType } = props;

    const {
        dispatch,
        data: {
            accountState: { username },
        },
    } = useContext(AppContext);

    const openModal = () => {
        const itemIndex: number =
            getNumberOfSelectedCells(cells) === 1
                ? getCellBeingEdited(cells)
                : -1;

        dispatch(new UpdateModalVisible(collectionType, true, itemIndex));
    };

    return (
        <View style={styles.menu}>
            <View style={styles.contentWrapper}>
                <View>
                    {username !== undefined && (
                        <Header text={username} style={styles.username} />
                    )}
                    <Header text={title} />
                </View>
                <View style={styles.leftWrapper}>
                    <Button
                        title={`${
                            getNumberOfSelectedCells(cells) === 1
                                ? "Edit"
                                : "Add"
                        } ${collectionType}`}
                        onPress={openModal}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    menu: {
        flexDirection: "row",
        paddingVertical: 24,
        paddingHorizontal: 20,
        backgroundColor: LIGHT_BLUE,
        alignItems: "center",
        gap: 10,
    },
    contentWrapper: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    username: { fontWeight: "bold" },
    leftWrapper: {
        flex: 1,
        flexDirection: "row",
        gap: 10,
        justifyContent: "flex-end",
    },
});
