import {
    RenderItemParams,
    ScaleDecorator,
} from "react-native-draggable-flatlist";
import { Pressable, View, Text } from "react-native";

import { ListCellContext, Position, SettingsContext } from "../types";
import { Item, List } from "../data/data";
import { STYLES, getDeveloperModeListCellStyles } from "../utils";
import DeveloperModeListCellView from "./DeveloperModeListCellView";
import { useContext } from "react";
import CustomCheckBox from "./CustomCheckBox";

interface ItemCellViewProps {
    list: List;
    updateItemBeingEdited: (index: number, addToList: boolean) => void;
    isItemBeingEdited: (index: number) => boolean;
}

export default function ItemCellView(props: ItemCellViewProps): JSX.Element {
    const { list, updateItemBeingEdited, isItemBeingEdited } = props;

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
                    isChecked={isItemBeingEdited(index)}
                    onChecked={(isChecked: boolean) =>
                        updateItemBeingEdited(index, isChecked)
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
