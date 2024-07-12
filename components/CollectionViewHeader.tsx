import { View, StyleSheet, Button } from "react-native";
import Header from "./Header";
import {
    LIGHT_BLUE,
    getCellBeingEdited,
    getNumberOfSelectedCells,
} from "../utils";
import { CollectionViewCell, CollectionViewCellType } from "../types";
import { useContext } from "react";
import { ListsStateContext } from "../contexts/listsState.context";
import {
    AddUpdateModalVisible,
    UpdateCurrentIndex,
} from "../data/reducers/listsState.reducer";
import { AccountContext } from "../contexts/account.context";

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
        account: { username },
    } = useContext(AccountContext);

    const listsStateContext = useContext(ListsStateContext);
    const { listsStateDispatch } = listsStateContext;

    const openModal = () => {
        const itemIndex: number =
            getNumberOfSelectedCells(cells) === 1
                ? getCellBeingEdited(cells)
                : -1;

        listsStateDispatch(new AddUpdateModalVisible(true, collectionType));
        listsStateDispatch(new UpdateCurrentIndex(itemIndex));
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
