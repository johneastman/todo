import { View, Button, StyleSheet } from "react-native";
import CustomCheckBox from "./CustomCheckBox";
import Header from "./Header";
import { LIGHT_BLUE, listsCountDisplay, isAllSelected } from "../utils";
import { ListViewCellItem } from "../data/data";
import { CollectionViewCellType } from "../types";

interface CollectionViewHeaderProps {
    title?: string;

    onChecked: (isChecked: boolean) => void;

    cellsType: CollectionViewCellType;
    cells: ListViewCellItem[];
    openListModal: () => void;
}

export default function CollectionViewHeader(
    props: CollectionViewHeaderProps
): JSX.Element {
    const { title, onChecked, cellsType, cells, openListModal } = props;

    const isSelectAllChecked: boolean = isAllSelected(cells);

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
                            isChecked={isSelectAllChecked}
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
                        <Button
                            title={`Add ${cellsType}`}
                            onPress={openListModal}
                        />
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
