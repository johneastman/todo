import { View, Button, StyleSheet } from "react-native";
import CustomCheckBox from "./CustomCheckBox";
import Header from "./Header";
import { LIGHT_BLUE, getSelectedCells, listsCountDisplay } from "../utils";
import { ListViewCellItem } from "../data/data";
import { ListViewCellItemType } from "../types";

interface CollectionViewHeaderProps {
    title?: string;

    isAllSelected: boolean;
    onChecked: (isChecked: boolean) => void;

    cellsType: ListViewCellItemType;
    cells: ListViewCellItem[];
    openListModal: () => void;
}

export default function CollectionViewHeader(
    props: CollectionViewHeaderProps
): JSX.Element {
    const { title, isAllSelected, onChecked, cellsType, cells, openListModal } =
        props;

    const isEditButtonVisible = (): boolean => {
        const { cells: selectedCells, areAnySelected } =
            getSelectedCells(cells);
        return areAnySelected && selectedCells.length === 1;
    };

    const getHeaderText = (): string => {
        if (cellsType === "List") {
            return listsCountDisplay(cells.length);
        }

        /**
         * TODO: identify how to generate the header string for items.
         *
         * Since the items/lists are now being passed to this component,
         * I'd prefer to generate the header here instead of passing it
         * as a prop.
         *
         * Having the title be option does make sense from a design
         * standpoint because the user may not want to display a title.
         *
         * However, Getting the header text for items requires knowing
         * the type of list the items are in. I could pass that value
         * as a prop to this component, but that wouldn't make any sense
         * for the list of lists.
         */
        throw Error(`Unsupported collection type: ${cellsType}`);
    };

    return (
        <View style={styles.menu}>
            <Header text={title ?? getHeaderText()} />
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
                            isChecked={isAllSelected}
                            onChecked={onChecked}
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
                            {isEditButtonVisible() && (
                                <Button
                                    title={`Edit ${cellsType}`}
                                    onPress={openListModal}
                                />
                            )}

                            <Button
                                title={`Add ${cellsType}`}
                                onPress={openListModal}
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
