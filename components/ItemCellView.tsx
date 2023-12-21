import { View, Text, Button, Pressable } from "react-native";

import { SettingsContext } from "../types";
import { Item, List } from "../data/data";
import { STYLES, getDeveloperModeListCellStyles } from "../utils";
import DeveloperModeListCellView from "./DeveloperModeListCellView";
import { useContext } from "react";
import CustomCheckBox from "./CustomCheckBox";
import {
    RenderItemParams,
    ScaleDecorator,
} from "react-native-draggable-flatlist";

interface ItemCellViewProps {
    list: List;
    updateItems: (index: number, isSelected: boolean) => void;
    openAddItemModal: (index: number) => void;

    renderParams: RenderItemParams<Item>;
    onPress: (item: Item, index: number) => void;
    testID?: string;
}

export default function ItemCellView(props: ItemCellViewProps): JSX.Element {
    const {
        list,
        updateItems,
        openAddItemModal,
        renderParams,
        onPress,
        testID,
    } = props;

    const { item, getIndex, drag, isActive } = renderParams;
    const index: number = getIndex() ?? -1;

    const settingsContext = useContext(SettingsContext);

    // Completed items have their names crossed out
    let dynamicTextStyles: {} = {
        flex: 1, // ensure text doesn't push buttons off screen
        textDecorationLine: item.isComplete ? "line-through" : "none",
        color: item.isComplete ? "#ccc" : "#000",
        verticalAlign: list.listType === "Shopping" ? "top" : "middle",
    };

    const onPressLocal = () => {
        /**
         * I want to disable the on-press event when the item is a section, but doing that in the "disabled" prop of
         * a Pressable component also disables the long press, which is how items are moved. To get around this, only
         * perform the on-press event when the item is not a Section.
         */
        if (item.itemType !== "Section") onPress(item, index);
    };

    return (
        <ScaleDecorator>
            <Pressable
                testID={testID}
                disabled={isActive}
                onLongPress={drag}
                onPress={onPressLocal}
                style={[
                    getDeveloperModeListCellStyles(isActive),
                    {
                        backgroundColor:
                            item.itemType === "Section" ? "lightgrey" : "white",
                    },
                ]}
            >
                <View style={STYLES.listCellView}>
                    <View style={STYLES.listCellTextDisplay}>
                        <Text
                            testID={`item-cell-name-${index}`}
                            style={[STYLES.listCellNameText, dynamicTextStyles]}
                        >
                            {list.listType === "Ordered To-Do"
                                ? `${index + 1}. ${item.name}`
                                : item.name}
                        </Text>
                        {list.listType === "Shopping" &&
                            item.itemType === "Item" && (
                                <Text
                                    style={[
                                        { fontSize: 15 },
                                        dynamicTextStyles,
                                    ]}
                                >
                                    Quantity: {item.quantity}
                                </Text>
                            )}
                    </View>

                    <View style={[STYLES.listCellView, { gap: 10 }]}>
                        {item.itemType === "Section" && (
                            <Button
                                title="Add Item"
                                onPress={() => openAddItemModal(-1)}
                                testID="section-add-item"
                            />
                        )}

                        <CustomCheckBox
                            testID={`edit-item-checkbox-${index}`}
                            isChecked={item.isSelected}
                            onChecked={(isChecked: boolean) =>
                                updateItems(index, isChecked)
                            }
                        />
                    </View>
                </View>
                {settingsContext.isDeveloperModeEnabled && (
                    <DeveloperModeListCellView>
                        <Text>List ID: {list.id}</Text>
                        <Text>Index: {index}</Text>
                        <Text>
                            Is Complete: {item.isComplete ? "True" : "False"}
                        </Text>
                    </DeveloperModeListCellView>
                )}
            </Pressable>
        </ScaleDecorator>
    );
}
