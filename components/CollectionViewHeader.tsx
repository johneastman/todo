import { View, StyleSheet, Button } from "react-native";
import CustomCheckBox from "./CustomCheckBox";
import Header from "./Header";
import {
    LIGHT_BLUE,
    getCellBeingEdited,
    getNumberOfSelectedCells,
    isAllSelected,
} from "../utils";
import { CollectionViewCell, CollectionViewCellType } from "../types";
import { useContext } from "react";
import { AppContext } from "../contexts/app.context";
import { UpdateModalVisible } from "../data/reducers/app.reducer";

type CollectionViewHeaderProps = {
    title: string;
    cells: CollectionViewCell[];
    collectionType: CollectionViewCellType;
    onSelectAll: (isChecked: boolean) => void;
};

export default function CollectionViewHeader(
    props: CollectionViewHeaderProps
): JSX.Element {
    const { title, cells, collectionType, onSelectAll } = props;

    const { dispatch } = useContext(AppContext);

    const openModal = () => {
        const itemIndex: number =
            getNumberOfSelectedCells(cells) === 1
                ? getCellBeingEdited(cells)
                : -1;

        dispatch(new UpdateModalVisible(collectionType, true, itemIndex));
    };

    return (
        <View style={styles.menu}>
            <Header text={title} />
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
                    <View>
                        <CustomCheckBox
                            label={"Select All"}
                            isChecked={isAllSelected(cells)}
                            onChecked={onSelectAll}
                        />
                    </View>
                    <View
                        style={{
                            flex: 1,
                            flexDirection: "row",
                            gap: 10,
                            justifyContent: "flex-end",
                        }}
                    >
                        <>
                            <Button
                                title={`${
                                    getNumberOfSelectedCells(cells) === 1
                                        ? "Edit"
                                        : "Add"
                                } ${collectionType}`}
                                onPress={openModal}
                            />
                        </>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    menu: {
        paddingVertical: 24,
        paddingHorizontal: 20,
        backgroundColor: LIGHT_BLUE,
        alignItems: "center",
        gap: 10,
    },
});
