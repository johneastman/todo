import { View, Text } from "react-native";

import { ListCellContext, SettingsContext } from "../types";
import { List } from "../data/data";
import { STYLES } from "../utils";
import DeveloperModeListCellView from "./DeveloperModeListCellView";
import { useContext } from "react";
import CustomCheckBox from "./CustomCheckBox";

interface ItemCellViewProps {
    list: List;
    updateItems: (index: number, isSelected: boolean) => void;
}

export default function ItemCellView(props: ItemCellViewProps): JSX.Element {
    const { list, updateItems } = props;

    const settingsContext = useContext(SettingsContext);
    const itemContext = useContext(ListCellContext);
    const { item, index } = itemContext;

    // Completed items have their names crossed out
    let dynamicTextStyles: {} = {
        flex: 1, // ensure text doesn't push buttons off screen
        textDecorationLine: item.isComplete ? "line-through" : "none",
        color: item.isComplete ? "#ccc" : "#000",
        verticalAlign: list.type === "Shopping" ? "top" : "middle",
    };

    return (
        <>
            <View style={STYLES.listCellView}>
                <View style={STYLES.listCellTextDisplay}>
                    <Text
                        testID={`item-cell-name-${index}`}
                        style={[STYLES.listCellNameText, dynamicTextStyles]}
                    >
                        {item.value}
                    </Text>
                    {list.type === "Shopping" ? (
                        <Text style={[{ fontSize: 15 }, dynamicTextStyles]}>
                            Quantity: {item.quantity}
                        </Text>
                    ) : null}
                </View>

                <CustomCheckBox
                    testID={`edit-item-checkbox-${index}`}
                    isChecked={item.isSelected}
                    onChecked={(isChecked: boolean) =>
                        updateItems(index, isChecked)
                    }
                />
            </View>
            {settingsContext.isDeveloperModeEnabled ? (
                <DeveloperModeListCellView>
                    <Text>List ID: {list.id}</Text>
                    <Text>Index: {index}</Text>
                    <Text>
                        Is Complete: {item.isComplete ? "True" : "False"}
                    </Text>
                </DeveloperModeListCellView>
            ) : null}
        </>
    );
}
